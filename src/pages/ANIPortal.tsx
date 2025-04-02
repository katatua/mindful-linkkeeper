
import { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FundingPage from "./FundingPage";
import ProjectsPage from "./ProjectsPage";
import AnalyticsPage from "./AnalyticsPage";
import ReportsPage from "./ReportsPage";
import PoliciesPage from "./PoliciesPage";
import PredictiveModelsPage from "./PredictiveModelsPage";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { AIAssistant } from "@/components/AIAssistant";

const ANIPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <main className="flex-grow overflow-auto bg-gray-50">
        <Tabs defaultValue="dashboard" className="h-full">
          <div className="container mx-auto py-4">
            <TabsList>
              <TabsTrigger value="dashboard">{t('dashboard.tab')}</TabsTrigger>
              <TabsTrigger value="assistente">{t('assistant')}</TabsTrigger>
              <TabsTrigger value="funding">{t('funding.tab')}</TabsTrigger>
              <TabsTrigger value="projects">{t('projects.tab')}</TabsTrigger>
              <TabsTrigger value="analytics">{t('analytics.tab')}</TabsTrigger>
              <TabsTrigger value="reports">{t('reports.tab')}</TabsTrigger>
              <TabsTrigger value="policies">{t('policies.tab')}</TabsTrigger>
              <TabsTrigger value="predictive">{t('predictive_models.tab') || "Predictive Models"}</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="dashboard" className="h-full">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="assistente" className="h-full">
            <AIAssistant />
          </TabsContent>
          
          <TabsContent value="funding" className="h-full">
            <FundingPage />
          </TabsContent>
          
          <TabsContent value="projects" className="h-full">
            <ProjectsPage />
          </TabsContent>
          
          <TabsContent value="analytics" className="h-full">
            <AnalyticsPage />
          </TabsContent>
          
          <TabsContent value="reports" className="h-full">
            <ReportsPage />
          </TabsContent>
          
          <TabsContent value="policies" className="h-full">
            <PoliciesPage />
          </TabsContent>
          
          <TabsContent value="predictive" className="h-full">
            <PredictiveModelsPage />
          </TabsContent>
        </Tabs>
      </main>
      
      <Toaster />
    </div>
  );
};

export default ANIPortal;
