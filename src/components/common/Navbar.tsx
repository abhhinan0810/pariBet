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
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { label: 'Token Bank', path: '/bank', icon: Landmark },
    { label: 'Class Group', path: '/group', icon: Users },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0B0C10] border-r border-white/5 z-40 select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <NavLink to="/home" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-gold-glow">
              <div className="w-full h-full bg-[#0B0C10] rounded-[9px] flex items-center justify-center">
                <span className="font-display font-black text-lg text-amber-400">P</span>
              </div>
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1">
                pari<span className="text-amber-400">BET</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-400 font-bold border border-amber-400/25 ml-1">
                  VIP
                </span>
              </span>
              <span className="block text-[10px] text-casino-muted tracking-widest font-mono uppercase">
                MCA CLASSROOM CLUB
              </span>
            </div>
          </NavLink>
        </div>

        {/* User Balance Card (Sidebar) */}
        {user && (
          <div className="px-5 py-4 m-4 rounded-2xl bg-[#12131A] border border-amber-500/20 shadow-sm">
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
                          ? 'bg-amber-400/10 text-amber-400 border-l-2 border-amber-400'
                          : 'text-casino-muted hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div>
            <span className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-casino-muted/60">
              Community & Bank
            </span>
            <nav className="mt-2 space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-amber-400/10 text-amber-400 border-l-2 border-amber-400'
                          : 'text-casino-muted hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {isAdmin && (
            <div>
              <span className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400">
                Administration
              </span>
              <nav className="mt-2 space-y-1">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-400/10 text-amber-400 border-l-2 border-amber-400'
                        : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
                    }`
                  }
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Admin Control</span>
                </NavLink>
              </nav>
            </div>
          )}
        </div>

        {/* User Mini Profile */}
        {user && (
          <div className="p-4 border-t border-white/5 bg-[#0E0F15] flex items-center gap-3">
            <img
              src={user.profilePicture}
              alt={user.nickname}
              className="w-10 h-10 rounded-full border border-amber-400/40 object-cover bg-background-elevated"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">{user.nickname}</p>
              <p className="text-[11px] text-casino-muted truncate leading-tight mt-0.5">
                {user.officialName}
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0B0C10]/95 backdrop-blur-xl border-t border-white/5 z-50 flex items-center justify-around px-2 pb-safe">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-14 h-full relative transition-colors ${
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
                  <span className={`text-[10px] mt-1 ${item.highlight ? 'text-amber-400 font-bold' : ''}`}>
                    {item.label}
                  </span>
                  {isActive && !item.highlight && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
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
