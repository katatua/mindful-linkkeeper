
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Performs a series of diagnostic tests on the Supabase connection
 * and returns detailed information about any failures.
 */
export const runDatabaseDiagnostics = async (): Promise<{
  success: boolean;
  results: Record<string, any>;
  errorDetails?: any;
}> => {
  const results: Record<string, any> = {};
  
  try {
    console.log("Starting database connection diagnostics...");
    
    // Test 1: Basic connection by querying a small table
    try {
      console.log("Test 1: Checking basic connection to ani_database_status table...");
      const start = performance.now();
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
      );
      
      // Race the actual query against the timeout
      const { data: statusData, error: statusError } = await Promise.race([
        supabase.from('ani_database_status').select('count(*)', { count: 'exact', head: true }),
        timeoutPromise as Promise<any>
      ]);
      
      const duration = performance.now() - start;
      
      results.basicConnection = {
        success: !statusError,
        duration: `${duration.toFixed(2)}ms`,
        error: statusError ? statusError.message : null
      };
      
      if (statusError) {
        console.error("Basic connection test failed:", statusError);
        
        // Additional details for connection errors
        if (statusError.message.includes('Failed to fetch') || 
            statusError.message.includes('NetworkError') ||
            statusError.message.includes('timeout')) {
          results.basicConnection.errorType = 'NETWORK';
          results.basicConnection.suggestion = 'This appears to be a network connectivity issue.';
        } else if (statusError.code === '3D000' || statusError.code === '28P01') {
          results.basicConnection.errorType = 'AUTHENTICATION';
          results.basicConnection.suggestion = 'This appears to be an authentication issue with the database.';
        } else if (statusError.code === '08001' || statusError.code === '08006') {
          results.basicConnection.errorType = 'CONNECTION_REFUSED';
          results.basicConnection.suggestion = 'The database server actively refused the connection.';
        }
      } else {
        console.log("Basic connection test successful");
      }
    } catch (testError: any) {
      console.error("Test 1 failed with exception:", testError);
      results.basicConnection = {
        success: false,
        error: testError.message,
        errorType: 'EXCEPTION'
      };
    }
    
    // Test 2: Check if we can connect to the Supabase functions endpoint
    try {
      console.log("Test 2: Checking connection to Supabase Functions endpoint...");
      const start = performance.now();
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Functions endpoint timeout')), 5000)
      );
      
      // Race the actual function call against the timeout
      const { data: functionData, error: functionError } = await Promise.race([
        supabase.functions.invoke('execute-sql', { 
          body: { 
            sqlQuery: 'SELECT 1 as health_check',
            operation: 'query'
          }
        }),
        timeoutPromise as Promise<any>
      ]);
      
      const duration = performance.now() - start;
      
      results.functionsEndpoint = {
        success: !functionError,
        duration: `${duration.toFixed(2)}ms`,
        error: functionError ? functionError.message : null,
        data: functionData
      };
      
      if (functionError) {
        console.error("Functions endpoint test failed:", functionError);
        
        // Additional details for function errors
        if (functionError.message.includes('Failed to fetch') || 
            functionError.message.includes('NetworkError') ||
            functionError.message.includes('timeout')) {
          results.functionsEndpoint.errorType = 'NETWORK';
          results.functionsEndpoint.suggestion = 'Network connectivity issue when connecting to Functions.';
        } else if (functionError.message.includes('invalid token') || 
                  functionError.message.includes('JWT')) {
          results.functionsEndpoint.errorType = 'AUTHENTICATION';
          results.functionsEndpoint.suggestion = 'Authentication issue when connecting to Functions.';
        } else if (functionError.status === 404) {
          results.functionsEndpoint.errorType = 'NOT_FOUND';
          results.functionsEndpoint.suggestion = 'The function endpoint does not exist or is not deployed.';
        } else if (functionError.status === 500) {
          results.functionsEndpoint.errorType = 'SERVER_ERROR';
          results.functionsEndpoint.suggestion = 'The function encountered an internal error.';
        }
      } else {
        console.log("Functions endpoint test successful");
      }
    } catch (testError: any) {
      console.error("Test 2 failed with exception:", testError);
      results.functionsEndpoint = {
        success: false,
        error: testError.message,
        errorType: 'EXCEPTION'
      };
    }
    
    // Test 3: Check Supabase client configuration
    try {
      console.log("Test 3: Checking Supabase client configuration...");
      
      // Get configuration data directly from the imported variables in the client file
      // instead of using non-existent methods
      const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } = require("@/integrations/supabase/client");
      
      results.clientConfiguration = {
        success: !!(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY),
        supabaseUrl: SUPABASE_URL ? "Configured" : "Not configured",
        supabaseKeyPrefix: SUPABASE_PUBLISHABLE_KEY ? "Configured" : "Missing",
        error: !SUPABASE_URL ? 'Missing Supabase URL' : (!SUPABASE_PUBLISHABLE_KEY ? 'Missing Supabase key' : null)
      };
      
      if (!results.clientConfiguration.success) {
        console.error("Client configuration test failed:", results.clientConfiguration.error);
      } else {
        console.log("Client configuration test successful");
      }
    } catch (testError: any) {
      console.error("Test 3 failed with exception:", testError);
      results.clientConfiguration = {
        success: false,
        error: testError.message,
        errorType: 'EXCEPTION'
      };
    }
    
    // Determine overall success
    const overallSuccess = results.basicConnection?.success && 
                          results.functionsEndpoint?.success && 
                          results.clientConfiguration?.success;
    
    // Generate a summary with recommendations
    results.summary = {
      overallSuccess,
      timestamp: new Date().toISOString(),
      recommendations: []
    };
    
    if (!results.basicConnection?.success) {
      results.summary.recommendations.push(
        "Database connection is failing. Check network connectivity and Supabase project status."
      );
    }
    
    if (!results.functionsEndpoint?.success) {
      results.summary.recommendations.push(
        "Connection to Supabase Functions is failing. Check if functions are properly deployed and accessible."
      );
    }
    
    if (!results.clientConfiguration?.success) {
      results.summary.recommendations.push(
        "Supabase client configuration is incorrect. Verify the URL and API key are properly set."
      );
    }
    
    return {
      success: results.basicConnection?.success && 
              results.functionsEndpoint?.success && 
              results.clientConfiguration?.success,
      results
    };
    
  } catch (error) {
    console.error("Database diagnostics failed with an unexpected error:", error);
    return {
      success: false,
      results,
      errorDetails: error
    };
  }
};

/**
 * Runs a comprehensive database connection test and displays results in a toast notification
 */
export const testDatabaseConnection = async () => {
  toast.info("Testing database connection...", {
    duration: 3000,
  });
  
  try {
    const diagnosticResults = await runDatabaseDiagnostics();
    
    if (diagnosticResults.success) {
      toast.success("Database connection is working properly", {
        description: "All connection tests passed successfully.",
        duration: 5000,
      });
    } else {
      const failedTests = Object.entries(diagnosticResults.results)
        .filter(([key, value]) => key !== 'summary' && !value.success)
        .map(([key]) => key)
        .join(', ');
      
      toast.error("Database connection issues detected", {
        description: `Failed tests: ${failedTests}. Check the console for detailed diagnostics.`,
        duration: 8000,
      });
    }
    
    console.log("Database diagnostic results:", diagnosticResults);
    return diagnosticResults;
  } catch (error) {
    console.error("Error running database diagnostics:", error);
    toast.error("Error running database diagnostics", {
      description: error.message,
      duration: 5000,
    });
    return {
      success: false,
      results: {},
      errorDetails: error
    };
  }
};
