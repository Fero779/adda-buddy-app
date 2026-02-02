import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { 
  IndianRupee,
  ShoppingCart,
  Ticket,
  ChevronRight
} from 'lucide-react';

// Mock data - will come from API
const influencerData = {
  thisMonthRevenue: 42500,
  totalOrders: 156,
  activeCoupons: 5,
};

const InfluencerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const displayName = profile?.name || 'Partner';

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(1)}K`;
  };

  return (
    <AppShell showGreeting>
      <div className="px-4 py-4 space-y-4">
        {/* Revenue Card */}
        <div className="p-5 rounded-2xl gradient-primary text-primary-foreground">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="h-5 w-5 opacity-80" />
            <span className="text-sm opacity-80">This Month Revenue</span>
          </div>
          <p className="text-4xl font-bold mb-4">{formatCurrency(influencerData.thisMonthRevenue)}</p>
          <button 
            onClick={() => navigate('/influencer/revenue')}
            className="w-full py-3 rounded-xl bg-primary-foreground/20 text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary-foreground/30 transition-colors active:scale-[0.98]"
          >
            View Revenue
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Orders Card */}
          <div className="p-5 rounded-2xl bg-card shadow-card">
            <div className="p-3 rounded-xl bg-accent w-fit mb-3">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{influencerData.totalOrders}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </div>

          {/* Active Coupons Card */}
          <div className="p-5 rounded-2xl bg-card shadow-card">
            <div className="p-3 rounded-xl bg-success/10 w-fit mb-3">
              <Ticket className="h-5 w-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">{influencerData.activeCoupons}</p>
            <p className="text-sm text-muted-foreground">Active Coupons</p>
          </div>
        </div>

        {/* View Coupons CTA */}
        <div className="p-5 rounded-2xl bg-card shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Your Coupons</h3>
              <p className="text-sm text-muted-foreground">Manage and share your coupon codes</p>
            </div>
            <div className="p-3 rounded-xl bg-accent">
              <Ticket className="h-6 w-6 text-primary" />
            </div>
          </div>
          <button 
            onClick={() => navigate('/influencer/coupons')}
            className="w-full py-3 rounded-xl bg-accent text-foreground font-semibold flex items-center justify-center gap-2 hover:bg-accent/80 transition-colors active:scale-[0.98]"
          >
            View Coupons
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </AppShell>
  );
};

export default InfluencerDashboard;