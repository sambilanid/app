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
import questFood from '../assets/quest-food.png';

interface CreateQuestPageProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const CreateQuestPage: React.FC<CreateQuestPageProps> = ({ onBack, onSuccess }) => {
  const { state, addQuest, addNotification } = useApp();
  const { showDialog } = useDialog();
  
  const [formData, setFormData] = useState({
    title: '',
    category: state.categories[0],
    location: '',
    budget: '',
    deadline: '',
    description: ''
  });

  const handlePublish = () => {
    if (!formData.title || !formData.budget || !formData.description) {
      showDialog({
        title: 'Form Belum Lengkap',
        message: 'Mohon lengkapi judul, budget, dan deskripsi quest sebelum mempublikasikan.',
        confirmLabel: 'Siap!'
      });
      return;
    }

    const newQuest = {
      id: `q${Date.now()}`,
      title: formData.title,
      category: formData.category,
      price: `Rp${Number(formData.budget).toLocaleString('id-ID')}`,
      distance: '0.0 km', // Default untuk quest baru
      image: questFood, // Default image
      description: formData.description,
      status: 'available' as const,
      location: formData.location,
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
        <div className="bg-white p-5 border-t border-gray-100">
          <Button fullWidth size="lg" onClick={handlePublish}>
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
            <label className="text-[#3e4943] text-sm font-bold">Judul Quest</label>
            <input 
              type="text" 
              placeholder="Contoh: Jastip Seblak Rafael"
              className="bg-white border border-[#bdcac1] rounded-xl p-4 text-sm focus:outline-none focus:border-primary transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#3e4943] text-sm font-bold">Kategori</label>
            <select 
              className="bg-white border border-[#bdcac1] rounded-xl p-4 text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {state.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#3e4943] text-sm font-bold">Lokasi</label>
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

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[#3e4943] text-sm font-bold">Budget</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">Rp</span>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full bg-white border border-[#bdcac1] rounded-xl p-4 pl-10 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#3e4943] text-sm font-bold">Deadline</label>
              <div className="relative">
                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                <input 
                  type="text" 
                  placeholder="Hari ini"
                  className="w-full bg-white border border-[#bdcac1] rounded-xl p-4 pl-12 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#3e4943] text-sm font-bold">Deskripsi Lengkap</label>
            <textarea 
              placeholder="Jelaskan detail apa yang harus dilakukan..."
              rows={4}
              className="bg-white border border-[#bdcac1] rounded-xl p-4 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CreateQuestPage;
