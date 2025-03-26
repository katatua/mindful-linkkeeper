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
      
      // First, check if the ani_database_status table exists
      const { data: tableCheck, error: tableCheckError } = await supabase
        .rpc('execute_raw_query', { 
          sql_query: "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ani_database_status')"
        });
      
      // Fix for TypeScript error: Check if tableCheck is an array with elements
      const tableExists = tableCheck && Array.isArray(tableCheck) && tableCheck.length > 0 && tableCheck[0].exists;
      
      if (!tableExists) {
        console.warn("The ani_database_status table doesn't exist. This might be expected in a new setup.");
        
        results.basicConnection = {
          success: false,
          duration: `${(performance.now() - start).toFixed(2)}ms`,
          error: "The ani_database_status table doesn't exist in the database.",
          suggestion: "This could be normal for a new setup. Either create the table or modify the diagnostic to test a different table."
        };
      } else {
        // Table exists, so attempt to query it
        const { data: statusData, error: statusError } = await supabase
          .from('ani_database_status')
          .select('count(*)', { count: 'exact', head: true });
        
        const duration = performance.now() - start;
        
        results.basicConnection = {
          success: !statusError,
          duration: `${duration.toFixed(2)}ms`,
          error: statusError ? statusError.message : null,
          errorCode: statusError ? statusError.code : null,
          errorDetails: statusError ? JSON.stringify(statusError) : null
        };
        
        if (statusError) {
          console.error("Basic connection test failed:", statusError);
          
          // Enhanced suggestions based on error type
          if (statusError.message?.includes('fetch') || statusError.message?.includes('network')) {
            results.basicConnection.suggestion = "Network connectivity issue detected. Check your internet connection and firewall settings.";
          } else if (statusError.code === '42P01') { // Table doesn't exist
            results.basicConnection.suggestion = "The ani_database_status table doesn't exist. Make sure the database is properly initialized.";
          } else if (statusError.code?.startsWith('28')) { // Authentication issues
            results.basicConnection.suggestion = "Authentication failed. Verify your Supabase API key is correct.";
          } else if (statusError.code === 'PGRST116') {
            results.basicConnection.suggestion = "Permission denied. Check the Row Level Security (RLS) policies for the ani_database_status table.";
          } else if (!statusError.message && !statusError.code) {
            // Handle empty error object
            results.basicConnection.error = "Empty error response. This might indicate a CORS issue or network interruption.";
            results.basicConnection.suggestion = "Check browser console for CORS errors and verify your network connection is stable.";
          }
        } else {
          console.log("Basic connection test successful");
        }
      }
    } catch (testError: any) {
      console.error("Test 1 failed with exception:", testError);
      results.basicConnection = {
        success: false,
        error: testError.message || "Unknown error",
        errorType: 'EXCEPTION',
        suggestion: testError.message?.includes('fetch') ? 
          "Network connectivity issue detected. Check your internet connection." : 
          "Unexpected error occurred during connection test."
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
    const overallSuccess = results.basicConnection?.success && 
                          results.functionsEndpoint?.success && 
                          results.clientConfiguration?.success &&
                          results.connectionString?.success;
    
    // Generate a summary with recommendations
    results.summary = {
      overallSuccess,
      recommendations: []
    };
    
    if (!results.basicConnection?.success) {
      const basicConnRec = "Database connection is failing. Check network connectivity and Supabase project status.";
      results.summary.recommendations.push(
        results.basicConnection?.suggestion ? `${basicConnRec} ${results.basicConnection.suggestion}` : basicConnRec
      );
    }
    
    if (!results.functionsEndpoint?.success) {
      const funcEndpointRec = "Connection to Supabase Functions is failing. Verify edge function deployment.";
      results.summary.recommendations.push(
        results.functionsEndpoint?.suggestion ? `${funcEndpointRec} ${results.functionsEndpoint.suggestion}` : funcEndpointRec
      );
    }
    
    if (!results.clientConfiguration?.success) {
      const configRec = "Supabase client configuration is incorrect. Verify the URL and API key.";
      results.summary.recommendations.push(
        results.clientConfiguration?.suggestion ? `${configRec} ${results.clientConfiguration.suggestion}` : configRec
      );
    }
    
    if (!results.connectionString?.success) {
      const connStringRec = "Database connection string validation failed. Check if the Supabase project is active.";
      results.summary.recommendations.push(
        results.connectionString?.suggestion ? `${connStringRec} ${results.connectionString.suggestion}` : connStringRec
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
    const { data, error } = await supabase.from('ani_database_status').select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error("Database connection failed:", error);
      
      // Provide helpful toast message based on error type
      let errorMessage = error.message || "Unknown error";
      let errorDescription = "";
      
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        errorMessage = "Network connectivity issue detected";
        errorDescription = "Check your internet connection and firewall settings.";
      } else if (error.code === '42P01') {
        errorMessage = "Table not found";
        errorDescription = "The ani_database_status table doesn't exist. Database may need initialization.";
      } else if (error.code?.startsWith('28')) {
        errorMessage = "Authentication failed";
        errorDescription = "Verify your Supabase API key is correct.";
      } else if (error.code === 'PGRST116') {
        errorMessage = "Permission denied";
        errorDescription = "Check the RLS policies for the ani_database_status table.";
      } else if (!error.message && !error.code) {
        errorMessage = "Connection error";
        errorDescription = "Empty error response. This might indicate a CORS issue or network interruption.";
      }
      
      toast.error(errorMessage, {
        description: errorDescription || error.message
      });
      
      return { 
        success: false, 
        error: errorMessage,
        errorDetails: error,
        suggestion: errorDescription
      };
    }
    
    console.log("Database connection successful:", data);
    toast.success("Database connection successful");
    return { success: true };
  } catch (error: any) {
    console.error("Database connection test failed with exception:", error);
    
    // Provide detailed error feedback
    let errorMessage = error instanceof Error ? error.message : "Unknown error";
    let errorDescription = "";
    
    if (errorMessage.includes('fetch')) {
      errorMessage = "Network error";
      errorDescription = "Unable to reach Supabase. Check your internet connection.";
    } else if (errorMessage.includes('timeout')) {
      errorMessage = "Connection timeout";
      errorDescription = "The request to Supabase timed out. The service might be experiencing high load.";
    }
    
    toast.error(errorMessage, {
      description: errorDescription || (error instanceof Error ? error.message : String(error))
    });
    
    return { 
      success: false, 
      error: errorMessage,
      errorDetails: error instanceof Error ? 
        { message: error.message, stack: error.stack } : 
        { message: String(error) },
      suggestion: errorDescription
    };
  }
};
