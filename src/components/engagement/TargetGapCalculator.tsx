import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Calculator,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Crown,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Target,
  Flame
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { leaderboardService, MandhiRaceStats } from '@/services/leaderboardService';

interface TargetGapCalculatorProps {
  cutoffPoints?: number;
  cutoffHolderName?: string;
  rank5Points?: number;
  userRank?: number;
  userPoints?: number;
}

export const TargetGapCalculator: React.FC<TargetGapCalculatorProps> = ({
  cutoffPoints: propCutoffPoints,
  cutoffHolderName: propCutoffHolderName,
  rank5Points: propRank5Points,
  userRank: propUserRank,
  userPoints: propUserPoints,
}) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [simStake, setSimStake] = useState<number>(200);
  const [simOdds, setSimOdds] = useState<number>(2.4);

  // Live calculated stats
  const [liveStats, setLiveStats] = useState<MandhiRaceStats | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const stats = await leaderboardService.getMandhiRaceStats(user);
        if (isMounted) {
          setLiveStats(stats);
        }
      } catch (err) {
        console.warn('[TargetGapCalculator] Failed to load live race stats:', err);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [user, user?.walletBalance]);

  // Derive final values prioritizing props if passed from LeaderboardPage, falling back to liveStats
  const cutoffPoints = propCutoffPoints ?? liveStats?.cutoffPoints ?? 1000;
  const cutoffHolderName = propCutoffHolderName ?? liveStats?.cutoffHolderName ?? 'Seat #4 Qualifier';
  const rank5Points = propRank5Points ?? liveStats?.rank5Points ?? 1000;
  const userRank = propUserRank ?? liveStats?.userRank ?? 53;
  const userPoints = propUserPoints ?? liveStats?.userPoints ?? user?.walletBalance ?? 1000;

  const isAdmin = user?.role === 'admin' || user?.admissionNumber === 'ADMIN';
  const isQualifying = !isAdmin && userRank <= 4;
  
  // Deficit to claim Seat #4 (must exceed cutoff by at least 1 PT):
  const deficit = isQualifying ? 0 : Math.max(1, cutoffPoints - userPoints + 1);
  // Cushion over the first non-qualifier (Seat #5):
  const cushion = isQualifying ? Math.max(0, userPoints - rank5Points) : 0;

  // Simulation math
  const projectedProfit = Math.round(simStake * (simOdds - 1));
  const projectedTotal = userPoints + projectedProfit;
  const willQualifyWithSim = projectedTotal > cutoffPoints;
  const remainingDeficit = Math.max(0, deficit - projectedProfit);
  const additionalBetsNeeded = Math.ceil(remainingDeficit / Math.max(1, projectedProfit));

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-black/60 via-[#150a10]/70 to-black/60 border-2 border-amber-400/35 p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-lg shrink-0 text-amber-400 shadow-gold-glow-sm">
            🍗
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/25">
                MANDHI RACE CALCULATOR
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Sem 4 Grand Prize Cutoff
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
              {isAdmin ? (
                <span className="text-amber-400 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Master Administrator View • Cutoff at {cutoffPoints.toLocaleString()} PTS</span>
                </span>
              ) : isQualifying ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>You're in Seat #{userRank}! (+{cushion.toLocaleString()} PTS cushion)</span>
                </span>
              ) : (
                <span>
                  Gap to Mandhi Feast: <strong className="text-amber-400 font-mono font-black">{deficit.toLocaleString()} PTS</strong>
                </span>
              )}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Simulator' : 'What-If Simulator'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 text-center text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[10px] text-slate-400 block uppercase">Your Position</span>
          <span className={`text-sm font-bold ${isQualifying ? 'text-amber-400' : 'text-white'}`}>
            {isAdmin ? 'Admin View' : `Rank #${userRank} (${userPoints.toLocaleString()} PTS)`}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[10px] text-slate-400 block uppercase">Seat #4 Benchmark</span>
          <span className="text-sm font-bold text-amber-400">
            {cutoffPoints.toLocaleString()} PTS
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[10px] text-slate-400 block uppercase">Seat #4 Holder</span>
          <span className="text-sm font-bold text-slate-300 truncate block">
            {userRank === 4 ? 'You (Defending Cutoff)' : cutoffHolderName}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[10px] text-slate-400 block uppercase">Target Requirement</span>
          <span className={`text-sm font-bold ${isAdmin ? 'text-amber-400' : isQualifying ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isAdmin ? 'Top 4 Awarded' : isQualifying ? `Defend +${cushion.toLocaleString()} PTS` : `Need +${deficit.toLocaleString()} PTS`}
          </span>
        </div>
      </div>

      {/* WHAT-IF SIMULATOR EXPANSION */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulate Upcoming Classroom Wagers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stake Input */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Simulated Wager:</span>
                <span className="text-white font-bold">{simStake} PTS</span>
              </div>
              <input
                type="range"
                min={50}
                max={1000}
                step={50}
                value={simStake}
                onChange={(e) => setSimStake(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>50 PTS</span>
                <span>500 PTS</span>
                <span>1,000 PTS</span>
              </div>
            </div>

            {/* Odds Selector */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Outcome Multiplier:</span>
                <span className="text-amber-400 font-bold">{simOdds.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={1.2}
                max={5.0}
                step={0.1}
                value={simOdds}
                onChange={(e) => setSimOdds(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                <span>1.2x (Safe)</span>
                <span>2.5x (Even)</span>
                <span>5.0x (Underdog)</span>
              </div>
            </div>
          </div>

          {/* Outcome Result Card */}
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-mono text-slate-300">
                1 Winning Bet of <strong className="text-white">{simStake} PTS</strong> at <strong className="text-amber-400">{simOdds.toFixed(1)}x</strong> yields:
              </div>
              <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                +{projectedProfit.toLocaleString()} PTS Net Profit → Projected Total: {projectedTotal.toLocaleString()} PTS
              </div>
            </div>

            <div className="shrink-0">
              {isQualifying ? (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cushion +{(cushion + projectedProfit).toLocaleString()} PTS</span>
                </div>
              ) : willQualifyWithSim ? (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs flex items-center gap-1.5">
                  <span>🍗 Mandhi Seat Reached! (+{(projectedTotal - cutoffPoints).toLocaleString()} PTS)</span>
                </div>
              ) : (
                <div className="text-[11px] font-mono text-amber-300 text-right sm:text-left">
                  <span>Need +{remainingDeficit.toLocaleString()} more PTS</span>
                  <span className="block text-[10px] text-slate-400 font-normal">
                    ({additionalBetsNeeded} more win{additionalBetsNeeded === 1 ? '' : 's'} like this)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
