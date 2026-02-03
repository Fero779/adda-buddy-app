import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { IndianRupee, ShoppingCart, TrendingUp, BookOpen, Sparkles } from 'lucide-react';

// Mock data - will come from API
const revenueSummary = {
  thisMonth: 78500,
  ordersCount: 342,
  growthPercent: 12,
};

const dayWiseRevenue = [
  { date: 'Feb 2', revenue: 8500, orders: 38 },
  { date: 'Feb 1', revenue: 12300, orders: 52 },
  { date: 'Jan 31', revenue: 9800, orders: 41 },
  { date: 'Jan 30', revenue: 11200, orders: 48 },
  { date: 'Jan 29', revenue: 7600, orders: 32 },
  { date: 'Jan 28', revenue: 10100, orders: 44 },
  { date: 'Jan 27', revenue: 8900, orders: 39 },
];

const topCourses = [
  { name: 'SSC CGL Complete Maths', revenue: 24500, rank: 1 },
  { name: 'Bank PO Reasoning Master', revenue: 18200, rank: 2 },
  { name: 'Railway NTPC Full Course', revenue: 15800, rank: 3 },
  { name: 'SSC CHSL English Pro', revenue: 12100, rank: 4 },
  { name: 'General Awareness Bundle', revenue: 7900, rank: 5 },
];

const TeacherRevenue: React.FC = () => {
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  return (
    <AppShell title="Revenue">
      <div className="px-4 py-4 space-y-6">
        {/* Motivational Header */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">You're doing great this month! 🎉</span>
          </div>
        </div>

        {/* Revenue Summary */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">This Month</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-5 rounded-2xl gradient-primary text-primary-foreground">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="h-4 w-4 opacity-80" />
                <span className="text-sm opacity-80">Revenue</span>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(revenueSummary.thisMonth)}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs opacity-90">+{revenueSummary.growthPercent}% vs last month</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-card shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Orders</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{revenueSummary.ordersCount}</p>
              <p className="text-xs text-muted-foreground mt-2">Total purchases</p>
            </div>
          </div>
        </section>

        {/* Day-wise Revenue */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Day-wise Revenue</h2>
          <div className="rounded-xl bg-card shadow-card overflow-hidden">
            {dayWiseRevenue.map((day, index) => (
              <div
                key={day.date}
                className={`flex items-center justify-between p-4 ${
                  index !== dayWiseRevenue.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div>
                  <p className="font-medium text-foreground">{day.date}</p>
                  <p className="text-xs text-muted-foreground">{day.orders} orders</p>
                </div>
                <p className="font-semibold text-success">₹{day.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Top Selling Courses */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Top Selling Courses</h2>
          <div className="space-y-3">
            {topCourses.map((course, index) => (
              <div
                key={course.name}
                className="flex items-center gap-3 p-4 rounded-xl bg-card shadow-card animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  course.rank === 1 
                    ? 'bg-warning/20 text-warning' 
                    : course.rank === 2 
                    ? 'bg-muted text-muted-foreground' 
                    : course.rank === 3 
                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                    : 'bg-muted/50 text-muted-foreground'
                }`}>
                  {course.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                    <p className="font-medium text-foreground truncate">{course.name}</p>
                  </div>
                </div>
                <p className="font-semibold text-foreground flex-shrink-0">{formatCurrency(course.revenue)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Motivational Footer */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border text-center">
          <p className="text-sm text-muted-foreground">
            💪 Keep creating great content to grow your revenue!
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default TeacherRevenue;