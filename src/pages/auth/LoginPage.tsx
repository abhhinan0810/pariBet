import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';
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
      await login(email, password);
      success('Welcome back!', 'Signed in successfully.');
      navigate(from, { replace: true });
    } catch (err: any) {
      toastError('Login Failed', err.message || 'Please check your college email or password.');
    } finally {
      setLoading(false);
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
            Sign In to pariBet
          </h1>
          <p className="text-xs text-casino-muted">
            Private MCA Classroom Prediction & Virtual Gaming Arena
          </p>
        </div>

        {/* Card */}
        <div className="casino-card p-6 sm:p-8 border-brand-violet/25">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
            <span className="text-xs font-semibold text-brand-violet flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>53 Verified MCA Seats</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
              ACTIVE
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full bg-[#110B29] border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#110B29] border border-white/10 rounded-xl px-10 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 casino-primary-button py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Log In to Arena</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Register Link */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-xs text-casino-muted mb-1.5">
              Don't have an account yet?
            </p>
            <Link
              to="/register"
              className="text-xs font-bold text-brand-pink hover:underline inline-flex items-center gap-1"
            >
              Verify Your College Email & Sign Up
            </Link>
          </div>
        </div>

        {/* Quick Testing Helper */}
        <div className="mt-5 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center text-xs text-casino-muted">
          <p className="mb-1 text-white font-semibold">Testing credentials:</p>
          <button
            type="button"
            onClick={() => {
              setEmail('chn25mca055@ceconline.edu');
              setPassword('password123');
            }}
            className="text-brand-violet font-mono underline hover:text-white transition-colors cursor-pointer"
          >
            Auto-fill: chn25mca055@ceconline.edu (Abhinav Krishna S)
          </button>
        </div>
      </motion.div>
    </div>
  );
};
