/**
 * Menampilkan harga atau reward dari sebuah quest.
 * Digunakan saat: Dalam kartu quest atau detail quest.
 */
import React from 'react';
import { MapPin } from 'lucide-react';

interface QuestPriceProps {
  price: string;
  distance?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  alignment?: 'left' | 'right';
}

export const QuestPrice: React.FC<QuestPriceProps> = ({ 
  price, 
  distance, 
  className = '',
  size = 'md',
  alignment = 'left'
}) => {
  const priceSizes = {
    sm: 'text-[16px]',
    md: 'text-[20px]',
    lg: 'text-[24px]',
  };

  const containerAlign = alignment === 'right' ? 'items-end' : 'items-start';
  const distanceAlign = alignment === 'right' ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex flex-col ${containerAlign} ${className}`}>
      <p className={`text-primary font-bold leading-tight ${priceSizes[size]}`}>{price}</p>
      {distance && (
        <div className={`flex items-center gap-1 text-[#5c5f60] text-[12px] font-bold tracking-[0.36px] mt-0.5 ${distanceAlign}`}>
          <MapPin size={12} />
          <span>{distance}</span>
        </div>
      )}
    </div>
  );
};
