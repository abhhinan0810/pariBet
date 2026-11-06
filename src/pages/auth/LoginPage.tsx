import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/home';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res?.isAdmin) {
        success('Admin Access Granted', 'Welcome to Master Administrator Control.');
        navigate('/admin', { replace: true });
      } else {
        success('Welcome back!', 'Signed in successfully.');
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      toastError('Login Failed', err.message || 'Please check your email and password.');
    } finally {
      setLoading(false);
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
            Sign In to Lounge
          </h1>
          <p className="text-xs text-casino-muted">
            Private MCA Classroom Prediction & Virtual Gaming Club
          </p>
        </div>

        {/* Card */}
        <div className="casino-card p-5 sm:p-8 border-white/5 shadow-card-glow">
          {/* DOB Classroom Instruction Banner */}
          <div className="mb-5 p-3 rounded-2xl bg-amber-400/10 border border-amber-400/25 flex items-start gap-2.5">
            <span className="text-base shrink-0 mt-0.5">🎫</span>
            <div className="text-[11px] leading-snug text-slate-300">
              <span className="font-bold text-amber-300 block mb-0.5 font-mono uppercase text-[10px]">
                Classroom Direct Login
              </span>
              First time logging in? Enter your <span className="text-white font-mono font-semibold">admission number</span> and your <span className="text-amber-400 font-mono font-semibold">Date of Birth (DDMMYYYY)</span> as your initial password. No email verification required!
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5 font-mono">
                Admission No. or College Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
                <input
                  type="text"
                  required
                  placeholder="e.g. chn25mca045 or chn25mca045@ceconline.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-amber-400/60 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5 font-mono">
                Password / Initial DOB (DDMMYYYY)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
                <input
                  type="password"
                  required
                  placeholder="Date of Birth (DDMMYYYY) or Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-amber-400/60 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 vip-gold-btn py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs font-black uppercase tracking-wider whitespace-nowrap"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Log In to Lounge</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>

          {/* Quick Roster Note */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-xs text-casino-muted mb-1">
              Verified CEC MCA Class of 2025 Member?
            </p>
            <p className="text-[11px] text-amber-300 font-mono">
              All 53 students are pre-registered on the roster. Simply sign in with your Admission No. and DOB above!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
