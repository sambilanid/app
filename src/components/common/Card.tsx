/**
 * Komponen kontainer dasar dengan bayangan dan border.
 * Digunakan saat: Sebagai dasar untuk berbagai elemen UI berbasis kartu.
 */
import React, { useState } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = () => {
    if (onClick) setIsPressed(true);
  };

  const handlePointerUpOrCancel = () => {
    setIsPressed(false);
  };

  return (
    <div 
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUpOrCancel}
      onPointerLeave={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      className={`bg-white border border-gray-100 rounded-2xl ${onClick ? 'cursor-pointer transition-transform' : ''} ${isPressed ? 'scale-[0.99]' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
