import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
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

  // Handle email blur to pre-verify against roster and show student official name!
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
      setRosterError(result.error || 'Student not found in approved roster.');
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
      if (res.requiresVerification) {
        navigate('/verify-email');
      } else {
        navigate('/setup-profile');
      }
    } catch (err: any) {
      navigate('/registration-rejected', {
        state: { attemptedEmail: email, reason: err.message }
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-gradient p-0.5 shadow-gold-glow mb-4">
            <div className="w-full h-full bg-[#0E0E14] rounded-[14px] flex items-center justify-center">
              <span className="font-display font-black text-2xl text-gold-highlight">P</span>
            </div>
          </div>
          <h1 className="font-display font-black text-3xl tracking-wide text-white mb-2">
            VIP Registration
          </h1>
          <p className="text-sm text-casino-muted font-sans">
            Private MCA Classroom Prediction & Virtual Token Club
          </p>
        </div>

        {/* Card */}
        <div className="casino-card p-6 sm:p-8 relative">
          {/* VIP Badge */}
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-highlight" />
              <span className="text-xs font-mono uppercase tracking-wider text-gold-highlight font-semibold">
                Approved MCA Roster Only
              </span>
            </div>
            <span className="text-[11px] font-mono bg-white/5 text-casino-muted px-2 py-0.5 rounded">
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
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/60 transition-all font-mono"
                />
                {checkingRoster && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              <p className="text-[11px] text-casino-muted mt-1">
                Must match your CEC college MCA email format
              </p>
            </div>

            {/* Live Roster Verification Card */}
            {verifiedStudent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 rounded-xl bg-gold/10 border border-gold/30 text-xs"
              >
                <div className="flex items-center gap-2 text-gold-highlight font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Approved MCA Student Identified</span>
                </div>
                <div className="mt-1 text-white font-medium pl-6">
                  {verifiedStudent.official_name}
                </div>
                <div className="text-[11px] font-mono text-casino-muted pl-6 uppercase">
                  Admission: {verifiedStudent.admission_number}
                </div>
              </motion.div>
            )}

            {/* Roster Error Alert */}
            {rosterError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-start gap-2.5 text-rose-300"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{rosterError}</span>
              </motion.div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/60 transition-all font-mono"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
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
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/60 transition-all font-mono"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 casino-gold-button py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Verify & Join pariBet</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Roster Helper for Testing */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-xs text-casino-muted mb-2">
              Already verified your student credentials?
            </p>
            <Link
              to="/login"
              className="text-sm font-semibold text-gold-highlight hover:underline inline-flex items-center gap-1"
            >
              Sign In to Gaming Lounge
            </Link>
          </div>
        </div>

        {/* Demo Helper Pill */}
        <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center text-xs text-casino-muted">
          <span className="font-semibold text-white">Classroom Testing:</span> You can test with any approved student email like{' '}
          <span
            className="text-gold-highlight cursor-pointer underline font-mono"
            onClick={() => setEmail('chn25mca055@ceconline.edu')}
          >
            chn25mca055@ceconline.edu
          </span>{' '}
          or{' '}
          <span
            className="text-gold-highlight cursor-pointer underline font-mono"
            onClick={() => setEmail('chn25mca045@ceconline.edu')}
          >
            chn25mca045@ceconline.edu
          </span>
        </div>
      </motion.div>
    </div>
  );
};

