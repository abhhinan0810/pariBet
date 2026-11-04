export type TransactionType =
  | 'INITIAL_ALLOCATION'
  | 'PREDICTION_COMMITMENT'
  | 'PREDICTION_REFUND'
  | 'PREDICTION_REWARD'
  | 'VIRTUAL_TOKEN_GIFT'
  | 'LOAN_RECEIVED'
  | 'LOAN_GIVEN'
  | 'LOAN_REPAYMENT'
  | 'INTEREST_RECEIVED'
  | 'INTEREST_PAID'
  | 'ADMINISTRATIVE_ADJUSTMENT';

export interface Wallet {
  userId: string;
  availableBalance: number;
  lockedBalance: number;
  totalEarned: number;
  totalCommitted: number;
  outstandingLoans: number;
  loanRepaymentsDue: number;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // positive or negative
  balanceAfter: number;
  referenceId?: string; // predictionId, loanId, etc.
  description: string;
  createdAt: string;
  adminUid?: string;
  metadata?: Record<string, any>;
}

