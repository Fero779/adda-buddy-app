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
import AdminLogin from "./pages/AdminLogin";

// Teacher Pages (Phase 1: Teacher-only mode)
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherPerformance from "./pages/teacher/TeacherPerformance";
import TeacherProfile from "./pages/teacher/TeacherProfile";

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

// Phase 1: Teacher-only protected route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not onboarded
  if (!profile?.onboarded) {
    return <Navigate to="/role-selection" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Already logged in and onboarded - redirect to teacher dashboard
  if (user && profile?.onboarded) {
    return <Navigate to="/teacher" replace />;
  }

  // Logged in but not onboarded - redirect to role selection
  if (user && !profile?.onboarded) {
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
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Semi-protected: needs auth but not role */}
      <Route path="/role-selection" element={<RoleSelection />} />

      {/* Teacher Routes - Phase 1: Teacher-only mode */}
      <Route path="/teacher" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/classes" element={<ProtectedRoute><TeacherClasses /></ProtectedRoute>} />
      <Route path="/teacher/performance" element={<ProtectedRoute><TeacherPerformance /></ProtectedRoute>} />
      <Route path="/teacher/profile" element={<ProtectedRoute><TeacherProfile /></ProtectedRoute>} />

      {/* Phase 1: Influencer routes redirect to Teacher */}
      <Route path="/influencer" element={<Navigate to="/teacher" replace />} />
      <Route path="/influencer/*" element={<Navigate to="/teacher" replace />} />

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
