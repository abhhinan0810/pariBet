import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Coins,
  ArrowRight,
  Flame,
  Landmark,
  Trophy,
  CheckCircle2,
  Users,
  Compass,
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CoinIcon } from '@/components/common/CoinIcon';
import { Card } from '@/components/common/Card';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#090616] text-[#F8FAFC] overflow-x-hidden selection:bg-brand-violet selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#090616]/80 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-pink p-0.5 shadow-brand-glow">
              <div className="w-full h-full bg-[#0E0924] rounded-[10px] flex items-center justify-center">
                <span className="font-display font-black text-lg text-white">P</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                pariBet
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-violet/20 text-brand-violet font-bold border border-brand-violet/30">
                  MCA
                </span>
              </span>
            </div>
          </Link>

          {/* Quick Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-casino-muted">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#markets" className="hover:text-white transition-colors">Prediction Modes</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#bank" className="hover:text-white transition-colors">Token Bank</a>
          </nav>

          {/* Auth CTA */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/home"
                className="casino-primary-button px-5 py-2 text-xs font-bold flex items-center gap-2 shadow-brand-glow"
              >
                <span>Enter Gaming Lounge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-casino-muted hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="casino-primary-button px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-brand-glow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Join Club</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-violet/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-brand-pink/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto relative z-10">
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-violet/15 border border-brand-violet/30 text-brand-violet text-xs font-semibold mb-6 shadow-brand-glow"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
            <span>Private MCA Classroom Gaming Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15]"
          >
            Predict with Friends.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-violet via-brand-pink to-brand-cyan">
              Win Virtual Coins.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-sm sm:text-base text-casino-muted max-w-2xl mx-auto leading-relaxed"
          >
            A closed-community social prediction arena built exclusively for 53 MCA classmates at College of Engineering Chengannur. Dynamic pari-mutuel odds, virtual tokens, and zero real money.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <Link
                to="/home"
                className="w-full sm:w-auto casino-primary-button px-8 py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-brand-glow"
              >
                <span>Go to Your Lounge Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto casino-pink-button px-8 py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-pink-glow"
                >
                  <Coins className="w-4 h-4" />
                  <span>Claim 1,000 Free Coins</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-background-elevated hover:bg-background-hover border border-white/10 text-sm font-semibold text-white transition-all"
                >
                  Log In
                </Link>
              </>
            )}
          </motion.div>

          {/* Verified Student Guarantee */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-casino-muted font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict college email verification (<code className="text-brand-violet">@ceconline.edu</code>)</span>
          </div>
        </div>

        {/* Highlight Feature Banners (LoopBet & SP CAS inspiration) */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
          {/* Card 1 */}
          <Card variant="gold-border" className="p-6 bg-gradient-to-br from-[#1E1242] to-[#120B2E] relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-brand-violet mb-4 shadow-brand-glow">
              <Coins className="w-6 h-6 text-brand-violet" />
            </div>
            <span className="text-[10px] font-mono uppercase text-brand-pink font-bold">1,000 FREE COINS</span>
            <h3 className="text-lg font-bold text-white mt-1">Starting Allocation</h3>
            <p className="text-xs text-casino-muted mt-2 leading-relaxed">
              Every verified student automatically receives 1,000 virtual coins upon registration to place stakes and join pools.
            </p>
          </Card>

          {/* Card 2 */}
          <Card variant="default" className="p-6 bg-gradient-to-br from-[#1A123D] to-[#0E0924] border-brand-pink/20">
            <div className="w-12 h-12 rounded-2xl bg-brand-pink/20 border border-brand-pink/40 flex items-center justify-center text-brand-pink mb-4 shadow-pink-glow">
              <TrendingUp className="w-6 h-6 text-brand-pink" />
            </div>
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">PARI-MUTUEL ODDS</span>
            <h3 className="text-lg font-bold text-white mt-1">Dynamic Multipliers</h3>
            <p className="text-xs text-casino-muted mt-2 leading-relaxed">
              Odds and estimated returns shift dynamically in real-time as classmates commit their stakes. Winning takes the loser pool!
            </p>
          </Card>

          {/* Card 3 */}
          <Card variant="default" className="p-6 bg-gradient-to-br from-[#16123D] to-[#0D0924] border-brand-cyan/20">
            <div className="w-12 h-12 rounded-2xl bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan mb-4 shadow-cyan-glow">
              <Landmark className="w-6 h-6 text-brand-cyan" />
            </div>
            <span className="text-[10px] font-mono uppercase text-brand-cyan font-bold">PEER LENDING</span>
            <h3 className="text-lg font-bold text-white mt-1">Token Bank Loans</h3>
            <p className="text-xs text-casino-muted mt-2 leading-relaxed">
              Ran out of coins? Request a peer loan or fund a classmate's request with a simple flat interest rate.
            </p>
          </Card>
        </div>
      </section>

      {/* 4 Prediction Formats Showcase */}
      <section id="markets" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-violet">
            Interactive Arena
          </span>
          <h2 className="font-display font-black text-3xl text-white mt-1">
            Four Ways to Compete
          </h2>
          <p className="text-xs text-casino-muted mt-2">
            From binary campus outcomes to precise closest-guess viva marks, launch any game in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="casino-card p-5 border-brand-violet/20">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-violet/15 text-brand-violet font-bold">
              TYPE A
            </span>
            <h3 className="text-base font-bold text-white mt-3">YES / NO</h3>
            <p className="text-xs text-casino-muted mt-1 leading-relaxed">
              Fast-paced binary prediction on college announcements, exam dates, or match winners.
            </p>
            <div className="mt-4 p-2 rounded-lg bg-background-elevated text-xs font-mono text-casino-muted flex justify-between">
              <span className="text-emerald-400">YES 1.45x</span>
              <span className="text-rose-400">NO 3.20x</span>
            </div>
          </div>

          <div className="casino-card p-5 border-brand-pink/20">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-pink/15 text-brand-pink font-bold">
              TYPE B
            </span>
            <h3 className="text-base font-bold text-white mt-3">Multiple Choice</h3>
            <p className="text-xs text-casino-muted mt-1 leading-relaxed">
              Custom options with independent stake pools for cricket teams or tournament champions.
            </p>
            <div className="mt-4 p-2 rounded-lg bg-background-elevated text-xs font-mono text-casino-muted flex justify-between">
              <span className="text-white">Batch 2025</span>
              <span className="text-brand-pink font-bold">2.80x</span>
            </div>
          </div>

          <div className="casino-card p-5 border-brand-cyan/20">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan font-bold">
              TYPE C
            </span>
            <h3 className="text-base font-bold text-white mt-3">Closest Answer</h3>
            <p className="text-xs text-casino-muted mt-1 leading-relaxed">
              Numerical guess on viva marks or arrival times. The closest valid answer wins the entire pool!
            </p>
            <div className="mt-4 p-2 rounded-lg bg-background-elevated text-xs font-mono text-casino-muted flex justify-between">
              <span>Range: 0 - 50</span>
              <span className="text-brand-cyan font-bold">Proportional</span>
            </div>
          </div>

          <div className="casino-card p-5 border-purple-500/20">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 font-bold">
              TYPE D
            </span>
            <h3 className="text-base font-bold text-white mt-3">Group Poll</h3>
            <p className="text-xs text-casino-muted mt-1 leading-relaxed">
              Democratic decision-making where the option with the highest vote count claims the pot.
            </p>
            <div className="mt-4 p-2 rounded-lg bg-background-elevated text-xs font-mono text-casino-muted flex justify-between">
              <span>Highest Votes</span>
              <span className="text-purple-300 font-bold">Wins Pool</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-pink">
            Simple 3-Step Setup
          </span>
          <h2 className="font-display font-black text-3xl text-white mt-1">
            How to Get Started
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-background-card border border-white/5 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-violet/20 border border-brand-violet/40 font-mono font-black text-lg text-brand-violet flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-white text-base">Enter College Email</h3>
            <p className="text-xs text-casino-muted mt-2 leading-relaxed">
              Input your official <code className="text-brand-violet font-mono">admission_number@ceconline.edu</code>. We verify you against the 53 approved MCA roster.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-background-card border border-white/5 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-pink/20 border border-brand-pink/40 font-mono font-black text-lg text-brand-pink flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-white text-base">Choose Nickname & Claim Bonus</h3>
            <p className="text-xs text-casino-muted mt-2 leading-relaxed">
              Pick your gaming avatar and gamer tag. Your 1,000 welcome coins are credited instantly to your wallet.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-background-card border border-white/5 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 font-mono font-black text-lg text-emerald-400 flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-white text-base">Stake, Win & Lead Ranks</h3>
            <p className="text-xs text-casino-muted mt-2 leading-relaxed">
              Place stakes on active predictions, launch your own markets, and climb the 7 Hall of Fame leaderboards.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-violet/30 via-[#1C1245] to-brand-pink/20 border border-brand-violet/40 text-center relative overflow-hidden shadow-brand-glow">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/15 blur-[90px] rounded-full pointer-events-none" />

          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
            Ready to Join the Classroom Arena?
          </h2>
          <p className="text-xs sm:text-sm text-casino-muted max-w-md mx-auto mt-2.5">
            53 verified MCA classmates, dynamic odds, and 1,000 complimentary starting coins.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3.5">
            <Link
              to="/register"
              className="w-full sm:w-auto casino-pink-button px-8 py-3.5 text-sm font-bold shadow-pink-glow"
            >
              Sign Up Now (Free 1,000 Coins)
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold text-white transition-all"
            >
              Log In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center text-xs text-casino-muted">
        <p className="font-mono">
          pariBet • Private MCA Class of 2025 • College of Engineering Chengannur
        </p>
        <p className="text-[11px] text-casino-muted/60 mt-1">
          Fictional tokens only. No real money gambling or external transactions.
        </p>
      </footer>
    </div>
  );
};

