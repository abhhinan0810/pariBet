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

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isVerified: boolean;
  error: string | null;
  tempApprovedStudent: ApprovedStudent | null;
  register: (email: string, password: string) => Promise<{ success: boolean; requiresVerification: boolean; studentData: ApprovedStudent }>;
  login: (email: string, password: string) => Promise<{ success: boolean; isVerified: boolean }>;
  logout: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  completeProfileSetup: (nickname: string, profilePicture?: string) => Promise<UserProfile>;
  refreshUserProfile: () => Promise<void>;
  clearError: () => void;
  // Demo mode switch for testing without live Firebase project
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'paribet_mock_session_uid';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tempApprovedStudent, setTempApprovedStudent] = useState<ApprovedStudent | null>(null);
  const isDemoMode = !isFirebaseConfigured;

  // Initialize auth listener
  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          setIsVerified(fbUser.emailVerified);
          const profile = await userService.getUserProfile(fbUser.uid);
          setUser(profile);
        } else {
          setUser(null);
          setIsVerified(false);
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
   * Register with MCA College Email and Password
   */
  const register = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      // 1. Authoritative Roster Validation
      const verification = await studentService.verifyStudentEmail(email);
      if (!verification.isApproved || !verification.studentData) {
        throw new Error(verification.error || 'Registration rejected: Student not in MCA directory.');
      }

      const student = verification.studentData;
      setTempApprovedStudent(student);

      if (isFirebaseConfigured) {
        // 2. Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        // 3. Send email verification link
        await sendEmailVerification(fbUser);
        setFirebaseUser(fbUser);
        setIsVerified(fbUser.emailVerified);

        // Profile will be formally completed after verification
        return {
          success: true,
          requiresVerification: true,
          studentData: student
        };
      } else {
        // Demo fallback: simulate registration
        const mockUid = `uid_${student.admission_number}`;
        const newProfile = await userService.createUserProfile({
          uid: mockUid,
          email: student.email,
          officialName: student.official_name,
          admissionNumber: student.admission_number,
          nickname: student.official_name.split(' ')[0]
        });

        localStorage.setItem(LOCAL_SESSION_KEY, mockUid);
        setUser(newProfile);
        setIsVerified(true);
        setFirebaseUser({
          uid: mockUid,
          email: student.email,
          emailVerified: true
        } as any);

        return {
          success: true,
          requiresVerification: false,
          studentData: student
        };
      }
    } catch (err: any) {
      console.error('[AuthContext] Registration failed:', err);
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with email & password
   */
  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      // 1. Verify email against student roster first
      const verification = await studentService.verifyStudentEmail(email);
      if (!verification.isApproved || !verification.studentData) {
        throw new Error('Access denied: You are not an approved member of this MCA classroom.');
      }

      if (isFirebaseConfigured) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        setFirebaseUser(fbUser);
        setIsVerified(fbUser.emailVerified);

        if (!fbUser.emailVerified) {
          throw new Error('Please verify your college email address before logging in.');
        }

        let profile = await userService.getUserProfile(fbUser.uid);
        if (!profile) {
          // If profile does not exist yet (e.g. freshly verified), create it
          profile = await userService.createUserProfile({
            uid: fbUser.uid,
            email: verification.studentData.email,
            officialName: verification.studentData.official_name,
            admissionNumber: verification.studentData.admission_number,
            nickname: verification.studentData.official_name.split(' ')[0]
          });
        }
        setUser(profile);

        return { success: true, isVerified: true };
      } else {
        // Demo fallback login
        const student = verification.studentData;
        const mockUid = `uid_${student.admission_number}`;
        let profile = await userService.getUserProfile(mockUid);

        if (!profile) {
          profile = await userService.createUserProfile({
            uid: mockUid,
            email: student.email,
            officialName: student.official_name,
            admissionNumber: student.admission_number,
            nickname: student.official_name.split(' ')[0]
          });
        }

        localStorage.setItem(LOCAL_SESSION_KEY, mockUid);
        setUser(profile);
        setIsVerified(true);
        setFirebaseUser({
          uid: mockUid,
          email: student.email,
          emailVerified: true
        } as any);

        return { success: true, isVerified: true };
      }
    } catch (err: any) {
      console.error('[AuthContext] Login failed:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Complete Profile Setup (Pick Nickname & Avatar)
   */
  const completeProfileSetup = async (nickname: string, profilePicture?: string) => {
    if (!user && !firebaseUser && !tempApprovedStudent) {
      throw new Error('No active user to complete setup for');
    }

    const currentUid = user?.uid || firebaseUser?.uid || `uid_${tempApprovedStudent?.admission_number}`;
    const student = tempApprovedStudent || {
      email: user?.email || firebaseUser?.email || '',
      official_name: user?.officialName || '',
      admission_number: user?.admissionNumber || ''
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
        profilePicture
      });
    }

    if (updated) {
      setUser(updated);
      return updated;
    }
    throw new Error('Failed to complete profile setup');
  };

  /**
   * Resend Verification Email
   */
  const resendVerificationEmail = async () => {
    if (firebaseUser && isFirebaseConfigured) {
      await sendEmailVerification(firebaseUser);
    } else {
      console.log('[Auth] Mock verification email sent');
    }
  };

  /**
   * Refresh user profile data from Firestore
   */
  const refreshUserProfile = async () => {
    if (user?.uid) {
      const refreshed = await userService.getUserProfile(user.uid);
      if (refreshed) setUser(refreshed);
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    if (isFirebaseConfigured) {
      await signOut(auth);
    }
    localStorage.removeItem(LOCAL_SESSION_KEY);
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
        register,
        login,
        logout,
        resendVerificationEmail,
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
