/**
 * Halaman utama aplikasi.
 * Digunakan saat: Landing page setelah login yang berisi ringkasan aktivitas dan rekomendasi.
 */
import React from 'react';
import { Bell } from 'lucide-react';
import { Avatar } from '../components/common/Avatar';
import { PageHeader } from '../components/common/PageHeader';
import { WalletSection } from '../components/home/WalletSection';
import { AIAssistantSection } from '../components/quest/AIAssistantSection';
import { ActiveQuestCard } from '../components/home/ActiveQuestCard';
import { CompactQuestCard } from '../components/home/CompactQuestCard';
import { PageLayout } from '../components/common/PageLayout';
import { useApp } from '../store/AppContext';

interface HomePageProps {
  onTopUp?: () => void;
  onWithdraw?: () => void;
  onNavigate: (page: 'home' | 'search' | 'activity' | 'profile' | 'detail', questId?: string) => void;
  onNotifications: () => void;
  onChat: () => void;
  onFinish: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  onTopUp, 
  onWithdraw,
  onNavigate, 
  onNotifications,
  onChat,
  onFinish
}) => {
  const { state } = useApp();
  const { availableQuests, activeQuests, user, notifications } = state;
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <PageLayout
      hasNavbar
      header={
        <PageHeader 
          title={`Selamat Pagi, ${user.name.split(' ')[0]}!`}
          subtitle="Apa yang kamu butuhin hari ini?"
          rightAction={
            <div className="flex items-center gap-[8px]">
              <button 
                onClick={onNotifications}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
              >
                <Bell size={20} className="text-dark" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-white" />
                )}
              </button>
              <button 
                onClick={() => onNavigate('profile')}
                className="active:scale-95 transition-transform"
              >
                <Avatar 
                  size="sm" 
                  src={user.avatar}
                  initials={user.initials}
                  className="border border-gray-100"
                />
              </button>
            </div>
          }
        />
      }
    >
      <div>
        <WalletSection onTopUp={onTopUp} onWithdraw={onWithdraw} />
        <AIAssistantSection onSearch={() => onNavigate('search')} />
        
        {activeQuests.length > 0 && (
          <ActiveQuestCard 
            quest={activeQuests[0]}
            onChat={onChat} 
            onFinish={onFinish} 
            onClick={() => onNavigate('detail', activeQuests[0].id)}
          />
        )}
        
        <div className="px-[20px] mt-8 flex flex-col gap-4">
          <h2 className="text-[#3e4943] text-[16px] px-1">Quest di sekitarmu</h2>
          {availableQuests.map((quest) => (
            <CompactQuestCard 
              key={quest.id}
              category={quest.category}
              title={quest.title}
              price={quest.price}
              distance={quest.distance}
              image={quest.image}
              onClick={() => onNavigate('detail', quest.id)}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
