import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailCheck, RefreshCw, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export const VerifyEmailPage: React.FC = () => {
  const [resending, setResending] = useState(false);
  const { firebaseUser, resendVerificationEmail, confirmVerification } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerificationEmail();
      success('Link Resent', 'Check your college inbox or spam folder.');
    } catch (err: any) {
      toastError('Error', err.message);
    } finally {
      setResending(false);
    }
  };

  const handleContinue = () => {
    confirmVerification();
    success('Email Confirmed!', 'Let us set up your profile and claim your 1,000 coins.');
    navigate('/setup-profile');
  };

  return (
    <div className="min-h-screen bg-[#090616] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Neon Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-brand-violet/10 blur-[130px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="casino-card p-6 sm:p-8 text-center border-brand-violet/30">
          <div className="w-16 h-16 rounded-2xl bg-brand-violet/15 border border-brand-violet/40 flex items-center justify-center mx-auto mb-4 text-brand-violet shadow-brand-glow">
            <MailCheck className="w-8 h-8" />
          </div>

          <h2 className="font-display font-black text-2xl text-white mb-2">
            Confirm Your College Email
          </h2>
          <p className="text-sm text-casino-muted mb-5">
            We sent a verification link to your verified student address:
          </p>

          <div className="p-3.5 rounded-xl bg-background-elevated border border-brand-purple/20 font-mono text-sm text-brand-violet mb-6 break-all">
            {firebaseUser?.email || 'your_id@ceconline.edu'}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full casino-primary-button py-3.5 px-4 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I Have Confirmed — Claim 1,000 Coins</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2.5 px-4 text-xs font-semibold text-casino-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>Resend Email</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
