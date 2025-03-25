
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
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { DataVisualization } from "@/components/DataVisualization";
import { useVisualization } from "@/hooks/useVisualization";
import DatabaseQuery from "@/components/DatabaseQuery";
import SyntheticDataPage from "./SyntheticDataPage";

const ANIPortal = () => {
  console.log("ANIPortal component rendering");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { showVisualization, visualizationData, setShowVisualization } = useVisualization();

  useEffect(() => {
    console.log("ANIPortal component mounted, checking auth state");
    
    // Check initial auth state with error handling
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          toast({
            title: "Authentication Error",
            description: "Failed to check authentication state. Using default.",
            variant: "destructive",
          });
        }
        
        setIsAuthenticated(!!data.session);
      } catch (err) {
        console.error("Unexpected auth error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();

    // Subscribe to auth changes with error handling
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log("Auth state changed:", _event);
        setIsAuthenticated(!!session);
      });

      return () => {
        console.log("ANIPortal component unmounting, unsubscribing from auth");
        subscription?.unsubscribe();
      };
    } catch (err) {
      console.error("Error setting up auth subscription:", err);
      return () => {}; // Empty cleanup function
    }
  }, [toast]);

  const handleCloseVisualization = () => {
    setShowVisualization(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-grow max-w-[calc(100%-36rem)] overflow-auto bg-gray-50">
          <Tabs defaultValue="dashboard" className="h-full">
            <div className="container mx-auto py-4 flex justify-between items-center">
              <TabsList className="overflow-x-auto">
                <TabsTrigger value="dashboard">{t('dashboard.tab')}</TabsTrigger>
                <TabsTrigger value="funding">{t('funding.tab')}</TabsTrigger>
                <TabsTrigger value="projects">{t('projects.tab')}</TabsTrigger>
                <TabsTrigger value="analytics">{t('analytics.tab')}</TabsTrigger>
                <TabsTrigger value="reports">{t('reports.tab')}</TabsTrigger>
                <TabsTrigger value="policies">{t('policies.tab')}</TabsTrigger>
                <TabsTrigger value="database">Consulta BD</TabsTrigger>
                <TabsTrigger value="synthetic">Dados Sintéticos</TabsTrigger>
              </TabsList>
              
              <div className="md:hidden">
                <HamburgerMenu />
              </div>
            </div>
            
            {showVisualization && visualizationData && visualizationData.length > 0 && (
              <div className="container mx-auto px-4 pt-4">
                <DataVisualization 
                  data={visualizationData} 
                  onClose={handleCloseVisualization}
                />
              </div>
            )}
            
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
            
            <TabsContent value="database" className="h-full">
              <DatabaseQuery />
            </TabsContent>
            
            <TabsContent value="synthetic" className="h-full">
              <SyntheticDataPage />
            </TabsContent>
          </Tabs>
        </main>
        
        <div className="w-144 border-l flex flex-col bg-white">
          <div className="p-3 border-b flex justify-between items-center bg-gray-50">
            <h3 className="font-medium flex items-center gap-2">
              {t('assistant.title')}
            </h3>
          </div>
          <div className="flex-1 overflow-hidden">
            <AIAssistant />
          </div>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default ANIPortal;
