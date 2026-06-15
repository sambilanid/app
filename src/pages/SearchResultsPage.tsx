/**
 * Halaman hasil pencarian quest.
 * Digunakan saat: Menampilkan daftar quest yang sesuai dengan kueri pencarian.
 */
import React from 'react';
import { FilterChips } from '../components/quest/FilterChips';
import { ResultCard } from '../components/quest/ResultCard';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { SearchInput } from '../components/common/SearchInput';

import questGacoan from '../assets/quest-gacoan.png';
import questAlfamart from '../assets/quest-alfamart.png';
import questOlehOleh from '../assets/quest-oleholeh.png';

interface SearchResultsPageProps {
  onBack: () => void;
  onSelectQuest: (questId: string) => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ onBack, onSelectQuest }) => {
  return (
    <PageLayout
      hasNavbar
      header={
        <PageHeader
          onBack={onBack}
          centerContent={
            <SearchInput 
              defaultValue="Jastip" 
              containerClassName="h-[40px] bg-[#e6eff8] border-[rgba(189,202,193,0.3)]" 
            />
          }
        />
      }
    >
      {/* Results Header */}
      <div className="px-[20px] py-4 border-b border-[#dbe4ed]">
        <h1 className="text-[#141d23] text-[16px] leading-[24px]">Hasil pencarian untuk "Jastip"</h1>
        <p className="text-[#5c5f60] text-[16px] leading-[24px]">12 Quest ditemukan</p>
      </div>

      <FilterChips 
        label="Urutkan Menurut" 
        options={['Terdekat', 'Reward Tertinggi', 'Terbaru', 'Angkut', 'Digital', 'Lainnya']} 
      />

      <FilterChips 
        label="KATEGORI" 
        options={['Semua', 'Antar/Jemput', 'Belanja', 'Makanan', 'Servis']} 
      />

      {/* Results List */}
      <div className="px-[20px] mt-6 flex flex-col gap-4">
        <ResultCard 
          category="JASA TITIP"
          title="Jastip Mie Gacoan"
          price="Rp15.000"
          distance="0.8 km"
          description="Beli 2 porsi Mie Iblis level 4, titip di kawasan perkantoran Purbalingga Food Centre."
          image={questGacoan}
          onClick={() => onSelectQuest('q1')}
        />
        <ResultCard 
          category="JASA TITIP"
          title="Jastip Alfamart"
          price="Rp18.000"
          distance="1.2 km"
          description="Tolong belikan galon Aqua dan sabun mandi di Alfamart depan kampus."
          image={questAlfamart}
          onClick={() => onSelectQuest('q2')}
        />
        <ResultCard 
          category="JASA TITIP"
          title="Jastip Oleh-oleh"
          price="Rp25.000"
          distance="1.2 km"
          description="Titip makanan khas Purbalingga dong, buat oleh-oleh saudaraku."
          image={questOlehOleh}
          onClick={() => onSelectQuest('q3')}
        />
      </div>
    </PageLayout>
  );
};

export default SearchResultsPage;
