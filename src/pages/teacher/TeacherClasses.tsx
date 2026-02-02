import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar, Clock, Users, CheckCircle, Video, Youtube, Radio, Upload, Key, Monitor, CalendarIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface ClassItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  actualDate: string; // ISO date for filtering
  time: string;
  duration: string;
  students: number;
  status: 'live' | 'upcoming' | 'completed';
  platform: 'adda' | 'youtube';
  dayCategory: 'today' | 'upcoming' | 'past';
  // Past class specific fields
  uploadStatus?: 'uploaded' | 'pending' | 'failed';
  streamKey?: string;
  studioAppId?: string;
}

// Mock data - will come from API
const classes: ClassItem[] = [
  // Today
  { id: '1', title: 'SSC CGL Maths - Algebra', subject: 'Mathematics', date: 'Today', actualDate: '2026-02-02', time: '4:00 PM', duration: '90 min', students: 342, status: 'upcoming', platform: 'adda', dayCategory: 'today' },
  { id: '2', title: 'Bank PO - Data Interpretation', subject: 'Quantitative', date: 'Today', actualDate: '2026-02-02', time: '6:30 PM', duration: '60 min', students: 256, status: 'upcoming', platform: 'youtube', dayCategory: 'today' },
  { id: '3', title: 'SSC CGL - Current Affairs', subject: 'GK', date: 'Today', actualDate: '2026-02-02', time: '8:00 PM', duration: '45 min', students: 189, status: 'upcoming', platform: 'adda', dayCategory: 'today' },
  // Upcoming
  { id: '4', title: 'Railway NTPC - Reasoning Basics', subject: 'Reasoning', date: 'Tomorrow', actualDate: '2026-02-03', time: '10:00 AM', duration: '90 min', students: 412, status: 'upcoming', platform: 'adda', dayCategory: 'upcoming' },
  { id: '5', title: 'Bank Clerk - English Grammar', subject: 'English', date: 'Feb 4', actualDate: '2026-02-04', time: '2:00 PM', duration: '60 min', students: 298, status: 'upcoming', platform: 'youtube', dayCategory: 'upcoming' },
  { id: '6', title: 'SSC MTS - General Science', subject: 'Science', date: 'Feb 5', actualDate: '2026-02-05', time: '11:00 AM', duration: '75 min', students: 220, status: 'upcoming', platform: 'adda', dayCategory: 'upcoming' },
  // Past
  { id: '7', title: 'SSC CHSL - English Grammar', subject: 'English', date: 'Yesterday', actualDate: '2026-02-01', time: '4:00 PM', duration: '75 min', students: 189, status: 'completed', platform: 'adda', dayCategory: 'past', uploadStatus: 'uploaded', streamKey: 'sk_live_abc123xyz', studioAppId: 'app_98765' },
  { id: '8', title: 'Railway NTPC - Reasoning', subject: 'Reasoning', date: 'Jan 31', actualDate: '2026-01-31', time: '10:00 AM', duration: '90 min', students: 412, status: 'completed', platform: 'youtube', dayCategory: 'past', uploadStatus: 'uploaded', streamKey: 'sk_live_def456uvw', studioAppId: 'app_54321' },
  { id: '9', title: 'SSC MTS - General Awareness', subject: 'GK', date: 'Jan 30', actualDate: '2026-01-30', time: '2:00 PM', duration: '60 min', students: 298, status: 'completed', platform: 'adda', dayCategory: 'past', uploadStatus: 'pending', streamKey: 'sk_live_ghi789rst', studioAppId: 'app_11223' },
  { id: '10', title: 'Bank PO - Quantitative Aptitude', subject: 'Maths', date: 'Jan 28', actualDate: '2026-01-28', time: '3:00 PM', duration: '90 min', students: 356, status: 'completed', platform: 'youtube', dayCategory: 'past', uploadStatus: 'failed', streamKey: 'sk_live_jkl012mno', studioAppId: 'app_44556' },
  { id: '11', title: 'SSC CGL - Reasoning Puzzles', subject: 'Reasoning', date: 'Jan 25', actualDate: '2026-01-25', time: '5:00 PM', duration: '60 min', students: 278, status: 'completed', platform: 'adda', dayCategory: 'past', uploadStatus: 'uploaded', streamKey: 'sk_live_pqr345stu', studioAppId: 'app_77889' },
];

