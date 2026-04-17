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

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/producer" element={<ProducerLoginPage />} />
        <Route path="/login/consumer" element={<ConsumerLoginPage />} />
        <Route path="/home" element={<HomePage />} />
        {/* Producer */}
        <Route path="/producer/dashboard" element={<ProducerDashboard />} />
        <Route path="/producer/sentiment" element={<SentimentPipeline />} />
        <Route path="/producer/reports" element={<DownloadableReports />} />
        <Route path="/producer/multilingual" element={<MultilingualOverview />} />
        <Route path="/producer/health" element={<ProductHealthScores />} />
        <Route path="/producer/category" element={<CategoryComparison />} />
        <Route path="/producer/anomaly" element={<AnomalyAlerts />} />
        <Route path="/producer/heatmap" element={<GeoSalesHeatmap />} />
        <Route path="/producer/community" element={<AffiliateCommunity />} />
        {/* Consumer */}
        <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
        <Route path="/consumer/chatbot" element={<ConsumerChatbot />} />
        <Route path="/consumer/reviews/:category" element={<ReviewExplorer />} />
        <Route path="/consumer/labels" element={<PersonalizedLabels />} />
        <Route path="/consumer/trends" element={<SentimentTrends />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
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
