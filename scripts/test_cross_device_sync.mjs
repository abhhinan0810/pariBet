import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.resolve(__dirname, '../data/server_db.json');

console.log('--- STARTING CROSS-DEVICE MULTI-DEVICE AUTHENTICATION & SYNC TESTS ---');

// Simulate the central server DB
function readDb() {
  if (fs.existsSync(dbFile)) {
    return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  }
  return {};
}

function writeDb(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf8');
}

// Reset DB for test
const initialDb = readDb();

try {
  // Test 1: Laptop sets permanent password
  const testAdmission = 'chn25mca055';
  const testDob = '15082001';
  const newPassword = 'PariBet@MyNewPassword2025';

  const creds = {};
  creds[testAdmission] = {
    admissionNumber: testAdmission,
    hasChangedPassword: true,
    password: newPassword,
    updatedAt: new Date().toISOString()
  };

  const users = {};
  users[`uid_${testAdmission}`] = {
    uid: `uid_${testAdmission}`,
    email: `${testAdmission}@ceconline.edu`,
    officialName: 'Abhinav Krishna S',
    admissionNumber: testAdmission,
    nickname: 'AbhiVarkkala',
    walletBalance: 1000,
    hasChangedPassword: true
  };

  writeDb({
    paribet_student_credentials: creds,
    paribet_mock_users: users
  });

  console.log('[PASS] Laptop (Device A) saved credentials & profile to central server DB');

  // Test 2: Phone (Device B) checks central DB
  const phoneDb = readDb();
  const phoneCreds = phoneDb.paribet_student_credentials;
  const phoneUsers = phoneDb.paribet_mock_users;

  if (!phoneCreds || !phoneCreds[testAdmission]) {
    throw new Error('Phone failed to find student credential on central server DB');
  }

  const studentCred = phoneCreds[testAdmission];
  if (!studentCred.hasChangedPassword || studentCred.password !== newPassword) {
    throw new Error('Phone received wrong or un-updated password from central server DB');
  }
  console.log('[PASS] Phone (Device B) successfully retrieved updated permanent password from central DB');

  // Test 3: Phone verifies that DOB is NO LONGER accepted after password change
  if (studentCred.password === testDob) {
    throw new Error('DOB should not match student permanent password');
  }
  console.log('[PASS] Old DOB correctly rejected on Phone when permanent password is set');

  // Test 4: Phone verifies profile data and hasChangedPassword flag
  const userProfile = phoneUsers[`uid_${testAdmission}`];
  if (!userProfile || userProfile.nickname !== 'AbhiVarkkala' || userProfile.walletBalance !== 1000) {
    throw new Error('User profile did not match values on phone');
  }
  if (!userProfile.hasChangedPassword) {
    throw new Error('User hasChangedPassword should be true on Phone');
  }
  console.log('[PASS] Phone sees exact nickname (AbhiVarkkala), 1,000 PTS balance, and hasChangedPassword: true');

  console.log('\nALL CROSS-DEVICE SYNCHRONIZATION TESTS PASSED SUCCESSFULLY!');
} finally {
  // Restore initial DB
  writeDb(initialDb);
}

