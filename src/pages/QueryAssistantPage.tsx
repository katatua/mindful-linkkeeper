
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIAssistant } from '@/components/AIAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QueryHistory } from '@/components/database/QueryHistory';

export const QueryAssistantPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assistant');

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">SQL Query Assistant</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="mb-4">
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="history">Query History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assistant">
            <Card>
              <CardHeader>
                <CardTitle>Ask questions about your database</CardTitle>
              </CardHeader>
              <CardContent>
                <AIAssistant />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <QueryHistory />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default QueryAssistantPage;
