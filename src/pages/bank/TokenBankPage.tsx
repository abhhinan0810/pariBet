import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  Handshake,
  PlusCircle,
  Coins,
  X,
  Sparkles
} from 'lucide-react';
import { LoanRequest, LoanOffer, Loan } from '@/types/loan';
import { loanService } from '@/services/loanService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { CoinIcon } from '@/components/common/CoinIcon';
import { Card } from '@/components/common/Card';

export const TokenBankPage: React.FC = () => {
  const { user, refreshUserProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<'marketplace' | 'my_loans'>('marketplace');
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [myLoans, setMyLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequestForOffer, setSelectedRequestForOffer] = useState<LoanRequest | null>(null);
  const [selectedLoanForRepay, setSelectedLoanForRepay] = useState<Loan | null>(null);

  // Request Form
  const [reqAmount, setReqAmount] = useState<number>(300);
  const [reqInterest, setReqInterest] = useState<number>(10);
  const [reqDays, setReqDays] = useState<number>(7);
  const [reqDesc, setReqDesc] = useState<string>('');

  // Offer Form
  const [offerPrincipal, setOfferPrincipal] = useState<number>(300);
  const [offerInterest, setOfferInterest] = useState<number>(10);
  const [offerDays, setOfferDays] = useState<number>(7);
  const [offerMsg, setOfferMsg] = useState<string>('');

  // Repay Form
  const [repayAmount, setRepayAmount] = useState<number>(0);

  const [submitting, setSubmitting] = useState(false);

  const fetchBankData = async () => {
    if (!user) return;
    try {
      const allReqs = await loanService.getLoanRequests();
      const userLoans = await loanService.getUserLoans(user.uid);
      setRequests(allReqs);
      setMyLoans(userLoans);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankData();
  }, [user]);

  // Handle Request Submit
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      await loanService.createLoanRequest({
        borrowerId: user.uid,
        borrowerNickname: user.nickname,
        borrowerOfficialName: user.officialName,
        borrowerAvatar: user.profilePicture,
        amount: reqAmount,
        maxInterestRate: reqInterest,
        requestedRepaymentDays: reqDays,
        description: reqDesc,
      });

      success('Loan Request Published', `Requested ${reqAmount} tokens on the classroom market.`);
      setShowRequestModal(false);
      setReqDesc('');
      await fetchBankData();
    } catch (err: any) {
      toastError('Request Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Offer Submit
  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedRequestForOffer) return;

    setSubmitting(true);
    try {
      await loanService.submitOffer({
        requestId: selectedRequestForOffer.id,
        lenderId: user.uid,
        lenderNickname: user.nickname,
        lenderOfficialName: user.officialName,
        lenderAvatar: user.profilePicture,
        principalAmount: offerPrincipal,
        flatInterestRate: offerInterest,
        repaymentDeadlineDays: offerDays,
        message: offerMsg,
      });

      success('Offer Sent!', `Offered ${offerPrincipal} tokens at ${offerInterest}% interest.`);
      setSelectedRequestForOffer(null);
      setOfferMsg('');
      await fetchBankData();
    } catch (err: any) {
      toastError('Offer Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Repay Submit
  const handleRepay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedLoanForRepay) return;

    if (repayAmount > user.walletBalance) {
      toastError('Insufficient Balance', 'You do not have enough tokens in your wallet.');
      return;
    }

    setSubmitting(true);
    try {
      await loanService.repayLoan(selectedLoanForRepay.id, repayAmount);
      await refreshUserProfile();
      success('Repayment Processed', `Repaid ${repayAmount} tokens successfully.`);
      setSelectedLoanForRepay(null);
      await fetchBankData();
    } catch (err: any) {
      toastError('Repayment Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl lg:text-3xl text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-gold-highlight" />
            <span>Token Bank & Peer Lending</span>
          </h1>
          <p className="text-sm text-casino-muted">
            Fictional token loans between classmates with simple flat interest.
          </p>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="casino-gold-button px-4 py-2.5 text-xs font-bold inline-flex items-center gap-2 self-start cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Request Token Loan</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'marketplace'
              ? 'bg-gold/15 text-gold-highlight border border-gold/30'
              : 'text-casino-muted hover:text-white'
          }`}
        >
          Open Loan Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('my_loans')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'my_loans'
              ? 'bg-gold/15 text-gold-highlight border border-gold/30'
              : 'text-casino-muted hover:text-white'
          }`}
        >
          My Loans ({myLoans.length})
        </button>
      </div>

      {/* Tab 1: Marketplace of Requests */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <Card variant="default" className="p-12 text-center text-casino-muted">
              <Handshake className="w-10 h-10 text-gold-highlight mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-white">No Open Loan Requests</p>
              <p className="text-xs text-casino-muted mt-1">All classroom loans are funded or closed.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((req) => {
                const isOwn = req.borrowerId === user?.uid;
                return (
                  <Card key={req.id} variant="interactive" className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{req.borrowerNickname}</span>
                          <span className="text-[10px] text-casino-muted">{req.borrowerOfficialName}</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/10 text-gold-highlight">
                          {req.requestedRepaymentDays} DAYS
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-background-elevated border border-white/5 mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-casino-muted">Requested Amount</span>
                          <div className="flex items-center gap-1.5 font-mono font-bold text-base text-white">
                            <CoinIcon size={18} />
                            <span>{req.amount} PTS</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-casino-muted">Max Flat Interest</span>
                          <span className="font-mono text-gold-highlight font-bold">
                            {req.maxInterestRate}%
                          </span>
                        </div>
                      </div>

                      {req.description && (
                        <p className="text-xs text-casino-muted italic mb-4">
                          "{req.description}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-casino-muted font-mono">
                        {req.offersCount} offer(s)
                      </span>
                      {isOwn ? (
                        <span className="text-xs text-casino-muted px-2.5 py-1 rounded bg-white/5 font-mono">
                          Your Request
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedRequestForOffer(req);
                            setOfferPrincipal(req.amount);
                            setOfferInterest(req.maxInterestRate);
                            setOfferDays(req.requestedRepaymentDays);
                          }}
                          className="casino-gold-button px-3.5 py-1.5 text-xs font-bold cursor-pointer"
                        >
                          Offer Loan
                        </button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Loans (Given & Borrowed) */}
      {activeTab === 'my_loans' && (
        <div className="space-y-4">
          {myLoans.length === 0 ? (
            <Card variant="default" className="p-12 text-center text-casino-muted">
              <Landmark className="w-10 h-10 text-gold-highlight mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-white">No Active Loans</p>
              <p className="text-xs text-casino-muted mt-1">You have no active borrowings or funded loans.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myLoans.map((loan) => {
                const isBorrower = loan.borrowerId === user?.uid;
                const remaining = loan.totalRepaymentAmount - loan.amountRepaid;
                return (
                  <Card key={loan.id} variant="gold-border" className="p-5">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        loan.status === 'REPAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {isBorrower ? 'YOU BORROWED' : 'YOU FUNDED'} • {loan.status}
                      </span>
                      <span className="text-casino-muted font-mono text-[11px]">
                        Due: {new Date(loan.repaymentDeadline).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-background-elevated border border-white/5 space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-casino-muted">
                          {isBorrower ? `Lender: ${loan.lenderNickname}` : `Borrower: ${loan.borrowerNickname}`}
                        </span>
                        <span className="font-mono text-white font-bold">{loan.principalAmount} PTS Principal</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-casino-muted">Flat Interest ({loan.flatInterestRate}%)</span>
                        <span className="font-mono text-gold-highlight">+{loan.interestAmount} PTS</span>
                      </div>
                      <div className="flex justify-between text-xs pt-2 border-t border-white/5 font-bold">
                        <span className="text-white">Total Repayment:</span>
                        <span className="font-mono text-emerald-400">{loan.totalRepaymentAmount} PTS</span>
                      </div>
                      <div className="flex justify-between text-xs text-casino-muted">
                        <span>Amount Repaid:</span>
                        <span className="font-mono text-white">{loan.amountRepaid} / {loan.totalRepaymentAmount} PTS</span>
                      </div>
                    </div>

                    {isBorrower && loan.status !== 'REPAID' && (
                      <button
                        onClick={() => {
                          setSelectedLoanForRepay(loan);
                          setRepayAmount(remaining);
                        }}
                        className="w-full casino-gold-button py-2 text-xs font-bold cursor-pointer"
                      >
                        Repay Loan ({remaining} Tokens Due)
                      </button>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Create Loan Request */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md casino-card border-gold/30 p-6 relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-gold-highlight" />
                  <span>Request Virtual Tokens</span>
                </h3>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="p-1 rounded-lg text-casino-muted hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-casino-muted mb-1.5">
                    Amount (Max 2,000 Tokens)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={2000}
                    required
                    value={reqAmount}
                    onChange={(e) => setReqAmount(Number(e.target.value))}
                    className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-casino-muted mb-1.5">
                      Max Flat Interest %
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      required
                      value={reqInterest}
                      onChange={(e) => setReqInterest(Number(e.target.value))}
                      className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-casino-muted mb-1.5">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      required
                      value={reqDays}
                      onChange={(e) => setReqDays(Number(e.target.value))}
                      className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-casino-muted mb-1.5">
                    Reason / Purpose (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    placeholder="e.g. Backing our batch cricket match"
                    value={reqDesc}
                    onChange={(e) => setReqDesc(e.target.value)}
                    className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full casino-gold-button py-3 text-xs font-bold cursor-pointer"
                >
                  {submitting ? 'Publishing...' : 'Publish Loan Request'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Offer Loan to Classmate */}
      <AnimatePresence>
        {selectedRequestForOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md casino-card border-gold/30 p-6 relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-gold-highlight" />
                  <span>Offer Loan to {selectedRequestForOffer.borrowerNickname}</span>
                </h3>
                <button
                  onClick={() => setSelectedRequestForOffer(null)}
                  className="p-1 rounded-lg text-casino-muted hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendOffer} className="space-y-4">
                <div className="p-3 rounded-xl bg-background-elevated border border-white/5 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-casino-muted">Requested:</span>
                    <span className="font-mono text-white font-bold">{selectedRequestForOffer.amount} PTS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-casino-muted">Your Wallet Balance:</span>
                    <span className="font-mono text-gold-highlight font-bold">
                      {user?.walletBalance.toLocaleString()} PTS
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-casino-muted mb-1.5">
                      Principal (Tokens)
                    </label>
                    <input
                      type="number"
                      required
                      min={50}
                      max={user?.walletBalance || 1000}
                      value={offerPrincipal}
                      onChange={(e) => setOfferPrincipal(Number(e.target.value))}
                      className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-casino-muted mb-1.5">
                      Flat Interest %
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={50}
                      value={offerInterest}
                      onChange={(e) => setOfferInterest(Number(e.target.value))}
                      className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="flex justify-between font-bold text-white">
                    <span>You will receive back:</span>
                    <span className="font-mono text-emerald-400">
                      {offerPrincipal + Math.round((offerPrincipal * offerInterest) / 100)} PTS
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || offerPrincipal > (user?.walletBalance || 0)}
                  className="w-full casino-gold-button py-3 text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting Offer...' : 'Send Loan Offer'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Repay Loan */}
      <AnimatePresence>
        {selectedLoanForRepay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md casino-card border-gold/30 p-6 relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-gold-highlight" />
                  <span>Repay Loan to {selectedLoanForRepay.lenderNickname}</span>
                </h3>
                <button
                  onClick={() => setSelectedLoanForRepay(null)}
                  className="p-1 rounded-lg text-casino-muted hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRepay} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-background-elevated border border-white/5 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-casino-muted">Remaining Balance Due:</span>
                    <span className="font-mono text-rose-400 font-bold">
                      {selectedLoanForRepay.totalRepaymentAmount - selectedLoanForRepay.amountRepaid} PTS
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-casino-muted">Your Available Balance:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {user?.walletBalance.toLocaleString()} PTS
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-casino-muted mb-1.5">
                    Repayment Amount (Tokens)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={selectedLoanForRepay.totalRepaymentAmount - selectedLoanForRepay.amountRepaid}
                    required
                    value={repayAmount}
                    onChange={(e) => setRepayAmount(Number(e.target.value))}
                    className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || repayAmount <= 0}
                  className="w-full casino-gold-button py-3 text-xs font-bold cursor-pointer"
                >
                  {submitting ? 'Processing...' : `Confirm Repayment (${repayAmount} Tokens)`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
