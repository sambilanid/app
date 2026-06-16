/**
 * Komponen input pencarian.
 * Digunakan saat: Untuk menerima input teks pencarian dari pengguna.
 */
import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ containerClassName = '', ...props }) => {
  return (
    <div className={`bg-white border border-[#bdcac1] flex gap-3 h-12 items-center px-4 rounded-xl w-full ${containerClassName}`}>
      <Search size={18} className="text-gray-text" />
      <input 
        type="text" 
        className="flex-1 text-base text-gray-text outline-none bg-transparent"
        {...props}
      />
    </div>
  );
};
