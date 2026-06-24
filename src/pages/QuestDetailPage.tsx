/**
 * Halaman detail informasi quest.
 * Digunakan saat: User ingin melihat detail lengkap dan mengambil quest.
 */
import React from 'react';
import { Share2, MapPin, Clock, MessageCircle, ShieldCheck } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ProfileCard } from '../components/common/ProfileCard';
import { ReviewDialog } from '../components/common/ReviewDialog';

import { MiniMapPreview } from '../components/quest/MiniMapPreview';

import { useApp } from '../store/AppContext';
import { useDialog } from '../components/common/Dialog';
import { getRelativeTime } from '../utils/dateUtils';
import { getQuestDisplayInfo, categoryConfig } from '../utils/questUtils';

interface QuestDetailPageProps {
  questId: string | null;
  onBack: () => void;
  onChat: (questId: string) => void;
  onFinish: (questId: string) => void;
  onGoToVerification: () => void;
  onViewProfile: (userId: string) => void;
}

const QuestDetailPage: React.FC<QuestDetailPageProps> = ({ 
  questId, 
  onBack, 
  onChat, 
  onFinish, 
  onGoToVerification,
  onViewProfile
}) => {
  const { state, applyForQuest, cancelApplication, cancelQuestEvidence, submitReview } = useApp();
  const { showDialog } = useDialog();
  const [showReviewDialog, setShowReviewDialog] = React.useState(false);
  const quest = state.allQuests.find(q => q.id === questId);
  const displayInfo = quest ? getQuestDisplayInfo(quest, state.currentUserId) : null;

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!quest) return;
    const isCreator = quest.creatorId === state.currentUserId;
    const revieweeId = isCreator ? quest.takerId : quest.creatorId;
    const role = isCreator ? 'adventurer' : 'creator';
    
    if (revieweeId) {
      submitReview(quest.id, revieweeId, rating, comment, role);
    }
    setShowReviewDialog(false);
  };
  const creator = quest ? state.users.find(u => u.id === quest.creatorId) : null;
  
  // Calculate stats for creator if not present
  const creatorQuestsCreated = creator 
    ? (creator.questsCreated ?? state.allQuests.filter(q => q.creatorId === creator.id).length)
    : 0;

  const handleApplyQuest = () => {
    if (!quest) return;

    if (!state.user?.isVerified) {
      showDialog({
        title: 'Akun Belum Terverifikasi',
        message: 'Maaf, Anda harus memverifikasi identitas terlebih dahulu sebelum dapat mengambil quest untuk menjamin keamanan antar pengguna.',
        confirmLabel: 'Verifikasi Sekarang',
        cancelLabel: 'Nanti Saja',
        onConfirm: onGoToVerification
      });
      return;
    }

    showDialog({
      title: 'Ambil Quest?',
      message: 'Pastikan Anda sanggup menyelesaikan quest ini sebelum deadline.',
      confirmLabel: 'Ya, Ambil',
      cancelLabel: 'Batal',
      onConfirm: () => {
        applyForQuest(quest.id);
      }
    });
  };

  const isCreator = quest?.creatorId === state.currentUserId;

  const handleCancelApplication = () => {
    if (!quest) return;
    showDialog({
      title: 'Batalkan Permohonan?',
      message: '',
      confirmLabel: 'Ya, Batalkan',
      cancelLabel: 'Kembali',
      variant: 'danger',
      onConfirm: () => {
        cancelApplication(quest.id);
      }
    });
  };

  const handleCancelEvidence = () => {
    if (!quest) return;
    showDialog({
      title: 'Batalkan Pengiriman?',
      message: 'Bukti yang sudah dikirim akan dihapus dan status quest akan kembali menjadi Sedang Dikerjakan.',
      confirmLabel: 'Ya, Batalkan',
      cancelLabel: 'Kembali',
      variant: 'danger',
      onConfirm: () => {
        cancelQuestEvidence(quest.id);
      }
    });
  };

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

  // Logical divisions as separate functions
  const renderHeroImage = () => (
    <div className="bg-[#8af7c8] h-48 w-full flex items-center justify-center overflow-hidden">
      <img src={quest.image} alt={quest.title} className="w-full h-full object-cover opacity-80" />
    </div>
  );

  const renderHeaderInfo = () => (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Badge variant="secondary" className="w-fit">{quest.category}</Badge>
        <span className="text-[#141d23] text-xs font-semibold opacity-60">
          {getRelativeTime(quest.createdAt)}
        </span>
      </div>
      <h2 className="text-[#141d23] text-2xl font-bold">{quest.title}</h2>
      
      <div className="flex flex-col gap-1 mt-2">
        {quest.location && (
          <div className="flex items-start gap-2 text-[#3e4943]">
            <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">{quest.location}</p>
              {quest.locationDetails && (
                <p className="text-xs text-[#00694b] font-semibold mt-0.5">Patokan: {quest.locationDetails}</p>
              )}
              {quest.locationCoords && (
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                  Coords: {quest.locationCoords.lat.toFixed(6)}, {quest.locationCoords.lng.toFixed(6)}
                </p>
              )}
              {quest.distance && <p className="text-xs text-gray-500 mt-0.5">{quest.distance} dari lokasi</p>}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-[#3e4943]">
          <Clock size={16} className="text-primary" />
          <p className="text-sm font-semibold">Deadline {quest.deadline || 'Hari ini'}</p>
        </div>
      </div>
    </div>
  );

  const renderEvidenceSection = () => {
    if (quest.status !== 'pending') return null;

    return (
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
              <p className="text-xs font-bold text-orange-800 uppercase">Catatan Anda:</p>
              <p className="text-[#3e4943] text-sm">{quest.evidenceNotes}</p>
            </div>
          )}
          {!quest.evidenceImage && !quest.evidenceNotes && (
            <p className="text-[#3e4943] text-sm italic">Tidak ada bukti yang dilampirkan.</p>
          )}
        </Card>
      </div>
    );
  };

  const renderDescription = () => (
    <p className="text-[#3e4943] text-base leading-6">
      {quest.description}
    </p>
  );

  const renderCreatorProfile = () => {
    if (!creator) return null;
    return (
      <ProfileCard 
        name={creator.name}
        avatar={creator.avatar}
        initials={creator.initials}
        rating={creator.rating}
        statsLabel={`${creatorQuestsCreated} quest dibuat`}
        onClick={() => onViewProfile(creator.id)}
      />
    );
  };

  const renderLocationDetails = () => {
    if (!quest.fromLocation && !quest.toLocation) return null;

    return (
      <Card className="p-4 flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0 mt-0.5">
            <MapPin size={24} />
        </div>
        <div className="flex flex-col gap-3 flex-1 min-w-0">
            {quest.fromLocation && (
              <div className="text-sm">
                <span className="text-[#3e4943] opacity-60 font-medium block text-xs uppercase tracking-wider mb-0.5">
                  {(categoryConfig[quest.category] || categoryConfig['Lainnya']).from}
                </span>
                <span className="text-[#141d23] font-semibold block">{quest.fromLocation}</span>
                {quest.fromLocationDetails && (
                  <span className="text-xs text-[#00694b] font-semibold block mt-0.5">
                    Patokan: {quest.fromLocationDetails}
                  </span>
                )}
                {quest.fromLocationCoords && (
                  <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                    Coords: {quest.fromLocationCoords.lat.toFixed(6)}, {quest.fromLocationCoords.lng.toFixed(6)}
                  </span>
                )}
              </div>
            )}
            
            {quest.fromLocation && quest.toLocation && (
              <div className="h-px bg-gray-100 my-1" />
            )}

            {quest.toLocation && (
              <div className="text-sm">
                <span className="text-[#3e4943] opacity-60 font-medium block text-xs uppercase tracking-wider mb-0.5">
                  {(categoryConfig[quest.category] || categoryConfig['Lainnya']).to}
                </span>
                <span className="text-[#141d23] font-semibold block">{quest.toLocation}</span>
                {quest.toLocationDetails && (
                  <span className="text-xs text-[#00694b] font-semibold block mt-0.5">
                    Patokan: {quest.toLocationDetails}
                  </span>
                )}
                {quest.toLocationCoords && (
                  <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                    Coords: {quest.toLocationCoords.lat.toFixed(6)}, {quest.toLocationCoords.lng.toFixed(6)}
                  </span>
                )}
              </div>
            )}
        </div>
      </Card>
    );
  };

  const renderMapPreview = () => (
    <MiniMapPreview 
      coords={quest.locationCoords} 
      fromCoords={quest.fromLocationCoords} 
      toCoords={quest.toLocationCoords} 
    />
  );

  const renderRewardAndEscrowInfo = () => (
    <div className="flex justify-between items-center mb-4 px-2">
      <div>
        <p className="text-[#3e4943] text-xs font-bold uppercase tracking-wider">Reward quest</p>
        <p className="text-primary text-xl font-bold">{quest.price}</p>
      </div>
      <div className="text-right">
        <p className="text-[#3e4943] text-xs font-bold uppercase tracking-wider">Dana dijamin escrow</p>
        <div className="flex items-center justify-end gap-1 text-primary">
          <ShieldCheck size={14} />
          <span className="text-xs font-bold">Aman</span>
        </div>
      </div>
    </div>
  );

  const renderCreatorFooter = () => {
    return (
      <div className="backdrop-blur-[6px] bg-[rgba(246,250,255,0.9)] border-t border-[#bdcac1] p-4 max-w-screen-md mx-auto">
        {renderRewardAndEscrowInfo()}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            fullWidth 
            size="lg"
            leftIcon={<MessageCircle size={20} />}
            onClick={() => onChat(quest.id)}
          >
            Chat
          </Button>
          {/* Creator doesn't have other action buttons on the detail view */}
        </div>
      </div>
    );
  };

  const renderAdventurerFooter = () => {
    const renderActionButton = () => {
      const status = displayInfo?.status;

      if (status === 'on_going') {
        return (
          <Button 
            fullWidth 
            size="lg"
            onClick={() => onFinish(quest.id)}
          >
            Selesaikan
          </Button>
        );
      }

      if (status === 'waiting_confirmation') {
        return (
          <Button 
            variant="outline"
            fullWidth 
            size="lg" 
            className="border-red-200 text-red-500 hover:bg-red-50"
            onClick={handleCancelEvidence}
          >
            Batalkan pengiriman
          </Button>
        );
      }

      if (status === 'applying') {
        return (
          <Button 
            variant="outline"
            fullWidth 
            size="lg" 
            className="border-red-200 text-red-500 hover:bg-red-50"
            onClick={handleCancelApplication}
          >
            Batalkan permohonan
          </Button>
        );
      }

      if (status === 'completed') {
        const isTaker = quest.takerId === state.currentUserId;
        if (isTaker && !quest.takerReviewed) {
          return (
            <Button 
              fullWidth 
              size="lg"
              onClick={() => setShowReviewDialog(true)}
            >
              Beri Ulasan
            </Button>
          );
        }
        return null;
      }

      // Default or available to apply
      return (
        <Button 
          fullWidth 
          size="lg"
          onClick={handleApplyQuest}
        >
          Ambil quest ini
        </Button>
      );
    };

    return (
      <div className="backdrop-blur-[6px] bg-[rgba(246,250,255,0.9)] border-t border-[#bdcac1] p-4 max-w-screen-md mx-auto">
        {renderRewardAndEscrowInfo()}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            fullWidth 
            size="lg"
            leftIcon={<MessageCircle size={20} />}
            onClick={() => onChat(quest.id)}
          >
            Chat
          </Button>
          {renderActionButton()}
        </div>
      </div>
    );
  };

  // Perspective Views
  const renderCreatorPerspective = () => {
    return (
      <PageLayout
        header={
          <PageHeader
            title="Detail quest"
            onBack={onBack}
            rightAction={
              <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
                <Share2 size={20} className="text-[#141d23]" />
              </button>
            }
          />
        }
        footer={renderCreatorFooter()}
      >
        <div className="pb-40">
          {renderHeroImage()}
          <div className="px-5 py-4 flex flex-col gap-6">
            {renderHeaderInfo()}
            {renderDescription()}
            {renderCreatorProfile()}
            {renderLocationDetails()}
            {renderMapPreview()}
          </div>
        </div>
      </PageLayout>
    );
  };

  const renderAdventurerPerspective = () => {
    const revieweeName = creator?.name || 'Pengguna';

    return (
      <>
        <PageLayout
          header={
            <PageHeader
              title="Detail quest"
              onBack={onBack}
              rightAction={
                <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Share2 size={20} className="text-[#141d23]" />
                </button>
              }
            />
          }
          footer={renderAdventurerFooter()}
        >
          <div className="pb-40">
            {renderHeroImage()}
            <div className="px-5 py-4 flex flex-col gap-6">
              {renderHeaderInfo()}
              {renderEvidenceSection()}
              {renderDescription()}
              {renderCreatorProfile()}
              {renderLocationDetails()}
              {renderMapPreview()}
            </div>
          </div>
        </PageLayout>

        <ReviewDialog
          isOpen={showReviewDialog}
          onClose={() => setShowReviewDialog(false)}
          onSubmit={handleReviewSubmit}
          revieweeName={revieweeName}
          role="creator"
        />
      </>
    );
  };

  // Render based on user perspective
  if (isCreator) {
    return renderCreatorPerspective();
  }
  return renderAdventurerPerspective();
};

export default QuestDetailPage;
