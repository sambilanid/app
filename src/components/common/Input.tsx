/**
 * Komponen input teks standar.
 * Digunakan saat: Menerima input teks, email, password, atau nomor telepon dari pengguna.
 */
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  containerClassName = '', 
  leftIcon,
  className = '',
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label className="text-[#141d23] text-sm font-bold ml-1">
          {label}
        </label>
      )}
      <div className={`
        bg-white border flex gap-3 h-12 items-center px-4 rounded-xl w-full transition-all
        ${error ? 'border-red-500' : 'border-[#bdcac1] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'}
        ${className}
      `}>
        {leftIcon && <span className="text-gray-400">{leftIcon}</span>}
        <input 
          className="flex-1 text-base text-[#141d23] outline-none bg-transparent placeholder:text-gray-400"
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-xs ml-1 font-medium">{error}</p>}
    </div>
  );
};
