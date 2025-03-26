
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if the table exists before querying
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('information_schema.tables')
      .select('*')
      .eq('table_name', 'ani_database_status')
      .eq('table_schema', 'public')
      .single();

    if (tableCheckError) {
      console.error('Error checking if table exists:', tableCheckError);
      throw new Error('Failed to check if ani_database_status table exists');
    }

    if (!tableExists) {
      console.log('ani_database_status table does not exist');
      
      // Return empty array if table doesn't exist
      return new Response(
        JSON.stringify([]), 
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    console.log('ani_database_status table exists');

    const { data, error } = await supabase
      .from('ani_database_status')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log('Database Status Records:', JSON.stringify(data, null, 2));

    return new Response(
      JSON.stringify(data || []), 
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching database status:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
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
