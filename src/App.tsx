import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";

// Pages
import Onboarding from "./pages/Onboarding";
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

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'teacher' | 'influencer' }> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isOnboarded } = useUser();
  
  if (!isOnboarded || !user) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isOnboarded, user } = useUser();

  return (
    <Routes>
      {/* Onboarding / Landing */}
      <Route 
        path="/" 
        element={
          isOnboarded && user ? (
            <Navigate to={`/${user.role}`} replace />
          ) : (
            <Onboarding />
          )
        } 
      />

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
      <UserProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
