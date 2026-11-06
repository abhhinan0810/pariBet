import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Sparkles, User, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { studentService } from '@/services/studentService';

interface FirstLoginModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const AVATAR_SEEDS = [
  'ShadowAce',
  'GoldenOracle',
  'ViperX',
  'NeonBlade',
  'QuantumGod',
  'CryptoKing',
  'CyberKnight',
  'HighRoller',
];

export const FirstLoginModal: React.FC<FirstLoginModalProps> = ({ isOpen, onComplete }) => {
  const { user, completeProfileSetup } = useAuth();
  const { success, error: toastError } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || user?.officialName?.split(' ')[0] || '');
  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.profilePicture || `https://api.dicebear.com/7.x/bottts/svg?seed=${AVATAR_SEEDS[0]}`
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toastError('Password Too Short', 'Permanent password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      toastError('Passwords Do Not Match', 'Please ensure both passwords match.');
      return;
    }

    if (!nickname.trim()) {
      toastError('Nickname Required', 'Please enter a player nickname for the casino tables.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Save permanent password in credential store
      await studentService.setStudentPermanentPassword(user.admissionNumber, password);

      // 2. Complete profile setup with chosen nickname & avatar
      await completeProfileSetup(nickname.trim(), selectedAvatar);

      success('Welcome to pariBet Lounge!', '1,000 PTS credited! Your permanent password has been set.');
      onComplete();
    } catch (err: any) {
      toastError('Setup Failed', err.message || 'Could not finalize your account setup.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-lg bg-[#0C0D14] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.2)] relative max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="text-center pb-4 border-b border-white/10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>First-Time Lounge Activation</span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white">
              Claim Your Seat at the Table
            </h2>
            <p className="text-xs text-casino-muted mt-1 max-w-md mx-auto">
              Welcome, <span className="text-white font-semibold">{user.officialName}</span> (
              <span className="font-mono text-amber-400 uppercase">{user.admissionNumber}</span>). Set your permanent password and claim your 1,000 PTS bankroll.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4.5 mt-5">
            {/* Nickname Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-casino-muted mb-1.5">
                Casino Table Nickname
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Shadow, Oracle, Viper"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-2.5 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-amber-400/60 font-medium"
                />
              </div>
              <span className="text-[10px] text-casino-muted/70 mt-1 block">
                This handle will appear on live prediction slips and the classroom Hall of Fame.
              </span>
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-casino-muted mb-1.5">
                Select Your Avatar
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVATAR_SEEDS.map((seed) => {
                  const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
                  const isSelected = selectedAvatar === url;
                  return (
                    <button
                      type="button"
                      key={seed}
                      onClick={() => setSelectedAvatar(url)}
                      className={`relative rounded-xl p-1 border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/20 shadow-gold-glow-sm scale-105'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <img src={url} alt={seed} className="w-9 h-9 mx-auto object-contain" />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-black rounded-full flex items-center justify-center text-[9px] font-bold">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* New Permanent Password */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-casino-muted mb-1.5">
                New Permanent Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-2.5 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-amber-400/60 font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-casino-muted hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Permanent Password */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-casino-muted mb-1.5">
                Confirm Permanent Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-2.5 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-amber-400/60 font-mono"
                />
              </div>
            </div>

            {/* Welcome Perk Summary */}
            <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold text-lg shadow">
                  🪙
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Starter Bankroll Granted</span>
                  <span className="text-[11px] text-amber-300 font-mono">1,000 Virtual Points credited</span>
                </div>
              </div>
              <span className="font-mono font-black text-amber-400 text-sm">+1,000 PTS</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full vip-gold-btn py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-gold-glow"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{submitting ? 'Activating Profile...' : 'Activate & Enter Table →'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
