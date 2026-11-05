import { AdminLog, SystemStats } from '@/types/admin';
import { UserProfile, UserRole } from '@/types/user';
import approvedStudentsSeed from '@/data/approved_students.json';
import { predictionService } from './predictionService';
import { loanService } from './loanService';
import { walletService } from './walletService';
import { db, isFirebaseConfigured } from '@/config/firebase';
import { doc, getDocs, collection, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';

const LOCAL_ADMIN_LOGS_KEY = 'paribet_mock_admin_logs';
const LOCAL_USERS_KEY = 'paribet_mock_users';

export const adminService = {
  /**
   * Log administrative action to authoritative audit trail
   */
  async logAction(params: {
    adminUid: string;
    adminEmail?: string;
    adminName?: string;
    action: string;
    targetId?: string;
    targetType?: 'user' | 'prediction' | 'wallet' | 'loan' | 'roster';
    reason: string;
    details?: Record<string, any>;
  }): Promise<AdminLog> {
    const log: AdminLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      adminUid: params.adminUid,
      adminEmail: params.adminEmail || 'admin@paribet.internal',
      adminName: params.adminName || 'Master Administrator',
      action: params.action,
      targetId: params.targetId,
      targetType: params.targetType,
      reason: params.reason,
      details: params.details,
      timestamp: new Date().toISOString(),
    };

    const logs: AdminLog[] = JSON.parse(localStorage.getItem(LOCAL_ADMIN_LOGS_KEY) || '[]');
    logs.unshift(log);
    localStorage.setItem(LOCAL_ADMIN_LOGS_KEY, JSON.stringify(logs));

    return log;
  },

  /**
   * Get administrative audit logs
   */
  async getLogs(): Promise<AdminLog[]> {
    return JSON.parse(localStorage.getItem(LOCAL_ADMIN_LOGS_KEY) || '[]');
  },

  /**
   * Get all registered users for administration
   */
  async getAllUsers(): Promise<UserProfile[]> {
    const localUsers: Record<string, UserProfile> = JSON.parse(
      localStorage.getItem(LOCAL_USERS_KEY) || '{}'
    );

    let usersList = Object.values(localUsers);

    if (isFirebaseConfigured) {
      try {
        const snap = await getDocs(collection(db, 'users'));
        if (!snap.empty) {
          const fbUsers: UserProfile[] = [];
          snap.forEach((d) => fbUsers.push(d.data() as UserProfile));
          // Merge fb users
          const merged: Record<string, UserProfile> = { ...localUsers };
          fbUsers.forEach((u) => {
            merged[u.uid] = u;
          });
          usersList = Object.values(merged);
        }
      } catch (err) {
        console.warn('Failed to fetch users from firestore, using local:', err);
      }
    }

    // Sort users: admins first, then by createdAt desc
    return usersList.sort((a, b) => {
      if (a.role === 'admin') return -1;
      if (b.role === 'admin') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  /**
   * Create a new user profile manually as Admin
   */
  async createUser(params: {
    email: string;
    officialName: string;
    admissionNumber: string;
    nickname: string;
    initialBalance?: number;
    role?: UserRole;
    adminUid: string;
    reason?: string;
  }): Promise<UserProfile> {
    const uid = `uid_${params.admissionNumber.toLowerCase().trim()}`;
    const newUser: UserProfile = {
      uid,
      email: params.email.toLowerCase().trim(),
      officialName: params.officialName.trim(),
      admissionNumber: params.admissionNumber.toLowerCase().trim(),
      nickname: params.nickname.trim() || params.officialName.split(' ')[0],
      profilePicture: `https://api.dicebear.com/7.x/bottts/svg?seed=${params.admissionNumber}&backgroundColor=140d33`,
      createdAt: new Date().toISOString(),
      role: params.role || 'regular_user',
      accountStatus: 'active',
      walletBalance: params.initialBalance ?? 1000,
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
        await setDoc(doc(db, 'users', uid), newUser);
      } catch (e) {
        console.warn('Failed to save user to firestore:', e);
      }
    }

    const localUsers: Record<string, UserProfile> = JSON.parse(
      localStorage.getItem(LOCAL_USERS_KEY) || '{}'
    );
    localUsers[uid] = newUser;
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers));

    await this.logAction({
      adminUid: params.adminUid,
      action: 'USER_CREATED',
      targetId: uid,
      targetType: 'user',
      reason: params.reason || `Created user ${newUser.nickname} (${newUser.admissionNumber})`,
      details: { email: newUser.email, admissionNumber: newUser.admissionNumber }
    });

    return newUser;
  },

  /**
   * Edit existing user profile
   */
  async updateUser(
    userId: string,
    updates: Partial<UserProfile>,
    adminUid: string,
    reason: string
  ): Promise<UserProfile | null> {
    const localUsers: Record<string, UserProfile> = JSON.parse(
      localStorage.getItem(LOCAL_USERS_KEY) || '{}'
    );

    if (!localUsers[userId]) return null;

    const updated = {
      ...localUsers[userId],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localUsers[userId] = updated;
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers));

    if (isFirebaseConfigured) {
      try {
        await updateDoc(doc(db, 'users', userId), updates);
      } catch (err) {
        console.warn('Failed to update firestore user:', err);
      }
    }

    await this.logAction({
      adminUid,
      action: 'USER_UPDATED',
      targetId: userId,
      targetType: 'user',
      reason,
      details: updates
    });

    return updated;
  },

  /**
   * Permanently delete a user account
   */
  async deleteUser(userId: string, adminUid: string, reason: string): Promise<boolean> {
    const localUsers: Record<string, UserProfile> = JSON.parse(
      localStorage.getItem(LOCAL_USERS_KEY) || '{}'
    );

    const userToDelete = localUsers[userId];
    delete localUsers[userId];
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers));

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (err) {
        console.warn('Failed to delete firestore user:', err);
      }
    }

    await this.logAction({
      adminUid,
      action: 'USER_DELETED',
      targetId: userId,
      targetType: 'user',
      reason,
      details: { deletedEmail: userToDelete?.email }
    });

    return true;
  },

  /**
   * Permanently delete or cancel a bet/prediction
   */
  async deleteBet(predictionId: string, adminUid: string, reason: string): Promise<void> {
    await predictionService.cancelPrediction(predictionId, `Admin Cancelled: ${reason}`);
    await predictionService.deletePrediction(predictionId);

    await this.logAction({
      adminUid,
      action: 'PREDICTION_DELETED',
      targetId: predictionId,
      targetType: 'prediction',
      reason
    });
  },

  /**
   * Force settle/resolve prediction outcome
   */
  async forceResolveBet(params: {
    predictionId: string;
    winningOptionId?: string;
    actualClosestValue?: number;
    adminUid: string;
    reason: string;
  }): Promise<{ payoutsDistributed: number; totalTokensAwarded: number }> {
    const res = await predictionService.finalizePrediction({
      predictionId: params.predictionId,
      winningOptionId: params.winningOptionId,
      actualClosestValue: params.actualClosestValue,
      submittedByUid: params.adminUid,
      isAdminOverride: true
    });

    await this.logAction({
      adminUid: params.adminUid,
      action: 'PREDICTION_FORCE_RESOLVED',
      targetId: params.predictionId,
      targetType: 'prediction',
      reason: params.reason,
      details: { ...res, winningOptionId: params.winningOptionId, actualClosestValue: params.actualClosestValue }
    });

    return res;
  },

  /**
   * Get system statistics
   */
  async getSystemStats(): Promise<SystemStats> {
    const predictions = await predictionService.getPredictions();
    const activePredictions = predictions.filter((p) => p.status === 'OPEN').length;
    const completedPredictions = predictions.filter((p) => p.status === 'FINALIZED').length;

    const allLoans = await loanService.getUserLoans('');
    const activeLoans = allLoans.filter((l) => l.status === 'ACTIVE').length;
    const overdueLoans = allLoans.filter((l) => l.status === 'OVERDUE').length;

    const localUsers: Record<string, UserProfile> = JSON.parse(
      localStorage.getItem(LOCAL_USERS_KEY) || '{}'
    );
    const usersList = Object.values(localUsers);
    const totalTokens = usersList.reduce((acc, u) => acc + (u.walletBalance || 0), 0);

    return {
      totalRegisteredStudents: usersList.length || 1,
      activeUsers: usersList.filter((u) => u.accountStatus === 'active').length || 1,
      totalPredictions: predictions.length,
      activePredictions,
      completedPredictions,
      totalTokensInCirculation: totalTokens || 53000,
      activeLoans,
      overdueLoans,
      pendingReports: 0,
    };
  },

  /**
   * Suspend or Reactivate student account
   */
  async setAccountStatus(
    userId: string,
    status: 'active' | 'suspended',
    adminUid: string,
    reason: string
  ): Promise<void> {
    const localUsers: Record<string, UserProfile> = JSON.parse(
      localStorage.getItem(LOCAL_USERS_KEY) || '{}'
    );
    if (localUsers[userId]) {
      localUsers[userId].accountStatus = status;
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers));

      if (isFirebaseConfigured) {
        try {
          await updateDoc(doc(db, 'users', userId), { accountStatus: status });
        } catch (_) {}
      }

      await this.logAction({
        adminUid,
        action: `ACCOUNT_${status.toUpperCase()}`,
        targetId: userId,
        targetType: 'user',
        reason,
      });
    }
  },

  /**
   * Administrative Virtual Token Adjustment
   */
  async issuePointAdjustment(params: {
    adminUid: string;
    targetUserId: string;
    amount: number;
    reason: string;
  }): Promise<void> {
    await walletService.recordTransaction({
      userId: params.targetUserId,
      type: 'ADMINISTRATIVE_ADJUSTMENT',
      amount: params.amount,
      description: `Admin adjustment: ${params.reason}`,
      adminUid: params.adminUid,
    });

    await this.logAction({
      adminUid: params.adminUid,
      action: 'POINT_ADJUSTMENT',
      targetId: params.targetUserId,
      targetType: 'wallet',
      reason: params.reason,
      details: { amount: params.amount },
    });
  }
};
