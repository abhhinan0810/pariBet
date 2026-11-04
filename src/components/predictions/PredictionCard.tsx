import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Prediction, PredictionOption } from '@/types/prediction';
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

  // Format remaining time
  const getTimeRemaining = () => {
    const diff = new Date(prediction.participationDeadline).getTime() - Date.now();
    if (diff <= 0) return 'Participation closed';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h left`;
    }
    return `${hours}h ${minutes}m left`;
  };

  const getTypeBadge = () => {
    switch (prediction.type) {
      case 'YES_NO':
        return 'YES / NO';
      case 'MULTIPLE_CHOICE':
        return 'Multiple Choice';
      case 'CLOSEST_ANSWER':
        return 'Closest Answer';
      case 'GROUP_POLL':
        return 'Class Poll';
    }
  };

  return (
    <Card variant="interactive" className="p-5 relative flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-gold/10 text-gold-highlight border border-gold/20 font-mono text-[10px] font-semibold uppercase">
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
                <Clock className="w-3.5 h-3.5 text-gold-highlight" />
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

        {/* Dynamic Pool Distribution Preview */}
        {prediction.type === 'YES_NO' && prediction.options.length === 2 && (
          <div className="mb-4 bg-background-elevated p-3 rounded-xl border border-white/5">
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

            {/* Proportion Bar */}
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
              <span>{prediction.options[0].totalTokensCommitted} tokens</span>
              <span>{prediction.options[1].totalTokensCommitted} tokens</span>
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
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                      : 'bg-background-elevated border-white/5 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    {isWinner && <span>👑</span>}
                    <span className="truncate">{opt.text}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                    <span className="text-casino-muted">{percent}%</span>
                    <span className="text-gold-highlight font-bold">{multiplierDisplay}</span>
                  </div>
                </div>
              );
            })}
            {prediction.options.length > 3 && (
              <p className="text-[11px] text-casino-muted text-center">
                + {prediction.options.length - 3} more options
              </p>
            )}
          </div>
        )}

        {/* Closest Answer Preview */}
        {prediction.type === 'CLOSEST_ANSWER' && (
          <div className="p-3 rounded-xl bg-background-elevated border border-white/5 mb-4 text-xs font-mono">
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
            <span className="text-[10px] text-gold-highlight">PTS</span>
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
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
            >
              Resolve Result
            </button>
          )}

          {isOpen ? (
            <button
              onClick={() => onParticipate(prediction)}
              className="casino-gold-button px-4 py-1.5 text-xs font-bold cursor-pointer"
            >
              Stake Now
            </button>
          ) : (
            <span className="text-xs text-casino-muted px-2 py-1 bg-white/5 rounded font-mono">
              {isFinalized ? 'Completed' : 'Locked'}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

