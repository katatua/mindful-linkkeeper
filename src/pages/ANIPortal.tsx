
import { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";
import { AIAssistant } from "@/components/AIAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import FundingPage from "./FundingPage";
import ProjectsPage from "./ProjectsPage";
import AnalyticsPage from "./AnalyticsPage";
import ReportsPage from "./ReportsPage";
import PoliciesPage from "./PoliciesPage";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { X, MessageCircle } from "lucide-react";

const ANIPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAssistantMinimized, setIsAssistantMinimized] = useState(false);
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

  const toggleAssistant = () => {
    setIsAssistantMinimized(!isAssistantMinimized);
  };

  return (
    <div className="h-screen flex flex-col">
      <main className="flex-grow overflow-auto bg-gray-50">
        <Tabs defaultValue="dashboard" className="h-full">
          <div className="container mx-auto py-4">
            <TabsList>
              <TabsTrigger value="dashboard">{t('dashboard.tab')}</TabsTrigger>
              <TabsTrigger value="funding">{t('funding.tab')}</TabsTrigger>
              <TabsTrigger value="projects">{t('projects.tab')}</TabsTrigger>
              <TabsTrigger value="analytics">{t('analytics.tab')}</TabsTrigger>
              <TabsTrigger value="reports">{t('reports.tab')}</TabsTrigger>
              <TabsTrigger value="policies">{t('policies.tab')}</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="dashboard" className="h-full">
            <Dashboard />
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
        </Tabs>
      </main>
      
      {isAssistantMinimized ? (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-md z-50"
          onClick={toggleAssistant}
          aria-label={t('assistant.maximize')}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <div className="w-96 border-l flex flex-col bg-white fixed top-14 right-0 bottom-0 z-40 shadow-md transition-all duration-300">
          <div className="p-3 border-b flex justify-between items-center bg-gray-50">
            <h3 className="font-medium flex items-center gap-2">
              {t('assistant.title')}
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleAssistant}
              aria-label={t('assistant.minimize')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <AIAssistant />
          </div>
        </div>
      )}
      
      <Toaster />
    </div>
  );
};

export default ANIPortal;
