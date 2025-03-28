
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

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
      return new Response(
        JSON.stringify({
          error: "Missing OpenAI API key",
          response: "Configuration error: OpenAI API key not found.",
          sqlQuery: '',
          results: null
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Validate API key format more strictly
    if (!openaiApiKey.startsWith('sk-proj-') || openaiApiKey.length < 50) {
      console.error('Invalid OpenAI API key format');
      return new Response(
        JSON.stringify({
          error: "Invalid OpenAI API key",
          response: "Configuration error: Invalid API key format.",
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
    
    // Enhanced context extraction
    const energyKeywords = extractEnergyKeywords(prompt);
    const techKeywords = extractTechnologyKeywords(prompt);
    const regionKeywords = extractRegionKeywords(prompt);

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
