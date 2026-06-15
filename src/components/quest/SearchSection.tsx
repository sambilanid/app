/**
 * Bagian input dan filter pencarian.
 * Digunakan saat: Bagian atas halaman pencarian.
 */
import React from 'react';
import { SearchInput } from '../common/SearchInput';

export const SearchSection: React.FC = () => {
  return (
    <div className="px-[20px] w-full mt-4">
      <SearchInput placeholder="Cari quest" />
    </div>
  );
};
