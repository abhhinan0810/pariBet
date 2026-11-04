import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Coins
} from 'lucide-react';
import {
  PredictionType,
  PredictionCategory,
  PredictionClosestConfig,
} from '@/types/prediction';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { predictionService } from '@/services/predictionService';
import { Card } from '@/components/common/Card';

const CATEGORIES: PredictionCategory[] = [
  'College',
  'Sports',
  'Entertainment',
  'Friends',
  'Events',
  'General',
];

export const CreatePredictionPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PredictionCategory>('College');
  const [type, setType] = useState<PredictionType>('YES_NO');
  const [minCommitment, setMinCommitment] = useState<number>(50);

  // Default deadlines: participation closes in 12 hours, result submission in 24 hours
  const now = new Date();
  const defaultPartDeadline = new Date(now.getTime() + 12 * 3600000)
    .toISOString()
    .slice(0, 16);
  const defaultResDeadline = new Date(now.getTime() + 24 * 3600000)
    .toISOString()
    .slice(0, 16);

  const [participationDeadline, setParticipationDeadline] = useState(defaultPartDeadline);
  const [resultSubmissionDeadline, setResultSubmissionDeadline] = useState(defaultResDeadline);

  // Type B & D: Custom Options
  const [customOptions, setCustomOptions] = useState<string[]>(['Option 1', 'Option 2']);

  // Type C: Closest Answer Config
  const [closestUnit, setClosestUnit] = useState('Marks');
  const [isInteger, setIsInteger] = useState(true);
  const [minVal, setMinVal] = useState<number | ''>(0);
  const [maxVal, setMaxVal] = useState<number | ''>(100);

  const [submitting, setSubmitting] = useState(false);

  const handleAddOption = () => {
    setCustomOptions([...customOptions, `Option ${customOptions.length + 1}`]);
  };

  const handleRemoveOption = (index: number) => {
    if (customOptions.length <= 2) {
      toastError('Minimum Options', 'You must provide at least 2 options.');
      return;
    }
    setCustomOptions(customOptions.filter((_, idx) => idx !== index));
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...customOptions];
    updated[index] = val;
    setCustomOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim() || !description.trim()) {
      toastError('Fields Missing', 'Please enter title and description.');
      return;
    }

    if (new Date(participationDeadline) <= new Date()) {
      toastError('Invalid Deadline', 'Participation deadline must be in the future.');
      return;
    }

    if (new Date(resultSubmissionDeadline) <= new Date(participationDeadline)) {
      toastError(
        'Invalid Deadline',
        'Result deadline must be after the participation deadline.'
      );
      return;
    }

    // Validation for Multiple Choice / Poll
    if (type === 'MULTIPLE_CHOICE' || type === 'GROUP_POLL') {
      const validOptions = customOptions.map((o) => o.trim()).filter(Boolean);
      if (validOptions.length < 2) {
        toastError('Insufficient Options', 'Please provide at least 2 non-empty options.');
        return;
      }
    }

    let closestConfig: PredictionClosestConfig | undefined = undefined;
    if (type === 'CLOSEST_ANSWER') {
      closestConfig = {
        unit: closestUnit.trim() || 'Units',
        isInteger,
        minVal: minVal !== '' ? Number(minVal) : undefined,
        maxVal: maxVal !== '' ? Number(maxVal) : undefined,
      };
    }

    setSubmitting(true);
    try {
      const newPred = await predictionService.createPrediction({
        title: title.trim(),
        description: description.trim(),
        type,
        category,
        creatorId: user.uid,
        creatorName: user.officialName,
        creatorNickname: user.nickname,
        creatorAvatar: user.profilePicture,
        minCommitment,
        participationDeadline: new Date(participationDeadline).toISOString(),
        resultSubmissionDeadline: new Date(resultSubmissionDeadline).toISOString(),
        customOptions:
          type === 'MULTIPLE_CHOICE' || type === 'GROUP_POLL'
            ? customOptions.map((o) => o.trim()).filter(Boolean)
            : undefined,
        closestConfig,
      });

      success('Prediction Created!', `"${newPred.title}" is now open for classroom bets.`);
      navigate('/');
    } catch (err: any) {
      toastError('Creation Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 lg:pb-10">
      {/* Top Header */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-casino-muted hover:text-white mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Lounge</span>
        </Link>
        <h1 className="font-display font-black text-2xl lg:text-3xl text-white flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-gold-highlight" />
          <span>Create New Prediction</span>
        </h1>
        <p className="text-sm text-casino-muted">
          Launch a prediction game for your MCA classmates with dynamic pari-mutuel odds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Type Selection */}
        <Card variant="gold-border" className="p-6 space-y-4">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gold-highlight">
            Step 1: Choose Prediction Format
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'YES_NO', label: 'YES / NO', desc: 'Binary holiday/events' },
              { id: 'MULTIPLE_CHOICE', label: 'Multiple Choice', desc: 'Tournament teams, options' },
              { id: 'CLOSEST_ANSWER', label: 'Closest Answer', desc: 'Numerical & viva marks' },
              { id: 'GROUP_POLL', label: 'Group Poll', desc: 'Class vote highest wins' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id as PredictionType)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  type === t.id
                    ? 'border-gold bg-gold/15 shadow-gold-glow-sm text-white'
                    : 'border-white/5 bg-background-elevated hover:border-white/20 text-casino-muted'
                }`}
              >
                <div className="font-bold text-xs text-white">{t.label}</div>
                <div className="text-[10px] text-casino-muted mt-1 line-clamp-2">{t.desc}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Step 2: Basic Info */}
        <Card variant="default" className="p-6 space-y-4">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-casino-muted">
            Step 2: Prediction Details
          </label>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
              Title / Question
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Will tomorrow's cloud computing lecture be rescheduled?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
              Detailed Description & Resolution Criteria
            </label>
            <textarea
              required
              rows={3}
              placeholder="State exactly how and when the outcome will be decided (e.g. Official WhatsApp circular from HOD)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-casino-muted/50 focus:outline-none focus:border-gold resize-none"
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-gold/20 text-gold-highlight border border-gold/40'
                      : 'bg-background-elevated text-casino-muted hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Step 3: Type-Specific Options Configuration */}
        {(type === 'MULTIPLE_CHOICE' || type === 'GROUP_POLL') && (
          <Card variant="default" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-casino-muted">
                Custom Options
              </label>
              <button
                type="button"
                onClick={handleAddOption}
                className="text-xs text-gold-highlight hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Option</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {customOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-xs text-casino-muted w-6">#{idx + 1}</span>
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 bg-[#12121A] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
                  />
                  {customOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-2 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Type C Closest Answer Options */}
        {type === 'CLOSEST_ANSWER' && (
          <Card variant="default" className="p-6 space-y-4">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-casino-muted">
              Closest Answer Configuration
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                  Unit Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marks, Minutes, Points"
                  value={closestUnit}
                  onChange={(e) => setClosestUnit(e.target.value)}
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                  Number Mode
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInteger(true)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isInteger
                        ? 'bg-gold/20 text-gold-highlight border border-gold/40'
                        : 'bg-background-elevated text-casino-muted border border-white/5'
                    }`}
                  >
                    Integers Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInteger(false)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      !isInteger
                        ? 'bg-gold/20 text-gold-highlight border border-gold/40'
                        : 'bg-background-elevated text-casino-muted border border-white/5'
                    }`}
                  >
                    Decimals Allowed
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                  Minimum Value (Optional)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={minVal}
                  onChange={(e) => setMinVal(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                  Maximum Value (Optional)
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={maxVal}
                  onChange={(e) => setMaxVal(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 4: Deadlines & Stakes */}
        <Card variant="default" className="p-6 space-y-4">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-casino-muted">
            Step 3: Staking Rules & Deadlines
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                Minimum Stake (Tokens)
              </label>
              <input
                type="number"
                min={10}
                required
                value={minCommitment}
                onChange={(e) => setMinCommitment(Number(e.target.value))}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                Participation Deadline
              </label>
              <input
                type="datetime-local"
                required
                value={participationDeadline}
                onChange={(e) => setParticipationDeadline(e.target.value)}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                Result Submission Deadline
              </label>
              <input
                type="datetime-local"
                required
                value={resultSubmissionDeadline}
                onChange={(e) => setResultSubmissionDeadline(e.target.value)}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full casino-gold-button py-4 px-6 flex items-center justify-center gap-2 text-base font-bold cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Publish Prediction to Classroom</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
