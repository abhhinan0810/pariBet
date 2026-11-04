import React from 'react';
import { Clock, Users, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Prediction } from '@/types/prediction';
import { CoinIcon } from '@/components/common/CoinIcon';
import { Card } from '@/components/common/Card';
import { pariMutuelEngine } from '@/utils/pariMutuel';

interface PredictionCardProps {
  prediction: Prediction;
  onParticipate: (prediction: Prediction) => void;
  onFinalize?: (prediction: Prediction) => void;
  currentUserId?: string;
  isAdmin?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  onParticipate,
  onFinalize,
  currentUserId,
  isAdmin,
}) => {
  const isExpired = new Date() > new Date(prediction.participationDeadline);
  const isOpen = prediction.status === 'OPEN' && !isExpired;
  const isFinalized = prediction.status === 'FINALIZED';
  const isCancelled = prediction.status === 'CANCELLED';

  const canFinalize =
    (prediction.creatorId === currentUserId || isAdmin) &&
    prediction.status === 'OPEN';

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

  return (
    <Card variant="interactive" className="p-5 relative flex flex-col justify-between border-white/5 hover:border-amber-500/30">
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
          <div className="mb-4 bg-background-elevated p-3 rounded-2xl border border-white/5">
            <div className="flex justify-between text-xs mb-1.5 font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span>YES</span>
                <span className="text-[10px] text-casino-muted">
                  ({pariMutuelEngine.calculateMultiplier(prediction.totalPoolTokens, prediction.options[0].totalTokensCommitted).multiplierDisplay})
                </span>
              </span>
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <span className="text-[10px] text-casino-muted">
                  ({pariMutuelEngine.calculateMultiplier(prediction.totalPoolTokens, prediction.options[1].totalTokensCommitted).multiplierDisplay})
                </span>
                <span>NO</span>
              </span>
            </div>

            <div className="h-2 rounded-full bg-white/5 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{
                  width: `${
                    prediction.totalPoolTokens > 0
                      ? (prediction.options[0].totalTokensCommitted / prediction.totalPoolTokens) * 100
                      : 50
                  }%`,
                }}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{
                  width: `${
                    prediction.totalPoolTokens > 0
                      ? (prediction.options[1].totalTokensCommitted / prediction.totalPoolTokens) * 100
                      : 50
                  }%`,
                }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-casino-muted mt-1.5 font-mono">
              <span>{prediction.options[0].totalTokensCommitted} coins</span>
              <span>{prediction.options[1].totalTokensCommitted} coins</span>
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
              const percent =
                prediction.totalPoolTokens > 0
                  ? Math.round((opt.totalTokensCommitted / prediction.totalPoolTokens) * 100)
                  : 0;

              return (
                <div
                  key={opt.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                    isWinner
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold'
                      : 'bg-background-elevated border-white/5 text-white'
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
                </div>
              );
            })}
          </div>
        )}

        {/* Closest Answer Preview */}
        {prediction.type === 'CLOSEST_ANSWER' && (
          <div className="p-3 rounded-2xl bg-background-elevated border border-white/5 mb-4 text-xs font-mono">
            <div className="flex justify-between text-casino-muted mb-1">
              <span>Unit: {prediction.closestConfig?.unit || 'Number'}</span>
              <span>Range: {prediction.closestConfig?.minVal ?? 0} to {prediction.closestConfig?.maxVal ?? 'Any'}</span>
            </div>
            {isFinalized && prediction.closestAnswerActualValue !== undefined && (
              <div className="text-emerald-400 font-bold mt-1">
                Official Result: {prediction.closestAnswerActualValue} {prediction.closestConfig?.unit}
              </div>
            )}
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
              Resolve Result
            </button>
          )}

          {isOpen ? (
            <button
              onClick={() => onParticipate(prediction)}
              className="vip-gold-btn px-4 py-1.5 text-xs font-bold cursor-pointer"
            >
              Stake Coins
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
