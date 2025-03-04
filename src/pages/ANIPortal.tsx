
import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { AIAssistant } from "@/components/AIAssistant";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, LogIn, FileUp, Link as LinkIcon, FolderPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

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
          <img 
            src="https://via.placeholder.com/40?text=ANI" 
            alt="ANI Logo" 
            className="h-10 w-10 rounded" 
          />
          <h1 className="text-xl font-bold">ANI Innovation Analytics</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/add-file")}>
            <FileUp className="h-4 w-4 mr-2" />
            Upload File
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/add-link")}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Add Link
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/add-category")}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
          <Button variant="ghost" size="sm">
            PT | EN
          </Button>
          <Button variant="outline" size="sm">
            User Settings
          </Button>
          <Button variant="outline" size="sm">
            Help
          </Button>
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleLogin}>
              <LogIn className="h-4 w-4 mr-2" />
              Login
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
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="dashboard" className="h-full">
              <Dashboard />
            </TabsContent>
            
            <TabsContent value="projects">
              <div className="container mx-auto py-6">
                <h2 className="text-2xl font-bold mb-6">Innovation Projects</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p>Projects module will display detailed information about active innovation initiatives, including timelines, stakeholders, and progress metrics.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="container mx-auto py-6">
                <h2 className="text-2xl font-bold mb-6">Advanced Analytics</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p>Analytics module will provide in-depth data analysis tools, predictive models, and scenario forecasting capabilities.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reports">
              <div className="container mx-auto py-6">
                <h2 className="text-2xl font-bold mb-6">Reports & Documentation</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p>Reports module will enable automated document generation, performance reporting, and data export functionalities.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="policies">
              <div className="container mx-auto py-6">
                <h2 className="text-2xl font-bold mb-6">Innovation Policies</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p>Policies module will track and analyze innovation directives, regulatory compliance, and policy impact assessments.</p>
                </div>
              </div>
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
