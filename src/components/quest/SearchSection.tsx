/**
 * Bagian input dan filter pencarian.
 * Digunakan saat: Bagian atas halaman pencarian.
 */
import React from 'react';
import { SearchInput } from '../common/SearchInput';

interface SearchSectionProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchSection: React.FC<SearchSectionProps> = (props) => {
  return (
    <div className="px-[20px] w-full mt-4">
      <SearchInput placeholder="Cari quest" {...props} />
    </div>
  );
};
