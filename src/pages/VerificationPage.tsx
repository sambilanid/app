/**
 * Halaman verifikasi identitas.
 * Digunakan saat: Pengguna ingin memverifikasi identitas dengan mengunggah foto selfie dengan KTP/KTM.
 */
import React, { useState } from 'react';
import { Camera, CheckCircle2, ShieldCheck, Info } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { useApp } from '../store/AppContext';
import { useDialog } from '../components/common/Dialog';

interface VerificationPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

const VerificationPage: React.FC<VerificationPageProps> = ({ onBack, onSuccess }) => {
  const { verifyAccount } = useApp();
  const { showDialog } = useDialog();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!photo) return;
    
    setIsSubmitting(true);
    // Simulasi proses verifikasi
    setTimeout(() => {
      verifyAccount();
      setIsSubmitting(false);
      
      showDialog({
        title: 'Verifikasi Berhasil',
        message: 'Selamat! Akun Anda telah berhasil diverifikasi. Sekarang Anda dapat memposting quest dan menikmati fitur lengkap Sambilan.',
        confirmLabel: 'Mantap',
        onConfirm: onSuccess
      });
    }, 1500);
  };

  return (
    <PageLayout
      header={<PageHeader title="Verifikasi Identitas" onBack={onBack} />}
      footer={
        <div className="bg-white p-5 border-t border-gray-100">
          <Button 
            fullWidth 
            size="lg" 
            onClick={handleSubmit} 
            disabled={!photo || isSubmitting}
            isLoading={isSubmitting}
          >
            Kirim untuk Verifikasi
          </Button>
        </div>
      }
    >
      <div className="px-5 pt-6 pb-24 flex flex-col gap-6">
        <div className="bg-[#e0e9f2] p-4 rounded-2xl flex gap-3">
          <Info size={20} className="text-primary shrink-0" />
          <p className="text-[#3e4943] text-xs leading-relaxed">
            Verifikasi diperlukan untuk menjamin keamanan transaksi di Sambilan. Data Anda akan disimpan dengan enkripsi standar industri.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-[#141d23] text-lg font-bold">Foto Selfie dengan KTP</h3>
          <p className="text-[#3e4943] text-sm leading-relaxed">
            Pastikan wajah dan data pada kartu identitas Anda terlihat jelas dan tidak tertutup jari atau bayangan.
          </p>

          <div 
            className={`aspect-[3/4] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all cursor-pointer ${
              photo ? 'border-primary' : 'border-[#bdcac1] bg-white'
            }`}
            onClick={handleTakePhoto}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            {photo ? (
              <img src={photo} alt="Selfie" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Camera size={32} className="text-primary" />
                </div>
                <p className="text-[#141d23] font-bold">Ambil Foto</p>
                <p className="text-[#3e4943] text-xs">Klik untuk membuka kamera</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[#141d23] text-sm font-bold">Tips Verifikasi:</h4>
          <ul className="flex flex-col gap-2">
            {[
              'Pencahayaan yang cukup (terang)',
              'Wajah terlihat sepenuhnya',
              'Teks pada kartu terbaca jelas',
              'Gunakan kartu identitas asli (bukan fotokopi)'
            ].map((tip, idx) => (
              <li key={idx} className="flex items-center gap-2 text-[#3e4943] text-xs">
                <CheckCircle2 size={14} className="text-primary" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-primary">
          <ShieldCheck size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Terjamin Aman & Terenkripsi</span>
        </div>
      </div>
    </PageLayout>
  );
};

export default VerificationPage;
