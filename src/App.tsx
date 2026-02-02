import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

// Pages
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import NotFound from "./pages/NotFound";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherEarnings from "./pages/teacher/TeacherEarnings";
import TeacherProfile from "./pages/teacher/TeacherProfile";

// Influencer Pages
import InfluencerDashboard from "./pages/influencer/InfluencerDashboard";
import InfluencerReferrals from "./pages/influencer/InfluencerReferrals";
import InfluencerEarnings from "./pages/influencer/InfluencerEarnings";
import InfluencerProfile from "./pages/influencer/InfluencerProfile";

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center animate-pulse">
        <span className="text-3xl font-black text-primary-foreground">A</span>
      </div>
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  </div>
);

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  requiredRole?: 'teacher' | 'influencer' 
}> = ({ children, requiredRole }) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not onboarded
  if (!profile?.onboarded || !profile?.role) {
    return <Navigate to="/role-selection" replace />;
  }

  // Check role requirement
  if (requiredRole && profile.role !== requiredRole) {
    return <Navigate to={`/${profile.role}`} replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Already logged in and onboarded - redirect to dashboard
  if (user && profile?.onboarded && profile?.role) {
    return <Navigate to={`/${profile.role}`} replace />;
  }

  // Logged in but not onboarded - redirect to role selection
  if (user && (!profile?.onboarded || !profile?.role)) {
    return <Navigate to="/role-selection" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      
      {/* Semi-protected: needs auth but not role */}
      <Route path="/role-selection" element={<RoleSelection />} />

      {/* Teacher Routes */}
      <Route path="/teacher" element={<ProtectedRoute requiredRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/classes" element={<ProtectedRoute requiredRole="teacher"><TeacherClasses /></ProtectedRoute>} />
      <Route path="/teacher/earnings" element={<ProtectedRoute requiredRole="teacher"><TeacherEarnings /></ProtectedRoute>} />
      <Route path="/teacher/profile" element={<ProtectedRoute requiredRole="teacher"><TeacherProfile /></ProtectedRoute>} />

      {/* Influencer Routes */}
      <Route path="/influencer" element={<ProtectedRoute requiredRole="influencer"><InfluencerDashboard /></ProtectedRoute>} />
      <Route path="/influencer/referrals" element={<ProtectedRoute requiredRole="influencer"><InfluencerReferrals /></ProtectedRoute>} />
      <Route path="/influencer/earnings" element={<ProtectedRoute requiredRole="influencer"><InfluencerEarnings /></ProtectedRoute>} />
      <Route path="/influencer/profile" element={<ProtectedRoute requiredRole="influencer"><InfluencerProfile /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;