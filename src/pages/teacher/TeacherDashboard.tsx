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
  Video,
  ChevronRight,
  Calendar,
  QrCode
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

// All upcoming classes - API will provide sorted by datetime
const allClasses = [
  { id: '1', title: 'SSC CGL Maths - Algebra', subject: 'Mathematics', date: '2026-02-03', time: '16:00', displayTime: '4:00 PM', duration: '90 min', status: 'upcoming' as const, platform: 'adda' as const },
  { id: '2', title: 'Bank PO - Data Interpretation', subject: 'Quantitative', date: '2026-02-03', time: '18:30', displayTime: '6:30 PM', duration: '60 min', status: 'upcoming' as const, platform: 'youtube' as const },
  { id: '3', title: 'SSC CGL - Current Affairs', subject: 'GK', date: '2026-02-03', time: '20:00', displayTime: '8:00 PM', duration: '45 min', status: 'upcoming' as const, platform: 'adda' as const },
  { id: '4', title: 'Railway NTPC - Reasoning', subject: 'Reasoning', date: '2026-02-04', time: '10:00', displayTime: '10:00 AM', duration: '90 min', status: 'upcoming' as const, platform: 'adda' as const },
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

  // Count today's classes
  const todayClassCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return allClasses.filter(cls => cls.date === today).length;
  }, []);

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

        {/* Today's Classes Card */}
        {nextClass ? (
          <div className="p-5 rounded-2xl bg-card shadow-card">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Today</span>
            </div>
            
            {/* Content - Left: Count, Right: Next Class Info */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-foreground">{todayClassCount}</p>
                <p className="text-sm text-muted-foreground">Classes scheduled</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Next class at</p>
                <p className="text-xl font-bold text-primary">{nextClass.displayTime}</p>
                <p className="text-sm text-muted-foreground">{nextClass.title.split(' - ')[0]}</p>
              </div>
            </div>

            {/* Primary CTA - Join Class */}
            <button 
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors active:scale-[0.98]"
            >
              <Video className="h-5 w-5" />
              Join Next Class
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-card shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Today</span>
            </div>
            <p className="text-sm text-muted-foreground">You have no scheduled classes at the moment.</p>
          </div>
        )}
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