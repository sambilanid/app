/**
 * Komponen tombol utama.
 * Digunakan saat: Untuk semua aksi klik user.
 */
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  ...props 
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick?.(e);
  };

  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all active:scale-[0.98] rounded-[12px]';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    outline: 'border border-[#bdcac1] text-dark hover:bg-gray-50',
    ghost: 'text-primary hover:bg-primary/5',
    secondary: 'bg-[#f6faff] text-primary hover:bg-primary/10',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  const handleInteraction = (e: React.MouseEvent | React.PointerEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <button 
      onClick={handleClick}
      onPointerDown={handleInteraction}
      onMouseDown={handleInteraction}
      onTouchStart={handleInteraction}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
