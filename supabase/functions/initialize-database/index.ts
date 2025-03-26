
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.7";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Edge function started: initialize-database");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
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
          success: false,
          error: "Supabase environment variables are not configured"
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

    // Create ani_database_status table if it doesn't exist
    console.log("Creating ani_database_status table if it doesn't exist");
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('information_schema.tables')
      .select('*')
      .eq('table_name', 'ani_database_status')
      .eq('table_schema', 'public')
      .single();

    if (tableCheckError && !tableCheckError.message.includes('No rows found')) {
      console.error('Error checking table existence:', tableCheckError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Failed to check if table exists",
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

    // Create the table if it doesn't exist
    if (!tableExists) {
      console.log("ani_database_status table does not exist, creating it");
      
      const { error: createTableError } = await supabase.rpc('execute_raw_query', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS public.ani_database_status (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            table_name TEXT NOT NULL UNIQUE,
            record_count INTEGER DEFAULT 0,
            status TEXT DEFAULT 'empty',
            last_populated TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (createTableError) {
        console.error('Error creating table:', createTableError);
        return new Response(
          JSON.stringify({ 
            success: false,
            error: "Failed to create database table",
            details: createTableError.message 
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
      
      console.log("ani_database_status table created successfully");
    } else {
      console.log("ani_database_status table already exists");
    }
    
    // Check if execute_raw_query function exists
    console.log("Checking if execute_raw_query function exists...");
    const { data: functionExists, error: functionCheckError } = await supabase
      .from('pg_proc')
      .select('*')
      .eq('proname', 'execute_raw_query')
      .maybeSingle();
    
    if (functionCheckError) {
      console.error('Error checking function existence:', functionCheckError);
      // Continue anyway, as we'll try to create the function
    }
    
    if (!functionExists) {
      console.log("execute_raw_query function does not exist, creating it");
      // Create the function
      const { error: createFunctionError } = await supabase.rpc('execute_raw_query', {
        sql_query: `
          CREATE OR REPLACE FUNCTION public.execute_raw_query(sql_query text)
          RETURNS jsonb
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          DECLARE
            result JSONB;
          BEGIN
            -- For security, restrict to SELECT statements in this function
            IF NOT (lower(btrim(sql_query)) LIKE 'select%') THEN
              RAISE EXCEPTION 'Only SELECT queries are allowed for security reasons';
            END IF;
            
            -- Execute the query and get results as JSON
            EXECUTE 'SELECT json_agg(t) FROM (' || sql_query || ') t' INTO result;
            
            -- Return empty array instead of null
            RETURN COALESCE(result, '[]'::jsonb);
          END;
          $$;
        `
      });
      
      if (createFunctionError) {
        console.log("Error creating function, might already exist:", createFunctionError);
        // Continue anyway
      } else {
        console.log("execute_raw_query function created successfully");
      }
    } else {
      console.log("execute_raw_query function exists");
    }
    
    // Check if is_admin function exists and create it if needed
    console.log("Checking if is_admin function exists...");
    const { data: adminFunctionExists, error: adminFunctionCheckError } = await supabase
      .from('pg_proc')
      .select('*')
      .eq('proname', 'is_admin')
      .maybeSingle();
    
    if (adminFunctionCheckError) {
      console.error('Error checking admin function existence:', adminFunctionCheckError);
      // Continue anyway
    }
    
    if (!adminFunctionExists) {
      console.log("is_admin function does not exist, creating it");
      const { error: createAdminFunctionError } = await supabase.rpc('execute_raw_query', {
        sql_query: `
          CREATE OR REPLACE FUNCTION public.is_admin()
          RETURNS boolean
          LANGUAGE sql
          SECURITY DEFINER
          AS $$
            SELECT EXISTS (
              SELECT 1 FROM public.profiles
              WHERE id = auth.uid() AND role = 'admin'
            );
          $$;
        `
      });
      
      if (createAdminFunctionError) {
        console.log("Error creating admin function, might already exist:", createAdminFunctionError);
        // Continue anyway
      } else {
        console.log("is_admin function created successfully");
      }
    } else {
      console.log("is_admin function exists");
    }
    
    // Verify database connection
    console.log("Executing SQL query operation: SELECT 1 as health_check");
    const { data: healthCheck, error: healthCheckError } = await supabase.rpc('execute_raw_query', {
      sql_query: "SELECT 1 as health_check"
    });
    
    if (healthCheckError) {
      console.error('Database health check failed:', healthCheckError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Database health check failed",
          details: healthCheckError.message 
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
    
    console.log("Database initialization complete and health check passed:", healthCheck);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Database initialized successfully",
        healthCheck
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
        success: false,
        error: "Unexpected error occurred",
        details: error.message || String(error),
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
