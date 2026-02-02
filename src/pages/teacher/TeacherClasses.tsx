import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar, Clock, Users, CheckCircle, Video, Youtube, Radio } from 'lucide-react';

interface ClassItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  students: number;
  status: 'live' | 'upcoming' | 'completed';
  platform: 'adda' | 'youtube';
  dayCategory: 'today' | 'upcoming' | 'past';
}

// Mock data - will come from API
const classes: ClassItem[] = [
  { id: '1', title: 'SSC CGL Maths - Algebra', subject: 'Mathematics', date: 'Today', time: '4:00 PM', duration: '90 min', students: 342, status: 'upcoming', platform: 'adda', dayCategory: 'today' },
  { id: '2', title: 'Bank PO - Data Interpretation', subject: 'Quantitative', date: 'Today', time: '6:30 PM', duration: '60 min', students: 256, status: 'upcoming', platform: 'youtube', dayCategory: 'today' },
  { id: '3', title: 'SSC CGL - Current Affairs', subject: 'GK', date: 'Today', time: '8:00 PM', duration: '45 min', students: 189, status: 'upcoming', platform: 'adda', dayCategory: 'today' },
  { id: '4', title: 'Railway NTPC - Reasoning Basics', subject: 'Reasoning', date: 'Tomorrow', time: '10:00 AM', duration: '90 min', students: 412, status: 'upcoming', platform: 'adda', dayCategory: 'upcoming' },
  { id: '5', title: 'Bank Clerk - English Grammar', subject: 'English', date: 'Feb 4', time: '2:00 PM', duration: '60 min', students: 298, status: 'upcoming', platform: 'youtube', dayCategory: 'upcoming' },
  { id: '6', title: 'SSC MTS - General Science', subject: 'Science', date: 'Feb 5', time: '11:00 AM', duration: '75 min', students: 220, status: 'upcoming', platform: 'adda', dayCategory: 'upcoming' },
  { id: '7', title: 'SSC CHSL - English Grammar', subject: 'English', date: 'Yesterday', time: '4:00 PM', duration: '75 min', students: 189, status: 'completed', platform: 'adda', dayCategory: 'past' },
  { id: '8', title: 'Railway NTPC - Reasoning', subject: 'Reasoning', date: 'Jan 31', time: '10:00 AM', duration: '90 min', students: 412, status: 'completed', platform: 'youtube', dayCategory: 'past' },
  { id: '9', title: 'SSC MTS - General Awareness', subject: 'GK', date: 'Jan 30', time: '2:00 PM', duration: '60 min', students: 298, status: 'completed', platform: 'adda', dayCategory: 'past' },
];

const TeacherClasses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past'>('today');
  const [activePlatform, setActivePlatform] = useState<'adda' | 'youtube'>('adda');

  const filteredClasses = classes.filter(cls => {
    return cls.dayCategory === activeTab && cls.platform === activePlatform;
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
                    <h3 className="font-semibold text-foreground">{cls.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{cls.subject}</p>
                </div>
                {getStatusBadge(cls.status)}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                  {cls.students} students
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No {activePlatform === 'adda' ? 'Adda Live' : 'YouTube'} classes {activeTab === 'today' ? 'today' : activeTab === 'upcoming' ? 'scheduled' : 'in history'}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default TeacherClasses;