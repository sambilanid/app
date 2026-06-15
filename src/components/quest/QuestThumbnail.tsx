/**
 * Menampilkan gambar preview untuk quest.
 * Digunakan saat: Dalam kartu quest atau detail quest.
 */
import React from 'react';

interface QuestThumbnailProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const QuestThumbnail: React.FC<QuestThumbnailProps> = ({ 
  src, 
  alt, 
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-[48px] h-[48px]',
    md: 'w-[64px] h-[64px]',
    lg: 'w-[80px] h-[80px]',
  };

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${sizes[size]} rounded-[8px] object-cover shrink-0 ${className}`} 
    />
  );
};
