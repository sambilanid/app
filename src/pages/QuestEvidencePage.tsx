/**
 * Halaman pengunggahan bukti penyelesaian quest.
 * Digunakan saat: Adventurer telah menyelesaikan tugas dan perlu mengirimkan bukti foto atau catatan.
 */
import React from 'react';
import { ShoppingBag, Camera, AlertCircle, Info, Send } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';

interface QuestEvidencePageProps {
  onBack: () => void;
  onFinish: () => void;
}

const QuestEvidencePage: React.FC<QuestEvidencePageProps> = ({ onBack, onFinish }) => {
  return (
    <PageLayout
      header={
        <PageHeader 
          title="Selesaikan Quest" 
          onBack={onBack}
          variant="primary"
        />
      }
    >
      <div className="px-[20px] pt-[24px] pb-[40px] flex flex-col gap-[24px]">
        {/* Quest Info Card */}
        <div className="bg-[#ecf5fe] border border-[#dbe4ed] rounded-[16px] p-[16px] flex gap-[16px] relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-primary" />
          <div className="bg-primary/10 p-3 rounded-[12px] h-fit">
            <ShoppingBag size={20} className="text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-[#141d23] font-semibold text-[14px]">Quest: Nitip beli galon</h2>
            <span className="text-primary text-[10px] font-bold tracking-[0.6px] uppercase">DALAM PROSES PENGERJAAN</span>
          </div>
        </div>

        {/* Upload Section */}
        <div className="flex flex-col gap-[12px]">
          <h3 className="text-[#3e4943] text-[12px] font-bold tracking-[0.6px] uppercase">UPLOAD BUKTI KERJA</h3>
          <div className="bg-white border-2 border-[#bdcac1] border-dashed rounded-[16px] py-[32px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-[56px] h-[56px] bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Camera size={28} className="text-[#3e4943]" />
            </div>
            <p className="text-[#141d23] font-semibold text-[14px]">Foto dari kamera aplikasi</p>
            <p className="text-[#3e4943] text-[12px] opacity-60">(tidak bisa dari galeri)</p>
          </div>
          
          <div className="bg-[#dbe4ed]/30 border border-[#dbe4ed]/50 p-4 rounded-[12px] flex gap-3">
            <AlertCircle size={18} className="text-[#3e4943] flex-shrink-0 mt-0.5" />
            <p className="text-[#3e4943] text-[13px] leading-relaxed">
              Foto harus diambil langsung dari kamera aplikasi ini untuk mencegah bukti palsu. Pastikan barang & lokasi terlihat jelas.
            </p>
          </div>
        </div>

        {/* Notes Section */}
        <div className="flex flex-col gap-[12px]">
          <h3 className="text-[#3e4943] text-[12px] font-bold tracking-[0.6px] uppercase">CATATAN TAMBAHAN</h3>
          <textarea 
            placeholder="Tulis catatan penyelesaian..."
            rows={4}
            className="bg-white border border-[#bdcac1] rounded-[12px] p-4 text-[15px] focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Reward Info */}
        <div className="bg-[#fff3e0]/30 border border-[#fff3e0] p-4 rounded-[12px] flex gap-4 items-center">
          <div className="bg-[#fff3e0] p-2 rounded-full">
            <Info size={20} className="text-orange-500" />
          </div>
          <div className="flex flex-col">
            <p className="text-[#141d23] text-[14px] font-semibold leading-tight">Reward akan cair setelah konfirmasi</p>
            <p className="text-[#3e4943] text-[14px] font-medium opacity-80">Rp 13.500 (dipotong biaya admin)</p>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={onFinish}
          className="w-full bg-primary text-white py-4 rounded-[16px] font-bold text-[16px] flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          <Send size={18} />
          Kirim bukti & selesaikan
        </button>
      </div>
    </PageLayout>
  );
};

export default QuestEvidencePage;
