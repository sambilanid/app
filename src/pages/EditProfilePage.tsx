/**
 * Halaman kustomisasi profil.
 * Digunakan saat: Pengguna ingin mengubah informasi profil seperti nama, bio, dan lokasi.
 */
import React, { useState } from 'react';
import { Camera, MapPin, AlignLeft, User, Mail, Phone } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { useApp } from '../store/AppContext';

interface EditProfilePageProps {
  onBack: () => void;
  onSuccess: () => void;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ onBack, onSuccess }) => {
  const { state, updateUserProfile } = useApp();
  const user = state.user;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    avatar: user?.avatar || '',
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    onSuccess();
  };

  return (
    <PageLayout
      header={
        <PageHeader
          title="Edit Profil"
          onBack={onBack}
        />
      }
    >
      <form onSubmit={handleSubmit} className="px-5 py-6 flex flex-col gap-6">
        {/* Avatar Edit Section */}
        <div className="flex flex-col items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="relative cursor-pointer" onClick={handleAvatarClick}>
            <Avatar 
              initials={user.initials} 
              src={formData.avatar} 
              size="xl" 
              className="border-4 border-white shadow-md !bg-[#ffdad6] !text-[#93000a]" 
            />
            <button 
              type="button"
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-2 border-white shadow-lg"
            >
              <Camera size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-500 font-medium">Ketuk untuk ubah foto profil</p>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <Input
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            leftIcon={<User size={18} />}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="Masukkan alamat email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            leftIcon={<Mail size={18} />}
            required
          />

          <Input
            label="Nomor Telepon"
            type="tel"
            placeholder="Masukkan nomor telepon"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            leftIcon={<Phone size={18} />}
            required
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[#141d23] text-sm font-bold ml-1">
              Bio
            </label>
            <div className="bg-white border border-[#bdcac1] flex gap-3 p-4 rounded-xl w-full transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <AlignLeft size={18} className="text-gray-400 mt-1" />
              <textarea 
                className="flex-1 text-base text-[#141d23] outline-none bg-transparent placeholder:text-gray-400 min-h-[100px] resize-none"
                placeholder="Tulis sedikit tentang diri Anda..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </div>

          <Input
            label="Lokasi"
            placeholder="Masukkan lokasi Anda (Kota, Provinsi)"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            leftIcon={<MapPin size={18} />}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 pb-8">
          <Button type="submit" fullWidth>
            Simpan Perubahan
          </Button>
          <Button type="button" variant="secondary" fullWidth onClick={onBack}>
            Batal
          </Button>
        </div>
      </form>
    </PageLayout>
  );
};

export default EditProfilePage;
