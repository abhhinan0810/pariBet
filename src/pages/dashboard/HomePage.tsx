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
  Landmark
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B1B26] via-[#14141E] to-[#0D0D12] border border-gold/20 p-6 lg:p-8 shadow-card-glow">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user?.profilePicture}
              alt={user?.nickname}
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-2 border-gold shadow-gold-glow-sm object-cover bg-background-elevated shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase tracking-widest text-gold-highlight font-semibold">
                  VIP Classroom Lounge
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                  VERIFIED
                </span>
              </div>
              <h1 className="font-display font-black text-2xl lg:text-3xl text-white">
                Welcome, {user?.nickname}
              </h1>
              <p className="text-xs lg:text-sm text-casino-muted mt-0.5">
                {user?.officialName} •{' '}
                <span className="font-mono text-gold-highlight uppercase">
                  {user?.admissionNumber}
                </span>
              </p>
            </div>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/create"
              className="casino-gold-button px-5 py-3 text-sm flex items-center gap-2 cursor-pointer shadow-gold-glow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Prediction</span>
            </Link>
            <Link
              to="/discover"
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-semibold transition-all"
            >
              Discover
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION A: Wallet Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* Available Tokens */}
        <Card variant="gold-border" className="p-4 relative">
          <div className="flex items-center justify-between text-xs text-casino-muted mb-2">
            <span>Available Tokens</span>
            <CoinIcon size={20} />
          </div>
          <div className="font-mono font-black text-2xl lg:text-3xl text-white tracking-tight">
            {walletBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-gold-highlight mt-1 font-sans">
            Ready to stake
          </div>
        </Card>

        {/* Locked Tokens */}
        <Card variant="default" className="p-4">
          <div className="flex items-center justify-between text-xs text-casino-muted mb-2">
            <span>Locked in Pools</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono font-black text-2xl lg:text-3xl text-white tracking-tight">
            {lockedBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-casino-muted mt-1">
            Committed in active bets
          </div>
        </Card>

        {/* Outstanding Loans */}
        <Card variant="default" className="p-4">
          <div className="flex items-center justify-between text-xs text-casino-muted mb-2">
            <span>Outstanding Loans</span>
            <Landmark className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="font-mono font-black text-2xl lg:text-3xl text-white tracking-tight">
            0
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Good standing</div>
        </Card>

        {/* Total Rewards Earned */}
        <Card variant="default" className="p-4">
          <div className="flex items-center justify-between text-xs text-casino-muted mb-2">
            <span>Lifetime Rewards</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono font-black text-2xl lg:text-3xl text-emerald-400 tracking-tight">
            +{totalEarned.toLocaleString()}
          </div>
          <div className="text-[11px] text-casino-muted mt-1">Tokens won</div>
        </Card>
      </div>

      {/* SECTION D: User Statistics Bar */}
      <div className="p-4 lg:p-5 rounded-2xl bg-background-card border border-white/5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-casino-muted mb-4 flex items-center gap-2">
          <Flame className="w-4 h-4 text-gold-highlight" />
          <span>Personal Battle Statistics</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
            <span className="text-xl font-bold font-mono text-gold-highlight">
              {winRate}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-background-elevated border border-white/5">
            <span className="text-[11px] text-casino-muted block">Streak</span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {user?.statistics.currentStreak || 0} W
            </span>
          </div>
        </div>
      </div>

      {/* SECTION C & E: Featured Predictions & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Predictions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-lg text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-highlight" />
              <span>Live Predictions</span>
            </h2>
            <Link
              to="/discover"
              className="text-xs font-semibold text-gold-highlight hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-casino-muted">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
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
              <Trophy className="w-4 h-4 text-gold-highlight" />
              <span>Top Champions</span>
            </h2>
            <Link
              to="/leaderboard"
              className="text-xs font-semibold text-gold-highlight hover:underline"
            >
              Full Ranks
            </Link>
          </div>

          <div className="casino-card p-4 space-y-3">
            {/* Rank 1 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gold/10 border border-gold/30">
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-sm text-gold-highlight w-4">
                  #1
                </span>
                <div className="w-8 h-8 rounded-full bg-background-elevated border border-gold flex items-center justify-center font-bold text-xs text-gold-highlight">
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
                <p className="font-mono font-bold text-xs text-gold-highlight">5,450 PTS</p>
                <p className="text-[9px] text-emerald-400">88% Win</p>
              </div>
            </div>

            {/* Rank 2 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-background-elevated border border-white/5">
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
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-background-elevated border border-white/5">
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
                className="p-3 rounded-xl bg-gradient-to-r from-indigo-950/40 to-background-elevated border border-indigo-500/20 flex items-center justify-between hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Landmark className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Token Bank</span>
                    <span className="text-[10px] text-casino-muted">
                      Need tokens? Request a peer loan
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
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
