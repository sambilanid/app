/**
 * Halaman pencarian quest yang disatukan.
 * Menampilkan quest terdekat secara default, dan memungkinkan pencarian/filter.
 */
import React, { useState } from 'react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { SearchInput } from '../components/common/SearchInput';
import { FilterChips } from '../components/quest/FilterChips';
import { StandardQuestCard } from '../components/quest/StandardQuestCard';
import { useApp } from '../store/AppContext';

interface SearchPageProps {
  onBack: () => void;
  onSelectQuest: (questId: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onBack, onSelectQuest }) => {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
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
        !searchQuery ||
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
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      return 0;
    });

  return (
    <PageLayout
      hasNavbar
      header={
        <PageHeader
          onBack={onBack}
          centerContent={
            <div className="flex-1">
              <SearchInput 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                containerClassName="h-10 bg-[#e6eff8] border-[rgba(189,202,193,0.3)]" 
                placeholder="Cari quest di sekitarmu..."
              />
            </div>
          }
        />
      }
    >
      <div className="pb-24">
        {/* Filters */}
        <div className="mt-2">
          <FilterChips 
            label="Urutkan" 
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
        </div>

        {/* Results List */}
        <div className="px-5 mt-6 flex flex-col gap-4">
          {filteredAndSortedQuests.map((quest) => (
            <StandardQuestCard 
              key={quest.id}
              quest={quest}
              onClick={() => onSelectQuest(quest.id)}
            />
          ))}
          
          {filteredAndSortedQuests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-[#3e4943] italic">Tidak ada quest yang cocok.</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default SearchPage;
