/**
 * Definisi context dan hook untuk state global aplikasi.
 * Digunakan saat: Mengakses atau mengubah state global di berbagai komponen melalui hook useApp.
 */
import { createContext, useContext } from 'react';
import type { AppState, Quest, AppNotification, WithdrawalPreset } from '../types';

export interface AppContextType {
  state: AppState;
  topUp: (amount: number) => void;
  withdraw: (amount: number) => void;
  addQuest: (quest: Quest) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'unread' | 'time'>) => void;
  markAllNotificationsAsRead: () => void;
  markNotificationAsRead: (id: number) => void;
  sendMessage: (questId: string, text: string) => void;
  completeQuest: (questId: string) => void;
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
