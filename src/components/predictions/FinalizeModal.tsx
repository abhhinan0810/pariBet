import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { Prediction } from '@/types/prediction';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { predictionService } from '@/services/predictionService';

interface FinalizeModalProps {
  prediction: Prediction | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const FinalizeModal: React.FC<FinalizeModalProps> = ({
  prediction,
  onClose,
  onSuccess,
}) => {
  const { user, refreshUserProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [selectedWinningOption, setSelectedWinningOption] = useState<string>('');
  const [actualClosestValue, setActualClosestValue] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);

  if (!prediction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (prediction.type !== 'CLOSEST_ANSWER' && !selectedWinningOption) {
      toastError('Selection Required', 'Please select the authoritative winning option.');
      return;
    }

    if (prediction.type === 'CLOSEST_ANSWER' && actualClosestValue === '') {
      toastError('Result Required', 'Please enter the official numerical outcome.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await predictionService.finalizePrediction({
        predictionId: prediction.id,
        winningOptionId: selectedWinningOption || undefined,
        actualClosestValue:
          actualClosestValue !== '' ? Number(actualClosestValue) : undefined,
        submittedByUid: user.uid,
        isAdminOverride: user.role === 'admin',
      });

      await refreshUserProfile();
      success(
        'Prediction Finalized!',
        `Distributed ${res.totalTokensAwarded.toLocaleString()} tokens to winners.`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toastError('Failed to Finalize', err.message);
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
        className="w-full max-w-lg casino-card border-gold/30 p-6 relative"
      >
        <div className="flex items-start justify-between pb-4 border-b border-white/5 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Official Outcome Submission
            </span>
            <h2 className="text-base font-bold text-white mt-1 pr-6 leading-snug">
              Resolve: {prediction.title}
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
          {prediction.type !== 'CLOSEST_ANSWER' ? (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-2">
                Select Winning Outcome
              </label>
              <div className="space-y-2">
                {prediction.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedWinningOption(opt.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedWinningOption === opt.id
                        ? 'border-emerald-500 bg-emerald-500/15 text-white font-bold'
                        : 'border-white/10 bg-background-elevated hover:border-white/20 text-casino-muted'
                    }`}
                  >
                    <span>{opt.text}</span>
                    <span className="font-mono text-xs text-casino-muted">
                      {opt.totalTokensCommitted} PTS ({opt.totalParticipants} votes)
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                Official Numerical Result ({prediction.closestConfig?.unit || 'Value'})
              </label>
              <input
                type="number"
                step={prediction.closestConfig?.isInteger ? '1' : '0.01'}
                required
                placeholder="Enter official outcome"
                value={actualClosestValue}
                onChange={(e) =>
                  setActualClosestValue(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-gold"
              />
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Finalizing will immediately calculate pari-mutuel payouts and transfer tokens to the winning classmates' virtual wallets.
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full casino-gold-button py-3 px-4 flex items-center justify-center gap-2 text-sm font-bold cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Confirm Outcome & Distribute Pool</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

