/**
 * Halaman awal (Welcome/Landing).
 * Digunakan saat: Pertama kali aplikasi dibuka atau user sedang tidak login.
 */
import React from 'react';
import { LogIn, UserPlus, Users } from 'lucide-react';
import { Button } from '../components/common/Button';
import { PageLayout } from '../components/common/PageLayout';
import heroImage from '../assets/hero.png';

interface WelcomePageProps {
  onLogin: () => void;
  onRegister: () => void;
  onSwitchAccount: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ 
  onLogin, 
  onRegister, 
  onSwitchAccount 
}) => {
  return (
    <PageLayout className="bg-white">
      <div className="flex flex-col h-full">
        {/* Hero Section */}
        <div className="relative h-[55%] w-full overflow-hidden">
          <img 
            src={heroImage} 
            alt="Hero" 
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* Content Section */}
        <div className="flex flex-col px-7 py-8 flex-1">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-[#141d23] tracking-tight mb-3">
              Sambilan
            </h1>
            <p className="text-[#3e4943] text-base font-medium leading-relaxed px-2">
              Solusi praktis untuk kebutuhan harianmu. Temukan bantuan atau bantu sesama.
            </p>
          </div>

          <div className="flex flex-col gap-3.5 mt-auto">
            <Button 
              fullWidth 
              size="lg"
              onClick={onLogin}
              leftIcon={<LogIn size={20} />}
              className="shadow-lg shadow-primary/20"
            >
              Masuk
            </Button>
            
            <Button 
              variant="outline" 
              fullWidth 
              size="lg"
              onClick={onRegister}
              leftIcon={<UserPlus size={20} />}
            >
              Daftar Akun
            </Button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                <span className="bg-white px-3 text-gray-400">Atau Gunakan Mode Demo</span>
              </div>
            </div>

            <Button 
              variant="secondary" 
              fullWidth 
              size="md"
              onClick={onSwitchAccount}
              leftIcon={<Users size={18} />}
              className="border border-primary/5"
            >
              Pilih Akun Demo
            </Button>
          </div>
          
          <p className="text-center text-[10px] font-medium text-gray-400 mt-8 uppercase tracking-widest">
            © 2026 Sambilan.id
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default WelcomePage;
