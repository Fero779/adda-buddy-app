import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TrendingUp, TrendingDown, Users, Clock, Star, Target, Award } from 'lucide-react';

// Mock data - will come from API
const performanceData = {
  overallScore: 94.2,
  rank: 'Top 5%',
  totalStudents: 2840,
  avgRating: 4.9,
  avgClassDuration: 78,
  completionRate: 98.5,
  monthlyTrend: +12,
};

const weeklyStats = [
  { day: 'Mon', classes: 3, students: 890 },
  { day: 'Tue', classes: 2, students: 620 },
  { day: 'Wed', classes: 4, students: 1100 },
  { day: 'Thu', classes: 2, students: 540 },
  { day: 'Fri', classes: 3, students: 780 },
  { day: 'Sat', classes: 1, students: 320 },
  { day: 'Sun', classes: 0, students: 0 },
];

const TeacherPerformance: React.FC = () => {
  const maxStudents = Math.max(...weeklyStats.map(s => s.students));

  return (
    <AppShell title="Performance">
      <div className="px-4 py-4 space-y-6">
        {/* Overall Score Card */}
        <div className="p-5 rounded-2xl gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-80">Performance Score</p>
              <p className="text-4xl font-bold">{performanceData.overallScore}%</p>
            </div>
            <div className="p-3 rounded-xl bg-primary-foreground/20">
              <Award className="h-8 w-8" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full bg-primary-foreground/20 text-xs font-medium">
              {performanceData.rank}
            </span>
            <span className="flex items-center gap-1 text-sm">
              {performanceData.monthlyTrend > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4" />
                  +{performanceData.monthlyTrend}% this month
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4" />
                  {performanceData.monthlyTrend}% this month
                </>
              )}
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Key Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-card shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-accent">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Total Students</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{performanceData.totalStudents.toLocaleString()}</p>
            </div>
            
            <div className="p-4 rounded-xl bg-card shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Star className="h-4 w-4 text-warning" />
                </div>
                <span className="text-sm text-muted-foreground">Avg Rating</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{performanceData.avgRating}</p>
            </div>
            
            <div className="p-4 rounded-xl bg-card shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-accent">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Avg Duration</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{performanceData.avgClassDuration} min</p>
            </div>
            
            <div className="p-4 rounded-xl bg-card shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-success/10">
                  <Target className="h-4 w-4 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">Completion</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{performanceData.completionRate}%</p>
            </div>
          </div>
        </section>

        {/* Weekly Activity Chart */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">This Week</h2>
          <div className="p-4 rounded-xl bg-card shadow-card">
            <div className="flex items-end justify-between h-32 gap-2 mb-4">
              {weeklyStats.map((stat, index) => (
                <div key={stat.day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      stat.students > 0 ? 'gradient-primary' : 'bg-muted'
                    }`}
                    style={{ 
                      height: stat.students > 0 ? `${(stat.students / maxStudents) * 100}%` : '8px',
                      minHeight: '8px'
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{stat.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Total Classes</p>
                <p className="text-lg font-bold text-foreground">
                  {weeklyStats.reduce((sum, s) => sum + s.classes, 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Students</p>
                <p className="text-lg font-bold text-foreground">
                  {weeklyStats.reduce((sum, s) => sum + s.students, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Recent Achievements</h2>
          <div className="space-y-3">
            {[
              { icon: '🏆', title: 'Top Performer', desc: 'Ranked in top 5% this month' },
              { icon: '⭐', title: '5-Star Streak', desc: '10 consecutive 5-star ratings' },
              { icon: '🎯', title: '100% Attendance', desc: 'No missed classes this week' },
            ].map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-card shadow-card">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <p className="font-medium text-foreground">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default TeacherPerformance;