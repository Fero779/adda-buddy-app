import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/stat-card';
import { 
  IndianRupee, 
  Users, 
  TrendingUp,
  Clock,
  Share2,
  Copy,
  CheckCircle2,
  XCircle,
  Timer
} from 'lucide-react';
import { InfluencerStats, Referral } from '@/types/user';
import { toast } from 'sonner';

// Mock data
const mockStats: InfluencerStats = {
  totalReferrals: 847,
  activeReferrals: 312,
  totalCommission: 234500,
  pendingCommission: 28000,
  conversionRate: 36.8,
  thisMonthReferrals: 45,
};

const mockReferrals: Referral[] = [
  { id: '1', name: 'Amit Kumar', email: 'amit.k@email.com', status: 'converted', date: '2 hours ago', commission: 500 },
  { id: '2', name: 'Sneha Patel', email: 'sneha.p@email.com', status: 'pending', date: '5 hours ago' },
  { id: '3', name: 'Rajesh Singh', email: 'rajesh.s@email.com', status: 'converted', date: 'Yesterday', commission: 750 },
  { id: '4', name: 'Neha Sharma', email: 'neha.s@email.com', status: 'pending', date: 'Yesterday' },
];

const InfluencerDashboard: React.FC = () => {
  const referralCode = 'PRIYA2024';
  
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(1)}K`;
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  const getStatusIcon = (status: Referral['status']) => {
    switch (status) {
      case 'converted':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'pending':
        return <Timer className="h-4 w-4 text-warning" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: Referral['status']) => {
    switch (status) {
      case 'converted':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'expired':
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AppShell showGreeting>
      <div className="px-4 py-4 space-y-6">
        {/* Referral Code Card */}
        <div className="p-4 rounded-2xl gradient-primary text-primary-foreground animate-fade-in">
          <p className="text-sm opacity-80 mb-1">Your Referral Code</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold tracking-wider">{referralCode}</p>
            <div className="flex gap-2">
              <button
                onClick={copyReferralCode}
                className="p-2.5 rounded-xl bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
              >
                <Copy className="h-5 w-5" />
              </button>
              <button className="p-2.5 rounded-xl bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Total Earnings"
            value={formatCurrency(mockStats.totalCommission)}
            icon={IndianRupee}
            trend={{ value: 18, isPositive: true }}
          />
          <StatCard
            title="Pending"
            value={formatCurrency(mockStats.pendingCommission)}
            icon={Clock}
            subtitle="Processing"
          />
          <StatCard
            title="Total Referrals"
            value={mockStats.totalReferrals}
            icon={Users}
          />
          <StatCard
            title="Conversion Rate"
            value={`${mockStats.conversionRate}%`}
            icon={TrendingUp}
            variant="success"
          />
        </div>

        {/* This Month Stats */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">This Month</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-card shadow-card text-center">
              <p className="text-2xl font-bold text-foreground">{mockStats.thisMonthReferrals}</p>
              <p className="text-xs text-muted-foreground mt-1">Referrals</p>
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

        {/* Recent Referrals */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Recent Referrals</h2>
            <button className="text-sm font-medium text-primary">View All</button>
          </div>
          <div className="space-y-3">
            {mockReferrals.map((referral, index) => (
              <div
                key={referral.id}
                className="p-4 rounded-xl bg-card shadow-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {referral.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{referral.name}</p>
                      <p className="text-xs text-muted-foreground">{referral.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {referral.commission && (
                      <span className="text-sm font-semibold text-success">+₹{referral.commission}</span>
                    )}
                    <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(referral.status)}`}>
                      {getStatusIcon(referral.status)}
                      {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips Card */}
        <section className="pb-4">
          <div className="p-4 rounded-xl bg-accent border border-border">
            <p className="text-sm font-medium text-foreground mb-2">💡 Pro Tip</p>
            <p className="text-sm text-muted-foreground">
              Share your referral code on social media during exam announcement days for 3x more conversions!
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default InfluencerDashboard;
