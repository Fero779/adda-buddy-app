import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { GraduationCap, Megaphone, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleCardProps {
  title: string;
  description: string;
  icon: typeof GraduationCap;
  onClick: () => void;
  delay?: string;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, description, icon: Icon, onClick, delay }) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full p-6 rounded-2xl bg-card shadow-card border-2 border-transparent',
      'hover:border-primary hover:shadow-elevated transition-all duration-300',
      'active:scale-[0.98] text-left group animate-slide-up'
    )}
    style={{ animationDelay: delay }}
  >
    <div className="flex items-start gap-4">
      <div className="p-4 rounded-xl bg-accent group-hover:bg-primary transition-colors duration-300">
        <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-foreground mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
      <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 mt-4" />
    </div>
  </button>
);

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { setRole, completeOnboarding, setUser } = useUser();

  const handleRoleSelect = (role: 'teacher' | 'influencer') => {
    setUser({
      id: '1',
      name: role === 'teacher' ? 'Rahul Sharma' : 'Priya Singh',
      email: `${role}@adda247.com`,
      role,
    });
    setRole(role);
    completeOnboarding();
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Section */}
      <div className="px-6 pt-12 pb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-2xl font-black text-primary-foreground">A</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground">Adda247</h2>
            <p className="text-sm text-muted-foreground">Partner App</p>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Choose your role to get started
        </p>
      </div>

      {/* Role Selection */}
      <div className="flex-1 px-6 space-y-4">
        <RoleCard
          title="I'm a Teacher"
          description="Manage your classes, track students, and view your earnings all in one place"
          icon={GraduationCap}
          onClick={() => handleRoleSelect('teacher')}
          delay="0.1s"
        />
        
        <RoleCard
          title="I'm an Influencer"
          description="Track your referrals, monitor conversions, and maximize your commissions"
          icon={Megaphone}
          onClick={() => handleRoleSelect('influencer')}
          delay="0.2s"
        />
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

export default Onboarding;
