import { userService } from '@/services/userService';
import { UserProfile, ApprovedStudent } from '@/types/user';
import approvedStudentsSeed from '@/data/approved_students.json';

export interface LeaderboardEntry {
  id: string;
  name: string;
  nickname: string;
  admission: string;
  avatar: string;
  championPoints: number;
  victories: number;
  streak: number;
  winRate: number;
  participated: number;
  loansCompleted: number;
  rankChange: number;
  isRegistered: boolean;
}

export interface MandhiRaceStats {
  cutoffPoints: number;
  cutoffHolderName: string;
  rank5Points: number;
  userRank: number;
  userPoints: number;
  isQualifying: boolean;
  deficit: number;
  cushion: number;
  totalContenders: number;
  top4: Array<{
    rank: number;
    nickname: string;
    name?: string;
    officialName: string;
    admission: string;
    points: number;
    winRate?: number;
    avatar: string;
  }>;
}

class LeaderboardService {
  /**
   * Compile the live 53-student roster merged with real active registered user data
   */
  async getLiveLeaderboard(currentUser?: UserProfile | null): Promise<LeaderboardEntry[]> {
    let registeredUsers: UserProfile[] = [];
    try {
      registeredUsers = await userService.getAllUsers();
    } catch (e) {
      console.warn('[leaderboardService] Failed to load users:', e);
    }

    const map = new Map<string, LeaderboardEntry>();

    // 1. Add all registered students
    registeredUsers.forEach((u) => {
      const key = u.admissionNumber.toLowerCase();
      map.set(key, {
        id: u.uid,
        name: u.officialName,
        nickname: u.nickname || u.officialName.split(' ')[0],
        admission: u.admissionNumber,
        avatar: u.profilePicture || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.admissionNumber}`,
        championPoints: u.walletBalance ?? 1000,
        victories: u.statistics?.predictionsWon || 0,
        streak: u.statistics?.currentStreak || 0,
        winRate: u.statistics?.winRate || 0,
        participated: u.statistics?.predictionsParticipated || 0,
        loansCompleted: u.statistics?.loansCompleted || 0,
        rankChange: 0,
        isRegistered: true,
      });
    });

    // 2. Ensure current user profile has latest local wallet balance
    if (currentUser && currentUser.role !== 'admin' && currentUser.admissionNumber !== 'ADMIN') {
      const key = currentUser.admissionNumber.toLowerCase();
      const existing = map.get(key);
      map.set(key, {
        id: currentUser.uid,
        name: currentUser.officialName,
        nickname: currentUser.nickname || currentUser.officialName.split(' ')[0],
        admission: currentUser.admissionNumber,
        avatar: currentUser.profilePicture || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.admissionNumber}`,
        championPoints: currentUser.walletBalance ?? 1000,
        victories: currentUser.statistics?.predictionsWon || existing?.victories || 0,
        streak: currentUser.statistics?.currentStreak || existing?.streak || 0,
        winRate: currentUser.statistics?.winRate || existing?.winRate || 0,
        participated: currentUser.statistics?.predictionsParticipated || existing?.participated || 0,
        loansCompleted: currentUser.statistics?.loansCompleted || existing?.loansCompleted || 0,
        rankChange: existing?.rankChange || 0,
        isRegistered: true,
      });
    }

    // 3. Fill in baseline for any unactivated students in 53-person roster
    (approvedStudentsSeed as ApprovedStudent[]).forEach((student) => {
      const key = student.admission_number.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          id: `uid_${student.admission_number}`,
          name: student.official_name,
          nickname: student.official_name.split(' ')[0],
          admission: student.admission_number,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${student.admission_number}`,
          championPoints: 1000,
          victories: 0,
          streak: 0,
          winRate: 0,
          participated: 0,
          loansCompleted: 0,
          rankChange: 0,
          isRegistered: false,
        });
      }
    });

    // Sort by championPoints desc, then victories desc, then streak desc, then name asc
    const sorted = Array.from(map.values()).sort((a, b) => {
      if (b.championPoints !== a.championPoints) {
        return b.championPoints - a.championPoints;
      }
      if (b.victories !== a.victories) {
        return b.victories - a.victories;
      }
      if (b.streak !== a.streak) {
        return b.streak - a.streak;
      }
      return a.name.localeCompare(b.name);
    });

    return sorted;
  }

  /**
   * Authoritative calculation for the Semester 4 Mandhi Race
   */
  async getMandhiRaceStats(currentUser?: UserProfile | null): Promise<MandhiRaceStats> {
    const sorted = await this.getLiveLeaderboard(currentUser);

    const seat4 = sorted[3] || sorted[sorted.length - 1];
    const seat5 = sorted[4] || sorted[sorted.length - 1];

    const cutoffPoints = seat4 ? seat4.championPoints : 1000;
    const cutoffHolderName = seat4 ? seat4.nickname : 'Seat #4 Qualifier';
    const rank5Points = seat5 ? seat5.championPoints : 1000;

    let userRank = sorted.length;
    let userPoints = currentUser?.walletBalance ?? 1000;

    if (currentUser && currentUser.role !== 'admin' && currentUser.admissionNumber !== 'ADMIN') {
      const idx = sorted.findIndex(
        (e) =>
          e.admission.toLowerCase() === currentUser.admissionNumber.toLowerCase() ||
          e.id === currentUser.uid
      );
      if (idx !== -1) {
        userRank = idx + 1;
        userPoints = sorted[idx].championPoints;
      }
    }

    const isQualifying = userRank <= 4;
    // If not qualifying, deficit to overtake Seat #4:
    const deficit = isQualifying ? 0 : Math.max(1, cutoffPoints - userPoints + 1);
    // If qualifying, cushion over the highest non-qualifying contender (Seat #5):
    const cushion = isQualifying ? Math.max(0, userPoints - rank5Points) : 0;

    const top4 = sorted.slice(0, 4).map((entry, i) => ({
      rank: i + 1,
      nickname: entry.nickname,
      name: entry.name,
      officialName: entry.name,
      admission: entry.admission,
      points: entry.championPoints,
      winRate: entry.winRate,
      avatar: entry.avatar,
    }));

    return {
      cutoffPoints,
      cutoffHolderName,
      rank5Points,
      userRank,
      userPoints,
      isQualifying,
      deficit,
      cushion,
      totalContenders: sorted.length,
      top4,
    };
  }
}

export const leaderboardService = new LeaderboardService();
