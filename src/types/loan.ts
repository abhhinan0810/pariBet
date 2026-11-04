export type LoanStatus =
  | 'OPEN'
  | 'OFFER_RECEIVED'
  | 'ACCEPTED'
  | 'ACTIVE'
  | 'PARTIALLY_REPAID'
  | 'REPAID'
  | 'OVERDUE'
  | 'CANCELLED'
  | 'DISPUTED';

export interface LoanRequest {
  id: string;
  borrowerId: string;
  borrowerNickname: string;
  borrowerOfficialName: string;
  borrowerAvatar?: string;
  amount: number;
  maxInterestRate: number; // e.g. 10 for 10%
  requestedRepaymentDays: number;
  description?: string;
  status: LoanStatus;
  createdAt: string;
  expiresAt: string;
  offersCount: number;
  acceptedOfferId?: string;
}

export interface LoanOffer {
  id: string;
  requestId: string;
  lenderId: string;
  lenderNickname: string;
  lenderOfficialName: string;
  lenderAvatar?: string;
  principalAmount: number;
  flatInterestRate: number; // percentage, e.g. 10
  interestAmount: number; // (principal * interestRate) / 100
  totalRepaymentAmount: number;
  repaymentDeadlineDays: number;
  offerExpiresAt: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  createdAt: string;
}

export interface Loan {
  id: string;
  requestId: string;
  offerId: string;
  borrowerId: string;
  borrowerNickname: string;
  borrowerOfficialName: string;
  lenderId: string;
  lenderNickname: string;
  lenderOfficialName: string;
  principalAmount: number;
  flatInterestRate: number;
  interestAmount: number;
  totalRepaymentAmount: number;
  amountRepaid: number;
  status: LoanStatus;
  createdAt: string;
  repaymentDeadline: string; // ISO date string
  repaidAt?: string;
}

