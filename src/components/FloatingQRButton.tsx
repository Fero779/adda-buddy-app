import React, { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';

interface FloatingQRButtonProps {
  onClick: () => void;
  showTooltip?: boolean;
}

export const FloatingQRButton: React.FC<FloatingQRButtonProps> = ({ 
  onClick, 
  showTooltip: initialShowTooltip = false 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip on first use (check localStorage)
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('qr_fab_tooltip_seen');
    if (!hasSeenTooltip && initialShowTooltip) {
      setShowTooltip(true);
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        setShowTooltip(false);
        localStorage.setItem('qr_fab_tooltip_seen', 'true');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [initialShowTooltip]);

  const handleClick = () => {
    if (showTooltip) {
      setShowTooltip(false);
      localStorage.setItem('qr_fab_tooltip_seen', 'true');
    }
    onClick();
  };

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 animate-fade-in">
          <div className="bg-foreground text-background text-xs font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            Scan to login Admin Dashboard on PC
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-foreground rotate-45" />
          </div>
        </div>
      )}

      {/* FAB with Label */}
      <div className="flex items-center gap-2">
        {/* Context Label */}
        <div className="px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-sm shadow-sm border border-border">
          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
            Login Admin (PC)
          </span>
        </div>

        {/* FAB Button */}
        <button
          onClick={handleClick}
          className="h-14 w-14 rounded-full bg-card shadow-elevated flex items-center justify-center border border-border hover:bg-accent transition-all active:scale-95"
          aria-label="Scan to login Admin Dashboard on PC"
        >
          <QrCode className="h-6 w-6 text-primary" />
        </button>
      </div>
    </div>
  );
};
