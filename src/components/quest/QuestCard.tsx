/**
 * Komponen kartu quest multifungsi.
 * Digunakan saat: Menampilkan ringkasan quest di berbagai list (home, search, activity).
 */
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { QuestThumbnail } from './QuestThumbnail';
import { QuestPrice } from './QuestPrice';

interface QuestCardProps {
  category: string;
  title: string;
  price: string;
  distance: string;
  image: string;
  description?: string;
  variant?: 'compact' | 'active' | 'result';
  footer?: React.ReactNode;
  onClick?: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  category,
  title,
  price,
  distance,
  image,
  description,
  variant = 'result',
  footer,
  onClick
}) => {
  if (variant === 'compact') {
    return (
      <Card onClick={onClick} className="p-4 flex items-center justify-between">
        <div className="flex gap-3 items-center overflow-hidden">
          <QuestThumbnail src={image} alt={title} />
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-dark text-[16px] font-bold truncate">{title}</h3>
              <Badge>{category}</Badge>
            </div>
            <QuestPrice price={price} distance={distance} />
          </div>
        </div>
        <div className="bg-[#f6faff] p-2 rounded-full text-primary shrink-0 ml-2">
          <ChevronRight size={24} />
        </div>
      </Card>
    );
  }

  if (variant === 'active') {
    return (
      <Card onClick={onClick} className="p-4 flex flex-col gap-4">
        <div className="flex gap-3">
          <QuestThumbnail src={image} alt={title} />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-dark text-[16px] font-bold truncate">{title}</h3>
              <Badge className="shrink-0">{category}</Badge>
            </div>
            <QuestPrice price={price} distance={distance} className="mt-1" />
          </div>
        </div>
        {footer}
      </Card>
    );
  }

  // Default: result
  return (
    <Card onClick={onClick} className="p-[17px] flex flex-col gap-3">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <Badge className="w-fit">{category}</Badge>
          <h3 className="text-[#141d23] text-[20px] font-bold leading-[28px] truncate">{title}</h3>
        </div>
        <QuestPrice price={price} distance={distance} alignment="right" className="shrink-0" />
      </div>
      
      <div className="flex gap-4 items-center">
        <QuestThumbnail src={image} alt={title} />
        <p className="text-[#3e4943] text-[16px] leading-[24px] flex-1 line-clamp-2">
          {description}
        </p>
      </div>

      {footer}
    </Card>
  );
};
