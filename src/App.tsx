
import React from 'react';
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

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log("App component rendering");
  
  return (
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
  );
}

export default App;
