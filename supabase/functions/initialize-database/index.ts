
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
      
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS public.ani_database_status (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          table_name TEXT NOT NULL UNIQUE,
          record_count INTEGER DEFAULT 0,
          status TEXT DEFAULT 'empty',
          last_populated TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      const { error: createTableError } = await supabase.rpc('execute_sql_query', {
        sql_query: createTableQuery
      }).catch(err => {
        console.log("Error caught in execute_sql_query for table creation:", err);
        // If execute_sql_query doesn't exist yet, we'll try directly with SQL
        return { error: { message: "Function execute_sql_query not found" } };
      });
      
      if (createTableError) {
        console.log("Trying direct SQL execution instead of RPC...");
        // Try direct SQL if the RPC fails
        const { error: directSqlError } = await supabase
          .from('_sqlexecutor')
          .select('*')
          .eq('__sql', createTableQuery)
          .single();
          
        if (directSqlError) {
          console.error('Error creating table with direct SQL:', directSqlError);
          // Let's try one more approach with a different RPC function that might exist
          const { error: altRpcError } = await supabase.rpc('execute_raw_query', {
            sql_query: createTableQuery
          }).catch(err => {
            console.log("Error caught in execute_raw_query:", err);
            return { error: err };
          });
          
          if (altRpcError) {
            console.error('All methods failed to create table:', altRpcError);
            return new Response(
              JSON.stringify({ 
                success: false,
                error: "Failed to create database table. Please use the SQL editor in Supabase to run the initialization script manually.",
                details: {
                  originalError: createTableError.message,
                  directSqlError: directSqlError.message,
                  altRpcError: altRpcError.message
                }
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
        }
      }
      
      console.log("ani_database_status table created successfully or already exists");
    } else {
      console.log("ani_database_status table already exists");
    }
    
    // Verify database connection with a simple query
    console.log("Executing SQL query operation: SELECT 1 as health_check");
    const { data: healthCheck, error: healthCheckError } = await supabase
      .from('ani_database_status')
      .select('*')
      .limit(1);
    
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
    
    console.log("Database initialization complete and health check passed");
    
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
