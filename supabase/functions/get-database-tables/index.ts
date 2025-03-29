
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

    console.log("Querying information_schema for tables");
    
    // Corrected query: don't prepend public to information_schema
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.columns')
      .select('table_name, column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .neq('table_name', 'schema_migrations');
      
    if (tablesError) {
      console.error("Error querying tables:", tablesError);
      
      // Fallback to a more direct SQL approach if the RPC method fails
      console.log("Trying alternative approach with direct SQL query");
      const { data: sqlData, error: sqlError } = await supabase.rpc('get_database_tables');
      
      if (sqlError) {
        console.error("SQL fallback also failed:", sqlError);
        throw sqlError;
      }
      
      console.log(`Successfully retrieved schema using SQL fallback for ${sqlData ? JSON.parse(sqlData).length : 0} tables`);
      return new Response(
        sqlData,
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
    
    // Group by table name to organize the data
    const groupedTables = {};
    tables?.forEach(column => {
      if (!groupedTables[column.table_name]) {
        groupedTables[column.table_name] = {
          table_name: column.table_name,
          columns: []
        };
      }
      
      groupedTables[column.table_name].columns.push({
        column_name: column.column_name,
        data_type: column.data_type,
        is_nullable: column.is_nullable
      });
    });
    
    const result = Object.values(groupedTables);
    console.log(`Returning schema for ${result.length} tables`);
    
    return new Response(
      JSON.stringify(result),
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
