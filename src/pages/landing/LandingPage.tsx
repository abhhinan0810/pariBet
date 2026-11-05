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
  Clock,
  Shuffle,
  PartyPopper,
  ChevronRight,
  CheckCircle2,
  Trophy,
  Menu,
  X,
  Crown,
  AlertTriangle,
  Skull,
  Radio,
  FlameKindling
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// 5 Quick Category Cards
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

// Activity Feed Mock Data (The Table is Moving)
const RECENT_ACTIVITIES = [
  {
    id: 1,
    user: 'Anand M',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Anand',
    type: 'BET',
    text: 'doubled down: 500 PTS on "Rahul Being 10m Late"',
    odds: '2.6x',
    time: '2 mins ago',
    tag: 'HIGH STAKE',
    isHot: true
  },
  {
    id: 2,
    user: 'Sneha R',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sneha',
    type: 'STREAK',
    text: 'hit a 4-prediction win streak! (+1,250 PTS)',
    odds: '🔥 4 STREAK',
    time: '5 mins ago',
    tag: 'STREAK ALERT',
    isHot: true
  },
  {
    id: 3,
    user: 'Market Shift',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Market',
    type: 'ODDS',
    text: '"Surprise Lab Viva Today" odds flipped to 78% YES after faculty walked in',
    odds: '1.28x',
    time: '12 mins ago',
    tag: 'ODDS SHIFT',
    isHot: false
  },
  {
    id: 4,
    user: 'Adarsh S',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ViperX',
    type: 'UPSET',
    text: 'placed 300 PTS on the 4.8x Underdog: "Seminar cancelled due to mic glitch"',
    odds: '4.8x',
    time: '18 mins ago',
    tag: 'CHAOS MOVE',
    isHot: true
  },
  {
    id: 5,
    user: 'Abhinav Krishna',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ShadowAce',
    type: 'RANK',
    text: 'reclaimed #1 position on the Sem 4 Mandhi Race with 5,450 PTS',
    odds: '👑 #1 RANK',
    time: '25 mins ago',
    tag: 'MANDHI RACE',
    isHot: true
  }
];

// Class Personalities (Meet the High Rollers)
const CLASS_PERSONALITIES = [
  {
    title: 'The Oracle',
    icon: '👑',
    name: 'Afna S Thaha',
    admission: 'chn25mca005',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GoldenOracle',
    badge: '88% Win Rate',
    desc: 'Reads the professors like open books. Never places a bet without verified intelligence from the staff room corridor.',
    style: 'border-amber-400/30 bg-amber-950/20 text-amber-300'
  },
  {
    title: 'The High Roller',
    icon: '🎲',
    name: 'Abhinav Krishna S',
    admission: 'chn25mca055',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ShadowAce',
    badge: 'Mandhi Sponsor & Whale',
    desc: 'Refuses to wager under 500 PTS. Sponsors the Sem 4 Mandhi feast and plays like the entire classroom is his casino floor.',
    style: 'border-yellow-400/40 bg-yellow-950/25 text-yellow-300'
  },
  {
    title: 'The Chaos Agent',
    icon: '⚡',
    name: 'Adarsh S',
    admission: 'chn25mca069',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ViperX',
    badge: 'Underdog Hunter (4.8x Avg)',
    desc: 'If everyone is betting YES, he puts his entire stack on NO. Won 14,500 PTS when the Friday afternoon session was cut short.',
    style: 'border-rose-400/30 bg-rose-950/20 text-rose-300'
  },
  {
    title: 'The Safe Punter',
    icon: '🛡️',
    name: 'Abhinand A Nair',
    admission: 'chn25mca045',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CryptoKing',
    badge: 'Compound Grinder',
    desc: 'Never goes all-in. Strictly stakes 100 PTS on mathematically guaranteed 1.2x outcomes. Slowly creeping up the leaderboard.',
    style: 'border-emerald-400/30 bg-emerald-950/20 text-emerald-300'
  },
  {
    title: 'The Comeback Kid',
    icon: '📉',
    name: 'Akshay J Chandran',
    admission: 'chn25mca067',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NeonBlade',
    badge: 'Survivor (+420%)',
    desc: 'Down to 15 PTS after the disastrous lab exam prediction. Took an emergency Token Bank loan and surged straight back into the Top 5.',
    style: 'border-sky-400/30 bg-sky-950/20 text-sky-300'
  }
];

