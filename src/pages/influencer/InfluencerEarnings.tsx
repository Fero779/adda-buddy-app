import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/stat-card';
import { IndianRupee, Clock, TrendingUp, Download, ArrowDownRight, Gift } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'referral' | 'bonus';
}

const mockTransactions: Transaction[] = [
  { id: '1', description: 'Referral: Amit Kumar - SSC Package', amount: 500, date: 'Feb 1, 2024', type: 'referral' },
  { id: '2', description: 'Referral: Rajesh Singh - Bank PO', amount: 750, date: 'Jan 31, 2024', type: 'referral' },
  { id: '3', description: 'Monthly Performance Bonus', amount: 5000, date: 'Jan 31, 2024', type: 'bonus' },
  { id: '4', description: 'Referral: Arun Gupta - Complete Package', amount: 1000, date: 'Jan 28, 2024', type: 'referral' },
];

const InfluencerEarnings: React.FC = () => {
  return (
    <AppShell title="Earnings">
      <div className="px-4 py-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Total Earned"
            value="₹2.34L"
            icon={IndianRupee}
            variant="primary"
          />
          <StatCard
            title="Pending"
            value="₹28,000"
            icon={Clock}
            subtitle="Processing"
          />
        </div>

        {/* Commission Breakdown */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Commission Breakdown</h2>
          <div className="p-4 rounded-xl bg-card shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <IndianRupee className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Referral Commission</p>
                  <p className="text-xs text-muted-foreground">Per successful conversion</p>
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
              <p className="font-semibold text-foreground">₹39,000</p>
            </div>
          </div>
        </section>

        {/* Monthly Trend */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Monthly Trend</h2>
          <div className="p-4 rounded-xl bg-card shadow-card">
            <div className="flex items-end justify-between h-32 gap-2">
              {['Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, index) => {
                const heights = [35, 55, 70, 85, 60];
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
                <span className="font-semibold text-success">+22%</span> from last month
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

export default InfluencerEarnings;
