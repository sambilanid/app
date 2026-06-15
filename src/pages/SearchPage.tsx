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
  onSearch: (query: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onBack, onSearch }) => {
  const [query, setQuery] = React.useState('');

  const handleSearch = (q: string) => {
    onSearch(q || query);
  };

  return (
    <PageLayout header={<PageHeader title="Cari" onBack={onBack} />}>
      <div onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}>
        <SearchSection value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <SuggestionSection onSelect={handleSearch} />
      <AIAssistantSection onSearch={handleSearch} />
    </PageLayout>
  );
};

export default SearchPage;
