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
      {/* SECTION B: Welcome Hero Banner (LoopBet & SP CAS style) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2B165E] via-[#1B103E] to-[#10092B] border border-brand-violet/30 p-6 lg:p-8 shadow-card-glow">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user?.profilePicture}
              alt={user?.nickname}
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl border-2 border-brand-violet shadow-brand-glow object-cover bg-background-elevated shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-brand-pink font-bold">
                  MCA VIP ARENA
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  VERIFIED
                </span>
              </div>
              <h1 className="font-display font-black text-2xl lg:text-3xl text-white">
                Welcome, {user?.nickname}
              </h1>
              <p className="text-xs lg:text-sm text-casino-muted mt-0.5">
                {user?.officialName} •{' '}
                <span className="font-mono text-brand-violet uppercase font-semibold">
                  {user?.admissionNumber}
                </span>
              </p>
            </div>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/create"
              className="casino-pink-button px-5 py-3 text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-pink-glow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Prediction</span>
            </Link>
            <Link
              to="/discover"
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs sm:text-sm font-semibold transition-all"
            >
              Discover
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION A: Wallet Summary Cards (Jackpotter & LoopBet inspired) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* Available Tokens */}
        <Card variant="gold-border" className="p-4 relative bg-gradient-to-br from-[#1E1242] to-[#120B2E]">
          <div className="flex items-center justify-between text-xs text-casino-muted mb-2">
            <span className="text-brand-violet font-bold text-[11px] uppercase tracking-wider">Available Balance</span>
            <CoinIcon size={20} />
          </div>
          <div className="font-mono font-black text-2xl lg:text-3xl text-white tracking-tight">
            {walletBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-brand-pink mt-1 font-semibold">
            Ready to stake
          </div>
        </Card>

        {/* Locked Tokens */}
        <Card variant="default" className="p-4">
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
        <Card variant="default" className="p-4">
          <div className="flex items-center justify-between text-xs text-casino-muted mb-2">
            <span className="font-semibold text-[11px] uppercase tracking-wider">Loan Status</span>
            <Landmark className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="font-mono font-black text-2xl lg:text-3xl text-white tracking-tight">
            0
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">Good standing</div>
        </Card>

        {/* Total Rewards Earned */}
        <Card variant="default" className="p-4">
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

      {/* Categories Bar (Jackpotter & SP CAS inspired) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Link
          to="/discover"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-violet/20 border border-brand-violet/40 text-brand-violet flex items-center gap-1.5 shrink-0 shadow-brand-glow"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>All Markets</span>
        </Link>
        {['College', 'Sports', 'Entertainment', 'Events', 'General'].map((cat) => (
          <Link
            key={cat}
            to={`/discover?category=${cat}`}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-background-card border border-white/5 text-casino-muted hover:text-white shrink-0 hover:border-brand-violet/30 transition-all"
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* SECTION D: User Statistics Bar */}
      <div className="p-4 lg:p-5 rounded-2xl bg-background-card border border-brand-violet/20">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-casino-muted mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-brand-pink" />
          <span>Your Performance Record</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-background-elevated border border-white/5">
            <span className="text-[11px] text-casino-muted block">Participations</span>
            <span className="text-xl font-bold font-mono text-white">
              {user?.statistics.predictionsParticipated || 0}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-background-elevated border border-white/5">
            <span className="text-[11px] text-casino-muted block">Predictions Won</span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              {user?.statistics.predictionsWon || 0}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-background-elevated border border-white/5">
            <span className="text-[11px] text-casino-muted block">Win Rate</span>
            <span className="text-xl font-bold font-mono text-brand-violet">
              {winRate}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-background-elevated border border-white/5">
            <span className="text-[11px] text-casino-muted block">Winning Streak</span>
            <span className="text-xl font-bold font-mono text-brand-pink">
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
              className="text-xs font-bold text-brand-violet hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-casino-muted">
              <div className="w-8 h-8 border-2 border-brand-violet border-t-transparent rounded-full animate-spin mx-auto mb-2" />
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
              <Trophy className="w-4 h-4 text-brand-violet" />
              <span>Classroom Top 3</span>
            </h2>
            <Link
              to="/leaderboard"
              className="text-xs font-bold text-brand-pink hover:underline"
            >
              Full Ranks
            </Link>
          </div>

          <div className="casino-card p-4 space-y-3 border-brand-violet/20">
            {/* Rank 1 */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-brand-violet/20 to-transparent border border-brand-violet/40">
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-sm text-brand-pink w-4">
                  #1
                </span>
                <div className="w-8 h-8 rounded-full bg-background-elevated border border-brand-violet flex items-center justify-center font-bold text-xs text-brand-violet">
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
                <p className="font-mono font-bold text-xs text-brand-violet">5,450 PTS</p>
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
