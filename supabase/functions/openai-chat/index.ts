
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    // Check if API key exists
    if (!openaiApiKey) {
      console.error('OpenAI API key is missing');
      return new Response(
        JSON.stringify({
          error: "Missing OpenAI API key. Please set the OPENAI_API_KEY secret in Supabase.",
          response: "Configuration error: OpenAI API key not found. Please contact the administrator.",
          sqlQuery: '',
          results: null
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { prompt, chatHistory = [], additionalContext = {} } = await req.json();
    
    if (!prompt) {
      throw new Error("Missing required parameter: prompt");
    }

    console.log('Sending request to OpenAI with model: gpt-4o-mini');
    
    // Enhanced context extraction from shared utilities
    const energyKeywords = extractEnergyKeywords(prompt);
    const techKeywords = extractTechnologyKeywords(prompt);
    const regionKeywords = extractRegionKeywords(prompt);
    
    console.log('Energy keywords:', energyKeywords);
    console.log('Technology keywords:', techKeywords);
    console.log('Region keywords:', regionKeywords);

    try {
      // Using fetch with the API key in the Authorization header
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
            { role: 'user', content: enhancePrompt(prompt, { 
              energyKeywords, 
              techKeywords, 
              regionKeywords 
            }) }
          ],
          temperature: 0.4,
          max_tokens: 2048,
        }),
      });

      console.log('OpenAI Response Status:', response.status);

      if (response.status === 401) {
        const errorBody = await response.text();
        console.error('OpenAI API Authentication Error:', errorBody);
        return new Response(
          JSON.stringify({
            error: "OpenAI API Authentication Error. The API key appears to be invalid or expired.",
            response: "There was an authentication error with the OpenAI API. Please ensure you're using a valid API key from platform.openai.com.",
            sqlQuery: '',
            results: null
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } else if (!response.ok) {
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
    } catch (openAIError) {
      console.error('Error calling OpenAI API:', openAIError);
      
      // Check for rate limiting
      if (openAIError.message && openAIError.message.includes('429')) {
        return new Response(
          JSON.stringify({
            error: `Rate limit exceeded: ${openAIError.message}`,
            response: "The OpenAI API rate limit has been reached. Please try again in a few moments.",
            sqlQuery: "",
            results: null
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      throw openAIError; // Let the outer catch handle other errors
    }
  } catch (error) {
    console.error('Error in OpenAI chat function:', error);
    return new Response(
      JSON.stringify({
        error: `Failed to generate response: ${error.message || "Unknown error"}`,
        response: "Sorry, there was an error processing your query. This could be due to an invalid OpenAI API key or a temporary service issue. Please try using the Gemini provider instead by changing the AI provider in the settings dropdown.",
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

// Helper functions for context extraction
function extractEnergyKeywords(query: string): string[] {
  const lowercaseQuery = query.toLowerCase();
  const energyTerms = [
    'renewable energy', 'clean energy', 'green energy', 
    'sustainable energy', 'alternative energy',
    'solar', 'wind', 'hydro', 'biomass', 'geothermal'
  ];
  return energyTerms.filter(term => lowercaseQuery.includes(term));
}

function extractTechnologyKeywords(query: string): string[] {
  const lowercaseQuery = query.toLowerCase();
  const techTerms = [
    'technology', 'tech', 'digital', 'software', 
    'ai', 'artificial intelligence', 'machine learning'
  ];
  return techTerms.filter(term => lowercaseQuery.includes(term));
}

function extractRegionKeywords(query: string): string[] {
  const lowercaseQuery = query.toLowerCase();
  const regionTerms = [
    'lisbon', 'porto', 'north', 'south', 
    'algarve', 'azores', 'madeira'
  ];
  return regionTerms.filter(term => lowercaseQuery.includes(term));
}

function getEnhancedSystemPrompt() {
  return `You are an AI database assistant specialized in renewable energy funding programs. 
  Provide clear, concise insights about funding opportunities in the renewable energy sector.`;
}

function enhancePrompt(prompt: string, context: any) {
  let enhancedPrompt = prompt;
  
  if (context.energyKeywords.length > 0) {
    enhancedPrompt += `\n\nNote: Renewable energy context includes terms: ${context.energyKeywords.join(', ')}.`;
  }
  
  if (context.techKeywords.length > 0) {
    enhancedPrompt += `\n\nTechnology context: ${context.techKeywords.join(', ')}.`;
  }
  
  if (context.regionKeywords.length > 0) {
    enhancedPrompt += `\n\nRegional context: ${context.regionKeywords.join(', ')}.`;
  }

  return enhancedPrompt;
}
