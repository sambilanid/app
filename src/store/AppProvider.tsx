/**
 * Provider untuk AppContext.
 * Digunakan saat: Membungkus seluruh aplikasi untuk menyediakan state global seperti data user dan daftar quest.
 */
import React, { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { AppContext } from './AppContext';
import type { User, Quest, AppState, AppNotification, WithdrawalPreset, Message, Chat, Review } from '../types';
import { categories, parsePrice } from '../utils/questUtils';

import {
  initialUsers,
  initialQuests,
  initialChats,
  initialReviews,
  initialMessages
} from './mockData';

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
    categories,
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

    const priceAmount = parsePrice(quest.price);
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

    const priceAmount = parsePrice(quest.price);
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

