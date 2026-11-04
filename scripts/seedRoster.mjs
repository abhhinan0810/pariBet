import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read student roster
const csvPath = path.resolve(__dirname, '../data/student_roster.csv');
const rawData = fs.readFileSync(csvPath, 'utf8').trim().split('\n');

const students = rawData.slice(1).filter(l => l.trim()).map(line => {
  const [email, official_name, admission_number] = line.trim().split(',');
  return {
    email: email.trim().toLowerCase(),
    official_name: official_name.trim(),
    admission_number: admission_number.trim().toLowerCase(),
    isRegistered: false,
    registeredUid: null,
    createdAt: new Date().toISOString()
  };
});

console.log(`Found ${students.length} approved students in CSV.`);

// Output seed file ready for Firestore import
const outputPath = path.resolve(__dirname, '../src/data/approved_students.json');
fs.writeFileSync(outputPath, JSON.stringify(students, null, 2));
console.log(`Successfully compiled student roster to ${outputPath}`);

