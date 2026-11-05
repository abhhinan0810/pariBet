import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  GraduationCap,
  Search,
  MessageSquare,
  Sparkles,
  Send,
  Lock,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import approvedStudentsSeed from '@/data/approved_students.json';

interface FeedPost {
  id: string;
  authorNickname: string;
  authorName: string;
  content: string;
  timestamp: string;
  likes: number;
}

const INITIAL_FEED: FeedPost[] = [
  {
    id: 'p0',
    authorNickname: 'Shadow (Abhinav)',
    authorName: 'Abhinav Krishna S',
    content: '🍗 OFFICIAL SEMESTER 4 GRAND PRIZE ANNOUNCEMENT! The stakes are set: For the top 4 players commanding the Hall of Fame at the end of Sem 4, I will personally sponsor a steaming, authentic full Mandhi platter! Bring your best game to upcoming markets!',
    timestamp: 'Pinned Announcement',
    likes: 38,
  },
  {
    id: 'p1',
    authorNickname: 'Shadow',
    authorName: 'Abhinav Krishna S',
    content: 'Just launched a new prediction on the inter-batch cricket tournament! Place your bets on MCA 2025.',
    timestamp: '2 hours ago',
    likes: 8,
  },
  {
    id: 'p2',
    authorNickname: 'Viper',
    authorName: 'Adarsh S',
    content: 'Lab viva results will be announced by 4 PM. Whoever picked 45 marks on the Closest Answer pool might take the whole pot!',
    timestamp: '4 hours ago',
    likes: 5,
  },
];

export const ClassGroupPage: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_FEED);
  const [newPostText, setNewPostText] = useState('');

  const filteredStudents = approvedStudentsSeed.filter(
    (s) =>
      s.official_name.toLowerCase().includes(search.toLowerCase()) ||
      s.admission_number.toLowerCase().includes(search.toLowerCase())
  );

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() || !user) return;

    const newPost: FeedPost = {
      id: `post_${Date.now()}`,
      authorNickname: user.nickname,
      authorName: user.officialName,
      content: newPostText.trim(),
      timestamp: 'Just now',
      likes: 0,
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    success('Message Posted', 'Your message is visible to all 53 classmates.');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-6xl mx-auto">
      {/* Cinematic Syndicate Header Banner (squad-celebration.jpg) */}
      <div className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 p-6 lg:p-8 shadow-card-glow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-4 relative flex items-center justify-center">
            <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 group shadow-xl">
              <img
                src="/images/squad-celebration.jpg"
                alt="CEC MCA Class Syndicate"
                className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0F15]/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono">
                <span className="text-amber-400 font-bold bg-[#07080B]/90 px-2.5 py-1 rounded-lg border border-amber-400/20 backdrop-blur-md">
                  THE SYNDICATE
                </span>
                <span className="text-emerald-400 font-bold bg-[#07080B]/90 px-2.5 py-1 rounded-lg border border-emerald-400/20 backdrop-blur-md">
                  MCA BATCH
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/25">
                  EXCLUSIVE BATCH CLUB
                </span>
                <span className="text-[11px] text-casino-muted font-mono">
                  College of Engineering Chengannur
                </span>
              </div>
              <h1 className="font-display font-black text-2xl lg:text-3xl text-white">
                CEC MCA Batch of 2025 Lounge
              </h1>
              <p className="text-xs sm:text-sm text-casino-muted mt-1 leading-relaxed max-w-2xl">
                The private clubhouse where 53 verified classmates pit their predictions against one another. Zero corporate house edge, 100% peer returns, and instant bragging rights.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/10 flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-white block">Closed Roster Protocol</span>
                  <span className="text-[11px] text-casino-muted">
                    Only <code className="text-amber-400 font-mono">@ceconline.edu</code> logins matching the official CSV roster are permitted.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/10 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-white block">Sovereign Batch Vault</span>
                  <span className="text-[11px] text-casino-muted">
                    All token prizes and loan interest stay 100% inside our classroom economy.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEMESTER 4 GRAND PRIZE SYNDICATE BANNER */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-black/60 via-[#180a0f]/60 to-black/60 border-2 border-amber-400/35 p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-400/40 shrink-0 shadow">
              <img
                src="/assets/aistudio/Sponsored_Mandhi_Feast_Poster_e8b7457a.png"
                alt="Mandhi Grand Prize"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/25">
                  🍗 SEM 4 GRAND PRIZE
                </span>
                <span className="text-xs text-slate-400 font-mono">Top 4 Standings Cutoff</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                Full Mandhi Platter Sponsored by <span className="text-amber-400">Abhinav (Varkkala / Pari)</span>
              </h3>
            </div>
          </div>
          <Link
            to="/leaderboard"
            className="vip-gold-btn px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <span>View Cutoff</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Classroom Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gold-highlight" />
            <span>Classroom Wall & Banter</span>
          </h2>

          {/* New Post Box */}
          <Card variant="default" className="p-4">
            <form onSubmit={handlePost} className="space-y-3">
              <textarea
                rows={2}
                placeholder={`What's your take on upcoming predictions, ${user?.nickname}?`}
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-gold resize-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-casino-muted">
                  Visible to all 53 MCA classmates
                </span>
                <button
                  type="submit"
                  disabled={!newPostText.trim()}
                  className="casino-gold-button px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </div>
            </form>
          </Card>

          {/* Feed Posts */}
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id} variant="default" className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{post.authorNickname}</span>
                    <span className="text-[10px] text-casino-muted">({post.authorName})</span>
                  </div>
                  <span className="text-[10px] text-casino-muted font-mono">{post.timestamp}</span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed">{post.content}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Col: 53-Student Directory Search */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-gold-highlight" />
            <span>Classmate Directory ({approvedStudentsSeed.length})</span>
          </h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
            <input
              type="text"
              placeholder="Search by name or admission..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-casino-muted/50 focus:outline-none focus:border-gold"
            />
          </div>

          <Card variant="default" className="p-2 max-h-[500px] overflow-y-auto space-y-1.5 divide-y divide-white/5">
            {filteredStudents.map((st, idx) => (
              <div key={idx} className="p-2.5 flex items-center justify-between hover:bg-white/[0.02] rounded-lg">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold text-white truncate">{st.official_name}</p>
                  <p className="text-[10px] font-mono text-gold-highlight uppercase truncate">
                    {st.admission_number}
                  </p>
                </div>
                <span className="text-[9px] bg-white/5 text-casino-muted px-2 py-0.5 rounded font-mono shrink-0">
                  SEAT #{idx + 1}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};
