/**
 * PARI-MUTUEL VIRTUAL TOKEN POOL ENGINE
 * 
 * Formulas:
 * S = Individual winning participant's stake
 * W = Total stake committed to all winning entries
 * L = Total stake committed to all losing entries
 * 
 * Individual Winning Payout = S + Math.floor((S / W) * L)
 * Rounding remainder is distributed deterministically to the largest stakeholders.
 * Multiplier Estimate = Total Pool / Selected Option Pool
 */

import type { Prediction, Participation, PredictionOption } from '../types/prediction';

export interface PayoutResult {
  participationId: string;
  userId: string;
  originalStake: number;
  rewardShare: number;
  totalPayout: number;
}

export const pariMutuelEngine = {
  /**
   * Calculate dynamic multiplier for an option
   * Formula: Total Pool / Selected Option Pool
   * Returns formatted multiplier e.g. "2.50x" or "1.00x" if pool is empty
   */
  calculateMultiplier(totalPool: number, optionPool: number): {
    multiplierNumber: number;
    multiplierDisplay: string;
  } {
    if (optionPool <= 0 || totalPool <= 0) {
      return { multiplierNumber: 1.0, multiplierDisplay: '1.00x' };
    }
    const mult = totalPool / optionPool;
    return {
      multiplierNumber: mult,
      multiplierDisplay: `${mult.toFixed(2)}x`
    };
  },

  /**
   * Calculate estimated payout for a prospective commitment
   */
  calculateEstimatedPayout(
    prospectiveStake: number,
    currentOptionPool: number,
    currentTotalPool: number
  ): number {
    if (prospectiveStake <= 0) return 0;
    const newTotalPool = currentTotalPool + prospectiveStake;
    const newOptionPool = currentOptionPool + prospectiveStake;
    const mult = newTotalPool / newOptionPool;
    return Math.floor(prospectiveStake * mult);
  },

  /**
   * Integer-safe deterministic payout distribution for winning participations
   * Ensures: sum of payouts == total pool (or winning stake + losing pool distributed)
   */
  distributePayouts(
    participations: Participation[],
    winningOptionId: string
  ): PayoutResult[] {
    const winningParticipations = participations.filter(
      (p) => p.optionId === winningOptionId
    );
    const losingParticipations = participations.filter(
      (p) => p.optionId !== winningOptionId
    );

    // Edge case: No winners -> Refund everyone
    if (winningParticipations.length === 0) {
      return participations.map((p) => ({
        participationId: p.id,
        userId: p.userId,
        originalStake: p.tokensCommitted,
        rewardShare: 0,
        totalPayout: p.tokensCommitted,
      }));
    }

    // Edge case: No losers -> Return original stakes
    if (losingParticipations.length === 0) {
      return winningParticipations.map((p) => ({
        participationId: p.id,
        userId: p.userId,
        originalStake: p.tokensCommitted,
        rewardShare: 0,
        totalPayout: p.tokensCommitted,
      }));
    }

    const W = winningParticipations.reduce((acc, p) => acc + p.tokensCommitted, 0);
    const L = losingParticipations.reduce((acc, p) => acc + p.tokensCommitted, 0);

    let distributedRewardTotal = 0;
    const preliminaryResults: {
      participation: Participation;
      originalStake: number;
      rewardShare: number;
      fraction: number;
    }[] = [];

    // Step 1: Base integer distribution: Math.floor((S / W) * L)
    for (const winPart of winningParticipations) {
      const S = winPart.tokensCommitted;
      const exactShare = (S / W) * L;
      const integerShare = Math.floor(exactShare);
      const fraction = exactShare - integerShare;

      preliminaryResults.push({
        participation: winPart,
        originalStake: S,
        rewardShare: integerShare,
        fraction
      });

      distributedRewardTotal += integerShare;
    }

    // Step 2: Distribute remaining integer tokens deterministically to participants with highest fractional share
    let remainder = L - distributedRewardTotal;
    if (remainder > 0) {
      // Sort descending by remainder fraction, breaking ties by largest original stake, then by earlier participation ID
      preliminaryResults.sort((a, b) => {
        if (b.fraction !== a.fraction) return b.fraction - a.fraction;
        if (b.originalStake !== a.originalStake) return b.originalStake - a.originalStake;
        return a.participation.id.localeCompare(b.participation.id);
      });

      for (let i = 0; i < preliminaryResults.length && remainder > 0; i++) {
        preliminaryResults[i].rewardShare += 1;
        remainder -= 1;
      }
    }

    return preliminaryResults.map((item) => ({
      participationId: item.participation.id,
      userId: item.participation.userId,
      originalStake: item.originalStake,
      rewardShare: item.rewardShare,
      totalPayout: item.originalStake + item.rewardShare,
    }));
  },

  /**
   * Resolve Closest Answer Winners
   */
  resolveClosestAnswerWinners(
    participations: Participation[],
    actualValue: number
  ): { winningParticipationIds: string[]; winningValue: number } {
    if (participations.length === 0) {
      return { winningParticipationIds: [], winningValue: actualValue };
    }

    // Find the minimum absolute difference
    let minDiff = Infinity;
    participations.forEach((p) => {
      if (p.closestAnswerValue !== undefined) {
        const diff = Math.abs(p.closestAnswerValue - actualValue);
        if (diff < minDiff) minDiff = diff;
      }
    });

    // Collect all tied closest entries
    const tiedWinners = participations.filter((p) => {
      if (p.closestAnswerValue === undefined) return false;
      return Math.abs(p.closestAnswerValue - actualValue) === minDiff;
    });

    return {
      winningParticipationIds: tiedWinners.map((w) => w.id),
      winningValue: actualValue,
    };
  },

  /**
   * Distribute Closest Answer Payouts
   * The pool of non-winning stakes is distributed proportionally to tied winners based on their stake
   */
  distributeClosestAnswerPayouts(
    participations: Participation[],
    winningIds: string[]
  ): PayoutResult[] {
    const winningParticipations = participations.filter((p) =>
      winningIds.includes(p.id)
    );
    const losingParticipations = participations.filter(
      (p) => !winningIds.includes(p.id)
    );

    if (winningParticipations.length === 0) {
      // Refund all
      return participations.map((p) => ({
        participationId: p.id,
        userId: p.userId,
        originalStake: p.tokensCommitted,
        rewardShare: 0,
        totalPayout: p.tokensCommitted,
      }));
    }

    const W = winningParticipations.reduce((acc, p) => acc + p.tokensCommitted, 0);
    const L = losingParticipations.reduce((acc, p) => acc + p.tokensCommitted, 0);

    let distributedRewardTotal = 0;
    const preliminary: {
      participation: Participation;
      originalStake: number;
      rewardShare: number;
      fraction: number;
    }[] = [];

    for (const winPart of winningParticipations) {
      const S = winPart.tokensCommitted;
      const exactShare = (S / W) * L;
      const integerShare = Math.floor(exactShare);
      const fraction = exactShare - integerShare;

      preliminary.push({
        participation: winPart,
        originalStake: S,
        rewardShare: integerShare,
        fraction,
      });

      distributedRewardTotal += integerShare;
    }

    let remainder = L - distributedRewardTotal;
    if (remainder > 0) {
      preliminary.sort((a, b) => b.fraction - a.fraction);
      for (let i = 0; i < preliminary.length && remainder > 0; i++) {
        preliminary[i].rewardShare += 1;
        remainder -= 1;
      }
    }

    return preliminary.map((item) => ({
      participationId: item.participation.id,
      userId: item.participation.userId,
      originalStake: item.originalStake,
      rewardShare: item.rewardShare,
      totalPayout: item.originalStake + item.rewardShare,
    }));
  },

  /**
   * Resolve Group Poll Winning Option (Highest Vote Count)
   */
  resolveGroupPollWinner(options: PredictionOption[]): string | null {
    if (options.length === 0) return null;
    let maxVotes = -1;
    let winningOptionId = options[0].id;

    options.forEach((opt) => {
      if (opt.totalParticipants > maxVotes) {
        maxVotes = opt.totalParticipants;
        winningOptionId = opt.id;
      }
    });

    return winningOptionId;
  }
};
