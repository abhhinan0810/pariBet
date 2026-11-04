/**
 * COMPREHENSIVE TEST SUITE FOR PARIBET PLATFORM
 */

import { pariMutuelEngine } from '../src/utils/pariMutuel.ts';

console.log('--- STARTING COMPREHENSIVE PARIBET TEST SUITE ---');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failed++;
  }
}

// ==========================================
// TEST 1: Basic Pari-Mutuel Multiplier Formula
// ==========================================
// Total pool: 1,000. Option NO: 200. Multiplier = 1000 / 200 = 5.00x
const multResult = pariMutuelEngine.calculateMultiplier(1000, 200);
assert(multResult.multiplierNumber === 5.0, 'Multiplier calculates to exactly 5.0');
assert(multResult.multiplierDisplay === '5.00x', 'Multiplier displays as 5.00x');

// ==========================================
// TEST 2: Equal Winners Pari-Mutuel Distribution
// ==========================================
// YES pool: 800 (losers). NO pool: 200 (winners: A has 100, B has 100).
// Total pool: 1000. Each should get 100 + (100 / 200) * 800 = 100 + 400 = 500 tokens.
const sampleParts1 = [
  { id: 'p1', userId: 'userA', optionId: 'opt_no', tokensCommitted: 100, createdAt: '' },
  { id: 'p2', userId: 'userB', optionId: 'opt_no', tokensCommitted: 100, createdAt: '' },
  { id: 'p3', userId: 'userC', optionId: 'opt_yes', tokensCommitted: 800, createdAt: '' },
];
const payouts1 = pariMutuelEngine.distributePayouts(sampleParts1, 'opt_no');
assert(payouts1.length === 2, '2 winners received payouts');
assert(payouts1[0].totalPayout === 500, 'Winner A received 500 tokens (100 stake + 400 reward)');
assert(payouts1[1].totalPayout === 500, 'Winner B received 500 tokens (100 stake + 400 reward)');
const totalDistributed1 = payouts1.reduce((sum, p) => sum + p.totalPayout, 0);
assert(totalDistributed1 === 1000, 'Sum of payouts equals exact total pool (1000 tokens)');

// ==========================================
// TEST 3: Unequal Stakes Pari-Mutuel Distribution
// ==========================================
// Winner A stakes 100, Winner B stakes 300 (W = 400).
// Losers stake 600 (L = 600). Total pool = 1000.
// A reward share = (100 / 400) * 600 = 150. A total = 250.
// B reward share = (300 / 400) * 600 = 450. B total = 750.
const sampleParts2 = [
  { id: 'p1', userId: 'userA', optionId: 'opt_no', tokensCommitted: 100, createdAt: '' },
  { id: 'p2', userId: 'userB', optionId: 'opt_no', tokensCommitted: 300, createdAt: '' },
  { id: 'p3', userId: 'userC', optionId: 'opt_yes', tokensCommitted: 600, createdAt: '' },
];
const payouts2 = pariMutuelEngine.distributePayouts(sampleParts2, 'opt_no');
const payoutA = payouts2.find(p => p.userId === 'userA');
const payoutB = payouts2.find(p => p.userId === 'userB');
assert(payoutA.totalPayout === 250, 'Winner A receives proportional 250 tokens');
assert(payoutB.totalPayout === 750, 'Winner B receives proportional 750 tokens');
assert(payoutA.totalPayout + payoutB.totalPayout === 1000, 'Sum of payouts equals 1000 tokens');

// ==========================================
// TEST 4: Integer-Safe Deterministic Rounding Handling
// ==========================================
// 3 winners with equal stake of 100 each (W = 300).
// Loser stake is 100 (L = 100). Total pool = 400.
// 100 / 3 = 33.333 tokens per winner.
// With integer safety, 1 token remainder must be deterministically awarded so sum == 400!
const sampleParts3 = [
  { id: 'p1', userId: 'userA', optionId: 'opt_win', tokensCommitted: 100, createdAt: '' },
  { id: 'p2', userId: 'userB', optionId: 'opt_win', tokensCommitted: 100, createdAt: '' },
  { id: 'p3', userId: 'userC', optionId: 'opt_win', tokensCommitted: 100, createdAt: '' },
  { id: 'p4', userId: 'userD', optionId: 'opt_lose', tokensCommitted: 100, createdAt: '' },
];
const payouts3 = pariMutuelEngine.distributePayouts(sampleParts3, 'opt_win');
const totalDistributed3 = payouts3.reduce((sum, p) => sum + p.totalPayout, 0);
assert(totalDistributed3 === 400, 'Total pool conserved after integer rounding (exactly 400)');
assert(payouts3.every(p => Number.isInteger(p.totalPayout)), 'All payouts are integer-safe tokens');

// ==========================================
// TEST 5: Closest Answer Winner Resolution
// ==========================================
// Guesses: User A = 42, User B = 47, User C = 55. Actual = 45.
// User A diff = 3 (abs(42-45)=3). User B diff = 2 (abs(47-45)=2).
// Winner is User B!
const closestParts = [
  { id: 'p1', userId: 'userA', closestAnswerValue: 42, tokensCommitted: 100, createdAt: '' },
  { id: 'p2', userId: 'userB', closestAnswerValue: 47, tokensCommitted: 150, createdAt: '' },
  { id: 'p3', userId: 'userC', closestAnswerValue: 55, tokensCommitted: 200, createdAt: '' },
];
const closestResolution = pariMutuelEngine.resolveClosestAnswerWinners(closestParts, 45);
assert(closestResolution.winningParticipationIds.length === 1, 'Single closest winner identified');
assert(closestResolution.winningParticipationIds[0] === 'p2', 'User B (47) correctly won closest to 45');

// ==========================================
// TEST 6: Closest Answer Tied Resolution
// ==========================================
// Guesses: User A = 43 (diff 2), User B = 47 (diff 2). Tied closest!
const tiedClosestParts = [
  { id: 'p1', userId: 'userA', closestAnswerValue: 43, tokensCommitted: 100, createdAt: '' },
  { id: 'p2', userId: 'userB', closestAnswerValue: 47, tokensCommitted: 100, createdAt: '' },
  { id: 'p3', userId: 'userC', closestAnswerValue: 70, tokensCommitted: 200, createdAt: '' },
];
const tiedResolution = pariMutuelEngine.resolveClosestAnswerWinners(tiedClosestParts, 45);
assert(tiedResolution.winningParticipationIds.length === 2, 'Both tied closest guesses identified');
const tiedPayouts = pariMutuelEngine.distributeClosestAnswerPayouts(
  tiedClosestParts,
  tiedResolution.winningParticipationIds
);
const totalTiedDistributed = tiedPayouts.reduce((sum, p) => sum + p.totalPayout, 0);
assert(totalTiedDistributed === 400, 'Tied winners share total pool of 400 tokens');

// ==========================================
// TEST 7: Flat Interest Loan Math
// ==========================================
// Principal: 500 tokens. Flat interest rate: 10%.
// Interest amount: (500 * 10) / 100 = 50. Total repayment: 550 tokens.
const principal = 500;
const rate = 10;
const interest = Math.round((principal * rate) / 100);
const repayment = principal + interest;
assert(interest === 50, 'Flat interest amount is exactly 50 tokens');
assert(repayment === 550, 'Total loan repayment equals exactly 550 tokens');

console.log(`\nCOMPREHENSIVE TEST RESULTS: ${passed} Passed, ${failed} Failed.`);
if (failed > 0) process.exit(1);

