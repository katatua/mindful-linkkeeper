
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { AIAssistant } from '@/components/AIAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QueryHistory } from '@/components/database/QueryHistory';
import { Database, History } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const QueryAssistantPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the active tab from URL, if available
  const getTabFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('tab') || 'assistente';
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromUrl());
  
  // Update the URL when the tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/query-assistant?tab=${value}`, { replace: true });
  };
  
  // Synchronize state with URL if the URL changes by other means
  useEffect(() => {
    setActiveTab(getTabFromUrl());
  }, [location.search]);

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-2">Assistente ANI</h1>
        <p className="text-gray-500 mb-6">
          Faça as suas perguntas sobre a base de dados em português.
        </p>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="mb-4">
            <TabsTrigger value="assistente" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Assistente
            </TabsTrigger>
            <TabsTrigger value="historia" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              História
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assistente">
            <Card>
              <CardContent className="pt-6">
                <AIAssistant />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="historia">
            <QueryHistory />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default QueryAssistantPage;
