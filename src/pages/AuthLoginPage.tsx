/**
 * Halaman Masuk Akun.
 * Digunakan saat: Pengguna ingin masuk ke aplikasi menggunakan kredensial mereka.
 */
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Globe, Users } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useApp } from '../store/AppContext';

interface AuthLoginPageProps {
  onBack: () => void;
  onSuccess: () => void;
  onRegister: () => void;
}

const AuthLoginPage: React.FC<AuthLoginPageProps> = ({ onBack, onSuccess, onRegister }) => {
  const { state, login } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulasi delay jaringan
    setTimeout(() => {
      const user = state.users.find(u => 
        (u.email === identifier || u.phone === identifier) && u.password === password
      );

      if (user) {
        setLoading(false);
        login(user.id);
        onSuccess();
      } else {
        setLoading(false);
        setError('Email, nomor telepon, atau kata sandi salah.');
      }
    }, 1200);
  };

  return (
    <PageLayout
      header={<PageHeader title="Masuk" onBack={onBack} />}
    >
      <div className="px-7 py-10 flex flex-col h-full">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-[#141d23] mb-2">Selamat Datang Kembali</h2>
          <p className="text-[#3e4943] font-medium">Masuk untuk melanjutkan petualanganmu di Sambilan.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-xl flex gap-3 items-center text-sm font-medium animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <Input 
            label="Email atau Nomor Telepon"
            placeholder="nama@email.com / 0812..."
            leftIcon={<Mail size={18} />}
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoFocus
          />

          <div className="relative">
            <Input 
              label="Kata Sandi"
              placeholder="••••••••"
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

          <button type="button" className="text-primary text-sm font-bold self-end mt-1">
            Lupa Kata Sandi?
          </button>

          <Button 
            fullWidth 
            size="lg" 
            type="submit"
            className="mt-4 shadow-lg shadow-primary/20"
            disabled={loading}
            rightIcon={!loading && <ArrowRight size={18} />}
          >
            {loading ? 'Memverifikasi...' : 'Masuk Sekarang'}
          </Button>
        </form>

        <div className="mt-auto pt-10 text-center">
          <p className="text-[#3e4943] text-sm font-medium">
            Belum punya akun?{' '}
            <button 
              onClick={onRegister}
              className="text-primary font-bold hover:underline"
            >
              Daftar di sini
            </button>
          </p>
          
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-[#f6faff] px-3 text-gray-400">Atau Masuk Dengan</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" fullWidth className="bg-white">
              <Globe size={20} className="mr-2 text-red-500" />
              <span className="text-sm">Google</span>
            </Button>
            <Button variant="outline" fullWidth className="bg-white">
              <Users size={20} className="mr-2 text-blue-600" />
              <span className="text-sm">Facebook</span>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AuthLoginPage;
