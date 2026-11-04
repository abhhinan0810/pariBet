import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailCheck, RefreshCw, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export const VerifyEmailPage: React.FC = () => {
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const { firebaseUser, resendVerificationEmail, isDemoMode, refreshUserProfile } = useAuth();
  const { success, error: toastError, info } = useToast();
  const navigate = useNavigate();

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerificationEmail();
      success('Link Resent', 'Verification email has been sent again.');
    } catch (err: any) {
      toastError('Failed to Resend', err.message);
    } finally {
      setResending(false);
    }
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      if (firebaseUser) {
        await firebaseUser.reload();
        if (firebaseUser.emailVerified || isDemoMode) {
          success('Email Verified!', 'Proceeding to complete your profile.');
          await refreshUserProfile();
          navigate('/setup-profile');
          return;
        }
      }
      info('Not Verified Yet', 'Please click the link in your college inbox and tap Check Status again.');
    } catch (err: any) {
      toastError('Error Checking', err.message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="casino-card p-6 sm:p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4 text-gold-highlight shadow-gold-glow-sm">
            <MailCheck className="w-8 h-8" />
          </div>

          <h2 className="font-display font-black text-2xl text-white mb-2">
            Verify College Email
          </h2>
          <p className="text-sm text-casino-muted mb-6">
            We sent an authoritative verification link to your verified MCA email address:
          </p>

          <div className="p-3 rounded-xl bg-[#12121A] border border-white/10 font-mono text-sm text-gold-highlight mb-6 break-all">
            {firebaseUser?.email || 'your_admission_number@ceconline.edu'}
          </div>

          <div className="p-3.5 rounded-xl bg-gold/5 border border-gold/20 text-xs text-left mb-6 space-y-2">
            <div className="flex items-center gap-2 text-gold-highlight font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Strict Classroom Verification</span>
            </div>
            <p className="text-casino-muted pl-6 text-[11px] leading-relaxed">
              Only verified CEConline college emails registered in the MCA directory are activated. Once you confirm the link in your inbox, tap below to enter the lounge.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCheckStatus}
              disabled={checking}
              className="w-full casino-gold-button py-3 px-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {checking ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Have Verified — Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2.5 px-4 text-xs font-semibold text-casino-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>Resend Verification Email</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

