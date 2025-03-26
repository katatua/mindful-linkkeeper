import { supabase, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const runDatabaseDiagnostics = async () => {
  const results: Record<string, any> = {};
  
  try {
    console.log("Starting database connection diagnostics...");
    
    // Test 1: Basic connection by querying a small table
    try {
      console.log("Test 1: Checking basic connection to database...");
      const start = performance.now();
      
      // Try a direct query to see if the database is reachable at all
      const { data: directData, error: directError } = await supabase.rpc('execute_raw_query', { 
        sql_query: "SELECT 1 as health_check" 
      });
      
      if (directError) {
        console.error("Basic direct query test failed:", directError);
        
        // Try a different approach
        const { data: tableInfo, error: tableInfoError } = await supabase
          .from('ani_database_status')
          .select('count(*)', { count: 'exact', head: true });
        
        if (tableInfoError) {
          // Try information schema as a last resort
          const { data: schemaData, error: schemaError } = await supabase.rpc('execute_raw_query', { 
            sql_query: "SELECT COUNT(*) FROM information_schema.tables LIMIT 1"
          });
          
          if (schemaError) {
            results.basicConnection = {
              success: false,
              duration: `${(performance.now() - start).toFixed(2)}ms`,
              error: "Unable to connect to database using multiple methods",
              suggestion: "Please check that the Supabase project is active and the database is online."
            };
          } else {
            results.basicConnection = {
              success: true,
              duration: `${(performance.now() - start).toFixed(2)}ms`,
              note: "Connected via information_schema fallback"
            };
          }
        } else {
          results.basicConnection = {
            success: true,
            duration: `${(performance.now() - start).toFixed(2)}ms`,
            note: "Connected via direct table access"
          };
        }
      } else {
        results.basicConnection = {
          success: true,
          duration: `${(performance.now() - start).toFixed(2)}ms`,
          data: directData
        };
      }
    } catch (testError: any) {
      console.error("Test 1 failed with exception:", testError);
      
      results.basicConnection = {
        success: false,
        error: testError.message || "Unknown error",
        errorType: 'EXCEPTION',
        suggestion: "Database connection failed. Check network connectivity and Supabase project status."
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
        // Add specific suggestions based on error type
        if (functionError.message?.includes('404')) {
          results.functionsEndpoint.suggestion = "Edge function 'execute-sql' not found. Verify it's deployed correctly.";
        } else if (functionError.message?.includes('401') || functionError.message?.includes('auth')) {
          results.functionsEndpoint.suggestion = "Authentication to edge functions failed. Check your API key permissions.";
        } else if (functionError.message?.includes('timeout')) {
          results.functionsEndpoint.suggestion = "Request to edge function timed out. The function might be overloaded or offline.";
        }
      } else {
        console.log("Functions endpoint test successful");
      }
    } catch (testError: any) {
      console.error("Test 2 failed with exception:", testError);
      results.functionsEndpoint = {
        success: false,
        error: testError.message || "Unknown error",
        errorType: 'EXCEPTION',
        suggestion: testError.message?.includes('fetch') ? 
          "Network connectivity issue detected. Check your internet connection." : 
          "Unexpected error occurred during function endpoint test."
      };
    }
    
    // Test 3: Check Supabase client configuration
    results.clientConfiguration = {
      success: !!(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY),
      supabaseUrl: SUPABASE_URL ? "Configured" : "Not configured",
      supabaseKeyPrefix: SUPABASE_PUBLISHABLE_KEY ? 
        (SUPABASE_PUBLISHABLE_KEY.startsWith('eyJ') ? "Valid format" : "Invalid format") : 
        "Missing",
      error: !SUPABASE_URL ? 'Missing Supabase URL' : 
             (!SUPABASE_PUBLISHABLE_KEY ? 'Missing Supabase key' : 
              (!SUPABASE_PUBLISHABLE_KEY.startsWith('eyJ') ? 'Invalid Supabase key format' : null))
    };
    
    // Additional validation of URL format
    if (SUPABASE_URL && !SUPABASE_URL.startsWith('https://')) {
      results.clientConfiguration.success = false;
      results.clientConfiguration.error = 'Invalid Supabase URL format';
      results.clientConfiguration.suggestion = 'Supabase URL should start with https://';
    }
    
    // Test 4: Add a connection string test
    try {
      console.log("Test 4: Testing connection string validity...");
      const start = performance.now();
      
      // This just tests if we can make any request to the Supabase API
      const { data: healthData, error: healthError } = await supabase.rpc('execute_raw_query', { 
        sql_query: 'SELECT 1 as health_check' 
      });
      
      const duration = performance.now() - start;
      
      results.connectionString = {
        success: !healthError,
        duration: `${duration.toFixed(2)}ms`,
        error: healthError ? healthError.message : null,
        errorCode: healthError ? healthError.code : null
      };
      
      if (healthError) {
        console.error("Connection string test failed:", healthError);
        if (healthError.code === '42501') {
          results.connectionString.suggestion = "Permission denied. The database user may not have execute permission on the function.";
        } else if (healthError.code === '22023') {
          results.connectionString.suggestion = "Invalid parameter value. The SQL query may be malformed.";
        } else if (healthError.message?.includes('gateway')) {
          results.connectionString.suggestion = "API Gateway error. The Supabase project might be in sleep mode or has reached usage limits.";
        }
      } else {
        console.log("Connection string test successful");
      }
    } catch (testError: any) {
      console.error("Test 4 failed with exception:", testError);
      results.connectionString = {
        success: false,
        error: testError.message || "Unknown error",
        errorType: 'EXCEPTION'
      };
    }
    
    // Determine overall success
    const overallSuccess = results.basicConnection?.success || false;
    
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
    
    if (!results.connectionString?.success) {
      results.summary.recommendations.push(
        "Database connection string validation failed. Check if the Supabase project is active."
      );
    }
    
    return {
      success: overallSuccess,
      results
    };
    
  } catch (error: any) {
    console.error("Unexpected error in database diagnostics:", error);
    return {
      success: false,
      results: {},
      errorDetails: error instanceof Error ? 
        { message: error.message, stack: error.stack } : 
        { message: String(error) }
    };
  }
};

export const testDatabaseConnection = async () => {
  try {
    // Try multiple connection approaches
    try {
      // Try execute_raw_query with a simple query
      const { data: rpcData, error: rpcError } = await supabase.rpc('execute_raw_query', { 
        sql_query: "SELECT 1 as health_check" 
      });
      
      if (!rpcError) {
        console.log("Database connection via RPC successful:", rpcData);
        return { success: true, method: "rpc" };
      }
      
      console.log("RPC method failed, trying direct table access...");
    } catch (e) {
      console.log("RPC method threw exception, trying direct table access...");
    }
    
    // Try direct table access
    try {
      const { error: tableError } = await supabase
        .from('ani_database_status')
        .select('count(*)', { count: 'exact', head: true });
      
      if (!tableError) {
        console.log("Database connection via direct table successful");
        return { success: true, method: "direct_table" };
      }
      
      console.log("Direct table access failed, trying edge function...");
    } catch (e) {
      console.log("Direct table access threw exception, trying edge function...");
    }
    
    // Try edge function as a last resort
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke('execute-sql', { 
        body: { 
          sqlQuery: 'SELECT 1 as health_check',
          operation: 'query'
        }
      });
      
      if (!functionError) {
        console.log("Database connection via edge function successful:", functionData);
        return { success: true, method: "edge_function" };
      }
    } catch (e) {
      console.log("Edge function method threw exception");
    }
    
    // If we get here, all methods failed
    console.error("All database connection methods failed");
    return { 
      success: false, 
      error: "All connection methods failed",
      suggestion: "Check Supabase project status and network connectivity"
    };
    
  } catch (error: any) {
    console.error("Database connection test failed with exception:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

