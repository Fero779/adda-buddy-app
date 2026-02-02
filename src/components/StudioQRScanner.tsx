import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, CheckCircle, XCircle, Loader2, X, QrCode, Keyboard, Monitor } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StudioQRScannerProps {
  classId: string;
  className: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const StudioQRScanner: React.FC<StudioQRScannerProps> = ({ 
  classId, 
  className, 
  onClose, 
  onSuccess 
}) => {
  const [status, setStatus] = useState<'scanning' | 'manual' | 'verifying' | 'success' | 'error'>('scanning');
  const [errorMessage, setErrorMessage] = useState('');
  const [manualCode, setManualCode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera
  useEffect(() => {
    if (status !== 'scanning') return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Camera error:', error);
        toast.error('Unable to access camera. Use manual entry instead.');
        setStatus('manual');
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [status]);

  // Scan for QR codes
  useEffect(() => {
    if (status !== 'scanning') return;

    const scanInterval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        // Use BarcodeDetector API if available
        if ('BarcodeDetector' in window) {
          const barcodeDetector = new (window as any).BarcodeDetector({
            formats: ['qr_code']
          });
          const barcodes = await barcodeDetector.detect(canvas);
          
          if (barcodes.length > 0) {
            handleQRData(barcodes[0].rawValue);
          }
        }
      } catch (error) {
        console.log('QR detection not available, use manual entry');
      }
    }, 500);

    return () => clearInterval(scanInterval);
  }, [status]);

  const handleQRData = async (rawData: string) => {
    try {
      const qrData = JSON.parse(rawData);
      
      if (!qrData.studio_session_id || !qrData.session_token) {
        throw new Error('Invalid QR code format');
      }

      await verifyQR(qrData);
    } catch (error) {
      console.error('QR parse error:', error);
      setErrorMessage('Invalid QR code. Please scan a Studio App QR.');
      setStatus('error');
    }
  };

  const verifyQR = async (qrData: { studio_session_id: string; session_token: string; class_id?: string }) => {
    setStatus('verifying');

    try {
      const { data, error } = await supabase.functions.invoke('verify-studio-qr', {
        body: {
          studio_session_id: qrData.studio_session_id,
          session_token: qrData.session_token,
          class_id: classId, // Validate against current class
        },
      });

      if (error || !data?.success) {
        throw new Error(data?.error || 'Verification failed');
      }

      setStatus('success');
      toast.success('Studio App connected!');
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error: any) {
      console.error('Verification error:', error);
      setErrorMessage(error.message || 'Failed to verify QR code');
      setStatus('error');
    }
  };

  const handleManualSubmit = async () => {
    if (!manualCode.trim()) {
      toast.error('Please enter the QR code data');
      return;
    }

    try {
      const qrData = JSON.parse(manualCode);
      await verifyQR(qrData);
    } catch (error) {
      toast.error('Invalid code format');
    }
  };

  const resetScanner = () => {
    setStatus('scanning');
    setErrorMessage('');
    setManualCode('');
  };

  const renderContent = () => {
    switch (status) {
      case 'scanning':
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-primary rounded-lg" />
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Point your camera at the QR code on the Studio App panel
            </p>

            <Button
              variant="outline"
              onClick={() => setStatus('manual')}
              className="gap-2"
            >
              <Keyboard className="h-4 w-4" />
              Enter Code Manually
            </Button>
          </div>
        );

      case 'manual':
        return (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center py-8">
              <Monitor className="h-16 w-16 text-muted-foreground" />
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Copy the QR code data from the Studio App panel and paste it below
            </p>

            <Input
              placeholder="Paste QR code data here..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="font-mono text-xs"
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStatus('scanning')}
                className="flex-1 gap-2"
              >
                <Camera className="h-4 w-4" />
                Use Camera
              </Button>
              <Button
                onClick={handleManualSubmit}
                className="flex-1"
              >
                Verify
              </Button>
            </div>
          </div>
        );

      case 'verifying':
        return (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Connecting to Studio App...</p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-success">Studio App Connected!</h3>
            <p className="text-sm text-muted-foreground text-center">
              You can now use polls and PDF uploads in your class
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold">Connection Failed</h3>
            <p className="text-sm text-muted-foreground text-center">
              {errorMessage}
            </p>
            <Button onClick={resetScanner} className="gap-2">
              Try Again
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
            <Monitor className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-center">Login Studio App</CardTitle>
          <CardDescription className="text-center">
            <span className="font-medium text-foreground">{className}</span>
            <br />
            Scan QR to enable polls & PDF uploads
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};
