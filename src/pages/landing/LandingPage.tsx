import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Coins,
  ArrowRight,
  Flame,
  Landmark,
  Users,
  Zap,
  Dice5,
  Star,
  Shuffle,
  PartyPopper,
  ChevronRight,
  CheckCircle2,
  Trophy,
  Menu,
  X,
  Crown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// 5 Fast Category Markets
const HERO_CATEGORIES = [
  {
    tag: 'BINARY',
    title: 'Yes / No Showdown',
    desc: 'Rapid 50/50 outcomes on surprise tests, teacher arrivals, and free periods.',
    odds: 'Up to 3.2x',
    btnText: 'Bet Yes/No',
    icon: '♠'
  },
  {
    tag: 'DERBY',
    title: 'Multi-Option Pools',
    desc: 'Wager on sports match stars, series test toppers, or batch champions.',
    odds: 'Up to 8.5x',
    btnText: 'View Markets',
    icon: '♥'
  },
  {
    tag: 'PRECISION',
    title: 'The Bullseye Guess',
    desc: 'Predict exact viva marks, seminar durations, or arrival minutes.',
    odds: 'Winner Takes All',
    btnText: 'Target Range',
    icon: '♦'
  },
  {
    tag: 'CONSENSUS',
    title: 'Syndicate Poll',
    desc: 'Democratic class voting stakes for Friday treats and class outings.',
    odds: 'Democratic Pot',
    btnText: 'Cast Vote',
    icon: '♣'
  },
  {
    tag: 'RESERVE',
    title: 'Token Bank Vault',
    desc: 'Emergency classmate bailouts and peer loans at flat transparent rates.',
    odds: '0% - 5% Interest',
    btnText: 'Bank Loans',
    icon: '🏦'
  }
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live Floor Bet Console State (Cleanly placed below hero image, NOT overlapping!)
  const [heroBetSide, setHeroBetSide] = useState<'YES' | 'NO'>('NO');
  const [heroStake, setHeroStake] = useState<number>(200);
  const [heroConfirmed, setHeroConfirmed] = useState<boolean>(false);

  // Interactive Mini-Roulette demo state
  const [selectedChip, setSelectedChip] = useState<number>(250);
  const [selectedSide, setSelectedSide] = useState<'RED' | 'BLACK' | 'GOLD'>('RED');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinResult, setSpinResult] = useState<{
    side: string;
    multiplier: number;
    won: boolean;
    winAmount: number;
  } | null>(null);

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    setTimeout(() => {
      const outcomes: Array<{ side: 'RED' | 'BLACK' | 'GOLD'; multiplier: number }> = [
        { side: 'RED', multiplier: 2.0 },
        { side: 'BLACK', multiplier: 2.0 },
        { side: 'RED', multiplier: 2.0 },
        { side: 'BLACK', multiplier: 2.0 },
        { side: 'GOLD', multiplier: 14.0 },
      ];
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      const won = outcome.side === selectedSide;
      const winAmount = won ? Math.round(selectedChip * outcome.multiplier) : 0;

      setSpinResult({
        side: outcome.side,
        multiplier: outcome.multiplier,
        won,
        winAmount
      });
      setIsSpinning(false);
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-transparent text-[#F3F4F6] overflow-x-hidden selection:bg-amber-500 selection:text-black font-sans">
      {/* 1. TOP MARQUEE TICKER */}
      <div className="bg-[#0B0C10] border-b border-white/5 py-2 overflow-hidden relative z-40">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-6 sm:gap-8 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 text-amber-300 font-extrabold bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30 shadow-sm">
            <span>🍗</span>
            <span>SEM 4 GRAND PRIZE: TOP 4 WIN FULL MANDHI SPONSORED BY ABHINAV (VARKKALA/PARI)</span>
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            CLASS VAULT: 64,800 PTS
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            NORMAL CLASS. ABNORMAL BETS.
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            CLAIM 1,000 FREE VIRTUAL PTS ON SIGNUP
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            EXCLUSIVE TO 53 MCA STUDENTS @ CECONLINE.EDU
          </span>
        </div>
      </div>

      {/* 2. HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#07080B]/90 backdrop-blur-xl border-b border-white/5 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <img
              src="/images/mca.png"
              alt="MCA"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain shrink-0 p-0.5 sm:p-1 bg-white/5 border border-white/10"
            />
            <img
              src="/images/logo.png"
              alt="pariBET"
              className="h-6 sm:h-8 w-auto object-contain shrink-0"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <a
              href="#grand-prize-mandhi"
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-bold"
            >
              <span>🍗</span>
              <span>Grand Prize</span>
            </a>
            <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
              How It Works
            </a>
            <a href="#categories" className="hover:text-amber-400 transition-colors">
              Markets
            </a>
            <a href="#roulette-demo" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <Dice5 className="w-3.5 h-3.5 text-amber-400" />
              <span>Spin & Win</span>
            </a>
            <a href="#poker-lounge" className="hover:text-amber-400 transition-colors">
              VIP Syndicate
            </a>
            <a href="#bank-vault" className="hover:text-amber-400 transition-colors">
              Token Vault
            </a>
          </nav>

          {/* Auth CTAs & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <Link
                to="/home"
                className="vip-gold-btn px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs font-bold flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shadow-gold-glow"
              >
                <span>Enter Table</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors whitespace-nowrap"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="vip-gold-btn px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-extrabold flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shadow-gold-glow"
                >
                  <Coins className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden xs:inline">Claim 1,000 PTS</span>
                  <span className="xs:hidden">1,000 PTS</span>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pt-4 pb-2 border-t border-white/10 mt-3 space-y-2 overflow-hidden"
            >
              <a
                href="#grand-prize-mandhi"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/30 text-amber-300 text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🍗</span>
                  <span>Sem 4 Grand Prize (Full Mandhi)</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-300">
                  TOP 4
                </span>
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
              >
                How It Works
              </a>
              <a
                href="#categories"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
              >
                Prediction Markets
              </a>
              <a
                href="#roulette-demo"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
              >
                <Dice5 className="w-3.5 h-3.5 text-amber-400" />
                <span>Mini-Roulette Demo</span>
              </a>
              <a
                href="#poker-lounge"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
              >
                VIP Table Rules
              </a>
              <a
                href="#bank-vault"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
              >
                Token Bank Vault
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. HERO SECTION — SHARP, ATTRACTIVE, CINEMATIC */}
      <section id="hero-stage" className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Ambient Red/Gold Radial Lighting */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-red-600/10 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[350px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (6 cols): Bold Betting Slogan & CTAs */}
          <div className="lg:col-span-6 relative z-10 space-y-5 sm:space-y-6 pt-2">
            {/* VIP Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111319] border border-amber-500/25 text-xs font-mono font-bold text-amber-400 shadow-sm"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>ROOM 204 CASINO ARENA</span>
              <span className="text-white/20">•</span>
              <span className="text-slate-400 font-normal">53 Verified MCA Students</span>
            </motion.div>

            {/* Grand Prize Callout Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <a
                href="#grand-prize-mandhi"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-transparent border border-amber-500/40 hover:border-amber-400 text-xs text-amber-300 transition-all group shadow-sm"
              >
                <span className="text-base">🍗</span>
                <span className="font-extrabold text-white">Sem 4 Grand Prize:</span>
                <span className="text-slate-300 hidden sm:inline">Full Mandhi Feast sponsored by</span>
                <span className="font-bold text-amber-400 underline decoration-amber-400/60">
                  Abhinav (Varkkala / pari)
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05]">
                NORMAL CLASS. <br />
                <span className="gold-shimmer-text drop-shadow-[0_0_35px_rgba(245,158,11,0.35)]">
                  ABNORMAL
                </span>{' '}
                BETS.
              </h1>
            </motion.div>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed"
            >
              <strong className="text-white font-semibold">Predict the nonsense. Risk your points. Beat your classmates.</strong>{' '}
              Your class has entered the high-stakes world of completely unnecessary predictions. Real-time pari-mutuel odds, virtual points only, zero real money.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1"
            >
              <Link
                to={user ? "/discover" : "/register"}
                className="vip-gold-btn px-8 py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow group cursor-pointer"
              >
                <span>ENTER THE TABLE →</span>
              </Link>

              <Link
                to="/discover"
                className="px-6 py-3.5 rounded-xl bg-[#12141C] hover:bg-[#1A1D28] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all hover:border-amber-400/40"
              >
                <span>VIEW LIVE BETS</span>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-5 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified <code className="text-amber-400 font-mono">@ceconline.edu</code> Roster
              </span>
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                Virtual PTS Only (Risk Free)
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                Zero House Advantage
              </span>
            </div>
          </div>

          {/* Right Column (6 cols): Cinematic Movie-Still Artwork with Stacked Live Console (NO OVERLAP) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="lg:col-span-6 flex flex-col space-y-4"
          >
            {/* The Cinematic Classroom Artwork with Feathered Edges */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <img
                src="/images/classbet-hero.png"
                alt="Classroom Casino Action"
                className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-700"
              />

              {/* Feathered dark gradient edges for movie-still feel */}
              <div className="absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#07080B]/80 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-10 sm:h-16 bg-gradient-to-t from-[#07080B]/90 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-8 sm:h-12 bg-gradient-to-b from-[#07080B]/70 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-6 sm:w-12 bg-gradient-to-l from-[#07080B]/80 to-transparent pointer-events-none" />

              {/* Floating Multiplier Badge */}
              <div className="absolute top-3 right-3 bg-[#0B0C10]/90 backdrop-blur-md border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-mono font-bold text-amber-400">Up to 8.4x Returns</span>
              </div>
            </div>

            {/* LIVE FLOOR BET CONSOLE (CLEANLY POSITIONED BENEATH THE IMAGE, NO OVERLAPPING!) */}
            <div className="bg-[#0B0C12]/95 backdrop-blur-xl border border-amber-500/35 rounded-2xl p-4 sm:p-5 shadow-2xl">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-1.5 font-mono text-rose-400 font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                  <span>🔴 LIVE BET</span>
                </div>
                <span className="font-mono text-[11px] text-amber-400 font-semibold">
                  Pool: 1,420 PTS
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-white mb-2 leading-tight">
                WILL RAHUL BE EARLY TODAY?
              </h4>

              {/* Split Odds Bar */}
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-emerald-400 font-bold">YES 38% (2.6x)</span>
                <span className="text-rose-400 font-bold">NO 62% (1.6x)</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden flex mb-2.5">
                <div className="bg-emerald-500 h-full" style={{ width: '38%' }} />
                <div className="bg-rose-500 h-full" style={{ width: '62%' }} />
              </div>

              {/* Recent Bet Ticker */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-3">
                <span className="truncate">Recent bet: Anand put 200 PTS on NO</span>
                <span className="text-slate-500 shrink-0">2m ago</span>
              </div>

              {/* Quick Interactive Staking Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setHeroBetSide('YES');
                    setHeroConfirmed(true);
                    setTimeout(() => setHeroConfirmed(false), 2500);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    heroBetSide === 'YES'
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400/40 shadow-sm'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/30'
                  }`}
                >
                  <span>YES (2.6x)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHeroBetSide('NO');
                    setHeroConfirmed(true);
                    setTimeout(() => setHeroConfirmed(false), 2500);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    heroBetSide === 'NO'
                      ? 'bg-rose-500/25 border-rose-400 text-rose-300 ring-1 ring-rose-400/40 shadow-sm'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-400 hover:bg-rose-900/30'
                  }`}
                >
                  <span>NO (1.6x)</span>
                </button>
              </div>

              {heroConfirmed && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 text-center text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg py-1.5"
                >
                  ✨ Simulated {heroStake} PTS committed on {heroBetSide}! Enter table to stake live.
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. SEMESTER 4 GRAND PRIZE SHOWCASE — FULL MANDHI SPONSORED BY ABHINAV (VARKKALA / PARI) */}
      <section id="grand-prize-mandhi" className="py-8 sm:py-14 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-black/70 via-[#180a0f]/80 to-black/70 backdrop-blur-2xl border-2 border-amber-400/40 p-5 sm:p-8 lg:p-10 shadow-[0_0_60px_rgba(245,158,11,0.2)] overflow-hidden">
          {/* Ambient lighting */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/15 blur-[140px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left 6 cols: Official Mandhi Feast Poster Artwork */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl group">
                <img
                  src="/public/assets/aistudio/Sponsored_Mandhi_Feast_Poster_e8b7457a.png"
                  alt="Semester 4 Grand Prize Full Mandhi Sponsored by Abhinav"
                  className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.indexOf('Sponsored_Mandhi_Feast_Poster') !== -1) {
                      target.src = '/assets/aistudio/Sponsored_Mandhi_Feast_Poster_e8b7457a.png';
                    }
                  }}
                />

                {/* Bottom Bar inside image */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>OFFICIAL BATCH SPONSOR</span>
                    </div>
                    <p className="text-sm font-extrabold text-white">
                      Abhinav <span className="text-amber-400">(Varkkala / Pari)</span>
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-amber-400 text-black px-2.5 py-1 rounded-lg shadow-gold-glow">
                    TOP 4 ONLY
                  </span>
                </div>

                {/* Floating Top Badge */}
                <div className="absolute top-3 left-3 bg-[#0B0C10]/90 backdrop-blur-md border border-amber-500/40 px-3 py-1 rounded-xl flex items-center gap-2 shadow-xl">
                  <span className="text-base">🍗</span>
                  <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wide">
                    Full Mandhi Grand Prize
                  </span>
                </div>
              </div>
            </div>

            {/* Right 6 cols: Prize Details & Qualification Criteria */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>End of Semester 4 Grand Prize</span>
                </span>
                <h2 className="font-display font-black text-2xl sm:text-4xl text-white mt-2 leading-tight">
                  Feast Like Kings:{' '}
                  <span className="gold-shimmer-text">Full Mandhi for Top 4</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  The ultimate reward in MCA batch history! At the conclusion of Semester 4, the top 4 players leading the classroom Hall of Fame will sit down for a glorious, authentic full chicken Mandhi platter with steaming fragrant rice, fiery dips, and sides.
                </p>
              </div>

              {/* Sponsor Card */}
              <div className="p-3.5 rounded-2xl bg-black/45 border border-amber-500/25 backdrop-blur-xl flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-xl shrink-0 text-black shadow-gold-glow">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-bold text-white">Proudly Sponsored by Abhinav</h4>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/25 font-bold">
                      Varkkala / Pari
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-snug">
                    "Play smart, back your convictions, and climb the rankings. When Sem 4 wraps up, the full Mandhi feast is on me for the top 4 masters of the pot."
                  </p>
                </div>
              </div>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                    <span>🏆</span>
                    <span>Top 4 Standings</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    4 highest points earners at Sem 4 end qualify.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                    <span>🍗</span>
                    <span>Full Platter Feast</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Whole spiced chicken, Mandhi rice & dips.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                    <span>👥</span>
                    <span>Classroom Royalty</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Celebrate graduation finale together.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                    <span>⚡</span>
                    <span>Virtual PTS Only</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Zero real money risk. Pure prediction prowess.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to={user ? "/leaderboard" : "/register"}
                  className="vip-gold-btn px-6 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow cursor-pointer"
                >
                  <span>{user ? "Check Live Standings" : "Sign Up & Chase the Mandhi"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-[11px] text-slate-400 text-center sm:text-left font-mono">
                  53 Verified MCA Students Eligible
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS — SLEEK 4-STEP CARDS */}
      <section id="how-it-works" className="py-10 sm:py-14 px-4 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/25 text-xs font-mono font-bold uppercase mb-2">
            <Zap className="w-3.5 h-3.5" /> 4 Simple Steps
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            How The Class Casino Works
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Zero real cash, pure classroom mathematics, dynamic pari-mutuel odds, and bragging rights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-amber-400/30 transition-all">
            <div className="text-2xl font-mono font-black text-amber-400 mb-1.5">01</div>
            <h3 className="text-sm font-bold text-white mb-1">PREDICT</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Spot an absurd classroom market: surprise tests, seminar length, or cafeteria specials.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-amber-400/30 transition-all">
            <div className="text-2xl font-mono font-black text-amber-400 mb-1.5">02</div>
            <h3 className="text-sm font-bold text-white mb-1">BET</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lock in your virtual PTS directly from the card with live pari-mutuel payout calculators.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-amber-400/30 transition-all">
            <div className="text-2xl font-mono font-black text-amber-400 mb-1.5">03</div>
            <h3 className="text-sm font-bold text-white mb-1">WAIT</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watch real-life classroom chaos unfold in Room 204 as faculty and peers determine the outcome.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-amber-400/30 transition-all">
            <div className="text-2xl font-mono font-black text-amber-400 mb-1.5">04</div>
            <h3 className="text-sm font-bold text-white mb-1">FLEX</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Collect your distributed winnings, climb the Hall of Fame, and qualify for the Sem 4 Mandhi feast.
            </p>
          </div>
        </div>
      </section>

      {/* 6. DOCKED 5 CATEGORY CARDS */}
      <section id="categories" className="py-6 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {HERO_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl bg-black/35 backdrop-blur-xl border border-white/10 hover:border-amber-500/40 hover:bg-[#140b10]/50 transition-all duration-200 flex flex-col justify-between group shadow-xl hover:shadow-card-glow hover:-translate-y-0.5 ${
                idx === 4 ? 'col-span-2 md:col-span-1 lg:col-span-1' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl text-amber-400 font-mono">{cat.icon}</span>
                  <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                    {cat.tag}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400">
                  {cat.odds}
                </span>
                <Link
                  to={user ? "/discover" : "/register"}
                  className="text-[11px] font-bold text-slate-300 group-hover:text-amber-400 flex items-center gap-0.5 transition-colors"
                >
                  <span>{cat.btnText}</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. INTERACTIVE ROULETTE MINI-GAME (FUN & ENGAGING) */}
      <section id="roulette-demo" className="py-12 sm:py-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 4 cols: Artwork */}
            <div className="lg:col-span-4 relative flex flex-col items-center">
              <div className="relative w-full max-w-[300px] rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
                <img
                  src="/images/roulette-master.jpg"
                  alt="pariBET Roulette Specialist"
                  className="w-full aspect-[4/5] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D12] via-[#0C0D12]/20 to-transparent opacity-70 pointer-events-none" />

                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#08090C]/90 backdrop-blur-md border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                      Single-Zero Table
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">14.0x Max Payout</span>
                  </div>
                  <p className="text-xs font-semibold text-white mt-1">
                    "Play the odds, never the house."
                  </p>
                </div>
              </div>
            </div>

            {/* Right 8 cols: Interactive Controls */}
            <div className="lg:col-span-8 space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/25 text-xs font-mono font-bold uppercase mb-2">
                  <Dice5 className="w-3.5 h-3.5" /> Interactive Odds Test
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                  Try Your Luck: The pariBET Mini-Roulette
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Pick your chips, choose an outcome, and spin to simulate dynamic pari-mutuel payouts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                {/* Controls (6 cols) */}
                <div className="md:col-span-6 space-y-4 bg-black/35 backdrop-blur-xl p-5 rounded-2xl border border-white/10">
                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-slate-400 block mb-2">
                      1. Virtual Chips Stake
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 250, 500, 1000].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setSelectedChip(chip)}
                          className={`py-2 px-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                            selectedChip === chip
                              ? 'bg-amber-500 text-black shadow-gold-glow scale-105'
                              : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] backdrop-blur-sm border border-white/10'
                          }`}
                        >
                          <span>🪙 {chip}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-slate-400 block mb-2">
                      2. Choose Wager
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedSide('RED')}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          selectedSide === 'RED'
                            ? 'bg-rose-950/70 border-rose-500 text-rose-300 shadow-sm'
                            : 'bg-white/[0.05] border-white/10 text-slate-400 hover:bg-white/[0.1] backdrop-blur-sm'
                        }`}
                      >
                        <div className="text-xs font-bold">RED</div>
                        <div className="text-[10px] font-mono text-amber-400">2.0x</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedSide('BLACK')}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          selectedSide === 'BLACK'
                            ? 'bg-slate-800 border-white text-white shadow-sm'
                            : 'bg-white/[0.05] border-white/10 text-slate-400 hover:bg-white/[0.1] backdrop-blur-sm'
                        }`}
                      >
                        <div className="text-xs font-bold">BLACK</div>
                        <div className="text-[10px] font-mono text-amber-400">2.0x</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedSide('GOLD')}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          selectedSide === 'GOLD'
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                            : 'bg-white/[0.05] border-white/10 text-slate-400 hover:bg-white/[0.1] backdrop-blur-sm'
                        }`}
                      >
                        <div className="text-xs font-bold">JACKPOT</div>
                        <div className="text-[10px] font-mono text-amber-400">14.0x</div>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSpinWheel}
                    disabled={isSpinning}
                    className="w-full vip-gold-btn py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-gold-glow"
                  >
                    {isSpinning ? (
                      <>
                        <Shuffle className="w-4 h-4 animate-spin text-black" />
                        <span>Spinning Wheel...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>Spin ({selectedChip} PTS)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Display (6 cols) */}
                <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-black/35 backdrop-blur-xl rounded-2xl border border-white/10 text-center min-h-[240px]">
                  {isSpinning ? (
                    <div className="flex flex-col items-center gap-3 py-6">
                      <motion.div
                        animate={{ rotate: 1080 }}
                        transition={{ duration: 1.1, ease: 'easeInOut' }}
                        className="w-16 h-16 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center bg-[#171822] text-2xl font-black text-white"
                      >
                        🎲
                      </motion.div>
                      <p className="text-xs font-mono text-amber-400 animate-pulse font-medium">
                        Calculating pari-mutuel odds...
                      </p>
                    </div>
                  ) : spinResult ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center gap-2.5"
                    >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg bg-[#181A24] border border-amber-400/40">
                        {spinResult.won ? '🏆' : '💀'}
                      </div>

                      <div className="text-sm font-bold text-white">
                        Outcome: <span className="font-mono text-amber-400">{spinResult.side}</span>
                      </div>

                      {spinResult.won ? (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 max-w-xs">
                          <div className="font-bold text-xs flex items-center justify-center gap-1.5">
                            <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
                            <span>Win: +{spinResult.winAmount} PTS</span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1">
                            Hit {spinResult.multiplier}x return! Claim your real 1,000 starting tokens to join live student markets.
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 max-w-xs">
                          <div className="font-bold text-xs">No hit this spin</div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            All verified MCA peers start with 1,000 free tokens.
                          </p>
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={handleSpinWheel}
                          className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-all cursor-pointer"
                        >
                          Spin Again
                        </button>
                        <Link
                          to="/register"
                          className="vip-gold-btn px-3.5 py-1.5 text-xs font-bold whitespace-nowrap shrink-0 shadow-gold-glow cursor-pointer"
                        >
                          Claim 1,000 PTS
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#181924] flex items-center justify-center text-2xl border border-white/10">
                        🎰
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1">Ready for a spin?</h3>
                      <p className="text-xs text-slate-400 max-w-xs">
                        Select your chip stake on the left and hit spin to preview the pari-mutuel odds payout.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. VIP TABLE SYNDICATE RULES & ROSTER GUARANTEE */}
      <section id="poker-lounge" className="py-14 px-4 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Cinematic Artwork */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <img
                src="/images/casino-royale-vip.jpg"
                alt="Casino Royale VIP Poker Lounge"
                className="w-full h-auto aspect-[4/3] object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080B]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 right-3 bg-[#0B0C10]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 shadow-xl">
                <span className="text-amber-400 font-bold">CASINO ROYALE VIP</span> • 53 MCA Syndicate
              </div>
            </div>
          </div>

          {/* Right: Syndicate Perks */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                The VIP Table
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1.5">
                Casino Royale Meets{' '}
                <span className="gold-shimmer-text">College Syndicate</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Traditional betting sites take steep house cuts and match you with strangers. pariBET is built strictly for the 53 students of our MCA batch — the winner pool is shared entirely among classmates.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="p-3.5 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Dynamic Pari-Mutuel Odds</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Odds adjust dynamically as bets are placed. Zero house advantage — the winning side takes the entire pot.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">53-Student Roster Whitelist</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Every user is verified via <code className="text-amber-400">@ceconline.edu</code>. You only play against peers you know.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 flex items-start gap-3">
                <Landmark className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Token Bank Bailouts</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Busted out on a wild bet? Request emergency peer loans with 0% - 5% flat rates to jump straight back in.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={user ? "/home" : "/register"}
                className="vip-gold-btn px-6 py-2.5 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-gold-glow"
              >
                <span>Take a Seat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TOKEN BANK VAULT (chip-stacker-vault.jpg) */}
      <section id="bank-vault" className="py-14 px-4 lg:px-8 max-w-7xl mx-auto border-t border-white/5 scroll-mt-20">
        <div className="rounded-3xl bg-black/40 backdrop-blur-2xl p-6 sm:p-10 lg:p-12 border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 cols: Information */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/25 text-xs font-mono font-bold uppercase">
                <Landmark className="w-3.5 h-3.5" /> Classroom Central Reserve
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
                Never Stay Broke:{' '}
                <span className="gold-shimmer-text">The Token Bank</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Ran out of points on an ambitious prediction? The integrated peer lending vault lets you request instant classmate loans at flat rates backed by peer trust.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-4 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-amber-400/30 transition-all">
                  <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>Emergency Loans</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Borrow up to 2,000 points from peers with transparent flat terms.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-amber-400/30 transition-all">
                  <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span>Peer Interest Earnings</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Fund peer loans and collect guaranteed 0% - 5% returns on repaid debts.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={user ? "/bank" : "/register"}
                  className="vip-gold-btn px-6 py-2.5 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-gold-glow cursor-pointer"
                >
                  <span>Open Token Bank Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right 5 cols: Cinematic Artwork with chip-stacker-vault.jpg (FULL UNCROPPED IMAGE) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-white/15 shadow-2xl group bg-[#08090D]">
                <img
                  src="/images/chip-stacker-vault.jpg"
                  alt="Token Bank Vault"
                  className="w-full h-auto object-contain block transform group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="p-3 bg-[#08090C]/95 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                    Central Reserve Vault
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    Instant Peer Liquidity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-white/5 bg-[#050608] py-10 px-4 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-3">
            <img src="/images/mca.png" alt="MCA" className="w-7 h-7 object-contain opacity-70" />
            <img src="/images/logo.png" alt="pariBET" className="h-5 w-auto object-contain opacity-80" />
          </div>
          <p className="max-w-xl mx-auto text-slate-400 leading-relaxed text-[11px]">
            pariBET is an exclusive private classroom prediction club engineered for 53 MCA students at College of Engineering Chengannur. Strictly zero real-currency gambling. All wagers use virtual classroom points (PTS).
          </p>
          <div className="pt-1 text-[11px] font-mono text-amber-400/80">
            NORMAL CLASS. ABNORMAL BETS. • SEM 4 GRAND PRIZE SPONSORED BY ABHINAV (VARKKALA / PARI)
          </div>
          <div className="text-[10px] text-slate-600">
            © {new Date().getFullYear()} College of Engineering Chengannur MCA Syndicate.
          </div>
        </div>
      </footer>
    </div>
  );
};
