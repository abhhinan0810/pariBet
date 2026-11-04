import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Prediction, PredictionOption } from '@/types/prediction';
import { CoinIcon } from '@/components/common/CoinIcon';
import { pariMutuelEngine } from '@/utils/pariMutuel';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { predictionService } from '@/services/predictionService';

interface ParticipateModalProps {
  prediction: Prediction | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ParticipateModal: React.FC<ParticipateModalProps> = ({
  prediction,
  onClose,
  onSuccess,
}) => {
  const { user, refreshUserProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [closestAnswerValue, setClosestAnswerValue] = useState<number | ''>('');
  const [stakeAmount, setStakeAmount] = useState<number>(prediction?.minCommitment || 50);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!prediction) return null;

  const userBalance = user?.walletBalance || 0;
  const isInsufficient = stakeAmount > userBalance;
  const minRequired = prediction.minCommitment;

  // Selected Option Object
  const selectedOption = prediction.options.find((o) => o.id === selectedOptionId);
  const currentOptionPool = selectedOption ? selectedOption.totalTokensCommitted : 0;

  // Dynamic Multiplier & Estimated Payout Calculation
  const estimatedPayout = pariMutuelEngine.calculateEstimatedPayout(
    stakeAmount,
    currentOptionPool,
    prediction.totalPoolTokens
  );

  const { multiplierDisplay } = pariMutuelEngine.calculateMultiplier(
    prediction.totalPoolTokens + stakeAmount,
    currentOptionPool + stakeAmount
  );

  const handleQuickChip = (amount: number) => {
    setStakeAmount(Math.min(userBalance, amount));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (prediction.type !== 'CLOSEST_ANSWER' && !selectedOptionId) {
      toastError('Option Required', 'Please select an option to stake on.');
      return;
    }

    if (prediction.type === 'CLOSEST_ANSWER' && closestAnswerValue === '') {
      toastError('Answer Required', 'Please enter your numerical guess.');
      return;
    }

    if (stakeAmount < minRequired) {
      toastError('Minimum Stake', `Minimum stake is ${minRequired} tokens.`);
      return;
    }

    if (isInsufficient) {
      toastError('Insufficient Balance', 'You do not have enough virtual tokens.');
      return;
    }

    setSubmitting(true);
    try {
      await predictionService.participate({
        predictionId: prediction.id,
        userId: user.uid,
        userNickname: user.nickname,
        userOfficialName: user.officialName,
        userAvatar: user.profilePicture,
        optionId: selectedOptionId || undefined,
        closestAnswerValue:
          closestAnswerValue !== '' ? Number(closestAnswerValue) : undefined,
        tokensCommitted: stakeAmount,
      });

      await refreshUserProfile();
      success('Stake Placed!', `Committed ${stakeAmount} tokens on "${prediction.title}"`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toastError('Failed to Stake', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg casino-card border-gold/30 p-6 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/5 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold-highlight font-semibold">
              {prediction.category} • {prediction.type}
            </span>
            <h2 className="text-base font-bold text-white mt-1 pr-6 leading-snug">
              {prediction.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-casino-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Options Selection (for YES/NO, Multiple Choice, Group Poll) */}
          {prediction.type !== 'CLOSEST_ANSWER' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-2">
                Choose Winning Outcome
              </label>
              <div className="space-y-2">
                {prediction.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const { multiplierDisplay } = pariMutuelEngine.calculateMultiplier(
                    prediction.totalPoolTokens,
                    opt.totalTokensCommitted
                  );
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-gold bg-gold/15 shadow-gold-glow-sm text-white font-bold'
                          : 'border-white/10 bg-background-elevated hover:border-white/20 text-casino-muted hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-gold bg-gold text-black'
                              : 'border-white/30'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                        <span className="text-sm">{opt.text}</span>
                      </div>
                      <div className="font-mono text-xs text-gold-highlight">
                        {multiplierDisplay}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Closest Answer Input */}
          {prediction.type === 'CLOSEST_ANSWER' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                Your Numerical Prediction ({prediction.closestConfig?.unit || 'Number'})
              </label>
              <input
                type="number"
                step={prediction.closestConfig?.isInteger ? '1' : '0.01'}
                min={prediction.closestConfig?.minVal}
                max={prediction.closestConfig?.maxVal}
                required
                placeholder={`Enter guess in ${prediction.closestConfig?.unit || 'value'}`}
                value={closestAnswerValue}
                onChange={(e) =>
                  setClosestAnswerValue(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-gold"
              />
              <p className="text-[11px] text-casino-muted mt-1 font-mono">
                The closest valid answer (or tied closest answers) wins the accumulated pool.
              </p>
            </div>
          )}

          {/* Stake Amount Input & Quick Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-casino-muted">
                Stake Amount (Virtual Tokens)
              </label>
              <span className="text-xs font-mono text-casino-muted flex items-center gap-1">
                <span>Balance:</span>
                <span className="text-white font-bold">{userBalance.toLocaleString()}</span>
                <CoinIcon size={14} />
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                min={minRequired}
                max={userBalance}
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 text-base text-white font-mono font-bold focus:outline-none focus:border-gold"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-gold-highlight font-bold">
                TOKENS
              </div>
            </div>

            {/* Quick Chips */}
            <div className="grid grid-cols-5 gap-2 mt-2">
              {[50, 100, 250, 500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickChip(amt)}
                  className="py-1.5 px-2 rounded-lg bg-background-elevated hover:bg-white/10 border border-white/5 text-xs font-mono text-casino-muted hover:text-white transition-colors cursor-pointer"
                >
                  +{amt}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setStakeAmount(userBalance)}
                className="py-1.5 px-2 rounded-lg bg-gold/10 hover:bg-gold/20 border border-gold/30 text-xs font-mono text-gold-highlight font-bold transition-colors cursor-pointer"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Estimated Payout Display */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-gold/10 via-[#1C1C2A] to-background-elevated border border-gold/20 space-y-2">
            <div className="flex items-center justify-between text-xs text-casino-muted font-mono">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-gold-highlight" />
                <span>Dynamic Multiplier</span>
              </span>
              <span className="text-gold-highlight font-bold">{multiplierDisplay}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-xs text-white font-medium">Estimated Win Payout:</span>
              <div className="flex items-center gap-1.5 font-mono font-black text-lg text-emerald-400">
                <CoinIcon size={20} />
                <span>~{estimatedPayout.toLocaleString()} PTS</span>
              </div>
            </div>
            <p className="text-[10px] text-casino-muted leading-tight">
              Dynamic Pari-Mutuel formula: S + (S/W)*L. Includes original returned stake.
            </p>
          </div>

          {isInsufficient && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Insufficient tokens. Request a loan from the Token Bank or lower your stake.</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || isInsufficient || stakeAmount < minRequired}
            className="w-full casino-gold-button py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-bold cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Confirm Commitment ({stakeAmount} Tokens)</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

