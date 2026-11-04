import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-3xl font-mono font-black text-gold-highlight mb-4 shadow-gold-glow">
        404
      </div>
      <h2 className="text-2xl font-display font-black text-white mb-2">Page Not Found</h2>
      <p className="text-sm text-casino-muted max-w-sm mb-6">
        The table or prediction you are looking for does not exist in the VIP gaming room.
      </p>
      <Link to="/" className="casino-gold-button px-6 py-2.5 text-xs font-bold inline-flex items-center gap-2">
        <Home className="w-4 h-4" />
        <span>Return to Lounge</span>
      </Link>
    </div>
  );
};

