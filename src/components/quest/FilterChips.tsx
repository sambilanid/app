/**
 * Komponen chip untuk filter atau pengurutan data.
 * Digunakan saat: Memberikan pilihan filter cepat di halaman hasil pencarian atau list quest.
 */
import React from 'react';

interface FilterChipsProps {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="px-[20px] mt-4">
      <h2 className="text-[12px] font-bold tracking-[1.2px] uppercase mb-2">
        {label}
      </h2>
      <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2">
        {options.map((option) => (
          <button 
            key={option}
            onClick={() => onChange?.(option)}
            className={`px-[16px] py-[8px] rounded-full text-[14px] font-semibold whitespace-nowrap transition-all active:scale-95 ${
              value === option 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-[#e0e9f2] text-[#3e4943] hover:bg-gray-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
