import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TrendingUp, TrendingDown, Eye, Users, Clock, Percent, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

// Mock data - will come from API
const engagementMetrics = {
  avgViews: { value: 1240, trend: 8, unit: '' },
  peakViewers: { value: 2180, trend: 15, unit: '' },
  avgWatchTime: { value: 42, trend: -3, unit: 'min' },
  retention: { value: 78, trend: 5, unit: '%' },
};

const operationalMetrics = {
  onTime: { value: 96, trend: 2, unit: '%' },
  cancelled: { value: 2, trend: -1, unit: '%' },
  rescheduled: { value: 4, trend: 0, unit: '%' },
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  trend: number;
  iconBg: string;
  isNegativeGood?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, unit, trend, iconBg, isNegativeGood = false }) => {
  // For metrics like "cancelled %", a negative trend is good
  const isPositive = isNegativeGood ? trend <= 0 : trend >= 0;
  const showTrend = trend !== 0;
  
  return (
    <div className="p-4 rounded-xl bg-card shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          {icon}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-foreground">
          {value.toLocaleString()}{unit}
        </p>
        {showTrend && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${
            isPositive ? 'text-success' : 'text-destructive'
          }`}>
            {trend > 0 ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
        {!showTrend && (
          <span className="text-xs text-muted-foreground">No change</span>
        )}
      </div>
    </div>
  );
};

const TeacherPerformance: React.FC = () => {
  return (
    <AppShell title="Performance">
      <div className="px-4 py-4 space-y-6">
        {/* Period indicator */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">vs. previous 30 days</p>
        </div>

        {/* Engagement Section */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Engagement</h2>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              icon={<Eye className="h-4 w-4 text-primary" />}
              iconBg="bg-primary/10"
              label="Avg Views/Class"
              value={engagementMetrics.avgViews.value}
              unit={engagementMetrics.avgViews.unit}
              trend={engagementMetrics.avgViews.trend}
            />
            <MetricCard
              icon={<Users className="h-4 w-4 text-accent-foreground" />}
              iconBg="bg-accent"
              label="Peak Concurrent"
              value={engagementMetrics.peakViewers.value}
              unit={engagementMetrics.peakViewers.unit}
              trend={engagementMetrics.peakViewers.trend}
            />
            <MetricCard
              icon={<Clock className="h-4 w-4 text-warning" />}
              iconBg="bg-warning/10"
              label="Avg Watch Time"
              value={engagementMetrics.avgWatchTime.value}
              unit={engagementMetrics.avgWatchTime.unit}
              trend={engagementMetrics.avgWatchTime.trend}
            />
            <MetricCard
              icon={<Percent className="h-4 w-4 text-success" />}
              iconBg="bg-success/10"
              label="Retention"
              value={engagementMetrics.retention.value}
              unit={engagementMetrics.retention.unit}
              trend={engagementMetrics.retention.trend}
            />
          </div>
        </section>

        {/* Operational Hygiene Section */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Operational Hygiene</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-card shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">On-time Start</p>
                    <p className="text-xl font-bold text-foreground">{operationalMetrics.onTime.value}%</p>
                  </div>
                </div>
                {operationalMetrics.onTime.trend !== 0 && (
                  <div className={`flex items-center gap-0.5 text-sm font-medium ${
                    operationalMetrics.onTime.trend > 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {operationalMetrics.onTime.trend > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{Math.abs(operationalMetrics.onTime.trend)}%</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-card shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <XCircle className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="text-sm text-muted-foreground">Cancelled</span>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-xl font-bold text-foreground">{operationalMetrics.cancelled.value}%</p>
                  {operationalMetrics.cancelled.trend !== 0 && (
                    <div className={`flex items-center gap-0.5 text-xs font-medium ${
                      operationalMetrics.cancelled.trend < 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {operationalMetrics.cancelled.trend > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      <span>{Math.abs(operationalMetrics.cancelled.trend)}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <RefreshCw className="h-4 w-4 text-warning" />
                  </div>
                  <span className="text-sm text-muted-foreground">Rescheduled</span>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-xl font-bold text-foreground">{operationalMetrics.rescheduled.value}%</p>
                  {operationalMetrics.rescheduled.trend !== 0 ? (
                    <div className={`flex items-center gap-0.5 text-xs font-medium ${
                      operationalMetrics.rescheduled.trend < 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {operationalMetrics.rescheduled.trend > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      <span>{Math.abs(operationalMetrics.rescheduled.trend)}%</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No change</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary insight */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground text-center">
            📊 Your engagement is up and operational hygiene is strong. Keep it up!
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default TeacherPerformance;