import { db, isFirebaseConfigured } from '@/config/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import {
  Prediction,
  Participation,
  PredictionType,
  PredictionCategory,
  PredictionStatus,
  PredictionOption,
  PredictionClosestConfig
} from '@/types/prediction';
import { walletService } from './walletService';
import { pariMutuelEngine } from '@/utils/pariMutuel';
import { notificationService } from './notificationService';
import { userService } from './userService';

const PREDICTIONS_COLLECTION = 'predictions';
const PARTICIPATIONS_COLLECTION = 'participations';
const LOCAL_PREDICTIONS_KEY = 'paribet_mock_predictions';
const LOCAL_PARTICIPATIONS_KEY = 'paribet_mock_participations';

// Sample Seed Predictions for immediate classroom interaction
const INITIAL_SEED_PREDICTIONS: Prediction[] = [
  {
    id: 'pred_1',
    title: 'Will our college announce a holiday tomorrow for the annual sports festival?',
    description: 'The college sports meet committee is meeting this evening. Official circular expected by 9 PM.',
    type: 'YES_NO',
    category: 'College',
    creatorId: 'uid_chn25mca055',
    creatorName: 'Abhinav Krishna S',
    creatorNickname: 'Shadow',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    participationDeadline: new Date(Date.now() + 3600000 * 6).toISOString(),
    resultSubmissionDeadline: new Date(Date.now() + 3600000 * 24).toISOString(),
    minCommitment: 50,
    status: 'OPEN',
    options: [
      { id: 'opt_yes', text: 'YES (Holiday Declared)', totalTokensCommitted: 800, totalParticipants: 6 },
      { id: 'opt_no', text: 'NO (Regular Classes)', totalTokensCommitted: 400, totalParticipants: 3 }
    ],
    totalPoolTokens: 1200,
    totalParticipantsCount: 9
  },
  {
    id: 'pred_2',
    title: 'Which batch team will win the MCA inter-batch Cricket Premier League?',
    description: 'Final match between MCA 1st Year (2025) and MCA 2nd Year (2024).',
    type: 'MULTIPLE_CHOICE',
    category: 'Sports',
    creatorId: 'uid_chn25mca045',
    creatorName: 'Abhinand A Nair',
    creatorNickname: 'Phoenix',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    participationDeadline: new Date(Date.now() + 3600000 * 18).toISOString(),
    resultSubmissionDeadline: new Date(Date.now() + 3600000 * 36).toISOString(),
    minCommitment: 100,
    status: 'OPEN',
    options: [
      { id: 'opt_mca25', text: 'MCA 2025 (Our Batch)', totalTokensCommitted: 1500, totalParticipants: 12 },
      { id: 'opt_mca24', text: 'MCA 2024 (Seniors)', totalTokensCommitted: 900, totalParticipants: 7 },
      { id: 'opt_draw', text: 'Tied / Match Rained Out', totalTokensCommitted: 200, totalParticipants: 2 }
    ],
    totalPoolTokens: 2600,
    totalParticipantsCount: 21
  },
  {
    id: 'pred_3',
    title: 'Closest Answer: What will be the exact score of the highest scorer in Data Structures lab viva?',
    description: 'Professor Kurien is conducting the external lab evaluation tomorrow. Marks out of 50.',
    type: 'CLOSEST_ANSWER',
    category: 'College',
    creatorId: 'uid_chn25mca069',
    creatorName: 'Adarsh S',
    creatorNickname: 'Viper',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    participationDeadline: new Date(Date.now() + 3600000 * 14).toISOString(),
    resultSubmissionDeadline: new Date(Date.now() + 3600000 * 30).toISOString(),
    minCommitment: 50,
    status: 'OPEN',
    closestConfig: {
      unit: 'Marks',
      isInteger: true,
      minVal: 0,
      maxVal: 50
    },
    options: [
      { id: 'opt_closest', text: 'Numerical Guess Pool', totalTokensCommitted: 650, totalParticipants: 5 }
    ],
    totalPoolTokens: 650,
    totalParticipantsCount: 5
  },
  {
    id: 'pred_4',
    title: 'Group Poll: Which movie should our MCA class watch this weekend at Cinepolis?',
    description: 'Vote and stake on your pick! The movie option with the highest total votes wins the pool.',
    type: 'GROUP_POLL',
    category: 'Entertainment',
    creatorId: 'uid_chn25mca005',
    creatorName: 'Afna S Thaha',
    creatorNickname: 'Oracle',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    participationDeadline: new Date(Date.now() + 3600000 * 10).toISOString(),
    resultSubmissionDeadline: new Date(Date.now() + 3600000 * 20).toISOString(),
    minCommitment: 100,
    status: 'OPEN',
    options: [
      { id: 'opt_m1', text: 'Interstellar (Re-release)', totalTokensCommitted: 800, totalParticipants: 8 },
      { id: 'opt_m2', text: 'Dune: Part Two', totalTokensCommitted: 600, totalParticipants: 6 },
      { id: 'opt_m3', text: 'Deadpool & Wolverine', totalTokensCommitted: 400, totalParticipants: 4 }
    ],
    totalPoolTokens: 1800,
    totalParticipantsCount: 18
  }
];

