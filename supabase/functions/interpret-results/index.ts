
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

// Set up CORS headers
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
    const { question, sqlQuery, results } = await req.json();

    if (!results || !Array.isArray(results)) {
      return new Response(
        JSON.stringify({ error: "Results must be provided as an array" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If the results are empty, return a simple message
    if (results.length === 0) {
      return new Response(
        JSON.stringify({ response: "I couldn't find any data matching your query." }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a system prompt for interpreting the results
    const systemPrompt = `You are an expert data analyst for the National Innovation Agency (ANI).
    Your task is to explain SQL query results in natural language.
    
    Guidelines:
    1. Provide a concise, clear explanation of what the data shows.
    2. Highlight key insights, patterns, or trends in the data.
    3. Mention specific numbers and metrics when relevant.
    4. If the data spans multiple years, mention changes over time.
    5. Keep explanations conversational but informative.
    6. If the data is from a specific region or sector, mention this context.
    7. Limit your response to 1-3 paragraphs at most.
    8. Don't just list all values - synthesize and interpret the information.
    9. If there are outliers or unusual patterns, point them out.`;

    // Prepare the user prompt with the query and results
    const userPrompt = `
    Original question: ${question}
    
    SQL query executed: 
    ${sqlQuery}
    
    Query results (${results.length} rows):
    ${JSON.stringify(results, null, 2)}
    
    Please provide a natural language explanation of these results.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a smaller model for cost efficiency
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const data = await response.json();
    const explanation = data.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({ response: explanation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error interpreting results:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
