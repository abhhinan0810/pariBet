import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Lock, ArrowRight, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { CoinIcon } from '@/components/common/CoinIcon';

// Pre-curated casino/gamer luxury avatars
const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=ShadowAce&backgroundColor=0b0b0f',
  'https://api.dicebear.com/7.x/bottts/svg?seed=GoldenOracle&backgroundColor=0b0b0f',
  'https://api.dicebear.com/7.x/bottts/svg?seed=CryptoKing&backgroundColor=0b0b0f',
  'https://api.dicebear.com/7.x/bottts/svg?seed=ViperX&backgroundColor=0b0b0f',
  'https://api.dicebear.com/7.x/bottts/svg?seed=NeonBlade&backgroundColor=0b0b0f',
  'https://api.dicebear.com/7.x/bottts/svg?seed=QuantumGod&backgroundColor=0b0b0f',
];

export const SetupProfilePage: React.FC = () => {
  const { user, tempApprovedStudent, completeProfileSetup } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const officialName = user?.officialName || tempApprovedStudent?.official_name || 'MCA Classmate';
  const admissionNumber = user?.admissionNumber || tempApprovedStudent?.admission_number || '';

  const [nickname, setNickname] = useState(user?.nickname || officialName.split(' ')[0] || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.profilePicture || AVATAR_OPTIONS[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      toastError('Nickname Required', 'Please enter a game nickname.');
      return;
    }

    setSubmitting(true);
    try {
      await completeProfileSetup(nickname.trim(), selectedAvatar);
      success('VIP Lounge Unlocked!', 'Welcome bonus of 1,000 tokens credited.');
      navigate('/');
    } catch (err: any) {
      toastError('Setup Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="casino-card p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold-highlight text-xs font-mono uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 2 of 2: VIP Persona</span>
            </div>
            <h2 className="font-display font-black text-2xl text-white mb-1">
              Choose Your Gamer Nickname
            </h2>
            <p className="text-xs text-casino-muted">
              Your nickname is displayed prominently on predictions and leaderboards.
            </p>
          </div>

          {/* Welcome Bonus Callout */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-gold/15 to-amber-900/20 border border-gold/30 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CoinIcon size={32} />
              <div>
                <p className="text-xs text-gold-highlight font-semibold">Welcome Bonus</p>
                <p className="text-sm font-black font-mono text-white">1,000 Free Virtual Tokens</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
              READY
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Read-Only Official Student Credentials */}
            <div className="p-4 rounded-xl bg-background-elevated border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-casino-muted">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gold-highlight" />
                  Official Student Identity
                </span>
                <span className="flex items-center gap-1 text-[10px] text-casino-muted/80">
                  <Lock className="w-3 h-3" /> READ ONLY
                </span>
              </div>
              <div>
                <span className="text-xs text-casino-muted block">Official Name</span>
                <span className="text-sm font-semibold text-white">{officialName}</span>
              </div>
              <div>
                <span className="text-xs text-casino-muted block">Admission Number</span>
                <span className="text-xs font-mono text-gold-highlight uppercase">
                  {admissionNumber}
                </span>
              </div>
            </div>

            {/* Choose Gamer Nickname */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                Gaming Nickname (Prominent Name)
              </label>
              <div className="relative">
                <UserCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Shadow, Maverick, Ace"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/60 transition-all font-sans font-medium"
                />
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-2">
                Select VIP Avatar
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((avatar, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative rounded-xl p-1 border transition-all ${
                      selectedAvatar === avatar
                        ? 'border-gold shadow-gold-glow-sm bg-gold/10 scale-105'
                        : 'border-white/10 bg-background-elevated hover:border-white/30'
                    }`}
                  >
                    <img src={avatar} alt="Avatar" className="w-full h-auto rounded-lg" />
                  </button>
                ))}
              </div>
            </div>

            {/* Live Card Preview */}
            <div className="p-3.5 rounded-xl bg-[#14141E] border border-gold/20 flex items-center gap-3">
              <img
                src={selectedAvatar}
                alt="Selected"
                className="w-12 h-12 rounded-full border border-gold/40 object-cover bg-background-elevated"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-casino-muted uppercase font-mono tracking-wider">
                  Profile Preview
                </div>
                <div className="text-base font-black text-white truncate">
                  {nickname || 'Nickname'}
                </div>
                <div className="text-xs text-casino-muted truncate">{officialName}</div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full casino-gold-button py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Claim 1,000 Tokens & Enter Lounge</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

