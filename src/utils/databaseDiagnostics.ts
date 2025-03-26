
import { supabase, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const runDatabaseDiagnostics = async () => {
  const results: Record<string, any> = {};
  
  try {
    console.log("Starting database connection diagnostics...");
    
    // Test 1: Basic connection by querying a small table
    try {
      console.log("Test 1: Checking basic connection to ani_database_status table...");
      const start = performance.now();
      
      const { data: statusData, error: statusError } = await supabase
        .from('ani_database_status')
        .select('count(*)', { count: 'exact', head: true });
      
      const duration = performance.now() - start;
      
      results.basicConnection = {
        success: !statusError,
        duration: `${duration.toFixed(2)}ms`,
        error: statusError ? statusError.message : null
      };
      
      if (statusError) {
        console.error("Basic connection test failed:", statusError);
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
      
      const { data: functionData, error: functionError } = await supabase.functions.invoke('execute-sql', { 
        body: { 
          sqlQuery: 'SELECT 1 as health_check',
          operation: 'query'
        }
      });
      
      const duration = performance.now() - start;
      
      results.functionsEndpoint = {
        success: !functionError,
        duration: `${duration.toFixed(2)}ms`,
        error: functionError ? functionError.message : null,
        data: functionData
      };
      
      if (functionError) {
        console.error("Functions endpoint test failed:", functionError);
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
    results.clientConfiguration = {
      success: !!(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY),
      supabaseUrl: SUPABASE_URL ? "Configured" : "Not configured",
      supabaseKeyPrefix: SUPABASE_PUBLISHABLE_KEY ? "Configured" : "Missing",
      error: !SUPABASE_URL ? 'Missing Supabase URL' : (!SUPABASE_PUBLISHABLE_KEY ? 'Missing Supabase key' : null)
    };
    
    // Determine overall success
    const overallSuccess = results.basicConnection?.success && 
                          results.functionsEndpoint?.success && 
                          results.clientConfiguration?.success;
    
    // Generate a summary with recommendations
    results.summary = {
      overallSuccess,
      recommendations: []
    };
    
    if (!results.basicConnection?.success) {
      results.summary.recommendations.push(
        "Database connection is failing. Check network connectivity and Supabase project status."
      );
    }
    
    if (!results.functionsEndpoint?.success) {
      results.summary.recommendations.push(
        "Connection to Supabase Functions is failing. Verify edge function deployment."
      );
    }
    
    if (!results.clientConfiguration?.success) {
      results.summary.recommendations.push(
        "Supabase client configuration is incorrect. Verify the URL and API key."
      );
    }
    
    return {
      success: overallSuccess,
      results
    };
    
  } catch (error) {
    console.error("Unexpected error in database diagnostics:", error);
    return {
      success: false,
      results: {},
      errorDetails: error
    };
  }
};

export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('ani_database_status').select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error("Database connection failed:", error);
      return { success: false, error: error.message };
    }
    
    console.log("Database connection successful:", data);
    return { success: true };
  } catch (error) {
    console.error("Database connection test failed with exception:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};
