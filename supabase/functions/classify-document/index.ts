
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, summary, fileName } = await req.json();
    
    // Simple classification logic based on keywords in the title and summary
    // In a real application, you would use a more sophisticated algorithm or ML model
    const text = `${title} ${summary} ${fileName}`.toLowerCase();
    
    let classification = "other";
    
    if (text.includes('patent') || text.includes('intellectual property') || text.includes('propriedade intelectual')) {
      classification = "patent";
    } else if (text.includes('startup') || text.includes('innovation') || text.includes('inovação')) {
      classification = "startup";
    } else if (text.includes('fund') || text.includes('grant') || text.includes('financiamento')) {
      classification = "funding";
    } else if (text.includes('research') || text.includes('paper') || text.includes('pesquisa') || text.includes('estudo')) {
      classification = "research";
    } else if (text.includes('policy') || text.includes('regulation') || text.includes('política') || text.includes('regulamento')) {
      classification = "policy";
    } else if (text.includes('tech') || text.includes('technology') || text.includes('tecnologia')) {
      classification = "technology";
    }
    
    // Return the classification
    return new Response(
      JSON.stringify({ classification }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error classifying document:', error);
    
    return new Response(
      JSON.stringify({ error: error.message, classification: "unclassified" }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
