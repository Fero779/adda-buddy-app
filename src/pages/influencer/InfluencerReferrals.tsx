import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { CheckCircle2, Timer, XCircle, Search, Filter } from 'lucide-react';
import { Referral } from '@/types/user';

const mockReferrals: Referral[] = [
  { id: '1', name: 'Amit Kumar', email: 'amit.k@email.com', status: 'converted', date: '2 hours ago', commission: 500 },
  { id: '2', name: 'Sneha Patel', email: 'sneha.p@email.com', status: 'pending', date: '5 hours ago' },
  { id: '3', name: 'Rajesh Singh', email: 'rajesh.s@email.com', status: 'converted', date: 'Yesterday', commission: 750 },
  { id: '4', name: 'Neha Sharma', email: 'neha.s@email.com', status: 'pending', date: 'Yesterday' },
  { id: '5', name: 'Vikram Mehta', email: 'vikram.m@email.com', status: 'expired', date: '3 days ago' },
  { id: '6', name: 'Pooja Verma', email: 'pooja.v@email.com', status: 'converted', date: '3 days ago', commission: 500 },
  { id: '7', name: 'Arun Gupta', email: 'arun.g@email.com', status: 'converted', date: '4 days ago', commission: 1000 },
];

const InfluencerReferrals: React.FC = () => {
  const getStatusIcon = (status: Referral['status']) => {
    switch (status) {
      case 'converted':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'pending':
        return <Timer className="h-4 w-4" />;
      case 'expired':
        return <XCircle className="h-4 w-4" />;
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
    <AppShell title="Referrals">
      <div className="px-4 py-4 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search referrals..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-card border border-border hover:bg-accent transition-colors">
            <Filter className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {['All (847)', 'Converted (312)', 'Pending (485)', 'Expired (50)'].map((tab, index) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                index === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-accent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Referrals List */}
        <div className="space-y-3">
          {mockReferrals.map((referral, index) => (
            <div
              key={referral.id}
              className="p-4 rounded-xl bg-card shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {referral.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">{referral.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{referral.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(referral.status)}`}>
                    {getStatusIcon(referral.status)}
                    {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                  </span>
                  {referral.commission && (
                    <span className="text-sm font-semibold text-success">+₹{referral.commission}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default InfluencerReferrals;
