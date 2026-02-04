import React, { useState, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { QRScanner } from '@/components/QRScanner';
import { StudioQRScanner } from '@/components/StudioQRScanner';
import { 
  Star, 
  Clock, 
  XCircle, 
  FileText,
  ChevronRight,
  Calendar,
  QrCode,
  Radio,
  Youtube
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data - will come from API
const teacherData = {
  name: 'Rahul Sharma',
  rating: 4.8,
  onTimePercent: 96,
  cancelledPercent: 2,
  pdfsUploadedPercent: 88,
};

// Helper to get today's date string
const getDateString = (daysFromNow: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// All upcoming classes - API will provide sorted by datetime
// Using relative dates so classes always show
const allClasses = [
  { id: '1', title: 'SSC CGL Maths', subject: 'Mathematics', date: getDateString(0), time: '16:00', displayTime: '4:00 PM', duration: '90 min', status: 'upcoming' as const, platform: 'adda' as const },
  { id: '2', title: 'Bank PO - Data Interpretation', subject: 'Quantitative', date: getDateString(0), time: '18:30', displayTime: '6:30 PM', duration: '60 min', status: 'upcoming' as const, platform: 'youtube' as const },
  { id: '3', title: 'SSC CGL - Current Affairs', subject: 'GK', date: getDateString(0), time: '20:00', displayTime: '8:00 PM', duration: '45 min', status: 'upcoming' as const, platform: 'adda' as const },
  { id: '4', title: 'Railway NTPC - Reasoning', subject: 'Reasoning', date: getDateString(1), time: '10:00', displayTime: '10:00 AM', duration: '90 min', status: 'upcoming' as const, platform: 'adda' as const },
];

const TeacherDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showStudioScanner, setShowStudioScanner] = useState(false);

  const displayName = profile?.name || teacherData.name;

  // Time-based logic: Get the very next class
  const nextClass = useMemo(() => {
    const now = new Date();
    const upcomingClasses = allClasses
      .map(cls => {
        const classDateTime = new Date(`${cls.date}T${cls.time}:00`);
        return { ...cls, dateTime: classDateTime };
      })
      .filter(cls => cls.dateTime > now)
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
    
    return upcomingClasses[0] || null;
  }, []);

  // Get all today's classes (sorted by time)
  const todaysClasses = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return allClasses
      .filter(cls => cls.date === today)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, []);

  const getPlatformIcon = (platform: 'adda' | 'youtube') => {
    return platform === 'adda' ? (
      <Radio className="h-3.5 w-3.5 text-primary" />
    ) : (
      <Youtube className="h-3.5 w-3.5 text-destructive" />
    );
  };

  return (
    <AppShell showGreeting>
      <div className="px-4 py-4 space-y-4">
        {/* Teacher Header Card */}
        <div className="p-5 rounded-2xl bg-card shadow-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">
                {displayName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{displayName}</h2>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-warning fill-warning" />
                <span className="font-semibold text-foreground">{teacherData.rating}</span>
                <span className="text-sm text-muted-foreground">rating</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-success/10 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-success" />
              </div>
              <p className="text-lg font-bold text-foreground">{teacherData.onTimePercent}%</p>
              <p className="text-xs text-muted-foreground">On-time</p>
            </div>
            <div className="p-3 rounded-xl bg-destructive/10 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <XCircle className="h-4 w-4 text-destructive" />
              </div>
              <p className="text-lg font-bold text-foreground">{teacherData.cancelledPercent}%</p>
              <p className="text-xs text-muted-foreground">Cancelled</p>
            </div>
            <div className="p-3 rounded-xl bg-accent text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground">{teacherData.pdfsUploadedPercent}%</p>
              <p className="text-xs text-muted-foreground">PDFs</p>
            </div>
          </div>
        </div>

        {/* Scan QR to Login PC */}
        <button
          onClick={() => setShowQRScanner(true)}
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-card shadow-card hover:shadow-elevated transition-all active:scale-[0.99]"
        >
          <div className="p-2.5 rounded-lg bg-primary/10">
            <QrCode className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-foreground text-sm">Scan QR to Login PC</p>
            <p className="text-xs text-muted-foreground">Access your dashboard on desktop</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Section 1: Next Class At */}
        <div className="p-4 rounded-2xl bg-card shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Next Class At</span>
          </div>
          
          {nextClass ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{nextClass.title}</p>
                <p className="text-sm text-muted-foreground">{nextClass.subject}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">{nextClass.displayTime}</p>
                <p className="text-xs text-muted-foreground">{nextClass.duration}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming classes scheduled.</p>
          )}

          {/* Login Studio App CTA */}
          {nextClass && (
            <button
              onClick={() => setShowStudioScanner(true)}
              className="w-full mt-4 py-2.5 rounded-xl border border-primary/30 text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors active:scale-[0.98]"
            >
              <QrCode className="h-4 w-4" />
              Login Studio App (Scan QR)
            </button>
          )}
        </div>

        {/* Section 2: Today's Classes */}
        <div className="p-4 rounded-2xl bg-card shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Today's Classes</span>
            </div>
            <span className="text-sm text-muted-foreground">{todaysClasses.length} classes</span>
          </div>
          
          {todaysClasses.length > 0 ? (
            <div className="space-y-3">
              {todaysClasses.map((cls, index) => (
                <div 
                  key={cls.id}
                  className={`flex items-center gap-3 ${index !== todaysClasses.length - 1 ? 'pb-3 border-b border-border' : ''}`}
                >
                  {/* Time */}
                  <div className="w-16 text-center">
                    <p className="text-sm font-semibold text-foreground">{cls.displayTime}</p>
                  </div>
                  
                  {/* Class Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {getPlatformIcon(cls.platform)}
                      <p className="font-medium text-foreground text-sm truncate">{cls.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{cls.subject} • {cls.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No classes scheduled for today.</p>
          )}
        </div>
      </div>

      {/* QR Scanner Modal - Admin Login */}
      {showQRScanner && (
        <QRScanner
          onClose={() => setShowQRScanner(false)}
          onSuccess={() => setShowQRScanner(false)}
        />
      )}

      {/* Studio QR Scanner Modal */}
      {showStudioScanner && nextClass && (
        <StudioQRScanner
          classId={nextClass.id}
          className={nextClass.title}
          onClose={() => setShowStudioScanner(false)}
          onSuccess={() => {
            setShowStudioScanner(false);
            toast.success('Studio App connected successfully!');
          }}
        />
      )}
    </AppShell>
  );
};

export default TeacherDashboard;