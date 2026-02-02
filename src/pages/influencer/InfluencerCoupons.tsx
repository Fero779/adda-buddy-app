import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Copy, Link, Ticket, CheckCircle, XCircle, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Coupon {
  id: string;
  code: string;
  status: 'active' | 'inactive';
  ordersCount: number;
  revenue: number;
  referralLink: string;
}

// Mock data - will come from API
const coupons: Coupon[] = [
  { id: '1', code: 'PRIYA20', status: 'active', ordersCount: 156, revenue: 42500, referralLink: 'https://adda247.com/ref/PRIYA20' },
  { id: '2', code: 'PRIYA50', status: 'active', ordersCount: 89, revenue: 22450, referralLink: 'https://adda247.com/ref/PRIYA50' },
  { id: '3', code: 'FLASH30', status: 'active', ordersCount: 234, revenue: 58700, referralLink: 'https://adda247.com/ref/FLASH30' },
  { id: '4', code: 'NEWYEAR25', status: 'inactive', ordersCount: 312, revenue: 78600, referralLink: 'https://adda247.com/ref/NEWYEAR25' },
  { id: '5', code: 'DIWALI40', status: 'inactive', ordersCount: 567, revenue: 142350, referralLink: 'https://adda247.com/ref/DIWALI40' },
];

const InfluencerCoupons: React.FC = () => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    setCopiedId(`${id}-${type}`);
    toast.success(type === 'code' ? 'Coupon code copied!' : 'Referral link copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  const totalRevenue = coupons.reduce((sum, c) => sum + c.revenue, 0);
  const totalOrders = coupons.reduce((sum, c) => sum + c.ordersCount, 0);
  const activeCoupons = coupons.filter(c => c.status === 'active').length;

  return (
    <AppShell title="Coupons">
      <div className="px-4 py-4 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-card shadow-card text-center">
            <p className="text-xl font-bold text-success">{activeCoupons}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="p-3 rounded-xl bg-card shadow-card text-center">
            <p className="text-xl font-bold text-foreground">{totalOrders.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </div>
          <div className="p-3 rounded-xl bg-card shadow-card text-center">
            <p className="text-xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </div>
        </div>

        {/* Coupons List */}
        <div className="space-y-3">
          {coupons.map((coupon, index) => (
            <div
              key={coupon.id}
              className="p-4 rounded-xl bg-card shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Header: Code + Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${coupon.status === 'active' ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Ticket className={`h-5 w-5 ${coupon.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <p className="font-bold text-lg text-foreground tracking-wide">{coupon.code}</p>
                </div>
                {coupon.status === 'active' ? (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-success/10 text-success">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                    <XCircle className="h-3 w-3" />
                    Inactive
                  </span>
                )}
              </div>
              
              {/* Stats: Orders + Revenue */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Orders</p>
                  <p className="text-lg font-semibold text-foreground">{coupon.ordersCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                  <p className="text-lg font-semibold text-success">{formatCurrency(coupon.revenue)}</p>
                </div>
              </div>
              
              {/* Actions: Copy Code + Copy Link */}
              <div className="flex gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => copyToClipboard(coupon.code, coupon.id, 'code')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-sm font-medium text-foreground"
                >
                  {copiedId === `${coupon.id}-code` ? (
                    <>
                      <Check className="h-4 w-4 text-success" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </>
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(coupon.referralLink, coupon.id, 'link')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-medium text-primary"
                >
                  {copiedId === `${coupon.id}-link` ? (
                    <>
                      <Check className="h-4 w-4 text-success" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Link className="h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {coupons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No coupons assigned yet</p>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default InfluencerCoupons;