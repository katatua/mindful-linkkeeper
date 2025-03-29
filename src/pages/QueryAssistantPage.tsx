
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AIAssistant } from '@/components/AIAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QueryHistory } from '@/components/database/QueryHistory';
import { Button } from '@/components/ui/button';
import { Database, History, ListTodo, PlayCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { suggestedDatabaseQuestions, predefinedQueries } from '@/utils/aiUtils';

export const QueryAssistantPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assistant');

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-2">SQL Query Assistant</h1>
        <p className="text-gray-500 mb-6">
          Ask questions about your database in English or Portuguese and get SQL queries and insights.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="mb-4">
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="predefined" className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" />
              Predefined Queries
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Query History
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              Example Queries
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assistant">
            <Card>
              <CardHeader>
                <CardTitle>Ask questions about your database</CardTitle>
                <CardDescription>
                  You can use natural language in English or Portuguese to query the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIAssistant />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="predefined">
            <Card>
              <CardHeader>
                <CardTitle>Predefined Queries</CardTitle>
                <CardDescription>
                  These queries are guaranteed to return results from the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertDescription>
                    Click on any query to execute it directly and see the results
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Portuguese Queries</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {predefinedQueries
                        .filter(q => q.language === 'pt')
                        .map((query, idx) => (
                          <Button 
                            key={idx} 
                            variant="outline" 
                            className="w-full justify-start text-left h-auto py-2 px-4"
                            onClick={() => {
                              setActiveTab('assistant');
                              // Custom event to execute predefined query
                              window.dispatchEvent(new CustomEvent('execute-predefined-query', { 
                                detail: { queryName: query.name } 
                              }));
                            }}
                          >
                            <div>
                              <div className="font-medium">{query.name}</div>
                              <div className="text-sm text-gray-500">{query.description}</div>
                            </div>
                          </Button>
                        ))
                      }
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">English Queries</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {predefinedQueries
                        .filter(q => q.language === 'en')
                        .map((query, idx) => (
                          <Button 
                            key={idx} 
                            variant="outline" 
                            className="w-full justify-start text-left h-auto py-2 px-4"
                            onClick={() => {
                              setActiveTab('assistant');
                              // Custom event to execute predefined query
                              window.dispatchEvent(new CustomEvent('execute-predefined-query', { 
                                detail: { queryName: query.name } 
                              }));
                            }}
                          >
                            <div>
                              <div className="font-medium">{query.name}</div>
                              <div className="text-sm text-gray-500">{query.description}</div>
                            </div>
                          </Button>
                        ))
                      }
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <QueryHistory />
          </TabsContent>
          
          <TabsContent value="examples">
            <Card>
              <CardHeader>
                <CardTitle>Example Queries</CardTitle>
                <CardDescription>
                  Here are some example queries you can try with the AI Assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertDescription>
                    Click on any example to automatically use it in the AI Assistant
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Portuguese Queries</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {suggestedDatabaseQuestions
                        .filter(q => /[áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/.test(q) || 
                                   /\b(qual|como|onde|quem|porque|quais|quando)\b/i.test(q))
                        .map((question, idx) => (
                          <Button 
                            key={idx} 
                            variant="outline" 
                            className="w-full justify-start text-left h-auto py-2"
                            onClick={() => {
                              setActiveTab('assistant');
                              // Use a custom event to set the input
                              window.dispatchEvent(new CustomEvent('set-query-input', { 
                                detail: { query: question } 
                              }));
                            }}
                          >
                            {question}
                          </Button>
                        ))
                      }
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">English Queries</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {suggestedDatabaseQuestions
                        .filter(q => !(/[áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/.test(q) || 
                                     /\b(qual|como|onde|quem|porque|quais|quando)\b/i.test(q)))
                        .slice(0, 8) // Limit to first 8 English examples
                        .map((question, idx) => (
                          <Button 
                            key={idx} 
                            variant="outline" 
                            className="w-full justify-start text-left h-auto py-2"
                            onClick={() => {
                              setActiveTab('assistant');
                              // Use a custom event to set the input
                              window.dispatchEvent(new CustomEvent('set-query-input', { 
                                detail: { query: question } 
                              }));
                            }}
                          >
                            {question}
                          </Button>
                        ))
                      }
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default QueryAssistantPage;
