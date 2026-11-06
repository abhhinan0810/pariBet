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
  Coins,
  Crown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CoinIcon } from '@/components/common/CoinIcon';
import { Card } from '@/components/common/Card';
import { Prediction } from '@/types/prediction';
import { predictionService } from '@/services/predictionService';
import { PredictionCard } from '@/components/predictions/PredictionCard';
import { ParticipateModal } from '@/components/predictions/ParticipateModal';
import { FinalizeModal } from '@/components/predictions/FinalizeModal';
import { DailyStreakModal } from '@/components/engagement/DailyStreakModal';
import { WeeklyJackpotBanner } from '@/components/engagement/WeeklyJackpotBanner';
import { TargetGapCalculator } from '@/components/engagement/TargetGapCalculator';
import { userService } from '@/services/userService';
import approvedStudentsSeed from '@/data/approved_students.json';

export const HomePage: React.FC = () => {
  const { user, refreshUserProfile } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [finalizingPrediction, setFinalizingPrediction] = useState<Prediction | null>(null);
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [topUsers, setTopUsers] = useState<any[]>([]);

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

    const fetchTopRankings = async () => {
      try {
        const users = await userService.getAllUsers();
        const map = new Map<string, any>();
        users.forEach((u) => {
          map.set(u.admissionNumber.toLowerCase(), {
            nickname: u.nickname || u.officialName.split(' ')[0],
            name: u.officialName,
            points: u.walletBalance,
            winRate: u.statistics?.winRate || 0,
            avatar: u.profilePicture,
          });
        });
        if (user && user.role !== 'admin' && user.admissionNumber !== 'ADMIN') {
          map.set(user.admissionNumber.toLowerCase(), {
            nickname: user.nickname,
            name: user.officialName,
            points: user.walletBalance,
            winRate: user.statistics?.winRate || 0,
            avatar: user.profilePicture,
          });
        }
        (approvedStudentsSeed as any[]).forEach((s) => {
          if (!map.has(s.admission_number.toLowerCase())) {
            map.set(s.admission_number.toLowerCase(), {
              nickname: s.official_name.split(' ')[0],
              name: s.official_name,
              points: 1000,
              winRate: 0,
              avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${s.admission_number}`,
            });
          }
        });
        const sorted = Array.from(map.values())
          .sort((a, b) => b.points - a.points)
          .slice(0, 4);
        setTopUsers(sorted);
      } catch (err) {
        console.warn('Failed to load top rankings:', err);
      }
    };
    fetchTopRankings();
  }, [user]);

  const walletBalance = user?.walletBalance || 0;
  const lockedBalance = user?.lockedBalance || 0;
  const totalEarned = user?.statistics.totalRewardsEarned || 0;
  const winRate = user?.statistics.winRate || 0;

  const activePredictions = predictions.filter((p) => p.status === 'OPEN').slice(0, 4);

  return (
    <div className="space-y-6 pb-20 lg:pb-10">
      {/* SECTION B: Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 p-4 sm:p-6 lg:p-8 shadow-card-glow">
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
                <span className="text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/25 px-2 py-0.5 rounded-full font-mono font-bold uppercase">{user?.role === 'admin' ? 'ADMIN' : 'MEMBER'}</span>
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
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setStreakModalOpen(true)}
              className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>Daily Rewards</span>
            </button>
            <Link
              to="/create"
              className="vip-gold-btn px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0 shadow-gold-glow"
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
        <Card variant="gold-border" className="p-4 relative hover:border-red-500/40">
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
        <Card variant="default" className="p-4 hover:border-red-500/30">
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
        <Card variant="default" className="p-4 hover:border-red-500/30">
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
        <Card variant="default" className="p-4 hover:border-red-500/30">
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

      {/* RETENTION MECHANICS: Target Gap Calculator & Friday Jackpot Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <TargetGapCalculator
            cutoffPoints={2900}
            cutoffHolderName="Phoenix (Abhinand)"
            userRank={7}
            userPoints={walletBalance}
          />
        </div>
        <div className="lg:col-span-5 flex flex-col justify-center">
          <WeeklyJackpotBanner />
        </div>
      </div>

      {/* SEMESTER 4 GRAND PRIZE BANNER — FULL MANDHI SPONSORED BY ABHINAV (VARKKALA/PARI) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-black/70 via-[#190a10]/65 to-black/70 backdrop-blur-2xl border-2 border-amber-400/35 p-4 sm:p-5 lg:p-6 shadow-[0_0_35px_rgba(245,158,11,0.15)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
          <div className="md:col-span-4 lg:col-span-3 flex items-center justify-center">
            <Link to="/leaderboard" className="relative w-full max-w-[210px] rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-xl group block">
              <img
                src="/assets/aistudio/Sponsored_Mandhi_Feast_Poster_e8b7457a.png"
                alt="Sem 4 Grand Prize Mandhi"
                className="w-full aspect-[4/3] sm:aspect-square object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono">
                <span className="text-amber-400 font-bold bg-black/85 px-2 py-0.5 rounded border border-amber-400/30">
                  🍗 FULL MANDHI
                </span>
                <span className="text-emerald-400 font-bold bg-black/85 px-2 py-0.5 rounded border border-emerald-400/30">
                  TOP 4
                </span>
              </div>
            </Link>
          </div>

          <div className="md:col-span-8 lg:col-span-9 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/25">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Semester 4 Grand Prize</span>
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-slate-300">
                Sponsored by <strong className="text-amber-400">Abhinav (Varkkala / Pari)</strong>
              </span>
            </div>

            <h2 className="font-display font-black text-lg sm:text-xl text-white">
              Race for the Grand Feast: <span className="gold-shimmer-text">Full Mandhi for Top 4</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              At the final wrap-up of Semester 4, the top 4 contenders holding the highest points will be treated to a full authentic chicken Mandhi platter with fragrant rice, dips, and sides!
            </p>

            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <Link
                to="/leaderboard"
                className="vip-gold-btn px-4 py-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-gold-glow"
              >
                <span>🍗 Check Mandhi Cutoff Standings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                Top 4 MCA Students Qualify
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED LIVE ARENA SHOWDOWN (dice-roll-showdown.jpg) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-black/45 via-[#180a0f]/40 to-black/45 backdrop-blur-2xl border border-red-500/25 p-5 sm:p-6 shadow-xl">
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
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-black/40 backdrop-blur-md border border-white/10 text-casino-muted hover:text-white shrink-0 hover:border-red-500/30 transition-all"
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* SECTION D: User Statistics Bar */}
      <div className="p-4 lg:p-5 rounded-2xl bg-black/35 backdrop-blur-xl border border-white/10 shadow-xl">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-casino-muted mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Your Performance Record</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-red-500/30 transition-all">
            <span className="text-[11px] text-casino-muted block">Participations</span>
            <span className="text-xl font-bold font-mono text-white">
              {user?.statistics.predictionsParticipated || 0}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-red-500/30 transition-all">
            <span className="text-[11px] text-casino-muted block">Predictions Won</span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              {user?.statistics.predictionsWon || 0}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-red-500/30 transition-all">
            <span className="text-[11px] text-casino-muted block">Win Rate</span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {winRate}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-red-500/30 transition-all">
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
                  onBetPlaced={fetchLivePredictions}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Top Champions & Bank Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-base sm:text-lg text-white flex items-center gap-1.5">
              <span className="text-base">🍗</span>
              <span>Top 4 Mandhi Qualifiers</span>
            </h2>
            <Link
              to="/leaderboard"
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-0.5"
            >
              <span>Full Ranks</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="casino-card p-4 space-y-2.5 border-white/10">
            {topUsers.map((item, idx) => {
              const rank = idx + 1;
              const isCutoff = rank === 4;
              return (
                <div
                  key={item.name + idx}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl backdrop-blur-sm border transition-all ${
                    isCutoff
                      ? 'bg-amber-400/5 border-amber-400/30 hover:border-amber-400/50'
                      : rank === 1
                      ? 'bg-white/[0.04] border-amber-500/35 hover:border-red-500/30'
                      : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`font-mono font-black text-xs sm:text-sm w-4 shrink-0 ${
                        rank <= 3 || isCutoff ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    >
                      #{rank}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs shrink-0 overflow-hidden">
                      {rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🍗'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-white leading-tight truncate">
                          {item.nickname}
                        </p>
                        {isCutoff && (
                          <span className="text-[9px] font-mono text-amber-400 font-bold bg-amber-400/20 px-1 rounded shrink-0">
                            CUTOFF
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-casino-muted leading-tight truncate font-sans">
                        {item.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-xs text-amber-400">
                      {item.points.toLocaleString()} PTS
                    </p>
                    <p className="text-[9px] text-emerald-400 font-mono">
                      {item.winRate}% Win
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Bank Shortcut Card */}
            <div className="mt-4 pt-3 border-t border-white/5 space-y-2.5">
              <Link
                to="/bank"
                className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/30 flex items-center justify-between hover:border-amber-400 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Token Bank Vault</span>
                    <span className="text-[10px] text-casino-muted">
                      Need emergency points? Request a peer bailout
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </Link>

              {/* LIVE ACTIVITY TICKER — THE TABLE IS MOVING */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    The Table is Moving
                  </span>
                  <Link to="/discover" className="text-[10px] text-amber-400 hover:underline font-mono">
                    Live Floor
                  </Link>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] text-white font-medium">
                        <strong className="text-amber-400">Anand M</strong> put 500 PTS on "Rahul Being 10m Late"
                      </p>
                      <span className="text-[9px] font-mono text-slate-400">2m ago • 2.6x Odds</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 shrink-0">
                      HIGH STAKE
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] text-white font-medium">
                        <strong className="text-rose-400">Sneha R</strong> hit a 4-win streak! (+1,250 PTS)
                      </p>
                      <span className="text-[9px] font-mono text-slate-400">5m ago • Hot Hand</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-rose-300 bg-rose-400/10 px-1.5 py-0.5 rounded border border-rose-400/20 shrink-0">
                      STREAK 🔥
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] text-white font-medium">
                        <strong className="text-sky-400">Abhinav K</strong> reclaimed #1 spot in Mandhi race
                      </p>
                      <span className="text-[9px] font-mono text-slate-400">25m ago • 5,450 PTS</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 shrink-0">
                      🍗 #1
                    </span>
                  </div>
                </div>
              </div>

              {/* LORE & PERSONALITIES SHORTCUT */}
              <Link
                to="/group"
                className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between hover:border-amber-400/40 transition-colors group block"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">👑</span>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors block">
                      Meet the High Rollers & Hall of Disasters
                    </span>
                    <span className="text-[10px] text-casino-muted">
                      Explore dynamic player archetypes & classroom upset lore
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
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

      <DailyStreakModal
        isOpen={streakModalOpen}
        onClose={() => setStreakModalOpen(false)}
        onRewardClaimed={() => refreshUserProfile()}
      />
    </div>
  );
};
