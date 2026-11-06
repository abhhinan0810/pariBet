import { NotificationItem, NotificationType } from '@/types/notification';
import { syncStorage } from './storageSync';

const LOCAL_NOTIFS_KEY = 'paribet_mock_notifications';

const INITIAL_WELCOME_NOTIF: NotificationItem = {
  id: 'notif_welcome',
  userId: 'all',
  type: 'ADMIN_ANNOUNCEMENT',
  title: 'Welcome to the VIP Casino Lounge!',
  message: '1,000 complimentary virtual tokens have been credited to your wallet. Predictions and loans are live.',
  read: false,
  createdAt: new Date().toISOString(),
};

export const notificationService = {
  async getUserNotifications(userId: string): Promise<NotificationItem[]> {
    const all: NotificationItem[] = JSON.parse(
      syncStorage.getItem(LOCAL_NOTIFS_KEY) || JSON.stringify([INITIAL_WELCOME_NOTIF])
    );
    return all
      .filter((n) => n.userId === userId || n.userId === 'all')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async sendNotification(params: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    referenceId?: string;
    link?: string;
  }): Promise<NotificationItem> {
    const notif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      read: false,
      referenceId: params.referenceId,
      link: params.link,
      createdAt: new Date().toISOString(),
    };

    const all: NotificationItem[] = JSON.parse(
      syncStorage.getItem(LOCAL_NOTIFS_KEY) || '[]'
    );
    all.unshift(notif);
    syncStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(all));

    return notif;
  },

  async markAsRead(id: string): Promise<void> {
    const all: NotificationItem[] = JSON.parse(
      syncStorage.getItem(LOCAL_NOTIFS_KEY) || '[]'
    );
    const item = all.find((n) => n.id === id);
    if (item) {
      item.read = true;
      syncStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(all));
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    const all: NotificationItem[] = JSON.parse(
      syncStorage.getItem(LOCAL_NOTIFS_KEY) || '[]'
    );
    all.forEach((n) => {
      if (n.userId === userId || n.userId === 'all') {
        n.read = true;
      }
    });
    syncStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(all));
  }
};

