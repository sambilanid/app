/**
 * Halaman detail informasi quest.
 * Digunakan saat: User ingin melihat detail lengkap dan mengambil quest.
 */
import React from 'react';
import { Share2, MessageCircle, ShieldCheck } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ReviewDialog } from '../components/common/ReviewDialog';
import { QuestDetailContent } from '../components/quest/QuestDetailContent';

import { useApp } from '../store/AppContext';
import { useDialog } from '../components/common/Dialog';

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
  const creator = quest ? state.users.find(u => u.id === quest.creatorId) : null;
  const displayInfo = quest ? state.user ? getQuestDisplayInfo(quest, state.currentUserId) : null : null;

  // Inline helper since we removed questUtils import to keep imports clean
  function getQuestDisplayInfo(q: typeof quest, uid: string | null) {
    if (!uid || !q) return { label: 'Tersedia', status: 'available' };
    const isTaker = q.takerId === uid;
    const isApplicant = q.applicantIds?.includes(uid);
    if (isTaker) {
      if (q.status === 'active') return { label: 'Sedang Dikerjakan', status: 'on_going' };
      if (q.status === 'pending') return { label: 'Menunggu Konfirmasi', status: 'waiting_confirmation' };
      if (q.status === 'disputed') return { label: 'Dalam Mediasi', status: 'disputed' };
      if (q.status === 'completed') return { label: 'Selesai', status: 'completed' };
    }
    if (isApplicant && q.status === 'available') {
      return { label: 'Menunggu Persetujuan', status: 'applying' };
    }
    if (q.status === 'available') {
      return { label: 'Tersedia', status: 'available' };
    }
    return { label: 'Selesai', status: 'completed' };
  }

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!quest) return;
    const revieweeId = quest.creatorId;
    
    if (revieweeId) {
      submitReview(quest.id, revieweeId, rating, comment, 'creator');
    }
    setShowReviewDialog(false);
  };

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
          <QuestDetailContent
            quest={quest}
            creator={creator}
            onViewProfile={onViewProfile}
            evidenceSection={renderEvidenceSection()}
          />
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

export default QuestDetailPage;
