import { AdminLog, SystemStats } from '@/types/admin';
import { UserProfile } from '@/types/user';
import approvedStudentsSeed from '@/data/approved_students.json';
import { predictionService } from './predictionService';
import { loanService } from './loanService';
import { walletService } from './walletService';

const LOCAL_ADMIN_LOGS_KEY = 'paribet_mock_admin_logs';

export const adminService = {
  /**
   * Log administrative action to authoritative audit trail
   */
  async logAction(params: {
    adminUid: string;
    adminEmail: string;
    adminName: string;
    action: string;
    targetId?: string;
    targetType?: 'user' | 'prediction' | 'wallet' | 'loan' | 'roster';
    reason: string;
    details?: Record<string, any>;
  }): Promise<AdminLog> {
    const log: AdminLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      adminUid: params.adminUid,
      adminEmail: params.adminEmail,
      adminName: params.adminName,
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
   * Get system statistics
   */
  async getSystemStats(): Promise<SystemStats> {
    const predictions = await predictionService.getPredictions();
    const activePredictions = predictions.filter((p) => p.status === 'OPEN').length;
    const completedPredictions = predictions.filter((p) => p.status === 'FINALIZED').length;

    const loanReqs = await loanService.getLoanRequests();
    const allLoans = await loanService.getUserLoans(''); // returns all in local mock
    const activeLoans = allLoans.filter((l) => l.status === 'ACTIVE').length;
    const overdueLoans = allLoans.filter((l) => l.status === 'OVERDUE').length;

    const localUsers: Record<string, UserProfile> = JSON.parse(
      localStorage.getItem('paribet_mock_users') || '{}'
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
      localStorage.getItem('paribet_mock_users') || '{}'
    );
    if (localUsers[userId]) {
      localUsers[userId].accountStatus = status;
      localStorage.setItem('paribet_mock_users', JSON.stringify(localUsers));

      await this.logAction({
        adminUid,
        adminEmail: 'admin@ceconline.edu',
        adminName: 'Admin',
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
      adminEmail: 'admin@ceconline.edu',
      adminName: 'Admin',
      action: 'POINT_ADJUSTMENT',
      targetId: params.targetUserId,
      targetType: 'wallet',
      reason: params.reason,
      details: { amount: params.amount },
    });
  }
};

