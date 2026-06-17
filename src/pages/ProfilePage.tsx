/**
 * Halaman profil pengguna.
 * Digunakan saat: Menampilkan informasi akun dan pengaturan user.
 */
import React, { useState } from 'react';
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
  LogOut,
  MapPin,
  Calendar
} from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Avatar } from '../components/common/Avatar';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useApp } from '../store/AppContext';
import { getRelativeTime } from '../utils/dateUtils';

interface ProfilePageProps {
  onBack: () => void;
  onTopUp: () => void;
  onWithdraw: () => void;
  onEditProfile: () => void;
  onVerify: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, onTopUp, onWithdraw, onEditProfile, onVerify }) => {
  const { state, logout } = useApp();
  const [activeReviewTab, setActiveReviewTab] = useState<'adventurer' | 'creator'>('adventurer');
  const user = state.user;

  if (!user) return null;

  const filteredReviews = state.reviews.filter(r => 
    r.revieweeId === user.id && r.role === activeReviewTab
  );

  const menuItems = [
    { 
      icon: <UserCircle size={20} className="text-[#00694b]" />, 
      label: 'Edit Profil', 
      onClick: () => {
        onEditProfile();
      }
    },
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
      <div className="pb-10">
        {/* Profile Info Section */}
        <section className="px-5 pt-6 flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <Avatar 
              initials={user.initials} 
              src={user.avatar}
              size="lg" 
              className="border-4 border-white !bg-[#ffdad6] !text-[#93000a]" 
            />
            <div className="flex flex-col gap-1">
              <h2 className="text-[#141d23] text-lg font-bold leading-tight">{user.name}</h2>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-[#5a5c5e] text-xs font-bold uppercase tracking-tighter">Adventurer</span>
                  <Star size={12} className="text-orange-400 fill-orange-400" />
                  <span className="text-[#141d23] text-sm font-bold">{(user.adventurerRating || 0).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[#5a5c5e] text-xs font-bold uppercase tracking-tighter">Creator</span>
                  <Star size={12} className="text-orange-400 fill-orange-400" />
                  <span className="text-[#141d23] text-sm font-bold">{(user.creatorRating || 0).toFixed(1)}</span>
                </div>
              </div>
              {user.location && (
                <div className="flex items-center gap-1 text-[#5a5c5e] text-xs">
                  <MapPin size={12} className="text-primary" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
          </div>
          
          {user.bio && (
            <p className="text-[#3e4943] text-sm leading-relaxed bg-[#f0f4f8] p-3 rounded-xl border border-[#dbe4ed]">
              {user.bio}
            </p>
          )}

          <div className="flex justify-between items-center">
            <p className="text-primary text-[0.6875rem] font-semibold">{user.questsCreated} Quest Dibuat - {user.questsCompleted} Quest Dikerjakan</p>
            <div className="flex gap-2">
              {user.isVerified && (
                <Badge variant="primary" className="!bg-[#d2e8ff] !text-[#001d32] !border-[#b0c9e3]">TERVERIFIKASI</Badge>
              )}
            </div>
          </div>
        </section>

        {/* Verification Notice Card (Only for Unverified) */}
        {!user.isVerified && (
          <section className="px-5 mt-4">
            <div className="bg-[#FFF4E5] border border-[#FFE0BD] p-5 rounded-3xl flex flex-col gap-4 shadow-sm">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={22} className="text-orange-600" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-[#141d23] text-[15px] font-bold">Akun Belum Terverifikasi</h4>
                  <p className="text-[#5a5c5e] text-[13px] leading-snug">
                    Verifikasi identitasmu untuk meningkatkan kepercayaan dan membuka akses ke lebih banyak quest.
                  </p>
                </div>
              </div>
              <Button 
                variant="primary" 
                fullWidth
                className="!h-12 !rounded-2xl text-sm font-bold shadow-md shadow-primary/20"
                onClick={onVerify}
              >
                Verifikasi Sekarang
              </Button>
            </div>
          </section>
        )}

        {/* Balance Card */}
        <section className="px-5 mt-6">
          <div className="bg-primary p-6 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-primary/20">
            <div className="relative z-10">
              <p className="text-xs font-bold tracking-widest opacity-80 uppercase">SALDO SAMBILAN</p>
              <h3 className="text-3xl font-extrabold mt-1">Rp {user.balance.toLocaleString('id-ID')}</h3>
              <div className="flex gap-4 mt-6">
                <Button 
                  variant="secondary" 
                  fullWidth 
                  onClick={onTopUp}
                  className="!bg-white !text-primary !rounded-2xl shadow-sm"
                  leftIcon={<Plus size={16} />}
                >
                  Top Up
                </Button>
                <Button 
                  variant="secondary" 
                  fullWidth 
                  onClick={onWithdraw}
                  className="!bg-white !text-primary !rounded-2xl shadow-sm"
                  leftIcon={<ArrowDownToLine size={16} />}
                >
                  Tarik
                </Button>
              </div>
            </div>
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#00855f] rounded-full blur-[40px] opacity-60" />
          </div>
        </section>

        {/* Reviews Section */}
        <section className="px-5 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#141d23] text-xl font-bold">Review Pengguna</h3>
          </div>
          
          {/* Review Tabs */}
          <div className="flex gap-2 p-1 bg-[#f0f4f8] rounded-2xl mb-4">
            <button 
              onClick={() => setActiveReviewTab('adventurer')}
              className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all ${
                activeReviewTab === 'adventurer' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-[#5a5c5e]'
              }`}
            >
              SEBAGAI ADVENTURER
            </button>
            <button 
              onClick={() => setActiveReviewTab('creator')}
              className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all ${
                activeReviewTab === 'creator' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-[#5a5c5e]'
              }`}
            >
              SEBAGAI CREATOR
            </button>
          </div>

          {filteredReviews.length === 0 ? (
            <Card className="border-2 border-[#bdcac1] border-dashed py-10 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-[#e6eff8] rounded-full flex items-center justify-center mb-4">
                <UserCircle size={30} className="text-[#00694b]" />
              </div>
              <p className="text-[#3e4943] font-medium">Belum ada review.</p>
              <p className="text-xs text-gray-400 mt-1">
                {activeReviewTab === 'adventurer' 
                  ? 'Selesaikan quest untuk mendapatkan feedback dari Creator!' 
                  : 'Buat quest dan beri feedback untuk mendapatkan feedback balik!'}
              </p>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredReviews.map((review) => {
                const reviewer = state.users.find(u => u.id === review.reviewerId);
                return (
                  <Card key={review.id} className="p-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar initials={reviewer?.initials || '??'} src={reviewer?.avatar} size="sm" />
                          <div>
                            <p className="text-[#141d23] text-sm font-bold">{reviewer?.name}</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                  key={s} 
                                  size={10} 
                                  className={s <= review.rating ? "text-orange-400 fill-orange-400" : "text-gray-300"} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[#5a5c5e] text-[10px]">
                          <Calendar size={10} />
                          <span>{getRelativeTime(review.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-[#3e4943] text-sm leading-relaxed italic">
                        "{review.comment || 'Tidak ada komentar.'}"
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Settings Section */}
        <section className="px-5 mt-8 pb-12">
          <h3 className="text-[#141d23] text-xl font-bold mb-4">Settings</h3>
          <Card className="overflow-hidden">
            <button 
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50"
              onClick={() => onEditProfile()}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#e0e9f2] rounded-lg flex items-center justify-center">
                  <UserCircle size={20} className="text-[#00694b]" />
                </div>
                <span className="text-[#141d23] font-bold">Edit Profil</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            {menuItems.slice(1).map((item, idx) => (
              <button 
                key={idx}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50"
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
