import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CoinIcon } from './CoinIcon';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#0B0B0F]/90 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Mobile Brand / Desktop breadcrumb */}
      <div className="flex items-center gap-3">
        <Link to="/" className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold-gradient p-0.5 shadow-gold-glow-sm">
            <div className="w-full h-full bg-[#0B0B0F] rounded-[6px] flex items-center justify-center">
              <span className="font-display font-black text-sm text-gold-highlight">P</span>
            </div>
          </div>
          <span className="font-display font-black text-lg text-transparent bg-clip-text bg-gold-gradient">
            pariBet
          </span>
        </Link>
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-casino-muted">
          <span className="text-emerald-400 inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>CEC MCA PRIVATE NETWORK</span>
          <span>•</span>
          <span className="text-gold-highlight">CLASS OF 2025</span>
        </div>
      </div>

      {/* User Actions & Balance Pill */}
      {user ? (
        <div className="flex items-center gap-3">
          {/* Quick Balance Pill */}
          <Link
            to="/wallet"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#171722] border border-gold/30 hover:border-gold shadow-sm transition-all active:scale-95"
          >
            <CoinIcon size={18} />
            <span className="font-mono font-bold text-sm text-white">
              {user.walletBalance.toLocaleString()}
            </span>
            <span className="text-[10px] text-gold-highlight font-semibold">PTS</span>
          </Link>

          {/* Leaderboard Shortcut */}
          <Link
            to="/leaderboard"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-casino-muted hover:text-gold-highlight transition-colors"
            title="Leaderboard"
          >
            <Trophy className="w-5 h-5" />
          </Link>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-casino-muted hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-highlight shadow-gold-glow-sm" />
          </Link>

          {/* User Avatar */}
          <Link to="/profile" className="flex items-center gap-2 group">
            <img
              src={user.profilePicture}
              alt={user.nickname}
              className="w-8 h-8 rounded-full border border-gold/40 object-cover group-hover:border-gold transition-colors"
            />
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 py-1.5 text-sm font-semibold text-casino-muted hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-1.5 text-sm font-semibold bg-gold-gradient text-black rounded-lg shadow-gold-glow-sm"
          >
            Join Club
          </Link>
        </div>
      )}
    </header>
  );
};
