
import { supabase } from "@/integrations/supabase/client";

/**
 * Tests database connection by attempting to execute a simple query
 */
export const testDatabaseConnection = async () => {
  try {
    console.log("Testing database connection...");
    
    // Try to invoke the execute-sql edge function with a simple health check query
    const { data, error } = await supabase.functions.invoke('execute-sql', {
      body: { 
        sqlQuery: "SELECT 1 as health_check",
        operation: 'query'
      }
    });
    
    if (error) {
      console.error("Error in database connection test (edge function error):", error);
      return { 
        success: false, 
        message: `Edge function error: ${error.message}`,
        details: error 
      };
    }
    
    if (!data || !data.result) {
      console.error("Unexpected response format from edge function:", data);
      return { 
        success: false, 
        message: "Unexpected response format from database query function",
        details: data 
      };
    }
    
    console.log("Database connection test successful:", data);
    return { success: true, message: "Database connection is working" };
  } 
  catch (error) {
    console.error("Exception during database connection test:", error);
    
    // Try a direct query as a fallback
    try {
      console.log("Attempting direct query fallback...");
      const { data: directData, error: directError } = await supabase
        .from('ani_database_status')
        .select('count(*)', { count: 'exact', head: true });
      
      if (directError) {
        console.error("Direct query fallback also failed:", directError);
        return { 
          success: false, 
          message: "All database connection attempts failed",
          details: { 
            originalError: error, 
            fallbackError: directError 
          } 
        };
      }
      
      console.log("Direct query fallback succeeded");
      return { 
        success: true, 
        message: "Direct database connection is working, but edge function had issues" 
      };
    } 
    catch (fallbackError) {
      console.error("All connection attempts failed:", fallbackError);
      return { 
        success: false, 
        message: "Database connection is completely unavailable",
        details: { 
          originalError: error, 
          fallbackError 
        } 
      };
    }
  }
};

/**
 * Check if a specific table exists in the database
 */
export const checkTableExists = async (tableName: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('execute-sql', {
      body: { 
        sqlQuery: `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = '${tableName}'
          ) as exists
        `,
        operation: 'query'
      }
    });
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return data?.result[0]?.exists === true;
  } catch (error) {
    console.error(`Exception checking if table ${tableName} exists:`, error);
    return false;
  }
};
