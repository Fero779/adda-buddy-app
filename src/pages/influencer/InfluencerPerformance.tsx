import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TrendingUp, TrendingDown, Users, Ticket, Target, Award, Percent } from 'lucide-react';

// Mock data - will come from API
const performanceData = {
  conversionRate: 36.8,
  rank: 'Gold Partner',
  totalRedemptions: 847,
  activeCustomers: 312,
  avgOrderValue: 1850,
  monthlyTrend: +22,
};

const weeklyStats = [
  { day: 'Mon', redemptions: 18 },
  { day: 'Tue', redemptions: 24 },
  { day: 'Wed', redemptions: 31 },
  { day: 'Thu', redemptions: 19 },
  { day: 'Fri', redemptions: 27 },
  { day: 'Sat', redemptions: 42 },
  { day: 'Sun', redemptions: 15 },
];

const topCoupons = [
  { code: 'FLASH30', redemptions: 234, conversion: 42 },
  { code: 'PRIYA20', redemptions: 156, conversion: 38 },
  { code: 'PRIYA50', redemptions: 89, conversion: 31 },
];

const InfluencerPerformance: React.FC = () => {
  const maxRedemptions = Math.max(...weeklyStats.map(s => s.redemptions));

  return (
    <AppShell title="Performance">
      <div className="px-4 py-4 space-y-6">
        {/* Overall Score Card */}
        <div className="p-5 rounded-2xl gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-80">Conversion Rate</p>
              <p className="text-4xl font-bold">{performanceData.conversionRate}%</p>
            </div>
            <div className="p-3 rounded-xl bg-primary-foreground/20">
              <Percent className="h-8 w-8" />
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
                <span className="text-sm text-muted-foreground">Total Redemptions</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{performanceData.totalRedemptions}</p>
            </div>
            
            <div className="p-4 rounded-xl bg-card shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-success/10">
                  <Target className="h-4 w-4 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">Converted</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{performanceData.activeCustomers}</p>
            </div>
            
            <div className="p-4 rounded-xl bg-card shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-accent">
                  <Ticket className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Active Coupons</span>
              </div>
              <p className="text-2xl font-bold text-foreground">5</p>
            </div>
            
            <div className="p-4 rounded-xl bg-card shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Award className="h-4 w-4 text-warning" />
                </div>
                <span className="text-sm text-muted-foreground">Avg Order</span>
              </div>
              <p className="text-2xl font-bold text-foreground">₹{performanceData.avgOrderValue}</p>
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
                      index === 5 ? 'gradient-primary' : 'bg-muted'
                    }`}
                    style={{ 
                      height: `${(stat.redemptions / maxRedemptions) * 100}%`,
                      minHeight: '8px'
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{stat.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Total Redemptions</p>
                <p className="text-lg font-bold text-foreground">
                  {weeklyStats.reduce((sum, s) => sum + s.redemptions, 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Best Day</p>
                <p className="text-lg font-bold text-foreground">Saturday</p>
              </div>
            </div>
          </div>
        </section>

        {/* Top Performing Coupons */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Top Coupons</h2>
          <div className="space-y-3">
            {topCoupons.map((coupon, index) => (
              <div key={coupon.code} className="flex items-center gap-3 p-3 rounded-xl bg-card shadow-card">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{coupon.code}</p>
                  <p className="text-xs text-muted-foreground">{coupon.redemptions} redemptions</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">{coupon.conversion}%</p>
                  <p className="text-xs text-muted-foreground">conversion</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default InfluencerPerformance;