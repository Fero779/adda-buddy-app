import React from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';

interface EmailInputProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({
  email,
  onEmailChange,
  onSubmit,
  isLoading,
  error
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && email.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your email address"
            className={`w-full h-14 pl-12 pr-4 rounded-xl bg-card border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg transition-colors ${
              error 
                ? 'border-destructive focus:ring-destructive/20' 
                : 'border-border'
            }`}
            autoComplete="email"
            autoFocus
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-destructive animate-fade-in">
            {error}
          </p>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-sm text-muted-foreground text-center px-4">
        We'll send a verification code to your email and registered mobile number
      </p>

      {/* Get OTP Button */}
      <button
        onClick={onSubmit}
        disabled={isLoading || !email.trim()}
        className="w-full h-14 rounded-xl gradient-primary text-primary-foreground font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity active:scale-[0.98]"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Get OTP
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
    </div>
  );
};

export default EmailInput;
