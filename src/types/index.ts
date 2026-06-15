/**
 * Definisi tipe data global untuk aplikasi.
 * Digunakan saat: Mendefinisikan struktur data seperti User, Quest, dan AppState di seluruh aplikasi.
 */
export interface User {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  questsCreated: number;
  questsCompleted: number;
  isVerified: boolean;
  hasSkck: boolean;
  balance: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

export interface Quest {
  id: string;
  category: string;
  title: string;
  price: string;
  distance: string;
  image: string;
  description: string;
  status: 'active' | 'completed' | 'available';
  date?: string;
  location?: string;
  fromLocation?: string;
  toLocation?: string;
  deadline?: string;
  messages?: Message[];
  creator?: {
    name: string;
    initials: string;
    avatar?: string;
    rating: number;
    questsCreated: number;
  };
}

export interface AppNotification {
  id: number;
  type: 'payment' | 'quest' | 'system';
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface WithdrawalPreset {
  id: string;
  name: string;
  method: 'bank' | 'wallet';
  accountNumber: string;
  bankName?: string;
}

export interface AppState {
  user: User;
  availableQuests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  notifications: AppNotification[];
  withdrawalPresets: WithdrawalPreset[];
  categories: string[];
}
