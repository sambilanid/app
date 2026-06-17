/**
 * Halaman pembuatan quest baru.
 * Digunakan saat: Pengguna ingin mempublikasikan tugas atau permintaan baru ke platform.
 */
import React, { useState } from 'react';
import { Image as ImageIcon, MapPin, Clock } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { useApp } from '../store/AppContext';
import { useDialog } from '../components/common/Dialog';
import { DateTimePickerDialog } from '../components/common/DateTimePickerDialog';
import { categoryConfig } from '../utils/questUtils';
import questFood from '../assets/quest-food.png';

interface CreateQuestPageProps {
  onBack: () => void;
  onSuccess?: () => void;
  onGoToVerification: () => void;
  onGoToTopUp: () => void;
}

const CreateQuestPage: React.FC<CreateQuestPageProps> = ({ 
  onBack, 
  onSuccess, 
  onGoToVerification,
  onGoToTopUp 
}) => {
  const { state, addQuest, addNotification } = useApp();
  const { showDialog } = useDialog();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: state.categories[0],
    location: '',
    fromLocation: '',
    toLocation: '',
    budget: '',
    deadline: '',
    description: ''
  });

  const currentConfig = categoryConfig[formData.category] || categoryConfig['Lainnya'];

  const ADMIN_FEE = 3500;
  const BUDGET_LIMIT = 1000000;
  const budgetValue = Number(formData.budget) || 0;
  const totalCost = budgetValue + ADMIN_FEE;

  const isBudgetOverLimit = budgetValue > BUDGET_LIMIT;
  const isFieldsValid = 
    formData.title && 
    formData.budget && 
    budgetValue > 0 &&
    formData.description &&
    (!currentConfig.from || formData.fromLocation) &&
    (!currentConfig.to || formData.toLocation) &&
    (!currentConfig.location || formData.location);

  const isFormValid = isFieldsValid && !isBudgetOverLimit;

  const handlePublish = () => {
    if (!state.user?.isVerified) {
      showDialog({
        title: 'Akun Belum Terverifikasi',
        message: 'Maaf, Anda harus memverifikasi identitas terlebih dahulu sebelum dapat memposting quest baru untuk menjaga keamanan komunitas.',
        confirmLabel: 'Verifikasi Sekarang',
        cancelLabel: 'Nanti Saja',
        onConfirm: onGoToVerification
      });
      return;
    }

    if ((state.user?.balance || 0) < totalCost) {
      showDialog({
        title: 'Saldo Tidak Cukup',
        message: `Saldo Anda (Rp${state.user?.balance.toLocaleString('id-ID')}) tidak cukup untuk mempublish quest ini. Total dana yang dibutuhkan adalah Rp${totalCost.toLocaleString('id-ID')}.`,
        confirmLabel: 'Top Up Sekarang',
        cancelLabel: 'Nanti Saja',
        onConfirm: onGoToTopUp
      });
      return;
    }

    showDialog({
      title: 'Konfirmasi Publish Quest',
      message: `Apakah Anda yakin ingin mempublish quest ini? Dana sebesar Rp${totalCost.toLocaleString('id-ID')} akan dipotong dari saldo Anda dan ditahan oleh sistem.`,
      confirmLabel: 'Ya, Publish',
      cancelLabel: 'Batal',
      onConfirm: () => {
        const newQuest = {
          id: `q${Date.now()}`,
          title: formData.title,
          category: formData.category,
          price: `Rp${Number(formData.budget).toLocaleString('id-ID')}`,
          distance: '0.0 km', // Default untuk quest baru
          image: questFood, // Default image
          description: formData.description,
          status: 'available' as const,
          location: formData.location || formData.fromLocation || formData.toLocation,
          fromLocation: formData.fromLocation,
          toLocation: formData.toLocation,
          deadline: formData.deadline || 'Hari ini',
          createdAt: new Date().toISOString(),
          creatorId: state.currentUserId!,
          applicantIds: []
        };

        addQuest(newQuest);
        addNotification({
          type: 'system',
          title: 'Quest Berhasil Dibuat',
          message: `Quest "${formData.title}" Anda telah dipublikasikan dan dapat dilihat oleh Adventurer lain.`
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          onBack();
        }
      }
    });
  };

  return (
    <PageLayout
      header={
        <PageHeader 
          title="Buat Quest Baru" 
          onBack={onBack}
        />
      }
      footer={
        <div className="bg-white p-5 border-t border-gray-100 flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm px-1">
            <span className="text-[#3e4943] opacity-60">Total Dana Ditahan</span>
            <span className="text-[#141d23] font-bold">Rp{totalCost.toLocaleString('id-ID')}</span>
          </div>
          <Button 
            fullWidth 
            size="lg" 
            onClick={handlePublish}
            disabled={!isFormValid}
            className={!isFormValid ? 'opacity-50 grayscale cursor-not-allowed' : ''}
          >
            Publish Quest
          </Button>
        </div>
      }
    >
      <div className="px-5 pt-6 pb-24 flex flex-col gap-5">
        {/* Upload Image Section */}
        <div className="bg-white border-2 border-[#bdcac1] border-dashed rounded-2xl py-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <ImageIcon size={24} className="text-primary" />
          </div>
          <p className="text-[#141d23] font-bold text-sm">Tambah Foto Quest</p>
          <p className="text-[#3e4943] text-xs opacity-60">Opsional, tapi membantu adventurer</p>
        </div>

        {/* Form Sections */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[#3e4943] text-sm font-bold">Judul Quest <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="Contoh: Jastip Seblak Rafael"
              className="bg-white border border-[#bdcac1] rounded-xl p-4 text-sm focus:outline-none focus:border-primary transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#3e4943] text-sm font-bold">Kategori <span className="text-red-500">*</span></label>
            <select 
              className="bg-white border border-[#bdcac1] rounded-xl p-4 text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value, fromLocation: '', toLocation: '', location: '' })}
            >
              {state.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {currentConfig.from && (
            <div className="flex flex-col gap-2">
              <label className="text-[#3e4943] text-sm font-bold">{currentConfig.from} <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                <input 
                  type="text" 
                  placeholder="Pilih Lokasi"
                  className="w-full bg-white border border-[#bdcac1] rounded-xl p-4 pl-12 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.fromLocation}
                  onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                />
              </div>
            </div>
          )}

          {currentConfig.to && (
            <div className="flex flex-col gap-2">
              <label className="text-[#3e4943] text-sm font-bold">{currentConfig.to} <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                <input 
                  type="text" 
                  placeholder="Pilih Lokasi"
                  className="w-full bg-white border border-[#bdcac1] rounded-xl p-4 pl-12 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.toLocation}
                  onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                />
              </div>
            </div>
          )}

          {currentConfig.location && (
            <div className="flex flex-col gap-2">
              <label className="text-[#3e4943] text-sm font-bold">{currentConfig.location} <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                <input 
                  type="text" 
                  placeholder="Pilih Lokasi"
                  className="w-full bg-white border border-[#bdcac1] rounded-xl p-4 pl-12 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[#3e4943] text-sm font-bold">Budget <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">Rp</span>
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="0"
                  className="w-full bg-white border border-[#bdcac1] rounded-xl p-4 pl-10 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.budget}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, budget: value });
                  }}
                />
              </div>
              <p className={`text-[10px] ml-1 ${isBudgetOverLimit ? 'text-red-500 font-bold' : 'text-[#3e4943] opacity-60'}`}>
                {isBudgetOverLimit ? `Maksimal budget Rp${BUDGET_LIMIT.toLocaleString('id-ID')}` : `Maks. Rp${BUDGET_LIMIT.toLocaleString('id-ID')}`}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#3e4943] text-sm font-bold">Deadline <span className="text-red-500">*</span></label>
              <div className="relative" onClick={() => setIsDatePickerOpen(true)}>
                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                <input 
                  type="text" 
                  placeholder="Hari ini"
                  readOnly
                  className="w-full bg-white border border-[#bdcac1] rounded-xl p-4 pl-12 text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  value={formData.deadline}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#3e4943] text-sm font-bold">Deskripsi Lengkap <span className="text-red-500">*</span></label>
            <textarea 
              placeholder="Jelaskan detail apa yang harus dilakukan..."
              rows={4}
              className="bg-white border border-[#bdcac1] rounded-xl p-4 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Cost Breakdown Section */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col gap-3 my-2">
            <h3 className="text-[#3e4943] text-sm font-bold">Rincian Biaya</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#3e4943] opacity-60">Budget Quest</span>
              <span className="text-[#141d23] font-medium">Rp{budgetValue.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#3e4943] opacity-60">Biaya Admin</span>
              <span className="text-[#141d23] font-medium">Rp{ADMIN_FEE.toLocaleString('id-ID')}</span>
            </div>
            <div className="h-px bg-gray-200 my-1" />
            <div className="flex justify-between items-center">
              <span className="text-[#3e4943] font-bold text-sm">Total Dana Ditahan</span>
              <span className="text-primary font-bold">Rp{totalCost.toLocaleString('id-ID')}</span>
            </div>
            <p className="text-[10px] text-[#3e4943] opacity-50 mt-1">
              *Dana akan ditahan oleh sistem dan hanya akan dilepaskan ke Adventurer setelah quest dikonfirmasi selesai.
            </p>
          </div>
        </div>
      </div>

      <DateTimePickerDialog 
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSelect={(deadline) => setFormData({ ...formData, deadline })}
      />
    </PageLayout>
  );
};

export default CreateQuestPage;
