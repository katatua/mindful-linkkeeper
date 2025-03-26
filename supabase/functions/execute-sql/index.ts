
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

    // Verify database connection by checking if ani_database_status table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .rpc('execute_raw_query', { 
        sql_query: "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ani_database_status')"
      });
    
    if (tableCheckError) {
      console.error("Table check error:", tableCheckError);
      return new Response(
        JSON.stringify({ 
          error: "Database connection error while checking for table", 
          details: tableCheckError.message 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Check if the table actually exists from the query result
    const doesTableExist = tableExists && 
                         Array.isArray(tableExists) && 
                         tableExists.length > 0 && 
                         tableExists[0].exists === true;
    
    if (!doesTableExist) {
      console.log("Table 'ani_database_status' does not exist. Creating it now...");
      
      // Create the table if it doesn't exist
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
        console.error("Error creating table:", createError);
        return new Response(
          JSON.stringify({ 
            error: "Failed to create ani_database_status table", 
            details: createError.message 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      console.log("Successfully created ani_database_status table");
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
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
