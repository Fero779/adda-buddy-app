import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Star, Clock, XCircle, RefreshCw, FileText, Youtube, Eye, ThumbsUp, ThumbsDown, Users } from 'lucide-react';

// Mock data - will come from API
const paidClassesSummary = {
  overallRating: 4.8,
  monthlyRating: 4.9,
  onTimePercent: 96,
  pdfUploadPercent: 88,
  rescheduledPercent: 4,
  cancelledPercent: 2,
};

const youtubeSummary = {
  minutesDelivered: 4280,
  avgWatchTime: 42,
  subscribersAdded: 1240,
  likes: 8500,
  dislikes: 120,
};

const TeacherPerformance: React.FC = () => {
  return (
    <AppShell title="Performance">
      <div className="px-4 py-4 space-y-6">
        {/* Paid Classes Summary */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Paid Classes Summary</h2>
          <div className="space-y-3">
            {/* Rating Card */}
            <div className="p-4 rounded-xl bg-card shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-warning fill-warning" />
                  <span className="font-medium text-foreground">Overall Rating</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{paidClassesSummary.overallRating}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">This Month</span>
                <span className="font-medium text-foreground">{paidClassesSummary.monthlyRating} ⭐</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-card shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Clock className="h-4 w-4 text-success" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{paidClassesSummary.onTimePercent}%</p>
                <p className="text-sm text-muted-foreground">On-time Start</p>
              </div>

              <div className="p-4 rounded-xl bg-card shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{paidClassesSummary.pdfUploadPercent}%</p>
                <p className="text-sm text-muted-foreground">PDF Upload</p>
              </div>

              <div className="p-4 rounded-xl bg-card shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <RefreshCw className="h-4 w-4 text-warning" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{paidClassesSummary.rescheduledPercent}%</p>
                <p className="text-sm text-muted-foreground">Rescheduled</p>
              </div>

              <div className="p-4 rounded-xl bg-card shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <XCircle className="h-4 w-4 text-destructive" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{paidClassesSummary.cancelledPercent}%</p>
                <p className="text-sm text-muted-foreground">Cancelled</p>
              </div>
            </div>
          </div>
        </section>

        {/* YouTube Summary */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Youtube className="h-5 w-5 text-destructive" />
            YouTube Summary
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-card shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{(youtubeSummary.minutesDelivered / 60).toFixed(0)}h</p>
                <p className="text-sm text-muted-foreground">Minutes Delivered</p>
              </div>

              <div className="p-4 rounded-xl bg-card shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-accent">
                    <Eye className="h-4 w-4 text-accent-foreground" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{youtubeSummary.avgWatchTime}m</p>
                <p className="text-sm text-muted-foreground">Avg Watch Time</p>
              </div>

              <div className="p-4 rounded-xl bg-card shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Users className="h-4 w-4 text-success" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">+{youtubeSummary.subscribersAdded.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Subscribers Added</p>
              </div>

              <div className="p-4 rounded-xl bg-card shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">
                    <div className="p-1.5 rounded-lg bg-success/10">
                      <ThumbsUp className="h-3.5 w-3.5 text-success" />
                    </div>
                    <div className="p-1.5 rounded-lg bg-destructive/10">
                      <ThumbsDown className="h-3.5 w-3.5 text-destructive" />
                    </div>
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {(youtubeSummary.likes / 1000).toFixed(1)}K
                  <span className="text-sm font-normal text-muted-foreground ml-1">/ {youtubeSummary.dislikes}</span>
                </p>
                <p className="text-sm text-muted-foreground">Likes / Dislikes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Summary insight */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground text-center">
            📊 Your performance metrics are strong. Keep delivering quality content!
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default TeacherPerformance;
