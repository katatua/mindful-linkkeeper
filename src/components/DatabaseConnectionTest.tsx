
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { testDatabaseConnection, runDatabaseDiagnostics } from '@/utils/databaseDiagnostics';
import { Database, ServerCrash, Check, X, RefreshCw, Loader2, AlertTriangle, Link, Globe, Shield, Network } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";

const DatabaseConnectionTest: React.FC = () => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const handleRunDiagnostics = async () => {
    setLoading(true);
    try {
      const diagnosticResults = await runDatabaseDiagnostics();
      setResults(diagnosticResults);
      
      // Show summary toast
      if (diagnosticResults.success) {
        toast.success("All diagnostics passed successfully");
      } else {
        toast.error("Some diagnostic tests failed", {
          description: "Review the results for detailed information"
        });
      }
    } catch (error) {
      console.error("Error running diagnostics:", error);
      toast.error("Failed to run diagnostics", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const renderStatusIcon = (success: boolean) => {
    return success ? 
      <Check className="h-5 w-5 text-green-500" /> : 
      <X className="h-5 w-5 text-red-500" />;
  };
  
  const getErrorTypeIcon = (errorData: any) => {
    if (!errorData || !errorData.error) return <ServerCrash className="h-4 w-4" />;
    
    if (errorData.error.includes('network') || errorData.error.includes('fetch')) 
      return <Network className="h-4 w-4" />;
    if (errorData.error.includes('permission') || errorData.error.includes('denied'))
      return <Shield className="h-4 w-4" />;
    if (errorData.error.includes('timeout'))
      return <Loader2 className="h-4 w-4" />;
      
    return <ServerCrash className="h-4 w-4" />;
  };
  
  const renderTestResult = (name: string, result: any) => {
    if (!result) return null;
    
    return (
      <div className="mb-4 border rounded-md p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium flex items-center gap-2">
            {renderStatusIcon(result.success)}
            {name}
          </div>
          {result.duration && <span className="text-sm text-gray-500">{result.duration}</span>}
        </div>
        
        {!result.success && (
          <Alert variant="destructive" className="mt-2">
            {getErrorTypeIcon(result)}
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="text-sm">
              {result.error}
              {result.errorCode && (
                <div className="mt-1 text-xs font-mono bg-gray-100 p-1 rounded">
                  Error code: {result.errorCode}
                </div>
              )}
              {result.suggestion && (
                <div className="mt-2 text-sm italic border-l-2 border-amber-400 pl-2">
                  Suggestion: {result.suggestion}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {result.success && (
          <Alert className="mt-2 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">Test Passed</AlertTitle>
            <AlertDescription className="text-sm text-green-600">
              This connection test completed successfully.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };
  
  const renderTroubleshootingLinks = () => {
    if (!results || results.success) return null;
    
    return (
      <div className="mt-4 border-t pt-4">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Troubleshooting Resources
        </h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Link className="h-4 w-4 text-blue-500" />
            <a href="https://supabase.com/docs/guides/database/connecting-to-postgres" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-blue-500 hover:underline">
              Supabase Database Connection Guide
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-500" />
            <a href="https://supabase.com/dashboard/project/ncnewevucbkebrqjtufl/settings" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-blue-500 hover:underline">
              Supabase Project Settings
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-500" />
            <a href="https://supabase.com/dashboard/project/ncnewevucbkebrqjtufl/functions" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-blue-500 hover:underline">
              Edge Functions Management
            </a>
          </li>
        </ul>
      </div>
    );
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Connection Diagnostics
        </CardTitle>
        <CardDescription>
          Run diagnostics to identify potential database connection issues
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center text-gray-600">
              Running diagnostic tests...
            </p>
          </div>
        ) : results ? (
          <div className="space-y-4">
            <div className="border-b pb-2 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Diagnostic Results</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  results.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {results.success ? 'All Tests Passed' : 'Issues Detected'}
                </span>
              </div>
            </div>
            
            {renderTestResult('Basic Database Connection', results.results.basicConnection)}
            {renderTestResult('Functions Endpoint', results.results.functionsEndpoint)}
            {renderTestResult('Client Configuration', results.results.clientConfiguration)}
            {renderTestResult('Connection String', results.results.connectionString)}
            
            {results.results.summary && results.results.summary.recommendations.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {results.results.summary.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {renderTroubleshootingLinks()}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <Database className="h-12 w-12 mb-4 text-gray-400" />
            <p className="mb-2">
              Run the diagnostics to check database connection status
            </p>
            <p className="text-sm text-gray-400">
              This will test connectivity to various Supabase resources and identify issues
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={handleRunDiagnostics} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : results ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Diagnostics Again
            </>
          ) : (
            "Run Connection Diagnostics"
          )}
        </Button>
        
        <div className="text-xs text-center text-gray-500 mt-2">
          Connection URL: {SUPABASE_URL ? 
            <span className="font-mono">{SUPABASE_URL.substring(0, 20)}...</span> : 
            "Not configured"}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DatabaseConnectionTest;
