import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/config/firebase';
import { UserProfile, ApprovedStudent } from '@/types/user';
import { studentService } from '@/services/studentService';
import { userService } from '@/services/userService';
import { syncStorage } from '@/services/storageSync';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isVerified: boolean;
  error: string | null;
  tempApprovedStudent: ApprovedStudent | null;
  isFirstLogin: boolean;
  setIsFirstLogin: (val: boolean) => void;
  register: (email: string, password: string, nickname?: string) => Promise<{ success: boolean; requiresVerification: boolean; studentData: ApprovedStudent; profile?: UserProfile }>;
  login: (email: string, password: string) => Promise<{ success: boolean; isVerified: boolean; isAdmin?: boolean; isFirstLogin?: boolean }>;
  logout: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  confirmVerification: () => void;
  completeProfileSetup: (nickname: string, profilePicture?: string) => Promise<UserProfile>;
  refreshUserProfile: () => Promise<void>;
  clearError: () => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'paribet_mock_session_uid';
const LOCAL_VERIFIED_KEY = 'paribet_email_verified';

const ADMIN_EMAILS = [
  (import.meta.env.VITE_ADMIN_EMAIL || 'admin@paribet.internal').toLowerCase(),
  'admin@ceconline.edu',
  'admin@paribet.internal'
];
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@PariBet2025';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_VERIFIED_KEY) === 'true';
  });
  const [error, setError] = useState<string | null>(null);
  const [tempApprovedStudent, setTempApprovedStudent] = useState<ApprovedStudent | null>(null);
  const isDemoMode = !isFirebaseConfigured;

  // Initialize auth listener & central storage sync
  useEffect(() => {
    // Initial sync with central server so any device gets latest users and credentials
    syncStorage.syncAll().catch(() => {});

    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          const verified = fbUser.emailVerified || localStorage.getItem(LOCAL_VERIFIED_KEY) === 'true';
          setIsVerified(verified);
          const profile = await userService.getUserProfile(fbUser.uid);
          setUser(profile);
          if (profile) {
            setIsVerified(true);
            localStorage.setItem(LOCAL_VERIFIED_KEY, 'true');
          }
        } else {
          // Check if admin session was saved locally
          const savedUid = localStorage.getItem(LOCAL_SESSION_KEY);
          if (savedUid === 'admin_master_account') {
            const adminProfile = await userService.getUserProfile('admin_master_account');
            if (adminProfile && adminProfile.role === 'admin') {
              setUser(adminProfile);
              setIsVerified(true);
              setFirebaseUser({
                uid: 'admin_master_account',
                email: adminProfile.email,
                emailVerified: true
              } as any);
            } else {
              setUser(null);
              setIsVerified(false);
            }
          } else {
            setUser(null);
            setIsVerified(false);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Demo / offline session restoration
      const savedUid = localStorage.getItem(LOCAL_SESSION_KEY);
      if (savedUid) {
        userService.getUserProfile(savedUid).then((profile) => {
          if (profile) {
            setUser(profile);
            setIsVerified(true);
            localStorage.setItem(LOCAL_VERIFIED_KEY, 'true');
            setFirebaseUser({
              uid: profile.uid,
              email: profile.email,
              emailVerified: true
            } as any);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }
  }, [isDemoMode]);

  const clearError = () => setError(null);

  /**
   * Confirm Verification manually (bypasses email wait if in classroom or test environment)
   */
  const confirmVerification = () => {
    setIsVerified(true);
    localStorage.setItem(LOCAL_VERIFIED_KEY, 'true');
  };

  /**
   * Register with College Email and Password - Instant Setup, No Email Verification Waiting!
   */
  const register = async (email: string, password: string, nickname?: string) => {
    setError(null);
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // 1. Authoritative Roster Validation against data/student_roster.csv
      const verification = await studentService.verifyStudentEmail(normalizedEmail);
      if (!verification.isApproved || !verification.studentData) {
        throw new Error(verification.error || 'Registration rejected: Student not in MCA directory.');
      }

      const student = verification.studentData;
      setTempApprovedStudent(student);

      const finalNickname = nickname?.trim() || student.official_name.split(' ')[0];
      let createdUid = `uid_${student.admission_number}`;
      let fbUserObj: any = null;

      if (isFirebaseConfigured) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
          fbUserObj = userCredential.user;
          createdUid = fbUserObj.uid;
        } catch (authErr: any) {
          if (authErr.code === 'auth/email-already-in-use') {
            const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
            fbUserObj = userCredential.user;
            createdUid = fbUserObj.uid;
          } else {
            throw authErr;
          }
        }
      }

      // Immediately create active student profile with 1,000 welcome tokens
      const newProfile = await userService.createUserProfile({
        uid: createdUid,
        email: student.email,
        officialName: student.official_name,
        admissionNumber: student.admission_number,
        nickname: finalNickname,
        role: 'regular_user' // Normal students are always regular users
      });

      localStorage.setItem(LOCAL_SESSION_KEY, createdUid);
      localStorage.setItem(LOCAL_VERIFIED_KEY, 'true');
      setUser(newProfile);
      setIsVerified(true);
      setFirebaseUser(fbUserObj || ({
        uid: createdUid,
        email: student.email,
        emailVerified: true
      } as any));

      return {
        success: true,
        requiresVerification: false,
        studentData: student,
        profile: newProfile
      };
    } catch (err: any) {
      console.error('[AuthContext] Registration failed:', err);
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with email & password - Supports Dedicated Admin or MCA Students
   */
  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const isAdminAttempt = ADMIN_EMAILS.includes(normalizedEmail);

      // --- DEDICATED SEPARATE ADMIN ACCOUNT ---
      if (isAdminAttempt) {
        if (password !== ADMIN_PASSWORD) {
          throw new Error('Invalid Administrator credentials. Please verify your password.');
        }

        const adminUid = 'admin_master_account';
        let adminProfile: UserProfile = {
          uid: adminUid,
          email: normalizedEmail,
          officialName: 'Master Administrator',
          admissionNumber: 'ADMIN',
          nickname: 'Administrator',
          profilePicture: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminMaster&backgroundColor=140d33',
          createdAt: new Date().toISOString(),
          role: 'admin',
          accountStatus: 'active',
          walletBalance: 100000,
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
            try {
              await signInWithEmailAndPassword(auth, normalizedEmail, password);
            } catch (fbErr: any) {
              if (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') {
                try {
                  await createUserWithEmailAndPassword(auth, normalizedEmail, password);
                } catch (_) {}
              }
            }
            const existing = await userService.getUserProfile(adminUid);
            if (existing) {
              adminProfile = { ...existing, role: 'admin' };
            } else {
              await userService.createUserProfile(adminProfile);
            }
          } catch (e) {
            console.warn('[AuthContext] Firebase admin setup warning:', e);
          }
        }

        localStorage.setItem(LOCAL_SESSION_KEY, adminUid);
        localStorage.setItem(LOCAL_VERIFIED_KEY, 'true');
        const localUsers = JSON.parse(localStorage.getItem('paribet_mock_users') || '{}');
        localUsers[adminUid] = adminProfile;
        localStorage.setItem('paribet_mock_users', JSON.stringify(localUsers));

        setUser(adminProfile);
        setIsVerified(true);
        setFirebaseUser({
          uid: adminUid,
          email: normalizedEmail,
          emailVerified: true
        } as any);

        return { success: true, isVerified: true, isAdmin: true };
      }

      // --- REGULAR MCA STUDENT ACCOUNT ---
      const credCheck = await studentService.verifyStudentCredential(normalizedEmail, password);
      if (!credCheck.isApproved || !credCheck.studentData) {
        throw new Error(credCheck.error || 'Access denied: You are not an approved member of this MCA classroom.');
      }

      const student = credCheck.studentData;
      const mockUid = `uid_${student.admission_number}`;
      let profile = await userService.getUserProfile(mockUid);

      if (!profile) {
        profile = await userService.createUserProfile({
          uid: mockUid,
          email: student.email,
          officialName: student.official_name,
          admissionNumber: student.admission_number,
          nickname: student.official_name.split(' ')[0],
          role: 'regular_user'
        });
      }

      // Guarantee no student has admin privileges
      if (profile.role === 'admin') {
        profile.role = 'regular_user';
      }

      localStorage.setItem(LOCAL_SESSION_KEY, mockUid);
      localStorage.setItem(LOCAL_VERIFIED_KEY, 'true');
      setUser(profile);
      setIsVerified(true);
      setFirebaseUser({
        uid: mockUid,
        email: student.email,
        emailVerified: true
      } as any);

      const requiresFirstLogin = credCheck.isFirstLogin || (!profile.hasChangedPassword && !credCheck.studentData.hasChangedPassword);
      setIsFirstLogin(requiresFirstLogin);

      return {
        success: true,
        isVerified: true,
        isAdmin: false,
        isFirstLogin: requiresFirstLogin
      };
    } catch (err: any) {
      console.error('[AuthContext] Login failed:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Complete Profile Setup & Claim Bonus
   */
  const completeProfileSetup = async (nickname: string, profilePicture?: string) => {
    const currentUid = user?.uid || firebaseUser?.uid || `uid_${tempApprovedStudent?.admission_number || 'default'}`;
    const student = tempApprovedStudent || {
      email: user?.email || firebaseUser?.email || '',
      official_name: user?.officialName || 'Student',
      admission_number: user?.admissionNumber || 'mca'
    };

    let updated = await userService.getUserProfile(currentUid);
    if (!updated) {
      updated = await userService.createUserProfile({
        uid: currentUid,
        email: student.email,
        officialName: student.official_name,
        admissionNumber: student.admission_number,
        nickname: nickname.trim(),
        profilePicture
      });
    } else {
      updated = await userService.updateProfile(currentUid, {
        nickname: nickname.trim(),
        profilePicture,
        hasChangedPassword: true
      });
    }

    if (updated) {
      updated.hasChangedPassword = true;
      await userService.updateProfile(currentUid, { hasChangedPassword: true });

      setUser(updated);
      setIsFirstLogin(false);
      setIsVerified(true);
      localStorage.setItem(LOCAL_VERIFIED_KEY, 'true');
      localStorage.setItem(LOCAL_SESSION_KEY, currentUid);
      return updated;
    }
    throw new Error('Failed to complete profile setup');
  };

  const resendVerificationEmail = async () => {
    if (firebaseUser && isFirebaseConfigured) {
      await sendEmailVerification(firebaseUser);
    }
  };

  const refreshUserProfile = async () => {
    if (user?.uid) {
      const refreshed = await userService.getUserProfile(user.uid);
      if (refreshed) setUser(refreshed);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      await signOut(auth);
    }
    localStorage.removeItem(LOCAL_SESSION_KEY);
    localStorage.removeItem(LOCAL_VERIFIED_KEY);
    setUser(null);
    setFirebaseUser(null);
    setIsVerified(false);
    setTempApprovedStudent(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isVerified,
        error,
        tempApprovedStudent,
        isFirstLogin,
        setIsFirstLogin,
        register,
        login,
        logout,
        resendVerificationEmail,
        confirmVerification,
        completeProfileSetup,
        refreshUserProfile,
        clearError,
        isDemoMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
