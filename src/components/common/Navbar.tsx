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
  Clock,
  Users
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CoinIcon } from './CoinIcon';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const primaryNavItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Create', path: '/create', icon: PlusCircle, highlight: true },
    { label: 'Wallet', path: '/wallet', icon: WalletIcon },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const secondaryNavItems = [
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { label: 'Token Bank', path: '/bank', icon: Landmark },
    { label: 'My Predictions', path: '/my-predictions', icon: Clock },
    { label: 'Classroom Group', path: '/group', icon: Users },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0E0E14] border-r border-white/5 z-40 select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient p-0.5 shadow-gold-glow-sm">
              <div className="w-full h-full bg-[#0E0E14] rounded-[10px] flex items-center justify-center">
                <span className="font-display font-black text-xl text-gold-highlight tracking-wider">
                  P
                </span>
              </div>
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-wider text-transparent bg-clip-text bg-gold-gradient">
                pariBet
              </span>
              <span className="block text-[10px] text-casino-muted tracking-widest font-mono uppercase">
                MCA VIP CLUB
              </span>
            </div>
          </NavLink>
        </div>

        {/* User Balance Card (Sidebar) */}
        {user && (
          <div className="px-5 py-4 m-4 rounded-xl bg-[#151520] border border-gold/20 shadow-sm">
            <div className="flex items-center justify-between text-xs text-casino-muted mb-1">
              <span>Virtual Balance</span>
              <span className="text-[10px] bg-gold/10 text-gold-highlight px-1.5 py-0.5 rounded font-mono">
                TOKENS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CoinIcon size={22} />
              <span className="font-mono font-bold text-xl text-white">
                {user.walletBalance.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          <div>
            <span className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-casino-muted/60">
              Main Menu
            </span>
            <nav className="mt-2 space-y-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gold/10 text-gold-highlight font-semibold border-l-2 border-gold shadow-sm'
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
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gold/10 text-gold-highlight font-semibold border-l-2 border-gold'
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
              <span className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-rose-400/80">
                Administration
              </span>
              <nav className="mt-2 space-y-1">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-rose-500/20 text-rose-400 font-semibold border-l-2 border-rose-500'
                        : 'text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10'
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
          <div className="p-4 border-t border-white/5 bg-[#0A0A0E] flex items-center gap-3">
            <img
              src={user.profilePicture}
              alt={user.nickname}
              className="w-10 h-10 rounded-full border border-gold/40 object-cover bg-background-elevated"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate leading-tight">{user.nickname}</p>
              <p className="text-xs text-casino-muted truncate leading-tight font-sans">
                {user.officialName}
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0E0E14]/95 backdrop-blur-lg border-t border-white/10 z-50 flex items-center justify-around px-2 pb-safe">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-14 h-full relative transition-colors ${
                  item.highlight
                    ? 'text-gold-highlight'
                    : isActive
                    ? 'text-gold-highlight font-semibold'
                    : 'text-casino-muted hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.highlight ? (
                    <div className="w-10 h-10 -mt-5 rounded-full bg-gold-gradient flex items-center justify-center text-black shadow-gold-glow">
                      <Icon className="w-5 h-5" />
                    </div>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  <span className={`text-[10px] mt-1 ${item.highlight ? 'text-gold-highlight font-medium' : ''}`}>
                    {item.label}
                  </span>
                  {isActive && !item.highlight && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-gold-highlight shadow-gold-glow-sm" />
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

