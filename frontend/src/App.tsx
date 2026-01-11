import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProfileCompletionModal } from "@/components/ProfileCompletionModal";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import BuildGenome from "./pages/BuildGenome";
import HowItWorks from "./pages/HowItWorks";
import Auth from "./pages/Auth";
import Interview from "./pages/Interview";
import TechnicalInterview from "./pages/TechnicalInterview";
import CompleteProfile from "./pages/CompleteProfile";
import TaskDetail from "./pages/TaskDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper component to handle profile completion modal
const AppContent = () => {
  const { user, isProfileComplete, loading, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Show modal when user is logged in but profile is incomplete
  useEffect(() => {
    if (!loading && user && profile && !isProfileComplete) {
      // Don't show modal on auth or complete-profile pages
      if (location.pathname !== "/auth" && location.pathname !== "/complete-profile") {
        setShowProfileModal(true);
      }
    } else {
      setShowProfileModal(false);
    }
  }, [user, isProfileComplete, loading, profile, location.pathname]);

  const handleCompleteProfile = () => {
    setShowProfileModal(false);
    navigate("/complete-profile");
  };

  return (
    <>
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onComplete={handleCompleteProfile}
        userName={profile?.full_name?.split(" ")[0] || "there"}
      />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/build" element={<BuildGenome />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/interview/technical" element={<TechnicalInterview />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:taskId" element={<TaskDetail />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;


