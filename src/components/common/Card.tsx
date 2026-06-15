/**
 * Komponen kontainer dasar dengan bayangan dan border.
 * Digunakan saat: Sebagai dasar untuk berbagai elemen UI berbasis kartu.
 */
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white border border-gray-100 rounded-[16px] ${onClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
