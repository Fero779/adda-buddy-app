import React, { useEffect, useRef } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface OtpInputProps {
  otp: string[];
  onOtpChange: (otp: string[]) => void;
  onSubmit: () => void;
  onResend: () => void;
  onChangeEmail: () => void;
  email: string;
  isLoading: boolean;
  resendTimer: number;
  error?: string;
  debugOtp?: string | null;
}

const OtpInput: React.FC<OtpInputProps> = ({
  otp,
  onOtpChange,
  onSubmit,
  onResend,
  onChangeEmail,
  email,
  isLoading,
  resendTimer,
  error,
  debugOtp
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = numericValue;
    onOtpChange(newOtp);

    // Auto-focus next input
    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter' && otp.join('').length === 6) {
      onSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      onOtpChange(newOtp);
      // Focus last filled input or submit if complete
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const isComplete = otp.join('').length === 6;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* OTP Info */}
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">
          We've sent a 6-digit code to:
        </p>
        <ul className="text-sm text-foreground space-y-1">
          <li className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            your email
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            your registered mobile number
          </li>
        </ul>
      </div>

      {/* OTP Boxes */}
      <div className="flex justify-center gap-3" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl bg-card border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
              error 
                ? 'border-destructive shake' 
                : 'border-border'
            }`}
            maxLength={1}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive text-center animate-fade-in">
          {error}
        </p>
      )}

      {/* Debug OTP Display - Remove in Production */}
      {debugOtp && (
        <div className="p-3 rounded-lg bg-accent border border-border text-center">
          <p className="text-xs text-muted-foreground">Test OTP (remove in production)</p>
          <p className="text-lg font-bold text-primary tracking-widest">{debugOtp}</p>
        </div>
      )}

      {/* Verify Button */}
      <button
        onClick={onSubmit}
        disabled={isLoading || !isComplete}
        className="w-full h-14 rounded-xl gradient-primary text-primary-foreground font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity active:scale-[0.98]"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Verify & Continue
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      {/* Resend OTP */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Didn't receive the code?{' '}
          {resendTimer > 0 ? (
            <span className="font-medium text-foreground">
              Resend in {resendTimer}s
            </span>
          ) : (
            <button
              onClick={onResend}
              disabled={isLoading}
              className="font-semibold text-primary hover:underline disabled:opacity-50"
            >
              Resend OTP
            </button>
          )}
        </p>
      </div>

      {/* Change Email */}
      <button
        onClick={onChangeEmail}
        disabled={isLoading}
        className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        ← Change email
      </button>
    </div>
  );
};

export default OtpInput;
