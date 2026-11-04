import { db, isFirebaseConfigured } from '@/config/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import { LoanRequest, LoanOffer, Loan, LoanStatus } from '@/types/loan';
import { walletService } from './walletService';
import { userService } from './userService';
import { notificationService } from './notificationService';

const REQUESTS_COLLECTION = 'loan_requests';
const OFFERS_COLLECTION = 'loan_offers';
const LOANS_COLLECTION = 'loans';

const LOCAL_REQUESTS_KEY = 'paribet_mock_loan_requests';
const LOCAL_OFFERS_KEY = 'paribet_mock_loan_offers';
const LOCAL_LOANS_KEY = 'paribet_mock_loans';

// Initial seed loan requests
const INITIAL_SEED_REQUESTS: LoanRequest[] = [
  {
    id: 'req_1',
    borrowerId: 'uid_chn25mca060',
    borrowerNickname: 'Apex',
    borrowerOfficialName: 'Avinash AR',
    amount: 300,
    maxInterestRate: 10,
    requestedRepaymentDays: 7,
    description: 'Need virtual tokens for the inter-batch cricket tournament pool!',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 48).toISOString(),
    offersCount: 1,
  }
];

export const loanService = {
  /**
   * Get all loan requests
   */
  async getLoanRequests(status?: LoanStatus): Promise<LoanRequest[]> {
    let list: LoanRequest[] = [];

    if (isFirebaseConfigured) {
      try {
        const snapshot = await getDocs(collection(db, REQUESTS_COLLECTION));
        list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as LoanRequest));
      } catch (err) {
        console.warn('[loanService] Firestore get requests failed, loading local:', err);
      }
    }

    if (list.length === 0) {
      const stored = localStorage.getItem(LOCAL_REQUESTS_KEY);
      if (stored) {
        list = JSON.parse(stored);
      } else {
        list = INITIAL_SEED_REQUESTS;
        localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(list));
      }
    }

    if (status) {
      list = list.filter((r) => r.status === status);
    }

    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * Create a new loan request
   */
  async createLoanRequest(params: {
    borrowerId: string;
    borrowerNickname: string;
    borrowerOfficialName: string;
    borrowerAvatar?: string;
    amount: number;
    maxInterestRate: number;
    requestedRepaymentDays: number;
    description?: string;
  }): Promise<LoanRequest> {
    // Check if user has overdue loans
    const userLoans = await this.getUserLoans(params.borrowerId);
    const hasOverdue = userLoans.some((l) => l.status === 'OVERDUE' && l.borrowerId === params.borrowerId);
    if (hasOverdue) {
      throw new Error('Borrowing restricted: You have an outstanding overdue loan to resolve.');
    }

    // Maximum borrowing limit check (e.g. 2,000 tokens)
    if (params.amount > 2000) {
      throw new Error('Classroom maximum borrowing limit per request is 2,000 tokens.');
    }

    const newReq: LoanRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      borrowerId: params.borrowerId,
      borrowerNickname: params.borrowerNickname,
      borrowerOfficialName: params.borrowerOfficialName,
      borrowerAvatar: params.borrowerAvatar,
      amount: params.amount,
      maxInterestRate: params.maxInterestRate,
      requestedRepaymentDays: params.requestedRepaymentDays,
      description: params.description?.trim(),
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days expiry
      offersCount: 0,
    };

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, REQUESTS_COLLECTION, newReq.id), newReq);
      } catch (err) {
        console.warn('[loanService] Firestore request create failed:', err);
      }
    }

    const all = await this.getLoanRequests();
    all.unshift(newReq);
    localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(all));

    return newReq;
  },

  /**
   * Submit an offer on a loan request
   */
  async submitOffer(params: {
    requestId: string;
    lenderId: string;
    lenderNickname: string;
    lenderOfficialName: string;
    lenderAvatar?: string;
    principalAmount: number;
    flatInterestRate: number;
    repaymentDeadlineDays: number;
    message?: string;
  }): Promise<LoanOffer> {
    const request = (await this.getLoanRequests()).find((r) => r.id === params.requestId);
    if (!request) throw new Error('Loan request not found.');

    if (request.borrowerId === params.lenderId) {
      throw new Error('You cannot fund your own loan request.');
    }

    // Ensure lender has sufficient tokens
    const lenderProfile = await userService.getUserProfile(params.lenderId);
    if (!lenderProfile || lenderProfile.walletBalance < params.principalAmount) {
      throw new Error('Insufficient wallet tokens to fund this loan offer.');
    }

    const interestAmount = Math.round((params.principalAmount * params.flatInterestRate) / 100);
    const totalRepayment = params.principalAmount + interestAmount;

    const offer: LoanOffer = {
      id: `offer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      requestId: params.requestId,
      lenderId: params.lenderId,
      lenderNickname: params.lenderNickname,
      lenderOfficialName: params.lenderOfficialName,
      lenderAvatar: params.lenderAvatar,
      principalAmount: params.principalAmount,
      flatInterestRate: params.flatInterestRate,
      interestAmount,
      totalRepaymentAmount: totalRepayment,
      repaymentDeadlineDays: params.repaymentDeadlineDays,
      offerExpiresAt: new Date(Date.now() + 86400000 * 2).toISOString(),
      message: params.message?.trim(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    // Increment request offers count
    request.offersCount = (request.offersCount || 0) + 1;
    request.status = 'OFFER_RECEIVED';

    const allOffers: LoanOffer[] = JSON.parse(localStorage.getItem(LOCAL_OFFERS_KEY) || '[]');
    allOffers.push(offer);
    localStorage.setItem(LOCAL_OFFERS_KEY, JSON.stringify(allOffers));

    const allReqs = await this.getLoanRequests();
    const idx = allReqs.findIndex((r) => r.id === request.id);
    if (idx !== -1) {
      allReqs[idx] = request;
      localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(allReqs));
    }

    // Notify borrower
    await notificationService.sendNotification({
      userId: request.borrowerId,
      type: 'LOAN_OFFER_NEW',
      title: 'New Loan Offer Received',
      message: `${params.lenderNickname} offered ${params.principalAmount} tokens at ${params.flatInterestRate}% flat interest.`,
      referenceId: request.id,
    });

    return offer;
  },

  /**
   * Get offers for a loan request
   */
  async getOffersForRequest(requestId: string): Promise<LoanOffer[]> {
    const allOffers: LoanOffer[] = JSON.parse(localStorage.getItem(LOCAL_OFFERS_KEY) || '[]');
    return allOffers.filter((o) => o.requestId === requestId);
  },

  /**
   * Accept an offer -> Transfers tokens from lender to borrower atomically
   */
  async acceptOffer(requestId: string, offerId: string): Promise<Loan> {
    const allReqs = await this.getLoanRequests();
    const req = allReqs.find((r) => r.id === requestId);
    if (!req) throw new Error('Loan request not found.');

    if (req.status === 'ACCEPTED' || req.acceptedOfferId) {
      throw new Error('This loan request has already been accepted.');
    }

    const offers = await this.getOffersForRequest(requestId);
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) throw new Error('Offer not found.');

    // 1. Deduct principal from lender
    await walletService.recordTransaction({
      userId: offer.lenderId,
      type: 'LOAN_GIVEN',
      amount: -offer.principalAmount,
      description: `Funded loan of ${offer.principalAmount} tokens to ${req.borrowerNickname}`,
      referenceId: req.id,
    });

    // 2. Credit principal to borrower
    await walletService.recordTransaction({
      userId: req.borrowerId,
      type: 'LOAN_RECEIVED',
      amount: offer.principalAmount,
      description: `Received loan of ${offer.principalAmount} tokens from ${offer.lenderNickname}`,
      referenceId: req.id,
    });

    // 3. Create active Loan record
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + offer.repaymentDeadlineDays);

    const loan: Loan = {
      id: `loan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      requestId: req.id,
      offerId: offer.id,
      borrowerId: req.borrowerId,
      borrowerNickname: req.borrowerNickname,
      borrowerOfficialName: req.borrowerOfficialName,
      lenderId: offer.lenderId,
      lenderNickname: offer.lenderNickname,
      lenderOfficialName: offer.lenderOfficialName,
      principalAmount: offer.principalAmount,
      flatInterestRate: offer.flatInterestRate,
      interestAmount: offer.interestAmount,
      totalRepaymentAmount: offer.totalRepaymentAmount,
      amountRepaid: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      repaymentDeadline: deadlineDate.toISOString(),
    };

    // Update statuses
    req.status = 'ACCEPTED';
    req.acceptedOfferId = offer.id;
    offer.status = 'ACCEPTED';

    // Persist
    const allLoans: Loan[] = JSON.parse(localStorage.getItem(LOCAL_LOANS_KEY) || '[]');
    allLoans.push(loan);
    localStorage.setItem(LOCAL_LOANS_KEY, JSON.stringify(allLoans));
    localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(allReqs));

    const allOffers: LoanOffer[] = JSON.parse(localStorage.getItem(LOCAL_OFFERS_KEY) || '[]');
    const oIdx = allOffers.findIndex((o) => o.id === offer.id);
    if (oIdx !== -1) {
      allOffers[oIdx].status = 'ACCEPTED';
      localStorage.setItem(LOCAL_OFFERS_KEY, JSON.stringify(allOffers));
    }

    // Notify lender that offer was accepted
    await notificationService.sendNotification({
      userId: offer.lenderId,
      type: 'LOAN_OFFER_ACCEPTED',
      title: 'Loan Offer Accepted!',
      message: `${req.borrowerNickname} accepted your loan of ${offer.principalAmount} tokens.`,
      referenceId: loan.id,
    });

    return loan;
  },

  /**
   * Repay loan (supports full or partial repayment)
   */
  async repayLoan(loanId: string, repayAmount: number): Promise<Loan> {
    const allLoans: Loan[] = JSON.parse(localStorage.getItem(LOCAL_LOANS_KEY) || '[]');
    const loan = allLoans.find((l) => l.id === loanId);
    if (!loan) throw new Error('Loan not found.');

    if (loan.status === 'REPAID') {
      throw new Error('This loan has already been fully repaid.');
    }

    const remainingDue = loan.totalRepaymentAmount - loan.amountRepaid;
    if (repayAmount > remainingDue) {
      throw new Error(`Maximum amount due is ${remainingDue} tokens.`);
    }

    // 1. Deduct from borrower
    await walletService.recordTransaction({
      userId: loan.borrowerId,
      type: 'LOAN_REPAYMENT',
      amount: -repayAmount,
      description: `Loan repayment of ${repayAmount} tokens to ${loan.lenderNickname}`,
      referenceId: loan.id,
    });

    // 2. Transfer to lender
    await walletService.recordTransaction({
      userId: loan.lenderId,
      type: 'INTEREST_RECEIVED',
      amount: repayAmount,
      description: `Received repayment of ${repayAmount} tokens from ${loan.borrowerNickname}`,
      referenceId: loan.id,
    });

    loan.amountRepaid += repayAmount;
    if (loan.amountRepaid >= loan.totalRepaymentAmount) {
      loan.status = 'REPAID';
      loan.repaidAt = new Date().toISOString();

      // Update lender statistics (loansCompleted)
      const lenderProfile = await userService.getUserProfile(loan.lenderId);
      if (lenderProfile) {
        lenderProfile.statistics.loansCompleted += 1;
        const localUsers = JSON.parse(localStorage.getItem('paribet_mock_users') || '{}');
        localUsers[loan.lenderId] = lenderProfile;
        localStorage.setItem('paribet_mock_users', JSON.stringify(localUsers));
      }
    } else {
      loan.status = 'PARTIALLY_REPAID';
    }

    localStorage.setItem(LOCAL_LOANS_KEY, JSON.stringify(allLoans));

    // Notify lender
    await notificationService.sendNotification({
      userId: loan.lenderId,
      type: 'LOAN_REPAID',
      title: 'Loan Repayment Received',
      message: `${loan.borrowerNickname} repaid ${repayAmount} tokens (${loan.status}).`,
      referenceId: loan.id,
    });

    return loan;
  },

  /**
   * Get user loans (as borrower or lender)
   */
  async getUserLoans(userId: string): Promise<Loan[]> {
    const allLoans: Loan[] = JSON.parse(localStorage.getItem(LOCAL_LOANS_KEY) || '[]');
    return allLoans.filter((l) => l.borrowerId === userId || l.lenderId === userId);
  }
};

