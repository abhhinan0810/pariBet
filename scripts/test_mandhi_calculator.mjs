import assert from 'assert';
import fs from 'fs';

console.log('--- STARTING MANDHI RACE CALCULATOR & STANDINGS TESTS ---');

const roster = JSON.parse(fs.readFileSync('src/data/approved_students.json', 'utf8'));
assert.strictEqual(roster.length, 53, 'Total roster must be 53 students');

// Mock simulation of students with various token balances
const mockUsers = {
  'chn25mca055': { officialName: 'Abhinav Krishna S', nickname: 'Abhinav', points: 3500 },
  'chn25mca045': { officialName: 'Abhinand A Nair', nickname: 'Abhinand', points: 2800 },
  'chn25mca064': { officialName: 'Abhishek M S', nickname: 'Abhishek', points: 2400 },
  'chn25mca054': { officialName: 'Abinson Suresh', nickname: 'Abinson', points: 1900 },
  'chn25mca069': { officialName: 'Adarsh S', nickname: 'Adarsh', points: 1500 },
  'chn25mca022': { officialName: 'Adithya Prasad', nickname: 'Adithya', points: 1200 },
};

// Build complete 53 student list
const fullList = roster.map((s) => {
  const custom = mockUsers[s.admission_number];
  return {
    admission: s.admission_number,
    name: s.official_name,
    nickname: custom ? custom.nickname : s.official_name.split(' ')[0],
    points: custom ? custom.points : 1000,
  };
});

// Sort descending
fullList.sort((a, b) => {
  if (b.points !== a.points) return b.points - a.points;
  return a.name.localeCompare(b.name);
});

// Cutoff is Seat #4
const seat4 = fullList[3];
const seat5 = fullList[4];
const cutoffPoints = seat4.points;
const cutoffHolder = seat4.nickname;
const rank5Points = seat5.points;

console.log(`[DATA] Seat #1: ${fullList[0].nickname} (${fullList[0].points} PTS)`);
console.log(`[DATA] Seat #2: ${fullList[1].nickname} (${fullList[1].points} PTS)`);
console.log(`[DATA] Seat #3: ${fullList[2].nickname} (${fullList[2].points} PTS)`);
console.log(`[DATA] Seat #4 (Cutoff): ${seat4.nickname} (${cutoffPoints} PTS)`);
console.log(`[DATA] Seat #5: ${seat5.nickname} (${rank5Points} PTS)`);

assert.strictEqual(cutoffPoints, 1900, 'Cutoff for Seat #4 should be 1900 PTS');
assert.strictEqual(cutoffHolder, 'Abinson', 'Seat #4 holder should be Abinson');
assert.strictEqual(rank5Points, 1500, 'Seat #5 points should be 1500 PTS');

// Test Case A: User in Seat #1 (Abhinav, 3500 PTS)
const rank1User = fullList[0];
const rank1Rank = 1;
const isQualifying1 = rank1Rank <= 4;
const cushion1 = isQualifying1 ? rank1User.points - rank5Points : 0;
assert.strictEqual(isQualifying1, true, 'Rank 1 must be qualifying');
assert.strictEqual(cushion1, 2000, 'Rank 1 cushion over Seat #5 (1500) must be 2000 PTS (3500 - 1500)');
console.log('[PASS] Qualifying Contender (Rank 1): cushion correctly calculated as +2,000 PTS over Seat #5');

// Test Case B: User in Seat #4 (Abinson, 1900 PTS)
const rank4User = fullList[3];
const rank4Rank = 4;
const isQualifying4 = rank4Rank <= 4;
const cushion4 = isQualifying4 ? rank4User.points - rank5Points : 0;
assert.strictEqual(isQualifying4, true, 'Rank 4 must be qualifying');
assert.strictEqual(cushion4, 400, 'Rank 4 cushion over Seat #5 must be 400 PTS (1900 - 1500)');
console.log('[PASS] Cutoff Holder (Rank 4): cushion correctly calculated as +400 PTS over Seat #5');

// Test Case C: User in Seat #6 (Adithya, 1200 PTS)
const rank6User = fullList[5];
const rank6Rank = 6;
const isQualifying6 = rank6Rank <= 4;
const deficit6 = isQualifying6 ? 0 : Math.max(1, cutoffPoints - rank6User.points + 1);
assert.strictEqual(isQualifying6, false, 'Rank 6 must NOT be qualifying');
assert.strictEqual(deficit6, 701, 'Rank 6 deficit to overtake Seat #4 (1900) must be 701 PTS (1900 - 1200 + 1)');
console.log('[PASS] Chasing Contender (Rank 6): deficit to claim Seat #4 is correctly 701 PTS');

// Test Case D: What-If Simulator math for Rank 6 (1,200 PTS, needing 701 PTS)
// Simulation 1: Stake 200 at 2.5x
const stake1 = 200;
const odds1 = 2.5;
const profit1 = Math.round(stake1 * (odds1 - 1)); // 300
const total1 = rank6User.points + profit1; // 1500
const willQualify1 = total1 > cutoffPoints; // 1500 > 1900 -> false
const remDeficit1 = Math.max(0, deficit6 - profit1); // 701 - 300 = 401
const betsNeeded1 = Math.ceil(remDeficit1 / profit1); // ceil(401 / 300) = 2
assert.strictEqual(profit1, 300);
assert.strictEqual(willQualify1, false);
assert.strictEqual(remDeficit1, 401);
assert.strictEqual(betsNeeded1, 2);
console.log('[PASS] Simulator: 200 PTS at 2.5x yields +300 PTS net profit, leaves 401 deficit (2 more wins needed)');

// Simulation 2: Big Win: Stake 400 at 3.0x -> +800 PTS profit -> Total 2000 > 1900
const stake2 = 400;
const odds2 = 3.0;
const profit2 = Math.round(stake2 * (odds2 - 1)); // 800
const total2 = rank6User.points + profit2; // 2000
const willQualify2 = total2 > cutoffPoints; // 2000 > 1900 -> true
const margin2 = total2 - cutoffPoints; // +100 PTS
assert.strictEqual(willQualify2, true);
assert.strictEqual(margin2, 100);
console.log('[PASS] Simulator: 400 PTS at 3.0x reaches Mandhi seat overtaking Seat #4 by +100 PTS');

console.log('\nALL MANDHI RACE CALCULATOR TESTS PASSED WITH 100% ACCURACY!');

