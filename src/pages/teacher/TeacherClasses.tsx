import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar, Clock, Users, CheckCircle, Video, Youtube, Radio, Key, Monitor, CalendarIcon, ChevronDown, FileText, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ClassItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  actualDate: string;
  time: string;
  duration: string;
  students: number;
  status: 'live' | 'upcoming' | 'completed';
  platform: 'adda' | 'youtube';
  dayCategory: 'today' | 'upcoming' | 'past';
  // IDs for expandable section
  studioAppId?: string;
  externalScheduleId?: string;
  streamKey?: string;
  // Resource status for past classes
  lectureNotesStatus?: 'uploaded' | 'pending';
  dppStatus?: 'uploaded' | 'pending';
  internalNotesStatus?: 'uploaded' | 'pending';
}

// Mock data - will come from API
const classes: ClassItem[] = [
  // Today
  { id: '1', title: 'SSC CGL Maths - Algebra', subject: 'Mathematics', date: 'Today', actualDate: '2026-02-03', time: '4:00 PM', duration: '90 min', students: 342, status: 'upcoming', platform: 'adda', dayCategory: 'today', studioAppId: 'app_98765', externalScheduleId: 'ext_12345' },
  { id: '2', title: 'Bank PO - Data Interpretation', subject: 'Quantitative', date: 'Today', actualDate: '2026-02-03', time: '6:30 PM', duration: '60 min', students: 256, status: 'upcoming', platform: 'youtube', dayCategory: 'today', streamKey: 'sk_live_xyz789', studioAppId: 'app_54321' },
  { id: '3', title: 'SSC CGL - Current Affairs', subject: 'GK', date: 'Today', actualDate: '2026-02-03', time: '8:00 PM', duration: '45 min', students: 189, status: 'upcoming', platform: 'adda', dayCategory: 'today', studioAppId: 'app_11223', externalScheduleId: 'ext_67890' },
  // Upcoming
  { id: '4', title: 'Railway NTPC - Reasoning Basics', subject: 'Reasoning', date: 'Tomorrow', actualDate: '2026-02-04', time: '10:00 AM', duration: '90 min', students: 412, status: 'upcoming', platform: 'adda', dayCategory: 'upcoming', studioAppId: 'app_33445', externalScheduleId: 'ext_11111' },
  { id: '5', title: 'Bank Clerk - English Grammar', subject: 'English', date: 'Feb 5', actualDate: '2026-02-05', time: '2:00 PM', duration: '60 min', students: 298, status: 'upcoming', platform: 'youtube', dayCategory: 'upcoming', streamKey: 'sk_live_abc123', studioAppId: 'app_55667' },
  { id: '6', title: 'SSC MTS - General Science', subject: 'Science', date: 'Feb 6', actualDate: '2026-02-06', time: '11:00 AM', duration: '75 min', students: 220, status: 'upcoming', platform: 'adda', dayCategory: 'upcoming', studioAppId: 'app_77889', externalScheduleId: 'ext_22222' },
  // Past
  { id: '7', title: 'SSC CHSL - English Grammar', subject: 'English', date: 'Yesterday', actualDate: '2026-02-02', time: '4:00 PM', duration: '75 min', students: 189, status: 'completed', platform: 'adda', dayCategory: 'past', studioAppId: 'app_98765', externalScheduleId: 'ext_33333', lectureNotesStatus: 'uploaded', dppStatus: 'uploaded', internalNotesStatus: 'pending' },
  { id: '8', title: 'Railway NTPC - Reasoning', subject: 'Reasoning', date: 'Feb 1', actualDate: '2026-02-01', time: '10:00 AM', duration: '90 min', students: 412, status: 'completed', platform: 'youtube', dayCategory: 'past', streamKey: 'sk_live_def456', studioAppId: 'app_54321', lectureNotesStatus: 'uploaded', dppStatus: 'pending', internalNotesStatus: 'uploaded' },
  { id: '9', title: 'SSC MTS - General Awareness', subject: 'GK', date: 'Jan 31', actualDate: '2026-01-31', time: '2:00 PM', duration: '60 min', students: 298, status: 'completed', platform: 'adda', dayCategory: 'past', studioAppId: 'app_11223', externalScheduleId: 'ext_44444', lectureNotesStatus: 'pending', dppStatus: 'pending', internalNotesStatus: 'pending' },
  { id: '10', title: 'Bank PO - Quantitative Aptitude', subject: 'Maths', date: 'Jan 30', actualDate: '2026-01-30', time: '3:00 PM', duration: '90 min', students: 356, status: 'completed', platform: 'youtube', dayCategory: 'past', streamKey: 'sk_live_ghi789', studioAppId: 'app_44556', lectureNotesStatus: 'uploaded', dppStatus: 'uploaded', internalNotesStatus: 'uploaded' },
  { id: '11', title: 'SSC CGL - Reasoning Puzzles', subject: 'Reasoning', date: 'Jan 28', actualDate: '2026-01-28', time: '5:00 PM', duration: '60 min', students: 278, status: 'completed', platform: 'adda', dayCategory: 'past', studioAppId: 'app_77889', externalScheduleId: 'ext_55555', lectureNotesStatus: 'uploaded', dppStatus: 'uploaded', internalNotesStatus: 'uploaded' },
];

