import { db, isFirebaseConfigured } from '@/config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from '@/types/user';
import { syncStorage } from '@/services/storageSync';

const USERS_COLLECTION = 'users';
const LOCAL_USERS_KEY = 'paribet_mock_users';

export const INITIAL_WELCOME_TOKENS = 1000;

export const userService = {
  /**
   * Fetch user profile from Firestore or central storage / local cache
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (isFirebaseConfigured) {
      try {
        const docRef = doc(db, USERS_COLLECTION, uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data() as UserProfile;
        }
      } catch (err) {
        console.warn('[userService] Failed to get doc from Firestore, checking central storage:', err);
      }
    }

    // Central storage read
    try {
      const stored = await syncStorage.getItemAsync(LOCAL_USERS_KEY);
      if (stored) {
        const localUsers = typeof stored === 'string' ? JSON.parse(stored) : stored;
        if (localUsers[uid]) return localUsers[uid];
      }
    } catch (err) {
      console.warn('[userService] Failed to get user from central storage:', err);
    }

    // Fast local cache fallback
    try {
      const fallback = syncStorage.getItem(LOCAL_USERS_KEY);
      if (fallback) {
        const localUsers = JSON.parse(fallback);
        return localUsers[uid] || null;
      }
    } catch {}

    return null;
  },

  /**
   * Create a new verified student user profile
   */
  async createUserProfile(profileData: {
    uid: string;
    email: string;
    officialName: string;
    admissionNumber: string;
    nickname: string;
    profilePicture?: string;
    role?: UserRole;
  }): Promise<UserProfile> {
    const profile: UserProfile = {
      uid: profileData.uid,
      email: profileData.email.toLowerCase(),
      officialName: profileData.officialName,
      admissionNumber: profileData.admissionNumber.toLowerCase(),
      nickname: profileData.nickname || profileData.officialName.split(' ')[0],
      profilePicture: profileData.profilePicture || `https://api.dicebear.com/7.x/bottts/svg?seed=${profileData.admissionNumber}`,
      createdAt: new Date().toISOString(),
      role: profileData.role || 'regular_user',
      accountStatus: 'active',
      walletBalance: INITIAL_WELCOME_TOKENS,
      lockedBalance: 0,
      statistics: {
        predictionsParticipated: 0,
        predictionsWon: 0,
        winRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalRewardsEarned: 0,
        totalTokensCommitted: 0,
        loansGiven: 0,
        loansCompleted: 0
      }
    };

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, USERS_COLLECTION, profile.uid), profile);
      } catch (err) {
        console.warn('[userService] Failed to write profile to Firestore:', err);
      }
    }

    // Persist to central storage and local storage
    let localUsers: Record<string, UserProfile> = {};
    try {
      const stored = await syncStorage.getItemAsync(LOCAL_USERS_KEY);
      if (stored) {
        localUsers = typeof stored === 'string' ? JSON.parse(stored) : stored;
      }
    } catch {
      const local = syncStorage.getItem(LOCAL_USERS_KEY);
      if (local) {
        try { localUsers = JSON.parse(local); } catch {}
      }
    }

    localUsers[profile.uid] = profile;
    await syncStorage.setItemAsync(LOCAL_USERS_KEY, JSON.stringify(localUsers));

    return profile;
  },

  /**
   * Update editable fields (nickname, avatar, bio)
   * Official name, admission number, and role CANNOT be changed.
   */
  async updateProfile(
    uid: string,
    updates: { nickname?: string; profilePicture?: string; bio?: string; hasChangedPassword?: boolean }
  ): Promise<UserProfile | null> {
    // Sanitize updates: only allow specific safe fields
    const safeUpdates: Partial<UserProfile> = {};
    if (updates.nickname !== undefined && updates.nickname.trim().length > 0) {
      safeUpdates.nickname = updates.nickname.trim();
    }
    if (updates.profilePicture !== undefined) {
      safeUpdates.profilePicture = updates.profilePicture;
    }
    if (updates.bio !== undefined) {
      safeUpdates.bio = updates.bio.trim();
    }
    if (updates.hasChangedPassword !== undefined) {
      safeUpdates.hasChangedPassword = updates.hasChangedPassword;
    }

    if (isFirebaseConfigured) {
      try {
        const docRef = doc(db, USERS_COLLECTION, uid);
        await updateDoc(docRef, safeUpdates);
      } catch (err) {
        console.warn('[userService] Failed to update Firestore profile:', err);
      }
    }

    // Update in central storage and local storage
    let localUsers: Record<string, UserProfile> = {};
    try {
      const stored = await syncStorage.getItemAsync(LOCAL_USERS_KEY);
      if (stored) {
        localUsers = typeof stored === 'string' ? JSON.parse(stored) : stored;
      }
    } catch {
      const local = syncStorage.getItem(LOCAL_USERS_KEY);
      if (local) {
        try { localUsers = JSON.parse(local); } catch {}
      }
    }

    if (localUsers[uid]) {
      localUsers[uid] = { ...localUsers[uid], ...safeUpdates, updatedAt: new Date().toISOString() };
      await syncStorage.setItemAsync(LOCAL_USERS_KEY, JSON.stringify(localUsers));
      return localUsers[uid];
    }

    return null;
  },

  /**
   * Get all registered student users for real leaderboard
   */
  async getAllUsers(): Promise<UserProfile[]> {
    let list: UserProfile[] = [];
    if (isFirebaseConfigured) {
      try {
        const { getDocs, collection } = await import('firebase/firestore');
        const snap = await getDocs(collection(db, USERS_COLLECTION));
        list = snap.docs.map((d) => d.data() as UserProfile);
      } catch (err) {
        console.warn('[userService] Failed to get all users from Firestore:', err);
      }
    }
    if (list.length === 0) {
      try {
        const stored = await syncStorage.getItemAsync(LOCAL_USERS_KEY);
        if (stored) {
          const localUsers = typeof stored === 'string' ? JSON.parse(stored) : stored;
          list = Object.values(localUsers) as UserProfile[];
        }
      } catch {
        list = [];
      }
    }
    if (list.length === 0) {
      try {
        const local = syncStorage.getItem(LOCAL_USERS_KEY);
        if (local) {
          list = Object.values(JSON.parse(local)) as UserProfile[];
        }
      } catch {}
    }
    // Exclude master administrator account from player leaderboard
    return list.filter((u) => u.role !== 'admin' && u.admissionNumber !== 'ADMIN');
  }
};

