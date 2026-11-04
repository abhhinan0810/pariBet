import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  GraduationCap,
  Search,
  MessageSquare,
  Sparkles,
  Send,
  Lock
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
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-2xl lg:text-3xl text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-gold-highlight" />
          <span>CEC MCA Classroom Lounge</span>
        </h1>
        <p className="text-sm text-casino-muted">
          College of Engineering Chengannur • MCA Batch of 2025 Private Club
        </p>
      </div>

      {/* Classroom Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="gold-border" className="p-5">
          <GraduationCap className="w-8 h-8 text-gold-highlight mb-2" />
          <h3 className="font-bold text-white text-base">Classroom Network</h3>
          <p className="text-xs text-casino-muted mt-1">Master of Computer Applications</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-gold-highlight font-mono font-bold bg-gold/10 px-2 py-0.5 rounded">
              53 VERIFIED SEATS
            </span>
          </div>
        </Card>

        <Card variant="default" className="p-5 md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Closed-Community Roster Isolation</span>
            </div>
            <p className="text-xs text-casino-muted leading-relaxed">
              This space is strictly restricted to the 53 verified students in the CSV roster. Outside registrations and emails not matching <code className="text-gold-highlight font-mono">admission_number@ceconline.edu</code> are permanently blocked by security rules.
            </p>
          </div>
          <div className="text-[11px] text-casino-muted font-mono flex items-center gap-1.5 mt-3">
            <Lock className="w-3.5 h-3.5 text-gold-highlight" />
            <span>End-to-end roster validation active</span>
          </div>
        </Card>
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
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-gold resize-none"
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
              className="w-full bg-[#12121A] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-casino-muted/50 focus:outline-none focus:border-gold"
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
