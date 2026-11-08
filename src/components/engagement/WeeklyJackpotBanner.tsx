import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Clock,
  Sparkles,
  Ticket,
  ChevronRight,
  X,
  Coins,
  Crown,
  Info,
  Gift,
  Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface WeeklyJackpotBannerProps {
  onOpenDetails?: () => void;
}

export const WeeklyJackpotBanner: React.FC<WeeklyJackpotBannerProps> = () => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  // Dynamic Friday 5:00 PM countdown
  const getFridayCountdown = () => {
    const now = new Date();
    const day = now.getDay();
    // 5 = Friday
    const daysUntilFriday = (5 - day + 7) % 7 || 7;
    const fridayTarget = new Date(now);
    fridayTarget.setDate(now.getDate() + daysUntilFriday);
    fridayTarget.setHours(17, 0, 0, 0);

    const diff = fridayTarget.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  // Estimate user's accumulated tickets based on predictions participated & activity
  const userTickets = Math.max(
    1,
    Math.floor(((user?.walletBalance || 1000) + (user?.statistics?.totalTokensCommitted || 0)) / 250)
  );

  return (
    <>
      <div className="h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-gradient-to-br from-black/60 via-[#180a18]/70 to-black/60 border-2 border-purple-500/35 p-4 sm:p-5 shadow-xl">
        {/* Top Header */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-lg shrink-0 text-purple-300 shadow">
                🎟️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/25">
                    FRIDAY CLASSROOM DRAW
                  </span>
                  <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1 font-bold">
                    <Clock className="w-3 h-3 text-amber-400" /> {getFridayCountdown()} left
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 flex items-center gap-1.5">
                  <span>Weekly Vault Pot:</span>
                  <strong className="text-amber-400 font-mono font-black">1,000 PTS 🪙</strong>
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="text-xs font-mono font-bold text-purple-300 hover:text-purple-200 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>Prize Tiers</span>
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Overview Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 text-center text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Your Entries</span>
              <span className="text-sm font-bold text-purple-300">
                {userTickets} Tickets 🎟️
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">1st Prize</span>
              <span className="text-sm font-bold text-amber-400">
                +400 PTS
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Winners</span>
              <span className="text-sm font-bold text-emerald-400 truncate block">
                7 Classmates
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Next Draw</span>
              <span className="text-sm font-bold text-slate-300">
                Fri 5:00 PM
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Rule Ribbon */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="truncate">
            • Top 3 + 4 Consolation winners • Keeps Mandhi race fair!
          </span>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="text-amber-400 hover:underline shrink-0 ml-2 font-bold cursor-pointer"
          >
            Tier Breakdown →
          </button>
        </div>
      </div>

      {/* DRAW DETAILS & TIERED PRIZES MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#0C0B14] border-2 border-purple-500/40 p-5 sm:p-6 relative space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-xl shrink-0 text-purple-300 shadow">
                  🎟️
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-white">
                    Friday Classroom Jackpot
                  </h3>
                  <p className="text-[10px] font-mono text-purple-300">
                    Drawn every Friday at 5:00 PM for all participating classmates
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pot Banner */}
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-1.5 text-center">
              <span className="text-xs font-mono text-purple-300 uppercase tracking-wider block font-bold">
                Weekly Vault Pot (1,000 PTS Total)
              </span>
              <div className="text-2xl font-mono font-black text-amber-400">
                7 Winners Every Friday 🪙
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Distributed across multiple tiers to reward active classmates with weekend betting bankrolls without giving an unfair leap in the Semester 4 Mandhi Race.
              </p>
            </div>

            {/* Tiered Payout Table */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase text-amber-400 block">
                Friday Payout Breakdown
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-amber-400/30 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span>🥇</span>
                    <span className="text-white font-bold">1st Ticket</span>
                  </div>
                  <span className="text-amber-400 font-bold">+400 PTS</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span>🥈</span>
                    <span className="text-white font-bold">2nd Ticket</span>
                  </div>
                  <span className="text-purple-300 font-bold">+250 PTS</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span>🥉</span>
                    <span className="text-white font-bold">3rd Ticket</span>
                  </div>
                  <span className="text-emerald-400 font-bold">+150 PTS</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span>🎟️</span>
                    <span className="text-slate-300">4 Lucky Picks</span>
                  </div>
                  <span className="text-slate-200 font-bold">+50 PTS each</span>
                </div>
              </div>
            </div>

            {/* Ticket Rules */}
            <div className="space-y-1.5 text-xs">
              <div className="font-mono font-bold text-amber-400 uppercase text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>How Tickets Work</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1 text-slate-300 text-[11px] font-mono">
                <p>• <strong>Every 100 PTS staked</strong> on predictions = 1 ticket automatically.</p>
                <p>• <strong>Daily Check-in Streaks</strong> grant free bonus tickets.</p>
                <p>• <strong>Daily Lucky Wheel</strong> spins occasionally award bonus tickets.</p>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(false)}
              className="w-full vip-gold-btn py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-gold-glow"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
