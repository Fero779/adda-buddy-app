import React from 'react';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  showGreeting?: boolean;
  hideNav?: boolean;
  onQRScan?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  title,
  showGreeting,
  hideNav = false,
  onQRScan,
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title={title} showGreeting={showGreeting} onQRScan={onQRScan} />
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
};
