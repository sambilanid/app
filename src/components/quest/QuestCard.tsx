/**
 * Komponen kartu quest multifungsi.
 * Digunakan saat: Menampilkan ringkasan quest di berbagai list (home, search, activity).
 */
import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { QuestThumbnail } from './QuestThumbnail';
import { getRelativeTime } from '../../utils/dateUtils';

interface QuestPriceProps {
  price: string;
  label?: string;
  distance?: string;
  time?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  alignment?: 'left' | 'right';
}

const QuestPrice: React.FC<QuestPriceProps> = ({ 
  price, 
  label,
  distance, 
  time,
  className = '',
  size = 'md',
  alignment = 'left'
}) => {
  const priceSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const containerAlign = alignment === 'right' ? 'items-end' : 'items-start';
  const distanceAlign = alignment === 'right' ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex flex-col min-w-0 ${containerAlign} ${className}`}>
      {label && <span className="text-[#141d23] text-xs opacity-70 mb-0.5">{label}</span>}
      <p className={`text-primary font-bold leading-tight ${priceSizes[size]}`}>{price}</p>
      {(distance || time) && (
        <div className={`flex items-center gap-2 text-[#5c5f60] text-xs tracking-tight mt-1 w-full ${distanceAlign}`}>
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
              <h3 className="text-dark text-base font-bold truncate">{title}</h3>
              <Badge className="shrink-0 !bg-transparent !border-none !p-0">{category}</Badge>
            </div>
            <div className="flex flex-col xs:flex-row justify-between xs:items-end gap-2 min-w-0">
              <QuestPrice price={price} distance={distance} />
              <div className="xs:shrink-0 flex justify-end">
                {footer}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'activity') {
    return (
      <Card onClick={onClick} className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex flex-col min-w-0">
            <Badge className="w-fit !bg-transparent !border-none !p-0">{category}</Badge>
            <span className="text-[#141d23] text-[10px] opacity-60 mt-1 truncate">
              {relativeTime}
            </span>
          </div>
          {status && (
            <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
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

        <div className="flex gap-3 items-center">
          <QuestThumbnail src={image} alt={title} size="sm" />
          <div className="flex flex-col min-w-0">
            <h3 className="text-[#141d23] text-base font-semibold leading-tight truncate">{title}</h3>
            {(location || distance) && (
              <div className="flex items-center gap-1 opacity-60 min-w-0">
                <MapPin size={12} className="text-[#3e4943] shrink-0" />
                <span className="text-[#3e4943] text-[11px] truncate">{location || distance}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col xs:flex-row justify-between xs:items-end gap-2">
          <QuestPrice price={price} label={priceLabel} size="sm" />
          <div className="xs:shrink-0 flex justify-end">
            {footer}
          </div>
        </div>
      </Card>
    );
  }

  // Default: standard
  return (
    <Card onClick={onClick} className="p-4 xs:p-5 flex flex-col gap-3">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <Badge className="w-fit !bg-transparent !border-none !p-0">{category}</Badge>
          <h3 className="text-[#141d23] text-xl font-bold leading-tight truncate">{title}</h3>
          {(distance || relativeTime) && (
            <div className="flex items-center gap-3 text-[#5c5f60] text-xs mt-1">
              {distance && (
                <div className="flex items-center gap-1">
                  <MapPin size={12} className="shrink-0" />
                  <span>{distance}</span>
                </div>
              )}
              {relativeTime && (
                <div className="flex items-center gap-1">
                  <Clock size={12} className="shrink-0" />
                  <span>{relativeTime}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <QuestPrice 
          price={price} 
          alignment="right" 
          className="shrink-0" 
        />
      </div>
      
      <div className="flex gap-4 items-center">
        <QuestThumbnail src={image} alt={title} />
        <p className="text-[#3e4943] text-base leading-normal flex-1 line-clamp-2">
          {description}
        </p>
      </div>

      {footer}
    </Card>
  );
};
