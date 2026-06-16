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
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${sizes[size]} rounded-lg object-cover shrink-0 ${className}`} 
    />
  );
};
