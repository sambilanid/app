/**
 * Kartu quest yang sedang dikerjakan.
 * Digunakan saat: Halaman Home untuk menunjukkan status quest aktif.
 */
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { QuestCard } from '../quest/QuestCard';

import type { Quest } from '../../types';

export const ActiveQuestCard: React.FC<{ 
  quest: Quest;
  onChat?: () => void; 
  onFinish?: () => void; 
  onClick?: () => void;
}> = ({ quest, onChat, onFinish, onClick }) => {
  return (
    <div className="px-[20px] mt-6">
      <h2 className="text-[#3e4943] text-[16px] mb-2 px-1">Quest dikerjakan</h2>
      <QuestCard
        variant="active"
        category={quest.category}
        title={quest.title}
        price={quest.price}
        distance={quest.distance}
        image={quest.image}
        onClick={onClick}
        footer={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              fullWidth 
              leftIcon={<MessageCircle size={18} />}
              onClick={onChat}
            >
              Chat
            </Button>
            <Button 
              fullWidth 
              onClick={onFinish}
            >
              Selesai + Bukti
            </Button>
          </div>
        }
      />
    </div>
  );
};
