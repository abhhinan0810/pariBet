export type UserRole = 'regular_user' | 'prediction_creator' | 'admin';

export type AccountStatus = 'active' | 'suspended' | 'pending_verification';

export interface UserStatistics {
  predictionsParticipated: number;
  predictionsWon: number;
  winRate: number; // percentage (0 - 100)
  currentStreak: number;
  longestStreak: number;
  totalRewardsEarned: number;
  totalTokensCommitted: number;
  loansGiven: number;
  loansCompleted: number;
  bestComebackRankChange?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  officialName: string;
  admissionNumber: string;
  nickname: string;
  profilePicture: string;
  createdAt: string; // ISO date string or Firestore Timestamp
  updatedAt?: string;
  role: UserRole;
  accountStatus: AccountStatus;
  walletBalance: number;
  lockedBalance?: number;
  statistics: UserStatistics;
  bio?: string;
}

export interface ApprovedStudent {
  email: string;
  official_name: string;
  admission_number: string;
  isRegistered?: boolean;
  registeredUid?: string;
  registeredAt?: string;
}

export interface AuthState {
  user: UserProfile | null;
  firebaseUser: any | null;
  loading: boolean;
  isVerified: boolean;
  error: string | null;
}

