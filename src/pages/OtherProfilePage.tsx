/**
 * Halaman profil pengguna lain.
 * Digunakan saat: User ingin melihat informasi dan reputasi pembuat quest atau adventurer lain.
 */
import React, { useState } from 'react';
import { 
  Star, 
  UserCircle, 
  MapPin,
  Calendar
} from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Avatar } from '../components/common/Avatar';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useApp } from '../store/AppContext';
import { getRelativeTime } from '../utils/dateUtils';

interface OtherProfilePageProps {
  userId: string | null;
  onBack: () => void;
}

const OtherProfilePage: React.FC<OtherProfilePageProps> = ({ userId, onBack }) => {
  const { state } = useApp();
  const [activeReviewTab, setActiveReviewTab] = useState<'adventurer' | 'creator'>('adventurer');
  
  const user = state.users.find(u => u.id === userId);

  if (!user) {
    return (
      <PageLayout
        header={<PageHeader title="Profil tidak ditemukan" onBack={onBack} />}
      >
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-text">
          <p>Profil pengguna tidak tersedia.</p>
        </div>
      </PageLayout>
    );
  }

  const filteredReviews = state.reviews.filter(r => 
    r.revieweeId === user.id && r.role === activeReviewTab
  );

  const questsCreated = state.allQuests.filter(q => q.creatorId === user.id).length;
  const questsCompleted = state.allQuests.filter(q => q.takerId === user.id && q.status === 'completed').length;

  return (
    <PageLayout
      header={
        <PageHeader
          title="Profil Pengguna"
          onBack={onBack}
        />
      }
    >
      <div className="pb-12">
        {/* Profile Info Section */}
        <section className="px-5 pt-6 flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <Avatar 
              initials={user.initials} 
              src={user.avatar}
              size="lg" 
              className="border-4 border-white !bg-[#d2e8ff] !text-[#001d32]" 
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
            <p className="text-primary text-[0.6875rem] font-semibold">{questsCreated} Quest Dibuat - {questsCompleted} Quest Dikerjakan</p>
            <div className="flex gap-2">
              {user.isVerified && (
                <Badge variant="primary" className="!bg-[#d2e8ff] !text-[#001d32] !border-[#b0c9e3]">TERVERIFIKASI</Badge>
              )}
            </div>
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
                Pengguna ini belum memiliki review {activeReviewTab === 'adventurer' ? 'sebagai Adventurer' : 'sebagai Creator'}.
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
      </div>
    </PageLayout>
  );
};

export default OtherProfilePage;
