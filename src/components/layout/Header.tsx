import React from 'react';
import { Bell, QrCode } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title?: string;
  showGreeting?: boolean;
  onQRScan?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, showGreeting = false, onQRScan }) => {
  const { profile } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = profile?.name || (profile?.role === 'teacher' ? 'Teacher' : 'Partner');

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex-1">
          {showGreeting ? (
            <div>
              <p className="text-sm text-muted-foreground">{getGreeting()}</p>
              <h1 className="text-xl font-bold text-foreground">
                {displayName}
              </h1>
            </div>
          ) : (
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* QR Scan Icon - Secondary access */}
          {onQRScan && (
            <button 
              onClick={onQRScan}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Scan QR to login on PC"
            >
              <QrCode className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-accent transition-colors">
            <Bell className="h-6 w-6 text-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};
