/**
 * Halaman pengelolaan quest oleh pemilik quest.
 * Digunakan saat: User ingin mengedit, menghapus, atau mengelola pemohon quest miliknya.
 */
import React from 'react';
import { Share2, MapPin, Clock, Trash2, Edit2, UserCheck, UserX, MessageCircle } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { ReviewDialog } from '../components/common/ReviewDialog';

import mapPreview from '../assets/map-preview.png';

import { useApp } from '../store/AppContext';
import { useDialog } from '../components/common/Dialog';
import { getRelativeTime } from '../utils/dateUtils';
import { getQuestDisplayInfo, categoryConfig } from '../utils/questUtils';

interface ManageQuestPageProps {
  questId: string | null;
  onBack: () => void;
  onEdit?: (questId: string) => void;
  onChatWithApplicant?: (applicantId: string) => void;
}

const ManageQuestPage: React.FC<ManageQuestPageProps> = ({ questId, onBack, onEdit, onChatWithApplicant }) => {
  const { state, deleteQuest, acceptApplicant, rejectApplicant, completeQuest, submitReview } = useApp();
  const { showDialog } = useDialog();
  const [isReviewOpen, setIsReviewOpen] = React.useState(false);
  const quest = state.allQuests.find(q => q.id === questId);
  const displayInfo = quest ? getQuestDisplayInfo(quest, state.currentUserId) : null;
  const applicants = quest?.applicantIds?.map(id => state.users.find(u => u.id === id)).filter(Boolean) || [];

  if (!quest) {
    return (
      <PageLayout
        header={<PageHeader title="Quest tidak ditemukan" onBack={onBack} />}
      >
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-text">
          <p>Quest yang Anda cari tidak tersedia.</p>
        </div>
      </PageLayout>
    );
  }

  const handleDelete = () => {
    showDialog({
      title: 'Hapus Quest?',
      message: 'Quest yang dihapus tidak dapat dikembalikan. Adventurer lain tidak akan bisa melihat quest ini lagi.',
      confirmLabel: 'Ya, Hapus',
      cancelLabel: 'Batal',
      variant: 'danger',
      onConfirm: () => {
        deleteQuest(quest.id);
        onBack();
      }
    });
  };

  const handleConfirmCompletion = () => {
    showDialog({
      title: 'Konfirmasi Selesai?',
      message: 'Dengan mengonfirmasi, dana escrow akan dilepaskan ke Adventurer. Pastikan Anda sudah mengecek bukti kerja.',
      confirmLabel: 'Ya, Selesaikan',
      cancelLabel: 'Batal',
      onConfirm: () => {
        completeQuest(quest.id);
        setIsReviewOpen(true);
      }
    });
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (quest?.takerId) {
      submitReview(quest.id, quest.takerId, rating, comment, 'adventurer');
    }
  };

  return (
    <PageLayout
      header={
        <PageHeader
          title="Kelola quest"
          onBack={onBack}
          rightAction={
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onEdit?.(quest.id)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-primary"
              >
                <Edit2 size={20} />
              </button>
              <button 
                onClick={handleDelete}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-red-500"
              >
                <Trash2 size={20} />
              </button>
              <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
                <Share2 size={20} className="text-[#141d23]" />
              </button>
            </div>
          }
        />
      }
      footer={
        <div className="backdrop-blur-[6px] bg-[rgba(246,250,255,0.9)] border-t border-[#bdcac1] p-4 max-w-screen-md mx-auto">
          <div className="flex justify-between items-center mb-4 px-2">
            <div>
              <p className="text-[#3e4943] text-xs font-bold uppercase tracking-wider">Reward ditawarkan</p>
              <p className="text-primary text-xl font-bold">{quest.price}</p>
            </div>
            <div className="text-right">
              <p className="text-[#3e4943] text-xs font-bold uppercase tracking-wider">Status Quest</p>
              <Badge variant={displayInfo?.status === 'waiting_adventurer' ? 'primary' : 'secondary'}>
                {displayInfo?.label}
              </Badge>
            </div>
          </div>
          {quest.status === 'pending' && (
            <Button 
              fullWidth 
              size="lg"
              onClick={handleConfirmCompletion}
            >
              Konfirmasi Selesai
            </Button>
          )}
        </div>
      }
    >
      <div className="pb-40">
        {/* Review Dialog */}
        {quest?.takerId && (
          <ReviewDialog 
            isOpen={isReviewOpen}
            onClose={() => setIsReviewOpen(false)}
            onSubmit={handleReviewSubmit}
            revieweeName={state.users.find(u => u.id === quest.takerId)?.name || 'Adventurer'}
            role="adventurer"
          />
        )}

        {/* Hero Image */}
        <div className="bg-[#8af7c8] h-48 w-full flex items-center justify-center overflow-hidden">
          <img src={quest.image} alt={quest.title} className="w-full h-full object-cover opacity-80" />
        </div>

        <div className="px-5 py-4 flex flex-col gap-6">
          {/* Header Info */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="w-fit">{quest.category}</Badge>
              <span className="text-[#141d23] text-xs font-semibold opacity-60">
                Dibuat {getRelativeTime(quest.createdAt)}
              </span>
            </div>
            <h2 className="text-[#141d23] text-2xl font-bold">{quest.title}</h2>
            
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-2 text-[#3e4943]">
                <MapPin size={16} className="text-primary" />
                <div className="flex flex-col">
                  {quest.location && <p className="text-sm font-semibold">{quest.location}</p>}
                  {quest.fromLocation && (
                    <p className="text-xs">
                      <span className="opacity-60">{(categoryConfig[quest.category] || categoryConfig['Lainnya']).from}: </span>
                      {quest.fromLocation}
                    </p>
                  )}
                  {quest.toLocation && (
                    <p className="text-xs">
                      <span className="opacity-60">{(categoryConfig[quest.category] || categoryConfig['Lainnya']).to}: </span>
                      {quest.toLocation}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#3e4943]">
                <Clock size={16} className="text-primary" />
                <p className="text-sm font-semibold">Deadline {quest.deadline || 'Hari ini'}</p>
              </div>
            </div>
          </div>

          {/* Evidence Section */}
          {quest.status === 'pending' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-[#141d23] text-base font-bold uppercase tracking-wider">Bukti Penyelesaian</h3>
              <Card className="p-4 flex flex-col gap-4 bg-orange-50 border-orange-100">
                {quest.evidenceImage && (
                  <div className="rounded-xl overflow-hidden h-48">
                    <img src={quest.evidenceImage} alt="Evidence" className="w-full h-full object-cover" />
                  </div>
                )}
                {quest.evidenceNotes && (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-orange-800 uppercase">Catatan Adventurer:</p>
                    <p className="text-[#3e4943] text-sm">{quest.evidenceNotes}</p>
                  </div>
                )}
                {!quest.evidenceImage && !quest.evidenceNotes && (
                  <p className="text-[#3e4943] text-sm italic">Tidak ada bukti yang dilampirkan.</p>
                )}
              </Card>
            </div>
          )}

          {/* Description */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[#141d23] text-base font-bold">Deskripsi</h3>
            <p className="text-[#3e4943] text-base leading-6">
              {quest.description}
            </p>
          </div>

          {/* Applicants Management Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[#141d23] text-base font-bold">
                {['active', 'pending', 'completed'].includes(quest.status) ? 'Dikerjakan oleh' : `Daftar Pemohon (${applicants.length})`}
              </h3>
              {!['active', 'pending', 'completed'].includes(quest.status) && applicants.length > 0 && <span className="text-primary text-xs font-bold">Lihat Semua</span>}
            </div>
            
            {['active', 'pending', 'completed'].includes(quest.status) && quest.takerId ? (
              (() => {
                const taker = state.users.find(u => u.id === quest.takerId);
                return taker ? (
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar initials={taker.initials} src={taker.avatar} size="sm" />
                        <div>
                          <p className="text-[#141d23] text-sm font-bold">{taker.name}</p>
                          <div className="flex items-center gap-1 text-[#3e4943] text-[11px] font-bold">
                            <span>★ {taker.rating}</span>
                            <span>•</span>
                            <span>{taker.questsCompleted} selesai</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="!p-2 rounded-full text-primary"
                        onClick={() => onChatWithApplicant?.(taker.id)}
                      >
                        <MessageCircle size={18} />
                      </Button>
                    </div>
                  </Card>
                ) : null;
              })()
            ) : applicants.length > 0 ? (
              <div className="flex flex-col gap-3">
                {applicants.map((applicant) => applicant && (
                  <Card key={applicant.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar initials={applicant.initials} src={applicant.avatar} size="sm" />
                        <div>
                          <p className="text-[#141d23] text-sm font-bold">{applicant.name}</p>
                          <div className="flex items-center gap-1 text-[#3e4943] text-[11px] font-bold">
                            <span>★ {applicant.rating}</span>
                            <span>•</span>
                            <span>{applicant.questsCompleted} selesai</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="!p-2 rounded-full text-primary"
                          onClick={() => onChatWithApplicant?.(applicant.id)}
                        >
                          <MessageCircle size={18} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="!p-2 rounded-full border-red-200 text-red-500 hover:bg-red-50"
                          onClick={() => rejectApplicant(quest.id, applicant.id)}
                        >
                          <UserX size={18} />
                        </Button>
                        <Button 
                          size="sm" 
                          className="!p-2 rounded-full"
                          onClick={() => acceptApplicant(quest.id, applicant.id)}
                        >
                          <UserCheck size={18} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                <p className="text-gray-400 text-sm">Belum ada yang mendaftar untuk quest ini.</p>
              </div>
            )}
          </div>

          {/* Map Preview */}
          <div className="bg-[#e0e9f2] border border-[#bdcac1] h-32 rounded-2xl overflow-hidden relative">
             <img 
               src={mapPreview} 
               alt="map" 
               className="w-full h-full object-cover opacity-60"
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <MapPin size={32} className="text-primary" />
             </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ManageQuestPage;
