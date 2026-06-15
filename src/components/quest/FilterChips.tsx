/**
 * Komponen chip untuk filter atau pengurutan data.
 * Digunakan saat: Memberikan pilihan filter cepat di halaman hasil pencarian atau list quest.
 */
import React from 'react';

interface FilterChipsProps {
  label: string;
  options: string[];
}

export const FilterChips: React.FC<FilterChipsProps> = ({ label, options }) => {
  return (
    <div className="px-[20px] mt-4">
      <h2 className="text-[12px] font-bold tracking-[1.2px] uppercase mb-2">
        {label}
      </h2>
      <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2">
        {options.map((option, index) => (
          <button 
            key={option}
            className={`px-[16px] py-[8px] rounded-full text-[14px] font-semibold whitespace-nowrap ${index === 0 ? 'bg-primary text-white' : 'bg-[#e0e9f2] text-[#3e4943]'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
