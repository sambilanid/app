/**
 * Komponen kartu quest multifungsi.
 * Digunakan saat: Menampilkan ringkasan quest di berbagai list (home, search, activity).
 */
import React from 'react';
import { MapPin } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { QuestThumbnail } from './QuestThumbnail';
import { QuestPrice } from './QuestPrice';
import { getRelativeTime } from '../../utils/dateUtils';

interface QuestCardProps {
  category: string;
  title: string;
  price: string;
  distance?: string;
  image: string;
  createdAt?: string;
  description?: string;
  location?: string;
  status?: 'active' | 'completed' | 'canceled' | 'available' | 'pending' | 'applying';
  customStatusLabel?: string;
  priceLabel?: string;
  variant?: 'standard' | 'active' | 'activity';
  footer?: React.ReactNode;
  onClick?: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  category,
  title,
  price,
  distance,
  image,
  createdAt,
  description,
  location,
  status,
  customStatusLabel,
  priceLabel,
  variant = 'standard',
  footer,
  onClick
}) => {
  const relativeTime = getRelativeTime(createdAt);

  if (variant === 'active') {
    return (
      <Card onClick={onClick} className="p-4 flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <QuestThumbnail src={image} alt={title} />
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-dark text-[16px] font-bold truncate">{title}</h3>
              <Badge className="shrink-0 !bg-transparent !border-none !p-0">{category}</Badge>
            </div>
            <div className="flex justify-between items-end gap-2">
              <QuestPrice price={price} distance={distance} time={relativeTime} />
              {footer}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'activity') {
    return (
      <Card onClick={onClick} className="p-[16px] flex flex-col gap-[12px]">
        <div className="flex justify-between items-center">
          <div className="flex flex-col min-w-0">
            <Badge className="w-fit !bg-transparent !border-none !p-0">{category}</Badge>
            <span className="text-[#141d23] text-[10px] opacity-60 mt-1 truncate">
              {relativeTime}
            </span>
          </div>
          {status && (
            <div className={`px-[10px] py-[3px] rounded-full text-[11px] font-bold ${
              status === 'active' ? 'text-[#7ea400] bg-[#7ea400]/10' : 
              status === 'pending' ? 'text-orange-500 bg-orange-500/10' :
              status === 'applying' || status === 'available' ? 'text-blue-500 bg-blue-500/10' :
              'text-[#00694b] bg-[#00694b]/10'
            }`}>
              {customStatusLabel || (
                status === 'active' ? 'Aktif' : 
                status === 'pending' ? 'Menunggu Konfirmasi' : 
                status === 'applying' ? 'Menunggu Persetujuan' :
                'Selesai'
              )}
            </div>
          )}
        </div>

        <div className="h-px bg-gray-100 w-full" />

        <div className="flex gap-[12px] items-center">
          <QuestThumbnail src={image} alt={title} size="sm" />
          <div className="flex flex-col min-w-0">
            <h3 className="text-[#141d23] text-[16px] font-semibold leading-tight truncate">{title}</h3>
            {(location || distance) && (
              <div className="flex items-center gap-1 opacity-60 min-w-0">
                <MapPin size={12} className="text-[#3e4943] shrink-0" />
                <span className="text-[#3e4943] text-[11px] truncate">{location || distance}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-end">
          <QuestPrice price={price} label={priceLabel} size="sm" />
          {footer}
        </div>
      </Card>
    );
  }

  // Default: standard
  return (
    <Card onClick={onClick} className="p-[17px] flex flex-col gap-3">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <Badge className="w-fit !bg-transparent !border-none !p-0">{category}</Badge>
          <h3 className="text-[#141d23] text-[20px] font-bold leading-[28px] truncate">{title}</h3>
        </div>
        <QuestPrice 
          price={price} 
          distance={distance} 
          time={relativeTime}
          alignment="right" 
          className="shrink-0" 
        />
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
;
