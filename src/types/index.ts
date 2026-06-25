/**
 * Definisi tipe data global untuk aplikasi.
 * Digunakan saat: Mendefinisikan struktur data seperti User, Quest, dan AppState di seluruh aplikasi.
 */
export interface User {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  email: string;
  phone: string;
  password?: string; // Optional for security or demo purposes
  rating: number; // Aggregate rating
  reviewCount: number; // Aggregate review count
  adventurerRating: number;
  adventurerReviewCount: number;
  creatorRating: number;
  creatorReviewCount: number;
  questsCreated?: number; // Calculated dynamically in AppProvider
  questsCompleted?: number; // Calculated dynamically in AppProvider
  isVerified: boolean;
  balance: number;
  bio?: string;
  location?: string;
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

export interface Review {
  id: string;
  questId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1-5
  comment: string;
  role: 'adventurer' | 'creator'; // Peran dari pengguna yang diulas
  createdAt: string;
}

export interface Quest {
  id: string;
  category: string;
  title: string;
  price: string;
  distance: string;
  image: string;
  description: string;
  status: 'active' | 'completed' | 'available' | 'pending' | 'disputed';
  date?: string;
  createdAt?: string;
  location?: string;
  locationDetails?: string;
  fromLocation?: string;
  fromLocationDetails?: string;
  toLocation?: string;
  toLocationDetails?: string;
  locationCoords?: { lat: number; lng: number };
  fromLocationCoords?: { lat: number; lng: number };
  toLocationCoords?: { lat: number; lng: number };
  deadline?: string;
  creatorId: string;
  takerId?: string;
  applicantIds?: string[];
  evidenceImage?: string;
  evidenceNotes?: string;
  creatorReviewed?: boolean;
  takerReviewed?: boolean;
  needsRevision?: boolean;
  revisionNotes?: string;
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
  reviews: Review[];
}
