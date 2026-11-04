import { db, isFirebaseConfigured } from '@/config/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  runTransaction
} from 'firebase/firestore';
import { Transaction, TransactionType, Wallet } from '@/types/wallet';
import { userService } from './userService';

const TRANSACTIONS_COLLECTION = 'transactions';
const WALLETS_COLLECTION = 'wallets';
const LOCAL_TX_KEY = 'paribet_mock_transactions';

export const walletService = {
  /**
   * Get user transactions ledger
   */
  async getUserTransactions(userId: string, filterType?: TransactionType): Promise<Transaction[]> {
    if (isFirebaseConfigured) {
      try {
        let q = query(
          collection(db, TRANSACTIONS_COLLECTION),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const txs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction));
        if (filterType) {
          return txs.filter((t) => t.type === filterType);
        }
        return txs;
      } catch (err) {
        console.warn('[walletService] Firestore transactions fetch failed, checking local:', err);
      }
    }

    const allTx: Transaction[] = JSON.parse(localStorage.getItem(LOCAL_TX_KEY) || '[]');
    let userTx = allTx.filter((t) => t.userId === userId);
    if (filterType) {
      userTx = userTx.filter((t) => t.type === filterType);
    }
    return userTx.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * Record a transaction and update authoritative wallet balance
   */
  async recordTransaction(params: {
    userId: string;
    type: TransactionType;
    amount: number; // positive or negative
    description: string;
    referenceId?: string;
    adminUid?: string;
    metadata?: Record<string, any>;
  }): Promise<Transaction> {
    const userProfile = await userService.getUserProfile(params.userId);
    if (!userProfile) {
      throw new Error(`User not found: ${params.userId}`);
    }

    const currentBalance = userProfile.walletBalance;
    const currentLocked = userProfile.lockedBalance || 0;
    let newBalance = currentBalance;
    let newLocked = currentLocked;

    if (params.type === 'PREDICTION_COMMITMENT') {
      if (currentBalance < Math.abs(params.amount)) {
        throw new Error('Insufficient virtual tokens in wallet.');
      }
      newBalance = currentBalance - Math.abs(params.amount);
      newLocked = currentLocked + Math.abs(params.amount);
    } else if (params.type === 'PREDICTION_REWARD') {
      newBalance = currentBalance + params.amount;
      newLocked = Math.max(0, currentLocked - (params.metadata?.originalStake || 0));
    } else if (params.type === 'PREDICTION_REFUND') {
      newBalance = currentBalance + params.amount;
      newLocked = Math.max(0, currentLocked - params.amount);
    } else if (params.type === 'LOAN_GIVEN') {
      if (currentBalance < Math.abs(params.amount)) {
        throw new Error('Insufficient balance to fund this loan.');
      }
      newBalance = currentBalance - Math.abs(params.amount);
    } else if (params.type === 'LOAN_RECEIVED') {
      newBalance = currentBalance + params.amount;
    } else if (params.type === 'LOAN_REPAYMENT') {
      if (currentBalance < Math.abs(params.amount)) {
        throw new Error('Insufficient balance to repay this loan.');
      }
      newBalance = currentBalance - Math.abs(params.amount);
    } else {
      // Gifts, adjustments, interest
      newBalance = currentBalance + params.amount;
    }

    const newTx: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: params.userId,
      type: params.type,
      amount: params.amount,
      balanceAfter: newBalance,
      referenceId: params.referenceId,
      description: params.description,
      createdAt: new Date().toISOString(),
      adminUid: params.adminUid,
      metadata: params.metadata,
    };

    // Update user record
    const updatedStats = { ...userProfile.statistics };
    if (params.type === 'PREDICTION_REWARD') {
      updatedStats.predictionsWon += 1;
      updatedStats.totalRewardsEarned += params.amount;
      updatedStats.currentStreak += 1;
      if (updatedStats.currentStreak > updatedStats.longestStreak) {
        updatedStats.longestStreak = updatedStats.currentStreak;
      }
    } else if (params.type === 'PREDICTION_COMMITMENT') {
      updatedStats.predictionsParticipated += 1;
      updatedStats.totalTokensCommitted += Math.abs(params.amount);
    }

    if (updatedStats.predictionsParticipated > 0) {
      updatedStats.winRate = Math.round(
        (updatedStats.predictionsWon / updatedStats.predictionsParticipated) * 100
      );
    }

    // Persist updated user profile
    const updatedProfile = {
      ...userProfile,
      walletBalance: newBalance,
      lockedBalance: newLocked,
      statistics: updatedStats,
    };

    if (isFirebaseConfigured) {
      try {
        await addDoc(collection(db, TRANSACTIONS_COLLECTION), newTx);
        await setDoc(doc(db, 'users', params.userId), updatedProfile);
      } catch (err) {
        console.warn('[walletService] Firestore write failed:', err);
      }
    }

    // Update local storage
    const localUsers = JSON.parse(localStorage.getItem('paribet_mock_users') || '{}');
    localUsers[params.userId] = updatedProfile;
    localStorage.setItem('paribet_mock_users', JSON.stringify(localUsers));

    const allTx: Transaction[] = JSON.parse(localStorage.getItem(LOCAL_TX_KEY) || '[]');
    allTx.unshift(newTx);
    localStorage.setItem(LOCAL_TX_KEY, JSON.stringify(allTx));

    return newTx;
  }
};

