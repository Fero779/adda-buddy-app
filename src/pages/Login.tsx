import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type LoginStep = 'phone' | 'otp';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginStep>('phone');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkUserOnboarding(session.user.id);
      }
    });
  }, []);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const checkUserOnboarding = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, onboarded')
      .eq('user_id', userId)
      .single();

    if (profile?.onboarded && profile?.role) {
      navigate(`/${profile.role}`);
    } else {
      navigate('/role-selection');
    }
  };

  const fullPhone = `${countryCode}${phone}`;

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phone: fullPhone }
      });

      if (error) throw error;

      if (data.success) {
        setStep('otp');
        setResendTimer(30);
        toast.success('OTP sent successfully!');
        
        // For testing - show OTP in toast (REMOVE IN PRODUCTION)
        if (data.debug_otp) {
          setDebugOtp(data.debug_otp);
          toast.info(`Test OTP: ${data.debug_otp}`, { duration: 10000 });
        }
      } else {
        throw new Error(data.error || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('Send OTP error:', error);
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { phone: fullPhone, otp: otpString }
      });

      if (error) throw error;

      if (data.success && data.session) {
        // Set the session directly from the edge function response
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          toast.error('Failed to establish session');
          return;
        }

        toast.success('Login successful!');
        
        // Navigate based on user status
        if (data.isNewUser || !data.user.onboarded) {
          navigate('/role-selection');
        } else {
          navigate(`/${data.user.role}`);
        }
      } else {
        throw new Error(data.error || 'Invalid OTP');
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    handleSendOtp();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-2xl font-black text-primary-foreground">A</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground">Adda247</h2>
            <p className="text-sm text-muted-foreground">Partner App</p>
          </div>
        </div>

        {step === 'phone' ? (
          <>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Enter your mobile number to get started
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Enter OTP
            </h1>
            <p className="text-muted-foreground">
              We've sent a 6-digit code to<br />
              <span className="font-semibold text-foreground">{fullPhone}</span>
            </p>
          </>
        )}
      </div>

      {/* Form */}
      <div className="flex-1 px-6">
        {step === 'phone' ? (
          <div className="space-y-6 animate-slide-up">
            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mobile Number
              </label>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="h-14 w-24 px-3 rounded-xl bg-card border border-border text-foreground font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter mobile number"
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>

            {/* Send OTP Button */}
            <button
              onClick={handleSendOtp}
              disabled={isLoading || phone.length < 10}
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
        ) : (
          <div className="space-y-6 animate-slide-up">
            {/* OTP Input */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Debug OTP Display */}
            {debugOtp && (
              <div className="p-3 rounded-lg bg-accent border border-border text-center">
                <p className="text-xs text-muted-foreground">Test OTP (remove in production)</p>
                <p className="text-lg font-bold text-primary tracking-widest">{debugOtp}</p>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.join('').length !== 6}
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
                    onClick={handleResendOtp}
                    className="font-semibold text-primary hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </div>

            {/* Change Number */}
            <button
              onClick={() => {
                setStep('phone');
                setOtp(['', '', '', '', '', '']);
                setDebugOtp(null);
              }}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Change mobile number
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <p className="text-sm text-muted-foreground">
          By continuing, you agree to our{' '}
          <span className="text-primary font-medium">Terms of Service</span>
          {' '}and{' '}
          <span className="text-primary font-medium">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Login;