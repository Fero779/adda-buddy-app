import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/stat-card';
import { IndianRupee, Clock, TrendingUp, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  status: 'completed' | 'pending';
}

const mockTransactions: Transaction[] = [
  { id: '1', description: 'SSC CGL Maths Class Payout', amount: 4500, type: 'credit', date: 'Feb 1, 2024', status: 'completed' },
  { id: '2', description: 'Bank PO Reasoning Bonus', amount: 2000, type: 'credit', date: 'Jan 31, 2024', status: 'completed' },
  { id: '3', description: 'Weekly Payout', amount: 15000, type: 'credit', date: 'Jan 28, 2024', status: 'completed' },
  { id: '4', description: 'Performance Bonus Q4', amount: 8500, type: 'credit', date: 'Jan 25, 2024', status: 'pending' },
];

const TeacherEarnings: React.FC = () => {
  return (
    <AppShell title="Earnings">
      <div className="px-4 py-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Total Earned"
            value="₹4.85L"
            icon={IndianRupee}
            variant="primary"
          />
          <StatCard
            title="Pending"
            value="₹45,000"
            icon={Clock}
            subtitle="Processing"
          />
        </div>

        {/* Earnings Chart Placeholder */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Monthly Earnings</h2>
          <div className="p-4 rounded-xl bg-card shadow-card">
            <div className="flex items-end justify-between h-32 gap-2">
              {['Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, index) => {
                const heights = [40, 60, 75, 90, 55];
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className={`w-full rounded-t-md ${index === 3 ? 'gradient-primary' : 'bg-muted'}`}
                      style={{ height: `${heights[index]}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{month}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-success">+18%</span> from last month
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
            {mockTransactions.map((tx, index) => (
              <div
                key={tx.id}
                className="p-4 rounded-xl bg-card shadow-card animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.type === 'credit' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                      {tx.type === 'credit' ? (
                        <ArrowDownRight className="h-4 w-4 text-success" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.type === 'credit' ? 'text-success' : 'text-destructive'}`}>
                      {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </p>
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

export default TeacherEarnings;
