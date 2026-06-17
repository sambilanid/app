/**
 * Halaman pengunggahan bukti penyelesaian quest.
 * Digunakan saat: Adventurer telah menyelesaikan tugas dan perlu mengirimkan bukti foto atau catatan.
 */
import React, { useState } from 'react';
import { Camera, AlertCircle, Info, Send } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { useApp } from '../store/AppContext';
import { useDialog } from '../components/common/Dialog';

interface QuestEvidencePageProps {
  questId: string | null;
  onBack: () => void;
  onFinish: () => void;
}

const QuestEvidencePage: React.FC<QuestEvidencePageProps> = ({ questId, onBack, onFinish }) => {
  const { state, submitQuestEvidence } = useApp();
  const { showDialog } = useDialog();
  const [notes, setNotes] = useState('');
  const [evidenceImage, setEvidenceImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const quest = state.activeQuests.find(q => q.id === questId);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = () => {
    if (!questId) return;

    if (!evidenceImage) {
      showDialog({
        title: 'Bukti Belum Lengkap',
        message: 'Mohon lampirkan foto bukti kerja terlebih dahulu.',
        confirmLabel: 'OK',
        onConfirm: () => {}
      });
      return;
    }

    showDialog({
      title: 'Kirim Bukti Quest',
      message: 'Apakah kamu yakin bukti yang dilampirkan sudah benar? Kamu masih bisa mengubah bukti ini sebelum dikonfirmasi oleh pembuat quest.',
      confirmLabel: 'Ya, Kirim',
      cancelLabel: 'Batal',
      onConfirm: () => {
        submitQuestEvidence(questId, evidenceImage, notes);
        onFinish();
      }
    });
  };

  if (!quest) {
    return (
      <PageLayout
        header={<PageHeader title="Selesaikan Quest" onBack={onBack} />}
      >
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-text p-10 text-center">
          <p>Data quest tidak ditemukan atau quest sudah tidak aktif.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      header={
        <PageHeader 
          title="Selesaikan Quest" 
          onBack={onBack}
        />
      }
      footer={
        <div className="bg-white border-t border-[#dbe4ed] px-5 py-4 pb-8">
          <Button 
            onClick={handleFinish}
            fullWidth
            size="lg"
            className="rounded-2xl !font-bold flex items-center justify-center gap-2"
          >
            <Send size={18} />
            Kirim bukti & selesaikan
          </Button>
        </div>
      }
    >
      <div className="px-5 pt-6 pb-10 flex flex-col gap-6">
        {/* Quest Info Card */}
        <div className="bg-[#ecf5fe] border border-[#dbe4ed] rounded-2xl p-4 flex gap-4 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
          <div className="flex flex-col gap-1 pl-2">
            <h2 className="text-[#141d23] font-semibold text-sm">Quest: {quest.title}</h2>
            <span className="text-primary text-[10px] font-bold tracking-[0.6px] uppercase">DALAM PROSES PENGERJAAN</span>
          </div>
        </div>

        {/* Upload Section */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[#3e4943] text-xs font-bold tracking-[0.6px] uppercase">UPLOAD BUKTI KERJA</h3>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div 
            onClick={handleImageClick}
            className="bg-white border-2 border-[#bdcac1] border-dashed rounded-2xl py-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative min-h-[160px]"
          >
            {evidenceImage ? (
              <img src={evidenceImage} alt="Evidence preview" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Camera size={28} className="text-[#3e4943]" />
                </div>
                <p className="text-[#141d23] font-semibold text-sm">Foto dari kamera aplikasi</p>
                <p className="text-[#3e4943] text-xs opacity-60">(tidak bisa dari galeri)</p>
              </>
            )}
            {evidenceImage && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white font-bold text-sm">Ganti Foto</p>
              </div>
            )}
          </div>
          
          <div className="bg-[#dbe4ed]/30 border border-[#dbe4ed]/50 p-4 rounded-xl flex gap-3">
            <AlertCircle size={18} className="text-[#3e4943] flex-shrink-0 mt-0.5" />
            <p className="text-[#3e4943] text-[13px] leading-relaxed">
              Foto harus diambil langsung dari kamera aplikasi ini untuk mencegah bukti palsu. Pastikan barang & lokasi terlihat jelas.
            </p>
          </div>
        </div>

        {/* Notes Section */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[#3e4943] text-xs font-bold tracking-[0.6px] uppercase">CATATAN TAMBAHAN</h3>
          <textarea 
            placeholder="Tulis catatan penyelesaian..."
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-white border border-[#bdcac1] rounded-xl p-4 text-[15px] focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Reward Info */}
        <div className="bg-[#fff3e0]/30 border border-[#fff3e0] p-4 rounded-xl flex gap-4 items-center">
          <div className="bg-[#fff3e0] p-2 rounded-full">
            <Info size={20} className="text-orange-500" />
          </div>
          <div className="flex flex-col">
            <p className="text-[#141d23] text-sm font-semibold leading-tight">Reward akan cair setelah konfirmasi</p>
            <p className="text-[#3e4943] text-sm font-medium opacity-80">{quest.price}</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default QuestEvidencePage;
