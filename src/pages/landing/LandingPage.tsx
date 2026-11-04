import React, { useState } from 'react';
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
  Users,
  Zap,
  Dice5,
  Star,
  Clock,
  Shuffle,
  PartyPopper,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// 5 Quick Category Cards (Docked under hero, matching reference architecture)
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

// Live Betting Markets
const LIVE_MARKETS = [
  {
    id: 'bet-1',
    category: 'CAMPUS DRAMA',
    title: 'Will Compiler Design Lab Viva finish before 1:00 PM?',
    pool: '5,800',
    participants: 28,
    closesIn: 'Closes in 2h 15m',
    options: [
      { name: 'YES', multiplier: '1.55x', percentage: 65 },
      { name: 'NO', multiplier: '2.85x', percentage: 35 }
    ]
  },
  {
    id: 'bet-2',
    category: 'COLLEGE SPORTS',
    title: 'MCA Cricket League: Who hits maximum sixes in Finals?',
    pool: '12,400',
    participants: 41,
    closesIn: 'Closes tomorrow',
    options: [
      { name: 'Midhun (Striker)', multiplier: '2.10x', percentage: 48 },
      { name: 'Arun (Opener)', multiplier: '3.40x', percentage: 30 },
      { name: 'Field (Others)', multiplier: '4.50x', percentage: 22 }
    ]
  },
  {
    id: 'bet-3',
    category: 'ACADEMIC BULLSEYE',
    title: 'Closest Guess: Class highest score in Machine Learning Series test (out of 50)',
    pool: '8,250',
    participants: 34,
    closesIn: 'Closes Friday',
    options: [
      { name: '46 - 47', multiplier: '2.20x', percentage: 40 },
      { name: '48 - 49', multiplier: '3.10x', percentage: 35 },
      { name: 'Perfect 50', multiplier: '5.80x', percentage: 25 }
    ]
  },
  {
    id: 'bet-4',
    category: 'CANTEEN POLL',
    title: 'Group Decision: Where is the Post-Internship Class Treat?',
    pool: '15,600',
    participants: 49,
    closesIn: 'Closes Sunday',
    options: [
      { name: 'Kochi Cafe Crawl', multiplier: '1.90x', percentage: 52 },
      { name: 'Chengannur Biryani Feast', multiplier: '2.15x', percentage: 48 }
    ]
  }
];

