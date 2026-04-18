import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

import LandingPage from "./pages/LandingPage";
import ProducerLoginPage from "./pages/ProducerLoginPage";
import ConsumerLoginPage from "./pages/ConsumerLoginPage";
import AuthCallback from "./pages/AuthCallback";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import ProducerDashboard from "./pages/ProducerDashboard";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import SentimentPipeline from "./pages/SentimentPipeline";
import DownloadableReports from "./pages/DownloadableReports";
import MultilingualOverview from "./pages/MultilingualOverview";
import ProductHealthScores from "./pages/ProductHealthScores";
import CategoryComparison from "./pages/CategoryComparison";
import AnomalyAlerts from "./pages/AnomalyAlerts";
import GeoSalesHeatmap from "./pages/GeoSalesHeatmap";
import AffiliateCommunity from "./pages/AffiliateCommunity";
import ConsumerChatbot from "./pages/ConsumerChatbot";
import ReviewExplorer from "./pages/ReviewExplorer";
import PersonalizedLabels from "./pages/PersonalizedLabels";
import SentimentTrends from "./pages/SentimentTrends";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

import { ProducerLayout } from "@/components/sellezy/ProducerLayout";
import { ConsumerLayout } from "@/components/sellezy/ConsumerLayout";
import InteractiveNeuralVortex from "@/components/ui/InteractiveNeuralVortex";

const ProducerShell = () => <ProducerLayout />;
const ConsumerShell = () => <ConsumerLayout />;

const AnimatedRoutes = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  
  return (
    <>
      <InteractiveNeuralVortex opacity={isLanding ? 0.6 : 0.25} className="transition-opacity duration-1000" />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname.split("/")[1] || "root"}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/producer" element={<ProducerLoginPage />} />
        <Route path="/login/consumer" element={<ConsumerLoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/home" element={<HomePage />} />
        
        {/* Producer */}
        <Route path="/producer" element={<ProducerShell />}>
          <Route path="dashboard" element={<ProducerDashboard />} />
          <Route path="sentiment" element={<SentimentPipeline />} />
          <Route path="reports" element={<DownloadableReports />} />
          <Route path="multilingual" element={<MultilingualOverview />} />
          <Route path="health" element={<ProductHealthScores />} />
          <Route path="category" element={<CategoryComparison />} />
          <Route path="anomaly" element={<AnomalyAlerts />} />
          <Route path="heatmap" element={<GeoSalesHeatmap />} />
          <Route path="community" element={<AffiliateCommunity />} />
        </Route>

        {/* Consumer */}
        <Route path="/consumer" element={<ConsumerShell />}>
          <Route path="dashboard" element={<ConsumerDashboard />} />
          <Route path="chatbot" element={<ConsumerChatbot />} />
          <Route path="reviews/:category" element={<ReviewExplorer />} />
          <Route path="labels" element={<PersonalizedLabels />} />
          <Route path="trends" element={<SentimentTrends />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
