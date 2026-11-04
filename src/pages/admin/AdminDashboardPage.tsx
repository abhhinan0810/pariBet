import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Coins,
  Compass,
  Landmark,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Lock,
  Plus
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
import approvedStudentsSeed from '@/data/approved_students.json';

type AdminTab = 'overview' | 'students' | 'predictions' | 'adjustments' | 'logs';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Student search
  const [studentSearch, setStudentSearch] = useState('');

  // Point Adjustment Form
  const [adjAdmission, setAdjAdmission] = useState('chn25mca055');
  const [adjAmount, setAdjAmount] = useState<number>(500);
  const [adjReason, setAdjReason] = useState<string>('Tournament victory reward');

  const fetchAdminData = async () => {
    try {
      const s = await adminService.getSystemStats();
      const p = await predictionService.getPredictions();
      const l = await adminService.getLogs();
      setStats(s);
      setPredictions(p);
      setLogs(l);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

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

  const handleCancelPrediction = async (predictionId: string) => {
    const reason = window.prompt('Enter reason for administrative cancellation:');
    if (!reason) return;

    try {
      await predictionService.cancelPrediction(predictionId, reason);
      success('Prediction Cancelled', 'All tokens refunded to participants.');
      await fetchAdminData();
    } catch (err: any) {
      toastError('Cancellation Failed', err.message);
    }
  };

  const filteredRoster = approvedStudentsSeed.filter(
    (s) =>
      s.official_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.admission_number.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold">
            Administrative Control Center
          </span>
          <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-mono">
            SUPER ADMIN
          </span>
        </div>
        <h1 className="font-display font-black text-2xl lg:text-3xl text-white flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-rose-500" />
          <span>Class Administrator Dashboard</span>
        </h1>
        <p className="text-sm text-casino-muted">
          Authoritative oversight of 53 students, prediction moderation, token adjustments, and audit trail.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'System Overview' },
          { id: 'students', label: 'Students Roster (53)' },
          { id: 'predictions', label: 'Prediction Moderation' },
          { id: 'adjustments', label: 'Token Grants' },
          { id: 'logs', label: 'Audit Logs' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card variant="default" className="p-4 border-rose-500/20">
              <span className="text-xs text-casino-muted block uppercase font-mono">
                Approved Roster
              </span>
              <span className="font-mono font-bold text-2xl text-white mt-1 block">
                {stats.totalRegisteredStudents} / 53
              </span>
              <span className="text-[10px] text-emerald-400 block mt-1">100% Seats Validated</span>
            </Card>

            <Card variant="default" className="p-4">
              <span className="text-xs text-casino-muted block uppercase font-mono">
                Total Predictions
              </span>
              <span className="font-mono font-bold text-2xl text-white mt-1 block">
                {stats.totalPredictions}
              </span>
              <span className="text-[10px] text-gold-highlight block mt-1">
                {stats.activePredictions} Active Pools
              </span>
            </Card>

            <Card variant="default" className="p-4">
              <span className="text-xs text-casino-muted block uppercase font-mono">
                Tokens in Circulation
              </span>
              <span className="font-mono font-bold text-2xl text-emerald-400 mt-1 block">
                {stats.totalTokensInCirculation.toLocaleString()}
              </span>
              <span className="text-[10px] text-casino-muted block mt-1">Virtual Ledger</span>
            </Card>

            <Card variant="default" className="p-4">
              <span className="text-xs text-casino-muted block uppercase font-mono">
                Active Loans
              </span>
              <span className="font-mono font-bold text-2xl text-white mt-1 block">
                {stats.activeLoans}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-1">
                {stats.overdueLoans} Overdue
              </span>
            </Card>
          </div>

          <Card variant="default" className="p-6">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              <span>Closed-Community Student Policy</span>
            </h3>
            <p className="text-xs text-casino-muted leading-relaxed">
              Every registration must verify against the 53 approved student records in the official CSV. Non-roster emails are strictly barred at both the frontend service layer and Firestore security rules. Official names and admission numbers are permanently read-only.
            </p>
          </Card>
        </div>
      )}

      {/* TAB 2: Students Roster Management */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-casino-muted" />
            <input
              type="text"
              placeholder="Search by student name or admission number..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full bg-[#12121A] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-casino-muted/50 focus:outline-none focus:border-rose-500"
            />
          </div>

          <Card variant="default" className="divide-y divide-white/5">
            <div className="p-3.5 bg-background-elevated flex items-center justify-between text-xs font-mono uppercase text-casino-muted">
              <span>Official Student Record</span>
              <span>Status & Seat</span>
            </div>

            {filteredRoster.map((st, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-white/[0.02]">
                <div>
                  <p className="text-xs font-bold text-white">{st.official_name}</p>
                  <p className="text-[10px] font-mono text-gold-highlight uppercase mt-0.5">
                    {st.admission_number} • {st.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    APPROVED
                  </span>
                  <span className="text-[10px] font-mono text-casino-muted">
                    Seat #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* TAB 3: Prediction Moderation */}
      {activeTab === 'predictions' && (
        <div className="space-y-4">
          <Card variant="default" className="divide-y divide-white/5">
            <div className="p-3.5 bg-background-elevated flex items-center justify-between text-xs font-mono uppercase text-casino-muted">
              <span>Prediction & Creator</span>
              <span>Action</span>
            </div>

            {predictions.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                <div className="pr-4 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/10 text-gold-highlight uppercase">
                      {p.type} • {p.status}
                    </span>
                    <span className="text-xs text-casino-muted font-mono">
                      Pool: {p.totalPoolTokens} PTS
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                  <p className="text-[10px] text-casino-muted mt-0.5">
                    Created by {p.creatorNickname} ({p.creatorName})
                  </p>
                </div>

                {p.status === 'OPEN' && (
                  <button
                    onClick={() => handleCancelPrediction(p.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Cancel & Refund
                  </button>
                )}
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* TAB 4: Administrative Point Adjustments */}
      {activeTab === 'adjustments' && (
        <Card variant="default" className="p-6 max-w-xl">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Coins className="w-4 h-4 text-gold-highlight" />
            <span>Issue Administrative Virtual Token Adjustment</span>
          </h3>
          <p className="text-xs text-casino-muted mb-4">
            Grant or deduct game points for tournament bonuses or corrections. All adjustments are permanently written to the audit log.
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
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-casino-muted mb-1.5">
                Amount (Tokens)
              </label>
              <input
                type="number"
                required
                value={adjAmount}
                onChange={(e) => setAdjAmount(Number(e.target.value))}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-casino-muted mb-1.5">
                Authoritative Reason (Required for Audit Log)
              </label>
              <input
                type="text"
                required
                placeholder="Reason for token adjustment"
                value={adjReason}
                onChange={(e) => setAdjReason(e.target.value)}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              className="w-full casino-gold-button py-3 text-xs font-bold cursor-pointer"
            >
              Issue Token Adjustment
            </button>
          </form>
        </Card>
      )}

      {/* TAB 5: Audit Logs */}
      {activeTab === 'logs' && (
        <Card variant="default" className="divide-y divide-white/5">
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
              <div key={log.id} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-rose-400 font-bold block">{log.action}</span>
                  <p className="text-white mt-0.5">{log.reason}</p>
                  <span className="text-[10px] text-casino-muted font-mono">
                    Target: {log.targetId} • Admin: {log.adminUid}
                  </span>
                </div>
                <span className="text-[10px] text-casino-muted font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </Card>
      )}
    </div>
  );
};
