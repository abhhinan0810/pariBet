import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read student roster
const rosterPath = path.resolve(__dirname, '../data/student_roster.csv');
const rawCsv = fs.readFileSync(rosterPath, 'utf8').trim().split('\n');

const approvedList = rawCsv.slice(1).filter(l => l.trim()).map(line => {
  const [email, official_name, admission_number] = line.trim().split(',');
  return {
    email: email.trim().toLowerCase(),
    official_name: official_name.trim(),
    admission_number: admission_number.trim().toLowerCase()
  };
});

function verifyEmail(rawEmail) {
  const email = (rawEmail || '').trim().toLowerCase();
  if (!email.endsWith('@ceconline.edu')) {
    return {
      isApproved: false,
      error: 'Only official college email addresses ending in @ceconline.edu are permitted.'
    };
  }
  const match = approvedList.find(s => s.email === email);
  if (match) {
    return { isApproved: true, student: match };
  }
  return {
    isApproved: false,
    error: 'Your email address is not found in the verified MCA classroom student roster.'
  };
}

console.log('--- STARTING PHASE 1 AUTHENTICATION & ROSTER TESTS ---');

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`[PASS] ${name}`);
    passed++;
  } else {
    console.error(`[FAIL] ${name}`);
    failed++;
  }
}

// Test 1: Exactly 53 student records in roster
assert(approvedList.length === 53, `Roster count equals 53 (Found: ${approvedList.length})`);

// Test 2: Valid approved student can register
const testStudent1 = verifyEmail('chn25mca055@ceconline.edu');
assert(testStudent1.isApproved === true, 'Approved student chn25mca055@ceconline.edu accepted');
assert(testStudent1.student.official_name === 'Abhinav Krishna S', 'Correct official name resolved: Abhinav Krishna S');
assert(testStudent1.student.admission_number === 'chn25mca055', 'Correct admission number resolved: chn25mca055');

// Test 3: Valid approved student #2
const testStudent2 = verifyEmail('chn25mca045@ceconline.edu');
assert(testStudent2.isApproved === true, 'Approved student chn25mca045@ceconline.edu accepted');
assert(testStudent2.student.official_name === 'Abhinand A Nair', 'Correct official name resolved: Abhinand A Nair');

// Test 4: External email rejection
const testExternal = verifyEmail('random_outsider@gmail.com');
assert(testExternal.isApproved === false, 'External email rejected');
assert(testExternal.error.includes('@ceconline.edu'), 'External email specific error returned');

// Test 5: Same domain but NOT in roster rejection (prevent domain spoofing)
const testDomainSpoof = verifyEmail('fake_student999@ceconline.edu');
assert(testDomainSpoof.isApproved === false, 'Domain spoofing non-roster email rejected');
assert(testDomainSpoof.error.includes('not found in the verified MCA classroom student roster'), 'Unenrolled student error returned');

// Test 6: Case insensitivity
const testCaseInsensitive = verifyEmail('CHN25MCA055@CECONLINE.EDU');
assert(testCaseInsensitive.isApproved === true, 'Case insensitive email accepted');

// Test 7: All 53 roster emails adhere to admission_number@ceconline.edu convention
const allConforming = approvedList.every(s => s.email === `${s.admission_number}@ceconline.edu`);
assert(allConforming === true, 'All 53 students strictly follow admission_number@ceconline.edu format');

console.log(`\nTEST SUMMARY: ${passed} Passed, ${failed} Failed.`);
if (failed > 0) process.exit(1);

