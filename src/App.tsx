
import React, { Suspense, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import AddFile from "./pages/AddFile";
import AddLink from "./pages/AddLink";
import AddCategory from "./pages/AddCategory";
import ANIPortal from "./pages/ANIPortal";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import FundingPage from "./pages/FundingPage";
import ProjectsPage from "./pages/ProjectsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportsPage from "./pages/ReportsPage";
import PoliciesPage from "./pages/PoliciesPage";
import PolicyDetailPage from "./pages/PolicyDetailPage";
import FrameworkDetailPage from "./pages/FrameworkDetailPage";
import VisualizationDetailPage from "./pages/VisualizationDetailPage";
import MetricDetailPage from "./pages/MetricDetailPage";
import PolicyGuidePage from "./pages/PolicyGuidePage";
import DatabaseQuery from '@/components/DatabaseQuery';
import SyntheticDataPage from '@/pages/SyntheticDataPage';

// Create a more robust QueryClient with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error("Query error:", error);
      }
    },
  },
});

// Fallback component for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-lg">Loading application...</p>
    </div>
  </div>
);

function App() {
  console.log("App component rendering");
  
  useEffect(() => {
    console.log("App component mounted");
    
    return () => {
      console.log("App component unmounting");
    };
  }, []);
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/portal" replace />} />
                <Route path="/portal" element={<ANIPortal />} />
                <Route path="/legacy" element={<Index />} />
                <Route path="/add-file" element={<AddFile />} />
                <Route path="/add-link" element={<AddLink />} />
                <Route path="/add-category" element={<AddCategory />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/funding" element={<FundingPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/reports/:reportId" element={<ReportsPage />} />
                <Route path="/policies" element={<PoliciesPage />} />
                <Route path="/policies/:policyId" element={<PolicyDetailPage />} />
                <Route path="/frameworks/:frameworkId" element={<FrameworkDetailPage />} />
                <Route path="/visualization/:category/:chartType/:chartId" element={<VisualizationDetailPage />} />
                <Route path="/metrics/:metricId" element={<MetricDetailPage />} />
                <Route path="/policy-guide" element={<PolicyGuidePage />} />
                <Route path="/database-info" element={<DatabaseQuery />} />
                <Route path="/synthetic-data" element={<SyntheticDataPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
