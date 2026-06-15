/**
 * Halaman daftar percakapan (Chat).
 * Digunakan saat: Menampilkan semua percakapan aktif antara pengguna dengan pengguna lain.
 */
import React from 'react';
import { Search } from 'lucide-react';
import { PageLayout } from '../components/common/PageLayout';
import { PageHeader } from '../components/common/PageHeader';

import avatarReza from '../assets/avatar-reza.png';
import avatarSari from '../assets/avatar-sari.svg';
import avatarBudi from '../assets/avatar-budi.svg';

interface ChatListPageProps {
  onBack: () => void;
  onSelectChat: (chatId: number) => void;
}

const ChatListPage: React.FC<ChatListPageProps> = ({ onBack, onSelectChat }) => {
  const chats = [
    {
      id: 1,
      name: 'Reza Kurniawan',
      avatar: avatarReza,
      lastMessage: 'Baik, saya akan mulai kerjakan hari ini ya kak.',
      time: '10:42 AM',
      unreadCount: 2,
      online: true,
    },
    {
      id: 2,
      name: 'Sari Nur Aini',
      avatar: avatarSari,
      lastMessage: 'Terima kasih atas bantuannya! Hasilnya memuaskan.',
      time: 'Kemarin',
      unreadCount: 0,
      online: false,
    },
    {
      id: 3,
      name: 'Budi Santoso',
      avatar: avatarBudi,
      lastMessage: 'Apakah galonnya sudah sampai?',
      time: '2 hari lalu',
      unreadCount: 0,
      online: false,
    },
  ];

  return (
    <PageLayout
      header={
        <PageHeader 
          title="Chat" 
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
        {chats.map((chat) => (
          <button 
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left w-full"
          >
            {/* Avatar with status */}
            <div className="relative flex-shrink-0">
              <img 
                src={chat.avatar} 
                alt={chat.name} 
                className="w-[56px] h-[56px] rounded-full object-cover"
              />
              <div className={`absolute -top-1 -right-1 w-[16px] h-[16px] rounded-full border-2 border-white ${chat.online ? 'bg-[#00694b]' : 'bg-gray-400'}`} />
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-[16px] font-semibold text-black truncate">{chat.name}</h3>
                <span className={`text-[12px] ${chat.unreadCount > 0 ? 'text-primary font-bold' : 'text-gray-400'}`}>
                  {chat.time}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-[14px] truncate flex-1 ${chat.unreadCount > 0 ? 'font-bold text-black' : 'text-gray-500'}`}>
                  {chat.lastMessage}
                </p>
                {chat.unreadCount > 0 && (
                  <div className="bg-primary text-white text-[10px] font-bold min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1 ml-2">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </PageLayout>
  );
};

export default ChatListPage;
