import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ServerCrash, CheckCircle2, Database, AlertTriangle, PlusCircle, ExternalLink } from "lucide-react";
import { testDatabaseConnection } from "@/utils/databaseDiagnostics";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { initializeLocalDatabase } from "@/utils/localDatabase";

const DatabaseConnectionTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    details?: any;
  } | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      toast.info("Testing database connection...");
      const testResult = await testDatabaseConnection();
      setResult(testResult);
      
      if (testResult.success) {
        toast.success("Local database connection successful");
      } else {
        toast.error("Local database connection failed", {
          description: testResult.message
        });
      }
    } catch (error) {
      console.error("Error in connection test:", error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
        details: error
      });
      
      toast.error("Connection test failed", {
        description: "Check console for details"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDb = async () => {
    setIsInitializing(true);
    
    try {
      toast.info("Initializing local database...");
      
      // Use our local database initialization function
      initializeLocalDatabase();
      
      toast.success("Local database initialized successfully");
      await runTest();
    } catch (error) {
      console.error("Error initializing database:", error);
      
      setResult({
        success: false,
        message: "Database initialization failed.",
        details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      });
      
      toast.error("Database initialization failed", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const openLocalDbInfo = () => {
    // Display local database information in a new tab or modal
    toast.info("Using local file-based database", {
      description: "Data is stored in text files or localStorage in the browser"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={runTest}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Database className="h-4 w-4" />
          )}
          {isLoading ? "Testing Connection..." : "Test Local Database Connection"}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={initializeDb}
          disabled={isInitializing}
          className="gap-2"
        >
          {isInitializing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="h-4 w-4" />
          )}
          {isInitializing ? "Initializing..." : "Initialize Local Database"}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={openLocalDbInfo}
          className="gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Local Database Info
        </Button>
      </div>
      
      {result && (
        <Alert variant={result.success ? "default" : "destructive"} className="mt-2">
          {result.success ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <ServerCrash className="h-4 w-4" />
          )}
          <AlertTitle className="flex items-center gap-2">
            Local Database Connection Test
            <Badge variant={result.success ? "default" : "destructive"}>
              {result.success ? "Success" : "Failed"}
            </Badge>
          </AlertTitle>
          <AlertDescription>
            {result.message}
            
            {!result.success && result.details && (
              <div className="mt-2 text-xs text-gray-500">
                <details>
                  <summary className="cursor-pointer font-medium">View Error Details</summary>
                  <pre className="mt-2 rounded bg-slate-100 p-2 text-xs overflow-auto max-h-32">
                    {typeof result.details === 'object' 
                      ? JSON.stringify(result.details, null, 2)
                      : String(result.details)}
                  </pre>
                </details>
                
                <div className="mt-3 p-3 border rounded-md bg-amber-50 border-amber-200">
                  <h4 className="flex items-center gap-2 font-medium mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Troubleshooting Tips
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-amber-800">
                    <li>Local database uses text files or localStorage</li>
                    <li>Check browser console for detailed error messages</li>
                    <li>Try reinitializing the database</li>
                    <li>Clear browser cache and local storage if problems persist</li>
                  </ul>
                </div>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DatabaseConnectionTest;
