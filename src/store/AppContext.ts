/**
 * Definisi context dan hook untuk state global aplikasi.
 * Digunakan saat: Mengakses atau mengubah state global di berbagai komponen melalui hook useApp.
 */
import { createContext, useContext } from 'react';
import type { AppState, Quest, AppNotification, WithdrawalPreset, User } from '../types';

export interface AppContextType {
  state: AppState;
  switchUser: (userId: string) => void;
  login: (userId: string) => void;
  register: (userData: Pick<User, 'name' | 'email' | 'phone' | 'password'>) => void;
  logout: () => void;
  topUp: (amount: number) => void;
  withdraw: (amount: number) => void;
  addQuest: (quest: Quest) => void;
  updateQuest: (quest: Quest) => void;
  deleteQuest: (questId: string) => void;
  applyForQuest: (questId: string) => void;
  cancelApplication: (questId: string) => void;
  acceptApplicant: (questId: string, userId: string) => void;
  rejectApplicant: (questId: string, userId: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'unread' | 'time'>) => void;
  markAllNotificationsAsRead: () => void;
  markNotificationAsRead: (id: number) => void;
  sendMessage: (chatId: string, text: string) => void;
  findOrCreateChat: (userIds: string[], questId?: string) => string;
  completeQuest: (questId: string) => void;
  submitQuestEvidence: (questId: string, image?: string, notes?: string) => void;
  submitReview: (questId: string, revieweeId: string, rating: number, comment: string, role: 'adventurer' | 'creator') => void;
  updateUserProfile: (profileData: Partial<Pick<User, 'name' | 'email' | 'phone' | 'bio' | 'location' | 'avatar'>>) => void;
  verifyAccount: () => void;
  addWithdrawalPreset: (preset: Omit<WithdrawalPreset, 'id'>) => void;
  removeWithdrawalPreset: (id: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
