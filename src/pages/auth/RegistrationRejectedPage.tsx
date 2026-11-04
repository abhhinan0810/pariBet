import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldX, AlertTriangle, ArrowLeft, Mail } from 'lucide-react';

export const RegistrationRejectedPage: React.FC = () => {
  const location = useLocation();
  const attemptedEmail = (location.state as any)?.attemptedEmail || 'unknown@domain.com';
  const reason =
    (location.state as any)?.reason ||
    'Your email address was not found in the official 53-student MCA classroom roster.';

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="casino-card p-6 sm:p-8 text-center border-rose-500/20">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-500 shadow-lg shadow-rose-950/40">
            <ShieldX className="w-8 h-8" />
          </div>

          <span className="inline-block text-[10px] font-mono font-bold tracking-widest text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full uppercase mb-2">
            Registration Denied
          </span>

          <h2 className="font-display font-black text-2xl text-white mb-2">
            Classroom Access Restricted
          </h2>

          <p className="text-sm text-casino-muted mb-6">
            pariBet is an exclusive, closed-community platform strictly restricted to verified MCA students of the CEC class.
          </p>

          <div className="p-4 rounded-xl bg-background-elevated border border-white/5 text-left mb-6 space-y-2">
            <div className="text-[11px] font-mono text-casino-muted uppercase">
              Attempted Credentials
            </div>
            <div className="font-mono text-sm text-rose-300 font-medium break-all flex items-center gap-2">
              <Mail className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{attemptedEmail}</span>
            </div>
            <div className="pt-2 border-t border-white/5 text-xs text-casino-muted flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/register"
              className="w-full casino-gold-button py-3 px-4 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Try With Approved College Email</span>
            </Link>

            <Link
              to="/login"
              className="block w-full py-2.5 px-4 text-xs font-semibold text-casino-muted hover:text-white transition-colors"
            >
              Return to Member Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

