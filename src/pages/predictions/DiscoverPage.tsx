import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, PlusCircle, Search, Filter } from 'lucide-react';
import { Prediction, PredictionCategory, PredictionStatus } from '@/types/prediction';
import { predictionService } from '@/services/predictionService';
import { PredictionCard } from '@/components/predictions/PredictionCard';
import { ParticipateModal } from '@/components/predictions/ParticipateModal';
import { FinalizeModal } from '@/components/predictions/FinalizeModal';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES: ('All' | PredictionCategory)[] = [
  'All',
  'College',
  'Sports',
  'Entertainment',
  'Friends',
  'Events',
  'General',
];

export const DiscoverPage: React.FC = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'All' | PredictionCategory>('All');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PredictionStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [finalizingPrediction, setFinalizingPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPredictions = async () => {
    try {
      const data = await predictionService.getPredictions({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: searchQuery.trim() || undefined,
      });
      setPredictions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [selectedCategory, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl lg:text-3xl text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-brand-violet" />
            <span>Discover Predictions</span>
          </h1>
          <p className="text-sm text-casino-muted">
            Explore live classroom prediction markets and pari-mutuel pools.
          </p>
        </div>

        <Link
          to="/create"
          className="casino-pink-button px-4 py-2.5 text-xs font-bold inline-flex items-center gap-2 self-start shadow-pink-glow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Prediction</span>
        </Link>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
          <input
            type="text"
            placeholder="Search prediction title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#110B29] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-brand-violet/60"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'OPEN', 'FINALIZED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer shrink-0 ${
                statusFilter === st
                  ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/40 shadow-brand-glow'
                  : 'bg-white/5 text-casino-muted hover:text-white border border-transparent'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-brand-violet to-brand-pink text-white font-bold shadow-brand-glow'
                : 'bg-background-card border border-white/5 text-casino-muted hover:text-white hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-16 text-center text-casino-muted">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Loading prediction pools...</span>
        </div>
      ) : predictions.length === 0 ? (
        <div className="p-12 text-center text-casino-muted casino-card">
          <Filter className="w-8 h-8 text-gold-highlight mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold text-white">No predictions match your filter</p>
          <p className="text-xs text-casino-muted mt-1">Try resetting the category or create a new prediction!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {predictions.map((pred) => (
            <PredictionCard
              key={pred.id}
              prediction={pred}
              currentUserId={user?.uid}
              isAdmin={user?.role === 'admin'}
              onParticipate={(p) => setSelectedPrediction(p)}
              onFinalize={(p) => setFinalizingPrediction(p)}
              onBetPlaced={fetchPredictions}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ParticipateModal
        prediction={selectedPrediction}
        onClose={() => setSelectedPrediction(null)}
        onSuccess={fetchPredictions}
      />

      <FinalizeModal
        prediction={finalizingPrediction}
        onClose={() => setFinalizingPrediction(null)}
        onSuccess={fetchPredictions}
      />
    </div>
  );
};
