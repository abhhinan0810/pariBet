import { db, isFirebaseConfigured } from '@/config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from '@/types/user';

const USERS_COLLECTION = 'users';
const LOCAL_USERS_KEY = 'paribet_mock_users';

export const INITIAL_WELCOME_TOKENS = 1000;

export const userService = {
  /**
   * Fetch user profile from Firestore or local storage
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
        console.warn('[userService] Failed to get doc from Firestore, checking local storage:', err);
      }
    }

    // Local storage fallback for seamless testing
    const localUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
    return localUsers[uid] || null;
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

    // Persist to local storage for local/demo support
    const localUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
    localUsers[profile.uid] = profile;
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers));

    return profile;
  },

  /**
   * Update editable fields (nickname, avatar, bio)
   * Official name, admission number, and role CANNOT be changed.
   */
  async updateProfile(
    uid: string,
    updates: { nickname?: string; profilePicture?: string; bio?: string }
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

    if (isFirebaseConfigured) {
      try {
        const docRef = doc(db, USERS_COLLECTION, uid);
        await updateDoc(docRef, safeUpdates);
      } catch (err) {
        console.warn('[userService] Failed to update Firestore profile:', err);
      }
    }

    // Update in local storage
    const localUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
    if (localUsers[uid]) {
      localUsers[uid] = { ...localUsers[uid], ...safeUpdates, updatedAt: new Date().toISOString() };
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers));
      return localUsers[uid];
    }

    return null;
  }
};

