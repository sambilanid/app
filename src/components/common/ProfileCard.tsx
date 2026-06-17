import React from 'react';
import { Card } from './Card';
import { Avatar } from './Avatar';

interface ProfileCardProps {
  name: string;
  avatar?: string;
  initials: string;
  rating: number;
  statsLabel: string;
  onClick?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

/**
 * Komponen kartu profil generik.
 * Digunakan untuk menampilkan informasi ringkas pengguna (creator, adventurer, applicant).
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  avatar,
  initials,
  rating,
  statsLabel,
  onClick,
  rightAction,
  className = ''
}) => {
  return (
    <Card 
      className={`p-4 ${onClick ? 'cursor-pointer active:scale-[0.98] transition-all' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar initials={initials} src={avatar} />
          <div>
            <p className="text-[#141d23] text-sm font-semibold">{name}</p>
            <div className="flex items-center gap-1 text-[#3e4943] text-xs font-bold">
              <span>★ {rating}</span>
              <span>•</span>
              <span>{statsLabel}</span>
            </div>
          </div>
        </div>
        {rightAction && (
          <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
            {rightAction}
          </div>
        )}
      </div>
    </Card>
  );
};
