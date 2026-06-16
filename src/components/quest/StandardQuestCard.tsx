/**
 * Kartu quest standar untuk daftar umum.
 * Digunakan saat: Halaman utama atau hasil pencarian.
 */
import React from 'react';
import { QuestCard } from './QuestCard';
import type { Quest } from '../../types';

interface StandardQuestCardProps {
  quest: Quest;
  onClick?: () => void;
}

export const StandardQuestCard: React.FC<StandardQuestCardProps> = ({ quest, onClick }) => {
  return (
    <QuestCard
      variant="standard"
      category={quest.category}
      title={quest.title}
      price={quest.price}
      distance={quest.distance}
      description={quest.description}
      image={quest.image}
      createdAt={quest.createdAt}
      onClick={onClick}
    />
  );
};
