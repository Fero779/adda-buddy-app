import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { IndianRupee, ShoppingCart, TrendingUp, BookOpen, Sparkles } from 'lucide-react';

// Mock data - will come from API
const revenueSummary = {
  thisMonth: 42500,
  ordersCount: 847,
  growthPercent: 21,
};

const dayWiseRevenue = [
  { date: 'Feb 2', revenue: 4200, orders: 89 },
  { date: 'Feb 1', revenue: 5800, orders: 124 },
  { date: 'Jan 31', revenue: 4900, orders: 102 },
  { date: 'Jan 30', revenue: 5200, orders: 118 },
  { date: 'Jan 29', revenue: 3800, orders: 81 },
  { date: 'Jan 28', revenue: 4600, orders: 96 },
  { date: 'Jan 27', revenue: 4100, orders: 87 },
];

const topCourses = [
  { name: 'SSC CGL Complete Package', revenue: 12800, orders: 256, rank: 1 },
  { name: 'Bank PO Master Course', revenue: 9600, orders: 192, rank: 2 },
  { name: 'Railway NTPC Full Course', revenue: 7200, orders: 144, rank: 3 },
  { name: 'SSC CHSL English Pro', revenue: 5400, orders: 108, rank: 4 },
  { name: 'General Studies Bundle', revenue: 4100, orders: 82, rank: 5 },
];

const InfluencerRevenue: React.FC = () => {
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
        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Great month! Your revenue is growing 🎉</span>
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
              <p className="text-xs text-muted-foreground mt-2">Via your coupons</p>
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
          <h2 className="text-lg font-bold text-foreground mb-3">Top Courses via Your Coupons</h2>
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
                    <p className="font-medium text-foreground text-sm truncate">{course.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{course.orders} orders</p>
                </div>
                <p className="font-semibold text-foreground flex-shrink-0">{formatCurrency(course.revenue)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Motivational Footer */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border text-center">
          <p className="text-sm text-muted-foreground">
            💰 Keep sharing your coupons to boost your earnings!
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default InfluencerRevenue;