import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { IndianRupee, Clock, TrendingUp, Download, ArrowDownRight, Gift, Calendar } from 'lucide-react';

// Mock data - will come from API
const revenueData = {
  totalEarned: 234500,
  pending: 28000,
  thisMonth: 42500,
  lastMonth: 35000,
};

const monthlyRevenue = [
  { month: 'Oct', amount: 28000 },
  { month: 'Nov', amount: 32000 },
  { month: 'Dec', amount: 38000 },
  { month: 'Jan', amount: 35000 },
  { month: 'Feb', amount: 42500 },
];

const transactions = [
  { id: '1', description: 'Coupon: PRIYA20 - SSC Package', amount: 500, date: 'Feb 1, 2024', type: 'commission' },
  { id: '2', description: 'Coupon: FLASH30 - Bank PO', amount: 750, date: 'Jan 31, 2024', type: 'commission' },
  { id: '3', description: 'Monthly Performance Bonus', amount: 5000, date: 'Jan 31, 2024', type: 'bonus' },
  { id: '4', description: 'Coupon: PRIYA50 - Complete Package', amount: 1000, date: 'Jan 28, 2024', type: 'commission' },
  { id: '5', description: 'Milestone Bonus - 500 Redemptions', amount: 2500, date: 'Jan 25, 2024', type: 'bonus' },
];

const InfluencerRevenue: React.FC = () => {
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    }
    return `₹${(amount / 1000).toFixed(1)}K`;
  };

  const maxAmount = Math.max(...monthlyRevenue.map(m => m.amount));
  const growthPercent = ((revenueData.thisMonth - revenueData.lastMonth) / revenueData.lastMonth * 100).toFixed(1);

  return (
    <AppShell title="Revenue">
      <div className="px-4 py-4 space-y-6">
        {/* Total Revenue Card */}
        <div className="p-5 rounded-2xl gradient-primary text-primary-foreground">
          <p className="text-sm opacity-80 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold mb-3">{formatCurrency(revenueData.totalEarned)}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary-foreground/20 text-xs">
              <Clock className="h-3 w-3" />
              ₹{(revenueData.pending / 1000).toFixed(0)}K pending
            </div>
          </div>
        </div>

        {/* This Month Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-card shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">This Month</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(revenueData.thisMonth)}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-xs text-success">+{growthPercent}%</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-card shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(revenueData.pending)}</p>
            <span className="text-xs text-muted-foreground">Processing</span>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Revenue Breakdown</h2>
          <div className="p-4 rounded-xl bg-card shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <IndianRupee className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Coupon Commission</p>
                  <p className="text-xs text-muted-foreground">Per redemption</p>
                </div>
              </div>
              <p className="font-semibold text-foreground">₹1.95L</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Gift className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Bonuses</p>
                  <p className="text-xs text-muted-foreground">Performance & milestones</p>
                </div>
              </div>
              <p className="font-semibold text-foreground">₹39,500</p>
            </div>
          </div>
        </section>

        {/* Monthly Chart */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Monthly Trend</h2>
          <div className="p-4 rounded-xl bg-card shadow-card">
            <div className="flex items-end justify-between h-32 gap-2 mb-4">
              {monthlyRevenue.map((item, index) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t-md ${
                      index === monthlyRevenue.length - 1 ? 'gradient-primary' : 'bg-muted'
                    }`}
                    style={{ height: `${(item.amount / maxAmount) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{item.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 pt-3 border-t border-border">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-success">+{growthPercent}%</span> from last month
              </span>
            </div>
          </div>
        </section>

        {/* Transactions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
            <button className="flex items-center gap-1 text-sm font-medium text-primary">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <div
                key={tx.id}
                className="p-4 rounded-xl bg-card shadow-card animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.type === 'bonus' ? 'bg-warning/10' : 'bg-success/10'}`}>
                      {tx.type === 'bonus' ? (
                        <Gift className="h-4 w-4 text-warning" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-success">+₹{tx.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default InfluencerRevenue;