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
  Crown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface WeeklyJackpotBannerProps {
  onOpenDetails?: () => void;
}

export const WeeklyJackpotBanner: React.FC<WeeklyJackpotBannerProps> = () => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  // Dynamic Friday 5:00 PM calculation
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

  const userTickets = Math.max(1, Math.floor((user?.walletBalance || 1000) / 250));

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/40 via-amber-950/30 to-black/60 border border-purple-500/30 p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-xl shrink-0 text-purple-300 shadow">
              🎟️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/25">
                  FRIDAY CLASSROOM DRAW
                </span>
                <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1 font-bold">
                  <Clock className="w-3 h-3" /> {getFridayCountdown()} left
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                <span>Classroom Vault Pot:</span>
                <span className="text-amber-400 font-mono font-black">6,800 PTS</span>
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-right">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Your Entries</span>
              <span className="text-xs font-mono font-bold text-purple-300">
                {userTickets} Tickets 🎟️
              </span>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="vip-gold-btn px-3 py-1.5 text-xs font-bold cursor-pointer whitespace-nowrap shadow-gold-glow flex items-center gap-1"
            >
              <span>Draw Info</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#0C0B14] border-2 border-purple-500/40 p-5 sm:p-6 relative space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎟️</span>
                <div>
                  <h3 className="font-display font-black text-base text-white">
                    Friday Classroom Jackpot
                  </h3>
                  <p className="text-[10px] font-mono text-purple-300">
                    Drawn every Friday at 5:00 PM for all active students
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-2 text-center">
              <span className="text-xs font-mono text-purple-300 uppercase tracking-wider block">
                Current Friday Prize Pot
              </span>
              <div className="text-3xl font-mono font-black text-amber-400">
                6,800 PTS 🪙
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Funded by 2% of all prediction turnover throughout the week. The winning ticket claims 100% of the pot!
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-mono font-bold text-amber-400 uppercase text-[11px]">
                How to Earn Tickets
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1 text-slate-300 text-[11px]">
                <p>• <strong>Every 100 PTS</strong> staked on any prediction = 1 automatic ticket.</p>
                <p>• <strong>Daily Check-in Streaks</strong> grant free bonus tickets.</p>
                <p>• <strong>Lucky Wheel spins</strong> occasionally hit ticket bundles.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">Last Friday Winner:</span>
              </div>
              <span className="font-mono font-bold text-amber-300">
                Alex Antony (+4,200 PTS)
              </span>
            </div>

            <button
              onClick={() => setModalOpen(false)}
              className="w-full vip-gold-btn py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
