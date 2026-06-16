/**
 * Provider untuk AppContext.
 * Digunakan saat: Membungkus seluruh aplikasi untuk menyediakan state global seperti data user dan daftar quest.
 */
import React, { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { AppContext } from './AppContext';
import type { User, Quest, AppState, AppNotification, WithdrawalPreset, Message, Chat } from '../types';

import avatarAde from '../assets/avatar-ade.svg';
import avatarReza from '../assets/avatar-reza.png';
import avatarSari from '../assets/avatar-sari.svg';
import avatarBudi from '../assets/avatar-budi.svg';

import questFood from '../assets/quest-food.png';
import questShopping from '../assets/quest-shopping.png';
import questSouvenir from '../assets/quest-souvenir.png';
import questGacoan from '../assets/quest-gacoan.png';
import questAlfamart from '../assets/quest-alfamart.png';
import questOleholeh from '../assets/quest-oleholeh.png';

const initialUsers: User[] = [
  {
    id: '1',
    name: 'ADE YAHYA HENDRIAWAN',
    initials: 'AY',
    avatar: avatarAde,
    rating: 0.0,
    reviewCount: 0,
    questsCreated: 0,
    questsCompleted: 0,
    isVerified: true,
    hasSkck: false,
    balance: 271000000,
    notifications: [
      {
        id: 1,
        type: 'payment',
        title: 'Top Up Menunggu Pembayaran',
        message: 'Permintaan top up kamu sudah dibuat. Selesaikan pembayaran agar saldo masuk.',
        time: '14 jam lalu',
        unread: true,
      },
      {
        id: 2,
        type: 'quest',
        title: 'Quest Berhasil Diambil',
        message: 'Kamu telah mengambil quest "Jastip Mie Gacoan". Segera selesaikan sebelum deadline!',
        time: '1 hari lalu',
        unread: false,
      },
      {
        id: 3,
        type: 'system',
        title: 'Verifikasi Berhasil',
        message: 'Selamat! Akun kamu sekarang sudah terverifikasi sebagai Adventurer.',
        time: '2 hari lalu',
        unread: false,
      },
    ],
    withdrawalPresets: [],
  },
  {
    id: '2',
    name: 'Reza Kurniawan',
    initials: 'RK',
    avatar: avatarReza,
    rating: 4.7,
    reviewCount: 25,
    questsCreated: 8,
    questsCompleted: 15,
    isVerified: true,
    hasSkck: true,
    balance: 500000,
    notifications: [],
    withdrawalPresets: [],
  },
  {
    id: '3',
    name: 'Sari Nur Aini',
    initials: 'SA',
    avatar: avatarSari,
    rating: 4.9,
    reviewCount: 42,
    questsCreated: 12,
    questsCompleted: 30,
    isVerified: true,
    hasSkck: true,
    balance: 750000,
    notifications: [],
    withdrawalPresets: [],
  },
  {
    id: '4',
    name: 'Budi Santoso',
    initials: 'BS',
    avatar: avatarBudi,
    rating: 4.5,
    reviewCount: 18,
    questsCreated: 5,
    questsCompleted: 10,
    isVerified: true,
    hasSkck: false,
    balance: 300000,
    notifications: [],
    withdrawalPresets: [],
  }
];

const initialQuests: Quest[] = [
  {
    id: 'q1',
    category: 'Jasa Titip',
    title: 'Jastip Mie Gacoan',
    price: 'Rp15.000',
    distance: '0.8 km',
    image: questGacoan,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mnt ago
    description: 'Beli 2 porsi Mie Iblis level 4, titip di kawasan perkantoran Purbalingga Food Centre.',
    status: 'available',
    location: 'Kalimanah, Purbalingga',
    fromLocation: 'Mie Gacoan Purbalingga',
    toLocation: 'Perkantoran PFC',
    deadline: '45 mnt',
    creatorId: '2', // Reza
  },
  {
    id: 'q2',
    category: 'Jasa Titip',
    title: 'Jastip Alfamart',
    price: 'Rp18.000',
    distance: '1.2 km',
    image: questAlfamart,
    createdAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(), // 32 mnt ago
    description: 'Tolong belikan galon Aqua dan sabun mandi di Alfamart depan kampus.',
    status: 'available',
    location: 'Purbalingga Lor',
    fromLocation: 'Alfamart Kampus',
    toLocation: 'Kosan Mawar',
    deadline: '1 jam',
    creatorId: '3', // Sari
  },
  {
    id: 'q3',
    category: 'Antar/Jemput',
    title: 'Antar Paket ke J&T',
    price: 'Rp10.000',
    distance: '0.5 km',
    image: questShopping,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    description: 'Tolong antarkan paket jualan saya ke agen J&T terdekat, sudah dipacking tinggal drop.',
    status: 'available',
    location: 'Bancarkembar',
    fromLocation: 'Rumah Saya',
    toLocation: 'J&T Express Purbalingga',
    deadline: '2 jam',
    creatorId: '4', // Budi
  },
  {
    id: 'q4',
    category: 'Antar/Jemput',
    title: 'Jemput Dokumen Kantor',
    price: 'Rp20.000',
    distance: '2.5 km',
    image: questSouvenir,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    description: 'Jemput dokumen di kantor pos dan antarkan ke alamat kantor saya di pusat kota.',
    status: 'available',
    location: 'Purbalingga Wetan',
    fromLocation: 'Kantor Pos Purbalingga',
    toLocation: 'Gedung Keuangan',
    deadline: '1.5 jam',
    creatorId: '2', // Reza
  },
  {
    id: 'q5',
    category: 'Servis',
    title: 'Cuci Sepatu Sneaker',
    price: 'Rp35.000',
    distance: '1.8 km',
    image: questShopping,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    description: 'Cari jasa cuci sepatu deep clean untuk 2 pasang sneaker. Bisa ambil ke rumah.',
    status: 'available',
    location: 'Kalikabong',
    deadline: '2 hari',
    creatorId: '3', // Sari
  },
  {
    id: 'q6',
    category: 'Servis',
    title: 'Instal Ulang Laptop',
    price: 'Rp100.000',
    distance: '3.0 km',
    image: questSouvenir,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    description: 'Laptop lemot banget, butuh instal ulang Windows 11 dan aplikasi standar.',
    status: 'available',
    location: 'Boajong',
    deadline: '1 hari',
    creatorId: '4', // Budi
  },
  {
    id: 'q7',
    category: 'Lainnya',
    title: 'Bantu Pindahan Kost',
    price: 'Rp50.000',
    distance: '0.3 km',
    image: questOleholeh,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    description: 'Bantu angkut barang-barang pindahan kost, jaraknya dekat cuma beda gang.',
    status: 'available',
    location: 'Purbalingga Kidul',
    deadline: '3 jam',
    creatorId: '2', // Reza
  },
  {
    id: 'q8',
    category: 'Lainnya',
    title: 'Jaga Toko Sebentar',
    price: 'Rp30.000',
    distance: '0.7 km',
    image: questFood,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    description: 'Butuh orang buat jaga toko kelontong selama 2 jam karena ada urusan mendadak.',
    status: 'available',
    location: 'Kalimanah Lor',
    deadline: '2 jam',
    creatorId: '3', // Sari
  },
  {
    id: 'q9',
    category: 'Jasa Titip',
    title: 'Jastip Mie Ayam',
    price: 'Rp20.000',
    distance: '1.0 km',
    image: questFood,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    description: 'Beli mie ayam legendaris Pak Di.',
    status: 'active',
    location: 'Kalimanah',
    fromLocation: 'Mie Ayam Pak Di',
    toLocation: 'Kantor Bupati',
    deadline: '30 mnt',
    creatorId: '2', // Reza
    takerId: '1', // Ade
  },
  {
    id: 'q10',
    category: 'Jasa Titip',
    title: 'Antar Galon ke Kamar',
    price: 'Rp5.000',
    distance: '0.1 km',
    image: questShopping,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mnt ago
    description: 'Tolong anterin galon yang udah didepan pintu ke dalem kamar.',
    status: 'active',
    location: 'Kost Mawar',
    fromLocation: 'Depan Pintu',
    toLocation: 'Kamar 102',
    deadline: '15 mnt',
    creatorId: '4', // Budi
    takerId: '1', // Ade
  }
];

const initialChats: Chat[] = [
  { id: 'c1', participants: ['1', '2'], questId: 'q9' },
  { id: 'c2', participants: ['1', '4'], questId: 'q10' },
];

const initialMessages: Message[] = [
  { id: 'm1', chatId: 'c1', senderId: '2', text: 'Halo kak, saya sudah di depan Mie Ayam Pak Di ya.', time: '10:40 AM' },
  { id: 'm2', chatId: 'c1', senderId: '1', text: 'Oke sebentar ya, saya transfer uangnya.', time: '10:41 AM' },
  { id: 'm4', chatId: 'c1', senderId: '1', text: 'Sudah saya transfer ya kak Rp35.000 (mie + ongkir).', time: '10:43 AM' },
  { id: 'm5', chatId: 'c1', senderId: '2', text: 'Masuk kak. Ini lagi antre, lumayan ramai ya hari ini.', time: '10:45 AM' },
  { id: 'm6', chatId: 'c1', senderId: '1', text: 'Siap, santai aja kak. Jangan lupa sambalnya dipisah ya.', time: '10:46 AM' },
  { id: 'm3', chatId: 'c2', senderId: '4', text: 'Permisi kak, galonnya sudah saya taruh di dalam ya.', time: '11:20 AM' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const currentUser = useMemo(() => 
    currentUserId ? users.find(u => u.id === currentUserId) || null : null, 
    [users, currentUserId]
  );

  const state: AppState = {
    users,
    currentUserId,
    user: currentUser,
    allQuests: quests,
    availableQuests: currentUserId ? quests.filter(q => 
      q.status === 'available' && 
      q.creatorId !== currentUserId && 
      !q.applicantIds?.includes(currentUserId)
    ) : [],
    activeQuests: currentUserId ? quests.filter(q => 
      q.takerId === currentUserId && 
      (q.status === 'active' || q.status === 'pending')
    ) : [],
    pendingQuests: currentUserId ? quests.filter(q => 
      q.applicantIds?.includes(currentUserId) && 
      q.status === 'available'
    ) : [],
    completedQuests: currentUserId ? quests.filter(q => q.takerId === currentUserId && q.status === 'completed') : [],
    categories: ['Jasa Titip', 'Antar/Jemput', 'Servis', 'Lainnya'],
    chats,
    messages,
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const login = (userId: string) => {
    setCurrentUserId(userId);
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const updateCurrentUser = (updater: (user: User) => User) => {
    setUsers(prev => prev.map(u => u.id === currentUserId ? updater(u) : u));
  };

  const topUp = (amount: number) => {
    updateCurrentUser(prev => ({ ...prev, balance: prev.balance + amount }));
  };

  const withdraw = (amount: number) => {
    updateCurrentUser(prev => ({ ...prev, balance: Math.max(0, prev.balance - amount) }));
  };

  const addQuest = (quest: Quest) => {
    const userId = currentUserId;
    if (!userId) return;
    setQuests(prev => [...prev, { ...quest, creatorId: userId }]);
  };

  const updateQuest = (quest: Quest) => {
    setQuests(prev => prev.map(q => q.id === quest.id ? quest : q));
  };

  const deleteQuest = (questId: string) => {
    setQuests(prev => prev.filter(q => q.id !== questId));
  };
const applyForQuest = (questId: string) => {
  const userId = currentUserId;
  if (!userId) return;
  setQuests(prev => prev.map(q => {
    if (q.id === questId) {
      const applicantIds = q.applicantIds || [];
      if (!applicantIds.includes(userId)) {
        return { ...q, applicantIds: [...applicantIds, userId] };
      }
    }
    return q;
  }));
};

  const cancelApplication = (questId: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        const applicantIds = q.applicantIds || [];
        return { ...q, applicantIds: applicantIds.filter(id => id !== currentUserId) };
      }
      return q;
    }));
  };

  const acceptApplicant = (questId: string, userId: string) => {
    setQuests(prev => {
      const updatedQuests = prev.map(q => {
        if (q.id === questId) {
          return { 
            ...q, 
            status: 'active' as const, 
            takerId: userId, 
            applicantIds: [] 
          };
        }
        return q;
      });
      return updatedQuests;
    });
    
    // Kirim notifikasi ke user yang diterima
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      addNotificationToUser(userId, {
        type: 'quest',
        title: 'Permohonan Diterima',
        message: `Permohonan Anda untuk quest "${quest.title}" telah diterima!`
      });
    }
  };

  const rejectApplicant = (questId: string, userId: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        const applicantIds = q.applicantIds || [];
        return { 
          ...q, 
          applicantIds: applicantIds.filter(id => id !== userId) 
        };
      }
      return q;
    }));
  };

  const findOrCreateChat = (userIds: string[], questId?: string) => {
    const sortedUserIds = [...userIds].sort();
    const existingChat = chats.find(c => 
      c.participants.length === sortedUserIds.length && 
      [...c.participants].sort().every((uid, idx) => uid === sortedUserIds[idx]) &&
      c.questId === questId
    );

    if (existingChat) return existingChat.id;

    const newChatId = `c${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      participants: sortedUserIds,
      questId,
    };
    setChats(prev => [...prev, newChat]);
    return newChatId;
  };

  const sendMessage = (chatId: string, text: string) => {
    const userId = currentUserId;
    if (!userId) return;
    const newMessage: Message = {
      id: `m${Date.now()}`,
      chatId,
      senderId: userId,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const completeQuest = (questId: string) => {
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, status: 'completed' } : q));
  };

  const submitQuestEvidence = (questId: string) => {
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, status: 'pending' } : q));
  };

  const addNotificationToUser = (userId: string, notif: Omit<AppNotification, 'id' | 'unread' | 'time'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: Date.now(),
      unread: true,
      time: 'Baru saja',
    };
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      notifications: [newNotif, ...u.notifications]
    } : u));
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'unread' | 'time'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: Date.now(),
      unread: true,
      time: 'Baru saja',
    };
    updateCurrentUser(prev => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications]
    }));
  };

  const markAllNotificationsAsRead = () => {
    updateCurrentUser(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, unread: false }))
    }));
  };

  const markNotificationAsRead = (id: number) => {
    updateCurrentUser(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, unread: false } : n)
    }));
  };

  const addWithdrawalPreset = (preset: Omit<WithdrawalPreset, 'id'>) => {
    const newPreset: WithdrawalPreset = {
      ...preset,
      id: Date.now().toString(),
    };
    updateCurrentUser(prev => ({
      ...prev,
      withdrawalPresets: [...prev.withdrawalPresets, newPreset]
    }));
  };

  const removeWithdrawalPreset = (id: string) => {
    updateCurrentUser(prev => ({
      ...prev,
      withdrawalPresets: prev.withdrawalPresets.filter(p => p.id !== id)
    }));
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      switchUser,
      login,
      logout,
      topUp, 
      withdraw, 
      addQuest, 
      updateQuest,
      deleteQuest,
      applyForQuest,
      cancelApplication,
      acceptApplicant,
      rejectApplicant,
      addNotification,
      markAllNotificationsAsRead,
      markNotificationAsRead,
      sendMessage,
      findOrCreateChat,
      completeQuest,
      submitQuestEvidence,
      addWithdrawalPreset,
      removeWithdrawalPreset
    }}>
      {children}
    </AppContext.Provider>
  );
};
