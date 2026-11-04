import { db, isFirebaseConfigured } from '@/config/firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { ApprovedStudent } from '@/types/user';
import approvedStudentsSeed from '@/data/approved_students.json';

const APPROVED_COLLECTION = 'approved_students';

export const studentService = {
  /**
   * Check whether a given email is in the approved MCA student directory
   */
  async verifyStudentEmail(rawEmail: string): Promise<{
    isApproved: boolean;
    studentData: ApprovedStudent | null;
    error?: string;
  }> {
    const email = rawEmail.trim().toLowerCase();

    // First check domain requirement as preliminary filter
    if (!email.endsWith('@ceconline.edu')) {
      return {
        isApproved: false,
        studentData: null,
        error: 'Only official college email addresses ending in @ceconline.edu are permitted.'
      };
    }

    if (isFirebaseConfigured) {
      try {
        // Query Firestore collection
        const q = query(collection(db, APPROVED_COLLECTION), where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data() as ApprovedStudent;
          return {
            isApproved: true,
            studentData: docData
          };
        }
      } catch (err) {
        console.warn('[studentService] Firestore lookup failed, checking local authoritative roster:', err);
      }
    }

    // Authoritative roster check (handles both offline/dev fallback and seed validation)
    const matched = (approvedStudentsSeed as ApprovedStudent[]).find(
      (s) => s.email.toLowerCase() === email
    );

    if (matched) {
      return {
        isApproved: true,
        studentData: matched
      };
    }

    return {
      isApproved: false,
      studentData: null,
      error: 'Your email address is not found in the verified MCA classroom student roster.'
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

