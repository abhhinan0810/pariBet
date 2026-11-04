import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Lock, ArrowRight, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { CoinIcon } from '@/components/common/CoinIcon';

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=ShadowAce&backgroundColor=140d33',
  'https://api.dicebear.com/7.x/bottts/svg?seed=GoldenOracle&backgroundColor=140d33',
  'https://api.dicebear.com/7.x/bottts/svg?seed=CryptoKing&backgroundColor=140d33',
  'https://api.dicebear.com/7.x/bottts/svg?seed=ViperX&backgroundColor=140d33',
  'https://api.dicebear.com/7.x/bottts/svg?seed=NeonBlade&backgroundColor=140d33',
  'https://api.dicebear.com/7.x/bottts/svg?seed=QuantumGod&backgroundColor=140d33',
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
      toastError('Username Required', 'Please enter a nickname.');
      return;
    }

    setSubmitting(true);
    try {
      await completeProfileSetup(nickname.trim(), selectedAvatar);
      success('Welcome to pariBet!', '1,000 Free Coins credited to your wallet.');
      // Smoothly navigate directly to the authenticated home dashboard
      navigate('/home');
    } catch (err: any) {
      toastError('Setup Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090616] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Neon Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-brand-violet/15 blur-[140px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="casino-card p-6 sm:p-8 border-brand-violet/30">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violet/15 border border-brand-violet/30 text-brand-violet text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 2 of 2: Create Persona</span>
            </div>
            <h2 className="font-display font-black text-2xl text-white">
              Choose Your Gamer Nickname
            </h2>
            <p className="text-xs text-casino-muted mt-1">
              This is your display name on prediction cards and leaderboards.
            </p>
          </div>

          {/* Welcome Bonus Callout - Styled like the reference images */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-violet/20 via-brand-pink/15 to-transparent border border-brand-violet/40 mb-5 flex items-center justify-between shadow-brand-glow">
            <div className="flex items-center gap-3">
              <CoinIcon size={34} />
              <div>
                <p className="text-xs text-brand-violet font-bold">Welcome Bonus</p>
                <p className="text-sm font-black text-white font-mono">1,000 Free Coins</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              READY
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Read-Only Official Student Credentials */}
            <div className="p-3.5 rounded-xl bg-background-elevated border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-casino-muted">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-brand-violet" />
                  Verified Student Identity
                </span>
                <span className="flex items-center gap-1 text-[10px] text-casino-muted/70">
                  <Lock className="w-2.5 h-2.5" /> LOCKED
                </span>
              </div>
              <div className="text-xs font-semibold text-white">{officialName}</div>
              <div className="text-[11px] font-mono text-brand-violet uppercase">
                Admission: {admissionNumber}
              </div>
            </div>

            {/* Choose Gamer Nickname */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                Display Nickname
              </label>
              <div className="relative">
                <UserCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ace, Shadow, Maverick"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-[#110B29] border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all font-medium"
                />
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-2">
                Pick Your Avatar
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((avatar, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative rounded-xl p-1 border transition-all cursor-pointer ${
                      selectedAvatar === avatar
                        ? 'border-brand-violet shadow-brand-glow bg-brand-violet/20 scale-105'
                        : 'border-white/10 bg-background-elevated hover:border-white/30'
                    }`}
                  >
                    <img src={avatar} alt="Avatar" className="w-full h-auto rounded-lg" />
                  </button>
                ))}
              </div>
            </div>

            {/* Live Profile Card Preview */}
            <div className="p-3.5 rounded-xl bg-[#110B29] border border-brand-violet/30 flex items-center gap-3">
              <img
                src={selectedAvatar}
                alt="Selected"
                className="w-11 h-11 rounded-full border border-brand-violet object-cover bg-background-elevated shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-casino-muted uppercase font-mono tracking-wider">
                  Profile Preview
                </div>
                <div className="text-sm font-black text-white truncate">
                  {nickname || 'Your Nickname'}
                </div>
                <div className="text-xs text-casino-muted truncate">{officialName}</div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full casino-primary-button py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Claim 1,000 Coins & Enter</span>
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
