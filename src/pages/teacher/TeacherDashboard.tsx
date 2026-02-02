import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/stat-card';
import { ActionCard } from '@/components/ui/action-card';
import { 
  IndianRupee, 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp,
  Clock,
  Plus,
  FileText
} from 'lucide-react';
import { TeacherStats, UpcomingClass } from '@/types/user';

// Mock data
const mockStats: TeacherStats = {
  totalClasses: 156,
  totalStudents: 2840,
  totalEarnings: 485000,
  pendingEarnings: 45000,
  upcomingClasses: 8,
  completedClasses: 148,
};

const mockUpcomingClasses: UpcomingClass[] = [
  { id: '1', title: 'SSC CGL Maths', subject: 'Mathematics', date: 'Today', time: '4:00 PM', students: 342 },
  { id: '2', title: 'Bank PO Reasoning', subject: 'Reasoning', date: 'Tomorrow', time: '10:00 AM', students: 256 },
  { id: '3', title: 'UPSC Prelims GK', subject: 'General Knowledge', date: 'Feb 4', time: '6:00 PM', students: 189 },
];

const TeacherDashboard: React.FC = () => {
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(1)}K`;
  };

  return (
    <AppShell showGreeting>
      <div className="px-4 py-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Total Earnings"
            value={formatCurrency(mockStats.totalEarnings)}
            icon={IndianRupee}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Pending"
            value={formatCurrency(mockStats.pendingEarnings)}
            icon={Clock}
            subtitle="Processing"
          />
          <StatCard
            title="Total Students"
            value={mockStats.totalStudents.toLocaleString()}
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Classes Taken"
            value={mockStats.completedClasses}
            icon={BookOpen}
          />
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card shadow-card hover:shadow-elevated transition-all active:scale-[0.98]">
              <div className="p-3 rounded-full gradient-primary">
                <Plus className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">New Class</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card shadow-card hover:shadow-elevated transition-all active:scale-[0.98]">
              <div className="p-3 rounded-full bg-accent">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">View Reports</span>
            </button>
          </div>
        </section>

        {/* Upcoming Classes */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Upcoming Classes</h2>
            <button className="text-sm font-medium text-primary">View All</button>
          </div>
          <div className="space-y-3">
            {mockUpcomingClasses.map((cls, index) => (
              <div
                key={cls.id}
                className="p-4 rounded-xl bg-card shadow-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{cls.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{cls.subject}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {cls.date}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {cls.time}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {cls.students}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    cls.date === 'Today' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    {cls.date === 'Today' ? 'Live Soon' : cls.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Card */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">This Month</h2>
          <div className="p-4 rounded-xl bg-card shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Performance Score</p>
                <p className="text-2xl font-bold text-foreground">94.2%</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[94%] gradient-primary rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              You're in the top 5% of teachers this month!
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default TeacherDashboard;
