import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Megaphone, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

type Role = 'teacher' | 'influencer';

interface RoleOption {
  id: Role;
  title: string;
  description: string;
  icon: typeof GraduationCap;
}

const roleOptions: RoleOption[] = [
  {
    id: 'teacher',
    title: 'Teacher',
    description: 'I take classes and manage my teaching work',
    icon: GraduationCap,
  },
  {
    id: 'influencer',
    title: 'Influencer',
    description: 'I promote courses and earn via coupons',
    icon: Megaphone,
  },
];

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Check for pending user from OTP flow
        const pendingUser = sessionStorage.getItem('pendingUser');
        if (!pendingUser) {
          navigate('/login');
          return;
        }
      } else {
        // Check if user is already onboarded
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, onboarded')
          .eq('user_id', session.user.id)
          .single();

        if (profile?.onboarded && profile?.role) {
          navigate(`/${profile.role}`);
          return;
        }
      }
      
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [navigate]);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) {
      toast.error('Please select a role to continue');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Fallback: use pending user data
        const pendingUser = sessionStorage.getItem('pendingUser');
        if (pendingUser) {
          const userData = JSON.parse(pendingUser);
          // Store role locally and redirect
          sessionStorage.setItem('userRole', selectedRole);
          sessionStorage.removeItem('pendingUser');
          navigate(`/${selectedRole}`);
          return;
        }
        
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      // Save role via edge function
      const { data, error } = await supabase.functions.invoke('save-user-role', {
        body: { role: selectedRole }
      });

      if (error) throw error;

      if (data.success) {
        // CRITICAL: Refresh the profile in AuthContext before navigating
        // This ensures ProtectedRoute sees the updated onboarded/role state
        await refreshProfile();
        
        toast.success(`Welcome! You're now registered as a ${selectedRole}`);
        navigate(`/${selectedRole}`, { replace: true });
      } else {
        throw new Error(data.error || 'Failed to save role');
      }
    } catch (error: any) {
      console.error('Save role error:', error);
      toast.error(error.message || 'Failed to save your role');
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
          How do you use Adda247?
        </h1>
        <p className="text-muted-foreground text-lg">
          Select your role to personalize your experience
        </p>
      </div>

      {/* Role Options */}
      <div className="flex-1 px-6 space-y-4">
        {roleOptions.map((option, index) => {
          const Icon = option.icon;
          const isSelected = selectedRole === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleRoleSelect(option.id)}
              className={cn(
                'w-full p-6 rounded-2xl text-left transition-all duration-300 animate-slide-up',
                'border-2 active:scale-[0.98]',
                isSelected
                  ? 'bg-accent border-primary shadow-elevated'
                  : 'bg-card border-transparent shadow-card hover:shadow-elevated hover:border-border'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'p-4 rounded-xl transition-colors duration-300',
                  isSelected ? 'bg-primary' : 'bg-accent'
                )}>
                  <Icon className={cn(
                    'h-8 w-8 transition-colors duration-300',
                    isSelected ? 'text-primary-foreground' : 'text-primary'
                  )} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground">{option.title}</h3>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-primary animate-scale-in" />
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1">{option.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="px-6 py-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={handleContinue}
          disabled={!selectedRole || isLoading}
          className="w-full h-14 rounded-xl gradient-primary text-primary-foreground font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Continue'
          )}
        </button>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          You can change this later in settings
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;