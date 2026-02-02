export type UserRole = 'teacher' | 'influencer' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface TeacherStats {
  totalClasses: number;
  totalStudents: number;
  totalEarnings: number;
  pendingEarnings: number;
  upcomingClasses: number;
  completedClasses: number;
}

export interface InfluencerStats {
  totalReferrals: number;
  activeReferrals: number;
  totalCommission: number;
  pendingCommission: number;
  conversionRate: number;
  thisMonthReferrals: number;
}

export interface UpcomingClass {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  students: number;
}

export interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'converted' | 'expired';
  date: string;
  commission?: number;
}
