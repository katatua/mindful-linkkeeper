
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { AIAssistant } from "@/components/AIAssistant";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Menu } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSidebar } from "@/contexts/SidebarContext";
import { Toaster } from "@/components/ui/toaster";

const ANIPortal = () => {
  const [showChat, setShowChat] = useState(false);
  const { isOpen, toggle } = useSidebar();

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} className="mr-2">
            <Menu className="h-5 w-5" />
          </Button>
          <img 
            src="https://via.placeholder.com/40?text=ANI" 
            alt="ANI Logo" 
            className="h-10 w-10 rounded" 
          />
          <h1 className="text-xl font-bold">ANI Innovation Analytics</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            PT | EN
          </Button>
          <Button variant="outline" size="sm">
            User Settings
          </Button>
          <Button variant="outline" size="sm">
            Help
          </Button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        
        <main className="flex-1 overflow-auto bg-gray-50">
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
        
        {showChat && (
          <div className="w-96 border-l flex flex-col">
            <div className="p-2 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-medium">AI Assistant</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AIAssistant />
            </div>
          </div>
        )}
      </div>
      
      {!showChat && (
        <Button 
          className="absolute bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
          onClick={() => setShowChat(true)}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default ANIPortal;
