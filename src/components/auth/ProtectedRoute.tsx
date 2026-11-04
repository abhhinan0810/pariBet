import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, firebaseUser, isVerified, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-mono text-gold-highlight tracking-widest uppercase">
          Verifying MCA Credentials...
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!user && !firebaseUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but email verification pending (in live Firebase mode)
  if (firebaseUser && !isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // User account suspended check
  if (user && user.accountStatus === 'suspended') {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-4">
          <span className="text-2xl font-bold">!</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Account Suspended</h2>
        <p className="text-casino-muted max-w-md text-sm mb-6">
          Your account has been placed on hold by a class administrator. Please contact your MCA
          class representative.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

