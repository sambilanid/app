/**
 * Halaman profil pengguna.
 * Digunakan saat: Menampilkan informasi akun dan pengaturan user.
 */
import React from 'react';
import { 
  Star, 
  Plus, 
  ArrowDownToLine, 
  ChevronRight, 
  UserCircle, 
  History, 
  ShieldCheck, 
  HelpCircle, 
  Info, 
  LogOut 
} from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Avatar } from '../components/common/Avatar';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useApp } from '../store/AppContext';

interface ProfilePageProps {
  onBack: () => void;
  onTopUp: () => void;
  onWithdraw: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, onTopUp, onWithdraw }) => {
  const { state, logout } = useApp();
  const user = state.user;

  if (!user) return null;

  const menuItems = [
    { icon: <UserCircle size={20} className="text-[#00694b]" />, label: 'Edit Profil' },
    { icon: <History size={20} className="text-[#00694b]" />, label: 'Riwayat Transaksi' },
    { icon: <ShieldCheck size={20} className="text-[#00694b]" />, label: 'Keamanan Akun' },
    { icon: <HelpCircle size={20} className="text-[#00694b]" />, label: 'Bantuan & FAQ' },
    { icon: <Info size={20} className="text-[#00694b]" />, label: 'Tentang Aplikasi' },
  ];

  return (
    <PageLayout
      hasNavbar
      header={
        <PageHeader
          title="Profil Pengguna"
          onBack={onBack}
        />
      }
    >
      <div>
        {/* Profile Info Section */}
        <section className="px-5 pt-6 flex gap-4 items-center">
          <Avatar 
            initials={user.initials} 
            src={user.avatar}
            size="lg" 
            className="border-4 border-white !bg-[#ffdad6] !text-[#93000a]" 
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-[#141d23] text-lg font-bold leading-tight">{user.name}</h2>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-orange-400 fill-orange-400" />
              <span className="text-[#141d23] text-sm font-bold">{user.rating.toFixed(1)}</span>
              <span className="text-[#5a5c5e] text-sm">({user.reviewCount} reviews)</span>
            </div>
            <p className="text-primary text-[0.6875rem] font-semibold">{user.questsCreated} Quest Dibuat - {user.questsCompleted} Quest Dikerjakan</p>
            <div className="flex gap-2 mt-1">
              {!user.isVerified && <Badge variant="primary" className="!bg-[#dbe4ed] !text-[#3e4943] !border-[#bdcac1]">BELUM VERIFIKASI</Badge>}
            </div>
          </div>
        </section>

        {/* Balance Card */}
        <section className="px-5 mt-6">
          <div className="bg-primary p-6 rounded-3xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-bold tracking-widest opacity-80 uppercase">SALDO</p>
              <h3 className="text-3xl font-extrabold mt-1">Rp {user.balance.toLocaleString('id-ID')}</h3>
              <div className="flex gap-4 mt-6">
                <Button 
                  variant="secondary" 
                  fullWidth 
                  onClick={onTopUp}
                  className="!bg-white !text-primary"
                  leftIcon={<Plus size={16} />}
                >
                  Top Up
                </Button>
                <Button 
                  variant="secondary" 
                  fullWidth 
                  onClick={onWithdraw}
                  className="!bg-white !text-primary"
                  leftIcon={<ArrowDownToLine size={16} />}
                >
                  Tarik
                </Button>
              </div>
            </div>
            {/* Abstract Background Decoration */}
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#00855f] rounded-full blur-[40px] opacity-60" />
          </div>
        </section>

        {/* Reviews Section */}
        <section className="px-5 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-[#141d23] text-xl font-bold">Review Terbaru</h3>
            <div className="bg-gray-100 p-1 rounded-md">
              <Star size={14} className="text-gray-400" />
            </div>
          </div>
          <Card className="border-2 border-[#bdcac1] border-dashed py-10 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 bg-[#e6eff8] rounded-full flex items-center justify-center mb-4">
              <UserCircle size={30} className="text-[#00694b]" />
            </div>
            <p className="text-[#3e4943] font-medium">Belum ada review.</p>
            <p className="text-xs text-gray-400 mt-1">Selesaikan quest pertama Anda untuk mendapatkan feedback!</p>
          </Card>
        </section>

        {/* Settings Section */}
        <section className="px-5 mt-8">
          <h3 className="text-[#141d23] text-xl font-bold mb-4">Settings</h3>
          <Card className="overflow-hidden">
            {menuItems.map((item, idx) => (
              <button 
                key={idx}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#e0e9f2] rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[#141d23] font-bold">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            ))}
            <button 
              className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors group"
              onClick={logout}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <LogOut size={20} className="text-[#ba1a1a]" />
                </div>
                <span className="text-[#ba1a1a] font-bold">Keluar Akun</span>
              </div>
              <ChevronRight size={16} className="text-red-200" />
            </button>
          </Card>
        </section>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
