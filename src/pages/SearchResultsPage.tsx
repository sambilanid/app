/**
 * Halaman hasil pencarian quest.
 * Digunakan saat: Menampilkan daftar quest yang sesuai dengan kueri pencarian.
 */
import React, { useState } from 'react';
import { FilterChips } from '../components/quest/FilterChips';
import { ResultCard } from '../components/quest/ResultCard';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { SearchInput } from '../components/common/SearchInput';
import { useApp } from '../store/AppContext';

interface SearchResultsPageProps {
  searchQuery: string;
  onBack: () => void;
  onSelectQuest: (questId: string) => void;
  onSearch: (query: string) => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ 
  searchQuery, 
  onBack, 
  onSelectQuest,
  onSearch 
}) => {
  const { state } = useApp();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [selectedSort, setSelectedSort] = useState('Terdekat');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
  };

  const parseDistance = (distStr: string) => {
    return parseFloat(distStr.replace(/[^0-9.]/g, '')) || 0;
  };

  const filteredAndSortedQuests = state.availableQuests
    .filter(quest => {
      const matchesQuery = 
        quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quest.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'Semua' || 
        quest.category.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => {
      if (selectedSort === 'Terdekat') {
        return parseDistance(a.distance) - parseDistance(b.distance);
      }
      if (selectedSort === 'Reward Tertinggi') {
        return parsePrice(b.price) - parsePrice(a.price);
      }
      if (selectedSort === 'Terbaru') {
        // Simple heuristic: newer quests have "higher" IDs or were added later
        return b.id.localeCompare(a.id);
      }
      return 0;
    });

  const handleSearch = () => {
    onSearch(inputValue);
  };

  return (
    <PageLayout
      hasNavbar
      header={
        <PageHeader
          onBack={onBack}
          centerContent={
            <div className="flex-1" onKeyPress={(e) => e.key === 'Enter' && handleSearch()}>
              <SearchInput 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                containerClassName="h-[40px] bg-[#e6eff8] border-[rgba(189,202,193,0.3)]" 
              />
            </div>
          }
        />
      }
    >
      {/* Results Header */}
      <div className="px-[20px] py-4 border-b border-[#dbe4ed]">
        <h1 className="text-[#141d23] text-[16px] leading-[24px]">Hasil pencarian untuk "{searchQuery}"</h1>
        <p className="text-[#5c5f60] text-[16px] leading-[24px]">{filteredAndSortedQuests.length} Quest ditemukan</p>
      </div>

      <FilterChips 
        label="Urutkan Menurut" 
        options={['Terdekat', 'Reward Tertinggi', 'Terbaru']} 
        value={selectedSort}
        onChange={setSelectedSort}
      />

      <FilterChips 
        label="KATEGORI" 
        options={['Semua', ...state.categories]} 
        value={selectedCategory}
        onChange={setSelectedCategory}
      />

      {/* Results List */}
      <div className="px-[20px] mt-6 flex flex-col gap-4">
        {filteredAndSortedQuests.map((quest) => (
          <ResultCard 
            key={quest.id}
            category={quest.category}
            title={quest.title}
            price={quest.price}
            distance={quest.distance}
            description={quest.description}
            image={quest.image}
            onClick={() => onSelectQuest(quest.id)}
          />
        ))}
        {filteredAndSortedQuests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-500 italic">Tidak ada quest yang cocok dengan kriteria pencarianmu.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SearchResultsPage;
