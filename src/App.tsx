import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { Navbar } from "@/components/Navbar";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import NotFound from "@/pages/NotFound";
import { AnimatePresence } from "framer-motion";
import { InitialLoader } from "@/components/InitialLoader";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => {
  // Verificăm DIRECT la pornirea aplicației dacă rulăm un test. 
  // Dacă da, pornim cu isLoading pe FALSE, deci loader-ul NU va fi randat absolut deloc (zero delay).
  const [isLoading, setIsLoading] = useState(() => {
    return sessionStorage.getItem("skipLoader") !== "true";
  });

  // Ascultăm evenimentul pentru toggle day/night mode
  useEffect(() => {
    const handleTriggerLoader = () => {
      setIsLoading(true);
    };

    window.addEventListener("triggerLoader", handleTriggerLoader);
    return () => window.removeEventListener("triggerLoader", handleTriggerLoader);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SubscriptionProvider>

              <AnimatePresence>
                {isLoading && (
                  <InitialLoader onComplete={() => setIsLoading(false)} />
                )}
              </AnimatePresence>

              <Navbar />
              <AppRoutes />

            </SubscriptionProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;