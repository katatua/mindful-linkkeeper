
import { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";
import { AIAssistant } from "@/components/AIAssistant";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, User, HelpCircle, Languages } from "lucide-react";
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
import { HamburgerMenu } from "@/components/HamburgerMenu";

const ANIPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HamburgerMenu />
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img 
              src="https://via.placeholder.com/40?text=ANI" 
              alt="ANI Logo" 
              className="h-10 w-10 rounded" 
            />
            <h1 className="text-xl font-bold hidden sm:block">GenAI Innovation Data Space</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Languages className="h-4 w-4 mr-2" />
            PT | EN
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <User className="h-4 w-4 mr-2" />
            User Settings
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Button>
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleLogin}>
              <LogIn className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-grow overflow-auto bg-gray-50">
          <Tabs defaultValue="dashboard" className="h-full">
            <div className="container mx-auto py-4">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="funding">Funding</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
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
        
        <div className="w-96 border-l flex flex-col bg-white">
          <div className="p-3 border-b flex justify-between items-center bg-gray-50">
            <h3 className="font-medium flex items-center gap-2">
              AI Assistant
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
