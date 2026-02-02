import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  HelpCircle, 
  FileText, 
  LogOut, 
  ChevronRight,
  Star,
  Award,
  BookOpen
} from 'lucide-react';

const TeacherProfile: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const menuItems = [
    { icon: User, label: 'Edit Profile', onClick: () => {} },
    { icon: Settings, label: 'Settings', onClick: () => {} },
    { icon: FileText, label: 'Documents', onClick: () => {} },
    { icon: HelpCircle, label: 'Help & Support', onClick: () => {} },
  ];

  return (
    <AppShell title="Profile">
      <div className="px-4 py-4 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-card shadow-card">
          <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
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

export default TeacherProfile;
