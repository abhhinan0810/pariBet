export interface AdminLog {
  id: string;
  adminUid: string;
  adminEmail: string;
  adminName: string;
  action: string;
  targetId?: string;
  targetType?: 'user' | 'prediction' | 'wallet' | 'loan' | 'roster';
  reason: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface SystemStats {
  totalRegisteredStudents: number;
  activeUsers: number;
  totalPredictions: number;
  activePredictions: number;
  completedPredictions: number;
  totalTokensInCirculation: number;
  activeLoans: number;
  overdueLoans: number;
  pendingReports: number;
}

