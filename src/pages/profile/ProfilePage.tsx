import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Edit3, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { userService } from '@/services/userService';
import { Card } from '@/components/common/Card';

export const ProfilePage: React.FC = () => {
  const { user, logout, refreshUserProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await userService.updateProfile(user.uid, {
        nickname: nickname.trim(),
        bio: bio.trim()
      });
      await refreshUserProfile();
      setIsEditing(false);
      success('Profile Updated', 'Your gaming persona has been refreshed.');
    } catch (err: any) {
      toastError('Update Failed', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-10">
      {/* Profile Header Card */}
      <Card variant="gold-border" className="p-6 sm:p-8 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user?.profilePicture}
            alt={user?.nickname}
            className="w-24 h-24 rounded-full border-2 border-gold shadow-gold-glow object-cover bg-background-elevated shrink-0"
          />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                {/* Prominent Nickname */}
                <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
                  {user?.nickname}
                </h1>
                {/* Official Name Below (Smaller) */}
                <p className="text-sm font-medium text-casino-muted mt-0.5">
                  Official name: <span className="text-white font-semibold">{user?.officialName}</span>
                </p>
              </div>

              <span className="self-center sm:self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>MCA MEMBER</span>
              </span>
            </div>

            {/* Read-Only Academic Identifier */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-background-elevated border border-white/5 text-xs font-mono text-gold-highlight uppercase mt-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Admission No: {user?.admissionNumber}</span>
            </div>

            {user?.bio && (
              <p className="text-xs text-casino-muted/90 mt-3 font-sans italic">
                "{user.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-white/5">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5 text-gold-highlight" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Persona'}</span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-400 border border-rose-500/20 flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </Card>

      {/* Edit Form */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="casino-card p-6"
        >
          <h2 className="text-sm font-mono uppercase tracking-wider text-gold-highlight font-bold mb-4">
            Edit Display Nickname
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                Gaming Nickname
              </label>
              <input
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-casino-muted mb-1.5">
                Bio / Motto
              </label>
              <input
                type="text"
                maxLength={100}
                placeholder="Share your gaming motto"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div className="p-3 rounded-xl bg-background-elevated border border-white/5 text-xs text-casino-muted flex items-center gap-2">
              <Lock className="w-4 h-4 text-gold-highlight shrink-0" />
              <span>
                Official Name ({user?.officialName}) and Admission Number are permanently locked by college administration.
              </span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="casino-gold-button px-5 py-2.5 text-xs font-bold"
            >
              {saving ? 'Saving...' : 'Save Nickname'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Stats Summary */}
      <Card variant="default" className="p-6">
        <h3 className="text-xs font-mono uppercase tracking-wider text-casino-muted font-bold mb-4">
          Player Record
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-background-elevated border border-white/5">
            <span className="text-[10px] text-casino-muted block uppercase">Virtual Tokens</span>
            <span className="text-xl font-bold font-mono text-gold-highlight">
              {user?.walletBalance.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-background-elevated border border-white/5">
            <span className="text-[10px] text-casino-muted block uppercase">Predictions Won</span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              {user?.statistics.predictionsWon || 0}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-background-elevated border border-white/5">
            <span className="text-[10px] text-casino-muted block uppercase">Win Rate</span>
            <span className="text-xl font-bold font-mono text-white">
              {user?.statistics.winRate || 0}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-background-elevated border border-white/5">
            <span className="text-[10px] text-casino-muted block uppercase">Account Role</span>
            <span className="text-xs font-bold font-mono text-white uppercase mt-1 block">
              {user?.role || 'regular_user'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
