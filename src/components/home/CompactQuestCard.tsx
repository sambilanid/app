/**
 * Kartu quest versi ringkas.
 * Digunakan saat: Daftar quest yang padat atau di bagian rekomendasi.
 */
import React from 'react';
import { QuestCard } from '../quest/QuestCard';

interface CompactQuestCardProps {
  category: string;
  title: string;
  price: string;
  distance: string;
  image: string;
  onClick?: () => void;
}

export const CompactQuestCard: React.FC<CompactQuestCardProps> = (props) => {
  return (
    <QuestCard
      {...props}
      variant="compact"
    />
  );
};
