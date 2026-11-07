import assert from 'assert';

// Standalone simulation of the engagement service logic to test business rules

const STREAK_REWARDS = [
  { day: 1, pts: 50, label: 'Day 1' },
  { day: 2, pts: 100, label: 'Day 2' },
  { day: 3, pts: 150, label: 'Day 3' },
  { day: 4, pts: 200, label: 'Day 4' },
  { day: 5, pts: 250, label: 'Day 5' },
  { day: 6, pts: 350, label: 'Day 6' },
  { day: 7, pts: 600, label: 'Day 7 VIP', isSpecial: true },
];

const WHEEL_PRIZES = [
  { id: 'loss_1', label: 'Better Luck Next Time', pts: 0, weight: 28, isLoss: true },
  { id: 'win_50', label: '+50 PTS', pts: 50, weight: 20 },
  { id: 'loss_2', label: 'Better Luck Next Time', pts: 0, weight: 20, isLoss: true },
  { id: 'win_100', label: '+100 PTS', pts: 100, weight: 12 },
  { id: 'ticket_jackpot', label: 'Jackpot Ticket', pts: 50, weight: 8 },
  { id: 'win_25', label: '+25 PTS', pts: 25, weight: 7 },
  { id: 'win_250', label: '+250 PTS', pts: 250, weight: 4 },
  { id: 'jackpot_500', label: '+500 PTS Jackpot', pts: 500, weight: 1 },
];

const parseDateString = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

const getDaysBetweenDates = (earlierStr, laterStr) => {
  const d1 = parseDateString(earlierStr);
  const d2 = parseDateString(laterStr);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

function calculateStreakStatus(record, todayStr) {
  if (!record || !record.lastCheckInDate) {
    return { activeDay: 1, checkedInToday: false };
  }

  const daysSince = getDaysBetweenDates(record.lastCheckInDate, todayStr);

  if (daysSince === 0) {
    return { activeDay: record.streakDays, checkedInToday: true };
  } else if (daysSince === 1) {
    const nextDay = record.streakDays >= 7 ? 1 : record.streakDays + 1;
    return { activeDay: nextDay, checkedInToday: false };
  } else {
    // Missed at least 1 day! Reset to Day 1!
    return { activeDay: 1, checkedInToday: false };
  }
}

console.log('--- RUNNING DAILY REWARDS & LUCKY WHEEL SIMULATION TESTS ---');

// Test 1: New user starts at Day 1
const t1 = calculateStreakStatus(null, '2026-11-07');
assert.strictEqual(t1.activeDay, 1, 'New user should start at Day 1');
assert.strictEqual(t1.checkedInToday, false, 'New user should not be checked in yet');
console.log('[PASS] New user starts at Day 1 with checkedInToday: false');

// Test 2: User checked in today
const recToday = { lastCheckInDate: '2026-11-07', streakDays: 1 };
const t2 = calculateStreakStatus(recToday, '2026-11-07');
assert.strictEqual(t2.activeDay, 1);
assert.strictEqual(t2.checkedInToday, true, 'Should recognize already checked in today');
console.log('[PASS] Same-day check-in correctly marked checkedInToday: true');

// Test 3: User checked in yesterday (Day 1 -> Day 2)
const recYesterday = { lastCheckInDate: '2026-11-06', streakDays: 1 };
const t3 = calculateStreakStatus(recYesterday, '2026-11-07');
assert.strictEqual(t3.activeDay, 2, 'Consecutive day should advance to Day 2');
assert.strictEqual(t3.checkedInToday, false);
console.log('[PASS] Consecutive day check-in advances streak to Day 2');

// Test 4: User MISSED claiming yesterday (Day 3 on Nov 4 -> today is Nov 7, 3 days gap)
const recMissed = { lastCheckInDate: '2026-11-04', streakDays: 3 };
const t4 = calculateStreakStatus(recMissed, '2026-11-07');
assert.strictEqual(t4.activeDay, 1, 'Missed claim should reset streak to Day 1');
assert.strictEqual(t4.checkedInToday, false);
console.log('[PASS] Missed day correctly resets streak to Day 1!');

// Test 5: Day 7 completion loops to Day 1 on next consecutive day
const recDay7 = { lastCheckInDate: '2026-11-06', streakDays: 7 };
const t5 = calculateStreakStatus(recDay7, '2026-11-07');
assert.strictEqual(t5.activeDay, 1, 'Day 7 completion should loop to Day 1 on next day');
console.log('[PASS] 7-Day completion loops back to Day 1');

// Test 6: Wheel probability distribution over 10,000 spins
let losses = 0;
let wins = 0;
const totalWeight = WHEEL_PRIZES.reduce((s, p) => s + p.weight, 0);

for (let i = 0; i < 10000; i++) {
  const rand = Math.random() * totalWeight;
  let cum = 0;
  for (const p of WHEEL_PRIZES) {
    cum += p.weight;
    if (rand <= cum) {
      if (p.isLoss) losses++;
      else wins++;
      break;
    }
  }
}

const lossRate = (losses / 10000) * 100;
console.log(`[WHEEL TEST] 10,000 spins result: ${losses} Losses (${lossRate.toFixed(1)}%), ${wins} Wins (${(100 - lossRate).toFixed(1)}%)`);
assert(lossRate >= 43 && lossRate <= 53, 'Loss rate should be around 48%');
console.log('[PASS] Lucky Wheel frequently shows Better Luck Next Time (~48% probability)');

console.log('\nALL ENGAGEMENT TESTS PASSED!');

