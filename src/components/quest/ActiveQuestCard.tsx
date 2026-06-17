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
      status={quest.status}
      onClick={onClick}
      footer={
        quest.status === 'pending' || quest.status === 'disputed' ? (
          <div className="flex justify-end">
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
              quest.status === 'disputed' ? 'text-red-500 bg-red-500/10' : 'text-orange-500 bg-orange-500/10'
            }`}>
              {quest.status === 'disputed' ? 'Dalam Mediasi' : 'Menunggu Konfirmasi'}
            </span>
          </div>
        ) : (
          onFinish && (
            <div className="flex gap-2 justify-end">
              <Button 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onFinish();
                }}
                className="px-4 py-2 rounded-full !text-xs !font-bold"
              >
                Selesaikan
              </Button>
            </div>
          )
        )
      }
    />
  );
};
