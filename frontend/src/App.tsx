import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
import SkillGenomeReport from "./pages/SkillGenomeReport";
import GrowthRoadmap from "./pages/GrowthRoadmap";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import PageTransition from "@/components/PageTransition";

const queryClient = new QueryClient();

// Wrapper component to handle profile completion modal
const AppContent = () => {
  const { user, isProfileComplete, loading, profileLoading, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Show modal when user is logged in but profile is incomplete OR not created yet
  useEffect(() => {
    // Wait for both auth and profile to be fully loaded before showing modal
    if (!loading && !profileLoading && user) {
      // Show modal if profile doesn't exist yet OR profile exists but not completed
      const shouldShowModal = !profile || !isProfileComplete;
      // Don't show modal on auth or complete-profile pages
      if (shouldShowModal && location.pathname !== "/auth" && location.pathname !== "/complete-profile") {
        setShowProfileModal(true);
      } else {
        setShowProfileModal(false);
      }
    } else {
      setShowProfileModal(false);
    }
  }, [user, isProfileComplete, loading, profileLoading, profile, location.pathname]);

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
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/build" element={<PageTransition><BuildGenome /></PageTransition>} />
          <Route path="/how-it-works" element={<PageTransition><HowItWorks /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/interview" element={<PageTransition><Interview /></PageTransition>} />
          <Route path="/interview/technical" element={<PageTransition><TechnicalInterview /></PageTransition>} />
          <Route path="/tasks" element={<PageTransition><Tasks /></PageTransition>} />
          <Route path="/tasks/:taskId" element={<PageTransition><TaskDetail /></PageTransition>} />
          <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/complete-profile" element={<PageTransition><CompleteProfile /></PageTransition>} />
          <Route path="/skill-genome-report" element={<PageTransition><SkillGenomeReport /></PageTransition>} />
          <Route path="/growth-roadmap" element={<PageTransition><GrowthRoadmap /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
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


