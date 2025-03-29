import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SidebarProvider } from '@/contexts/SidebarContext';

// Layout
import { Layout } from '@/components/Layout';

// Pages
import Index from '@/pages/Index';
import ANIPortal from '@/pages/ANIPortal';
import AIReportDetail from '@/pages/AIReportDetail';

// Lazy-loaded pages
const Auth = lazy(() => import('@/pages/Auth'));
const Dashboard = lazy(() => import('@/components/Dashboard').then(module => ({ default: module.Dashboard })));
const FundingPage = lazy(() => import('@/pages/FundingPage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const PoliciesPage = lazy(() => import('@/pages/PoliciesPage'));
const AIAssistant = lazy(() => import('@/components/AIAssistant').then(module => ({ default: module.AIAssistant })));
const ReportDetailPage = lazy(() => import('@/pages/ReportDetailPage'));

function App() {
  return (
    <LanguageProvider>
      <SidebarProvider>
        <Router>
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/portal" element={<ANIPortal />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Layout><Outlet /></Layout>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/funding" element={<FundingPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/ai-report/:id" element={<AIReportDetail />} />
                <Route path="/reports/ai/:id" element={<AIReportDetail />} />
                <Route path="/report/:reportId" element={<ReportDetailPage />} />
                <Route path="/policies" element={<PoliciesPage />} />
                <Route path="/assistant" element={<AIAssistant />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </SidebarProvider>
    </LanguageProvider>
  );
}

export default App;
