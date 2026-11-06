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
import { syncStorage } from './storageSync';

const PREDICTIONS_COLLECTION = 'predictions';
const PARTICIPATIONS_COLLECTION = 'participations';
const LOCAL_PREDICTIONS_KEY = 'paribet_mock_predictions';
const LOCAL_PARTICIPATIONS_KEY = 'paribet_mock_participations';

export const predictionService = {
  /**
   * Get all predictions with optional filtering (Real user predictions only)
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
      const stored = syncStorage.getItem(LOCAL_PREDICTIONS_KEY);
      if (stored) {
        try {
          const parsed: Prediction[] = JSON.parse(stored);
          // Purge legacy dummy seed bets
          list = parsed.filter((p) => !['pred_1', 'pred_2', 'pred_3', 'pred_4'].includes(p.id));
          syncStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(list));
        } catch {
          list = [];
        }
      } else {
        list = [];
      }
    } else {
      // Also filter out any dummy seed items from Firestore if they were previously stored
      list = list.filter((p) => !['pred_1', 'pred_2', 'pred_3', 'pred_4'].includes(p.id));
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

    // Persist locally & sync
    const current = await this.getPredictions();
    current.unshift(prediction);
    syncStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(current));

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

    // Persist participations and predictions locally & sync
    const allParts: Participation[] = JSON.parse(
      syncStorage.getItem(LOCAL_PARTICIPATIONS_KEY) || '[]'
    );
    allParts.push(participation);
    syncStorage.setItem(LOCAL_PARTICIPATIONS_KEY, JSON.stringify(allParts));

    const allPreds = await this.getPredictions();
    const idx = allPreds.findIndex((p) => p.id === prediction.id);
    if (idx !== -1) {
      allPreds[idx] = updatedPrediction;
      syncStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(allPreds));
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
      syncStorage.getItem(LOCAL_PARTICIPATIONS_KEY) || '[]'
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
    const winningPartIds = new Set<string>();

    for (const res of payoutResults) {
      if (res.totalPayout > 0) {
        winningPartIds.add(res.participationId);
        const isWin = res.rewardShare > 0;
        await walletService.recordTransaction({
          userId: res.userId,
          type: 'PREDICTION_REWARD',
          amount: res.totalPayout,
          description: isWin
            ? `Reward won from "${prediction.title}": ${res.totalPayout} PTS`
            : `Stake refund from "${prediction.title}": ${res.totalPayout} PTS`,
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
            ? `You won ${res.totalPayout} PTS on "${prediction.title}"!`
            : `Prediction "${prediction.title}" has finalized.`,
          referenceId: prediction.id,
        });
      }
    }

    // Process losing participations: release locked balance and reset winning streak
    const losingParticipations = participations.filter((p) => !winningPartIds.has(p.id));
    for (const lossPart of losingParticipations) {
      await walletService.recordTransaction({
        userId: lossPart.userId,
        type: 'PREDICTION_LOSS',
        amount: 0,
        description: `Prediction settled: Lost ${lossPart.tokensCommitted} PTS on "${prediction.title}"`,
        referenceId: prediction.id,
        metadata: {
          lostAmount: lossPart.tokensCommitted,
        }
      });

      // Notify participant
      await notificationService.sendNotification({
        userId: lossPart.userId,
        type: 'PREDICTION_FINALIZED',
        title: 'Prediction Resolved',
        message: `Prediction "${prediction.title}" concluded. Your stake of ${lossPart.tokensCommitted} PTS was not on the winning side.`,
        referenceId: prediction.id,
      });
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
      syncStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(allPreds));
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
      syncStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(allPreds));
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
    syncStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(filtered));
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
      syncStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(allPreds));
    }

    return updated;
  }
};

