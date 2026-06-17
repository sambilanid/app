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
import { getQuestDisplayInfo } from '../../utils/questUtils';

interface ActivityQuestCardProps {
  quest: Quest;
  onChat?: () => void;
  onFinish?: () => void;
  onReview?: () => void;
  onClick?: () => void;
}

export const ActivityQuestCard: React.FC<ActivityQuestCardProps> = ({
  quest,
  onChat,
  onFinish,
  onReview,
  onClick
}) => {
  const { state } = useApp();
  const displayInfo = getQuestDisplayInfo(quest, state.currentUserId);
  
  const priceLabel = (quest.status === 'active' || quest.status === 'pending' || displayInfo.status === 'applying') ? 'Budget' : 'Total pendapatan';

  const isCreator = quest.creatorId === state.currentUserId;
  const canReview = quest.status === 'completed' && 
    ((isCreator && !quest.creatorReviewed) || (!isCreator && !quest.takerReviewed));

  return (
    <QuestCard
      variant="activity"
      category={quest.category}
      title={quest.title}
      price={quest.price}
      image={quest.image}
      createdAt={quest.createdAt}
      location={quest.location || quest.distance}
      status={displayInfo.status}
      customStatusLabel={displayInfo.label}
      priceLabel={priceLabel}
      onClick={onClick}
      footer={
        <div className="flex gap-2">
          {!(displayInfo.status === 'waiting_adventurer') && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={onChat}
              className="w-[40px] h-[40px] !p-0 rounded-full text-primary"
            >
              <MessageCircle size={18} />
            </Button>
          )}
          {quest.status === 'active' && onFinish && (
            <Button 
              size="sm"
              onClick={onFinish}
              className="px-4 py-2 rounded-full !text-[12px] !font-bold"
            >
              Selesaikan
            </Button>
          )}
          {canReview && onReview && (
            <Button 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onReview();
              }}
              className="px-4 py-2 rounded-full !text-[12px] !font-bold"
            >
              Beri Ulasan
            </Button>
          )}
        </div>      }
    />
  );
};
