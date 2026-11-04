export type NotificationType =
  | 'PREDICTION_CREATED'
  | 'PARTICIPATION_NEW'
  | 'PREDICTION_CLOSING_SOON'
  | 'PREDICTION_CLOSED'
  | 'RESULT_SUBMITTED'
  | 'PREDICTION_FINALIZED'
  | 'PREDICTION_WON'
  | 'PREDICTION_LOST'
  | 'LOAN_REQUEST_NEW'
  | 'LOAN_OFFER_NEW'
  | 'LOAN_OFFER_ACCEPTED'
  | 'LOAN_REPAYMENT_APPROACHING'
  | 'LOAN_OVERDUE'
  | 'LOAN_REPAID'
  | 'LEADERBOARD_RANK_CHANGED'
  | 'ADMIN_ANNOUNCEMENT';

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  referenceId?: string;
  link?: string;
  createdAt: string;
}

