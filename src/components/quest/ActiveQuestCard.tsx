/**
 * Kartu quest aktif yang sedang dikerjakan.
 * Digunakan saat: Halaman Beranda (Daftar Quest Aktif) atau Halaman Aktivitas.
 */
import { MessageCircle } from 'lucide-react';
import { QuestCard } from './QuestCard';
import { Button } from '../common/Button';
import type { Quest } from '../../types';

interface ActiveQuestCardProps {
  quest: Quest;
  onChat?: () => void;
  onFinish?: () => void;
  onClick?: () => void;
}

export const ActiveQuestCard: React.FC<ActiveQuestCardProps> = ({ 
  quest, 
  onChat, 
  onFinish,
  onClick 
}) => {
  return (
    <QuestCard
      variant="active"
      category={quest.category}
      title={quest.title}
      price={quest.price}
      distance={quest.distance}
      image={quest.image}
      createdAt={quest.createdAt}
      onClick={onClick}
      footer={
        <div className="flex gap-2 justify-end">
          <Button 
            variant="secondary"
            size="sm"
            onClick={onChat}
            className="w-[40px] h-[40px] !p-0 rounded-full"
          >
            <MessageCircle size={18} />
          </Button>
          {onFinish && (
            <Button 
              size="sm"
              onClick={onFinish}
              className="px-4 py-2 rounded-full !text-[12px] !font-bold"
            >
              Selesaikan
            </Button>
          )}
        </div>
      }
    />
  );
};
