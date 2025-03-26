
import { supabase } from "@/integrations/supabase/client";

/**
 * Tests database connection by attempting to execute a simple query
 */
export const testDatabaseConnection = async () => {
  try {
    console.log("Testing database connection...");
    
    // First check if the client is initialized correctly
    if (!supabase || typeof supabase.functions.invoke !== 'function') {
      console.error("Supabase client is not initialized correctly");
      return { 
        success: false, 
        message: "Supabase client is not properly initialized. Check your configuration.",
        details: { error: "Invalid Supabase client" }
      };
    }
    
    // Try to invoke the execute-sql edge function with a simple health check query
    console.log("Attempting to execute query via edge function...");
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
        message: `Edge function error: ${error.message}. This likely means the execute-sql edge function is not deployed or there's an authentication issue.`,
        details: error 
      };
    }
    
    if (!data || !data.result) {
      console.error("Unexpected response format from edge function:", data);
      return { 
        success: false, 
        message: "Unexpected response format from database query function. The edge function may exist but isn't returning data in the expected format.",
        details: data 
      };
    }
    
    console.log("Database connection test successful:", data);
    return { 
      success: true, 
      message: "Database connection is working correctly. The execute-sql edge function returned the expected result.",
      details: data
    };
  } 
  catch (error) {
    console.error("Exception during database connection test:", error);
    
    // Try a direct query as a fallback
    try {
      console.log("Edge function failed. Attempting direct query fallback...");
      console.log("Checking if any tables exist...");
      
      // Try to get a list of tables
      const { data: tablesData, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(5);
      
      if (tablesError) {
        console.error("Error accessing schema information:", tablesError);
        
        // One more fallback - try to access any known table
        console.log("Trying one more fallback to check connection...");
        const { error: directError } = await supabase
          .from('ani_database_status')
          .select('count(*)', { count: 'exact', head: true });
        
        if (directError) {
          if (directError.code === 'PGRST301') {
            return { 
              success: false, 
              message: "Connection succeeded but the database appears to be empty. No tables found. You need to set up the database schema.",
              details: { 
                originalError: error, 
                fallbackError: directError,
                hint: "The database is accessible but no tables exist. Check the Supabase SQL editor to create tables."
              } 
            };
          } else {
            return { 
              success: false, 
              message: "All database connection attempts failed. Check your Supabase configuration and network connectivity.",
              details: { 
                originalError: error, 
                fallbackError: directError 
              } 
            };
          }
        }
      }
      
      // If we got here with no error, we have a connection but likely no tables
      return { 
        success: true, 
        message: "Database connection is working, but there might not be any tables set up yet.",
        details: {
          tables: tablesData || [],
          hint: "The database connection works, but you may need to create tables."
        }
      };
    } 
    catch (fallbackError) {
      console.error("All connection attempts failed:", fallbackError);
      return { 
        success: false, 
        message: "Database connection is completely unavailable. Please verify your Supabase configuration and credentials.",
        details: { 
          originalError: error, 
          fallbackError,
          serviceStatus: "Check https://status.supabase.com/ to see if there are any Supabase service issues."
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
    console.log(`Checking if table ${tableName} exists...`);
    
    // First, try via the execute-sql edge function
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
      console.error(`Error checking if table ${tableName} exists via edge function:`, error);
      
      // Fallback to direct query if edge function fails
      const { data: directData, error: directError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', tableName)
        .maybeSingle();
      
      if (directError) {
        console.error(`Direct query for table ${tableName} failed:`, directError);
        return false;
      }
      
      return directData !== null;
    }
    
    return data?.result?.[0]?.exists === true;
  } catch (error) {
    console.error(`Exception checking if table ${tableName} exists:`, error);
    return false;
  }
};

/**
 * Creates initial database tables for the application if they don't exist
 */
export const initializeDatabase = async () => {
  try {
    console.log("Checking if database needs initialization...");
    
    // First check if the ani_database_status table exists
    const tableExists = await checkTableExists('ani_database_status');
    
    if (tableExists) {
      console.log("Database appears to be already initialized.");
      return {
        success: true,
        message: "Database schema already exists."
      };
    }
    
    console.log("Database needs initialization. Creating tables...");
    
    // Create the ani_database_status table as a starting point
    const { error } = await supabase.functions.invoke('execute-sql', {
      body: { 
        sqlQuery: `
          CREATE TABLE IF NOT EXISTS public.ani_database_status (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            table_name TEXT NOT NULL UNIQUE,
            last_populated TIMESTAMP WITH TIME ZONE,
            record_count INTEGER DEFAULT 0,
            status TEXT DEFAULT 'empty',
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
          );
          
          -- Add an initial record
          INSERT INTO public.ani_database_status (table_name, status)
          VALUES ('ani_database_status', 'active')
          ON CONFLICT (table_name) DO NOTHING;
        `,
        operation: 'write'
      }
    });
    
    if (error) {
      console.error("Error initializing database tables:", error);
      return {
        success: false,
        message: `Failed to initialize database: ${error.message}`,
        details: error
      };
    }
    
    return {
      success: true,
      message: "Database has been initialized successfully with the required tables."
    };
  } catch (error) {
    console.error("Exception during database initialization:", error);
    return {
      success: false,
      message: `Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`,
      details: error
    };
  }
};