const LEADERBOARD_PREVIEW = [
  { rank: 1, name: 'Midhun "The Whale"', coins: '24,850', winRate: '78%', badge: '👑 High Roller King' },
  { rank: 2, name: 'Ananya "The Sharp"', coins: '19,400', winRate: '72%', badge: '⚡ Odds Whisperer' },
  { rank: 3, name: 'Rahul "All-In"', coins: '16,200', winRate: '65%', badge: '🎲 Wild Gambler' },
  { rank: 4, name: 'Fathima "Underdog"', coins: '14,750', winRate: '69%', badge: '🎯 Precision Ace' },
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  // Mini roulette demo state
  const [selectedChip, setSelectedChip] = useState<number>(250);
  const [selectedSide, setSelectedSide] = useState<'RED' | 'BLACK' | 'GOLD'>('RED');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinResult, setSpinResult] = useState<{ side: string; multiplier: number; won: boolean; winAmount: number } | null>(null);

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
    <div className="min-h-screen bg-[#07080B] text-[#F3F4F6] overflow-x-hidden selection:bg-amber-500 selection:text-black font-sans">
      {/* 1. TOP MARQUEE TICKER (Minimalist Obsidian & Gold) */}
      <div className="bg-[#0B0C10] border-b border-white/5 py-2 overflow-hidden relative z-50">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            CLASS VAULT JACKPOT: 64,800 🪙
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            LATEST WIN: Midhun won 3,450 🪙 on "Surprise Lab Test" (2.3x)
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            WELCOME BONUS: 1,000 FREE COINS ON SIGNUP
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            HOT POOL: "Will Friday 4th period be free?" (7,400 🪙 Pool)
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            EXCLUSIVE TO 53 MCA STUDENTS @ CECONLINE.EDU
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            CLASS VAULT JACKPOT: 64,800 🪙
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            LATEST WIN: Midhun won 3,450 🪙 on "Surprise Lab Test" (2.3x)
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            WELCOME BONUS: 1,000 FREE COINS ON SIGNUP
          </span>
        </div>
      </div>

      {/* 2. HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#07080B]/90 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo: pariBET */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-gold-glow">
              <div className="w-full h-full bg-[#0B0C10] rounded-[7px] flex items-center justify-center">
                <span className="font-display font-black text-lg text-amber-400">P</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-2xl tracking-tight text-white">
                pari<span className="text-amber-400">BET</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-400 font-bold border border-amber-400/25 ml-1">
                MCA
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <a href="#hero-stage" className="hover:text-amber-400 transition-colors">Stage</a>
            <a href="#categories" className="hover:text-amber-400 transition-colors">Markets</a>
            <a href="#roulette-demo" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <Dice5 className="w-3.5 h-3.5 text-amber-400" />
              <span>Spin & Win</span>
            </a>
            <a href="#poker-lounge" className="hover:text-amber-400 transition-colors">VIP Lounge</a>
            <a href="#live-markets" className="hover:text-amber-400 transition-colors">Live Bets</a>
            <a href="#winners-circle" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
              <span>Squad</span>
            </a>
            <a href="#bank-vault" className="hover:text-amber-400 transition-colors">Vault</a>
          </nav>

          {/* Auth CTA */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/home"
                className="vip-gold-btn px-5 py-2 text-xs font-bold flex items-center gap-2"
              >
                <span>Enter Gaming Lounge</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="vip-gold-btn px-4 py-2 text-xs font-extrabold flex items-center gap-1.5"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Claim 1,000 Coins</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION — SPLIT LAYOUT WITH FEATHERED EDGES */}
      <section id="hero-stage" className="relative pt-8 sm:pt-14 pb-16 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Ambient Gold Glow in the background */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-amber-500/5 blur-[160px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column (6 cols): Bold Betting Typography & CTAs */}
          <div className="lg:col-span-6 relative z-10 space-y-6">
            {/* VIP Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111319] border border-amber-500/20 text-xs font-mono font-bold text-amber-400 shadow-sm"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>PRIVATE MCA GAMING CLUB</span>
              <span className="text-white/20">•</span>
              <span className="text-slate-400 font-normal">53 Verified Members</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]"
            >
              Predict with Friends.{' '}
              <br />
              <span className="gold-shimmer-text">
                Win the Pot.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed"
            >
              The private social prediction lounge exclusively for 53 MCA classmates at College of Engineering Chengannur. Dynamic pari-mutuel odds, virtual tokens, and zero real money.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2"
            >
              {user ? (
                <Link
                  to="/home"
                  className="vip-gold-btn px-8 py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="vip-gold-btn px-7 py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 group"
                  >
                    <Coins className="w-4 h-4" />
                    <span>Claim 1,000 Free Coins</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href="#live-markets"
                    className="px-6 py-3.5 rounded-xl bg-[#12141C] hover:bg-[#1A1D28] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
                  >
                    <span>View Active Odds</span>
                  </a>
                </>
              )}
            </motion.div>

            {/* Quick Trust Badges */}
            <div className="pt-3 flex flex-wrap items-center gap-5 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified <code className="text-amber-400 font-mono">@ceconline.edu</code> Roster
              </span>
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                100% Risk Free Virtual Tokens
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-slate-300" />
                Real-Time Pari-Mutuel Pools
              </span>
            </div>
          </div>

          {/* Right Column (6 cols): Cinematic Artwork with Feathered Edges (NO SOLID BOX) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            {/* The Image Container with Feathered Gradients on all sides */}
            <div className="relative w-full max-w-xl">
              {/* Actual Image */}
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/images/classbet-hero.png"
                  alt="pariBET Classroom Action"
                  className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700"
                />

                {/* Left Edge Feather Fade: Softly blends into the left column */}
                <div className="absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#07080B] to-transparent pointer-events-none" />

                {/* Bottom Edge Feather Fade: Softly blends into background */}
                <div className="absolute inset-x-0 bottom-0 h-24 sm:h-36 bg-gradient-to-t from-[#07080B] to-transparent pointer-events-none" />

                {/* Top Edge Feather Fade */}
                <div className="absolute inset-x-0 top-0 h-16 sm:h-20 bg-gradient-to-b from-[#07080B] to-transparent pointer-events-none" />

                {/* Right Edge Feather Fade */}
                <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[#07080B] to-transparent pointer-events-none" />
              </div>

              {/* Floating Minimalist VIP Pill Badge */}
              <div className="absolute bottom-4 left-4 bg-[#0B0C10]/90 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Today's Pool</span>
                  <span className="text-xs font-bold text-amber-400">48,200 🪙 Total Staked</span>
                </div>
              </div>

              {/* Multiplier Badge */}
              <div className="absolute top-4 right-4 bg-[#0B0C10]/90 backdrop-blur-md border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-400">Up to 8.4x Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. DOCKED 5 CATEGORY CARDS (Minimalist Slate & Gold Accent) */}
      <section id="categories" className="py-6 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {HERO_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-[#0E0F15] border border-white/5 hover:border-amber-500/30 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:-translate-y-0.5"
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
                  to={user ? "/home" : "/register"}
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

      {/* 5. INTERACTIVE ROULETTE MINI-GAME (Minimalist VIP Slate & Gold) */}
      <section id="roulette-demo" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-[#0C0D12] border border-white/8 p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Subtle gold accent light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 4 cols: Cinematic Artwork with Natural Framing */}
            <div className="lg:col-span-4 relative flex flex-col items-center">
              <div className="relative w-full max-w-[320px] rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
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

            {/* Right 8 cols: Title & Interactive Controls */}
            <div className="lg:col-span-8 space-y-6">
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
                <div className="md:col-span-6 space-y-4 bg-[#12131A] p-5 rounded-2xl border border-white/5">
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
                          className={`py-2 px-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                            selectedChip === chip
                              ? 'bg-amber-500 text-black shadow-gold-glow scale-105'
                              : 'bg-[#181A24] text-slate-300 hover:bg-[#202230] border border-white/5'
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
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                          selectedSide === 'RED'
                            ? 'bg-rose-950/70 border-rose-500 text-rose-300 shadow-sm'
                            : 'bg-[#181A24] border-white/5 text-slate-400 hover:bg-[#202230]'
                        }`}
                      >
                        <div className="text-xs font-bold">RED</div>
                        <div className="text-[10px] font-mono text-amber-400">2.0x</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedSide('BLACK')}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                          selectedSide === 'BLACK'
                            ? 'bg-slate-800 border-white text-white shadow-sm'
                            : 'bg-[#181A24] border-white/5 text-slate-400 hover:bg-[#202230]'
                        }`}
                      >
                        <div className="text-xs font-bold">BLACK</div>
                        <div className="text-[10px] font-mono text-amber-400">2.0x</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedSide('GOLD')}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                          selectedSide === 'GOLD'
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                            : 'bg-[#181A24] border-white/5 text-slate-400 hover:bg-[#202230]'
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
                    className="w-full vip-gold-btn py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSpinning ? (
                      <>
                        <Shuffle className="w-4 h-4 animate-spin text-black" />
                        <span>Spinning Wheel...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>Spin ({selectedChip} 🪙)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Display (6 cols) */}
                <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-[#101117] rounded-2xl border border-white/5 text-center min-h-[260px]">
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
                            <span>Win: +{spinResult.winAmount} 🪙</span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1">
                            Hit {spinResult.multiplier}x return! Claim your real 1,000 starting tokens to join live student markets.
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 max-w-xs">
                          <div className="font-bold text-xs">No hit this spin</div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            All verified MCA peers start with 1,000 free coins.
                          </p>
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={handleSpinWheel}
                          className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-all"
                        >
                          Spin Again
                        </button>
                        <Link
                          to="/register"
                          className="vip-gold-btn px-3.5 py-1.5 text-xs font-bold"
                        >
                          Claim 1,000 Coins
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

      {/* 6. VIP POKER LOUNGE WITH FEATHERED EDGES (casino-royale-vip.jpg) */}
      <section id="poker-lounge" className="py-20 px-4 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: The Cinematic Artwork with Feathered Edges */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-xl">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
                <img
                  src="/images/casino-royale-vip.jpg"
                  alt="Casino Royale VIP Poker Lounge"
                  className="w-full h-auto aspect-[4/3] object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-700"
                />

                {/* Subtle Edge Vignettes — Keeps the entire table, chips and faces visible */}
                <div className="absolute inset-y-0 right-0 w-10 sm:w-16 bg-gradient-to-l from-[#07080B]/70 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-12 sm:h-16 bg-gradient-to-t from-[#07080B]/80 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-8 sm:h-12 bg-gradient-to-b from-[#07080B]/60 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-10 sm:w-16 bg-gradient-to-r from-[#07080B]/70 to-transparent pointer-events-none" />
              </div>

              {/* Minimalist Floating Label */}
              <div className="absolute bottom-4 right-4 bg-[#0B0C10]/90 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl text-xs font-mono text-slate-300 shadow-xl">
                <span className="text-amber-400 font-bold">CASINO ROYALE VIP</span> • Daniel Craig & The Syndicate
              </div>
            </div>
          </div>

          {/* Right: VIP Table Rules & Roster Guarantee */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                The VIP Table
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white mt-2 leading-tight">
                Casino Royale Meets{' '}
                <span className="gold-shimmer-text">College Syndicate</span>
              </h2>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Traditional betting sites take steep house cuts and match you with strangers. pariBET is built strictly for the 53 students of our MCA batch — the winner pool is shared entirely among classmates.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-[#0E0F15] border border-white/5 flex items-start gap-3.5">
                <TrendingUp className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Dynamic Pari-Mutuel Odds</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Odds adjust dynamically as bets are placed. Zero house advantage — the winning side takes the entire pot.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0E0F15] border border-white/5 flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">53-Student Roster Whitelist</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Every user is verified via <code className="text-amber-400">@ceconline.edu</code>. You only play against people you know.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0E0F15] border border-white/5 flex items-start gap-3.5">
                <Landmark className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Peer Bank Bailouts</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Busted out on a wild bet? Request emergency peer loans with 0% - 5% flat rates to jump straight back in.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/register"
                className="vip-gold-btn px-7 py-3 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2"
              >
                <span>Take a Seat</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIVE BETTING FLOOR (Active Markets) */}
      <section id="live-markets" className="py-20 px-4 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/25 text-xs font-mono font-bold uppercase mb-2">
            <Flame className="w-3.5 h-3.5" /> Live Markets
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
            The Active Betting Floor
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Real prediction pools launched and staked by your classmates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {LIVE_MARKETS.map((market) => (
            <div
              key={market.id}
              className="p-6 rounded-2xl bg-[#0E0F15] border border-white/5 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-bold">
                  {market.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{market.closesIn}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                {market.title}
              </h3>

              <div className="mt-4 flex items-center justify-between text-xs font-mono py-2 px-3 rounded-xl bg-[#13151D] border border-white/5">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Coins className="w-4 h-4" />
                  <span>POT: {market.pool} 🪙</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{market.participants} Bets Placed</span>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                {market.options.map((opt, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{opt.name}</span>
                      <span className="font-mono font-bold text-amber-400">
                        {opt.multiplier} <span className="text-slate-500 text-[10px]">({opt.percentage}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#181A24] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${opt.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">Pari-Mutuel Rules</span>
                <Link
                  to={user ? "/home" : "/register"}
                  className="vip-gold-btn px-4 py-1.5 text-xs font-bold flex items-center gap-1"
                >
                  <span>Place Stake</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7.5 THE WINNER'S CIRCLE & SQUAD GLORY (squad-celebration.jpg) */}
      <section id="winners-circle" className="py-20 px-4 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Squad Celebration Artwork with Natural Aspect & Soft Edge Blend */}
          <div className="lg:col-span-6 relative flex items-center justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-md">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
                <img
                  src="/images/squad-celebration.jpg"
                  alt="pariBET Squad Victory at the Casino Table"
                  className="w-full h-auto aspect-[9/14] object-cover object-top transform group-hover:scale-[1.02] transition-transform duration-700"
                />

                {/* Gentle edge blending — leaves craps table, chips, and faces fully visible */}
                <div className="absolute inset-y-0 right-0 w-8 sm:w-12 bg-gradient-to-l from-[#07080B]/60 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-10 sm:h-14 bg-gradient-to-t from-[#07080B]/70 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-8 sm:h-10 bg-gradient-to-b from-[#07080B]/50 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-[#07080B]/60 to-transparent pointer-events-none" />
              </div>

              {/* Floating Winning Pill */}
              <div className="absolute bottom-4 left-4 bg-[#0B0C10]/90 backdrop-blur-md border border-amber-500/30 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-xl">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Top Syndicate Win</span>
                  <span className="text-xs font-bold text-amber-400">+14,500 🪙 Distributed</span>
                </div>
              </div>

              {/* Floating Roster Badge */}
              <div className="absolute top-4 right-4 bg-[#0B0C10]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-1.5 shadow-xl">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Peer Return</span>
              </div>
            </div>
          </div>

          {/* Right: Narrative & Syndicate Perks */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
                The Winner's Circle
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white mt-2 leading-tight">
                Nothing Hits Harder Than{' '}
                <span className="gold-shimmer-text">Winning With The Squad</span>
              </h2>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Whether you called the lab viva duration down to the minute, backed the batch striker in the cricket cup, or pooled coins for Friday treat polls — every single token won stays within our 53 classmates.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-[#0E0F15] border border-white/5 flex items-start gap-3.5">
                <Users className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Zero House Rake</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    No middlemen or casino profit margins. The entire pool is mathematically distributed among winners.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0E0F15] border border-white/5 flex items-start gap-3.5">
                <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Instant Class Payouts</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Smart resolution ensures coins hit your balance the second the official market is finalized.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={user ? "/home" : "/register"}
                className="vip-gold-btn px-6 py-3 text-xs font-extrabold inline-flex items-center gap-2"
              >
                <span>Join the Next Syndicate</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TOKEN BANK VAULT (chip-stacker-vault.jpg) */}
      <section id="bank-vault" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="rounded-3xl bg-[#0D0E14] p-8 sm:p-12 border border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 cols: Information */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/25 text-xs font-mono font-bold uppercase">
                <Landmark className="w-3.5 h-3.5" /> Classroom Central Reserve
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
                Never Stay Broke:{' '}
                <span className="gold-shimmer-text">The Token Bank</span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ran out of coins on an ambitious prediction? The integrated peer lending system lets you request instant classmate loans at flat rates backed by peer trust.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#12141C] border border-white/5">
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>Emergency Loans</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Borrow up to 2,000 coins from peers with transparent flat terms.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#12141C] border border-white/5">
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span>Lend & Earn</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Have excess chips? Fund classmate requests to earn passive interest.
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Chip Stacker Artwork + Live Reserve Summary */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-xl">
                <img
                  src="/images/chip-stacker-vault.jpg"
                  alt="pariBET Central Reserve Banker"
                  className="w-full aspect-[4/5] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E14] via-[#0D0E14]/20 to-transparent opacity-60 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-[#08090C]/90 px-2.5 py-1 rounded-lg border border-amber-400/20 backdrop-blur-md">
                    VAULT KEEPER • THE CHIP LEADER
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-[#08090C]/90 px-2.5 py-1 rounded-lg border border-emerald-400/20 backdrop-blur-md">
                    0.0% Default Rate
                  </span>
                </div>
              </div>

              <div className="bg-[#12141C] p-5 rounded-2xl border border-white/5 space-y-3">
                <div className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider">
                  Live Reserve Summary
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs text-slate-400">Total Coins in Circulation</span>
                    <span className="font-mono font-black text-amber-400 text-sm">215,400 🪙</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs text-slate-400">Active Peer Loans</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">12 Funded</span>
                  </div>
                </div>
                <Link
                  to={user ? "/bank" : "/register"}
                  className="w-full vip-gold-btn py-2.5 text-xs font-bold flex items-center justify-center gap-2 mt-2"
                >
                  <span>Access Token Bank</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. HALL OF FAME LEADERBOARD */}
      <section className="py-20 px-4 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            Classroom Hall of Fame
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white mt-1">
            Top High Rollers of MCA 2025
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Weekly updated rankings. Compete for titles like "The Whale" and "The Sharp".
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LEADERBOARD_PREVIEW.map((player) => (
            <div
              key={player.rank}
              className="p-5 rounded-2xl bg-[#0E0F15] border border-white/5 hover:border-amber-500/30 transition-all text-center relative group"
            >
              <div className="absolute top-3 right-3 text-xs font-mono font-black text-slate-500 group-hover:text-amber-400">
                #{player.rank}
              </div>

              <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-400/25 flex items-center justify-center font-black text-amber-400 text-base mb-3">
                {player.name[0]}
              </div>

              <h4 className="font-bold text-white text-sm">{player.name}</h4>
              <div className="text-[10px] font-mono text-amber-400 font-semibold mt-0.5">
                {player.badge}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-around text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-500">NET WORTH</div>
                  <div className="font-bold text-amber-400 mt-0.5">{player.coins} 🪙</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">WIN RATE</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{player.winRate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FINAL VIP INVITATION BANNER */}
      <section className="py-16 px-4 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#0E0F16] border border-white/10 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/25 text-xs font-mono font-bold uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Exclusive Invitation
          </span>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Ready to Take Your Seat at <span className="text-amber-400">pariBET</span>?
          </h2>
          <p className="text-xs sm:text-base text-slate-400 max-w-lg mx-auto mt-3">
            53 verified MCA classmates, real-time pari-mutuel odds, zero real money risk, and 1,000 complimentary chips on registration.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3.5">
            <Link
              to="/register"
              className="w-full sm:w-auto vip-gold-btn px-9 py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Coins className="w-4 h-4" />
              <span>Sign Up (Free 1,000 Coins)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all border border-white/10"
            >
              Log In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="border-t border-white/5 py-10 px-4 text-center text-xs text-slate-500 bg-[#060608]">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-mono text-slate-400 font-semibold">
            pariBET • Private MCA Class of 2025 • College of Engineering Chengannur
          </p>
          <p className="text-[11px] text-slate-600 max-w-xl mx-auto leading-relaxed">
            Disclaimer: pariBET is an educational, closed-circle social simulation designed strictly for 53 MCA classmates. All coins, tokens, and payouts are 100% virtual with zero monetary value. No real-world currency gambling or financial transactions occur on this platform.
          </p>
        </div>
      </footer>
    </div>
  );
};
