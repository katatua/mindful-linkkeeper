
import { useState, useEffect, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { X, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ANIPortal = () => {
  const [showAssistant, setShowAssistant] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { showVisualization, visualizationData, setShowVisualization } = useVisualization();
  const { isLoggedIn } = useAuth();

  const handleCloseVisualization = useCallback(() => {
    setShowVisualization(false);
  }, [setShowVisualization]);
  
  const toggleAssistant = useCallback(() => {
    setShowAssistant(prev => !prev);
  }, []);

  // This effect ensures we only run the necessary operations once
  useEffect(() => {
    // No need to check auth state here since it's handled in AuthContext
    
    // Add any cleanup operations needed for this component
    return () => {
      // Cleanup code if needed
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <main className={`flex-grow ${showAssistant ? 'max-w-[calc(100%-36rem)]' : 'max-w-full'} overflow-auto bg-gray-50 transition-all duration-300`}>
          <Tabs defaultValue="dashboard" className="h-full">
            <div className="container mx-auto py-4 flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="dashboard">{t('dashboard.tab')}</TabsTrigger>
                <TabsTrigger value="funding">{t('funding.tab')}</TabsTrigger>
                <TabsTrigger value="projects">{t('projects.tab')}</TabsTrigger>
                <TabsTrigger value="analytics">{t('analytics.tab')}</TabsTrigger>
                <TabsTrigger value="reports">{t('reports.tab')}</TabsTrigger>
                <TabsTrigger value="policies">{t('policies.tab')}</TabsTrigger>
                <TabsTrigger value="database">Consulta BD</TabsTrigger>
                <TabsTrigger value="synthetic">Dados Sintéticos</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                {!showAssistant && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1" 
                    onClick={toggleAssistant}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{t('assistant.show')}</span>
                  </Button>
                )}
                <div className="md:hidden">
                  <HamburgerMenu />
                </div>
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
        
        {showAssistant && (
          <div className="w-144 border-l flex flex-col bg-white transition-all duration-300">
            <div className="p-3 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-medium flex items-center gap-2">
                {t('assistant.title')}
              </h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={toggleAssistant}
                aria-label={language === 'en' ? 'Close assistant' : 'Fechar assistente'}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AIAssistant />
            </div>
          </div>
        )}
      </div>
      
      <Toaster />
    </div>
  );
};

export default ANIPortal;
