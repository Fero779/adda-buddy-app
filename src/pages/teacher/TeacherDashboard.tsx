import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { QRScanner } from '@/components/QRScanner';
import { 
  Star, 
  Clock, 
  XCircle, 
  FileText,
  Video,
  IndianRupee,
  ChevronRight,
  Calendar,
  QrCode
} from 'lucide-react';

// Mock data - will come from API
const teacherData = {
  name: 'Rahul Sharma',
  rating: 4.8,
  onTimePercent: 96,
  cancelledPercent: 2,
  pdfsUploadedPercent: 88,
};

const todayData = {
  classesToday: 3,
  nextClassTime: '4:00 PM',
  nextClassTitle: 'SSC CGL Maths',
};

const revenueData = {
  thisMonthRevenue: 78500,
  ordersCount: 156,
};

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [showQRScanner, setShowQRScanner] = useState(false);

  const displayName = profile?.name || teacherData.name;

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(1)}K`;
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

        {/* Today Snapshot Card */}
        <div className="p-5 rounded-2xl bg-card shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Today</h3>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-foreground">{todayData.classesToday}</p>
              <p className="text-sm text-muted-foreground">Classes scheduled</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Next class at</p>
              <p className="text-xl font-bold text-primary">{todayData.nextClassTime}</p>
              <p className="text-xs text-muted-foreground">{todayData.nextClassTitle}</p>
            </div>
          </div>

          <button 
            className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            <Video className="h-5 w-5" />
            Join Next Class
          </button>
        </div>

        {/* Revenue Snapshot Card */}
        <div className="p-5 rounded-2xl bg-card shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <IndianRupee className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">This Month</h3>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(revenueData.thisMonthRevenue)}</p>
              <p className="text-sm text-muted-foreground">Revenue earned</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{revenueData.ordersCount}</p>
              <p className="text-sm text-muted-foreground">Orders</p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/teacher/revenue')}
            className="w-full py-3 rounded-xl bg-accent text-foreground font-semibold flex items-center justify-center gap-2 hover:bg-accent/80 transition-colors active:scale-[0.98]"
          >
            View Revenue
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onClose={() => setShowQRScanner(false)}
          onSuccess={() => setShowQRScanner(false)}
        />
      )}
    </AppShell>
  );
};

export default TeacherDashboard;