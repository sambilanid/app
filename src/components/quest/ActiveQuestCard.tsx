/**
 * Kartu quest aktif yang sedang dikerjakan.
 * Digunakan saat: Halaman Beranda (Daftar Quest Aktif) atau Halaman Aktivitas.
 */
import { QuestCard } from './QuestCard';
import { Button } from '../common/Button';
import type { Quest } from '../../types';

interface ActiveQuestCardProps {
  quest: Quest;
  onFinish?: () => void;
  onClick?: () => void;
}

export const ActiveQuestCard: React.FC<ActiveQuestCardProps> = ({ 
  quest, 
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
        onFinish && (
          <div className="flex gap-2 justify-end">
            <Button 
              size="sm"
              onClick={onFinish}
              className="px-4 py-2 rounded-full !text-xs !font-bold"
            >
              Selesaikan
            </Button>
          </div>
        )
      }
    />
  );
};
