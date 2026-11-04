import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  TrendingUp,
  Percent,
  Landmark,
  Zap,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/common/Card';
import { CoinIcon } from '@/components/common/CoinIcon';
import approvedStudentsSeed from '@/data/approved_students.json';

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

  // Authoritative ranking dataset based on 53 MCA students
  const leaderboardEntries = [
    {
      id: 'uid_chn25mca055',
      name: 'Abhinav Krishna S',
      nickname: 'Shadow',
      admission: 'chn25mca055',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ShadowAce',
      championPoints: 5450,
      victories: 24,
      streak: 7,
      winRate: 88,
      participated: 28,
      loansCompleted: 6,
      rankChange: 4,
    },
    {
      id: 'uid_chn25mca069',
      name: 'Adarsh S',
      nickname: 'Viper',
      admission: 'chn25mca069',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ViperX',
      championPoints: 4120,
      victories: 19,
      streak: 5,
      winRate: 75,
      participated: 25,
      loansCompleted: 4,
      rankChange: 2,
    },
    {
      id: 'uid_chn25mca005',
      name: 'Afna S Thaha',
      nickname: 'Oracle',
      admission: 'chn25mca005',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GoldenOracle',
      championPoints: 3890,
      victories: 17,
      streak: 4,
      winRate: 71,
      participated: 24,
      loansCompleted: 5,
      rankChange: 1,
    },
    {
      id: 'uid_chn25mca045',
      name: 'Abhinand A Nair',
      nickname: 'Phoenix',
      admission: 'chn25mca045',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CryptoKing',
      championPoints: 2900,
      victories: 14,
      streak: 3,
      winRate: 64,
      participated: 22,
      loansCompleted: 2,
      rankChange: 5,
    },
    {
      id: 'uid_chn25mca067',
      name: 'Akshay J Chandran',
      nickname: 'Ace',
      admission: 'chn25mca067',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NeonBlade',
      championPoints: 2600,
      victories: 12,
      streak: 4,
      winRate: 60,
      participated: 20,
      loansCompleted: 3,
      rankChange: -1,
    },
    {
      id: 'uid_chn25mca021',
      name: 'Alex Antony',
      nickname: 'Blaze',
      admission: 'chn25mca021',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=QuantumGod',
      championPoints: 2200,
      victories: 10,
      streak: 2,
      winRate: 58,
      participated: 18,
      loansCompleted: 1,
      rankChange: 3,
    },
  ];

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

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl lg:text-3xl text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-gold-highlight" />
            <span>Classroom Hall of Fame</span>
          </h1>
          <p className="text-sm text-casino-muted">
            CEC MCA Class of 2025 • Lifetime & Seasonal Standings
          </p>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-background-elevated p-1 rounded-xl border border-white/5 self-start">
          {(['ALL_TIME', 'MONTHLY', 'WEEKLY'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
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
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
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

      {/* Podium Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedEntries.slice(0, 3).map((item, idx) => {
          const badges = ['👑 1st Place', '🥈 2nd Place', '🥉 3rd Place'];
          return (
            <Card
              key={item.id}
              variant={idx === 0 ? 'gold-border' : 'default'}
              className="p-5 text-center relative overflow-hidden"
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gold-highlight block mb-2">
                {badges[idx]}
              </span>
              <img
                src={item.avatar}
                alt={item.nickname}
                className="w-16 h-16 rounded-full border-2 border-gold mx-auto mb-2 object-cover bg-background-elevated shadow-gold-glow-sm"
              />
              <h3 className="font-display font-black text-lg text-white">{item.nickname}</h3>
              <p className="text-xs text-casino-muted">{item.name}</p>
              <div className="mt-3 p-2 rounded-xl bg-background-elevated border border-white/5 font-mono font-bold text-sm text-gold-highlight">
                {getMetricDisplay(item)}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <Card variant="default" className="divide-y divide-white/5">
        <div className="p-4 bg-background-elevated flex items-center justify-between text-xs font-mono uppercase text-casino-muted">
          <span>Rank & Classmate</span>
          <span>Category Performance</span>
        </div>

        {sortedEntries.map((item, index) => {
          const rank = index + 1;
          const isCurrentUser =
            item.admission.toLowerCase() === user?.admissionNumber.toLowerCase();

          return (
            <div
              key={item.id}
              className={`p-4 flex items-center justify-between transition-colors ${
                isCurrentUser
                  ? 'bg-gold/10 border-l-4 border-gold'
                  : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="font-mono font-black text-sm text-gold-highlight w-6">
                  #{rank}
                </span>
                <img
                  src={item.avatar}
                  alt={item.nickname}
                  className="w-10 h-10 rounded-full border border-gold/40 object-cover bg-background-elevated shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white leading-tight">
                      {item.nickname}
                    </p>
                    {isCurrentUser && (
                      <span className="text-[9px] bg-gold/20 text-gold-highlight px-1.5 py-0.5 rounded font-mono font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-casino-muted leading-tight font-sans mt-0.5">
                    {item.name} • <span className="font-mono uppercase">{item.admission}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-mono font-bold text-sm text-gold-highlight">
                  {getMetricDisplay(item)}
                </p>
                <p className="text-[10px] text-casino-muted font-mono mt-0.5">
                  {item.winRate}% win rate
                </p>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};
