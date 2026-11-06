import { db, isFirebaseConfigured } from '@/config/firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { ApprovedStudent } from '@/types/user';
import approvedStudentsSeed from '@/data/approved_students.json';

const APPROVED_COLLECTION = 'approved_students';
const CREDENTIALS_KEY = 'paribet_student_credentials';

export interface StudentCredentialRecord {
  admissionNumber: string;
  hasChangedPassword: boolean;
  password?: string;
  dob?: string;
  updatedAt?: string;
}

export const studentService = {
  /**
   * Normalize an input email or admission number to standard formats
   */
  normalizeStudentIdentifier(rawInput: string): { email: string; admission: string } {
    let clean = rawInput.trim().toLowerCase();
    if (clean.includes('@')) {
      const email = clean;
      const admission = clean.split('@')[0];
      return { email, admission };
    } else {
      const admission = clean;
      const email = `${clean}@ceconline.edu`;
      return { email, admission };
    }
  },

  /**
   * Find approved student by email or admission number
   */
  getApprovedStudent(rawInput: string): ApprovedStudent | null {
    const { email, admission } = this.normalizeStudentIdentifier(rawInput);
    const matched = (approvedStudentsSeed as ApprovedStudent[]).find(
      (s) =>
        s.email.toLowerCase() === email ||
        s.admission_number.toLowerCase() === admission
    );
    return matched || null;
  },

  /**
   * Get student credential record from local storage
   */
  getStudentCredential(admissionNumber: string): StudentCredentialRecord | null {
    try {
      const stored = localStorage.getItem(CREDENTIALS_KEY);
      if (!stored) return null;
      const creds: Record<string, StudentCredentialRecord> = JSON.parse(stored);
      return creds[admissionNumber.toLowerCase()] || null;
    } catch {
      return null;
    }
  },

  /**
   * Save student credential record to local storage
   */
  saveStudentCredential(cred: StudentCredentialRecord): void {
    try {
      const stored = localStorage.getItem(CREDENTIALS_KEY);
      const creds: Record<string, StudentCredentialRecord> = stored ? JSON.parse(stored) : {};
      creds[cred.admissionNumber.toLowerCase()] = cred;
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
    } catch (err) {
      console.warn('[studentService] Failed to save credential:', err);
    }
  },

  /**
   * Verify student credentials:
   * - If student has set a permanent password, validates against it.
   * - If student has not set a password yet, validates that the password is their DOB (DDMMYYYY).
   */
  async verifyStudentCredential(
    rawIdentifier: string,
    passwordAttempt: string
  ): Promise<{
    isApproved: boolean;
    studentData: ApprovedStudent | null;
    isFirstLogin: boolean;
    error?: string;
  }> {
    const student = this.getApprovedStudent(rawIdentifier);
    if (!student) {
      return {
        isApproved: false,
        studentData: null,
        isFirstLogin: false,
        error: 'Admission number or email not found in the verified MCA classroom roster.'
      };
    }

    const cred = this.getStudentCredential(student.admission_number);

    // Case 1: Student has already set a permanent password
    if (cred && cred.hasChangedPassword && cred.password) {
      if (cred.password === passwordAttempt) {
        return {
          isApproved: true,
          studentData: { ...student, hasChangedPassword: true },
          isFirstLogin: false
        };
      } else {
        return {
          isApproved: false,
          studentData: null,
          isFirstLogin: false,
          error: 'Incorrect password. If you forgot your password, contact your class administrator.'
        };
      }
    }

    // Case 2: First-time student login using Date of Birth (DDMMYYYY format)
    const cleanPwd = passwordAttempt.trim();
    const dobRegex = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])(19[8-9][0-9]|20[0-1][0-9])$/;
    const isStandardDob = dobRegex.test(cleanPwd) || cleanPwd.length === 8;

    if (!isStandardDob) {
      return {
        isApproved: false,
        studentData: null,
        isFirstLogin: false,
        error: 'Initial password must be your Date of Birth in DDMMYYYY format (8 digits, e.g. 15082001).'
      };
    }

    // Valid initial DOB entry!
    return {
      isApproved: true,
      studentData: { ...student, dob: cleanPwd, hasChangedPassword: false },
      isFirstLogin: true
    };
  },

  /**
   * Update student's permanent password & nickname on first login
   */
  setStudentPermanentPassword(admissionNumber: string, newPassword: string): void {
    const cred: StudentCredentialRecord = {
      admissionNumber: admissionNumber.toLowerCase(),
      hasChangedPassword: true,
      password: newPassword,
      updatedAt: new Date().toISOString()
    };
    this.saveStudentCredential(cred);
  },

  /**
   * Admin tool: Reset student password back to initial DOB login
   */
  resetStudentPasswordToDob(admissionNumber: string): void {
    try {
      const stored = localStorage.getItem(CREDENTIALS_KEY);
      if (!stored) return;
      const creds: Record<string, StudentCredentialRecord> = JSON.parse(stored);
      delete creds[admissionNumber.toLowerCase()];
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
    } catch (err) {
      console.warn('[studentService] Failed to reset student password:', err);
    }
  },

  /**
   * Check whether a given email or admission number is in the approved MCA directory
   */
  async verifyStudentEmail(rawEmail: string): Promise<{
    isApproved: boolean;
    studentData: ApprovedStudent | null;
    error?: string;
  }> {
    const student = this.getApprovedStudent(rawEmail);
    if (student) {
      return {
        isApproved: true,
        studentData: student
      };
    }

    return {
      isApproved: false,
      studentData: null,
      error: 'Your admission number or college email was not found in the verified MCA classroom student roster.'
    };
  },

  /**
   * Seed approved students into Firestore if authorized/empty
   */
  async seedRosterToFirestore(): Promise<{ count: number }> {
    if (!isFirebaseConfigured) return { count: 0 };

    let count = 0;
    for (const student of approvedStudentsSeed as ApprovedStudent[]) {
      const docRef = doc(db, APPROVED_COLLECTION, student.email.toLowerCase());
      const existing = await getDoc(docRef);
      if (!existing.exists()) {
        await setDoc(docRef, {
          email: student.email.toLowerCase(),
          official_name: student.official_name,
          admission_number: student.admission_number.toLowerCase(),
          isRegistered: false,
          registeredUid: null,
          createdAt: new Date().toISOString()
        });
        count++;
      }
    }
    return { count };
  }
};

