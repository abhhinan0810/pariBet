import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
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

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    try {
      await login(email, password);
      success('Welcome back!', 'Authentication successful.');
      navigate(from, { replace: true });
    } catch (err: any) {
      toastError('Login Failed', err.message || 'Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Glow Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

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
            pariBet VIP Club
          </h1>
          <p className="text-sm text-casino-muted">
            Private Prediction & Virtual Token Gaming Platform
          </p>
        </div>

        {/* Card */}
        <div className="casino-card p-6 sm:p-8">
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-highlight" />
              <span className="text-xs font-mono uppercase tracking-wider text-gold-highlight font-semibold">
                Classroom Member Access
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              PORTAL ACTIVE
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
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/60 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/60 transition-all font-mono"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 casino-gold-button py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Enter Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Register Link */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-xs text-casino-muted mb-2">
              New MCA classmate joining for the first time?
            </p>
            <Link
              to="/register"
              className="text-sm font-semibold text-gold-highlight hover:underline inline-flex items-center gap-1"
            >
              Verify Your College Roster & Join
            </Link>
          </div>
        </div>

        {/* Quick Testing Helper */}
        <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center text-xs text-casino-muted">
          <p className="mb-1 text-white font-semibold">Need a quick test login?</p>
          <button
            type="button"
            onClick={() => {
              setEmail('chn25mca055@ceconline.edu');
              setPassword('password123');
            }}
            className="text-gold-highlight font-mono underline hover:text-white transition-colors"
          >
            Auto-fill: chn25mca055@ceconline.edu (Abhinav Krishna S)
          </button>
        </div>
      </motion.div>
    </div>
  );
};

