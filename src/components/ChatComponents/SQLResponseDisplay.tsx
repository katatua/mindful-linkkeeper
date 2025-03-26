
import React from "react";
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
  return (
    <Card className="mt-4 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Query Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sql" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="sql">SQL Query</TabsTrigger>
            <TabsTrigger value="response">Natural Language</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sql" className="rounded-md bg-gray-50 p-3">
            <SyntaxHighlighter
              language="sql"
              style={materialDark}
              customStyle={{ borderRadius: '0.375rem' }}
            >
              {sql}
            </SyntaxHighlighter>
          </TabsContent>
          
          <TabsContent value="response">
            <div className="text-sm py-2">
              {naturalLanguageResponse}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SQLResponseDisplay;
