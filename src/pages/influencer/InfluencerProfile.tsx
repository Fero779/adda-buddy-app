import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  HelpCircle, 
  FileText, 
  LogOut, 
  ChevronRight,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

const InfluencerProfile: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: 'Edit Profile', onClick: () => {} },
    { icon: Settings, label: 'Settings', onClick: () => {} },
    { icon: FileText, label: 'Payment Details', onClick: () => {} },
    { icon: HelpCircle, label: 'Help & Support', onClick: () => {} },
  ];

  const displayName = profile?.name || 'Influencer';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <AppShell title="Profile">
      <div className="px-4 py-4 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-card shadow-card">
          <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">
              {initials || 'I'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{displayName}</h2>
            <p className="text-sm text-muted-foreground">{profile?.phone}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
              Gold Partner
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-card shadow-card text-center">
            <Award className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">Gold</p>
            <p className="text-xs text-muted-foreground">Tier</p>
          </div>
          <div className="p-4 rounded-xl bg-card shadow-card text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">847</p>
            <p className="text-xs text-muted-foreground">Referrals</p>
          </div>
          <div className="p-4 rounded-xl bg-card shadow-card text-center">
            <TrendingUp className="h-6 w-6 text-success mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">36.8%</p>
            <p className="text-xs text-muted-foreground">Conv. Rate</p>
          </div>
        </div>

        {/* Tier Progress */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Tier Progress</h2>
          <div className="p-4 rounded-xl bg-card shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Gold → Platinum</span>
              <span className="text-sm text-muted-foreground">153 more referrals</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[85%] gradient-primary rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Reach 1,000 referrals to unlock Platinum tier with 15% higher commission!
            </p>
          </div>
        </section>

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
    </AppShell>
  );
};

export default InfluencerProfile;