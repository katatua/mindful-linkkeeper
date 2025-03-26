
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
    // Validate OpenAI API key
    if (!OPENAI_API_KEY || OPENAI_API_KEY.startsWith('sk-proj-')) {
      console.error("Invalid OpenAI API key format");
      return new Response(
        JSON.stringify({ 
          error: "Invalid OpenAI API key configuration. Please set a valid API key for the edge function.",
          response: "I'm sorry, but I couldn't interpret these results due to a configuration issue with the AI service."
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { question, sqlQuery, results } = await req.json();

    if (!results) {
      return new Response(
        JSON.stringify({ error: "Results data is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert results to a formatted string for the AI to summarize
    let resultsText = '';
    if (Array.isArray(results) && results.length > 0) {
      // Create a readable representation of the results
      const keys = Object.keys(results[0]);
      resultsText = `Results (${results.length} rows):\n`;
      
      // Add a header row
      resultsText += keys.join('\t') + '\n';
      
      // Add each row of data (limit to 50 rows to avoid token limits)
      const limitedResults = results.slice(0, 50);
      limitedResults.forEach(row => {
        resultsText += keys.map(key => {
          const value = row[key];
          if (value === null) return 'NULL';
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        }).join('\t') + '\n';
      });
      
      if (results.length > 50) {
        resultsText += `... and ${results.length - 50} more rows\n`;
      }
    } else {
      resultsText = "No results returned from the query.";
    }

    console.log("ResultsText sample:", resultsText.substring(0, 200) + "...");

    // System prompt for result interpretation
    const systemPrompt = `You are an AI assistant for the National Innovation Agency (ANI) database. 
    Your task is to interpret and explain SQL query results in natural language.
    Given a question, the SQL query used, and the results returned, provide a clear, insightful explanation of the data.
    
    IMPORTANT GUIDELINES:
    1. Be concise but comprehensive in your explanation.
    2. Highlight key trends, patterns, or insights in the data.
    3. Provide specific numbers from the results when relevant.
    4. If the results contain values in Euros, specify the currency in your explanation.
    5. Ensure your explanation directly answers the original question.
    6. If relevant, mention any limitations in the data or results.
    7. Use a friendly, professional tone appropriate for a government agency.
    8. Never mention that you're an AI or refer to yourself at all.
    9. When appropriate, describe the time period the data covers.
    10. If the results are related to R&D investment, make sure to highlight this focus in your explanation.
    11. If the results show zero rows or null values, explain that no data was found matching the query criteria.
    12. For numeric results, mention whether values represent totals, averages, or individual measurements.
    13. Use appropriate terminology based on the domain (research, innovation, funding, etc.)`;

    // User prompt combines the question, query, and results
    const userPrompt = `Question: ${question || "What does this data show?"}\n\nSQL Query Used:\n${sqlQuery}\n\n${resultsText}\n\nPlease interpret these results.`;

    console.log("Sending interpretation request to OpenAI");

    try {
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.5,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${errorData}`);
      }

      const data = await response.json();
      const interpretation = data.choices[0].message.content.trim();

      console.log("Generated interpretation:", interpretation.substring(0, 100) + "...");

      return new Response(
        JSON.stringify({ response: interpretation }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (openAiError) {
      console.error("OpenAI API error:", openAiError);
      
      // Return a fallback interpretation when OpenAI fails
      return new Response(
        JSON.stringify({ 
          response: "These results show data from the ANI database based on your query. Due to technical limitations, I'm unable to provide a detailed interpretation at this time.",
          error: openAiError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error("Error interpreting results:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I'm sorry, but I couldn't generate an explanation for these results due to a technical issue."
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
