import React, { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";
import { AIAssistant } from "@/components/AIAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { showVisualization, visualizationData, setShowVisualization } = useVisualization();

  useEffect(() => {
    console.log("ANIPortal component mounted, checking auth state");
    
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        console.log("Attempting to get session from Supabase");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          setAuthError(error.message);
          toast({
            title: "Authentication Error",
            description: "Failed to check authentication state. Using default.",
            variant: "destructive",
          });
          setIsAuthenticated(false);
        } else {
          console.log("Session data received:", data ? "Session exists" : "No session");
          setIsAuthenticated(!!data.session);
        }
      } catch (err) {
        console.error("Unexpected auth error:", err);
        setAuthError(err?.message || "Unknown auth error");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        console.log("Auth check completed, isLoading set to false");
      }
    };
    
    checkAuth();

    let subscription;
    try {
      console.log("Setting up auth state change listener");
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log("Auth state changed:", _event);
        setIsAuthenticated(!!session);
      });
      subscription = data.subscription;
    } catch (err) {
      console.error("Error setting up auth subscription:", err);
      setAuthError(err?.message || "Failed to subscribe to auth changes");
    }

    return () => {
      console.log("ANIPortal component unmounting, unsubscribing from auth");
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (err) {
          console.error("Error unsubscribing from auth:", err);
        }
      }
    };
  }, [toast]);

  const handleCloseVisualization = () => {
    setShowVisualization(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading portal...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we set up your workspace</p>
        </div>
      </div>
    );
  }

  console.log("ANIPortal rendering main content, auth state:", isAuthenticated);
  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-grow max-w-[calc(100%-36rem)] overflow-auto bg-gray-50">
            <Tabs defaultValue="dashboard" className="h-full">
              <div className="container mx-auto py-4 flex justify-between items-center">
                <TabsList className="overflow-x-auto">
                  <TabsTrigger value="dashboard">{t('dashboard.tab') || 'Dashboard'}</TabsTrigger>
                  <TabsTrigger value="funding">{t('funding.tab') || 'Funding'}</TabsTrigger>
                  <TabsTrigger value="projects">{t('projects.tab') || 'Projects'}</TabsTrigger>
                  <TabsTrigger value="analytics">{t('analytics.tab') || 'Analytics'}</TabsTrigger>
                  <TabsTrigger value="reports">{t('reports.tab') || 'Reports'}</TabsTrigger>
                  <TabsTrigger value="policies">{t('policies.tab') || 'Policies'}</TabsTrigger>
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
              
              {authError && (
                <div className="container mx-auto px-4 py-2">
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative">
                    <strong className="font-bold">Note:</strong>
                    <span className="block sm:inline"> Authentication service is having issues, but you can still use most features.</span>
                  </div>
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
                {t('assistant.title') || 'AI Assistant'}
              </h3>
            </div>
            <div className="flex-1 overflow-hidden">
              <AIAssistant />
            </div>
          </div>
        </div>
        
        <Toaster />
      </div>
    </ErrorBoundary>
  );
};

export default ANIPortal;
