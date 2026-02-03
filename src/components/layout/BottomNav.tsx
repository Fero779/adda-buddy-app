import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, BookOpen, TrendingUp, IndianRupee, Ticket, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
}

// Phase 1: Revenue removed (API not available)
const teacherNavItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/teacher' },
  { icon: BookOpen, label: 'Classes', path: '/teacher/classes' },
  { icon: TrendingUp, label: 'Performance', path: '/teacher/performance' },
  { icon: User, label: 'Profile', path: '/teacher/profile' },
];

const influencerNavItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/influencer' },
  { icon: Ticket, label: 'Coupons', path: '/influencer/coupons' },
  { icon: TrendingUp, label: 'Performance', path: '/influencer/performance' },
  { icon: IndianRupee, label: 'Revenue', path: '/influencer/revenue' },
  { icon: User, label: 'Profile', path: '/influencer/profile' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const navItems = location.pathname.startsWith('/teacher')
    ? teacherNavItems
    : location.pathname.startsWith('/influencer')
      ? influencerNavItems
      : profile?.role === 'teacher'
        ? teacherNavItems
        : influencerNavItems;

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
                'flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 min-w-[70px]',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              )}
            >
              <div className={cn(
                'p-1.5 rounded-lg transition-colors',
                isActive && 'bg-accent'
              )}>
                <Icon className={cn('h-5 w-5', isActive && 'animate-scale-in')} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                'text-xs',
                isActive ? 'font-semibold' : 'font-medium'
              )}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};