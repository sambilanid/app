/**
 * Halaman daftar percakapan (Chat).
 * Digunakan saat: Menampilkan semua percakapan aktif antara pengguna dengan pengguna lain.
 */
import React from 'react';
import { Search } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';
import { useApp } from '../store/AppContext';

interface ChatListPageProps {
  onBack: () => void;
  onSelectChat: (chatId: string) => void;
}

const ChatListPage: React.FC<ChatListPageProps> = ({ onBack, onSelectChat }) => {
  const { state } = useApp();
  const { activeQuests } = state;

  return (
    <PageLayout
      header={
        <PageHeader 
          title="Pesan" 
          onBack={onBack}
          rightAction={
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Search size={20} className="text-[#111827]" />
            </button>
          }
        />
      }
      className="bg-white"
    >
      <div className="flex flex-col">
        {activeQuests.map((quest) => {
          const lastMessage = quest.messages && quest.messages.length > 0 
            ? quest.messages[quest.messages.length - 1] 
            : null;

          return (
            <button 
              key={quest.id}
              onClick={() => onSelectChat(quest.id)}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left w-full"
            >
              {/* Avatar with status */}
              <div className="relative flex-shrink-0">
                {quest.creator?.avatar ? (
                  <img 
                    src={quest.creator.avatar} 
                    alt={quest.creator.name} 
                    className="w-[56px] h-[56px] rounded-full object-cover"
                  />
                ) : (
                  <div className="w-[56px] h-[56px] rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                    {quest.creator?.initials || '?'}
                  </div>
                )}
                <div className="absolute -top-1 -right-1 w-[16px] h-[16px] rounded-full border-2 border-white bg-[#00694b]" />
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className="text-[16px] font-bold text-black truncate">{quest.title}</h3>
                  <span className="text-[12px] text-gray-400">
                    {lastMessage?.time || ''}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[13px] text-gray-500 truncate font-medium">
                    {quest.creator?.name || 'Unknown'}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[14px] truncate flex-1 text-gray-400">
                    {lastMessage?.text || 'Mulai percakapan...'}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
        {activeQuests.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-gray-400">Belum ada percakapan aktif.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ChatListPage;
