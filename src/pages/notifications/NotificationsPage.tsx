import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Sparkles,
  TrendingUp,
  Clock,
  Landmark,
  ShieldAlert
} from 'lucide-react';
import { NotificationItem, NotificationType } from '@/types/notification';
import { notificationService } from '@/services/notificationService';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/common/Card';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    if (!user) return;
    try {
      const data = await notificationService.getUserNotifications(user.uid);
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [user]);

  const handleMarkAll = async () => {
    if (!user) return;
    await notificationService.markAllAsRead(user.uid);
    await fetchNotifs();
  };

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'PREDICTION_WON':
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
      case 'PARTICIPATION_NEW':
        return <TrendingUp className="w-5 h-5 text-gold-highlight" />;
      case 'LOAN_REQUEST_NEW':
      case 'LOAN_OFFER_NEW':
      case 'LOAN_OFFER_ACCEPTED':
      case 'LOAN_REPAID':
        return <Landmark className="w-5 h-5 text-indigo-400" />;
      case 'ADMIN_ANNOUNCEMENT':
        return <ShieldAlert className="w-5 h-5 text-purple-400" />;
      default:
        return <Clock className="w-5 h-5 text-gold-highlight" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl lg:text-3xl text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-gold-highlight" />
            <span>Activity Notifications</span>
          </h1>
          <p className="text-sm text-casino-muted">
            Live alerts for predictions, outcome resolutions, and loan transactions.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleMarkAll}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-casino-muted hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <Card variant="default" className="divide-y divide-white/5">
        {loading ? (
          <div className="p-12 text-center text-casino-muted">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading notifications...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-casino-muted">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 flex items-start gap-3.5 transition-colors ${
                notif.read ? 'opacity-70' : 'bg-gold/5'
              }`}
            >
              <div className="p-2 rounded-xl bg-background-elevated border border-white/5 shrink-0 mt-0.5">
                {getNotifIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white truncate">{notif.title}</h4>
                  <span className="text-[10px] text-casino-muted font-mono shrink-0">
                    {new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-casino-muted mt-0.5 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};
