
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import AddFile from "./pages/AddFile";
import AddLink from "./pages/AddLink";
import AddCategory from "./pages/AddCategory";
import ANIPortal from "./pages/ANIPortal";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import FundingPage from "./pages/FundingPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportsPage from "./pages/ReportsPage";
import PoliciesPage from "./pages/PoliciesPage";
import PolicyDetailPage from "./pages/PolicyDetailPage";
import FrameworkDetailPage from "./pages/FrameworkDetailPage";
import VisualizationDetailPage from "./pages/VisualizationDetailPage";
import MetricDetailPage from "./pages/MetricDetailPage";
import PolicyGuidePage from "./pages/PolicyGuidePage";
import DatabasePage from "./pages/DatabasePage";
import SyntheticDataPage from "./pages/SyntheticDataPage";
import DocumentDetailPage from "./pages/DocumentDetailPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<ANIPortal />} />
                  <Route path="/legacy" element={<Index />} />
                  <Route path="/add-file" element={<AddFile />} />
                  <Route path="/add-link" element={<AddLink />} />
                  <Route path="/add-category" element={<AddCategory />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/funding" element={<FundingPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/policies" element={<PoliciesPage />} />
                  <Route path="/database" element={<DatabasePage />} />
                  <Route path="/documents/:documentId" element={<DocumentDetailPage />} />
                  <Route path="/synthetic-data" element={<SyntheticDataPage />} />
                  <Route path="/policies/:policyId" element={<PolicyDetailPage />} />
                  <Route path="/frameworks/:frameworkId" element={<FrameworkDetailPage />} />
                  <Route path="/visualization/:category/:chartType/:chartId" element={<VisualizationDetailPage />} />
                  <Route path="/metrics/:metricId" element={<MetricDetailPage />} />
                  <Route path="/policy-guide" element={<PolicyGuidePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </LanguageProvider>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
