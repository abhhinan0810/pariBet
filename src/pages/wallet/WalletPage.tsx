import React, { useState, useEffect } from 'react';
import {
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Landmark,
  Shield,
  Filter,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CoinIcon } from '@/components/common/CoinIcon';
import { Card } from '@/components/common/Card';
import { Transaction, TransactionType } from '@/types/wallet';
import { walletService } from '@/services/walletService';

const FILTER_TABS: { label: string; value?: TransactionType }[] = [
  { label: 'All' },
  { label: 'Predictions', value: 'PREDICTION_COMMITMENT' },
  { label: 'Rewards', value: 'PREDICTION_REWARD' },
  { label: 'Refunds', value: 'PREDICTION_REFUND' },
  { label: 'Loans', value: 'LOAN_RECEIVED' },
  { label: 'Admin Adjustments', value: 'ADMINISTRATIVE_ADJUSTMENT' },
];

export const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<{ label: string; value?: TransactionType }>(
    FILTER_TABS[0]
  );
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) return;
    try {
      const data = await walletService.getUserTransactions(user.uid, selectedFilter.value);
      setTransactions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, selectedFilter]);

  const available = user?.walletBalance || 0;
  const locked = user?.lockedBalance || 0;
  const totalEarned = user?.statistics.totalRewardsEarned || 0;
  const totalCommitted = user?.statistics.totalTokensCommitted || 0;

  const getTxBadge = (type: TransactionType) => {
    switch (type) {
      case 'PREDICTION_REWARD':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PREDICTION_COMMITMENT':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'PREDICTION_REFUND':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'LOAN_GIVEN':
      case 'LOAN_REPAYMENT':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'LOAN_RECEIVED':
      case 'INTEREST_RECEIVED':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'ADMINISTRATIVE_ADJUSTMENT':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-gold/10 text-gold-highlight border-gold/20';
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="font-display font-black text-2xl lg:text-3xl text-white flex items-center gap-2">
          <WalletIcon className="w-6 h-6 text-gold-highlight" />
          <span>Virtual Token Wallet</span>
        </h1>
        <p className="text-sm text-casino-muted">
          Your authoritative classroom gaming point ledger and balance summary.
        </p>
      </div>

      {/* Main Luxury Wallet Card */}
      <Card variant="gold-border" className="p-6 sm:p-8 bg-gradient-to-br from-[#1C1C28] via-[#14141E] to-[#0E0E14] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-casino-muted mb-1 font-mono uppercase tracking-wider">
              <span>Authoritative Game Tokens</span>
              <span className="text-[10px] bg-gold/10 text-gold-highlight px-2 py-0.5 rounded font-mono">
                NON-MONETARY
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CoinIcon size={40} />
              <span className="font-mono font-black text-3xl sm:text-4xl text-white">
                {available.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-gold-highlight font-mono">PTS</span>
            </div>
            <p className="text-xs text-casino-muted mt-2 max-w-md">
              Tokens are strictly fictional classroom points for social prediction games. No real-world monetary value or cash deposits/withdrawals.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-xl bg-background-elevated border border-white/5 text-center">
              <span className="text-[10px] text-casino-muted block uppercase font-mono">
                Locked in Active Bets
              </span>
              <span className="font-mono font-bold text-lg text-amber-400">
                {locked.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-background-elevated border border-white/5 text-center">
              <span className="text-[10px] text-casino-muted block uppercase font-mono">
                Lifetime Rewards Won
              </span>
              <span className="font-mono font-bold text-lg text-emerald-400">
                +{totalEarned.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-background-card border border-white/5">
          <span className="text-[11px] text-casino-muted block">Total Tokens Committed</span>
          <span className="font-mono font-bold text-base text-white mt-1 block">
            {totalCommitted.toLocaleString()} PTS
          </span>
        </div>
        <div className="p-4 rounded-xl bg-background-card border border-white/5">
          <span className="text-[11px] text-casino-muted block">Outstanding Loans</span>
          <span className="font-mono font-bold text-base text-white mt-1 block">
            0 PTS
          </span>
        </div>
        <div className="p-4 rounded-xl bg-background-card border border-white/5">
          <span className="text-[11px] text-casino-muted block">Upcoming Repayments</span>
          <span className="font-mono font-bold text-base text-emerald-400 mt-1 block">
            0 PTS Due
          </span>
        </div>
        <div className="p-4 rounded-xl bg-background-card border border-white/5">
          <span className="text-[11px] text-casino-muted block">Wallet Standing</span>
          <span className="font-mono font-bold text-base text-gold-highlight mt-1 block">
            VIP Good Standing
          </span>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <Card variant="default" className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold-highlight" />
              <span>Authoritative Ledger</span>
            </h3>
            <p className="text-xs text-casino-muted mt-0.5">
              Complete immutable record of all token movements.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setSelectedFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedFilter.label === tab.label
                    ? 'bg-gold-gradient text-black font-bold shadow-gold-glow-sm'
                    : 'bg-background-elevated text-casino-muted hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger List */}
        {loading ? (
          <div className="p-12 text-center text-casino-muted">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading ledger...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-casino-muted bg-background-elevated rounded-xl">
            No transactions found for this filter.
          </div>
        ) : (
          <div className="space-y-2.5">
            {transactions.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl bg-background-elevated border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{tx.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${getTxBadge(
                            tx.type
                          )}`}
                        >
                          {tx.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-casino-muted font-mono">
                          {new Date(tx.createdAt).toLocaleDateString()} •{' '}
                          {new Date(tx.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-mono font-bold text-sm ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPositive ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()}{' '}
                      PTS
                    </p>
                    <p className="text-[10px] text-casino-muted font-mono">
                      Bal: {tx.balanceAfter.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
