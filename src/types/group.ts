export interface ClassGroup {
  id: string;
  name: string;
  batch: string;
  department: string;
  college: string;
  description: string;
  membersCount: number;
  totalPredictionsCount: number;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  nickname: string;
  officialName: string;
  admissionNumber: string;
  avatar?: string;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: string;
}

