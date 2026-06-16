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
  notifications: AppNotification[];
  withdrawalPresets: WithdrawalPreset[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  time: string;
}

export interface Chat {
  id: string;
  participants: string[]; // User IDs
  questId?: string; // Optional link to a quest
}

export interface Quest {
  id: string;
  category: string;
  title: string;
  price: string;
  distance: string;
  image: string;
  description: string;
  status: 'active' | 'completed' | 'available' | 'pending';
  date?: string;
  createdAt?: string;
  location?: string;
  fromLocation?: string;
  toLocation?: string;
  deadline?: string;
  creatorId: string;
  takerId?: string;
  applicantIds?: string[];
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
  users: User[];
  currentUserId: string | null;
  user: User | null; // Current logged in user, null if logged out
  allQuests: Quest[];
  availableQuests: Quest[];
  activeQuests: Quest[];
  pendingQuests: Quest[];
  completedQuests: Quest[];
  categories: string[];
  chats: Chat[];
  messages: Message[];
}
