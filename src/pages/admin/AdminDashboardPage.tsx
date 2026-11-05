import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Coins,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  RefreshCw,
  Sliders,
  Award
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { predictionService } from '@/services/predictionService';
import { SystemStats, AdminLog } from '@/types/admin';
import { Prediction } from '@/types/prediction';
import { UserProfile } from '@/types/user';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/common/Card';
import { CoinIcon } from '@/components/common/CoinIcon';

type AdminTab = 'overview' | 'users' | 'predictions' | 'adjustments' | 'logs';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [betFilter, setBetFilter] = useState<'ALL' | 'OPEN' | 'FINALIZED' | 'CANCELLED'>('ALL');

  // Create User Modal state
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newAdmission, setNewAdmission] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [newBalance, setNewBalance] = useState(1000);

  // Edit User Modal state
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editNickname, setEditNickname] = useState('');
  const [editBalance, setEditBalance] = useState(0);

  // Force Resolve Prediction Modal state
  const [resolvingPred, setResolvingPred] = useState<Prediction | null>(null);
  const [winningOptionId, setWinningOptionId] = useState('');
  const [actualClosestValue, setActualClosestValue] = useState<number | ''>('');

  // Token Adjustment Form
  const [adjAdmission, setAdjAdmission] = useState('chn25mca055');
  const [adjAmount, setAdjAmount] = useState<number>(500);
  const [adjReason, setAdjReason] = useState<string>('Tournament victory reward');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [s, p, u, l] = await Promise.all([
        adminService.getSystemStats(),
        predictionService.getPredictions(),
        adminService.getAllUsers(),
        adminService.getLogs()
      ]);
      setStats(s);
      setPredictions(p);
      setUsersList(u);
      setLogs(l);
    } catch (err: any) {
      console.warn('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // --- USER CONTROLS ---
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newEmail || !newName || !newAdmission) return;

    try {
      await adminService.createUser({
        email: newEmail,
        officialName: newName,
        admissionNumber: newAdmission,
        nickname: newNickname || newName.split(' ')[0],
        initialBalance: newBalance,
        adminUid: user.uid,
      });
      success('User Created', `Successfully created user account for ${newName}.`);
      setShowCreateUser(false);
      setNewEmail('');
      setNewName('');
      setNewAdmission('');
      setNewNickname('');
      await fetchAdminData();
    } catch (err: any) {
      toastError('Creation Failed', err.message);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingUser) return;

    try {
      await adminService.updateUser(
        editingUser.uid,
        {
          nickname: editNickname.trim() || editingUser.nickname,
          walletBalance: Number(editBalance)
        },
        user.uid,
        'Admin manual profile & balance adjustment'
      );
      success('User Updated', `Updated profile for ${editingUser.officialName}.`);
      setEditingUser(null);
      await fetchAdminData();
    } catch (err: any) {
      toastError('Update Failed', err.message);
    }
  };

  const handleDeleteUser = async (targetUser: UserProfile) => {
    if (!user) return;
    if (targetUser.role === 'admin') {
      toastError('Restricted', 'Master Administrator account cannot be deleted.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete user "${targetUser.officialName}" (${targetUser.admissionNumber})?`
    );
    if (!confirmed) return;

    try {
      await adminService.deleteUser(targetUser.uid, user.uid, 'Administrative deletion request');
      success('User Deleted', `Account for ${targetUser.officialName} was removed.`);
      await fetchAdminData();
    } catch (err: any) {
      toastError('Deletion Failed', err.message);
    }
  };

  const handleToggleSuspend = async (targetUser: UserProfile) => {
    if (!user) return;
    const nextStatus = targetUser.accountStatus === 'active' ? 'suspended' : 'active';
    try {
      await adminService.setAccountStatus(
        targetUser.uid,
        nextStatus,
        user.uid,
        `Admin status change to ${nextStatus}`
      );
      success('Account Status Changed', `${targetUser.nickname} is now ${nextStatus.toUpperCase()}.`);
      await fetchAdminData();
    } catch (err: any) {
      toastError('Action Failed', err.message);
    }
  };

  // --- BET / PREDICTION CONTROLS ---
  const handleDeleteBet = async (pred: Prediction) => {
    if (!user) return;
    const confirmed = window.confirm(
      `Permanently delete prediction "${pred.title}"? Any active stakes will be refunded.`
    );
    if (!confirmed) return;

    try {
      await adminService.deleteBet(pred.id, user.uid, 'Administrative bet removal');
      success('Prediction Deleted', `Prediction "${pred.title}" was cancelled and removed.`);
      await fetchAdminData();
    } catch (err: any) {
      toastError('Deletion Failed', err.message);
    }
  };

  const handleCancelBet = async (predictionId: string) => {
    if (!user) return;
    const reason = window.prompt('Enter reason for cancellation & refund:');
    if (!reason) return;

    try {
      await predictionService.cancelPrediction(predictionId, `Admin Cancelled: ${reason}`);
      success('Prediction Cancelled', 'All tokens refunded to participants.');
      await fetchAdminData();
    } catch (err: any) {
      toastError('Cancellation Failed', err.message);
    }
  };

  const handleForceResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !resolvingPred) return;

    try {
      const res = await adminService.forceResolveBet({
        predictionId: resolvingPred.id,
        winningOptionId: resolvingPred.type !== 'CLOSEST_ANSWER' ? winningOptionId : undefined,
        actualClosestValue: resolvingPred.type === 'CLOSEST_ANSWER' ? Number(actualClosestValue) : undefined,
        adminUid: user.uid,
        reason: 'Master Administrator outcome settlement'
      });
      success('Bet Settled', `Distributed ${res.totalTokensAwarded} tokens to ${res.payoutsDistributed} winning participants!`);
      setResolvingPred(null);
      await fetchAdminData();
    } catch (err: any) {
      toastError('Settlement Failed', err.message);
    }
  };

  const handleAdjustPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const targetUid = `uid_${adjAdmission.toLowerCase().trim()}`;
      await adminService.issuePointAdjustment({
        adminUid: user.uid,
        targetUserId: targetUid,
        amount: adjAmount,
        reason: adjReason.trim(),
      });

      success('Points Adjusted', `Issued ${adjAmount} tokens to ${adjAdmission}.`);
      await fetchAdminData();
    } catch (err: any) {
      toastError('Adjustment Failed', err.message);
    }
  };

  // Filtered lists
  const filteredUsers = usersList.filter(
    (u) =>
      u.officialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPredictions = predictions.filter((p) => {
    if (betFilter !== 'ALL' && p.status !== betFilter) return false;
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.creatorNickname.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 pb-24 lg:pb-12 max-w-6xl mx-auto">
      {/* Top Banner with Casino Red Accents */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold">
              Full Administrative Control
            </span>
            <span className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
              SUPER ADMIN
            </span>
          </div>
          <h1 className="font-display font-black text-2xl lg:text-3xl text-white flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-red-500" />
            <span>Master Admin Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-casino-muted mt-0.5">
            Manage users, resolve running bets, audit transactions, and configure system rules.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-white/5 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'users', label: `Users (${usersList.length})` },
          { id: 'predictions', label: `Running Bets (${predictions.length})` },
          { id: 'adjustments', label: 'Token Grants' },
          { id: 'logs', label: 'Audit Trail' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as AdminTab);
              setSearchQuery('');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                : 'text-casino-muted hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: System Overview */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card variant="default" className="p-4 border-red-500/20">
              <span className="text-xs text-casino-muted block uppercase font-mono">
                Total Users
              </span>
              <span className="font-mono font-bold text-2xl text-white mt-1 block">
                {usersList.length}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-1 font-mono">
                {stats.activeUsers} Active Accounts
              </span>
            </Card>

            <Card variant="default" className="p-4 border-red-500/20">
              <span className="text-xs text-casino-muted block uppercase font-mono">
                Running Bets
              </span>
              <span className="font-mono font-bold text-2xl text-white mt-1 block">
                {stats.activePredictions}
              </span>
              <span className="text-[10px] text-amber-400 block mt-1 font-mono">
                {stats.totalPredictions} Total Created
              </span>
            </Card>

            <Card variant="default" className="p-4 border-red-500/20">
              <span className="text-xs text-casino-muted block uppercase font-mono">
                Token Circulation
              </span>
              <span className="font-mono font-bold text-2xl text-emerald-400 mt-1 block">
                {stats.totalTokensInCirculation.toLocaleString()}
              </span>
              <span className="text-[10px] text-casino-muted block mt-1 font-mono">Virtual Economy</span>
            </Card>

            <Card variant="default" className="p-4 border-red-500/20">
              <span className="text-xs text-casino-muted block uppercase font-mono">
                Active Loans
              </span>
              <span className="font-mono font-bold text-2xl text-white mt-1 block">
                {stats.activeLoans}
              </span>
              <span className="text-[10px] text-amber-400 block mt-1 font-mono">
                {stats.overdueLoans} Overdue
              </span>
            </Card>
          </div>

          <Card variant="default" className="p-5 sm:p-6 border-red-500/20">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-400" />
              <span>Administrator Fair Play & Authority Policy</span>
            </h3>
            <p className="text-xs text-casino-muted leading-relaxed">
              As Master Administrator, you have complete authority to create, edit, or delete student accounts, close or resolve predictions with custom outcomes, issue emergency refunds, and grant or deduct virtual tokens. To protect game integrity, administrators are barred from placing stakes in student prediction pools.
            </p>
          </Card>
        </div>
      )}

      {/* TAB 2: User Management (Create, Edit, Delete, Suspend) */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
              <input
                type="text"
                placeholder="Search by name, admission no, or nickname..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-casino-muted/50 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowCreateUser(true)}
              className="vip-gold-btn px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Create New User</span>
            </button>
          </div>

          <Card variant="default" className="divide-y divide-white/5 overflow-hidden">
            <div className="p-3.5 bg-background-elevated flex items-center justify-between text-xs font-mono uppercase text-casino-muted">
              <span>Student Profile</span>
              <span>Actions & Status</span>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-xs text-casino-muted">
                No users found matching your search.
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div
                  key={u.uid}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={u.profilePicture}
                      alt={u.nickname}
                      className="w-10 h-10 rounded-xl border border-white/10 object-cover shrink-0 bg-background-elevated"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{u.nickname}</span>
                        <span className="text-[10px] text-casino-muted font-normal truncate">({u.officialName})</span>
                        {u.role === 'admin' ? (
                          <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                            ADMIN
                          </span>
                        ) : (
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
                            STUDENT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-casino-muted mt-0.5">
                        <span className="text-amber-400 font-semibold uppercase">{u.admissionNumber}</span>
                        <span>•</span>
                        <span>{u.walletBalance.toLocaleString()} Coins</span>
                        <span>•</span>
                        <span className={u.accountStatus === 'active' ? 'text-emerald-400' : 'text-rose-400'}>
                          {u.accountStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for User */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setEditNickname(u.nickname);
                        setEditBalance(u.walletBalance);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-casino-muted hover:text-white transition-colors"
                      title="Edit User"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {u.role !== 'admin' && (
                      <>
                        <button
                          onClick={() => handleToggleSuspend(u)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                            u.accountStatus === 'active'
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {u.accountStatus === 'active' ? 'Suspend' : 'Reactivate'}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      )}

      {/* TAB 3: Running Bets Moderation (Force Resolve, Cancel, Delete) */}
      {activeTab === 'predictions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
              <input
                type="text"
                placeholder="Search predictions or creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-casino-muted/50 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {(['ALL', 'OPEN', 'FINALIZED', 'CANCELLED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setBetFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                    betFilter === filter
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : 'text-casino-muted hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <Card variant="default" className="divide-y divide-white/5 overflow-hidden">
            <div className="p-3.5 bg-background-elevated flex items-center justify-between text-xs font-mono uppercase text-casino-muted">
              <span>Bet Details & Status</span>
              <span>Administrative Actions</span>
            </div>

            {filteredPredictions.length === 0 ? (
              <div className="p-8 text-center text-xs text-casino-muted">
                No predictions match the selected filter.
              </div>
            ) : (
              filteredPredictions.map((p) => (
                <div
                  key={p.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="pr-4 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        p.status === 'OPEN'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : p.status === 'FINALIZED'
                          ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {p.status}
                      </span>
                      <span className="text-[10px] font-mono text-casino-muted uppercase">
                        {p.type}
                      </span>
                      <span className="text-xs text-amber-400 font-mono font-bold">
                        {p.totalPoolTokens.toLocaleString()} Coins Pool
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{p.title}</h4>
                    <p className="text-[11px] text-casino-muted mt-0.5">
                      Created by <span className="text-white font-medium">{p.creatorNickname}</span> • {p.totalParticipantsCount} participants
                    </p>
                  </div>

                  {/* Bet Controls */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {p.status === 'OPEN' && (
                      <>
                        <button
                          onClick={() => {
                            setResolvingPred(p);
                            setWinningOptionId(p.options[0]?.id || '');
                            setActualClosestValue('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold cursor-pointer whitespace-nowrap"
                        >
                          Settle Bet
                        </button>

                        <button
                          onClick={() => handleCancelBet(p.id)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold cursor-pointer whitespace-nowrap"
                        >
                          Cancel & Refund
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleDeleteBet(p)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer transition-colors"
                      title="Permanently Delete Bet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      )}

      {/* TAB 4: Administrative Point Adjustments */}
      {activeTab === 'adjustments' && (
        <Card variant="default" className="p-5 sm:p-6 max-w-xl">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Issue Administrative Virtual Token Adjustment</span>
          </h3>
          <p className="text-xs text-casino-muted mb-4">
            Grant or deduct game coins for classroom tournament bonuses or dispute corrections.
          </p>

          <form onSubmit={handleAdjustPoints} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-casino-muted mb-1.5">
                Target Student Admission Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. chn25mca055"
                value={adjAdmission}
                onChange={(e) => setAdjAdmission(e.target.value)}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-casino-muted mb-1.5">
                Amount (Coins)
              </label>
              <input
                type="number"
                required
                value={adjAmount}
                onChange={(e) => setAdjAmount(Number(e.target.value))}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-casino-muted mb-1.5">
                Authoritative Reason (For Audit Log)
              </label>
              <input
                type="text"
                required
                placeholder="Reason for token adjustment"
                value={adjReason}
                onChange={(e) => setAdjReason(e.target.value)}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full vip-gold-btn py-3 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              Issue Token Adjustment
            </button>
          </form>
        </Card>
      )}

      {/* TAB 5: Audit Logs */}
      {activeTab === 'logs' && (
        <Card variant="default" className="divide-y divide-white/5 overflow-hidden">
          <div className="p-3.5 bg-background-elevated flex items-center justify-between text-xs font-mono uppercase text-casino-muted">
            <span>Action & Reason</span>
            <span>Timestamp</span>
          </div>

          {logs.length === 0 ? (
            <div className="p-8 text-center text-casino-muted text-xs">
              No administrative logs recorded yet.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-white/[0.02]">
                <div>
                  <span className="font-mono text-red-400 font-bold block">{log.action}</span>
                  <p className="text-white mt-0.5">{log.reason}</p>
                  <span className="text-[10px] text-casino-muted font-mono">
                    Target: {log.targetId || 'N/A'} • Admin: {log.adminUid}
                  </span>
                </div>
                <span className="text-[10px] text-casino-muted font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </Card>
      )}

      {/* MODAL 1: Create New User */}
      {showCreateUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="casino-card max-w-md w-full p-5 sm:p-6 border-red-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-black text-lg text-white">Create Student Account</h3>
              <button
                onClick={() => setShowCreateUser(false)}
                className="text-casino-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-casino-muted mb-1">Official Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-casino-muted mb-1">Admission Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. chn25mca099"
                  value={newAdmission}
                  onChange={(e) => setNewAdmission(e.target.value)}
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-casino-muted mb-1">College Email</label>
                <input
                  type="email"
                  required
                  placeholder="admission_number@ceconline.edu"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-casino-muted mb-1">Nickname (Optional)</label>
                <input
                  type="text"
                  placeholder="Display Gamer Tag"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-casino-muted mb-1">Starting Balance (Coins)</label>
                <input
                  type="number"
                  required
                  value={newBalance}
                  onChange={(e) => setNewBalance(Number(e.target.value))}
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateUser(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-casino-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="vip-gold-btn px-5 py-2 text-xs font-bold"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit User Profile & Balance */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="casino-card max-w-md w-full p-5 sm:p-6 border-red-500/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-black text-lg text-white">Edit User Profile</h3>
                <p className="text-xs text-casino-muted">{editingUser.officialName} ({editingUser.admissionNumber})</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-casino-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-casino-muted mb-1">Gamer Nickname</label>
                <input
                  type="text"
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-casino-muted mb-1">Wallet Balance (Coins)</label>
                <input
                  type="number"
                  value={editBalance}
                  onChange={(e) => setEditBalance(Number(e.target.value))}
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-casino-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="vip-gold-btn px-5 py-2 text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Force Settle Running Bet */}
      {resolvingPred && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="casino-card max-w-md w-full p-5 sm:p-6 border-emerald-500/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-black text-lg text-white">Settle & Distribute Payouts</h3>
                <p className="text-xs text-casino-muted line-clamp-1">{resolvingPred.title}</p>
              </div>
              <button
                onClick={() => setResolvingPred(null)}
                className="text-casino-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleForceResolve} className="space-y-4">
              {resolvingPred.type !== 'CLOSEST_ANSWER' ? (
                <div>
                  <label className="block text-xs font-semibold text-casino-muted mb-2">
                    Select Winning Option
                  </label>
                  <div className="space-y-2">
                    {resolvingPred.options.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                          winningOptionId === opt.id
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-white font-bold'
                            : 'bg-background-elevated border-white/5 text-casino-muted hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="winningOption"
                            value={opt.id}
                            checked={winningOptionId === opt.id}
                            onChange={() => setWinningOptionId(opt.id)}
                            className="hidden"
                          />
                          <span>{opt.text}</span>
                        </div>
                        <span className="font-mono text-[11px] text-amber-400">
                          {opt.totalTokensCommitted} Coins Stake
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-casino-muted mb-1">
                    Official Actual Closest Value ({resolvingPred.closestConfig?.unit || 'Number'})
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="Enter the actual number/result"
                    value={actualClosestValue}
                    onChange={(e) => setActualClosestValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono"
                  />
                  <p className="text-[11px] text-casino-muted mt-1">
                    The pari-mutuel calculation engine will automatically locate the closest guesses and proportionally distribute the pool!
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolvingPred(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-casino-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-colors"
                >
                  Confirm & Distribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
