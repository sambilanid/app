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
  const { currentUserId, chats, messages, users, allQuests } = state;

  const myChats = chats.filter(c => c.participants.includes(currentUserId));

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
        {myChats.map((chat) => {
          const chatMessages = messages.filter(m => m.chatId === chat.id);
          const lastMessage = chatMessages.length > 0 
            ? chatMessages[chatMessages.length - 1] 
            : null;
          
          const otherUserId = chat.participants.find(id => id !== currentUserId);
          const otherUser = users.find(u => u.id === otherUserId);
          const quest = allQuests.find(q => q.id === chat.questId);

          return (
            <button 
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left w-full"
            >
              {/* Avatar with status */}
              <div className="relative flex-shrink-0">
                {otherUser?.avatar ? (
                  <img 
                    src={otherUser.avatar} 
                    alt={otherUser.name} 
                    className="w-[56px] h-[56px] rounded-full object-cover"
                  />
                ) : (
                  <div className="w-[56px] h-[56px] rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                    {otherUser?.initials || '?'}
                  </div>
                )}
                <div className="absolute -top-1 -right-1 w-[16px] h-[16px] rounded-full border-2 border-white bg-[#00694b]" />
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className="text-[16px] font-bold text-black truncate">
                    {quest?.title || 'Percakapan'}
                  </h3>
                  <span className="text-[12px] text-gray-400">
                    {lastMessage?.time || ''}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[13px] text-gray-500 truncate font-medium">
                    {otherUser?.name || 'Unknown User'}
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
        {myChats.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-gray-400">Belum ada percakapan aktif.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ChatListPage;
