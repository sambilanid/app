/**
 * Halaman Login (Demo).
 * Digunakan saat: Tidak ada user yang aktif. Memungkinkan pemilihan user untuk simulasi.
 */
import React from 'react';
import { LogIn } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import { useApp } from '../store/AppContext';

const LoginPage: React.FC = () => {
  const { state, login } = useApp();

  return (
    <PageLayout
      header={
        <PageHeader title="Pilih Akun (Demo)" />
      }
    >
      <div className="px-[20px] py-[24px] flex flex-col gap-6 h-full min-h-[80vh] justify-center">
        <div className="text-center mb-4">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn size={40} className="text-primary" />
          </div>
          <h1 className="text-[#141d23] text-[24px] font-bold">Selamat Datang di Sambilan</h1>
          <p className="text-[#3e4943] mt-2">Silakan pilih akun di bawah ini untuk mensimulasikan login dan menggunakan aplikasi.</p>
        </div>

        <div className="flex flex-col gap-3">
          {state.users.map((user) => (
            <Card 
              key={user.id} 
              className="p-4 flex items-center justify-between cursor-pointer hover:border-primary transition-colors"
              onClick={() => login(user.id)}
            >
              <div className="flex items-center gap-4">
                <Avatar initials={user.initials} src={user.avatar} />
                <div className="flex flex-col">
                  <span className="text-[#141d23] text-[16px] font-bold">{user.name}</span>
                  <span className="text-[#3e4943] text-[12px]">Saldo: Rp {user.balance.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <div className="bg-gray-100 p-2 rounded-full">
                <LogIn size={16} className="text-[#3e4943]" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
