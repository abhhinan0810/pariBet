import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Bell,
  Trophy,
  Plus,
  Menu,
  X,
  Home,
  Compass,
  Landmark,
  Users,
  Settings,
  ShieldAlert,
  Wallet as WalletIcon,
  User as UserIcon,
  Sparkles,
  Flame,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CoinIcon } from './CoinIcon';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#07080B]/90 backdrop-blur-xl border-b border-white/10 px-2.5 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between">
        {/* Brand on Mobile / Class network on Desktop */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/home" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <img
              src="/images/mca.png"
              alt="MCA"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain shrink-0"
            />
            <img
              src="/images/logo.png"
              alt="pariBET"
              className="h-5 sm:h-6 w-auto object-contain shrink-0"
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
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Balance Pill */}
            <Link
              to="/wallet"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:border-red-500/50 shadow-sm transition-all active:scale-95 shrink-0"
            >
              <CoinIcon size={14} />
              <span className="font-mono font-bold text-xs sm:text-sm text-white whitespace-nowrap">
                {user.walletBalance.toLocaleString()}
              </span>
              <span className="text-[9px] sm:text-[10px] text-amber-400 font-bold font-mono">COINS</span>
            </Link>

            {/* Quick Create Action Button (Hidden on small screens) */}
            <Link
              to="/create"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full vip-gold-btn text-xs font-bold transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-black" />
              <span>New Bet</span>
            </Link>

            {/* Leaderboard Shortcut with Mandhi Crown Highlight */}
            <Link
              to="/leaderboard"
              className="relative p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-casino-muted hover:text-amber-400 transition-colors shrink-0"
              title="Class Leaderboard & Mandhi Grand Prize"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="absolute -top-1 -right-1 text-[9px]">🍗</span>
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
            <Link to="/profile" className="flex items-center gap-1.5 group shrink-0">
              <img
                src={user.profilePicture}
                alt={user.nickname}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-400/40 object-cover group-hover:border-red-500 transition-colors bg-background-elevated"
              />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              to="/login"
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold text-casino-muted hover:text-white transition-colors whitespace-nowrap"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs font-bold vip-gold-btn whitespace-nowrap shrink-0"
            >
              Join Club
            </Link>
          </div>
        )}
      </header>

      {/* MOBILE FULL DRAWER MODAL */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-[#090A10] border-r border-white/10 h-full flex flex-col z-10 shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2">
                <img src="/images/mca.png" alt="MCA" className="w-8 h-8 rounded-lg object-contain p-0.5 bg-white/5 border border-white/10" />
                <img src="/images/logo.png" alt="pariBET" className="h-6 w-auto object-contain" />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info & Grand Prize Promo inside Drawer */}
            {user && (
              <div className="p-4 border-b border-white/10 space-y-3 bg-[#0E0F17]">
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePicture}
                    alt={user.nickname}
                    className="w-11 h-11 rounded-full border-2 border-amber-400/50 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{user.nickname}</p>
                    <p className="text-[10px] text-amber-400 font-mono uppercase truncate">{user.admissionNumber}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.officialName}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CoinIcon size={20} />
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase font-mono">Balance</div>
                      <div className="text-sm font-black font-mono text-white">{user.walletBalance.toLocaleString()}</div>
                    </div>
                  </div>
                  <Link
                    to="/wallet"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] font-bold text-amber-400 hover:underline"
                  >
                    Wallet →
                  </Link>
                </div>

                {/* Grand Prize Mandhi Mini Card */}
                <Link
                  to="/leaderboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-transparent border border-amber-500/30 hover:border-amber-400 transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <span className="text-base">🍗</span>
                    <span>Sem 4 Grand Prize</span>
                    <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">TOP 4</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    Full Mandhi sponsored by <span className="text-amber-400 font-semibold">Abhinav (Varkkala/pari)</span>!
                  </p>
                  <div className="mt-1.5 text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>View Standings</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              </div>
            )}

            {/* Navigation Links */}
            <div className="p-3 space-y-1 flex-1">
              {[
                { to: '/home', label: 'Home Dashboard', icon: Home },
                { to: '/discover', label: 'Discover Predictions', icon: Compass },
                { to: '/create', label: 'Create New Prediction', icon: Plus, highlight: true },
                { to: '/leaderboard', label: 'Leaderboard & Prizes', icon: Trophy, badge: '🍗 Mandhi' },
                { to: '/bank', label: 'Token Bank (Loans)', icon: Landmark },
                { to: '/group', label: 'Class Group & Wall', icon: Users },
                { to: '/wallet', label: 'Token Wallet', icon: WalletIcon },
                { to: '/notifications', label: 'Notifications', icon: Bell },
                { to: '/profile', label: 'My Profile', icon: UserIcon },
                { to: '/settings', label: 'Settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-amber-400/15 text-amber-300 border-l-2 border-amber-400 font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}

              {isAdmin && (
                <div className="pt-2 mt-2 border-t border-white/10">
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Admin Control Center</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 text-center text-[10px] font-mono text-slate-500 bg-black/60">
              pariBET • CEC MCA 2025
            </div>
          </div>
        </div>
      )}
    </>
  );
};
