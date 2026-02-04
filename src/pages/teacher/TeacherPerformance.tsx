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
  <span className="flex items-center gap-1">
    {value}
    <Star className="h-3.5 w-3.5 text-warning fill-warning" />
  </span>
);

const MetricRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

const TeacherPerformance: React.FC = () => {
  return (
    <AppShell title="Performance">
      <div className="px-4 py-4 space-y-6">
        {/* Data Range Notice */}
        <p className="text-xs text-muted-foreground text-center">
          Data ranging from this month until yesterday
        </p>

        {/* Paid Classes Section */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3 pb-2 border-b border-border">
            Paid Classes
          </h2>
          <div className="grid grid-cols-2 gap-x-6">
            {/* Left Column - Ratings */}
            <div>
              <MetricRow label="Overall Rating" value={<RatingValue value={paidClassesMetrics.overallRating} />} />
              <MetricRow label="Overall Content Rating" value={<RatingValue value={paidClassesMetrics.overallContentRating} />} />
              <MetricRow label="Monthly Rating" value={<RatingValue value={paidClassesMetrics.monthlyRating} />} />
              <MetricRow label="Monthly Content Rating" value={<RatingValue value={paidClassesMetrics.monthlyContentRating} />} />
            </div>
            {/* Right Column - Operational */}
            <div>
              <MetricRow label="On Time Class" value={`${paidClassesMetrics.onTimePercent}%`} />
              <MetricRow label="PDF Uploads" value={`${paidClassesMetrics.pdfUploadPercent}%`} />
              <MetricRow label="Classes Rescheduled" value={`${paidClassesMetrics.rescheduledPercent}%`} />
              <MetricRow label="Classes Cancelled" value={`${paidClassesMetrics.cancelledPercent}%`} />
            </div>
          </div>
        </section>

        {/* YouTube Classes Section */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3 pb-2 border-b border-border">
            YouTube Classes
          </h2>
          <div className="grid grid-cols-2 gap-x-6">
            {/* Left Column - Delivery & Growth */}
            <div>
              <MetricRow label="No. of Minutes Delivered" value={youtubeMetrics.minutesDelivered.toLocaleString()} />
              <MetricRow label="Average Watch Minute" value={youtubeMetrics.avgWatchMinute} />
              <MetricRow label="Subscribers Added" value={`+${youtubeMetrics.subscribersAdded.toLocaleString()}`} />
            </div>
            {/* Right Column - Engagement */}
            <div>
              <MetricRow label="No. of Likes" value={youtubeMetrics.likes.toLocaleString()} />
              <MetricRow label="No. of Dislikes" value={youtubeMetrics.dislikes.toLocaleString()} />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default TeacherPerformance;
