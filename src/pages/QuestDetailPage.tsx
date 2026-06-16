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
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';

import mapPreview from '../assets/map-preview.png';

import { useApp } from '../store/AppContext';
import { useDialog } from '../components/common/Dialog';
import { getRelativeTime } from '../utils/dateUtils';
import { getQuestDisplayInfo } from '../utils/questUtils';

interface QuestDetailPageProps {
  questId: string | null;
  onBack: () => void;
  onChat: (questId: string) => void;
  onFinish: (questId: string) => void;
}

const QuestDetailPage: React.FC<QuestDetailPageProps> = ({ questId, onBack, onChat, onFinish }) => {
  const { state, applyForQuest, cancelApplication } = useApp();
  const { showDialog } = useDialog();
  const quest = state.allQuests.find(q => q.id === questId);
  const displayInfo = quest ? getQuestDisplayInfo(quest, state.currentUserId) : null;
  const creator = quest ? state.users.find(u => u.id === quest.creatorId) : null;

  const handleApplyQuest = () => {
    if (!quest) return;
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
      footer={
        <div className="backdrop-blur-[6px] bg-[rgba(246,250,255,0.9)] border-t border-[#bdcac1] p-4 max-w-screen-md mx-auto">
          <div className="flex justify-between items-center mb-4 px-2">
            <div>
              <p className="text-[#3e4943] text-[12px] font-bold uppercase tracking-wider">Reward quest</p>
              <p className="text-primary text-[20px] font-bold">{quest.price}</p>
            </div>
            <div className="text-right">
              <p className="text-[#3e4943] text-[12px] font-bold uppercase tracking-wider">Dana dijamin escrow</p>
              <div className="flex items-center justify-end gap-1 text-primary">
                <ShieldCheck size={14} />
                <span className="text-[12px] font-bold">Aman</span>
              </div>
            </div>
          </div>
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
            {displayInfo?.status === 'on_going' ? (
              <Button 
                fullWidth 
                size="lg"
                onClick={() => onFinish(quest.id)}
              >
                Selesaikan
              </Button>
            ) : displayInfo?.status === 'applying' ? (
              <Button 
                variant="outline"
                fullWidth 
                size="lg" 
                className="border-red-200 text-red-500 hover:bg-red-50"
                onClick={handleCancelApplication}
              >
                Batalkan permohonan
              </Button>
            ) : (
              <Button 
                fullWidth 
                size="lg"
                onClick={handleApplyQuest}
              >
                Ambil quest ini
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="pb-40">
        {/* Hero Image */}
        <div className="bg-[#8af7c8] h-[192px] w-full flex items-center justify-center overflow-hidden">
          <img src={quest.image} alt={quest.title} className="w-full h-full object-cover opacity-80" />
        </div>

        <div className="px-[20px] py-[16px] flex flex-col gap-6">
          {/* Header Info */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="w-fit">{quest.category}</Badge>
              <span className="text-[#141d23] text-[12px] font-semibold opacity-60">
                {getRelativeTime(quest.createdAt)}
              </span>
            </div>
            <h2 className="text-[#141d23] text-[24px] font-bold">{quest.title}</h2>
            
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-2 text-[#3e4943]">
                <MapPin size={16} className="text-primary" />
                <div>
                  <p className="text-[14px] font-semibold">{quest.location}</p>
                  <p className="text-[12px]">{quest.distance} dari lokasi</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#3e4943]">
                <Clock size={16} className="text-primary" />
                <p className="text-[14px] font-semibold">Deadline {quest.deadline || 'Hari ini'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-[#3e4943] text-[16px] leading-[24px]">
            {quest.description}
          </p>

          {/* Creator Profile */}
          {creator && (
            <Card className="p-[17px] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar initials={creator.initials} src={creator.avatar} />
                <div>
                  <p className="text-[#141d23] text-[14px] font-semibold">{creator.name}</p>
                  <div className="flex items-center gap-1 text-[#3e4943] text-[12px] font-bold">
                    <span>★ {creator.rating}</span>
                    <span>•</span>
                    <span>{creator.questsCreated} quest dibuat</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Location Card */}
          {(quest.fromLocation || quest.toLocation) && (
            <Card className="p-[17px] flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <MapPin size={24} />
              </div>
              <div>
                  {quest.fromLocation && <p className="text-[#141d23] text-[14px] font-semibold">Dari: {quest.fromLocation}</p>}
                  {quest.toLocation && <p className="text-[#141d23] text-[14px] font-semibold">Ke: {quest.toLocation}</p>}
              </div>
            </Card>
          )}

          {/* Map Preview */}
          <div className="bg-[#e0e9f2] border border-[#bdcac1] h-[128px] rounded-[16px] overflow-hidden relative">
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

export default QuestDetailPage;
