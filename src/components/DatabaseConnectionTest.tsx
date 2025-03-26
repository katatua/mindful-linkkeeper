
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ServerCrash, CheckCircle2, Database, AlertTriangle, PlusCircle, ExternalLink } from "lucide-react";
import { testDatabaseConnection } from "@/utils/databaseDiagnostics";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
        toast.success("Database connection successful");
      } else {
        toast.error("Database connection failed", {
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
      toast.info("Initializing database...");
      
      // First check direct connection to Supabase without edge functions
      try {
        const { data: connCheck, error: connCheckError } = await supabase
          .from('ani_database_status')
          .select('count(*)', { count: 'exact', head: true });
          
        if (connCheckError) {
          console.log("Database direct connection check failed:", connCheckError);
        } else {
          console.log("Direct database connection successful");
        }
      } catch (connErr) {
        console.log("Connection check error:", connErr);
      }
      
      // Try direct SQL execution using Supabase client
      console.log("Attempting direct table creation via SQL query");
      try {
        // Create the ani_database_status table directly
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS public.ani_database_status (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            table_name TEXT NOT NULL UNIQUE,
            record_count INTEGER DEFAULT 0,
            status TEXT DEFAULT 'empty',
            last_populated TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        
        // Use RPC if available, or direct query as fallback
        const { error: directSqlError } = await supabase.rpc('execute_raw_query', {
          sql_query: createTableSQL
        }).catch(err => {
          console.log("RPC function not found or error:", err);
          return { error: err };
        });
        
        if (directSqlError) {
          console.log("Direct SQL execution failed:", directSqlError);
        } else {
          console.log("Table created successfully via direct SQL");
          toast.success("Database initialized successfully");
          await runTest();
          setIsInitializing(false);
          return;
        }
      } catch (sqlError) {
        console.log("SQL execution error:", sqlError);
      }
      
      // If direct SQL failed, try the edge function as backup
      console.log("Falling back to edge function for initialization...");
      try {
        // Add a timeout for the edge function call
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Edge function request timed out")), 8000);
        });
        
        // Call the edge function with a timeout
        const functionPromise = supabase.functions.invoke('initialize-database', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // Race the function call against the timeout
        const { data, error } = await Promise.race([
          functionPromise, 
          timeoutPromise.then(() => {
            throw new Error("Edge function request timed out");
          })
        ]) as any;
        
        if (error) {
          throw error;
        }
        
        if (data && data.success) {
          toast.success("Database initialized successfully");
          // Run the test again to verify
          await runTest();
        } else {
          throw new Error((data && data.error) || "Unknown error during initialization");
        }
      } catch (edgeFnError) {
        console.error("Edge function error:", edgeFnError);
        
        setResult({
          success: false,
          message: "Database initialization failed. Please try using the SQL Editor directly.",
          details: {
            message: edgeFnError instanceof Error ? edgeFnError.message : "Unknown error",
            note: "Edge functions may be unavailable. Consider using the SQL Editor in Supabase to manually execute the initialization script."
          }
        });
        
        toast.error("Database initialization failed", {
          description: "Edge function unavailable. Consider SQL Editor alternative."
        });
      }
    } catch (error) {
      console.error("Error initializing database:", error);
      
      setResult({
        success: false,
        message: "Database initialization failed. Consider using the SQL Editor directly.",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
          suggestion: "Try running the initialization SQL script manually in the SQL Editor"
        }
      });
      
      toast.error("Database initialization failed", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const openSupabaseEditor = () => {
    // Open the Supabase SQL Editor in a new tab
    window.open("https://supabase.com/dashboard/project/tujvvuqhvjicbcqzmcwq/sql/new", "_blank");
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
          {isLoading ? "Testing Connection..." : "Test Database Connection"}
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
          {isInitializing ? "Initializing..." : "Initialize Database"}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={openSupabaseEditor}
          className="gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Open SQL Editor
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
            Database Connection Test
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
                    <li>Verify your Supabase URL and API key are correct</li>
                    <li>Check if the database is accessible from your current location</li>
                    <li>Try using the SQL Editor to manually run the initialization script</li>
                    <li>Edge functions may be unavailable - direct SQL is an alternative</li>
                    <li>Check if you need to create database tables using the SQL editor</li>
                    <li>Verify network connectivity to Supabase services</li>
                  </ul>
                  
                  <div className="mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={openSupabaseEditor}
                      className="w-full gap-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open SQL Editor
                    </Button>
                  </div>
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
