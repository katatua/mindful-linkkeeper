
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting get-database-tables function");
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials are missing");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if we need to refresh the tables
    let isRefresh = false;
    try {
      const body = await req.json();
      isRefresh = body?.refresh === true;
    } catch (e) {
      // Not a JSON body or no refresh parameter, continue normally
    }
    
    if (isRefresh) {
      console.log("Performing a refresh of database tables");
    }

    console.log("Calling the get_database_tables SQL function directly");
    
    // Use the SQL function that was created in the migration
    const { data, error } = await supabase.rpc('get_database_tables');
    
    if (error) {
      console.error("Error calling get_database_tables function:", error);
      throw error;
    }
    
    // Return the data directly without parsing
    console.log(`Successfully retrieved schema for tables`);
    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in get-database-tables function:", error);
    
    // Return a structured error response
    return new Response(
      JSON.stringify({
        error: `Failed to get database tables: ${error.message || "Unknown error"}`
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
