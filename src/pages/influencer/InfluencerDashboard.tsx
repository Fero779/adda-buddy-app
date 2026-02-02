import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/stat-card';
import { 
  IndianRupee, 
  TrendingUp,
  Clock,
  Share2,
  Copy,
  Ticket,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data - will come from API
const stats = {
  totalRevenue: 234500,
  pendingRevenue: 28000,
  totalCoupons: 12,
  activeCoupons: 5,
  totalRedemptions: 847,
  conversionRate: 36.8,
};

const activeCoupons = [
  { id: '1', code: 'PRIYA20', discount: '20%', redemptions: 156, status: 'active' },
  { id: '2', code: 'PRIYA50', discount: '₹50 off', redemptions: 89, status: 'active' },
  { id: '3', code: 'FLASH30', discount: '30%', redemptions: 234, status: 'active' },
];

const InfluencerDashboard: React.FC = () => {
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(1)}K`;
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  return (
    <AppShell showGreeting>
      <div className="px-4 py-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={IndianRupee}
            variant="primary"
            trend={{ value: 18, isPositive: true }}
          />
          <StatCard
            title="Pending"
            value={formatCurrency(stats.pendingRevenue)}
            icon={Clock}
            subtitle="Processing"
          />
          <StatCard
            title="Total Redemptions"
            value={stats.totalRedemptions}
            icon={Users}
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon={TrendingUp}
            variant="success"
          />
        </div>

        {/* Active Coupons */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Active Coupons</h2>
            <button className="text-sm font-medium text-primary">View All</button>
          </div>
          <div className="space-y-3">
            {activeCoupons.map((coupon, index) => (
              <div
                key={coupon.id}
                className="p-4 rounded-xl bg-card shadow-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-accent">
                      <Ticket className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground tracking-wide">{coupon.code}</p>
                      <p className="text-sm text-muted-foreground">{coupon.discount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-2">
                      <p className="text-sm font-semibold text-foreground">{coupon.redemptions}</p>
                      <p className="text-xs text-muted-foreground">uses</p>
                    </div>
                    <button
                      onClick={() => copyCode(coupon.code)}
                      className="p-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                    >
                      <Copy className="h-4 w-4 text-primary" />
                    </button>
                    <button className="p-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors">
                      <Share2 className="h-4 w-4 text-primary" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* This Month Stats */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">This Month</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-card shadow-card text-center">
              <p className="text-2xl font-bold text-foreground">45</p>
              <p className="text-xs text-muted-foreground mt-1">Redemptions</p>
            </div>
            <div className="p-4 rounded-xl bg-card shadow-card text-center">
              <p className="text-2xl font-bold text-success">17</p>
              <p className="text-xs text-muted-foreground mt-1">Converted</p>
            </div>
            <div className="p-4 rounded-xl bg-card shadow-card text-center">
              <p className="text-2xl font-bold text-foreground">₹12.5K</p>
              <p className="text-xs text-muted-foreground mt-1">Earned</p>
            </div>
          </div>
        </section>

        {/* Tips Card */}
        <section className="pb-4">
          <div className="p-4 rounded-xl bg-accent border border-border">
            <p className="text-sm font-medium text-foreground mb-2">💡 Pro Tip</p>
            <p className="text-sm text-muted-foreground">
              Share your coupon codes on social media during exam announcement days for 3x more conversions!
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default InfluencerDashboard;