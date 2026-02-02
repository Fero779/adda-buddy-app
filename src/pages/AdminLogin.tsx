import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, RefreshCw, CheckCircle, XCircle, Loader2, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

interface QRData {
  admin_session_id: string;
  pc_id: string;
  session_token: string;
  expires_at: string;
}

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'pending' | 'active' | 'expired' | 'error'>('loading');
  const [timeLeft, setTimeLeft] = useState(60);
  const [userProfile, setUserProfile] = useState<any>(null);

  const generateQR = useCallback(async () => {
    setStatus('loading');
    setQrData(null);
    setTimeLeft(60);

    try {
      const { data, error } = await supabase.functions.invoke('generate-admin-qr');

      if (error || !data?.success) {
        throw new Error(data?.error || 'Failed to generate QR code');
      }

      setQrData(data.qr_data);
      setSessionId(data.session_id);
      setStatus('pending');
    } catch (error: any) {
      console.error('QR generation error:', error);
      toast.error('Failed to generate QR code');
      setStatus('error');
    }
  }, []);

  // Generate QR on mount
  useEffect(() => {
    generateQR();
  }, [generateQR]);

  // Countdown timer
  useEffect(() => {
    if (status !== 'pending' || !qrData) return;

    const timer = setInterval(() => {
      const expiresAt = new Date(qrData.expires_at).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        setStatus('expired');
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [status, qrData]);

  // Poll for session activation
  useEffect(() => {
    if (status !== 'pending' || !sessionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-admin-session', {
          body: { session_id: sessionId },
        });

        if (error) {
          console.error('Poll error:', error);
          return;
        }

        if (data?.status === 'active') {
          setStatus('active');
          setUserProfile(data.profile);
          toast.success('Login successful!');
          clearInterval(pollInterval);
          
          // Redirect based on role after short delay
          setTimeout(() => {
            const role = data.profile?.role || 'teacher';
            navigate(`/${role}`);
          }, 2000);
        } else if (data?.status === 'expired') {
          setStatus('expired');
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Poll error:', error);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [status, sessionId, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating QR code...</p>
          </div>
        );

      case 'pending':
        return (
          <div className="flex flex-col items-center gap-6">
            {/* QR Code */}
            <div className="bg-white p-4 rounded-xl shadow-inner">
              {qrData && (
                <QRCodeSVG
                  value={JSON.stringify(qrData)}
                  size={200}
                  level="H"
                  includeMargin
                />
              )}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2">
              <div className={`text-2xl font-bold tabular-nums ${timeLeft <= 10 ? 'text-destructive' : 'text-foreground'}`}>
                {timeLeft}s
              </div>
              <span className="text-muted-foreground">remaining</span>
            </div>

            {/* Instructions */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Smartphone className="h-5 w-5" />
                <span className="font-medium">Scan with your mobile app</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Open the Adda247 Partner app on your phone and tap "Scan QR to Login PC"
              </p>
            </div>
          </div>
        );

      case 'active':
        return (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-success">Login Successful!</h3>
            {userProfile && (
              <p className="text-muted-foreground">
                Welcome, {userProfile.name || userProfile.phone}
              </p>
            )}
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </div>
        );

      case 'expired':
        return (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold">QR Code Expired</h3>
            <p className="text-sm text-muted-foreground text-center">
              The QR code has expired. Generate a new one to continue.
            </p>
            <Button onClick={generateQR} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Generate New QR
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold">Something went wrong</h3>
            <p className="text-sm text-muted-foreground text-center">
              Unable to generate QR code. Please try again.
            </p>
            <Button onClick={generateQR} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-4">
            <Monitor className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">PC Login</CardTitle>
          <CardDescription>
            Scan the QR code with your mobile app to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
