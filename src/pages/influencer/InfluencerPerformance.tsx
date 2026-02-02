import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TrendingUp, TrendingDown, MousePointer, ShoppingCart, Percent, IndianRupee, Sparkles } from 'lucide-react';

// Mock data - will come from API
const performanceMetrics = {
  clicks: { value: 12840, trend: 18, period: 'vs last 30 days' },
  orders: { value: 847, trend: 12, period: 'vs last 30 days' },
  conversionRate: { value: 6.6, trend: 8, period: 'vs last 30 days' },
  revenue: { value: 156700, trend: 22, period: 'vs last 30 days' },
};

interface MetricCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  suffix?: string;
  trend: number;
  featured?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, iconBg, label, value, suffix = '', trend, featured = false }) => {
  const isPositive = trend >= 0;
  
  if (featured) {
    return (
      <div className="p-5 rounded-2xl gradient-primary text-primary-foreground">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm opacity-80">{label}</p>
            <p className="text-4xl font-bold">{value}{suffix}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary-foreground/20">
            {icon}
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'opacity-90' : 'opacity-90'}`}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>{isPositive ? '+' : ''}{trend}% vs last 30 days</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-card shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          {icon}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-foreground">{value}{suffix}</p>
        <div className={`flex items-center gap-0.5 text-sm font-medium ${
          isPositive ? 'text-success' : 'text-destructive'
        }`}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
    </div>
  );
};

const InfluencerPerformance: React.FC = () => {
  const formatNumber = (num: number) => {
    if (num >= 100000) {
      return `${(num / 100000).toFixed(2)}L`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <AppShell title="Performance">
      <div className="px-4 py-4 space-y-4">
        {/* Period indicator */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Last 30 days performance</p>
        </div>

        {/* Conversion Rate - Featured */}
        <MetricCard
          icon={<Percent className="h-7 w-7" />}
          iconBg=""
          label="Conversion Rate"
          value={performanceMetrics.conversionRate.value}
          suffix="%"
          trend={performanceMetrics.conversionRate.trend}
          featured
        />

        {/* Other Metrics Grid */}
        <div className="grid grid-cols-1 gap-3">
          <MetricCard
            icon={<MousePointer className="h-4 w-4 text-primary" />}
            iconBg="bg-primary/10"
            label="Total Clicks"
            value={formatNumber(performanceMetrics.clicks.value)}
            trend={performanceMetrics.clicks.trend}
          />
          
          <MetricCard
            icon={<ShoppingCart className="h-4 w-4 text-accent-foreground" />}
            iconBg="bg-accent"
            label="Orders"
            value={formatNumber(performanceMetrics.orders.value)}
            trend={performanceMetrics.orders.trend}
          />
          
          <MetricCard
            icon={<IndianRupee className="h-4 w-4 text-success" />}
            iconBg="bg-success/10"
            label="Revenue Generated"
            value={`₹${formatNumber(performanceMetrics.revenue.value)}`}
            trend={performanceMetrics.revenue.trend}
          />
        </div>

        {/* Motivational insight */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Your conversion is above average! Keep sharing 🚀</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default InfluencerPerformance;