import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, User, ArrowRight, AlertCircle, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { studentService } from '@/services/studentService';
import { ApprovedStudent } from '@/types/user';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkingRoster, setCheckingRoster] = useState(false);
  const [verifiedStudent, setVerifiedStudent] = useState<ApprovedStudent | null>(null);
  const [rosterError, setRosterError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleEmailBlur = async () => {
    if (!email.trim()) return;
    setCheckingRoster(true);
    setRosterError(null);
    setVerifiedStudent(null);

    const result = await studentService.verifyStudentEmail(email);
    setCheckingRoster(false);

    if (result.isApproved && result.studentData) {
      setVerifiedStudent(result.studentData);
      if (!nickname.trim()) {
        setNickname(result.studentData.official_name.split(' ')[0]);
      }
    } else {
      setRosterError(result.error || 'Student email not found in approved college directory.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    if (password.length < 6) {
      toastError('Password Too Short', 'Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      toastError('Passwords Mismatch', 'Your passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await register(email, password, nickname);
      success('Welcome to pariBet!', `Account created! 1,000 Free Coins credited to your wallet.`);
      navigate('/home', { replace: true });
    } catch (err: any) {
      toastError('Registration Failed', err.message || 'Registration could not be completed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Subtle Ambient Red/Gold Casino Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-red-600/10 blur-[160px] rounded-full pointer-events-none" />

      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-xs text-casino-muted hover:text-white flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="whitespace-nowrap">Back to Landing</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header with New Official PNG Logos */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img
              src="/images/mca.png"
              alt="MCA"
              className="w-12 h-12 rounded-xl object-contain p-1.5 bg-white/5 border border-white/10 shadow-red-glow"
            />
            <img
              src="/images/logo.png"
              alt="pariBET"
              className="h-9 w-auto object-contain"
            />
          </div>
          <h1 className="font-display font-black text-2xl tracking-tight text-white mb-1">
            Create Account
          </h1>
          <p className="text-xs text-casino-muted">
            Join the MCA Classroom Prediction & Virtual Gaming Club
          </p>
        </div>

        {/* Card */}
        <div className="casino-card p-5 sm:p-8 border-white/5 shadow-card-glow">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                College Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
                <input
                  type="email"
                  required
                  placeholder="admission_number@ceconline.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none transition-all font-mono"
                />
                {checkingRoster && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>

            {/* Live Student Match Notification */}
            {verifiedStudent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs"
              >
                <div className="flex items-center gap-2 text-red-400 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified Student Match</span>
                </div>
                <div className="text-white font-medium pl-6">{verifiedStudent.official_name}</div>
                <div className="text-[11px] font-mono text-slate-400 pl-6 uppercase">
                  Admission No: {verifiedStudent.admission_number}
                </div>
              </motion.div>
            )}

            {rosterError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-start gap-2 text-rose-300"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{rosterError}</span>
              </motion.div>
            )}

            {/* Gamer Nickname Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                Gamer Nickname
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
                <input
                  type="text"
                  placeholder="e.g. Shadow, Maverick, Ace"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
                <input
                  type="password"
                  required
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 vip-gold-btn py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs font-black uppercase tracking-wider text-black whitespace-nowrap"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Join Lounge (1,000 Free Coins)</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>

          {/* Quick Login Link */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-xs text-casino-muted mb-1.5">Already registered?</p>
            <Link
              to="/login"
              className="text-xs font-bold text-amber-400 hover:text-red-400 hover:underline inline-flex items-center gap-1 whitespace-nowrap"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
