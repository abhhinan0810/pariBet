export type PredictionType = 'YES_NO' | 'MULTIPLE_CHOICE' | 'CLOSEST_ANSWER' | 'GROUP_POLL';

export type PredictionCategory = 'College' | 'Sports' | 'Entertainment' | 'Friends' | 'Events' | 'General';

export type PredictionStatus = 'OPEN' | 'CLOSED' | 'RESULT_SUBMITTED' | 'FINALIZED' | 'CANCELLED' | 'DISPUTED';

export interface PredictionOption {
  id: string;
  text: string;
  totalTokensCommitted: number;
  totalParticipants: number;
}

export interface PredictionClosestConfig {
  unit: string;
  isInteger: boolean;
  minVal?: number;
  maxVal?: number;
}

export interface Prediction {
  id: string;
  title: string;
  description: string;
  type: PredictionType;
  category: PredictionCategory;
  coverImage?: string;
  creatorId: string;
  creatorName: string;
  creatorNickname: string;
  creatorAvatar?: string;
  createdAt: string;
  participationDeadline: string; // ISO string
  resultSubmissionDeadline: string; // ISO string
  minCommitment: number;
  status: PredictionStatus;
  options: PredictionOption[];
  totalPoolTokens: number;
  totalParticipantsCount: number;
  closestConfig?: PredictionClosestConfig;
  winningOptionId?: string;
  closestAnswerActualValue?: number;
  finalizedAt?: string;
  resultSubmittedBy?: string;
  cancelledReason?: string;
}

export interface Participation {
  id: string;
  predictionId: string;
  userId: string;
  userNickname: string;
  userOfficialName: string;
  userAvatar?: string;
  optionId?: string;
  closestAnswerValue?: number;
  tokensCommitted: number;
  createdAt: string;
  payoutReceived?: number;
  isWinningParticipation?: boolean;
  isRefunded?: boolean;
}

