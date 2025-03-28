
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // Parse query parameters if they exist
    const url = new URL(req.url);
    const sector = url.searchParams.get('sector');
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')) : 5;

    // Build the query
    let query = supabase.from('ani_funding_programs').select('*');
    
    // Add filter if sector parameter is provided
    if (sector) {
      query = query.contains('sector_focus', [sector]);
    }
    
    // Add limit
    query = query.limit(limit);
    
    // Execute the query
    const { data, error } = await query;

    if (error) throw error;

    // Log the data for visibility
    console.log('Funding Programs Data:', JSON.stringify(data, null, 2));

    return new Response(JSON.stringify(data), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    });
  } catch (error) {
    console.error('Error fetching funding programs:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    });
  }
});
