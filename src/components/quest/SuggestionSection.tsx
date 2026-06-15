/**
 * Bagian yang menampilkan saran kata kunci pencarian.
 * Digunakan saat: Membantu pengguna menemukan quest populer atau umum di halaman pencarian.
 */
import React from 'react';

const suggestions = ['Jastip', 'Antar Barang', 'Antar Jemput', 'Angkut Barang', 'Reparasi'];

interface SuggestionSectionProps {
  onSelect?: (query: string) => void;
}

export const SuggestionSection: React.FC<SuggestionSectionProps> = ({ onSelect }) => {
  return (
    <div className="px-[20px] mt-6">
      <h2 className="text-dark text-[12px] font-bold tracking-[1.2px] uppercase mb-4">
        SARAN PENCARIAN
      </h2>
      <div className="flex flex-wrap gap-3">
        {suggestions.map((item) => (
          <button 
            key={item}
            onClick={() => onSelect?.(item)}
            className="bg-[#dbe4ed] px-[20px] py-[10px] rounded-full text-[#141d23] text-[14px] font-semibold tracking-[0.14px] hover:bg-primary/10 transition-colors"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};
