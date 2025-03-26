
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { testDatabaseConnection, runDatabaseDiagnostics } from '@/utils/databaseDiagnostics';
import { Database, ServerCrash, Check, X, RefreshCw, Loader2, AlertTriangle, Link, Globe, Shield, Network } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';

const DatabaseConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "connected" | "error">("unknown");
  const [loading, setLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  
  // Check connection on component mount
  useEffect(() => {
    checkConnection();
  }, []);
  
  const checkConnection = async () => {
    setLoading(true);
    try {
      const result = await testDatabaseConnection();
      setConnectionStatus(result.success ? "connected" : "error");
      
      if (result.success) {
        toast.success("Database connection successful", {
          description: `Connected using ${result.method} method`
        });
      } else {
        toast.error("Database connection failed", {
          description: result.suggestion || "Check Supabase project status"
        });
      }
    } catch (error) {
      console.error("Error checking database connection:", error);
      setConnectionStatus("error");
      toast.error("Connection test failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setLoading(false);
      setLastCheckTime(new Date());
    }
  };

  const handleFullDiagnostics = async () => {
    setLoading(true);
    try {
      toast.info("Running full diagnostics...", {
        description: "This may take a moment"
      });
      
      const diagnosticResults = await runDatabaseDiagnostics();
      
      if (diagnosticResults.success) {
        toast.success("Diagnostics completed successfully");
        setConnectionStatus("connected");
      } else {
        toast.error("Diagnostics found issues", {
          description: "Check the console for detailed results"
        });
        setConnectionStatus("error");
      }
      
      console.log("Full diagnostic results:", diagnosticResults);
    } catch (error) {
      console.error("Error running diagnostics:", error);
      toast.error("Diagnostics failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setLoading(false);
      setLastCheckTime(new Date());
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant={connectionStatus === "connected" ? "outline" : "default"}
        size="sm"
        onClick={checkConnection}
        disabled={loading}
        className={`flex items-center gap-2 ${
          connectionStatus === "connected" ? "border-green-500 text-green-500" : 
          connectionStatus === "error" ? "bg-red-500 hover:bg-red-600" :
          "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : connectionStatus === "connected" ? (
          <Check className="h-4 w-4" />
        ) : connectionStatus === "error" ? (
          <X className="h-4 w-4" />
        ) : (
          <Database className="h-4 w-4" />
        )}
        {connectionStatus === "connected" ? "Connected" : 
         connectionStatus === "error" ? "Connection Error" : 
         "Check Connection"}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleFullDiagnostics}
        disabled={loading}
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        Diagnostics
      </Button>
      
      {lastCheckTime && (
        <span className="text-xs text-gray-500">
          Last check: {lastCheckTime.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default DatabaseConnectionTest;
