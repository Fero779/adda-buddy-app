import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Calendar, Clock, Users, Play, CheckCircle } from 'lucide-react';

interface ClassItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  students: number;
  status: 'upcoming' | 'live' | 'completed';
}

const mockClasses: ClassItem[] = [
  { id: '1', title: 'SSC CGL Maths - Algebra', subject: 'Mathematics', date: 'Today', time: '4:00 PM', duration: '90 min', students: 342, status: 'upcoming' },
  { id: '2', title: 'Bank PO - Data Interpretation', subject: 'Quantitative', date: 'Today', time: '6:30 PM', duration: '60 min', students: 256, status: 'upcoming' },
  { id: '3', title: 'SSC CHSL - English Grammar', subject: 'English', date: 'Yesterday', time: '4:00 PM', duration: '75 min', students: 189, status: 'completed' },
  { id: '4', title: 'Railway NTPC - Reasoning', subject: 'Reasoning', date: 'Jan 31', time: '10:00 AM', duration: '90 min', students: 412, status: 'completed' },
];

const TeacherClasses: React.FC = () => {
  const getStatusBadge = (status: ClassItem['status']) => {
    switch (status) {
      case 'live':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-destructive text-destructive-foreground animate-pulse-subtle">
            <span className="h-1.5 w-1.5 bg-current rounded-full" />
            LIVE
          </span>
        );
      case 'upcoming':
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
            Upcoming
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

  return (
    <AppShell title="My Classes">
      <div className="px-4 py-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {['All', 'Upcoming', 'Completed'].map((tab, index) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                index === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-accent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Classes List */}
        <div className="space-y-3">
          {mockClasses.map((cls, index) => (
            <div
              key={cls.id}
              className="p-4 rounded-xl bg-card shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{cls.title}</h3>
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

              {cls.status === 'upcoming' && (
                <button className="w-full mt-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <Play className="h-4 w-4" />
                  Start Class
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default TeacherClasses;
