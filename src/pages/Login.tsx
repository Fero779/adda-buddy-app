import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import EmailInput from '@/components/auth/EmailInput';
import OtpInput from '@/components/auth/OtpInput';
import { 
  sendOtp, 
  verifyOtp, 
  setAuthSession, 
  getCurrentSession, 
  isValidEmail 
} from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

type AuthStep = 'email' | 'otp';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string>();
  const [otpError, setOtpError] = useState<string>();
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Check if already logged in
  useEffect(() => {
    const checkExistingSession = async () => {
      const session = await getCurrentSession();
      if (session) {
        checkUserOnboarding(session.user.id);
      }
    };
    checkExistingSession();
  }, []);

  // Resend timer countdown
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
      // Phase 1: Teacher only
      navigate('/teacher');
    } else {
      navigate('/role-selection');
    }
  };

  const handleSendOtp = async () => {
    // Clear previous errors
    setEmailError(undefined);

    // Validate email
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await sendOtp(trimmedEmail);

      if (response.success) {
        setStep('otp');
        setResendTimer(30);
        toast.success('OTP sent successfully!');
        
        // Store email for session
        localStorage.setItem('auth_email', trimmedEmail);

        // Debug OTP display (remove in production)
        if (response.debug_otp) {
          setDebugOtp(response.debug_otp);
          toast.info(`Test OTP: ${response.debug_otp}`, { duration: 10000 });
        }
      } else {
        setEmailError(response.error || 'Failed to send OTP');
      }
    } catch (error: any) {
      setEmailError(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    // Clear previous errors
    setOtpError(undefined);

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOtp(email, otpString);

      if (response.success && response.session) {
        // Set the auth session
        await setAuthSession(
          response.session.access_token,
          response.session.refresh_token
        );

        toast.success('Login successful!');
        
        // Navigate based on user status
        if (response.isNewUser || !response.user?.onboarded) {
          navigate('/role-selection');
        } else {
          // Phase 1: Teacher only
          navigate('/teacher');
        }
      } else {
        // Handle specific error cases
        const errorMessage = response.error || 'Invalid OTP';
        if (errorMessage.toLowerCase().includes('expired')) {
          setOtpError('OTP has expired. Please request a new one.');
        } else if (errorMessage.toLowerCase().includes('invalid')) {
          setOtpError('Incorrect OTP. Please try again.');
        } else {
          setOtpError(errorMessage);
        }
      }
    } catch (error: any) {
      setOtpError(error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setOtpError(undefined);
    setDebugOtp(null);
    handleSendOtp();
  };

  const handleChangeEmail = () => {
    setStep('email');
    setOtp(['', '', '', '', '', '']);
    setOtpError(undefined);
    setDebugOtp(null);
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

        {step === 'email' ? (
          <>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Enter your email to get started
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Enter OTP
            </h1>
            <p className="text-muted-foreground">
              Verification code sent to
              <br />
              <span className="font-semibold text-foreground">{email}</span>
            </p>
          </>
        )}
      </div>

      {/* Form */}
      <div className="flex-1 px-6">
        {step === 'email' ? (
          <EmailInput
            email={email}
            onEmailChange={(value) => {
              setEmail(value);
              setEmailError(undefined);
            }}
            onSubmit={handleSendOtp}
            isLoading={isLoading}
            error={emailError}
          />
        ) : (
          <OtpInput
            otp={otp}
            onOtpChange={(newOtp) => {
              setOtp(newOtp);
              setOtpError(undefined);
            }}
            onSubmit={handleVerifyOtp}
            onResend={handleResendOtp}
            onChangeEmail={handleChangeEmail}
            email={email}
            isLoading={isLoading}
            resendTimer={resendTimer}
            error={otpError}
            debugOtp={debugOtp}
          />
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <p className="text-sm text-muted-foreground">
          By continuing, you agree to our{' '}
          <button className="text-primary font-medium hover:underline">
            Terms of Service
          </button>
          {' '}and{' '}
          <button className="text-primary font-medium hover:underline">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
