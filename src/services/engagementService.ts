import { syncStorage } from '@/services/storageSync';
import { walletService } from '@/services/walletService';

export const ENGAGEMENT_STORAGE_KEY = 'paribet_user_engagement';

export interface UserEngagementRecord {
  userId: string;
  lastCheckInDate?: string; // Format: YYYY-MM-DD
  streakDays: number; // Current streak progress (1-7)
  lastWheelDate?: string; // Format: YYYY-MM-DD
  lastWheelResult?: string;
  totalSpins: number;
  totalCheckIns: number;
  updatedAt: string;
}

export interface WheelPrize {
  id: string;
  label: string;
  pts: number;
  color: string;
  weight: number;
  isLoss?: boolean;
  isJackpot?: boolean;
  isSpecial?: boolean;
}

export const STREAK_REWARDS = [
  { day: 1, pts: 50, label: 'Day 1' },
  { day: 2, pts: 100, label: 'Day 2' },
  { day: 3, pts: 150, label: 'Day 3' },
  { day: 4, pts: 200, label: 'Day 4' },
  { day: 5, pts: 250, label: 'Day 5' },
  { day: 6, pts: 350, label: 'Day 6' },
  { day: 7, pts: 600, label: 'Day 7 VIP', isSpecial: true },
];

/**
 * 8-Slice Lucky Wheel with realistic casino odds:
 * ~48% chance of 'Better Luck Next Time' (0 PTS)
 * ~35% chance of Common Small Wins (+25, +50)
 * ~12% chance of Medium Win (+100)
 * ~8% chance of Jackpot Ticket (+50 bonus)
 * ~4% chance of High Win (+250)
 * ~1% chance of Grand Jackpot (+500)
 */
export const WHEEL_PRIZES: WheelPrize[] = [
  { id: 'loss_1', label: 'Better Luck Next Time', pts: 0, color: '#374151', weight: 28, isLoss: true },
  { id: 'win_50', label: '+50 PTS', pts: 50, color: '#F59E0B', weight: 20 },
  { id: 'loss_2', label: 'Better Luck Next Time', pts: 0, color: '#4B5563', weight: 20, isLoss: true },
  { id: 'win_100', label: '+100 PTS', pts: 100, color: '#10B981', weight: 12 },
  { id: 'ticket_jackpot', label: '🎟️ Jackpot Ticket', pts: 50, color: '#8B5CF6', weight: 8, isSpecial: true },
  { id: 'win_25', label: '+25 PTS', pts: 25, color: '#3B82F6', weight: 7 },
  { id: 'win_250', label: '+250 PTS', pts: 250, color: '#EC4899', weight: 4 },
  { id: 'jackpot_500', label: '👑 +500 PTS Jackpot', pts: 500, color: '#EAB308', weight: 1, isJackpot: true },
];

export const getTodayDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

