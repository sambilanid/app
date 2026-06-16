/**
 * Halaman Daftar Akun.
 * Digunakan saat: Pengguna baru ingin membuat akun di aplikasi.
 */
import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useApp } from '../store/AppContext';

interface AuthRegisterPageProps {
  onBack: () => void;
  onSuccess: () => void;
  onLogin: () => void;
}

const AuthRegisterPage: React.FC<AuthRegisterPageProps> = ({ onBack, onSuccess, onLogin }) => {
  const { register } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);

    // Simulasi delay pendaftaran
    setTimeout(() => {
      register({ name, email, phone, password });
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <PageLayout
      header={<PageHeader title="Daftar Baru" onBack={onBack} />}
    >
      <div className="px-7 py-10 flex flex-col h-full">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-[#141d23] mb-2">Buat Akun Baru</h2>
          <p className="text-[#3e4943] font-medium">Bergabunglah dengan ribuan Adventurer lainnya.</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <Input 
            label="Nama Lengkap"
            placeholder="Contoh: Budi Santoso"
            leftIcon={<User size={18} />}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input 
            label="Nomor Telepon"
            placeholder="0812xxxxxx"
            leftIcon={<Phone size={18} />}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <Input 
            label="Alamat Email"
            placeholder="nama@email.com"
            leftIcon={<Mail size={18} />}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <Input 
              label="Kata Sandi"
              placeholder="Minimal 8 karakter"
              leftIcon={<Lock size={18} />}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              className="absolute right-4 bottom-3.5 text-gray-400 hover:text-primary transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex gap-3 mt-2">
            <button 
              type="button"
              className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${agreed ? 'bg-primary border-primary' : 'border-[#bdcac1] bg-white'}`}
              onClick={() => setAgreed(!agreed)}
            >
              {agreed && <CheckCircle2 size={14} className="text-white" />}
            </button>
            <p className="text-[#3e4943] text-xs leading-normal">
              Saya setuju dengan <span className="text-primary font-bold">Syarat & Ketentuan</span> serta <span className="text-primary font-bold">Kebijakan Privasi</span> Sambilan.
            </p>
          </div>

          <Button 
            fullWidth 
            size="lg" 
            type="submit"
            className="mt-4 shadow-lg shadow-primary/20"
            disabled={loading || !agreed}
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </Button>
        </form>

        <div className="mt-8 mb-10 text-center">
          <p className="text-[#3e4943] text-sm font-medium">
            Sudah punya akun?{' '}
            <button 
              onClick={onLogin}
              className="text-primary font-bold hover:underline"
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default AuthRegisterPage;
