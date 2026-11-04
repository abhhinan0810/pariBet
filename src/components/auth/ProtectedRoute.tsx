import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, firebaseUser, isVerified, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090616] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-2 border-brand-violet border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-brand-purple tracking-widest uppercase">
          Loading Classroom Lounge...
        </p>
      </div>
    );
  }

  // If user profile is already created and active, they are fully authenticated!
  if (user && user.accountStatus === 'active') {
    return <>{children}</>;
  }

  // Not authenticated at all
  if (!user && !firebaseUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Account suspended
  if (user && user.accountStatus === 'suspended') {
    return (
      <div className="min-h-screen bg-[#090616] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-4">
          <span className="text-2xl font-bold">!</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Account On Hold</h2>
        <p className="text-casino-muted max-w-md text-sm mb-6">
          Your account has been temporarily placed on hold by an administrator.
        </p>
      </div>
    );
  }

  // Authenticated with Firebase, but no profile created yet -> redirect to setup profile
  if (firebaseUser && !user) {
    return <Navigate to="/setup-profile" replace />;
  }

  return <>{children}</>;
};
