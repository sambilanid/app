/**
 * Kartu hasil pencarian atau pencocokan quest.
 * Digunakan saat: Halaman hasil pencarian.
 */
import React from 'react';
import { QuestCard } from './QuestCard';

interface ResultCardProps {
  category: string;
  title: string;
  price: string;
  distance: string;
  description: string;
  image: string;
  onClick?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = (props) => {
  return (
    <QuestCard
      {...props}
      variant="result"
    />
  );
};
