
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if API key exists and has the correct format
    if (!openaiApiKey) {
      console.error('OpenAI API Key is missing');
      throw new Error("Missing OpenAI API key. Please configure the OPENAI_API_KEY in your Supabase project secrets.");
    }
    
    // Log API key format (safely)
    console.log(`API key format check: ${openaiApiKey.startsWith('sk-') ? 'starts with sk-' : 'invalid prefix'}, length: ${openaiApiKey.length}`);
    
    if (!openaiApiKey.startsWith('sk-') || openaiApiKey.length < 20) {
      throw new Error("Invalid OpenAI API key format. Please ensure you're using a key from platform.openai.com that starts with 'sk-'");
    }

    const { prompt, chatHistory = [], additionalContext = {} } = await req.json();
    
    if (!prompt) {
      throw new Error("Missing required parameter: prompt");
    }

    console.log('Sending request to OpenAI with model: gpt-4o-mini');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a stable model
        messages: [
          { role: 'system', content: getEnhancedSystemPrompt() },
          ...chatHistory.map((msg: any) => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: enhancePrompt(prompt, additionalContext) }
        ],
        temperature: 0.4,
        max_tokens: 2048,
      }),
    });

    console.log('OpenAI Response Status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenAI API Error:', errorBody);
      throw new Error(`OpenAI API Error (${response.status}): ${errorBody}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      sqlQuery: '',
      results: null
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error in OpenAI chat function:', error);
    return new Response(
      JSON.stringify({
        error: `Failed to generate response: ${error.message || "Unknown error"}`,
        response: "Sorry, there was an error processing your query. The OpenAI API key may be invalid or expired. Please check your API key configuration.",
        sqlQuery: "",
        results: null
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Enhanced system prompt for database queries
function getEnhancedSystemPrompt() {
  return `You are an AI database assistant specialized in research and innovation data. 
  Focus on providing clear, concise insights about funding programs, especially in renewable energy.
  Use precise language and help users understand the context of their database queries.`;
}

// Enhance prompt with additional context
function enhancePrompt(prompt: string, additionalContext: any) {
  const energyKeywords = additionalContext.energyKeywords || [];
  const techKeywords = additionalContext.techKeywords || [];
  const regionKeywords = additionalContext.regionKeywords || [];

  let enhancedPrompt = prompt;
  
  if (energyKeywords.length > 0) {
    enhancedPrompt += `\n\nNote: This query is about renewable energy. Consider these related terms: ${energyKeywords.join(', ')}.`;
  }
  
  if (techKeywords.length > 0) {
    enhancedPrompt += `\n\nTechnology-related context: ${techKeywords.join(', ')}.`;
  }
  
  if (regionKeywords && regionKeywords.length > 0) {
    enhancedPrompt += `\n\nRegion-related context: ${regionKeywords.map(r => r.original).join(', ')}.`;
  }

  return enhancedPrompt;
}