const TeacherClasses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past'>('today');
  const [activePlatform, setActivePlatform] = useState<'adda' | 'youtube'>('adda');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const filteredClasses = classes.filter(cls => {
    const matchesTab = cls.dayCategory === activeTab;
    const matchesPlatform = cls.platform === activePlatform;
    
    // Apply date filter only for Past tab
    if (activeTab === 'past' && dateRange.from && dateRange.to) {
      const classDate = parseISO(cls.actualDate);
      const inRange = isWithinInterval(classDate, { start: dateRange.from, end: dateRange.to });
      return matchesTab && matchesPlatform && inRange;
    }
    
    return matchesTab && matchesPlatform;
  });

  const getStatusBadge = (status: ClassItem['status']) => {
    switch (status) {
      case 'live':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-destructive text-destructive-foreground animate-pulse">
            <span className="h-1.5 w-1.5 bg-current rounded-full" />
            LIVE
          </span>
        );
      case 'upcoming':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            <Video className="h-3 w-3" />
            Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-success/10 text-success">
            <CheckCircle className="h-3 w-3" />
            Completed
          </span>
        );
    }
  };

  const getUploadStatusBadge = (status: ClassItem['uploadStatus']) => {
    switch (status) {
      case 'uploaded':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-success/10 text-success">
            <Upload className="h-3 w-3" />
            Uploaded
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-warning/10 text-warning">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-3 w-3" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const getPlatformIcon = (platform: ClassItem['platform']) => {
    return platform === 'adda' ? (
      <Radio className="h-3.5 w-3.5 text-primary" />
    ) : (
      <Youtube className="h-3.5 w-3.5 text-destructive" />
    );
  };

  const getTabCount = (tab: 'today' | 'upcoming' | 'past') => {
    return classes.filter(c => c.dayCategory === tab && c.platform === activePlatform).length;
  };

  const clearDateFilter = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <AppShell title="Classes">
      <div className="px-4 py-4 space-y-4">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="w-full grid grid-cols-3 bg-muted/50">
            <TabsTrigger value="today" className="text-sm">
              Today ({getTabCount('today')})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-sm">
              Upcoming ({getTabCount('upcoming')})
            </TabsTrigger>
            <TabsTrigger value="past" className="text-sm">
              Past ({getTabCount('past')})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Platform Toggle */}
        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            value={activePlatform}
            onValueChange={(v) => v && setActivePlatform(v as typeof activePlatform)}
            className="bg-muted/50 p-1 rounded-lg"
          >
            <ToggleGroupItem
              value="adda"
              className="px-4 py-2 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md"
            >
              <Radio className="h-4 w-4 mr-2" />
              Adda Live
            </ToggleGroupItem>
            <ToggleGroupItem
              value="youtube"
              className="px-4 py-2 text-sm data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground rounded-md"
            >
              <Youtube className="h-4 w-4 mr-2" />
              YouTube
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Date Range Filter - Only for Past tab */}
        {activeTab === 'past' && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-card shadow-card">
            <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "justify-start text-left font-normal flex-1 h-9",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  {dateRange.from ? format(dateRange.from, "MMM d") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <span className="text-muted-foreground">—</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "justify-start text-left font-normal flex-1 h-9",
                    !dateRange.to && "text-muted-foreground"
                  )}
                >
                  {dateRange.to ? format(dateRange.to, "MMM d") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {(dateRange.from || dateRange.to) && (
              <Button variant="ghost" size="sm" onClick={clearDateFilter} className="h-9 px-2">
                Clear
              </Button>
            )}
          </div>
        )}

        {/* Classes List */}
        <div className="space-y-3">
          {filteredClasses.map((cls, index) => (
            <div
              key={cls.id}
              className="p-4 rounded-xl bg-card shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getPlatformIcon(cls.platform)}
                    <h3 className="font-semibold text-foreground text-sm">{cls.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{cls.subject}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(cls.status)}
                  {activeTab === 'past' && cls.uploadStatus && getUploadStatusBadge(cls.uploadStatus)}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {cls.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {cls.time} ({cls.duration})
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {cls.students}
                </span>
              </div>

              {/* Stream Info - Only for Past tab */}
              {activeTab === 'past' && (cls.streamKey || cls.studioAppId) && (
                <div className="pt-3 border-t border-border space-y-2">
                  {cls.streamKey && (
                    <div className="flex items-center gap-2 text-xs">
                      <Key className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Stream Key:</span>
                      <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-foreground">
                        {cls.streamKey}
                      </code>
                    </div>
                  )}
                  {cls.studioAppId && (
                    <div className="flex items-center gap-2 text-xs">
                      <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Studio App ID:</span>
                      <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-foreground">
                        {cls.studioAppId}
                      </code>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No {activePlatform === 'adda' ? 'Adda Live' : 'YouTube'} classes {activeTab === 'today' ? 'today' : activeTab === 'upcoming' ? 'scheduled' : 'in selected range'}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default TeacherClasses;