
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SQLResponseDisplayProps {
  sql: string;
  naturalLanguageResponse: string;
}

export const SQLResponseDisplay: React.FC<SQLResponseDisplayProps> = ({ 
  sql, 
  naturalLanguageResponse 
}) => {
  // Reset active tab when SQL changes
  useEffect(() => {
    // No special reset logic needed - component will re-render with new props
  }, [sql, naturalLanguageResponse]);

  const displaySql = sql || '-- No SQL query was generated';
  const displayResponse = naturalLanguageResponse || "No natural language response was generated.";

  return (
    <Card className="mt-4 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Query Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="response" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="response">Natural Language</TabsTrigger>
            <TabsTrigger value="sql">SQL Query</TabsTrigger>
          </TabsList>
          
          <TabsContent value="response">
            <div className="text-sm py-2 prose max-w-full">
              {displayResponse}
            </div>
          </TabsContent>
          
          <TabsContent value="sql" className="rounded-md bg-gray-50 p-3">
            <SyntaxHighlighter
              language="sql"
              style={materialDark}
              customStyle={{ borderRadius: '0.375rem' }}
            >
              {displaySql}
            </SyntaxHighlighter>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
