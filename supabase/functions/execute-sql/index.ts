
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
        console.error("Error executing SQL query:", error);
        return new Response(
          JSON.stringify({ error: error.message, code: error.code }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      return new Response(
        JSON.stringify({ result: data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
