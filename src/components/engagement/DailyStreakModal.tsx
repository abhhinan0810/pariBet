import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Flame,
  Sparkles,
  Gift,
  CheckCircle2,
  Dice5,
  PartyPopper,
  Zap,
  RotateCw,
  Crown,
  AlertCircle,
  Clock,
  Frown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  engagementService,
  STREAK_REWARDS,
  WHEEL_PRIZES,
  WheelPrize
} from '@/services/engagementService';

interface DailyStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed?: (pts: number) => void;
}

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
}) => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<'STREAK' | 'WHEEL'>('STREAK');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [checkedInToday, setCheckedInToday] = useState<boolean>(false);
  const [wheelSpunToday, setWheelSpunToday] = useState<boolean>(false);
  const [claimingStreak, setClaimingStreak] = useState<boolean>(false);

  // Wheel animation states
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [wheelResult, setWheelResult] = useState<WheelPrize | null>(null);

  // Load user engagement status whenever modal opens
  const loadStatus = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const status = await engagementService.getUserEngagement(user.uid);
      setActiveDay(status.activeDay);
      setCheckedInToday(status.checkedInToday);
      setWheelSpunToday(status.wheelSpunToday);

      // If already spun today, check if there was a previous result recorded
      if (status.wheelSpunToday && status.record.lastWheelResult) {
        const found = WHEEL_PRIZES.find((p) => p.label === status.record.lastWheelResult);
        if (found) {
          setWheelResult(found);
        }
      } else {
        setWheelResult(null);
      }
    } catch (err) {
      console.warn('[DailyStreakModal] Failed to load engagement status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen, user?.uid]);

  if (!isOpen) return null;

  // Claim Streak Reward
  const handleClaimDailyCheckIn = async () => {
    if (checkedInToday || claimingStreak || !user) return;

    setClaimingStreak(true);
    try {
      const res = await engagementService.claimDailyStreak(user.uid);
      setCheckedInToday(true);
      setActiveDay(res.claimedDay);

      success(
        'Daily Streak Claimed!',
        `Earned +${res.rewardPts} PTS for Day ${res.claimedDay} classroom check-in.`
      );

      if (onRewardClaimed) {
        onRewardClaimed(res.rewardPts);
      }
    } catch (err: any) {
      toastError('Check-in Failed', err.message || 'Could not claim daily check-in.');
    } finally {
      setClaimingStreak(false);
    }
  };

  // Spin the Lucky Wheel
  const handleSpinLuckyWheel = async () => {
    if (wheelSpunToday || isSpinning || !user) return;

    setIsSpinning(true);
    setWheelResult(null);

    try {
      const res = await engagementService.spinLuckyWheel(user.uid);
      const targetIndex = res.prizeIndex;

      // Calculate clockwise rotation to land targetIndex under top needle (0 deg)
      // Slice center is at: targetIndex * 45 + 22.5 deg
      const fullRotations = 5; // 5 full revolutions
      const sliceCenter = targetIndex * 45 + 22.5;
      const finalAngle = fullRotations * 360 + (360 - sliceCenter);

      // Add to current rotation for smooth continuous rotation
      const nextTotalRotation = Math.ceil(wheelRotation / 360) * 360 + finalAngle;
      setWheelRotation(nextTotalRotation);

      // Wait for spin deceleration animation
      setTimeout(() => {
        setIsSpinning(false);
        setWheelSpunToday(true);
        setWheelResult(res.prize);

        if (res.isLoss) {
          toastError(
            'Better Luck Next Time!',
            'No tokens this spin. Come back tomorrow for another free attempt!'
          );
        } else {
          success(
            'Lucky Wheel Prize Won!',
            `You won ${res.prize.label}! Credited to your classroom balance.`
          );
          if (onRewardClaimed) {
            onRewardClaimed(res.prize.pts);
          }
        }
      }, 3500);
    } catch (err: any) {
      setIsSpinning(false);
      toastError('Spin Failed', err.message || 'Could not spin lucky wheel.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl bg-[#0B0C12] border-2 border-amber-400/40 p-5 sm:p-6 relative max-h-[94vh] overflow-y-auto shadow-2xl space-y-4">
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
                Claim consecutive check-in PTS & spin your daily wheel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
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
            <span>7-Day Streak ({checkedInToday ? `Day ${activeDay} ✓` : `Day ${activeDay}`})</span>
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
            {/* Streak Status Header */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-transparent border border-amber-400/25 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400">
                  Current Streak
                </span>
                <div className="text-xl font-mono font-black text-white flex items-center gap-1.5">
                  <span>Day {activeDay} of 7</span>
                  <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">Today's Value</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  +{STREAK_REWARDS[activeDay - 1]?.pts || 50} PTS
                </span>
              </div>
            </div>

            {/* Streak Rule Notice Banner */}
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 text-[11px] text-amber-200/90 font-mono">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Consecutive Check-in Rule:</strong> You must claim every calendar day. If you miss a day, your streak breaks and resets back to <strong>Day 1</strong>!
              </span>
            </div>

            {/* 7-Day Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {STREAK_REWARDS.map((item) => {
                const isClaimed = checkedInToday ? item.day <= activeDay : item.day < activeDay;
                const isCurrent = item.day === activeDay;

                return (
                  <div
                    key={item.day}
                    className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-between min-h-[92px] transition-all ${
                      isClaimed
                        ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-300 shadow-sm'
                        : isCurrent && !checkedInToday
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 shadow-gold-glow scale-105'
                        : 'bg-white/[0.03] border-white/5 text-slate-400 opacity-60'
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
              disabled={checkedInToday || claimingStreak || loading}
              className={`w-full py-3 rounded-2xl text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                checkedInToday
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 cursor-not-allowed'
                  : 'vip-gold-btn shadow-gold-glow'
              }`}
            >
              {claimingStreak ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-black" />
                  <span>Claiming Reward...</span>
                </>
              ) : checkedInToday ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Checked In for Today (Day {activeDay}) • Next in Tomorrow</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-black" />
                  <span>Claim Day {activeDay} Reward (+{STREAK_REWARDS[activeDay - 1]?.pts || 50} PTS)</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-500 font-mono">
              Resets at midnight. Complete all 7 consecutive days for the 600 PTS Jackpot!
            </p>
          </div>
        )}

        {/* TAB 2: LUCKY SPIN WHEEL */}
        {activeTab === 'WHEEL' && (
          <div className="space-y-4 text-center">
            {/* Visual Casino Wheel Container */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center min-h-[290px] relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 to-transparent pointer-events-none" />

              {/* Wheel Outer Frame & Pointer */}
              <div className="relative my-2 flex items-center justify-center">
                {/* Fixed Top Pointer (12 O'Clock) */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[14px] border-t-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                </div>

                {/* Rotating SVG Segmented Wheel */}
                <motion.div
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transition: isSpinning ? 'transform 3.5s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none'
                  }}
                  className="w-56 h-56 sm:w-60 sm:h-60 rounded-full shadow-[0_0_35px_rgba(245,158,11,0.2)] relative"
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
                    <circle cx="100" cy="100" r="98" fill="#0C0D14" stroke="#F59E0B" strokeWidth="3" />
                    {WHEEL_PRIZES.map((prize, idx) => {
                      // 8 slices: 45 degrees each. Start from 0 deg (top-right relative to 12 o'clock)
                      const startAngle = idx * 45 - 90;
                      const endAngle = (idx + 1) * 45 - 90;
                      const midAngle = startAngle + 22.5;

                      // Polar to cartesian
                      const x1 = 100 + 94 * Math.cos((startAngle * Math.PI) / 180);
                      const y1 = 100 + 94 * Math.sin((startAngle * Math.PI) / 180);
                      const x2 = 100 + 94 * Math.cos((endAngle * Math.PI) / 180);
                      const y2 = 100 + 94 * Math.sin((endAngle * Math.PI) / 180);

                      // Text coordinate
                      const tx = 100 + 64 * Math.cos((midAngle * Math.PI) / 180);
                      const ty = 100 + 64 * Math.sin((midAngle * Math.PI) / 180);

                      return (
                        <g key={prize.id}>
                          <path
                            d={`M 100 100 L ${x1} ${y1} A 94 94 0 0 1 ${x2} ${y2} Z`}
                            fill={prize.color}
                            stroke="#1E293B"
                            strokeWidth="1.5"
                          />
                          <text
                            x={tx}
                            y={ty}
                            fill="#FFFFFF"
                            fontSize={prize.isLoss ? "6" : "7.5"}
                            fontWeight="900"
                            fontFamily="monospace"
                            textAnchor="middle"
                            dominantBaseline="central"
                            transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                          >
                            {prize.isLoss ? 'NO PRIZE' : prize.label.replace('+', '')}
                          </text>
                        </g>
                      );
                    })}
                    {/* Golden Center Hub */}
                    <circle cx="100" cy="100" r="22" fill="#111827" stroke="#F59E0B" strokeWidth="2.5" />
                    <circle cx="100" cy="100" r="14" fill="#F59E0B" />
                    <circle cx="100" cy="100" r="6" fill="#0C0D14" />
                  </svg>
                </motion.div>
              </div>

              {/* Spin Outcome Banner */}
              {wheelResult ? (
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`mt-3 p-3 rounded-xl border max-w-sm w-full ${
                    wheelResult.isLoss
                      ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                      : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                  }`}
                >
                  <div className="text-xs font-mono font-bold flex items-center justify-center gap-1.5">
                    {wheelResult.isLoss ? (
                      <>
                        <Frown className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-200">Better Luck Next Time!</span>
                      </>
                    ) : (
                      <>
                        <PartyPopper className="w-4 h-4 text-amber-400" />
                        <span>Won: {wheelResult.label}!</span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {wheelResult.isLoss
                      ? 'No prize this spin. Free spin completed for today — try your luck again tomorrow!'
                      : 'Credited to your classroom balance. Come back tomorrow for another spin!'}
                  </p>
                </motion.div>
              ) : (
                <div className="mt-2">
                  <h4 className="text-xs font-bold text-white mb-0.5">
                    {wheelSpunToday ? 'Daily Spin Completed' : 'Free Daily Spin Available!'}
                  </h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Spin for up to +500 PTS, ticket entries, or test your luck today!
                  </p>
                </div>
              )}
            </div>

            {/* Spin Button */}
            <button
              type="button"
              onClick={handleSpinLuckyWheel}
              disabled={wheelSpunToday || isSpinning || loading}
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
                <>
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Next Free Spin in Tomorrow</span>
                </>
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
