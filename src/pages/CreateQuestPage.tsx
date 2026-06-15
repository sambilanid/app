/**
 * Halaman pembuatan quest baru.
 * Digunakan saat: Pengguna ingin mempublikasikan tugas atau permintaan baru ke platform.
 */
import React from 'react';
import { Image as ImageIcon, MapPin, Clock } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';

interface CreateQuestPageProps {
  onBack: () => void;
}

const CreateQuestPage: React.FC<CreateQuestPageProps> = ({ onBack }) => {
  return (
    <PageLayout
      header={
        <PageHeader 
          title="Buat Quest Baru" 
          onBack={onBack}
        />
      }
      footer={
        <div className="bg-white p-[20px] border-t border-gray-100">
          <Button fullWidth size="lg">
            Publish Quest
          </Button>
        </div>
      }
    >
      <div className="px-[20px] pt-[24px] pb-[100px] flex flex-col gap-[20px]">
        {/* Upload Image Section */}
        <div className="bg-white border-2 border-[#bdcac1] border-dashed rounded-[16px] py-[40px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-[48px] h-[48px] bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <ImageIcon size={24} className="text-primary" />
          </div>
          <p className="text-[#141d23] font-bold text-[14px]">Tambah Foto Quest</p>
          <p className="text-[#3e4943] text-[12px] opacity-60">Opsional, tapi membantu adventurer</p>
        </div>

        {/* Form Sections */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-2">
            <label className="text-[#3e4943] text-[14px] font-bold">Judul Quest</label>
            <input 
              type="text" 
              placeholder="Contoh: Jastip Seblak Rafael"
              className="bg-white border border-[#bdcac1] rounded-[12px] p-4 text-[14px] focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#3e4943] text-[14px] font-bold">Kategori</label>
            <select className="bg-white border border-[#bdcac1] rounded-[12px] p-4 text-[14px] focus:outline-none focus:border-primary transition-colors appearance-none">
              <option>Jasa Titip</option>
              <option>Angkut Barang</option>
              <option>Bantu-bantu</option>
              <option>Lainnya</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#3e4943] text-[14px] font-bold">Lokasi</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <input 
                type="text" 
                placeholder="Pilih Lokasi"
                className="w-full bg-white border border-[#bdcac1] rounded-[12px] p-4 pl-12 text-[14px] focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[12px]">
            <div className="flex flex-col gap-2">
              <label className="text-[#3e4943] text-[14px] font-bold">Budget</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">Rp</span>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full bg-white border border-[#bdcac1] rounded-[12px] p-4 pl-10 text-[14px] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#3e4943] text-[14px] font-bold">Deadline</label>
              <div className="relative">
                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                <input 
                  type="text" 
                  placeholder="Hari ini"
                  className="w-full bg-white border border-[#bdcac1] rounded-[12px] p-4 pl-12 text-[14px] focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#3e4943] text-[14px] font-bold">Deskripsi Lengkap</label>
            <textarea 
              placeholder="Jelaskan detail apa yang harus dilakukan..."
              rows={4}
              className="bg-white border border-[#bdcac1] rounded-[12px] p-4 text-[14px] focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CreateQuestPage;
