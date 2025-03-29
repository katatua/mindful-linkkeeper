
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
    
    // First, check if the supabase credentials work by getting a list of all tables
    console.log("Querying information_schema to list all tables");
    const { data: allTables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .neq('table_name', 'schema_migrations')
      .order('table_name');
      
    if (tablesError) {
      console.error("Error querying tables:", tablesError);
      throw tablesError;
    }
    
    console.log(`Found ${allTables?.length || 0} total tables in the database`);
    
    // Get all tables in the public schema
    const query = `
      SELECT 
        table_name,
        json_agg(
          json_build_object(
            'column_name', column_name,
            'data_type', data_type,
            'is_nullable', is_nullable
          )
        ) as columns
      FROM 
        information_schema.columns
      WHERE 
        table_schema = 'public' 
        AND table_name IN (
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
        )
      GROUP BY 
        table_name
      ORDER BY 
        table_name;
    `;
    
    console.log("Executing detailed query for table schema");
    const { data, error } = await supabase.rpc('execute_sql_query', {
      sql_query: query
    });
    
    if (error) {
      console.error("Error executing SQL query:", error);
      throw error;
    }
    
    console.log(`Returning schema for ${data?.length || 0} tables`);
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in get-database-tables function:", error);
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
