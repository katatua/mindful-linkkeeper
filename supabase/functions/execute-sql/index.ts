
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.7";

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Ensure environment variables are set
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to ensure the ani_database_status table exists
async function ensureStatusTableExists() {
  try {
    console.log("Checking if ani_database_status table exists...");
    
    // Try to perform a simple query to see if the table exists
    const { data: checkData, error: checkError } = await supabase.rpc('execute_raw_query', { 
      sql_query: "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ani_database_status')" 
    });
    
    const tableExists = checkData && checkData[0] && checkData[0].exists === true;
    
    if (!tableExists || checkError) {
      console.log("Creating ani_database_status table...");
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public.ani_database_status (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          table_name TEXT NOT NULL UNIQUE,
          last_populated TIMESTAMP WITH TIME ZONE,
          record_count INTEGER DEFAULT 0,
          status TEXT DEFAULT 'empty',
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        
        -- Add test data
        INSERT INTO public.ani_database_status (table_name, status, record_count)
        VALUES ('ani_database_status', 'active', 1)
        ON CONFLICT (table_name) DO UPDATE SET
          status = 'active',
          record_count = 1,
          updated_at = now();
      `;
      
      const { error: createError } = await supabase.rpc('execute_raw_query', { sql_query: createTableSQL });
      
      if (createError) {
        console.error("Error creating ani_database_status table:", createError);
        return false;
      }
      
      console.log("Successfully created ani_database_status table");
      return true;
    }
    
    console.log("ani_database_status table already exists");
    return true;
  } catch (error) {
    console.error("Error checking/creating ani_database_status table:", error);
    return false;
  }
}

// Function to ensure execute_raw_query function exists
async function ensureFunctionExists() {
  try {
    console.log("Checking if execute_raw_query function exists...");
    
    // Try a direct query as a test
    const { error: functionCheckError } = await supabase.rpc('execute_raw_query', { 
      sql_query: "SELECT 1 as test" 
    });
    
    if (functionCheckError && functionCheckError.code === 'PGRST202') {
      console.log("execute_raw_query function doesn't exist, creating it...");
      
      const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION public.execute_raw_query(sql_query text)
        RETURNS JSONB
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result JSONB;
        BEGIN
          -- For security in this demo, restrict to SELECT statements
          IF NOT (lower(btrim(sql_query)) LIKE 'select%') THEN
            RAISE EXCEPTION 'Only SELECT queries are allowed for security reasons';
          END IF;
          
          -- Execute the query and get results as JSON
          EXECUTE 'SELECT json_agg(t) FROM (' || sql_query || ') t' INTO result;
          
          -- Return empty array instead of null
          RETURN COALESCE(result, '[]'::jsonb);
        END;
        $$;
        
        -- Grant necessary permissions for the function
        REVOKE ALL ON FUNCTION public.execute_raw_query(text) FROM PUBLIC;
        GRANT EXECUTE ON FUNCTION public.execute_raw_query(text) TO service_role;
      `;
      
      // We need to use direct postgres connection for this
      // But since we can't directly execute arbitrary SQL from edge functions,
      // we'll return an error with instructions
      return {
        success: false,
        error: "The execute_raw_query function doesn't exist. Please run the SQL setup script."
      };
    }
    
    console.log("execute_raw_query function exists");
    return { success: true };
  } catch (error) {
    console.error("Error checking function existence:", error);
    return { 
      success: false, 
      error: `Error checking function: ${error.message || 'Unknown error'}`
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const { sqlQuery, operation } = await req.json();
    
    // Validate input
    if (!sqlQuery || typeof sqlQuery !== 'string') {
      return new Response(
        JSON.stringify({ error: "SQL query must be provided as a string" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Clean the SQL by removing excess whitespace
    const cleanedSql = sqlQuery.trim();
    console.log("Cleaned SQL:", cleanedSql);

    // Before executing, log information about Supabase connection state
    console.log("Supabase URL:", supabaseUrl ? "Configured" : "Missing");
    console.log("Supabase Service Key:", supabaseServiceKey ? "Configured (length: " + supabaseServiceKey.length + ")" : "Missing");

    // Ensure the status table exists
    await ensureStatusTableExists();
    
    // Check if the function exists
    const functionCheck = await ensureFunctionExists();
    if (!functionCheck.success) {
      return new Response(
        JSON.stringify({ 
          error: "Database function error", 
          details: functionCheck.error,
          suggestion: "Run the SQL setup script to create the required database functions" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (operation === 'write') {
      // For write operations (INSERT, UPDATE, DELETE)
      console.log("Executing SQL write operation:", cleanedSql);
      
      // First verify connection by checking the status table
      const { data: statusCheck, error: statusError } = await supabase
        .from('ani_database_status')
        .select('*')
        .limit(1);
      
      if (statusError) {
        console.error("Database connection check failed:", statusError);
        return new Response(
          JSON.stringify({ 
            error: "Database connection failed", 
            details: statusError.message,
            code: statusError.code
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      console.log("Database connection verified:", statusCheck);
      
      const { data, error } = await supabase.rpc('execute_raw_query', { sql_query: cleanedSql });
      
      if (error) {
        console.error("Error executing SQL write operation:", error);
        return new Response(
          JSON.stringify({ error: error.message, code: error.code }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      return new Response(
        JSON.stringify({ message: "SQL executed successfully", result: data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } 
    else {
      // For query operations (SELECT)
      console.log("Executing SQL query operation:", cleanedSql);
      
      // Try direct RPC call first
      try {
        const { data, error } = await supabase.rpc('execute_raw_query', { sql_query: cleanedSql });
        
        if (error) {
          console.error("Error executing SQL via RPC:", error);
          
          // If the function doesn't exist, suggest running the setup SQL
          if (error.code === 'PGRST202') {
            return new Response(
              JSON.stringify({ 
                error: "Database function missing", 
                details: "The execute_raw_query function does not exist in the database",
                suggestion: "Run the SQL setup script to create the required database functions" 
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
            );
          }
          
          // If RPC fails, try direct query as fallback
          console.log("Attempting fallback to direct query...");
          const { data: directData, error: directError } = await supabase.from('ani_database_status').select('*').limit(1);
          
          if (directError) {
            return new Response(
              JSON.stringify({ 
                error: "All database connection attempts failed", 
                details: error.message,
                fallbackError: directError.message 
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
            );
          }
          
          return new Response(
            JSON.stringify({ 
              result: directData, 
              warning: "Used fallback query method. Original SQL was not executed." 
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(
          JSON.stringify({ result: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (unexpectedError) {
        console.error("Unexpected error during query execution:", unexpectedError);
        
        // Try a simpler version query as a last resort
        try {
          console.log("Attempting simple version query as last resort...");
          const { data: versionData, error: versionError } = await supabase.rpc('execute_raw_query', { 
            sql_query: "SELECT version() as postgres_version" 
          });
          
          if (!versionError && versionData) {
            return new Response(
              JSON.stringify({ 
                result: [{ message: "Original query failed but database is connected" }],
                fallbackData: versionData,
                warning: "Used version query fallback. Original SQL was not executed." 
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        } catch (e) {
          console.error("Version query also failed:", e);
        }
        
        return new Response(
          JSON.stringify({ 
            error: "Unexpected error", 
            details: unexpectedError instanceof Error ? unexpectedError.message : String(unexpectedError) 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: error.constructor.name,
        stack: error.stack
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
