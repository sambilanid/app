/**
 * Provider untuk AppContext.
 * Digunakan saat: Membungkus seluruh aplikasi untuk menyediakan state global seperti data user dan daftar quest.
 */
import React, { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { AppContext } from './AppContext';
import type { User, Quest, AppState, AppNotification, WithdrawalPreset, Message, Chat, Review } from '../types';

import avatarAde from '../assets/avatar-ade.svg';
import avatarSari from '../assets/avatar-sari.svg';

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
    email: 'ade@sambilan.id',
    phone: '081234567890',
    password: 'password123',
    rating: 0.0,
    reviewCount: 0,
    adventurerRating: 0.0,
    adventurerReviewCount: 0,
    creatorRating: 0.0,
    creatorReviewCount: 0,
    isVerified: false,
    balance: 271000000,
    bio: 'Freelancer tech savvy yang siap membantu segala urusan tekno dan gadget Anda.',
    location: 'Purbalingga, Jawa Tengah',
    notifications: [
      {
        id: 1,
        type: 'payment',
        title: 'Top Up Menunggu Pembayaran',
        message: 'Permintaan top up kamu sudah dibuat. Selesaikan pembayaran agar saldo masuk.',
        time: '14 jam lalu',
        unread: true,
      },
    ],
    withdrawalPresets: [],
  },
  {
    id: '2',
    name: 'Reza Kurniawan',
    initials: 'RK',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Reza+Kurniawan',
    email: 'reza@gmail.com',
    phone: '082112233445',
    password: 'password123',
    rating: 4.6,
    reviewCount: 3,
    adventurerRating: 5.0,
    adventurerReviewCount: 1,
    creatorRating: 4.5,
    creatorReviewCount: 2,
    isVerified: true,
    balance: 500000,
    bio: 'Pecinta kuliner sejati yang hobi hunting makanan enak. Siap bantu jastip makanan favoritmu!',
    notifications: [],
    withdrawalPresets: [],
  },
  {
    id: '3',
    name: 'Sari Nur Aini',
    initials: 'SA',
    avatar: avatarSari,
    email: 'sari@yahoo.com',
    phone: '085776655443',
    password: 'password123',
    rating: 5.0,
    reviewCount: 2,
    adventurerRating: 5.0,
    adventurerReviewCount: 1,
    creatorRating: 5.0,
    creatorReviewCount: 1,
    isVerified: true,
    balance: 750000,
    bio: 'Tukang bersih yang resik dan rapi. Siap bantu beres-beres rumah atau urusan administratif ringan.',
    notifications: [],
    withdrawalPresets: [],
  },
  {
    id: '5',
    name: 'Naila Rona Nur Aini',
    initials: 'NR',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Naila+Rona+Nur+Aini',
    email: 'naila@sambilan.id',
    phone: '081299887766',
    password: 'password123',
    rating: 5.0,
    reviewCount: 1,
    adventurerRating: 5.0,
    adventurerReviewCount: 1,
    creatorRating: 0.0,
    creatorReviewCount: 0,
    isVerified: true,
    balance: 1200000,
    bio: 'Sangat sat set dan gercep dalam urusan logistik. Percayakan paket Anda pada saya untuk pengantaran yang cepat.',
    notifications: [],
    withdrawalPresets: [],
  },
  {
    id: '6',
    name: 'Nashiruddin',
    initials: 'NS',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nashiruddin',
    email: 'nashir@sambilan.id',
    phone: '085544332211',
    password: 'password123',
    rating: 4.0,
    reviewCount: 1,
    adventurerRating: 0.0,
    adventurerReviewCount: 0,
    creatorRating: 4.0,
    creatorReviewCount: 1,
    isVerified: true,
    balance: 450000,
    bio: 'Punya tenaga kuat, siap bantu angkat-angkat atau pindahan kost dengan aman dan amanah.',
    notifications: [],
    withdrawalPresets: [],
  }
];

