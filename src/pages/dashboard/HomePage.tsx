import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  PlusCircle,
  Trophy,
  ArrowRight,
  Flame,
  Clock,
  Landmark,
  Compass,
  Coins
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CoinIcon } from '@/components/common/CoinIcon';
import { Card } from '@/components/common/Card';
import { Prediction } from '@/types/prediction';
import { predictionService } from '@/services/predictionService';
import { PredictionCard } from '@/components/predictions/PredictionCard';
import { ParticipateModal } from '@/components/predictions/ParticipateModal';
import { FinalizeModal } from '@/components/predictions/FinalizeModal';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [finalizingPrediction, setFinalizingPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLivePredictions = async () => {
    try {
      const data = await predictionService.getPredictions();
      setPredictions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePredictions();
  }, []);

  const walletBalance = user?.walletBalance || 0;
  const lockedBalance = user?.lockedBalance || 0;
  const totalEarned = user?.statistics.totalRewardsEarned || 0;
  const winRate = user?.statistics.winRate || 0;

  const activePredictions = predictions.filter((p) => p.status === 'OPEN').slice(0, 4);

  return (
    <div className="space-y-6 pb-20 lg:pb-10">
      {/* SECTION B: Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0E0F15] border border-white/10 p-6 lg:p-8 shadow-card-glow">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user?.profilePicture}
              alt={user?.nickname}
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl border-2 border-amber-400/40 shadow-gold-glow object-cover bg-background-elevated shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  pariBET VIP ARENA
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-bold">
                  VERIFIED
                </span>
              </div>
              <h1 className="font-display font-black text-2xl lg:text-3xl text-white">
                Welcome, {user?.nickname}
              </h1>
              <p className="text-xs lg:text-sm text-casino-muted mt-0.5">
                {user?.officialName} •{' '}
                <span className="font-mono text-amber-400 uppercase font-semibold">
                  {user?.admissionNumber}
                </span>
              </p>
            </div>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/create"
              className="vip-gold-btn px-5 py-3 text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-black" />
              <span>New Prediction</span>
            </Link>
            <Link
              to="/discover"
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs sm:text-sm font-semibold transition-all"
            >
              Discover
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION A: Wallet Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* Available Tokens */}
        <Card variant="gold-border" className="p-4 relative bg-[#12131A] border-amber-500/25">
          <div className="flex items-center justify-between text-xs text-casino-muted mb-2">
            <span className="text-amber-400 font-bold text-[11px] uppercase tracking-wider">Available Balance</span>
            <CoinIcon size={20} />
          </div>
          <div className="font-mono font-black text-2xl lg:text-3xl text-white tracking-tight">
            {walletBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-400 mt-1 font-semibold">
            Ready to stake
          </div>
        </Card>

        {/* Locked Tokens */}
        <Card variant="default" className="p-4 bg-[#0E0F15] border-white/5">
          <div className="flex items-center justify-between text-xs text-casino-muted mb-2">
            <span className="font-semibold text-[11px] uppercase tracking-wider">Locked in Pools</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono font-black text-2xl lg:text-3xl text-white tracking-tight">
            {lockedBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-casino-muted mt-1">
            Active commitments
          </div>
        </Card>

        {/* Outstanding Loans */}
        <Card variant="default" className="p-4 bg-[#0E0F15] border-white/5">
          <div className="flex items-center justify-between text-xs text-casino-muted mb-2">
            <span className="font-semibold text-[11px] uppercase tracking-wider">Loan Status</span>
            <Landmark className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono font-black text-2xl lg:text-3xl text-white tracking-tight">
            0
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">Good standing</div>
        </Card>

        {/* Total Rewards Earned */}
        <Card variant="default" className="p-4 bg-[#0E0F15] border-white/5">
          <div className="flex items-center justify-between text-xs text-casino-muted mb-2">
            <span className="font-semibold text-[11px] uppercase tracking-wider">Total Rewards</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono font-black text-2xl lg:text-3xl text-emerald-400 tracking-tight">
            +{totalEarned.toLocaleString()}
          </div>
          <div className="text-[11px] text-casino-muted mt-1">Coins won</div>
        </Card>
      </div>

      {/* FEATURED LIVE ARENA SHOWDOWN (dice-roll-showdown.jpg) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C0D13] to-[#14151F] border border-amber-500/20 p-5 sm:p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 lg:col-span-4 relative flex items-center justify-center">
            <div className="relative w-full max-w-[260px] aspect-square rounded-2xl overflow-hidden border border-white/10 group shadow-xl">
              <img
                src="/images/dice-roll-showdown.jpg"
                alt="Live Craps Arena"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D13]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono">
                <span className="text-amber-400 font-bold bg-[#07080B]/90 px-2.5 py-1 rounded-lg border border-amber-400/20 backdrop-blur-md">
                  FEATURED ARENA
                </span>
                <span className="text-emerald-400 font-bold bg-[#07080B]/90 px-2.5 py-1 rounded-lg border border-emerald-400/20 backdrop-blur-md">
                  LIVE ACTION
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-8 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Campus Main Event
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-slate-400 font-medium">All 53 Classmates Eligible</span>
            </div>
            <h2 className="font-display font-black text-xl lg:text-2xl text-white">
              Roll The Dice on Tomorrow's Big Outcomes
            </h2>
            <p className="text-xs lg:text-sm text-slate-400 leading-relaxed max-w-xl">
              Turn everyday classroom banter into high-stakes pari-mutuel showdowns. Predict lab surprises, sports finals, or seminar dates before the pool locks.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Link
                to="/create"
                className="vip-gold-btn px-4 py-2 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-black" />
                <span>Launch Prediction</span>
              </Link>
              <Link
                to="/discover"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold transition-all"
              >
                Explore Active Pools
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Link
          to="/discover"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400/10 border border-amber-400/25 text-amber-400 flex items-center gap-1.5 shrink-0"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>All Markets</span>
        </Link>
        {['College', 'Sports', 'Entertainment', 'Events', 'General'].map((cat) => (
          <Link
            key={cat}
            to={`/discover?category=${cat}`}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0E0F15] border border-white/5 text-casino-muted hover:text-white shrink-0 hover:border-amber-400/30 transition-all"
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* SECTION D: User Statistics Bar */}
      <div className="p-4 lg:p-5 rounded-2xl bg-[#0E0F15] border border-white/5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-casino-muted mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Your Performance Record</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-[#12131A] border border-white/5">
            <span className="text-[11px] text-casino-muted block">Participations</span>
            <span className="text-xl font-bold font-mono text-white">
              {user?.statistics.predictionsParticipated || 0}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#12131A] border border-white/5">
            <span className="text-[11px] text-casino-muted block">Predictions Won</span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              {user?.statistics.predictionsWon || 0}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#12131A] border border-white/5">
            <span className="text-[11px] text-casino-muted block">Win Rate</span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {winRate}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#12131A] border border-white/5">
            <span className="text-[11px] text-casino-muted block">Winning Streak</span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {user?.statistics.currentStreak || 0} W
            </span>
          </div>
        </div>
      </div>

      {/* SECTION C & E: Live Predictions & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Predictions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-lg text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-pink" />
              <span>Live Predictions</span>
            </h2>
            <Link
              to="/discover"
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-casino-muted">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Loading predictions...</span>
            </div>
          ) : activePredictions.length === 0 ? (
            <div className="p-8 text-center text-casino-muted casino-card">
              No active predictions available. Be the first to create one!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePredictions.map((pred) => (
                <PredictionCard
                  key={pred.id}
                  prediction={pred}
                  currentUserId={user?.uid}
                  isAdmin={user?.role === 'admin'}
                  onParticipate={(p) => setSelectedPrediction(p)}
                  onFinalize={(p) => setFinalizingPrediction(p)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Top Champions & Bank Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-lg text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Classroom Top 3</span>
            </h2>
            <Link
              to="/leaderboard"
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              Full Ranks
            </Link>
          </div>

          <div className="casino-card p-4 space-y-3 border-white/5">
            {/* Rank 1 */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#12131A] border border-amber-500/30">
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-sm text-amber-400 w-4">
                  #1
                </span>
                <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400 flex items-center justify-center font-bold text-xs text-amber-400">
                  👑
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Shadow</p>
                  <p className="text-[10px] text-casino-muted leading-tight">
                    Abhinav Krishna S
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-xs text-amber-400">5,450 PTS</p>
                <p className="text-[9px] text-emerald-400">88% Win</p>
              </div>
            </div>

            {/* Rank 2 */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-background-elevated border border-white/5">
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-sm text-casino-muted w-4">
                  #2
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">
                  🥈
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Viper</p>
                  <p className="text-[10px] text-casino-muted leading-tight">Adarsh S</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-xs text-white">4,120 PTS</p>
                <p className="text-[9px] text-emerald-400">75% Win</p>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-background-elevated border border-white/5">
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-sm text-casino-muted w-4">
                  #3
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">
                  🥉
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Oracle</p>
                  <p className="text-[10px] text-casino-muted leading-tight">Afna S Thaha</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-xs text-white">3,890 PTS</p>
                <p className="text-[9px] text-emerald-400">71% Win</p>
              </div>
            </div>

            {/* Bank Shortcut Card */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <Link
                to="/bank"
                className="p-3 rounded-xl bg-gradient-to-r from-brand-violet/15 to-transparent border border-brand-violet/30 flex items-center justify-between hover:border-brand-violet transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Landmark className="w-4 h-4 text-brand-cyan" />
                  <div>
                    <span className="text-xs font-bold text-white block">Token Bank</span>
                    <span className="text-[10px] text-casino-muted">
                      Need tokens? Request a peer loan
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-brand-cyan" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ParticipateModal
        prediction={selectedPrediction}
        onClose={() => setSelectedPrediction(null)}
        onSuccess={fetchLivePredictions}
      />

      <FinalizeModal
        prediction={finalizingPrediction}
        onClose={() => setFinalizingPrediction(null)}
        onSuccess={fetchLivePredictions}
      />
    </div>
  );
};
