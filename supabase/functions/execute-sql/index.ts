
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

    if (operation === 'write') {
      // For write operations (INSERT, UPDATE, DELETE)
      console.log("Executing SQL write operation:", sqlQuery);
      
      const { data, error } = await supabase.rpc('execute_raw_query', { sql_query: sqlQuery });
      
      if (error) {
        console.error("Error executing SQL write operation:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
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
      console.log("Executing SQL query operation:", sqlQuery);
      
      const { data, error } = await supabase.rpc('execute_raw_query', { sql_query: sqlQuery });
      
      if (error) {
        console.error("Error executing SQL query:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
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
