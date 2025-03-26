
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ServerCrash, CheckCircle2, Database } from "lucide-react";
import { testDatabaseConnection } from "@/utils/databaseDiagnostics";
import { Badge } from "@/components/ui/badge";

const DatabaseConnectionTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    details?: any;
  } | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    try {
      const testResult = await testDatabaseConnection();
      setResult(testResult);
    } catch (error) {
      console.error("Error in connection test:", error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
        details: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={runTest}
        disabled={isLoading}
        className="gap-2 mb-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Database className="h-4 w-4" />
        )}
        {isLoading ? "Testing Connection..." : "Test Database Connection"}
      </Button>
      
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
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DatabaseConnectionTest;
