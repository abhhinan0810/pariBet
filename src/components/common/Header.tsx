import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Trophy, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CoinIcon } from './CoinIcon';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#07080B]/90 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand on Mobile / Class network on Desktop */}
      <div className="flex items-center gap-3">
        <Link to="/home" className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-gold-glow">
            <div className="w-full h-full bg-[#0B0C10] rounded-[8px] flex items-center justify-center">
              <span className="font-display font-black text-sm text-amber-400">P</span>
            </div>
          </div>
          <span className="font-display font-black text-lg text-white">
            pari<span className="text-amber-400">BET</span>
          </span>
        </Link>
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-casino-muted">
          <span className="text-emerald-400 inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>CEC MCA CLASSROOM NETWORK</span>
          <span>•</span>
          <span className="text-amber-400 font-bold">53 VERIFIED SEATS</span>
        </div>
      </div>

      {/* User Actions & Balance Pill */}
      {user ? (
        <div className="flex items-center gap-3">
          {/* Quick Balance Pill */}
          <Link
            to="/wallet"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12131A] border border-amber-500/25 hover:border-amber-400 shadow-sm transition-all active:scale-95"
          >
            <CoinIcon size={18} />
            <span className="font-mono font-bold text-xs sm:text-sm text-white">
              {user.walletBalance.toLocaleString()}
            </span>
            <span className="text-[10px] text-amber-400 font-bold font-mono">COINS</span>
          </Link>

          {/* Quick Create / Stake Action Button */}
          <Link
            to="/create"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full vip-gold-btn text-xs font-bold transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-black" />
            <span>New Prediction</span>
          </Link>

          {/* Leaderboard Shortcut */}
          <Link
            to="/leaderboard"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-casino-muted hover:text-amber-400 transition-colors"
            title="Leaderboard"
          >
            <Trophy className="w-4 h-4" />
          </Link>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-casino-muted hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 shadow-gold-glow" />
          </Link>

          {/* User Avatar */}
          <Link to="/profile" className="flex items-center gap-2 group">
            <img
              src={user.profilePicture}
              alt={user.nickname}
              className="w-8 h-8 rounded-full border border-amber-400/40 object-cover group-hover:border-amber-400 transition-colors bg-background-elevated"
            />
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="px-3 py-1.5 text-xs font-semibold text-casino-muted hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-3.5 py-1.5 text-xs font-bold vip-gold-btn"
          >
            Join Club
          </Link>
        </div>
      )}
    </header>
  );
};