const initialQuests: Quest[] = [
  {
    id: 'q1',
    category: 'Jasa titip',
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
    category: 'Jasa titip',
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
    category: 'Jasa antar ambil barang',
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
    creatorId: '5', // Naila
  },
  {
    id: 'q4',
    category: 'Jasa antar ambil barang',
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
    category: 'Jasa bersih-bersih',
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
    category: 'Jasa reparasi',
    title: 'Instal Ulang Laptop',
    price: 'Rp100.000',
    distance: '3.0 km',
    image: questSouvenir,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    description: 'Laptop lemot banget, butuh instal ulang Windows 11 dan aplikasi standar.',
    status: 'available',
    location: 'Boajong',
    deadline: '1 hari',
    creatorId: '6', // Nashiruddin
  },
  {
    id: 'q7',
    category: 'Jasa pindahan',
    title: 'Bantu Pindahan Kost',
    price: 'Rp50.000',
    distance: '0.3 km',
    image: questOleholeh,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    description: 'Bantu angkut barang-barang pindahan kost, jaraknya dekat cuma beda gang.',
    status: 'available',
    location: 'Purbalingga Kidul',
    fromLocation: 'Kost Lama (Gang Melati)',
    toLocation: 'Kost Baru (Gang Mawar)',
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
    category: 'Jasa titip',
    title: 'Jastip Mie Ayam',
    price: 'Rp20.000',
    distance: '1.0 km',
    image: questFood,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    description: 'Beli mie ayam legendaris Pak Di.',
    status: 'available',
    location: 'Kalimanah',
    fromLocation: 'Mie Ayam Pak Di',
    toLocation: 'Kantor Bupati',
    deadline: '30 mnt',
    creatorId: '2', // Reza
  },
  {
    id: 'q10',
    category: 'Jasa antar ambil barang',
    title: 'Antar Galon ke Kamar',
    price: 'Rp5.000',
    distance: '0.1 km',
    image: questShopping,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mnt ago
    description: 'Tolong anterin galon yang udah didepan pintu ke dalem kamar.',
    status: 'available',
    location: 'Kost Mawar',
    fromLocation: 'Depan Pintu',
    toLocation: 'Kamar 102',
    deadline: '15 mnt',
    creatorId: '6', // Nashiruddin
  }
];

const initialChats: Chat[] = [];

