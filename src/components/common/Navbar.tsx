import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Compass,
  PlusCircle,
  Wallet as WalletIcon,
  User,
  Trophy,
  Landmark,
  ShieldAlert,
  Bell,
  Settings,
  Users
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CoinIcon } from './CoinIcon';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const primaryNavItems = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Create', path: '/create', icon: PlusCircle, highlight: true },
    { label: 'Wallet', path: '/wallet', icon: WalletIcon },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const secondaryNavItems = [
    { label: 'Leaderboard & Prizes', path: '/leaderboard', icon: Trophy, badge: '🍗 Mandhi' },
    { label: 'Token Bank', path: '/bank', icon: Landmark },
    { label: 'Class Group', path: '/group', icon: Users },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#07080B]/80 backdrop-blur-2xl border-r border-white/10 z-40 select-none">
        {/* Brand Header with New Official PNG Logos */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <NavLink to="/home" className="flex items-center gap-3">
            <img
              src="/images/mca.png"
              alt="MCA Logo"
              className="w-10 h-10 rounded-xl object-contain shrink-0 p-1 bg-white/5 border border-white/10"
            />
            <div className="flex flex-col">
              <img
                src="/images/logo.png"
                alt="pariBET"
                className="h-7 w-auto object-contain"
              />
              <span className="text-[9px] text-casino-muted tracking-widest font-mono uppercase mt-0.5">
                CEC MCA Gaming Lounge
              </span>
            </div>
          </NavLink>
        </div>

        {/* User Balance Card (Sidebar) */}
        {user && (
          <div className="px-5 py-4 m-4 rounded-2xl bg-black/35 backdrop-blur-xl border border-white/10 shadow-xl hover:border-red-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs text-casino-muted mb-1">
              <span className="text-amber-400 font-bold text-[11px] uppercase tracking-wider">Balance</span>
              <span className="text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/25 px-2 py-0.5 rounded-full font-mono font-bold">
                COINS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CoinIcon size={24} />
              <span className="font-mono font-black text-2xl text-white">
                {user.walletBalance.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          <div>
            <span className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-casino-muted/60">
              Menu
            </span>
            <nav className="mt-2 space-y-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500 font-bold'
                          : 'text-casino-muted hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div>
            <span className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-casino-muted/60">
              Classroom & Social
            </span>
            <nav className="mt-2 space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500 font-bold'
                          : 'text-casino-muted hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {isAdmin && (
            <div>
              <span className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-red-400">
                Administration
              </span>
              <nav className="mt-2 space-y-1">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-red-500/15 text-red-400 border-l-2 border-red-500 font-bold'
                        : 'text-red-400/80 hover:text-red-300 hover:bg-red-500/10'
                    }`
                  }
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Admin Control</span>
                </NavLink>
              </nav>
            </div>
          )}
        </div>

        {/* User Mini Profile */}
        {user && (
          <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-xl flex items-center gap-3">
            <img
              src={user.profilePicture}
              alt={user.nickname}
              className="w-10 h-10 rounded-full border border-amber-400/40 object-cover bg-background-elevated"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.nickname}</p>
              <p className="text-[10px] text-casino-muted font-mono truncate uppercase">
                {user.admissionNumber}
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#07080B]/90 backdrop-blur-2xl border-t border-white/10 z-40 flex items-center justify-around px-1 pb-[env(safe-area-inset-bottom,0px)]">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                  item.highlight
                    ? 'text-black'
                    : isActive
                    ? 'text-amber-400 font-bold'
                    : 'text-casino-muted hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.highlight ? (
                    <div className="w-11 h-11 -mt-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-gold-glow">
                      <Icon className="w-5 h-5" />
                    </div>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  <span className={`text-[10px] mt-0.5 whitespace-nowrap ${item.highlight ? 'text-amber-400 font-bold' : ''}`}>
                    {item.label}
                  </span>
                  {isActive && !item.highlight && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-red-500 shadow-red-glow" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};
