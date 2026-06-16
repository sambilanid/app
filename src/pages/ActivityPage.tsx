/**
 * Halaman aktivitas pengguna.
 * Digunakan saat: Menampilkan daftar quest yang sedang dikerjakan atau yang telah dibuat oleh pengguna.
 */
import React, { useState } from 'react';
import { 
  Search, 
  X 
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { SearchInput } from '../components/common/SearchInput';
import { ActivityQuestCard } from '../components/quest/ActivityQuestCard';
interface ActivityPageProps {
  onBack: () => void;
  onSelectQuest: (questId: string) => void;
  onManageQuest: (questId: string) => void;
  onFinish: (questId: string) => void;
  onChat: (questId: string) => void;
}

const ActivityPage: React.FC<ActivityPageProps> = ({ 
  onBack, 
  onSelectQuest, 
  onManageQuest,
  onFinish,
  onChat 
}) => {
  const [activeTab, setActiveTab] = useState<'made' | 'done'>('done');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { state } = useApp();
  const { activeQuests, pendingQuests, completedQuests } = state;

  const activities = activeTab === 'done' 
    ? [...activeQuests, ...pendingQuests, ...completedQuests]
    : state.allQuests.filter(q => q.creatorId === state.currentUserId);

  const filteredActivities = activities.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout
      hasNavbar
      header={
        <PageHeader 
          title={!isSearching ? "Aktivitas" : undefined}
          onBack={isSearching ? () => { setIsSearching(false); setSearchQuery(''); } : onBack}
          centerContent={isSearching ? (
            <div className="flex-1">
              <SearchInput 
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                containerClassName="h-[40px] bg-[#e6eff8] border-[rgba(189,202,193,0.3)]" 
                placeholder="Cari aktivitas..."
              />
            </div>
          ) : undefined}
          rightAction={
            <div className="flex items-center gap-2">
              {!isSearching ? (
                <button 
                  onClick={() => setIsSearching(true)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Search size={20} className="text-[#3e4943]" />
                </button>
              ) : (
                searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} className="text-[#3e4943]" />
                  </button>
                )
              )}
            </div>
          }
        />
      }
    >
      <div>
        {/* Navigation Tabs */}
        <div className="px-[20px] pt-[24px] flex gap-[8px] overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('made')}
            className={`px-[20px] py-[10px] rounded-full text-[14px] font-semibold whitespace-nowrap transition-all ${
              activeTab === 'made' 
                ? 'bg-primary text-white' 
                : 'bg-[#e1e3e4] text-[#5c5f60]'
            }`}
          >
            Quest Buatan Saya
          </button>
          <button 
            onClick={() => setActiveTab('done')}
            className={`px-[20px] py-[10px] rounded-full text-[14px] font-semibold whitespace-nowrap transition-all ${
              activeTab === 'done' 
                ? 'bg-primary text-white' 
                : 'bg-[#e1e3e4] text-[#5c5f60]'
            }`}
          >
            Kerjaan Saya
          </button>
        </div>

        {/* Activity List */}
        <div className="px-[20px] mt-[24px] flex flex-col gap-[16px]">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-10 text-gray-text">
              {searchQuery ? 'Tidak ada aktivitas yang cocok.' : 'Belum ada aktivitas.'}
            </div>
          ) : filteredActivities.map((item) => (
            <ActivityQuestCard 
              key={item.id}
              quest={item}
              onChat={() => onChat(item.id)}
              onFinish={() => onFinish(item.id)}
              onClick={() => activeTab === 'made' ? onManageQuest(item.id) : onSelectQuest(item.id)}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default ActivityPage;
