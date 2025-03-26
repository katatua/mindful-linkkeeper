
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
    
    console.log("Environment variables:", {
      supabaseUrl: supabaseUrl ? "SET" : "NOT SET",
      supabaseServiceKey: supabaseServiceKey ? "SET" : "NOT SET"
    });
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ 
          error: "Supabase environment variables are not configured",
          hint: "Check Supabase project settings and function secrets"
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
      console.error('Error checking table existence:', tableCheckError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to check table existence",
          details: tableCheckError.message 
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
      console.log('ani_database_status table does not exist');
      return new Response(
        JSON.stringify({ 
          data: [],
          message: "The ani_database_status table does not exist",
          success: true
        }), 
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Fetch the database status records
    const { data, error } = await supabase
      .from('ani_database_status')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching database status:', error);
      return new Response(
        JSON.stringify({ 
          error: "Failed to fetch database status",
          details: error.message 
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
    console.error('Unexpected error in edge function:', error);
    return new Response(
      JSON.stringify({ 
        error: "Unexpected error occurred",
        details: error.message,
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