const TeacherClasses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past'>('today');
  const [activePlatform, setActivePlatform] = useState<'adda' | 'youtube'>('adda');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());

  const toggleExpanded = (classId: string) => {
    setExpandedClasses(prev => {
      const next = new Set(prev);
      if (next.has(classId)) {
        next.delete(classId);
      } else {
        next.add(classId);
      }
      return next;
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

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

  const getResourceStatusBadge = (status: 'uploaded' | 'pending' | undefined) => {
    if (status === 'uploaded') {
      return <span className="text-xs font-medium text-success">Uploaded</span>;
    }
    return <span className="text-xs font-medium text-warning">Pending</span>;
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
            <Collapsible
              key={cls.id}
              open={expandedClasses.has(cls.id)}
              onOpenChange={() => toggleExpanded(cls.id)}
            >
              <div
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

                {/* Join Class CTA - Only for Today/Live classes */}
                {(activeTab === 'today' && (cls.status === 'live' || cls.status === 'upcoming')) && (
                  <div className="mb-3">
                    <Button
                      className="w-full gap-2 gradient-primary text-primary-foreground"
                      size="sm"
                    >
                      <Video className="h-4 w-4" />
                      Join Class
                    </Button>
                  </div>
                )}

                {/* Expandable Section Trigger */}
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-center gap-1 pt-3 border-t border-border text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <span>{expandedClasses.has(cls.id) ? 'Hide Details' : 'View Details'}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", expandedClasses.has(cls.id) && "rotate-180")} />
                  </button>
                </CollapsibleTrigger>

                {/* Expandable Content */}
                <CollapsibleContent className="pt-3 space-y-3">
                  {/* IDs Section */}
                  <div className="space-y-2">
                    {cls.studioAppId && (
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">Studio App ID:</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-foreground">
                            {cls.studioAppId}
                          </code>
                          <button
                            onClick={() => copyToClipboard(cls.studioAppId!, 'Studio App ID')}
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Copy className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    )}
                    {cls.externalScheduleId && (
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">External Schedule ID:</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-foreground">
                            {cls.externalScheduleId}
                          </code>
                          <button
                            onClick={() => copyToClipboard(cls.externalScheduleId!, 'Schedule ID')}
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Copy className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    )}
                    {cls.streamKey && activePlatform === 'youtube' && (
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Key className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">Stream Key:</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-foreground">
                            {cls.streamKey}
                          </code>
                          <button
                            onClick={() => copyToClipboard(cls.streamKey!, 'Stream Key')}
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Copy className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Resource Status - Only for Past tab */}
                  {activeTab === 'past' && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs font-medium text-foreground mb-2">Resource Status</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Lecture Notes:</span>
                          </div>
                          {getResourceStatusBadge(cls.lectureNotesStatus)}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">DPP:</span>
                          </div>
                          {getResourceStatusBadge(cls.dppStatus)}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Internal Notes:</span>
                          </div>
                          {getResourceStatusBadge(cls.internalNotesStatus)}
                        </div>
                      </div>
                    </div>
                  )}
                </CollapsibleContent>
              </div>
            </Collapsible>
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