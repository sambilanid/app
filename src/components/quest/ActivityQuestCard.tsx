/**
 * Halaman kartu quest untuk daftar aktivitas (kerjaan saya / buatan saya).
 * Digunakan saat: Halaman Aktivitas.
 */
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { QuestCard } from './QuestCard';
import { Button } from '../common/Button';
import type { Quest } from '../../types';
import { useApp } from '../../store/AppContext';

interface ActivityQuestCardProps {
  quest: Quest;
  onChat?: () => void;
  onFinish?: () => void;
  onClick?: () => void;
}

export const ActivityQuestCard: React.FC<ActivityQuestCardProps> = ({
  quest,
  onChat,
  onFinish,
  onClick
}) => {
  const { state } = useApp();
  const isApplicant = quest.applicantIds?.includes(state.currentUserId!) && quest.status === 'available';
  const isCreator = quest.creatorId === state.currentUserId;
  
  let displayStatus = isApplicant ? 'applying' : quest.status;
  let customLabel: string | undefined;

  if (isCreator) {
    if (quest.status === 'active') {
      customLabel = 'Sedang dikerjakan Adventurer';
    } else if (quest.status === 'available') {
      if (!quest.applicantIds || quest.applicantIds.length === 0) {
        customLabel = 'Menunggu pemohon';
      } else {
        customLabel = `${quest.applicantIds.length} pemohon`;
      }
    }
  }

  const priceLabel = (quest.status === 'active' || quest.status === 'pending' || isApplicant) ? 'Budget' : 'Total pendapatan';

  return (
    <QuestCard
      variant="activity"
      category={quest.category}
      title={quest.title}
      price={quest.price}
      image={quest.image}
      createdAt={quest.createdAt}
      location={quest.location || quest.distance}
      status={displayStatus as any}
      customStatusLabel={customLabel}
      priceLabel={priceLabel}
      onClick={onClick}
      footer={
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={onChat}
            className="w-[40px] h-[40px] !p-0 rounded-full text-primary"
          >
            <MessageCircle size={18} />
          </Button>
          {quest.status === 'active' && onFinish && (
            <Button 
              size="sm"
              onClick={onFinish}
              className="px-4 py-2 rounded-full !text-[12px] !font-bold"
            >
              Selesaikan
            </Button>
          )}
        </div>      }
    />
  );
};
