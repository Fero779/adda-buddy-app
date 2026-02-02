import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Copy, Share2, Ticket, Search, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Coupon {
  id: string;
  code: string;
  discount: string;
  redemptions: number;
  commission: number;
  status: 'active' | 'expired' | 'paused';
  validTill: string;
}

// Mock data - will come from API
const coupons: Coupon[] = [
  { id: '1', code: 'PRIYA20', discount: '20% off', redemptions: 156, commission: 8500, status: 'active', validTill: 'Mar 31, 2024' },
  { id: '2', code: 'PRIYA50', discount: '₹50 off', redemptions: 89, commission: 4450, status: 'active', validTill: 'Mar 31, 2024' },
  { id: '3', code: 'FLASH30', discount: '30% off', redemptions: 234, commission: 11700, status: 'active', validTill: 'Feb 28, 2024' },
  { id: '4', code: 'NEWYEAR25', discount: '25% off', redemptions: 312, commission: 15600, status: 'expired', validTill: 'Jan 31, 2024' },
  { id: '5', code: 'DIWALI40', discount: '40% off', redemptions: 567, commission: 28350, status: 'expired', validTill: 'Nov 15, 2023' },
];

const InfluencerCoupons: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'all' | 'active' | 'expired'>('all');

  const filteredCoupons = coupons.filter(coupon => {
    if (activeTab === 'all') return true;
    return coupon.status === activeTab;
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  const getStatusBadge = (status: Coupon['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-success/10 text-success">
            <CheckCircle className="h-3 w-3" />
            Active
          </span>
        );
      case 'paused':
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-warning/10 text-warning">
            <Clock className="h-3 w-3" />
            Paused
          </span>
        );
      case 'expired':
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
            <XCircle className="h-3 w-3" />
            Expired
          </span>
        );
    }
  };

  return (
    <AppShell title="Coupons">
      <div className="px-4 py-4 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search coupons..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-card border border-border hover:bg-accent transition-colors">
            <Filter className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {[
            { key: 'all', label: `All (${coupons.length})` },
            { key: 'active', label: `Active (${coupons.filter(c => c.status === 'active').length})` },
            { key: 'expired', label: `Expired (${coupons.filter(c => c.status === 'expired').length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-accent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-card shadow-card text-center">
            <p className="text-xl font-bold text-foreground">{coupons.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="p-3 rounded-xl bg-card shadow-card text-center">
            <p className="text-xl font-bold text-success">{coupons.filter(c => c.status === 'active').length}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="p-3 rounded-xl bg-card shadow-card text-center">
            <p className="text-xl font-bold text-foreground">{coupons.reduce((sum, c) => sum + c.redemptions, 0)}</p>
            <p className="text-xs text-muted-foreground">Redemptions</p>
          </div>
        </div>

        {/* Coupons List */}
        <div className="space-y-3">
          {filteredCoupons.map((coupon, index) => (
            <div
              key={coupon.id}
              className="p-4 rounded-xl bg-card shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${coupon.status === 'active' ? 'bg-accent' : 'bg-muted'}`}>
                    <Ticket className={`h-5 w-5 ${coupon.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="font-bold text-foreground tracking-wide">{coupon.code}</p>
                    <p className="text-sm text-muted-foreground">{coupon.discount}</p>
                  </div>
                </div>
                {getStatusBadge(coupon.status)}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-4">
                  <div>
                    <p className="text-muted-foreground">Redemptions</p>
                    <p className="font-semibold text-foreground">{coupon.redemptions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Commission</p>
                    <p className="font-semibold text-success">₹{coupon.commission.toLocaleString()}</p>
                  </div>
                </div>
                
                {coupon.status === 'active' && (
                  <div className="flex gap-2">
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
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mt-3">
                Valid till {coupon.validTill}
              </p>
            </div>
          ))}
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No coupons found</p>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default InfluencerCoupons;