// Hall of Disasters (Historical Classroom Upsets)
const HALL_OF_DISASTERS = [
  {
    id: 1,
    title: 'The 98% Consensus Crash',
    tag: 'ATTENDANCE CATASTROPHE',
    date: 'Semester 3 • Week 12',
    pot: '8,400 PTS Pool',
    story: '98% of the classroom staked their entire balances that Sir wouldn’t take attendance on a rainy Friday 4 PM. Sir walked in at 4:54 PM and called the roll twice. Only 2 students had bet NO.',
    loss: '8,232 PTS Lost by Class',
    winnerPayout: '42.0x Underdog Payout',
    verdict: 'Never trust a rainy afternoon.'
  },
  {
    id: 2,
    title: 'The 12-Minute Silent Seminar',
    tag: 'SEMINAR SPECTACLE',
    date: 'Semester 3 • Week 8',
    pot: '6,200 PTS Pool',
    story: 'High-stakes wager on whether Gautham would speak for under 5 minutes or over 10. Gautham stared at slide 3 without speaking for 11 minutes while maintaining unblinking eye contact with the evaluators.',
    loss: '5,100 PTS Burned on Under 5m',
    winnerPayout: '7.8x Payout',
    verdict: 'Silence is high-yield.'
  },
  {
    id: 3,
    title: 'The Untested Line 42',
    tag: 'LAB EXTERNAL VIVA',
    date: 'Semester 2 • Finals',
    pot: '11,800 PTS Pool',
    story: 'Class consensus was 94% that the external examiner would only check the UI output. Examiner opened the terminal, scrolled directly to line 42, and triggered a segmentation fault.',
    loss: '10,500 PTS Wiped Out',
    winnerPayout: '16.5x Payout',
    verdict: 'The examiner always knows line 42.'
  }
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Floating Live Bet Card State on Hero
  const [heroBetSide, setHeroBetSide] = useState<'YES' | 'NO'>('NO');
  const [heroStake, setHeroStake] = useState<number>(200);
  const [heroConfirmed, setHeroConfirmed] = useState<boolean>(false);

  // Mini roulette demo state
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
      {/* 1. TOP MARQUEE TICKER (Minimalist Obsidian & Gold) */}
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
            CLASS VAULT JACKPOT: 64,800 PTS
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            NORMAL CLASS. ABNORMAL BETS.
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            WELCOME BONUS: 1,000 FREE VIRTUAL PTS ON SIGNUP
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
          {/* Logo: pariBET */}
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
            <a href="#activity-feed" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Live Action</span>
            </a>
            <a href="#high-rollers" className="hover:text-amber-400 transition-colors">
              Personalities
            </a>
            <a href="#hall-of-disasters" className="hover:text-amber-400 transition-colors">
              Hall of Disasters
            </a>
            <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
              How It Works
            </a>
            <a href="#roulette-demo" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <Dice5 className="w-3.5 h-3.5 text-amber-400" />
              <span>Spin & Win</span>
            </a>
          </nav>

          {/* Auth CTA & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <Link
                to="/home"
                className="vip-gold-btn px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs font-bold flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
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
              className="md:hidden p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
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
                href="#activity-feed"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
              >
                The Table is Moving (Live Feed)
              </a>
              <a
                href="#high-rollers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
              >
                Meet the High Rollers
              </a>
              <a
                href="#hall-of-disasters"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
              >
                Hall of Disasters
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
              >
                How It Works (4 Steps)
              </a>
              <a
                href="#roulette-demo"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
              >
                <Dice5 className="w-3.5 h-3.5 text-amber-400" />
                <span>Mini-Roulette Demo</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. HERO SECTION — CINEMATIC CLASS CASINO */}
      <section id="hero-stage" className="relative pt-8 sm:pt-14 pb-16 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Ambient Red/Gold Radial Lighting */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-red-600/10 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[350px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column (6 cols): Cinematic Editorial Typography & Slogan */}
          <div className="lg:col-span-6 relative z-10 space-y-6">
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
              <span>CLASSBET CASINO</span>
              <span className="text-white/20">•</span>
              <span className="text-slate-400 font-normal">Room 204 High Stakes</span>
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
                  Abhinav (Varkkala/pari)
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            {/* Main Cinematic Headline */}
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
              <strong className="text-white">Predict the nonsense. Risk your points. Beat your classmates.</strong>{' '}
              Your class has entered the high-stakes world of completely unnecessary predictions. Real-time pari-mutuel odds, virtual points only, zero real money.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2"
            >
              <Link
                to={user ? "/discover" : "/register"}
                className="vip-gold-btn px-8 py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow group"
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

            {/* Quick Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-5 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified <code className="text-amber-400 font-mono">@ceconline.edu</code> Roster
              </span>
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                Virtual PTS Only (100% Risk Free)
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                Live Pari-Mutuel Pools
              </span>
            </div>
          </div>

          {/* Right Column (6 cols): Cinematic Movie-Still Artwork & Floating Live Bet Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-xl">
              {/* Actual Classroom Casino Image with Feathered Edges */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/images/classbet-hero.png"
                  alt="Classroom Casino Action"
                  className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700"
                />

                {/* Feathered dark gradient edges for movie-still feel */}
                <div className="absolute inset-y-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-[#07080B]/90 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-16 sm:h-28 bg-gradient-to-t from-[#07080B] via-[#07080B]/60 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-8 sm:h-16 bg-gradient-to-b from-[#07080B]/80 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-6 sm:w-16 bg-gradient-to-l from-[#07080B]/90 to-transparent pointer-events-none" />
              </div>

              {/* FLOATING LIVE BET CARD (Hero Interactive Showcase) */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-6 sm:-bottom-8 left-2 sm:left-6 right-2 sm:right-6 bg-[#0B0C12]/95 backdrop-blur-xl border-2 border-amber-500/40 rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] z-20"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5 font-mono text-rose-400 font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                    <span>🔴 LIVE BET</span>
                  </div>
                  <span className="font-mono text-[11px] text-amber-400 font-semibold">
                    Pool: 1,420 PTS
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-2 leading-tight">
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

                {/* Recent Bet Ticker Line */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2.5">
                  <span className="truncate">Recent bet: Anand put 200 PTS on NO</span>
                  <span className="text-slate-500">2m ago</span>
                </div>

                {/* Quick Interactive Staking Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHeroBetSide('YES');
                      setHeroConfirmed(true);
                      setTimeout(() => setHeroConfirmed(false), 2500);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      heroBetSide === 'YES'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/30'
                    }`}
                  >
                    YES (2.6x)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHeroBetSide('NO');
                      setHeroConfirmed(true);
                      setTimeout(() => setHeroConfirmed(false), 2500);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      heroBetSide === 'NO'
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                        : 'bg-rose-950/20 border-rose-500/30 text-rose-400 hover:bg-rose-900/30'
                    }`}
                  >
                    NO (1.6x)
                  </button>
                </div>

                {heroConfirmed && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-center text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg py-1"
                  >
                    ✨ Simulated {heroStake} PTS committed on {heroBetSide}! Log in to play live pools.
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. ACTIVITY FEED — "THE TABLE IS MOVING" */}
      <section id="activity-feed" className="py-12 sm:py-16 px-4 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="rounded-3xl bg-black/45 backdrop-blur-2xl border border-white/10 p-5 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>LIVE ACTIVITY FEED</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                The Table is Moving
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Real-time wagers, high-stake clashes, streak alerts, and rank jumps happening across Room 204.
              </p>
            </div>

            <Link
              to="/discover"
              className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All 24 Active Bets</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Activity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {RECENT_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-2xl bg-[#0C0E14] border border-white/5 hover:border-amber-400/30 transition-all flex items-start gap-3 group"
              >
                <img
                  src={act.avatar}
                  alt={act.user}
                  className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-white truncate">{act.user}</span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                      {act.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                    {act.text}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 pt-1.5 border-t border-white/5">
                    <span className="text-amber-400 font-bold">{act.odds}</span>
                    <span>{act.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CLASS PERSONALITIES — "MEET THE HIGH ROLLERS" */}
      <section id="high-rollers" className="py-12 sm:py-16 px-4 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/25 text-xs font-mono font-bold uppercase mb-2">
            <Crown className="w-3.5 h-3.5" /> Room 204 Archetypes
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
            Meet the High Rollers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Dynamic titles auto-assigned to MCA batch roster members based on their betting discipline, risk propensity, and win streaks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {CLASS_PERSONALITIES.map((p, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${p.style} backdrop-blur-xl flex flex-col justify-between hover:scale-[1.02] transition-all duration-200 shadow-xl`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/10 text-white">
                    {p.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-8 h-8 rounded-full border border-white/15 bg-black/40"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{p.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{p.admission}</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-1.5">
                  {p.title}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Roster Verified</span>
                <span className="text-white font-bold">@ceconline.edu</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. HALL OF DISASTERS — HISTORIC CLASSROOM UPSETS */}
      <section id="hall-of-disasters" className="py-12 sm:py-16 px-4 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="rounded-3xl bg-black/50 backdrop-blur-2xl border border-rose-500/25 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-400 mb-1">
                <Skull className="w-4 h-4 text-rose-400" />
                <span>CHRONICLES OF CATASTROPHE</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
                Hall of Disasters
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Famous classroom predictions where the 95% consensus suffered a horrific collapse.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              Vault Archived Lore
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HALL_OF_DISASTERS.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-2xl bg-[#0E0B12] border border-rose-500/20 hover:border-rose-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-rose-400 font-bold mb-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/25">
                      {d.tag}
                    </span>
                    <span className="text-slate-400">{d.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {d.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {d.story}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Class Carnage:</span>
                    <span className="text-rose-400 font-bold">{d.loss}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Underdog Return:</span>
                    <span className="text-emerald-400 font-bold">{d.winnerPayout}</span>
                  </div>
                  <div className="pt-1.5 text-[10px] text-amber-300 italic border-t border-white/5">
                    "{d.verdict}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS — 4 DISTINCT CARDS */}
      <section id="how-it-works" className="py-12 sm:py-16 px-4 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/25 text-xs font-mono font-bold uppercase mb-2">
            <Zap className="w-3.5 h-3.5" /> 4 Simple Steps
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
            How The Class Casino Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Zero real cash, pure classroom mathematics, dynamic pari-mutuel odds, and bragging rights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-amber-400/30 transition-all">
            <div className="text-3xl font-mono font-black text-amber-400 mb-2">01</div>
            <h3 className="text-base font-bold text-white mb-1.5">PREDICT</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Spot an absurd classroom market: surprise tests, seminar length, or cafeteria specials.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-amber-400/30 transition-all">
            <div className="text-3xl font-mono font-black text-amber-400 mb-2">02</div>
            <h3 className="text-base font-bold text-white mb-1.5">BET</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lock in your virtual PTS directly from the card with live pari-mutuel payout calculators.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-amber-400/30 transition-all">
            <div className="text-3xl font-mono font-black text-amber-400 mb-2">03</div>
            <h3 className="text-base font-bold text-white mb-1.5">WAIT</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watch real-life classroom chaos unfold in Room 204 as faculty and peers determine the outcome.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-amber-400/30 transition-all">
            <div className="text-3xl font-mono font-black text-amber-400 mb-2">04</div>
            <h3 className="text-base font-bold text-white mb-1.5">FLEX</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Collect your distributed winnings, climb the Hall of Fame, and qualify for the Sem 4 Mandhi feast.
            </p>
          </div>
        </div>
      </section>

      {/* 8. SEMESTER 4 GRAND PRIZE SHOWCASE — FULL MANDHI SPONSORED BY ABHINAV (VARKKALA / PARI) */}
      <section id="grand-prize-mandhi" className="py-8 sm:py-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-black/70 via-[#180a0f]/80 to-black/70 backdrop-blur-2xl border-2 border-amber-400/40 p-4 sm:p-8 lg:p-12 shadow-[0_0_60px_rgba(245,158,11,0.2)] overflow-hidden">
          {/* Ambient lighting */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/15 blur-[140px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left 6 cols: Official Mandhi Feast Poster Artwork */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-sm sm:max-w-lg rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl group">
                <img
                  src="/public/assets/aistudio/Sponsored_Mandhi_Feast_Poster_e8b7457a.png"
                  alt="Semester 4 Grand Prize Full Mandhi Sponsored by Abhinav"
                  className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700"
                  onError={(e) => {
                    // Fallback to local image path if needed
                    const target = e.currentTarget;
                    if (target.src.indexOf('Sponsored_Mandhi_Feast_Poster') !== -1) {
                      target.src = '/assets/aistudio/Sponsored_Mandhi_Feast_Poster_e8b7457a.png';
                    }
                  }}
                />

                {/* Bottom Bar inside image */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 sm:p-5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>OFFICIAL BATCH SPONSOR</span>
                    </div>
                    <p className="text-sm sm:text-base font-extrabold text-white">
                      Abhinav <span className="text-amber-400">(Varkkala / Pari)</span>
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-amber-400 text-black px-2.5 sm:px-3 py-1 rounded-lg shadow-gold-glow">
                    TOP 4 ONLY
                  </span>
                </div>

                {/* Floating Top Badge */}
                <div className="absolute top-3 left-3 bg-[#0B0C10]/90 backdrop-blur-md border border-amber-500/40 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl">
                  <span className="text-base">🍗</span>
                  <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wide">
                    Full Mandhi Grand Prize
                  </span>
                </div>
              </div>
            </div>

            {/* Right 6 cols: Prize Details & Qualification Criteria */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>End of Semester 4 Grand Prize</span>
                </span>
                <h2 className="font-display font-black text-2xl sm:text-4xl text-white mt-3 leading-tight">
                  Feast Like Kings:{' '}
                  <span className="gold-shimmer-text">Full Mandhi for Top 4</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  The ultimate reward in MCA batch history! At the conclusion of Semester 4, the top 4 players leading the classroom Hall of Fame will sit down for a glorious, authentic full chicken Mandhi platter with steaming fragrant rice, fiery dips, mayonnaise, and crisp onions.
                </p>
              </div>

              {/* Sponsor Card */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-black/45 border border-amber-500/25 backdrop-blur-xl flex items-start gap-3.5">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/30 transition-all">
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-0.5 sm:mb-1">
                    <span className="text-base">🏆</span>
                    <span>Top 4 Standings Cutoff</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    The 4 highest points earners when Sem 4 finishes claim a seat at the feast.
                  </p>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/30 transition-all">
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-0.5 sm:mb-1">
                    <span className="text-base">🍗</span>
                    <span>Full Platter Feast</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Authentic whole spiced chicken, fragrant Mandhi rice, garlic sauce, and dips.
                  </p>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/30 transition-all">
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-0.5 sm:mb-1">
                    <span className="text-base">👥</span>
                    <span>Classroom Royalty</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Celebrate the semester finale together with classmates and pure bragging rights.
                  </p>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/30 transition-all">
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-0.5 sm:mb-1">
                    <span className="text-base">⚡</span>
                    <span>100% Skill & Virtual</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Zero real money risk. Your prediction prowess and smart risk management win it.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to={user ? "/leaderboard" : "/register"}
                  className="vip-gold-btn px-6 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow"
                >
                  <span>{user ? "Check Live Standings" : "Sign Up & Chase the Mandhi"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-[11px] sm:text-xs text-slate-400 text-center sm:text-left font-mono">
                  53 Verified MCA Students Eligible
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. DOCKED 5 CATEGORY CARDS */}
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

      {/* 10. INTERACTIVE ROULETTE MINI-GAME */}
      <section id="roulette-demo" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 4 cols: Cinematic Artwork */}
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
                          className={`py-2 px-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
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
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
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
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
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
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
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
                        <span>Spin ({selectedChip} PTS)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Display (6 cols) */}
                <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-black/35 backdrop-blur-xl rounded-2xl border border-white/10 text-center min-h-[260px]">
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
                          className="vip-gold-btn px-3.5 py-1.5 text-xs font-bold whitespace-nowrap shrink-0 shadow-gold-glow"
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

      {/* 11. FOOTER */}
      <footer className="border-t border-white/5 bg-[#050608] py-12 px-4 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3">
            <img src="/images/mca.png" alt="MCA" className="w-7 h-7 object-contain opacity-70" />
            <img src="/images/logo.png" alt="pariBET" className="h-5 w-auto object-contain opacity-80" />
          </div>
          <p className="max-w-xl mx-auto text-slate-400 leading-relaxed">
            pariBET is an exclusive private classroom prediction club engineered for 53 MCA students at College of Engineering Chengannur. Strictly zero real-currency gambling. All wagers use virtual classroom points (PTS).
          </p>
          <div className="pt-2 text-[11px] font-mono text-amber-400/80">
            NORMAL CLASS. ABNORMAL BETS. • SEM 4 GRAND PRIZE SPONSORED BY ABHINAV
          </div>
          <div className="text-[10px] text-slate-600">
            © {new Date().getFullYear()} College of Engineering Chengannur MCA Syndicate.
          </div>
        </div>
      </footer>
    </div>
  );
};
