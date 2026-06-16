/**
 * Untuk menampilkan label kategori atau status pendek.
 * Digunakan saat: Butuh penanda visual ringkas.
 */
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary',
  className = '' 
}) => {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-[#ecf5fe] text-primary border-[#6ddbad]',
  };

  return (
    <div className={`px-2 py-0.5 rounded-full border text-[0.625rem] font-bold tracking-tight uppercase inline-block ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
