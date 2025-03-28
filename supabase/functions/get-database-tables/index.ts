
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get relevant database tables
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
        AND table_name LIKE 'ani_%' 
      GROUP BY 
        table_name
      ORDER BY 
        table_name;
    `;
    
    const { data, error } = await supabase.rpc('execute_sql_query', {
      sql_query: query
    });
    
    if (error) {
      throw error;
    }
    
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
