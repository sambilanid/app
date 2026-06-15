/**
 * Provider untuk AppContext.
 * Digunakan saat: Membungkus seluruh aplikasi untuk menyediakan state global seperti data user dan daftar quest.
 */
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { AppContext } from './AppContext';
import type { User, Quest, AppState, AppNotification } from '../types';

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
    creator: {
      name: 'Reza Kurniawan',
      initials: 'RK',
      rating: 4.7,
      questsCreated: 8
    }
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  const state: AppState = {
    user,
    availableQuests: quests.filter(q => q.status === 'available'),
    activeQuests: quests.filter(q => q.status === 'active'),
    completedQuests: quests.filter(q => q.status === 'completed'),
    notifications,
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

  return (
    <AppContext.Provider value={{ 
      state, 
      topUp, 
      withdraw, 
      addQuest, 
      addNotification,
      markAllNotificationsAsRead,
      markNotificationAsRead 
    }}>
      {children}
    </AppContext.Provider>
  );
};
