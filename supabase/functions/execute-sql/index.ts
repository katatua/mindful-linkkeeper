
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
    const { sqlStatements, operation } = await req.json();
    
    // Validate input
    if (!sqlStatements || typeof sqlStatements !== 'string') {
      return new Response(
        JSON.stringify({ error: "SQL statements must be provided as a string" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (operation === 'write') {
      // For write operations (INSERT, UPDATE, DELETE)
      console.log("Executing SQL write operation:", sqlStatements);
      
      // Use the service role to execute raw SQL - note that this requires proper validation
      // and should only be used with trusted inputs
      const { data, error } = await supabase.rpc(
        'execute_raw_query',
        { sql_query: sqlStatements }
      );
      
      if (error) {
        console.error("Error executing SQL:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          message: "SQL executed successfully", 
          affectedRows: Array.isArray(data) ? data.length : 0,
          result: data 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } 
    else {
      // For other operations, return an error
      return new Response(
        JSON.stringify({ error: "Unsupported operation type" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
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
