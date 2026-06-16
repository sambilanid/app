/**
 * Menampilkan harga atau reward dari sebuah quest.
 * Digunakan saat: Dalam kartu quest atau detail quest.
 */
import React from 'react';
import { MapPin, Clock } from 'lucide-react';

interface QuestPriceProps {
  price: string;
  label?: string;
  distance?: string;
  time?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  alignment?: 'left' | 'right';
}

export const QuestPrice: React.FC<QuestPriceProps> = ({ 
  price, 
  label,
  distance, 
  time,
  className = '',
  size = 'md',
  alignment = 'left'
}) => {
  const priceSizes = {
    sm: 'text-[15px]',
    md: 'text-[18px]',
    lg: 'text-[22px]',
  };

  const containerAlign = alignment === 'right' ? 'items-end' : 'items-start';
  const distanceAlign = alignment === 'right' ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex flex-col ${containerAlign} ${className}`}>
      {label && <span className="text-[#141d23] text-[13px] opacity-70 mb-0.5">{label}</span>}
      <p className={`text-primary font-bold leading-tight ${priceSizes[size]}`}>{price}</p>
      {(distance || time) && (
        <div className={`flex items-center gap-2 text-[#5c5f60] text-[12px] tracking-[0.36px] mt-1 w-full ${distanceAlign}`}>
          {distance && (
            <div className="flex items-center gap-1 min-w-0">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{distance}</span>
            </div>
          )}
          {time && (
            <div className="flex items-center gap-1 min-w-0">
              <Clock size={12} className="shrink-0" />
              <span className="truncate">{time}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
