import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Search, Loader2 } from "lucide-react";
import { useQueryProcessor } from '@/hooks/useQueryProcessor';
import { SQLResponseDisplay } from './ChatComponents/SQLResponseDisplay';

export default function DatabaseQuery() {
  const [query, setQuery] = useState('');
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [displayResults, setDisplayResults] = useState(false);
  const [sqlStatement, setSqlStatement] = useState('');
  const [naturalLanguageResponse, setNaturalLanguageResponse] = useState('');
  const { toast } = useToast();
  const { processQuery } = useQueryProcessor();

  const handleExecuteQuery = async () => {
    if (!query.trim()) return;
    
    setIsExecuting(true);
    setDisplayResults(false);
    
    const result = await processQuery(query);
    
    if (result.success) {
      setQueryResults(result.data);
      setSqlStatement(result.sql);
      setNaturalLanguageResponse(result.interpretation || '');
      setDisplayResults(true);
    } else {
      toast({
        title: "Query Error",
        description: result.error || "Failed to execute query",
        variant: "destructive",
      });
    }
    
    setIsExecuting(false);
  };

  const renderResults = () => {
    if (!queryResults) {
      return <p>No results to display.</p>;
    }

    if (queryResults.length === 0) {
      return <p>No data found for the given query.</p>;
    }

    const headers = Object.keys(queryResults[0]);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {queryResults.map((row, index) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td key={`${index}-${header}`} className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                    {row[header]?.toString() || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Database Query</h1>
      <p className="text-gray-600 mb-6">
        Ask questions about the ANI database in natural language.
      </p>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="flex mb-2">
            <Input
              className="flex-grow"
              placeholder="Ask a question about the data (e.g., 'What was the R&D investment in Portugal over the last 3 years?')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleExecuteQuery()}
            />
            <Button 
              className="ml-2" 
              onClick={handleExecuteQuery}
              disabled={isExecuting}
            >
              {isExecuting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              {isExecuting ? "Processing..." : "Run Query"}
            </Button>
          </div>
          
          {displayResults && queryResults && (
            <>
              <SQLResponseDisplay 
                sql={sqlStatement} 
                naturalLanguageResponse={naturalLanguageResponse} 
              />
              
              <div className="mt-6">
                <h2 className="text-lg font-medium mb-2">Results</h2>
                {renderResults()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
