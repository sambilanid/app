/**
 * Halaman pencarian quest.
 * Digunakan saat: Pengguna ingin mencari quest baru atau mendapatkan saran quest dari AI.
 */
import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { SearchSection } from '../components/quest/SearchSection';
import { SuggestionSection } from '../components/quest/SuggestionSection';
import { AIAssistantSection } from '../components/quest/AIAssistantSection';
import { PageLayout } from '../components/common/PageLayout';

interface SearchPageProps {
  onBack: () => void;
  onSearch: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onBack, onSearch }) => {
  return (
    <PageLayout hasNavbar header={<PageHeader title="Cari" onBack={onBack} />}>
      <div onClick={onSearch}>
        <SearchSection />
      </div>
      <SuggestionSection />
      <AIAssistantSection />
    </PageLayout>
  );
};

export default SearchPage;
