/**
 * Halaman aktivitas pengguna.
 * Digunakan saat: Menampilkan daftar quest yang sedang dikerjakan atau yang telah dibuat oleh pengguna.
 */
import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  MessageCircle,
  X 
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Badge } from '../components/common/Badge';
import { QuestThumbnail } from '../components/quest/QuestThumbnail';
import { QuestPrice } from '../components/quest/QuestPrice';
import { Card } from '../components/common/Card';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { SearchInput } from '../components/common/SearchInput';

interface ActivityPageProps {
  onBack: () => void;
  onSelectQuest: (questId: string) => void;
  onFinish: (questId: string) => void;
}

const ActivityPage: React.FC<ActivityPageProps> = ({ onBack, onSelectQuest, onFinish }) => {
  const [activeTab, setActiveTab] = useState<'made' | 'done'>('done');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { state } = useApp();
  const { activeQuests, completedQuests } = state;

  const activities = activeTab === 'done' 
    ? [...activeQuests, ...completedQuests]
    : []; // For now, handle 'made' as empty or separate state if needed

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
            <Card 
              key={item.id} 
              className="p-[16px] flex flex-col gap-[12px]"
              onClick={() => onSelectQuest(item.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <Badge className="w-fit">{item.category}</Badge>
                  <span className="text-[#141d23] text-[10px] font-semibold opacity-60 mt-1">{item.date || '01 Jan 2025'}</span>
                </div>
                <div className={`px-[10px] py-[3px] rounded-full text-[11px] font-bold ${item.status === 'active' ? 'text-[#7ea400] bg-[#7ea400]/10' : 'text-[#00694b] bg-[#00694b]/10'}`}>
                  {item.status === 'active' ? 'Aktif' : 'Selesai'}
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full" />

              <div className="flex gap-[12px] items-center">
                <QuestThumbnail src={item.image} alt={item.title} size="sm" />
                <div className="flex flex-col min-w-0">
                  <h3 className="text-[#141d23] text-[16px] font-semibold leading-tight truncate">{item.title}</h3>
                  <div className="flex items-center gap-1 opacity-60">
                    <MapPin size={12} className="text-[#3e4943]" />
                    <span className="text-[#3e4943] text-[11px]">{item.location || 'Purbalingga'}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[#141d23] text-[13px] opacity-70">{item.status === 'active' ? 'Budget' : 'Total pendapatan'}</span>
                  <QuestPrice price={item.price} size="sm" />
                </div>
                <div className="flex gap-2">
                  <button className="w-[40px] h-[40px] bg-[#e0e9f2] rounded-full flex items-center justify-center text-primary">
                    <MessageCircle size={18} />
                  </button>
                  {item.status === 'active' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onFinish(item.id);
                      }}
                      className="bg-primary px-4 py-2 rounded-full text-white text-[12px] font-bold"
                    >
                      Selesaikan
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default ActivityPage;
