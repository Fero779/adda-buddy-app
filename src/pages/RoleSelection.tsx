import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Phase 1: Teacher-only mode - auto-assign Teacher role
const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const pendingUser = sessionStorage.getItem('pendingUser');
        if (!pendingUser) {
          navigate('/login');
          return;
        }
      } else {
        // Check if user is already onboarded - redirect to teacher dashboard
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, onboarded')
          .eq('user_id', session.user.id)
          .single();

        if (profile?.onboarded) {
          navigate('/teacher');
          return;
        }
      }
      
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [navigate]);

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const pendingUser = sessionStorage.getItem('pendingUser');
        if (pendingUser) {
          sessionStorage.setItem('userRole', 'teacher');
          sessionStorage.removeItem('pendingUser');
          navigate('/teacher');
          return;
        }
        
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      // Phase 1: Always save as Teacher
      const { data, error } = await supabase.functions.invoke('save-user-role', {
        body: { role: 'teacher' }
      });

      if (error) throw error;

      if (data.success) {
        await refreshProfile();
        toast.success("Welcome! You're now registered as a Teacher");
        navigate('/teacher', { replace: true });
      } else {
        throw new Error(data.error || 'Failed to save role');
      }
    } catch (error: any) {
      console.error('Save role error:', error);
      toast.error(error.message || 'Failed to complete setup');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome, Teacher!
        </h1>
        <p className="text-muted-foreground text-lg">
          Let's set up your teaching dashboard
        </p>
      </div>

      {/* Teacher Role Confirmation */}
      <div className="flex-1 px-6">
        <div className="p-6 rounded-2xl bg-accent border-2 border-primary shadow-elevated animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-xl bg-primary">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-foreground">Teacher</h3>
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <p className="text-muted-foreground mt-1">
                Manage your classes, track performance, and grow your teaching career
              </p>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-foreground">What you can do:</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-card shadow-card">
              <p className="text-sm text-foreground font-medium">📚 View Classes</p>
              <p className="text-xs text-muted-foreground">Today, upcoming & past</p>
            </div>
            <div className="p-3 rounded-xl bg-card shadow-card">
              <p className="text-sm text-foreground font-medium">📊 Performance</p>
              <p className="text-xs text-muted-foreground">Ratings & metrics</p>
            </div>
            <div className="p-3 rounded-xl bg-card shadow-card">
              <p className="text-sm text-foreground font-medium">📱 QR Login</p>
              <p className="text-xs text-muted-foreground">Access PC dashboard</p>
            </div>
            <div className="p-3 rounded-xl bg-card shadow-card">
              <p className="text-sm text-foreground font-medium">🎥 Studio App</p>
              <p className="text-xs text-muted-foreground">Quick class setup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-6 py-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={handleContinue}
          disabled={isLoading}
          className="w-full h-14 rounded-xl gradient-primary text-primary-foreground font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Get Started'
          )}
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