export const getDaysBetweenDates = (earlierStr: string, laterStr: string): number => {
  const d1 = parseDateString(earlierStr);
  const d2 = parseDateString(laterStr);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

class EngagementService {
  /**
   * Fetch all engagement records from central syncStorage
   */
  private async getAllRecords(): Promise<Record<string, UserEngagementRecord>> {
    try {
      const stored = await syncStorage.getItemAsync(ENGAGEMENT_STORAGE_KEY);
      if (stored) {
        return typeof stored === 'string' ? JSON.parse(stored) : stored;
      }
    } catch (e) {
      console.warn('[engagementService] Failed to load remote engagement store:', e);
    }

    const local = syncStorage.getItem(ENGAGEMENT_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    return {};
  }

  /**
   * Save all engagement records to central syncStorage
   */
  private async saveAllRecords(records: Record<string, UserEngagementRecord>): Promise<void> {
    await syncStorage.setItemAsync(ENGAGEMENT_STORAGE_KEY, JSON.stringify(records));
  }

  /**
   * Get user engagement status with automatic streak reset calculation:
   * - If user checked in today: checkedInToday = true, activeDay = currentStreak
   * - If user checked in yesterday: checkedInToday = false, activeDay = currentStreak + 1 (or 1 if was 7)
   * - If user missed yesterday (>1 day) or never checked in: resets to Day 1!
   */
  async getUserEngagement(userId: string): Promise<{
    record: UserEngagementRecord;
    activeDay: number;
    checkedInToday: boolean;
    wheelSpunToday: boolean;
  }> {
    const all = await this.getAllRecords();
    let record = all[userId];
    const today = getTodayDateString();

    if (!record) {
      record = {
        userId,
        streakDays: 1,
        totalSpins: 0,
        totalCheckIns: 0,
        updatedAt: new Date().toISOString()
      };
    }

    let activeDay = 1;
    let checkedInToday = false;

    if (record.lastCheckInDate) {
      const daysSince = getDaysBetweenDates(record.lastCheckInDate, today);

      if (daysSince === 0) {
        // Already checked in today
        checkedInToday = true;
        activeDay = record.streakDays;
      } else if (daysSince === 1) {
        // Consecutive day: user checked in yesterday
        checkedInToday = false;
        activeDay = record.streakDays >= 7 ? 1 : record.streakDays + 1;
      } else {
        // Missed at least 1 day: reset streak to Day 1!
        checkedInToday = false;
        activeDay = 1;
        if (record.streakDays !== 1) {
          record.streakDays = 1;
          record.updatedAt = new Date().toISOString();
          all[userId] = record;
          await this.saveAllRecords(all);
        }
      }
    } else {
      // First time user: Day 1
      activeDay = 1;
      checkedInToday = false;
    }

    const wheelSpunToday = record.lastWheelDate === today;

    return {
      record,
      activeDay,
      checkedInToday,
      wheelSpunToday
    };
  }

  /**
   * Claim Daily Streak Check-in Reward
   */
  async claimDailyStreak(userId: string): Promise<{
    success: boolean;
    rewardPts: number;
    claimedDay: number;
    nextDay: number;
  }> {
    const status = await this.getUserEngagement(userId);
    if (status.checkedInToday) {
      throw new Error('You have already claimed your daily check-in reward today. Come back tomorrow!');
    }

    const today = getTodayDateString();
    const claimedDay = status.activeDay;
    const rewardConfig = STREAK_REWARDS.find((r) => r.day === claimedDay) || STREAK_REWARDS[0];
    const rewardPts = rewardConfig.pts;

    // Credit user's wallet
    await walletService.recordTransaction({
      userId,
      type: 'DAILY_LOGIN_REWARD',
      amount: rewardPts,
      description: `Day ${claimedDay} Daily Check-In Reward (+${rewardPts} PTS)`,
      metadata: { streakDay: claimedDay, isJackpot: rewardConfig.isSpecial }
    });

    // Update engagement record
    const all = await this.getAllRecords();
    const updated: UserEngagementRecord = {
      ...status.record,
      lastCheckInDate: today,
      streakDays: claimedDay,
      totalCheckIns: (status.record.totalCheckIns || 0) + 1,
      updatedAt: new Date().toISOString()
    };

    all[userId] = updated;
    await this.saveAllRecords(all);

    const nextDay = claimedDay >= 7 ? 1 : claimedDay + 1;

    return {
      success: true,
      rewardPts,
      claimedDay,
      nextDay
    };
  }

  /**
   * Spin the Lucky Wheel with weighted casino odds
   */
  async spinLuckyWheel(userId: string): Promise<{
    success: boolean;
    prize: WheelPrize;
    prizeIndex: number;
    isLoss: boolean;
  }> {
    const status = await this.getUserEngagement(userId);
    if (status.wheelSpunToday) {
      throw new Error('You have already used your free spin for today. Next spin in 24 hours!');
    }

    // Weighted random selection
    const totalWeight = WHEEL_PRIZES.reduce((sum, p) => sum + p.weight, 0);
    const rand = Math.random() * totalWeight;

    let cumulative = 0;
    let selectedIndex = 0;
    for (let i = 0; i < WHEEL_PRIZES.length; i++) {
      cumulative += WHEEL_PRIZES[i].weight;
      if (rand <= cumulative) {
        selectedIndex = i;
        break;
      }
    }

    const prize = WHEEL_PRIZES[selectedIndex];
    const isLoss = Boolean(prize.isLoss || prize.pts === 0);
    const today = getTodayDateString();

    // Only record wallet transaction if user won positive PTS
    if (!isLoss && prize.pts > 0) {
      await walletService.recordTransaction({
        userId,
        type: 'LUCKY_WHEEL_REWARD',
        amount: prize.pts,
        description: `Daily Lucky Wheel: ${prize.label}`,
        metadata: { prizeId: prize.id, prizeLabel: prize.label }
      });
    }

    // Update engagement record
    const all = await this.getAllRecords();
    const updated: UserEngagementRecord = {
      ...status.record,
      lastWheelDate: today,
      lastWheelResult: prize.label,
      totalSpins: (status.record.totalSpins || 0) + 1,
      updatedAt: new Date().toISOString()
    };

    all[userId] = updated;
    await this.saveAllRecords(all);

    return {
      success: true,
      prize,
      prizeIndex: selectedIndex,
      isLoss
    };
  }
}

export const engagementService = new EngagementService();

