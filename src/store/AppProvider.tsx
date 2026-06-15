/**
 * Provider untuk AppContext.
 * Digunakan saat: Membungkus seluruh aplikasi untuk menyediakan state global seperti data user dan daftar quest.
 */
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { AppContext } from './AppContext';
import type { User, Quest, AppState, AppNotification, WithdrawalPreset, Message } from '../types';

import avatarAde from '../assets/avatar-ade.svg';
import questFood from '../assets/quest-food.png';
import questShopping from '../assets/quest-shopping.png';
import questSouvenir from '../assets/quest-souvenir.png';

const initialNotifications: AppNotification[] = [
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
];

const initialUser: User = {
  id: '1',
  name: 'ADE YAHYA HENDRIAWAN',
  initials: 'AY',
  avatar: avatarAde,
  rating: 0.0,
  reviewCount: 0,
  questsCreated: 0,
  questsCompleted: 0,
  isVerified: false,
  hasSkck: false,
  balance: 271000000,
};

const initialQuests: Quest[] = [
  {
    id: 'q1',
    category: 'JASA TITIP',
    title: 'Jastip Mie Gacoan',
    price: 'Rp15.000',
    distance: '0.8 km',
    image: questFood,
    description: 'Beli 2 porsi Mie Iblis level 4, titip di kawasan perkantoran Purbalingga Food Centre.',
    status: 'available',
    location: 'Kalimanah, Purbalingga',
    fromLocation: 'Mie Gacoan Purbalingga',
    toLocation: 'Perkantoran PFC',
    deadline: '45 mnt',
    creator: {
      name: 'Reza Kurniawan',
      initials: 'RK',
      rating: 4.7,
      questsCreated: 8
    }
  },
  {
    id: 'q2',
    category: 'JASA TITIP',
    title: 'Jastip Alfamart',
    price: 'Rp18.000',
    distance: '1.2 km',
    image: questShopping,
    description: 'Tolong belikan galon Aqua dan sabun mandi di Alfamart depan kampus.',
    status: 'available',
    location: 'Purbalingga Lor',
    fromLocation: 'Alfamart Kampus',
    toLocation: 'Kosan Mawar',
    deadline: '1 jam',
    creator: {
      name: 'Sari Nur Aini',
      initials: 'SA',
      rating: 4.9,
      questsCreated: 12
    }
  },
  {
    id: 'q3',
    category: 'JASA TITIP',
    title: 'Oleh-oleh Purbalingga',
    price: 'Rp25.000',
    distance: '1.2 km',
    image: questSouvenir,
    description: 'Titip makanan khas Purbalingga dong, buat oleh-oleh saudaraku.',
    status: 'available',
    location: 'Padamara',
    fromLocation: 'Toko Oleh-oleh Mirasa',
    toLocation: 'Rumah Makan Padang',
    deadline: '2 jam',
    creator: {
      name: 'Budi Santoso',
      initials: 'BS',
      rating: 4.5,
      questsCreated: 5
    }
  },
  {
    id: 'q4',
    category: 'JASA TITIP',
    title: 'Jastip Mie Ayam',
    price: 'Rp20.000',
    distance: '1.0 km',
    image: questFood,
    description: 'Beli mie ayam legendaris Pak Di.',
    status: 'active',
    location: 'Kalimanah',
    fromLocation: 'Mie Ayam Pak Di',
    toLocation: 'Kantor Bupati',
    deadline: '30 mnt',
    messages: [
      { id: 'm1', text: 'Halo kak, saya sudah di depan Mie Ayam Pak Di ya.', sender: 'other', time: '10:40 AM' },
      { id: 'm2', text: 'Oke sebentar ya, saya transfer uangnya.', sender: 'me', time: '10:41 AM' },
      { id: 'm4', text: 'Sudah saya transfer ya kak Rp35.000 (mie + ongkir).', sender: 'me', time: '10:43 AM' },
      { id: 'm5', text: 'Masuk kak. Ini lagi antre, lumayan ramai ya hari ini.', sender: 'other', time: '10:45 AM' },
      { id: 'm6', text: 'Siap, santai aja kak. Jangan lupa sambalnya dipisah ya.', sender: 'me', time: '10:46 AM' },
    ],
    creator: {
      name: 'Reza Kurniawan',
      initials: 'RK',
      rating: 4.7,
      questsCreated: 8
    }
  },
  {
    id: 'q5',
    category: 'JASA TITIP',
    title: 'Antar Galon ke Kamar',
    price: 'Rp5.000',
    distance: '0.1 km',
    image: questShopping,
    description: 'Tolong anterin galon yang udah didepan pintu ke dalem kamar.',
    status: 'active',
    location: 'Kost Mawar',
    fromLocation: 'Depan Pintu',
    toLocation: 'Kamar 102',
    deadline: '15 mnt',
    messages: [
      { id: 'm3', text: 'Permisi kak, galonnya sudah saya taruh di dalam ya.', sender: 'other', time: '11:20 AM' },
    ],
    creator: {
      name: 'Budi Santoso',
      initials: 'BS',
      rating: 4.5,
      questsCreated: 5
    }
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [withdrawalPresets, setWithdrawalPresets] = useState<WithdrawalPreset[]>([]);

  const state: AppState = {
    user,
    availableQuests: quests.filter(q => q.status === 'available'),
    activeQuests: quests.filter(q => q.status === 'active'),
    completedQuests: quests.filter(q => q.status === 'completed'),
    notifications,
    withdrawalPresets,
    categories: ['Jasa Titip', 'Antar/Jemput', 'Belanja', 'Makanan', 'Servis', 'Lainnya'],
  };

  const topUp = (amount: number) => {
    setUser(prev => ({ ...prev, balance: prev.balance + amount }));
  };

  const withdraw = (amount: number) => {
    setUser(prev => ({ ...prev, balance: Math.max(0, prev.balance - amount) }));
  };

  const addQuest = (quest: Quest) => {
    setQuests(prev => [...prev, quest]);
  };

  const sendMessage = (questId: string, text: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        const newMessage: Message = {
          id: `m${Date.now()}`,
          text,
          sender: 'me',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        return {
          ...q,
          messages: [...(q.messages || []), newMessage]
        };
      }
      return q;
    }));
  };

  const completeQuest = (questId: string) => {
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, status: 'completed' } : q));
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'unread' | 'time'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: Date.now(),
      unread: true,
      time: 'Baru saja',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const addWithdrawalPreset = (preset: Omit<WithdrawalPreset, 'id'>) => {
    const newPreset: WithdrawalPreset = {
      ...preset,
      id: Date.now().toString(),
    };
    setWithdrawalPresets(prev => [...prev, newPreset]);
  };

  const removeWithdrawalPreset = (id: string) => {
    setWithdrawalPresets(prev => prev.filter(p => p.id !== id));
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      topUp, 
      withdraw, 
      addQuest, 
      addNotification,
      markAllNotificationsAsRead,
      markNotificationAsRead,
      sendMessage,
      completeQuest,
      addWithdrawalPreset,
      removeWithdrawalPreset
    }}>
      {children}
    </AppContext.Provider>
  );
};