const initialReviews: Review[] = [
  {
    id: 'r2',
    questId: 'q_old_1',
    reviewerId: '1',
    revieweeId: '2',
    rating: 5,
    comment: 'Pemberi tugas yang jelas dan ramah. Pembayaran lancar.',
    role: 'creator',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r4',
    questId: 'q_old_2',
    reviewerId: '1',
    revieweeId: '3',
    rating: 5,
    comment: 'Sangat komunikatif, lokasi penjemputan sangat akurat.',
    role: 'creator',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r5',
    questId: 'q_old_3',
    reviewerId: '6',
    revieweeId: '5',
    rating: 5,
    comment: 'Sangat profesional dalam menangani dokumen penting. Terima kasih!',
    role: 'adventurer',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r6',
    questId: 'q_old_3',
    reviewerId: '5',
    revieweeId: '6',
    rating: 4,
    comment: 'Instruksi cukup jelas, orangnya baik.',
    role: 'creator',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r7',
    questId: 'q_old_4',
    reviewerId: '2',
    revieweeId: '3',
    rating: 5,
    comment: 'Penyelesaian tugas yang sempurna. Tidak ada komplain.',
    role: 'adventurer',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r8',
    questId: 'q_old_5',
    reviewerId: '5',
    revieweeId: '2',
    rating: 4,
    comment: 'Respon cepat saat ditanya progres tugas.',
    role: 'creator',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const initialMessages: Message[] = [];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    const user = users.find(u => u.id === currentUserId);
    if (!user) return null;

    // Hitung statistik dinamis
    const questsCreated = quests.filter(q => q.creatorId === currentUserId).length;
    const questsCompleted = quests.filter(q => q.takerId === currentUserId && q.status === 'completed').length;

    return {
      ...user,
      questsCreated,
      questsCompleted
    };
  }, [users, currentUserId, quests]);

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
      (q.status === 'active' || q.status === 'pending' || q.status === 'disputed')
    ) : [],
    pendingQuests: currentUserId ? quests.filter(q => 
      q.applicantIds?.includes(currentUserId) && 
      q.status === 'available'
    ) : [],
    completedQuests: currentUserId ? quests.filter(q => q.takerId === currentUserId && q.status === 'completed') : [],
    categories: [
      'Jasa pindahan',
      'Jasa titip',
      'Jasa antar jemput',
      'Jasa antar ambil barang',
      'Jasa angkut',
      'Jasa reparasi',
      'Antar orang sakit',
      'Membeli obat',
      'Jasa bersih-bersih',
      'Lainnya'
    ],
    chats,
    messages,
    reviews,
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const login = (userId: string) => {
    setCurrentUserId(userId);
  };

  const register = (userData: Pick<User, 'name' | 'email' | 'phone' | 'password'>) => {
    const names = userData.name.trim().split(/\s+/);
    const initials = names.length > 1 
      ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
      : names[0].substring(0, 2).toUpperCase();

    const newUser: User = {
      id: `u${Date.now()}`,
      name: userData.name,
      initials,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      rating: 0.0,
      reviewCount: 0,
      adventurerRating: 0.0,
      adventurerReviewCount: 0,
      creatorRating: 0.0,
      creatorReviewCount: 0,
      isVerified: false,
      balance: 0,
      notifications: [],
      withdrawalPresets: [],
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
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

    const priceAmount = parseInt(quest.price.replace(/[^0-9]/g, '')) || 0;
    const adminFee = 3500;
    const totalToDeduct = priceAmount + adminFee;

    // Deduct from balance
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          balance: Math.max(0, u.balance - totalToDeduct)
        };
      }
      return u;
    }));

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
    const quest = quests.find(q => q.id === questId);
    if (!quest || !quest.takerId) {
      setQuests(prev => prev.map(q => q.id === questId ? { ...q, status: 'completed' } : q));
      return;
    }

    const priceAmount = parseInt(quest.price.replace(/[^0-9]/g, '')) || 0;
    const takerId = quest.takerId;

    // 1. Update Quest Status
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, status: 'completed' } : q));

    // 2. Update Taker's balance, questsCompleted count, and add notification
    setUsers(prev => prev.map(u => {
      if (u.id === takerId) {
        const newNotif: AppNotification = {
          id: Date.now(),
          type: 'payment',
          title: 'Quest Selesai & Pembayaran Diterima',
          message: `Quest "${quest.title}" telah dikonfirmasi selesai oleh pembuat quest. Saldo Rp ${priceAmount.toLocaleString('id-ID')} telah ditambahkan ke akun Anda.`,
          time: 'Baru saja',
          unread: true,
        };
        return {
          ...u,
          balance: u.balance + priceAmount,
          notifications: [newNotif, ...u.notifications]
        };
      }
      return u;
    }));
  };

  const reportDispute = (questId: string) => {
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, status: 'disputed' } : q));
  };

  const submitQuestEvidence = (questId: string, image?: string, notes?: string) => {
    setQuests(prev => prev.map(q => q.id === questId ? { 
      ...q, 
      status: 'pending',
      evidenceImage: image,
      evidenceNotes: notes
    } : q));
  };

  const cancelQuestEvidence = (questId: string) => {
    setQuests(prev => prev.map(q => q.id === questId ? { 
      ...q, 
      status: 'active',
      evidenceImage: undefined,
      evidenceNotes: undefined
    } : q));
  };

  const submitReview = (questId: string, revieweeId: string, rating: number, comment: string, role: 'adventurer' | 'creator') => {
    const reviewerId = currentUserId;
    if (!reviewerId) return;

    const newReview: Review = {
      id: `r${Date.now()}`,
      questId,
      reviewerId,
      revieweeId,
      rating,
      comment,
      role,
      createdAt: new Date().toISOString()
    };

    setReviews(prev => [...prev, newReview]);

    // Update User Rating
    setUsers(prev => prev.map(u => {
      if (u.id === revieweeId) {
        if (role === 'adventurer') {
          const newReviewCount = u.adventurerReviewCount + 1;
          const newRating = (u.adventurerRating * u.adventurerReviewCount + rating) / newReviewCount;
          
          // Overall aggregate
          const totalReviewCount = u.reviewCount + 1;
          const totalRating = (u.rating * u.reviewCount + rating) / totalReviewCount;

          return {
            ...u,
            adventurerRating: parseFloat(newRating.toFixed(1)),
            adventurerReviewCount: newReviewCount,
            rating: parseFloat(totalRating.toFixed(1)),
            reviewCount: totalReviewCount
          };
        } else {
          const newReviewCount = u.creatorReviewCount + 1;
          const newRating = (u.creatorRating * u.creatorReviewCount + rating) / newReviewCount;

          // Overall aggregate
          const totalReviewCount = u.reviewCount + 1;
          const totalRating = (u.rating * u.reviewCount + rating) / totalReviewCount;

          return {
            ...u,
            creatorRating: parseFloat(newRating.toFixed(1)),
            creatorReviewCount: newReviewCount,
            rating: parseFloat(totalRating.toFixed(1)),
            reviewCount: totalReviewCount
          };
        }
      }
      return u;
    }));

    // Update Quest status
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        if (role === 'adventurer') {
          return { ...q, creatorReviewed: true };
        } else {
          return { ...q, takerReviewed: true };
        }
      }
      return q;
    }));
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

  const updateUserProfile = (profileData: Partial<Pick<User, 'name' | 'email' | 'phone' | 'bio' | 'location' | 'avatar'>>) => {
    updateCurrentUser(prev => {
      let initials = prev.initials;
      if (profileData.name) {
        const names = profileData.name.trim().split(/\s+/);
        initials = names.length > 1 
          ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
          : names[0].substring(0, 2).toUpperCase();
      }
      return { ...prev, ...profileData, initials };
    });
  };

  const verifyAccount = () => {
    updateCurrentUser(prev => ({ ...prev, isVerified: true }));
    addNotification({
      type: 'system',
      title: 'Verifikasi Berhasil',
      message: 'Selamat! Akun kamu sekarang sudah terverifikasi. Kamu sekarang bisa memposting dan mengambil quest.'
    });
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      switchUser,
      login,
      register,
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
      reportDispute,
      submitQuestEvidence,
      cancelQuestEvidence,
      submitReview,
      updateUserProfile,
      verifyAccount,
      addWithdrawalPreset,
      removeWithdrawalPreset
    }}>
      {children}
    </AppContext.Provider>
  );
};

