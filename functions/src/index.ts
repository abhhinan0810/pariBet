import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function: Atomic Participation in Prediction
 * Validates balance, locks stake, updates pool, and records transaction
 */
export const participateInPrediction = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be signed in.');
    }

    const userId = context.auth.uid;
    const { predictionId, optionId, closestAnswerValue, tokensCommitted } = data;

    if (!predictionId || !tokensCommitted || tokensCommitted <= 0) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid participation parameters.');
    }

    return db.runTransaction(async (transaction) => {
      // 1. Fetch Prediction
      const predRef = db.collection('predictions').doc(predictionId);
      const predSnap = await transaction.get(predRef);
      if (!predSnap.exists) {
        throw new functions.https.HttpsError('not-found', 'Prediction not found.');
      }

      const predData = predSnap.data()!;
      if (predData.status !== 'OPEN') {
        throw new functions.https.HttpsError('failed-precondition', 'Prediction is closed.');
      }

      if (new Date() > new Date(predData.participationDeadline)) {
        throw new functions.https.HttpsError('deadline-exceeded', 'Participation deadline has passed.');
      }

      if (tokensCommitted < predData.minCommitment) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          `Minimum stake is ${predData.minCommitment} tokens.`
        );
      }

      // 2. Fetch User Profile
      const userRef = db.collection('users').doc(userId);
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists) {
        throw new functions.https.HttpsError('not-found', 'User profile not found.');
      }

      const userData = userSnap.data()!;
      if (userData.walletBalance < tokensCommitted) {
        throw new functions.https.HttpsError('failed-precondition', 'Insufficient wallet balance.');
      }

      // 3. Update User Wallet
      const newBalance = userData.walletBalance - tokensCommitted;
      const newLocked = (userData.lockedBalance || 0) + tokensCommitted;

      transaction.update(userRef, {
        walletBalance: newBalance,
        lockedBalance: newLocked,
        'statistics.predictionsParticipated': admin.firestore.FieldValue.increment(1),
        'statistics.totalTokensCommitted': admin.firestore.FieldValue.increment(tokensCommitted),
      });

      // 4. Update Prediction Options & Pool
      const updatedOptions = predData.options.map((opt: any) => {
        if (opt.id === optionId || (!optionId && opt.id === 'opt_closest')) {
          return {
            ...opt,
            totalTokensCommitted: opt.totalTokensCommitted + tokensCommitted,
            totalParticipants: opt.totalParticipants + 1,
          };
        }
        return opt;
      });

      transaction.update(predRef, {
        options: updatedOptions,
        totalPoolTokens: predData.totalPoolTokens + tokensCommitted,
        totalParticipantsCount: predData.totalParticipantsCount + 1,
      });

      // 5. Create Participation Document
      const partRef = db.collection('participations').doc();
      transaction.set(partRef, {
        predictionId,
        userId,
        userNickname: userData.nickname,
        userOfficialName: userData.officialName,
        userAvatar: userData.profilePicture,
        optionId,
        closestAnswerValue,
        tokensCommitted,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 6. Record Authoritative Ledger Transaction
      const txRef = db.collection('transactions').doc();
      transaction.set(txRef, {
        userId,
        type: 'PREDICTION_COMMITMENT',
        amount: -tokensCommitted,
        balanceAfter: newBalance,
        referenceId: predictionId,
        description: `Committed ${tokensCommitted} tokens on "${predData.title}"`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true, newBalance };
    });
  }
);

/**
 * Cloud Function: Finalize Prediction & Distribute Pari-Mutuel Payouts
 * Winning formula: S + Math.floor((S / W) * L) with deterministic remainder distribution
 */
export const finalizePrediction = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be signed in.');
    }

    const { predictionId, winningOptionId, actualClosestValue } = data;
    const adminOrCreatorUid = context.auth.uid;

    const predRef = db.collection('predictions').doc(predictionId);
    const predSnap = await predRef.get();
    if (!predSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Prediction not found.');
    }

    const pred = predSnap.data()!;
    if (pred.creatorId !== adminOrCreatorUid && context.auth.token.role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Unauthorized to finalize prediction.');
    }

    // Fetch all participations
    const partsSnap = await db
      .collection('participations')
      .where('predictionId', '==', predictionId)
      .get();

    const participations = partsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));

    const winningParticipations = participations.filter((p) => p.optionId === winningOptionId);
    const losingParticipations = participations.filter((p) => p.optionId !== winningOptionId);

    const W = winningParticipations.reduce((acc, p) => acc + p.tokensCommitted, 0);
    const L = losingParticipations.reduce((acc, p) => acc + p.tokensCommitted, 0);

    const batch = db.batch();

    if (winningParticipations.length === 0) {
      // Refund all
      for (const p of participations) {
        const uRef = db.collection('users').doc(p.userId);
        batch.update(uRef, {
          walletBalance: admin.firestore.FieldValue.increment(p.tokensCommitted),
          lockedBalance: admin.firestore.FieldValue.increment(-p.tokensCommitted),
        });
      }
    } else {
      let distributedReward = 0;
      const preliminary: any[] = [];

      for (const winPart of winningParticipations) {
        const S = winPart.tokensCommitted;
        const exact = (S / W) * L;
        const intShare = Math.floor(exact);
        preliminary.push({
          p: winPart,
          originalStake: S,
          rewardShare: intShare,
          fraction: exact - intShare,
        });
        distributedReward += intShare;
      }

      let remainder = L - distributedReward;
      preliminary.sort((a, b) => b.fraction - a.fraction);
      for (let i = 0; i < preliminary.length && remainder > 0; i++) {
        preliminary[i].rewardShare += 1;
        remainder -= 1;
      }

      for (const item of preliminary) {
        const totalPayout = item.originalStake + item.rewardShare;
        const uRef = db.collection('users').doc(item.p.userId);
        batch.update(uRef, {
          walletBalance: admin.firestore.FieldValue.increment(totalPayout),
          lockedBalance: admin.firestore.FieldValue.increment(-item.originalStake),
          'statistics.predictionsWon': admin.firestore.FieldValue.increment(1),
          'statistics.totalRewardsEarned': admin.firestore.FieldValue.increment(totalPayout),
          'statistics.currentStreak': admin.firestore.FieldValue.increment(1),
        });

        const txRef = db.collection('transactions').doc();
        batch.set(txRef, {
          userId: item.p.userId,
          type: 'PREDICTION_REWARD',
          amount: totalPayout,
          referenceId: predictionId,
          description: `Reward from "${pred.title}": ${totalPayout} tokens`,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    batch.update(predRef, {
      status: 'FINALIZED',
      winningOptionId,
      actualClosestValue,
      finalizedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await batch.commit();
    return { success: true };
  }
);