export const predictionService = {
  /**
   * Get all predictions with optional filtering
   */
  async getPredictions(filters?: {
    category?: PredictionCategory;
    status?: PredictionStatus;
    creatorId?: string;
    search?: string;
  }): Promise<Prediction[]> {
    let list: Prediction[] = [];

    if (isFirebaseConfigured) {
      try {
        const snapshot = await getDocs(collection(db, PREDICTIONS_COLLECTION));
        list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Prediction));
      } catch (err) {
        console.warn('[predictionService] Firestore fetch failed, loading local predictions:', err);
      }
    }

    if (list.length === 0) {
      const stored = localStorage.getItem(LOCAL_PREDICTIONS_KEY);
      if (stored) {
        list = JSON.parse(stored);
      } else {
        list = INITIAL_SEED_PREDICTIONS;
        localStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(list));
      }
    }

    // Apply filters
    if (filters?.category) {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters?.status) {
      list = list.filter((p) => p.status === filters.status);
    }
    if (filters?.creatorId) {
      list = list.filter((p) => p.creatorId === filters.creatorId);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * Get prediction by ID
   */
  async getPredictionById(id: string): Promise<Prediction | null> {
    const list = await this.getPredictions();
    return list.find((p) => p.id === id) || null;
  },

  /**
   * Create a new prediction
   */
  async createPrediction(params: {
    title: string;
    description: string;
    type: PredictionType;
    category: PredictionCategory;
    coverImage?: string;
    creatorId: string;
    creatorName: string;
    creatorNickname: string;
    creatorAvatar?: string;
    minCommitment: number;
    participationDeadline: string;
    resultSubmissionDeadline: string;
    customOptions?: string[];
    closestConfig?: PredictionClosestConfig;
  }): Promise<Prediction> {
    const newId = `pred_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Build options based on type
    let options: PredictionOption[] = [];
    if (params.type === 'YES_NO') {
      options = [
        { id: 'opt_yes', text: 'YES', totalTokensCommitted: 0, totalParticipants: 0 },
        { id: 'opt_no', text: 'NO', totalTokensCommitted: 0, totalParticipants: 0 },
      ];
    } else if (params.type === 'MULTIPLE_CHOICE' || params.type === 'GROUP_POLL') {
      options = (params.customOptions || []).map((text, idx) => ({
        id: `opt_${idx + 1}`,
        text: text.trim(),
        totalTokensCommitted: 0,
        totalParticipants: 0,
      }));
    } else if (params.type === 'CLOSEST_ANSWER') {
      options = [
        { id: 'opt_closest', text: 'Closest Number Entry', totalTokensCommitted: 0, totalParticipants: 0 },
      ];
    }

    const prediction: Prediction = {
      id: newId,
      title: params.title.trim(),
      description: params.description.trim(),
      type: params.type,
      category: params.category,
      coverImage: params.coverImage,
      creatorId: params.creatorId,
      creatorName: params.creatorName,
      creatorNickname: params.creatorNickname,
      creatorAvatar: params.creatorAvatar,
      createdAt: new Date().toISOString(),
      participationDeadline: params.participationDeadline,
      resultSubmissionDeadline: params.resultSubmissionDeadline,
      minCommitment: params.minCommitment,
      status: 'OPEN',
      options,
      totalPoolTokens: 0,
      totalParticipantsCount: 0,
      closestConfig: params.closestConfig,
    };

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, PREDICTIONS_COLLECTION, newId), prediction);
      } catch (err) {
        console.warn('[predictionService] Firestore create failed:', err);
      }
    }

    // Persist locally
    const current = await this.getPredictions();
    current.unshift(prediction);
    localStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(current));

    return prediction;
  },

  /**
   * Participate in a prediction
   */
  async participate(params: {
    predictionId: string;
    userId: string;
    userNickname: string;
    userOfficialName: string;
    userAvatar?: string;
    optionId?: string;
    closestAnswerValue?: number;
    tokensCommitted: number;
  }): Promise<Participation> {
    const prediction = await this.getPredictionById(params.predictionId);
    if (!prediction) throw new Error('Prediction not found.');

    const userProfile = await userService.getUserProfile(params.userId);
    if (userProfile?.role === 'admin') {
      throw new Error('Administrators cannot stake in predictions to maintain game integrity.');
    }

    if (prediction.status !== 'OPEN') {
      throw new Error('Participation is closed for this prediction.');
    }

    if (new Date() > new Date(prediction.participationDeadline)) {
      throw new Error('The deadline to participate in this prediction has passed.');
    }

    if (params.tokensCommitted < prediction.minCommitment) {
      throw new Error(`Minimum stake required is ${prediction.minCommitment} tokens.`);
    }

    // 1. Lock tokens via wallet service
    await walletService.recordTransaction({
      userId: params.userId,
      type: 'PREDICTION_COMMITMENT',
      amount: -params.tokensCommitted,
      description: `Committed ${params.tokensCommitted} tokens on "${prediction.title}"`,
      referenceId: prediction.id,
      metadata: { optionId: params.optionId, closestAnswerValue: params.closestAnswerValue }
    });

    // 2. Create Participation document
    const participation: Participation = {
      id: `part_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      predictionId: params.predictionId,
      userId: params.userId,
      userNickname: params.userNickname,
      userOfficialName: params.userOfficialName,
      userAvatar: params.userAvatar,
      optionId: params.optionId,
      closestAnswerValue: params.closestAnswerValue,
      tokensCommitted: params.tokensCommitted,
      createdAt: new Date().toISOString(),
    };

    // 3. Update prediction pool & option totals
    const updatedOptions = prediction.options.map((opt) => {
      if (opt.id === params.optionId || (!params.optionId && opt.id === 'opt_closest')) {
        return {
          ...opt,
          totalTokensCommitted: opt.totalTokensCommitted + params.tokensCommitted,
          totalParticipants: opt.totalParticipants + 1,
        };
      }
      return opt;
    });

    const updatedPrediction: Prediction = {
      ...prediction,
      options: updatedOptions,
      totalPoolTokens: prediction.totalPoolTokens + params.tokensCommitted,
      totalParticipantsCount: prediction.totalParticipantsCount + 1,
    };

    if (isFirebaseConfigured) {
      try {
        await addDoc(collection(db, PARTICIPATIONS_COLLECTION), participation);
        await updateDoc(doc(db, PREDICTIONS_COLLECTION, prediction.id), updatedPrediction as any);
      } catch (err) {
        console.warn('[predictionService] Firestore update failed:', err);
      }
    }

    // Persist participations and predictions locally
    const allParts: Participation[] = JSON.parse(
      localStorage.getItem(LOCAL_PARTICIPATIONS_KEY) || '[]'
    );
    allParts.push(participation);
    localStorage.setItem(LOCAL_PARTICIPATIONS_KEY, JSON.stringify(allParts));

    const allPreds = await this.getPredictions();
    const idx = allPreds.findIndex((p) => p.id === prediction.id);
    if (idx !== -1) {
      allPreds[idx] = updatedPrediction;
      localStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(allPreds));
    }

    // Notify creator that someone participated
    if (prediction.creatorId !== params.userId) {
      await notificationService.sendNotification({
        userId: prediction.creatorId,
        type: 'PARTICIPATION_NEW',
        title: 'New Prediction Stake',
        message: `${params.userNickname} placed ${params.tokensCommitted} tokens on "${prediction.title}"`,
        referenceId: prediction.id,
      });
    }

    return participation;
  },

  /**
   * Get all participations for a prediction
   */
  async getPredictionParticipations(predictionId: string): Promise<Participation[]> {
    if (isFirebaseConfigured) {
      try {
        const q = query(
          collection(db, PARTICIPATIONS_COLLECTION),
          where('predictionId', '==', predictionId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Participation));
      } catch (err) {
        console.warn('[predictionService] Firestore get participations failed:', err);
      }
    }

    const allParts: Participation[] = JSON.parse(
      localStorage.getItem(LOCAL_PARTICIPATIONS_KEY) || '[]'
    );
    return allParts.filter((p) => p.predictionId === predictionId);
  },

  /**
   * Finalize prediction outcome & distribute pari-mutuel payouts
   */
  async finalizePrediction(params: {
    predictionId: string;
    winningOptionId?: string;
    actualClosestValue?: number;
    submittedByUid: string;
    isAdminOverride?: boolean;
  }): Promise<{ payoutsDistributed: number; totalTokensAwarded: number }> {
    const prediction = await this.getPredictionById(params.predictionId);
    if (!prediction) throw new Error('Prediction not found.');

    const participations = await this.getPredictionParticipations(params.predictionId);

    let winningOptionId = params.winningOptionId;
    let closestActual = params.actualClosestValue;

    // Handle Group Poll highest vote automatic determination
    if (prediction.type === 'GROUP_POLL') {
      winningOptionId = pariMutuelEngine.resolveGroupPollWinner(prediction.options) || undefined;
    }

    // Calculate payouts
    let payoutResults: ReturnType<typeof pariMutuelEngine.distributePayouts> = [];
    if (prediction.type === 'CLOSEST_ANSWER') {
      if (closestActual === undefined) throw new Error('Actual value required for Closest Answer.');
      const resolution = pariMutuelEngine.resolveClosestAnswerWinners(participations, closestActual);
      payoutResults = pariMutuelEngine.distributeClosestAnswerPayouts(
        participations,
        resolution.winningParticipationIds
      );
    } else {
      if (!winningOptionId) throw new Error('Winning option required.');
      payoutResults = pariMutuelEngine.distributePayouts(participations, winningOptionId);
    }

    // Distribute rewards via wallet transactions
    let totalAwarded = 0;
    for (const res of payoutResults) {
      if (res.totalPayout > 0) {
        const isWin = res.rewardShare > 0;
        await walletService.recordTransaction({
          userId: res.userId,
          type: 'PREDICTION_REWARD',
          amount: res.totalPayout,
          description: isWin
            ? `Reward won from "${prediction.title}": ${res.totalPayout} tokens`
            : `Stake refund from "${prediction.title}": ${res.totalPayout} tokens`,
          referenceId: prediction.id,
          metadata: {
            originalStake: res.originalStake,
            rewardShare: res.rewardShare,
          }
        });
        totalAwarded += res.totalPayout;

        // Notify winner
        await notificationService.sendNotification({
          userId: res.userId,
          type: isWin ? 'PREDICTION_WON' : 'PREDICTION_FINALIZED',
          title: isWin ? 'Prediction Victory!' : 'Prediction Resolved',
          message: isWin
            ? `You won ${res.totalPayout} tokens on "${prediction.title}"!`
            : `Prediction "${prediction.title}" has finalized.`,
          referenceId: prediction.id,
        });
      }
    }

    // Update prediction status to FINALIZED
    const updatedPrediction: Prediction = {
      ...prediction,
      status: 'FINALIZED',
      winningOptionId,
      closestAnswerActualValue: closestActual,
      finalizedAt: new Date().toISOString(),
      resultSubmittedBy: params.submittedByUid,
    };

    if (isFirebaseConfigured) {
      try {
        await updateDoc(doc(db, PREDICTIONS_COLLECTION, prediction.id), updatedPrediction as any);
      } catch (err) {
        console.warn('[predictionService] Firestore update to finalized failed:', err);
      }
    }

    const allPreds = await this.getPredictions();
    const idx = allPreds.findIndex((p) => p.id === prediction.id);
    if (idx !== -1) {
      allPreds[idx] = updatedPrediction;
      localStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(allPreds));
    }

    return {
      payoutsDistributed: payoutResults.length,
      totalTokensAwarded: totalAwarded,
    };
  },

  /**
   * Cancel prediction and return all tokens
   */
  async cancelPrediction(predictionId: string, reason: string): Promise<void> {
    const prediction = await this.getPredictionById(predictionId);
    if (!prediction) throw new Error('Prediction not found.');

    const participations = await this.getPredictionParticipations(predictionId);

    // Refund every participant
    for (const p of participations) {
      await walletService.recordTransaction({
        userId: p.userId,
        type: 'PREDICTION_REFUND',
        amount: p.tokensCommitted,
        description: `Full refund for cancelled prediction "${prediction.title}" (${reason})`,
        referenceId: prediction.id,
      });

      await notificationService.sendNotification({
        userId: p.userId,
        type: 'ADMIN_ANNOUNCEMENT',
        title: 'Prediction Cancelled & Refunded',
        message: `Your stake of ${p.tokensCommitted} tokens on "${prediction.title}" has been returned.`,
        referenceId: prediction.id,
      });
    }

    const updated: Prediction = {
      ...prediction,
      status: 'CANCELLED',
      cancelledReason: reason,
    };

    const allPreds = await this.getPredictions();
    const idx = allPreds.findIndex((pr) => pr.id === predictionId);
    if (idx !== -1) {
      allPreds[idx] = updated;
      localStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(allPreds));
    }
  },

  /**
   * Permanently delete a prediction (Admin control)
   */
  async deletePrediction(predictionId: string): Promise<void> {
    if (isFirebaseConfigured) {
      try {
        const { deleteDoc, doc: firestoreDoc } = await import('firebase/firestore');
        await deleteDoc(firestoreDoc(db, 'predictions', predictionId));
      } catch (err) {
        console.warn('Failed to delete prediction from firestore:', err);
      }
    }
    const allPreds = await this.getPredictions();
    const filtered = allPreds.filter((p) => p.id !== predictionId);
    localStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(filtered));
  },

  /**
   * Update prediction details (Admin / Creator control)
   */
  async updatePrediction(
    predictionId: string,
    updates: Partial<Prediction>
  ): Promise<Prediction | null> {
    const prediction = await this.getPredictionById(predictionId);
    if (!prediction) return null;

    const updated = { ...prediction, ...updates };

    if (isFirebaseConfigured) {
      try {
        await updateDoc(doc(db, 'predictions', predictionId), updates);
      } catch (err) {
        console.warn('Failed to update prediction in firestore:', err);
      }
    }

    const allPreds = await this.getPredictions();
    const idx = allPreds.findIndex((p) => p.id === predictionId);
    if (idx !== -1) {
      allPreds[idx] = updated;
      localStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(allPreds));
    }

    return updated;
  }
};

