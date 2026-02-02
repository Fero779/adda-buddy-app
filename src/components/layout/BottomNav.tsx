import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, BarChart3, Wallet, User, BookOpen, Users } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
}

const teacherNavItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/teacher' },
  { icon: BookOpen, label: 'Classes', path: '/teacher/classes' },
  { icon: Wallet, label: 'Earnings', path: '/teacher/earnings' },
  { icon: User, label: 'Profile', path: '/teacher/profile' },
];

const influencerNavItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/influencer' },
  { icon: Users, label: 'Referrals', path: '/influencer/referrals' },
  { icon: Wallet, label: 'Earnings', path: '/influencer/earnings' },
  { icon: User, label: 'Profile', path: '/influencer/profile' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const navItems = user?.role === 'teacher' ? teacherNavItems : influencerNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[64px]',
                isActive 
                  ? 'text-primary bg-accent' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'animate-scale-in')} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
