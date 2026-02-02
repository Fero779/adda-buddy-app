import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { IndianRupee, Clock, TrendingUp, Download, ArrowDownRight, Calendar } from 'lucide-react';

// Mock data - will come from API
const revenueData = {
  totalEarned: 485000,
  pending: 45000,
  thisMonth: 78500,
  lastMonth: 65000,
};

const monthlyRevenue = [
  { month: 'Oct', amount: 52000 },
  { month: 'Nov', amount: 61000 },
  { month: 'Dec', amount: 58000 },
  { month: 'Jan', amount: 65000 },
  { month: 'Feb', amount: 78500 },
];

const transactions = [
  { id: '1', description: 'SSC CGL Maths Class Payout', amount: 4500, date: 'Feb 1, 2024', status: 'completed' },
  { id: '2', description: 'Bank PO Reasoning Bonus', amount: 2000, date: 'Jan 31, 2024', status: 'completed' },
  { id: '3', description: 'Weekly Payout', amount: 15000, date: 'Jan 28, 2024', status: 'completed' },
  { id: '4', description: 'Performance Bonus Q4', amount: 8500, date: 'Jan 25, 2024', status: 'pending' },
  { id: '5', description: 'Monthly Settlement', amount: 32000, date: 'Jan 20, 2024', status: 'completed' },
];

const TeacherRevenue: React.FC = () => {
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

        {/* Monthly Chart */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Monthly Revenue</h2>
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
                    <div className="p-2 rounded-lg bg-success/10">
                      <ArrowDownRight className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">+₹{tx.amount.toLocaleString()}</p>
                    {tx.status === 'pending' && (
                      <span className="text-xs text-warning">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default TeacherRevenue;