
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  title: string;
  summary?: string;
  fileName?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { title, summary, fileName } = await req.json() as RequestBody;

    // Prepare content for classification
    const content = [
      `Title: ${title}`,
      summary ? `Summary: ${summary}` : '',
      fileName ? `File: ${fileName}` : ''
    ].filter(Boolean).join('\n');

    console.log('Classification request:', { content });

    // For now, return a simple classification based on keywords
    // This is a fallback since the OpenAI call seems to have issues
    const lowerContent = content.toLowerCase();
    let classification = 'general';
    
    if (lowerContent.includes('fund') || lowerContent.includes('grant') || lowerContent.includes('budget')) {
      classification = 'funding';
    } else if (lowerContent.includes('research') || lowerContent.includes('study') || lowerContent.includes('paper')) {
      classification = 'research';
    } else if (lowerContent.includes('policy') || lowerContent.includes('regulation') || lowerContent.includes('law')) {
      classification = 'policy';
    } else if (lowerContent.includes('tech') || lowerContent.includes('digital') || lowerContent.includes('innovation')) {
      classification = 'technology';
    } else if (lowerContent.includes('data') || lowerContent.includes('metrics') || lowerContent.includes('statistics')) {
      classification = 'data';
    }

    console.log('Classification result:', { content, classification });

    return new Response(JSON.stringify({ classification }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ classification: 'Unclassified', error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
