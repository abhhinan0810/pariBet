import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Flame,
  Sparkles,
  Coins,
  Gift,
  CheckCircle2,
  Dice5,
  PartyPopper,
  Calendar,
  Zap,
  RotateCw,
  Crown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { walletService } from '@/services/walletService';

interface DailyStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed?: (pts: number) => void;
}

const STREAK_REWARDS = [
  { day: 1, pts: 50, label: 'Day 1' },
  { day: 2, pts: 100, label: 'Day 2' },
  { day: 3, pts: 150, label: 'Day 3' },
  { day: 4, pts: 200, label: 'Day 4' },
  { day: 5, pts: 250, label: 'Day 5' },
  { day: 6, pts: 350, label: 'Day 6' },
  { day: 7, pts: 600, label: 'Day 7 VIP', isSpecial: true },
];

const WHEEL_PRIZES = [
  { label: '+50 PTS', pts: 50, color: '#F59E0B' },
  { label: '+100 PTS', pts: 100, color: '#10B981' },
  { label: '+250 PTS', pts: 250, color: '#3B82F6' },
  { label: '🎟️ JACKPOT TICKET', pts: 75, color: '#8B5CF6', isTicket: true },
  { label: '+500 PTS', pts: 500, color: '#EC4899', isJackpot: true },
  { label: '+75 PTS', pts: 75, color: '#F59E0B' },
  { label: '+150 PTS', pts: 150, color: '#10B981' },
  { label: '👑 2x MULTIPLIER', pts: 200, color: '#EAB308', isSpecial: true },
];

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
}) => {
  const { user } = useAuth();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState<'STREAK' | 'WHEEL'>('STREAK');
  const [streakDays, setStreakDays] = useState<number>(3);
  const [checkedInToday, setCheckedInToday] = useState<boolean>(false);
  const [wheelSpunToday, setWheelSpunToday] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelResult, setWheelResult] = useState<typeof WHEEL_PRIZES[0] | null>(null);

  // Load persistence
  useEffect(() => {
    const todayStr = new Date().toDateString();
    const lastCheckIn = localStorage.getItem('paribet_last_checkin_date');
    const savedStreak = parseInt(localStorage.getItem('paribet_streak_days') || '3', 10);
    const lastWheelSpin = localStorage.getItem('paribet_last_wheel_date');

    setStreakDays(savedStreak);
    setCheckedInToday(lastCheckIn === todayStr);
    setWheelSpunToday(lastWheelSpin === todayStr);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaimDailyCheckIn = async () => {
    if (checkedInToday || !user) return;

    const nextStreak = streakDays >= 7 ? 1 : streakDays + 1;
    const rewardPts = STREAK_REWARDS[streakDays - 1]?.pts || 100;
    const todayStr = new Date().toDateString();

    try {
      await walletService.recordTransaction({
        userId: user.uid,
        type: 'DAILY_LOGIN_REWARD',
        amount: rewardPts,
        description: `Day ${streakDays} Daily Check-In Reward (+${rewardPts} PTS)`,
        metadata: { streakDays }
      });

      localStorage.setItem('paribet_last_checkin_date', todayStr);
      localStorage.setItem('paribet_streak_days', nextStreak.toString());

      setStreakDays(nextStreak);
      setCheckedInToday(true);

      success(
        'Daily Streak Reward Claimed!',
        `Earned +${rewardPts} PTS for Day ${streakDays} classroom check-in.`
      );
      if (onRewardClaimed) onRewardClaimed(rewardPts);
    } catch (err: any) {
      console.error('Failed to claim daily reward:', err);
    }
  };

  const handleSpinLuckyWheel = () => {
    if (wheelSpunToday || isSpinning || !user) return;

    setIsSpinning(true);
    setWheelResult(null);

    setTimeout(async () => {
      const selectedIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
      const prize = WHEEL_PRIZES[selectedIndex];
      const todayStr = new Date().toDateString();

      try {
        if (prize.pts > 0) {
          await walletService.recordTransaction({
            userId: user.uid,
            type: 'LUCKY_WHEEL_REWARD',
            amount: prize.pts,
            description: `Daily Lucky Wheel: ${prize.label}`,
            metadata: { prizeLabel: prize.label }
          });
        }

        localStorage.setItem('paribet_last_wheel_date', todayStr);

        setWheelResult(prize);
        setWheelSpunToday(true);
        setIsSpinning(false);

        success(
          'Lucky Wheel Prize Won!',
          `You won ${prize.label}! Added to your classroom balance.`
        );
        if (onRewardClaimed) onRewardClaimed(prize.pts);
      } catch (err: any) {
        console.error('Failed to credit wheel prize:', err);
        setIsSpinning(false);
      }
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl bg-[#0B0C12] border-2 border-amber-400/40 p-5 sm:p-6 relative max-h-[92vh] overflow-y-auto shadow-2xl space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-white">
                Daily Rewards & Lucky Wheel
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Log in daily to earn PTS & Friday jackpot entries
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('STREAK')}
            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'STREAK'
                ? 'bg-amber-500 text-black shadow-gold-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>7-Day Streak ({streakDays}d)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('WHEEL')}
            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'WHEEL'
                ? 'bg-amber-500 text-black shadow-gold-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dice5 className="w-3.5 h-3.5" />
            <span>Daily Wheel ({wheelSpunToday ? 'Done' : '1 Spin'})</span>
          </button>
        </div>

        {/* TAB 1: 7-DAY STREAK TRACKER */}
        {activeTab === 'STREAK' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-amber-400/25 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400">
                  Current Streak
                </span>
                <div className="text-xl font-mono font-black text-white flex items-center gap-1.5">
                  <span>{streakDays} Days Strong</span>
                  <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">Next Unlock</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  +{STREAK_REWARDS[streakDays]?.pts || 600} PTS
                </span>
              </div>
            </div>

            {/* 7-Day Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {STREAK_REWARDS.map((item) => {
                const isClaimed = item.day < streakDays || (item.day === streakDays && checkedInToday);
                const isCurrent = item.day === streakDays && !checkedInToday;

                return (
                  <div
                    key={item.day}
                    className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-between min-h-[90px] transition-all ${
                      isClaimed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : isCurrent
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 shadow-gold-glow scale-105'
                        : 'bg-white/[0.03] border-white/5 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase">
                      {item.label}
                    </span>

                    <div className="my-1">
                      {isClaimed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                      ) : item.isSpecial ? (
                        <Crown className="w-5 h-5 text-amber-400 mx-auto animate-bounce" />
                      ) : (
                        <Gift className="w-5 h-5 text-slate-400 mx-auto" />
                      )}
                    </div>

                    <span className="text-xs font-mono font-black text-white">
                      +{item.pts}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Check-In Action Button */}
            <button
              type="button"
              onClick={handleClaimDailyCheckIn}
              disabled={checkedInToday}
              className={`w-full py-3 rounded-2xl text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                checkedInToday
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 cursor-not-allowed'
                  : 'vip-gold-btn shadow-gold-glow'
              }`}
            >
              {checkedInToday ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Checked In for Today (+{STREAK_REWARDS[streakDays - 1]?.pts || 50} PTS)</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-black" />
                  <span>Claim Day {streakDays} Reward (+{STREAK_REWARDS[streakDays - 1]?.pts || 50} PTS)</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-500 font-mono">
              Resets at midnight. Complete 7 consecutive days for the 600 PTS Jackpot!
            </p>
          </div>
        )}

        {/* TAB 2: LUCKY SPIN WHEEL */}
        {activeTab === 'WHEEL' && (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 to-transparent pointer-events-none" />

              {/* Animated Wheel Hub */}
              <div className="relative mb-3">
                <motion.div
                  animate={isSpinning ? { rotate: 1800 } : { rotate: 0 }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                  className="w-28 h-28 rounded-full border-4 border-dashed border-amber-400 flex items-center justify-center bg-[#151722] shadow-[0_0_30px_rgba(245,158,11,0.25)] text-3xl"
                >
                  🎰
                </motion.div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs bg-amber-400 text-black px-2 py-0.5 rounded font-black font-mono shadow">
                  ▼ SPIN
                </div>
              </div>

              {wheelResult ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 max-w-xs"
                >
                  <div className="text-xs font-mono font-bold flex items-center justify-center gap-1.5">
                    <PartyPopper className="w-4 h-4 text-amber-400" />
                    <span>Won: {wheelResult.label}!</span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-1">
                    Credited to your balance. Come back tomorrow for another free spin!
                  </p>
                </motion.div>
              ) : (
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">
                    {wheelSpunToday ? 'Daily Spin Completed' : 'Free Daily Spin Available!'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Prizes include up to +500 PTS, 2x Odds Boosters, and Friday Jackpot tickets.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSpinLuckyWheel}
              disabled={wheelSpunToday || isSpinning}
              className={`w-full py-3 rounded-2xl text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                wheelSpunToday
                  ? 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
                  : 'vip-gold-btn shadow-gold-glow'
              }`}
            >
              {isSpinning ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-black" />
                  <span>Spinning Wheel...</span>
                </>
              ) : wheelSpunToday ? (
                <span>Next Free Spin in 24 Hours</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Spin Lucky Wheel (Free)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
