import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Star,
  Award,
  BookOpen,
  QrCode,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { QRScanner } from '@/components/QRScanner';

const TeacherProfile: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Phase 1: Only essential menu items enabled
  const menuItems = [
    { icon: RefreshCw, label: 'Change Role', onClick: () => navigate('/role-selection?edit=1'), enabled: true },
    { icon: HelpCircle, label: 'Help & Support', onClick: () => {}, enabled: true },
  ];

  const displayName = profile?.name || 'Teacher';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <AppShell title="Profile">
      <div className="px-4 py-4 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-card shadow-card">
          <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">
              {initials || 'T'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{displayName}</h2>
            <p className="text-sm text-muted-foreground">{profile?.phone}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 text-warning fill-warning" />
              <span className="text-sm font-medium text-foreground">4.9</span>
              <span className="text-sm text-muted-foreground">(2,840 students)</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-card shadow-card text-center">
            <Award className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">Top 5%</p>
            <p className="text-xs text-muted-foreground">Teacher Rank</p>
          </div>
          <div className="p-4 rounded-xl bg-card shadow-card text-center">
            <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">156</p>
            <p className="text-xs text-muted-foreground">Classes</p>
          </div>
          <div className="p-4 rounded-xl bg-card shadow-card text-center">
            <Star className="h-6 w-6 text-warning mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">4.9</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
        </div>

        {/* QR Login Button */}
        <button
          onClick={() => setShowQRScanner(true)}
          className="w-full flex items-center gap-4 p-4 rounded-xl gradient-primary shadow-card hover:opacity-90 transition-opacity active:scale-[0.99]"
        >
          <div className="p-2 rounded-lg bg-white/20">
            <QrCode className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-semibold text-primary-foreground">Scan QR to Login PC</span>
            <p className="text-xs text-primary-foreground/80">Access your dashboard on desktop</p>
          </div>
          <ChevronRight className="h-5 w-5 text-primary-foreground" />
        </button>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-card shadow-card hover:shadow-elevated transition-all active:scale-[0.99]"
            >
              <div className="p-2 rounded-lg bg-accent">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="flex-1 text-left font-medium text-foreground">{item.label}</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-colors"
        >
          <div className="p-2 rounded-lg bg-destructive/20">
            <LogOut className="h-5 w-5 text-destructive" />
          </div>
          <span className="flex-1 text-left font-medium text-destructive">Logout</span>
        </button>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          Adda247 Partner App v1.0.0
        </p>
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

export default TeacherProfile;