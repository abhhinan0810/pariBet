import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { studentService } from '@/services/studentService';
import { ApprovedStudent } from '@/types/user';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
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
    } else {
      setRosterError(result.error || 'Student email not found in approved roster.');
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
      const res = await register(email, password);
      success('Verified Student Match!', `Welcome, ${res.studentData.official_name}`);
      // Smoothly navigate straight to setup profile to choose gamer tag & claim 1000 coins
      navigate('/setup-profile');
    } catch (err: any) {
      navigate('/registration-rejected', {
        state: { attemptedEmail: email, reason: err.message }
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090616] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Neon Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-brand-violet/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-xs text-casino-muted hover:text-white flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Landing</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-pink p-0.5 shadow-brand-glow mb-4">
            <div className="w-full h-full bg-[#0E0924] rounded-[14px] flex items-center justify-center">
              <span className="font-display font-black text-2xl text-white">P</span>
            </div>
          </div>
          <h1 className="font-display font-black text-3xl tracking-tight text-white mb-1.5">
            Create Account
          </h1>
          <p className="text-xs text-casino-muted">
            Join the MCA Classroom Prediction & Virtual Gaming Arena
          </p>
        </div>

        {/* Card */}
        <div className="casino-card p-6 sm:p-8 border-brand-violet/25">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
            <span className="text-xs font-semibold text-brand-violet flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Official College Roster</span>
            </span>
            <span className="text-[10px] font-mono text-brand-pink bg-brand-pink/10 px-2 py-0.5 rounded-full font-bold">
              53 Seats
            </span>
          </div>

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
                  className="w-full bg-[#110B29] border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all font-mono"
                />
                {checkingRoster && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-brand-violet border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>

            {/* Live Student Match Card */}
            {verifiedStudent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 rounded-xl bg-brand-violet/15 border border-brand-violet/40 text-xs"
              >
                <div className="flex items-center gap-2 text-brand-violet font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Approved Student Match</span>
                </div>
                <div className="text-white font-medium pl-6">{verifiedStudent.official_name}</div>
                <div className="text-[11px] font-mono text-casino-muted pl-6 uppercase">
                  Admission: {verifiedStudent.admission_number}
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
                  className="w-full bg-[#110B29] border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all font-mono"
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
                  className="w-full bg-[#110B29] border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 casino-pink-button py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Verify Email & Join (1,000 Free Coins)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Login Link */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-xs text-casino-muted mb-1.5">Already verified?</p>
            <Link
              to="/login"
              className="text-xs font-bold text-brand-violet hover:underline inline-flex items-center gap-1"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
