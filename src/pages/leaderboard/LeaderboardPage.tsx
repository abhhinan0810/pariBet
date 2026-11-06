
import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  TrendingUp,
  Percent,
  Landmark,
  Zap,
  Crown,
  X,
  Sparkles,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/common/Card';
import { CoinIcon } from '@/components/common/CoinIcon';
import { TargetGapCalculator } from '@/components/engagement/TargetGapCalculator';
import approvedStudentsSeed from '@/data/approved_students.json';

import { userService } from '@/services/userService';
import { UserProfile, ApprovedStudent } from '@/types/user';

type LeaderboardCategory =
  | 'CHAMPION'
  | 'VICTORIES'
  | 'STREAK'
  | 'WIN_RATE'
  | 'MOST_ACTIVE'
  | 'TOP_LENDER'
  | 'COMEBACK';

type TimeFilter = 'ALL_TIME' | 'MONTHLY' | 'WEEKLY';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState<LeaderboardCategory>('CHAMPION');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL_TIME');
  const [prizeModalOpen, setPrizeModalOpen] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await userService.getAllUsers();
        setRegisteredUsers(users);
      } catch (err) {
        console.warn('Failed to load registered users:', err);
      }
    };
    fetchUsers();
  }, [user]);

  // Authoritative ranking dataset based strictly on real registered students and active roster
  const leaderboardEntries = React.useMemo(() => {
    const entriesMap = new Map<string, any>();

    // 1. Add all registered students who have activated their profiles
    registeredUsers.forEach((u) => {
      entriesMap.set(u.admissionNumber.toLowerCase(), {
        id: u.uid,
        name: u.officialName,
        nickname: u.nickname || u.officialName.split(' ')[0],
        admission: u.admissionNumber,
        avatar: u.profilePicture || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.admissionNumber}`,
        championPoints: u.walletBalance,
        victories: u.statistics?.predictionsWon || 0,
        streak: u.statistics?.currentStreak || 0,
        winRate: u.statistics?.winRate || 0,
        participated: u.statistics?.predictionsParticipated || 0,
        loansCompleted: u.statistics?.loansCompleted || 0,
        rankChange: 0,
        isRegistered: true,
      });
    });

    // 2. Ensure currently logged-in user is freshest
    if (user && user.role !== 'admin' && user.admissionNumber !== 'ADMIN') {
      entriesMap.set(user.admissionNumber.toLowerCase(), {
        id: user.uid,
        name: user.officialName,
        nickname: user.nickname || user.officialName.split(' ')[0],
        admission: user.admissionNumber,
        avatar: user.profilePicture || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.admissionNumber}`,
        championPoints: user.walletBalance,
        victories: user.statistics?.predictionsWon || 0,
        streak: user.statistics?.currentStreak || 0,
        winRate: user.statistics?.winRate || 0,
        participated: user.statistics?.predictionsParticipated || 0,
        loansCompleted: user.statistics?.loansCompleted || 0,
        rankChange: 0,
        isRegistered: true,
      });
    }

    // 3. Include remaining 53 roster students at baseline starting 1,000 PTS
    (approvedStudentsSeed as ApprovedStudent[]).forEach((student) => {
      const key = student.admission_number.toLowerCase();
      if (!entriesMap.has(key)) {
        entriesMap.set(key, {
          id: `uid_${student.admission_number}`,
          name: student.official_name,
          nickname: student.official_name.split(' ')[0],
          admission: student.admission_number,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${student.admission_number}`,
          championPoints: 1000,
          victories: 0,
          streak: 0,
          winRate: 0,
          participated: 0,
          loansCompleted: 0,
          rankChange: 0,
          isRegistered: false,
        });
      }
    });

    return Array.from(entriesMap.values());
  }, [registeredUsers, user]);

  // Dynamically sort entries based on selected category
  const sortedEntries = [...leaderboardEntries].sort((a, b) => {
    switch (category) {
      case 'CHAMPION':
        return b.championPoints - a.championPoints;
      case 'VICTORIES':
        return b.victories - a.victories;
      case 'STREAK':
        return b.streak - a.streak;
      case 'WIN_RATE':
        return b.winRate - a.winRate;
      case 'MOST_ACTIVE':
        return b.participated - a.participated;
      case 'TOP_LENDER':
        return b.loansCompleted - a.loansCompleted;
      case 'COMEBACK':
        return b.rankChange - a.rankChange;
    }
  });

  const getMetricDisplay = (item: (typeof leaderboardEntries)[0]) => {
    switch (category) {
      case 'CHAMPION':
        return `${item.championPoints.toLocaleString()} PTS Won`;
      case 'VICTORIES':
        return `${item.victories} Victories`;
      case 'STREAK':
        return `${item.streak} Wins in a row`;
      case 'WIN_RATE':
        return `${item.winRate}% Rate`;
      case 'MOST_ACTIVE':
        return `${item.participated} Predictions`;
      case 'TOP_LENDER':
        return `${item.loansCompleted} Loans Given`;
      case 'COMEBACK':
        return `+${item.rankChange} Ranks Jumped`;
    }
  };

  const cutoffPoints = sortedEntries[3] ? sortedEntries[3].championPoints : 0;

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-display font-black text-2xl lg:text-3xl text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-gold-highlight" />
            <span>Classroom Hall of Fame</span>
          </h1>
          <p className="text-xs sm:text-sm text-casino-muted mt-0.5">
            CEC MCA Class of 2025 • Lifetime & Seasonal Standings
          </p>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-background-elevated p-1 rounded-xl border border-white/5 self-start">
          {(['ALL_TIME', 'MONTHLY', 'WEEKLY'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                timeFilter === tf
                  ? 'bg-gold-gradient text-black font-bold shadow-sm'
                  : 'text-casino-muted hover:text-white'
              }`}
            >
              {tf.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* SEMESTER 4 GRAND PRIZE SHOWCASE BANNER (Featuring Mandhi Poster) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-black/70 via-[#180a0f]/60 to-black/70 border-2 border-amber-400/35 p-4 sm:p-6 lg:p-7 shadow-[0_0_40px_rgba(245,158,11,0.15)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
          {/* Poster Thumbnail */}
          <div className="md:col-span-4 relative flex items-center justify-center">
            <div className="relative w-full max-w-[260px] rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-xl group cursor-pointer" onClick={() => setPrizeModalOpen(true)}>
              <img
                src="/assets/aistudio/Sponsored_Mandhi_Feast_Poster_e8b7457a.png"
                alt="Semester 4 Grand Prize Mandhi Sponsored by Abhinav"
                className="w-full aspect-[4/3] sm:aspect-square object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-85" />
              <div className="absolute top-2 left-2 bg-amber-400 text-black text-[10px] font-mono font-black px-2 py-0.5 rounded shadow">
                GRAND PRIZE
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono">
                <span className="text-amber-300 font-bold bg-black/80 px-2 py-0.5 rounded border border-amber-400/30">
                  🍗 FULL MANDHI
                </span>
                <span className="text-emerald-400 font-bold bg-black/80 px-2 py-0.5 rounded border border-emerald-400/30">
                  TOP 4 ONLY
                </span>
              </div>
            </div>
          </div>

          {/* Banner Description */}
          <div className="md:col-span-8 space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/25">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>End of Sem 4 Grand Prize</span>
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-slate-300 font-medium">
                Sponsored by <strong className="text-amber-400">Abhinav (Varkkala / Pari)</strong>
              </span>
            </div>

            <h2 className="font-display font-black text-xl lg:text-2xl text-white">
              Top 4 Players Win a <span className="gold-shimmer-text">Full Mandhi Feast</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              At the final wrap-up of Semester 4, the top 4 contenders holding the highest points will be treated to a full authentic chicken Mandhi platter with fragrant rice, dips, and sides!
            </p>

            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <button
                onClick={() => setPrizeModalOpen(true)}
                className="vip-gold-btn px-4 py-2 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-gold-glow"
              >
                <span>🍗 View Prize Poster & Rules</span>
              </button>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cutoff: Rank #4 ({cutoffPoints.toLocaleString()} PTS)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7 Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'CHAMPION', label: 'Overall Champion', icon: Trophy },
          { id: 'VICTORIES', label: 'Most Victories', icon: Award },
          { id: 'STREAK', label: 'Winning Streak', icon: Flame },
          { id: 'WIN_RATE', label: 'Highest Win Rate', icon: Percent },
          { id: 'MOST_ACTIVE', label: 'Most Active', icon: Zap },
          { id: 'TOP_LENDER', label: 'Top Lender', icon: Landmark },
          { id: 'COMEBACK', label: 'Best Comeback', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id as LeaderboardCategory)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                category === tab.id
                  ? 'bg-gold/20 text-gold-highlight border border-gold/40 shadow-gold-glow-sm'
                  : 'bg-background-card border border-white/5 text-casino-muted hover:text-white hover:border-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOP 4 MANDHI ZONE PODIUM CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <span>🍗</span>
              <span>Top 4 Mandhi Winning Zone</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Currently in qualifying seats</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
            Sem 4 Cutoff
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {sortedEntries.slice(0, 4).map((item, idx) => {
            const badges = ['👑 1st Mandhi Seat', '🥈 2nd Mandhi Seat', '🥉 3rd Mandhi Seat', '🍗 4th Mandhi Seat'];
            return (
              <Card
                key={item.id}
                variant={idx === 0 ? 'gold-border' : 'default'}
                className="p-3 sm:p-4 text-center relative overflow-hidden border-amber-500/30 hover:border-amber-400 transition-all shadow-md"
              >
                <div className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 mb-2">
                  <span>{badges[idx]}</span>
                </div>
                <img
                  src={item.avatar}
                  alt={item.nickname}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-amber-400 mx-auto mb-2 object-cover bg-background-elevated shadow-gold-glow-sm"
                />
                <h3 className="font-display font-black text-sm sm:text-base text-white truncate">{item.nickname}</h3>
                <p className="text-[10px] sm:text-xs text-casino-muted truncate">{item.name}</p>
                <div className="mt-2.5 p-1.5 sm:p-2 rounded-xl bg-background-elevated border border-white/5 font-mono font-bold text-xs sm:text-sm text-gold-highlight">
                  {getMetricDisplay(item)}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* TARGET GAP CALCULATOR & WHAT-IF SIMULATOR */}
      {(() => {
        const userRankIndex = sortedEntries.findIndex(
          (e) =>
            e.admission.toLowerCase() === (user?.admissionNumber || '').toLowerCase() ||
            e.id === user?.uid
        );
        const currentUserRank = userRankIndex !== -1 ? userRankIndex + 1 : sortedEntries.length;
        const currentUserPoints = user?.walletBalance || 0;

        return (
          <TargetGapCalculator
            cutoffPoints={cutoffPoints}
            cutoffHolderName={sortedEntries[3]?.nickname || 'Rank 4 Qualifier'}
            rank5Points={sortedEntries[4]?.championPoints || 2600}
            userRank={currentUserRank}
            userPoints={currentUserPoints}
          />
        );
      })()}

      {/* Full Leaderboard Table */}
      <Card variant="default" className="divide-y divide-white/5">
        <div className="p-3 sm:p-4 bg-background-elevated flex items-center justify-between text-[11px] sm:text-xs font-mono uppercase text-casino-muted">
          <span>Rank & Classmate</span>
          <span>Category Performance</span>
        </div>

        {sortedEntries.map((item, index) => {
          const rank = index + 1;
          const isTop4 = rank <= 4;
          const isCurrentUser =
            (user?.admissionNumber && item.admission.toLowerCase() === user.admissionNumber.toLowerCase()) ||
            item.id === user?.uid;

          return (
            <div
              key={item.id}
              className={`p-3 sm:p-4 flex items-center justify-between transition-colors ${
                isCurrentUser
                  ? 'bg-gold/10 border-l-4 border-gold'
                  : isTop4
                  ? 'hover:bg-amber-500/[0.04]'
                  : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 pr-2">
                <span className={`font-mono font-black text-xs sm:text-sm w-5 sm:w-6 shrink-0 ${isTop4 ? 'text-amber-400' : 'text-slate-400'}`}>
                  #{rank}
                </span>
                <img
                  src={item.avatar}
                  alt={item.nickname}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border object-cover bg-background-elevated shrink-0 ${isTop4 ? 'border-amber-400/60 shadow-sm' : 'border-white/10'}`}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                      {item.nickname}
                    </p>
                    {/* Dynamic Personality Archetype Badge */}
                    {item.winRate >= 80 ? (
                      <span className="text-[9px] bg-amber-400/15 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-0.5">
                        👑 Oracle
                      </span>
                    ) : item.championPoints >= 4000 ? (
                      <span className="text-[9px] bg-yellow-400/15 text-yellow-300 border border-yellow-400/30 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-0.5">
                        🎲 High Roller
                      </span>
                    ) : item.rankChange >= 3 ? (
                      <span className="text-[9px] bg-sky-400/15 text-sky-300 border border-sky-400/30 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-0.5">
                        📉 Comeback Kid
                      </span>
                    ) : item.streak >= 4 ? (
                      <span className="text-[9px] bg-rose-400/15 text-rose-300 border border-rose-400/30 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-0.5">
                        🔥 Hot Hand
                      </span>
                    ) : (
                      <span className="text-[9px] bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-0.5">
                        🛡️ Safe Punter
                      </span>
                    )}

                    {isTop4 && (
                      <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-0.5">
                        <span>🍗</span>
                        <span className="hidden xs:inline">Mandhi Seat</span>
                      </span>
                    )}
                    {isCurrentUser && (
                      <span className="text-[9px] bg-gold/20 text-gold-highlight px-1.5 py-0.2 rounded font-mono font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs text-casino-muted leading-tight font-sans mt-0.5 truncate">
                    {item.name} • <span className="font-mono uppercase">{item.admission}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-mono font-bold text-xs sm:text-sm text-gold-highlight">
                  {getMetricDisplay(item)}
                </p>
                <p className="text-[9px] sm:text-[10px] text-casino-muted font-mono mt-0.5">
                  {item.winRate}% win rate
                </p>
              </div>
            </div>
          );
        })}
      </Card>

      {/* GRAND PRIZE DETAIL MODAL */}
      {prizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0C0D14] border-2 border-amber-400/40 rounded-3xl p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍗</span>
                <div>
                  <h3 className="font-display font-black text-lg text-white">Semester 4 Grand Prize</h3>
                  <p className="text-[10px] font-mono text-amber-400 uppercase">Full Mandhi Feast • Top 4 Qualifier</p>
                </div>
              </div>
              <button
                onClick={() => setPrizeModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Poster Image */}
            <div className="rounded-2xl overflow-hidden border border-amber-400/30 shadow-xl">
              <img
                src="/assets/aistudio/Sponsored_Mandhi_Feast_Poster_e8b7457a.png"
                alt="Full Mandhi Grand Prize"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Sponsor Box */}
            <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/25 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold text-xl shrink-0 shadow">
                👑
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Sponsored by Abhinav (Varkkala / Pari)</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  "Honoring the top 4 tactical minds of MCA 2025 with the king of feasts! Climb the standings and join me at the Mandhi table at the end of Sem 4."
                </p>
              </div>
            </div>

            {/* Rules */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="font-mono font-bold text-amber-400 uppercase text-[11px]">Qualification Rules</div>
              <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
                <li>Top 4 players with the highest points on the Overall Champion leaderboard at the end of Sem 4 qualify.</li>
                <li>All 53 verified classmates from the <code className="text-amber-400">@ceconline.edu</code> roster are eligible.</li>
                <li>The grand prize is a complete full chicken Mandhi feast with aromatic rice, dips, and sides.</li>
              </ul>
            </div>

            <button
              onClick={() => setPrizeModalOpen(false)}
              className="w-full vip-gold-btn py-2.5 text-xs font-black uppercase tracking-wider"
            >
              Back to Hall of Fame
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
