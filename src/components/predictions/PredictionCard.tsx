import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  X,
  Coins,
  Sparkles,
  Zap
} from 'lucide-react';
import { Prediction } from '@/types/prediction';
import { CoinIcon } from '@/components/common/CoinIcon';
import { Card } from '@/components/common/Card';
import { pariMutuelEngine } from '@/utils/pariMutuel';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { predictionService } from '@/services/predictionService';

interface PredictionCardProps {
  prediction: Prediction;
  onParticipate: (prediction: Prediction) => void;
  onFinalize?: (prediction: Prediction) => void;
  onBetPlaced?: () => void;
  currentUserId?: string;
  isAdmin?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  onParticipate,
  onFinalize,
  onBetPlaced,
  currentUserId,
  isAdmin,
}) => {
  const navigate = useNavigate();
  const { user, refreshUserProfile } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const isExpired = new Date() > new Date(prediction.participationDeadline);
  const isOpen = prediction.status === 'OPEN' && !isExpired;
  const isFinalized = prediction.status === 'FINALIZED';
  const isCancelled = prediction.status === 'CANCELLED';

  const canFinalize =
    (prediction.creatorId === currentUserId || isAdmin) &&
    prediction.status === 'OPEN';

  // Inline Bet Slip State
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    prediction.options[0]?.id || ''
  );
  const [stakeAmount, setStakeAmount] = useState<number>(
    Math.max(prediction.minCommitment, 100)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userBalance = user?.walletBalance || 0;
  const selectedOption = prediction.options.find((o) => o.id === selectedOptionId);
  const currentOptionPool = selectedOption ? selectedOption.totalTokensCommitted : 0;

  // Real-time pari-mutuel calculation
  const estimatedPayout = pariMutuelEngine.calculateEstimatedPayout(
    stakeAmount,
    currentOptionPool,
    prediction.totalPoolTokens
  );

  const { multiplierDisplay } = pariMutuelEngine.calculateMultiplier(
    prediction.totalPoolTokens + stakeAmount,
    currentOptionPool + stakeAmount
  );

  const getTimeRemaining = () => {
    const diff = new Date(prediction.participationDeadline).getTime() - Date.now();
    if (diff <= 0) return 'Closed';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d left`;
    }
    return `${hours}h ${minutes}m left`;
  };

  const getTypeBadge = () => {
    switch (prediction.type) {
      case 'YES_NO':
        return 'YES / NO';
      case 'MULTIPLE_CHOICE':
        return 'Choice';
      case 'CLOSEST_ANSWER':
        return 'Closest';
      case 'GROUP_POLL':
        return 'Poll';
    }
  };

  const handleSelectOptionAndOpenSlip = (optionId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isAdmin) {
      toastError('Admin Restricted', 'Administrators cannot stake in predictions to maintain integrity.');
      return;
    }
    if (!isOpen) return;

    // For CLOSEST_ANSWER, standard modal is needed for numerical input
    if (prediction.type === 'CLOSEST_ANSWER') {
      onParticipate(prediction);
      return;
    }

    setSelectedOptionId(optionId);
    setIsSlipOpen(true);
  };

  const handleQuickChip = (amount: number) => {
    if (amount === -1) {
      // MAX
      setStakeAmount(Math.max(prediction.minCommitment, userBalance));
    } else {
      setStakeAmount(amount);
    }
  };

  const handleInlineSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isAdmin) {
      toastError('Admin Restricted', 'Admins cannot stake in predictions.');
      return;
    }
    if (!selectedOptionId) {
      toastError('Selection Required', 'Please select an option to bet on.');
      return;
    }
    if (stakeAmount < prediction.minCommitment) {
      toastError('Minimum Stake', `Minimum stake is ${prediction.minCommitment} PTS.`);
      return;
    }
    if (stakeAmount > userBalance) {
      toastError('Insufficient PTS', 'You do not have enough virtual points in your wallet.');
      return;
    }

    setIsSubmitting(true);
    try {
      await predictionService.participate({
        predictionId: prediction.id,
        userId: user.uid,
        userNickname: user.nickname,
        userOfficialName: user.officialName,
        userAvatar: user.profilePicture,
        optionId: selectedOptionId,
        tokensCommitted: stakeAmount,
      });

      await refreshUserProfile();
      toastSuccess(
        'Bet Locked In!',
        `Committed ${stakeAmount.toLocaleString()} PTS on "${selectedOption?.text || 'Option'}"`
      );
      setIsSlipOpen(false);
      if (onBetPlaced) onBetPlaced();
    } catch (err: any) {
      toastError('Bet Failed', err.message || 'Could not place bet. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const yesOption = prediction.options[0];
  const noOption = prediction.options[1];

  const yesMultiplier = yesOption
    ? pariMutuelEngine.calculateMultiplier(prediction.totalPoolTokens, yesOption.totalTokensCommitted).multiplierDisplay
    : '2.0x';
  const noMultiplier = noOption
    ? pariMutuelEngine.calculateMultiplier(prediction.totalPoolTokens, noOption.totalTokensCommitted).multiplierDisplay
    : '2.0x';

  return (
    <Card
      variant="interactive"
      className="p-5 relative flex flex-col justify-between border-white/10 hover:border-amber-500/30 hover:shadow-card-glow transition-all duration-300"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/25 font-mono text-[10px] font-bold uppercase">
              {prediction.category} • {getTypeBadge()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            {isFinalized ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> FINALIZED
              </span>
            ) : isCancelled ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> CANCELLED
              </span>
            ) : isExpired ? (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> CLOSED
              </span>
            ) : (
              <span className="text-casino-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{getTimeRemaining()}</span>
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-white mb-2 leading-snug">
          {prediction.title}
        </h3>
        <p className="text-xs text-casino-muted mb-4 line-clamp-2 leading-relaxed">
          {prediction.description}
        </p>

        {/* Dynamic Pool Distribution Preview for YES/NO */}
        {prediction.type === 'YES_NO' && prediction.options.length === 2 && (
          <div className="mb-4 bg-black/50 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            {/* Interactive Yes / No Clickable Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => handleSelectOptionAndOpenSlip(yesOption.id)}
                disabled={!isOpen || isAdmin}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer ${
                  isSlipOpen && selectedOptionId === yesOption.id
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-emerald-950/20 hover:bg-emerald-900/30 border-emerald-500/30 text-emerald-400'
                } ${!isOpen ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  YES
                </span>
                <span className="text-[11px] text-amber-400 font-bold">{yesMultiplier}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectOptionAndOpenSlip(noOption.id)}
                disabled={!isOpen || isAdmin}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer ${
                  isSlipOpen && selectedOptionId === noOption.id
                    ? 'bg-rose-500/25 border-rose-400 text-rose-300 ring-1 ring-rose-400/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'bg-rose-950/20 hover:bg-rose-900/30 border-rose-500/30 text-rose-400'
                } ${!isOpen ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  NO
                </span>
                <span className="text-[11px] text-amber-400 font-bold">{noMultiplier}</span>
              </button>
            </div>

            {/* Split Bar */}
            <div className="h-2 rounded-full bg-white/5 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{
                  width: `${
                    prediction.totalPoolTokens > 0
                      ? (yesOption.totalTokensCommitted / prediction.totalPoolTokens) * 100
                      : 50
                  }%`,
                }}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{
                  width: `${
                    prediction.totalPoolTokens > 0
                      ? (noOption.totalTokensCommitted / prediction.totalPoolTokens) * 100
                      : 50
                  }%`,
                }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-casino-muted mt-1.5 font-mono">
              <span>{yesOption.totalTokensCommitted.toLocaleString()} PTS</span>
              <span>{noOption.totalTokensCommitted.toLocaleString()} PTS</span>
            </div>
          </div>
        )}

        {/* Multiple Choice / Poll Options Preview */}
        {(prediction.type === 'MULTIPLE_CHOICE' || prediction.type === 'GROUP_POLL') && (
          <div className="space-y-1.5 mb-4">
            {prediction.options.slice(0, 3).map((opt) => {
              const { multiplierDisplay } = pariMutuelEngine.calculateMultiplier(
                prediction.totalPoolTokens,
                opt.totalTokensCommitted
              );
              const isWinner = prediction.winningOptionId === opt.id;
              const isSelected = isSlipOpen && selectedOptionId === opt.id;
              const percent =
                prediction.totalPoolTokens > 0
                  ? Math.round((opt.totalTokensCommitted / prediction.totalPoolTokens) * 100)
                  : 0;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOptionAndOpenSlip(opt.id)}
                  disabled={!isOpen || isAdmin}
                  className={`w-full p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer text-left ${
                    isWinner
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold'
                      : isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/40 shadow-sm'
                      : 'bg-white/[0.04] backdrop-blur-sm border-white/10 text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    {isWinner && <span>👑</span>}
                    <span className="truncate">{opt.text}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                    <span className="text-casino-muted">{percent}%</span>
                    <span className="text-amber-400 font-bold">{multiplierDisplay}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Closest Answer Preview */}
        {prediction.type === 'CLOSEST_ANSWER' && (
          <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 mb-4 text-xs font-mono">
            <div className="flex justify-between text-casino-muted mb-1">
              <span>Unit: {prediction.closestConfig?.unit || 'Number'}</span>
              <span>
                Range: {prediction.closestConfig?.minVal ?? 0} to{' '}
                {prediction.closestConfig?.maxVal ?? 'Any'}
              </span>
            </div>
            {isFinalized && prediction.closestAnswerActualValue !== undefined && (
              <div className="text-emerald-400 font-bold mt-1">
                Official Result: {prediction.closestAnswerActualValue}{' '}
                {prediction.closestConfig?.unit}
              </div>
            )}
          </div>
        )}

        {/* INLINE EXPANDABLE BET SLIP */}
        {isSlipOpen && isOpen && (
          <div className="my-3 p-3.5 rounded-2xl bg-[#0F1118] border border-amber-500/40 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header of Slip */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Bet Slip</span>
                <span className="text-amber-400 font-mono">
                  [{selectedOption?.text}]
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSlipOpen(false)}
                className="p-1 rounded-lg text-casino-muted hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close bet slip"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User Balance & Chip Presets */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <span className="text-casino-muted">Quick Chips:</span>
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-400" />
                  <span>Wallet: {userBalance.toLocaleString()} PTS</span>
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {[50, 100, 250, 500, -1].map((amt) => {
                  const label = amt === -1 ? 'MAX' : amt;
                  const isCurrent =
                    amt === -1
                      ? stakeAmount === userBalance
                      : stakeAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleQuickChip(amt)}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-black shadow-gold-glow'
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input & Calculation */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={prediction.minCommitment}
                    max={userBalance}
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                    placeholder={`Min ${prediction.minCommitment}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-amber-400 font-bold">
                    PTS
                  </span>
                </div>
              </div>

              {/* Live Return Projection */}
              <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1 text-casino-muted">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span>Est. Return:</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-amber-400">{multiplierDisplay}</span>
                  <span className="text-emerald-400">
                    +{estimatedPayout.toLocaleString()} PTS
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleInlineSubmit}
                disabled={isSubmitting || stakeAmount > userBalance}
                className="flex-1 vip-gold-btn py-2 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-gold-glow"
              >
                {isSubmitting ? (
                  <span>Locking In...</span>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-black" />
                    <span>Lock In {stakeAmount} PTS</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => onParticipate(prediction)}
                title="Open Advanced Modal"
                className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-casino-muted hover:text-white"
              >
                Full Slip
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-mono text-xs text-white">
            <CoinIcon size={16} />
            <span className="font-bold">{prediction.totalPoolTokens.toLocaleString()}</span>
            <span className="text-[10px] text-amber-400 font-bold">PTS</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1 text-[11px] text-casino-muted font-mono">
            <Users className="w-3.5 h-3.5" />
            <span>{prediction.totalParticipantsCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canFinalize && onFinalize && (
            <button
              onClick={() => onFinalize(prediction)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
            >
              Resolve
            </button>
          )}

          {isAdmin ? (
            <span className="text-[10px] sm:text-xs text-red-400 bg-red-500/10 border border-red-500/25 px-2.5 py-1.5 rounded-xl font-mono font-bold whitespace-nowrap shrink-0">
              Admin View
            </span>
          ) : isOpen ? (
            <button
              onClick={() => {
                if (prediction.type === 'CLOSEST_ANSWER') {
                  onParticipate(prediction);
                } else {
                  setIsSlipOpen(!isSlipOpen);
                }
              }}
              className="vip-gold-btn px-3 sm:px-4 py-1.5 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              {isSlipOpen ? 'Close Bet' : 'Bet Now'}
            </button>
          ) : (
            <span className="text-xs text-casino-muted px-2.5 py-1 bg-white/5 rounded-lg font-mono">
              {isFinalized ? 'Completed' : 'Locked'}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
