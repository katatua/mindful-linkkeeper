
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.7";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Edge function started: show-database-status");

serve(async (req) => {
  // Log the request for debugging
  console.log("Received request to show-database-status function");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request with CORS headers");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase connection info from environment
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    // Log environment variable status (without revealing values)
    console.log(`SUPABASE_URL ${supabaseUrl ? 'is set' : 'is NOT set'}`);
    console.log(`SUPABASE_SERVICE_ROLE_KEY ${supabaseServiceKey ? 'is set' : 'is NOT set'}`);
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are not set");
      throw new Error("Missing required environment variables");
    }
    
    // Initialize Supabase client
    console.log("Initializing Supabase client");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First, check if the table exists
    console.log("Checking if ani_database_status table exists");
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('information_schema.tables')
      .select('*')
      .eq('table_name', 'ani_database_status')
      .eq('table_schema', 'public')
      .single();

    if (tableCheckError) {
      console.error('Error checking if table exists:', tableCheckError);
      
      // Return a more informative error
      return new Response(
        JSON.stringify({ 
          error: "Failed to check if ani_database_status table exists",
          details: tableCheckError.message,
          hint: "Make sure the service role key has permission to query information_schema"
        }), 
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    if (!tableExists) {
      console.log('ani_database_status table does not exist, returning empty array');
      
      // Return empty array if table doesn't exist
      return new Response(
        JSON.stringify({ 
          data: [],
          message: "The ani_database_status table does not exist yet"
        }), 
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    console.log('ani_database_status table exists, fetching records');

    // Fetch the database status records
    const { data, error } = await supabase
      .from('ani_database_status')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching database status:', error);
      throw error;
    }

    console.log(`Successfully retrieved ${data?.length || 0} records`);

    return new Response(
      JSON.stringify({ 
        data: data || [],
        success: true
      }), 
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unknown error occurred",
        location: "show-database-status edge function",
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
