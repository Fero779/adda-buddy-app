import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Star } from 'lucide-react';

// Mock data - will come from API
const paidClassesMetrics = {
  overallRating: 4.8,
  overallContentRating: 4.7,
  monthlyRating: 4.9,
  monthlyContentRating: 4.8,
  onTimePercent: 96,
  pdfUploadPercent: 88,
  rescheduledPercent: 4,
  cancelledPercent: 2,
};

const youtubeMetrics = {
  minutesDelivered: 4280,
  avgWatchMinute: 42,
  subscribersAdded: 1240,
  likes: 8500,
  dislikes: 120,
};

const RatingValue: React.FC<{ value: number }> = ({ value }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className="text-base font-semibold text-foreground">{value}</span>
    <Star className="h-4 w-4 text-warning fill-warning" />
  </span>
);

const MetricRow: React.FC<{ label: string; value: React.ReactNode; isRating?: boolean }> = ({ 
  label, 
  value, 
  isRating = false 
}) => (
  <div className="flex justify-between items-center py-3 border-b border-border/30 last:border-b-0">
    <span className="text-xs text-muted-foreground tracking-wide uppercase">{label}</span>
    {isRating ? (
      value
    ) : (
      <span className="text-base font-semibold text-foreground tabular-nums">{value}</span>
    )}
  </div>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="mb-4 pb-3 border-b-2 border-primary/20">
    <h2 className="text-lg font-semibold text-foreground tracking-tight">{title}</h2>
  </div>
);

const TeacherPerformance: React.FC = () => {
  return (
    <AppShell title="Performance">
      <div className="px-5 py-5 space-y-8">
        {/* Data Range Notice */}
        <p className="text-[11px] text-muted-foreground/70 text-center tracking-wide uppercase">
          Data ranging from this month until yesterday
        </p>

        {/* Paid Classes Section */}
        <section className="bg-card/30 rounded-lg px-4 py-4">
          <SectionHeader title="Paid Classes" />
          <div className="grid grid-cols-2 gap-x-8">
            {/* Left Column - Ratings */}
            <div className="space-y-0">
              <MetricRow label="Overall Rating" value={<RatingValue value={paidClassesMetrics.overallRating} />} isRating />
              <MetricRow label="Overall Content Rating" value={<RatingValue value={paidClassesMetrics.overallContentRating} />} isRating />
              <MetricRow label="Monthly Rating" value={<RatingValue value={paidClassesMetrics.monthlyRating} />} isRating />
              <MetricRow label="Monthly Content Rating" value={<RatingValue value={paidClassesMetrics.monthlyContentRating} />} isRating />
            </div>
            {/* Right Column - Operational */}
            <div className="space-y-0">
              <MetricRow label="On Time Class" value={`${paidClassesMetrics.onTimePercent}%`} />
              <MetricRow label="PDF Uploads" value={`${paidClassesMetrics.pdfUploadPercent}%`} />
              <MetricRow label="Classes Rescheduled" value={`${paidClassesMetrics.rescheduledPercent}%`} />
              <MetricRow label="Classes Cancelled" value={`${paidClassesMetrics.cancelledPercent}%`} />
            </div>
          </div>
        </section>

        {/* YouTube Classes Section */}
        <section className="bg-card/30 rounded-lg px-4 py-4">
          <SectionHeader title="YouTube Classes" />
          <div className="grid grid-cols-2 gap-x-8">
            {/* Left Column - Delivery & Growth */}
            <div className="space-y-0">
              <MetricRow label="Minutes Delivered" value={youtubeMetrics.minutesDelivered.toLocaleString()} />
              <MetricRow label="Avg Watch Minute" value={youtubeMetrics.avgWatchMinute} />
              <MetricRow label="Subscribers Added" value={`+${youtubeMetrics.subscribersAdded.toLocaleString()}`} />
            </div>
            {/* Right Column - Engagement */}
            <div className="space-y-0">
              <MetricRow label="Likes" value={youtubeMetrics.likes.toLocaleString()} />
              <MetricRow label="Dislikes" value={youtubeMetrics.dislikes.toLocaleString()} />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default TeacherPerformance;
