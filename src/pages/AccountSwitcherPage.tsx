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

interface AccountSwitcherPageProps {
  onBack: () => void;
}

const AccountSwitcherPage: React.FC<AccountSwitcherPageProps> = ({ onBack }) => {
  const { state, login } = useApp();

  return (
    <PageLayout
      header={
        <PageHeader title="Pilih Akun Demo" onBack={onBack} />
      }
    >
    <div className="px-6 py-8 flex flex-col gap-6 h-full justify-center">
        <div className="text-center mb-6">
          <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-3">
            <LogIn size={40} className="text-primary -rotate-3" />
          </div>
          <h1 className="text-[#141d23] text-2xl font-bold tracking-tight">Selamat Datang</h1>
          <p className="text-[#3e4943] mt-2 text-sm font-medium">Silakan pilih akun di bawah ini untuk mensimulasikan login.</p>
        </div>

        <div className="flex flex-col gap-3">
          {state.users.map((user) => (
            <Card 
              key={user.id} 
              className="p-4 flex items-center justify-between cursor-pointer hover:border-primary/50 hover:bg-primary/[0.02] active:scale-[0.98] transition-all border-gray-100"
              onClick={() => login(user.id)}
            >
              <div className="flex items-center gap-4">
                <Avatar initials={user.initials} src={user.avatar} size="lg" />
                <div className="flex flex-col">
                  <span className="text-[#141d23] text-base font-bold">{user.name}</span>
                  <span className="text-primary text-xs font-semibold">Saldo: Rp {user.balance.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-xl">
                <LogIn size={16} className="text-primary" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default AccountSwitcherPage;
