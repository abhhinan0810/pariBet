import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Trophy, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CoinIcon } from './CoinIcon';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#07080B]/80 backdrop-blur-xl border-b border-white/10 px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
      {/* Brand on Mobile / Class network on Desktop */}
      <div className="flex items-center gap-3">
        <Link to="/home" className="lg:hidden flex items-center gap-2 shrink-0">
          <img
            src="/images/mca.png"
            alt="MCA"
            className="w-8 h-8 rounded-lg object-contain shrink-0"
          />
          <img
            src="/images/logo.png"
            alt="pariBET"
            className="h-6 w-auto object-contain shrink-0"
          />
        </Link>
        <div className="hidden lg:flex items-center gap-2.5 text-xs font-mono text-casino-muted">
          <img
            src="/images/mca.png"
            alt="MCA"
            className="w-5 h-5 rounded object-contain shrink-0"
          />
          <span>CEC MCA CLASSROOM NETWORK</span>
          <span>•</span>
          <span className="text-amber-400 font-bold">VIP LOUNGE</span>
        </div>
      </div>

      {/* User Actions & Balance Pill */}
      {user ? (
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Balance Pill */}
          <Link
            to="/wallet"
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-xl border border-white/10 hover:border-red-500/50 shadow-sm transition-all active:scale-95 shrink-0"
          >
            <CoinIcon size={16} />
            <span className="font-mono font-bold text-xs sm:text-sm text-white whitespace-nowrap">
              {user.walletBalance.toLocaleString()}
            </span>
            <span className="text-[10px] text-amber-400 font-bold font-mono">COINS</span>
          </Link>

          {/* Quick Create Action Button (Hidden on tiny screens to prevent cramping) */}
          <Link
            to="/create"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full vip-gold-btn text-xs font-bold transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-black" />
            <span>New Prediction</span>
          </Link>

          {/* Leaderboard Shortcut */}
          <Link
            to="/leaderboard"
            className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-casino-muted hover:text-amber-400 transition-colors shrink-0"
            title="Leaderboard"
          >
            <Trophy className="w-4 h-4" />
          </Link>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-casino-muted hover:text-white transition-colors shrink-0"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 shadow-red-glow" />
          </Link>

          {/* User Avatar */}
          <Link to="/profile" className="flex items-center gap-2 group shrink-0">
            <img
              src={user.profilePicture}
              alt={user.nickname}
              className="w-8 h-8 rounded-full border border-amber-400/40 object-cover group-hover:border-red-500 transition-colors bg-background-elevated"
            />
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/login"
            className="px-3 py-1.5 text-xs font-semibold text-casino-muted hover:text-white transition-colors whitespace-nowrap"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-3.5 py-1.5 text-xs font-bold vip-gold-btn whitespace-nowrap shrink-0"
          >
            Join Club
          </Link>
        </div>
      )}
    </header>
  );
};
