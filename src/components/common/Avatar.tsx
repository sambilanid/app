/**
 * Komponen untuk menampilkan foto profil pengguna.
 * Digunakan saat: Untuk identitas visual user.
 */
import React from 'react';

interface AvatarProps {
  src?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, initials, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-[12px]',
    md: 'w-12 h-12 text-[16px]',
    lg: 'w-16 h-16 text-[20px]',
  };

  return (
    <div className={`rounded-full flex items-center justify-center overflow-hidden bg-[#e0e9f2] text-primary font-bold ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt={initials || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
