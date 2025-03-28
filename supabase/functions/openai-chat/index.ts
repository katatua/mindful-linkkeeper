
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

async function executeQuery(query: string): Promise<{ data: any; error: any }> {
  try {
    console.log("Executing SQL query:", query);

    // Remove semicolons from the end of the query which can cause issues
    const cleanQuery = query.trim().replace(/;$/, '');
    
    // Execute the query using the SQL function that only allows SELECT
    const { data, error } = await supabase.rpc('execute_sql_query', {
      sql_query: cleanQuery
    });

    if (error) {
      console.error("SQL query execution error:", error);
      return { data: null, error };
    }

    console.log("Query executed successfully, data:", data ? data.slice(0, 2) : "no data");
    return { data, error: null };
  } catch (error) {
    console.error("Error executing query:", error);
    return { data: null, error };
  }
}

function getEnhancedSystemPrompt() {
  return `
You are an AI database assistant that helps users query and understand data in a research and innovation database.

The database contains the following tables:
1. ani_funding_programs - Information about funding programs for research and innovation
   - id, name, description, total_budget, application_deadline, end_date, sector_focus (array), funding_type, success_rate
   
2. ani_projects - Details about specific research projects
   - id, title, description, funding_amount, start_date, end_date, status, sector, region, organization
   
3. ani_metrics - Innovation and research metrics
   - id, name, category, value, unit, measurement_date, region, sector, source
   
4. ani_policy_frameworks - Policy frameworks related to innovation
   - id, title, description, implementation_date, status, key_objectives (array)
   
5. ani_international_collaborations - International research partnerships
   - id, program_name, country, partnership_type, focus_areas (array), start_date, end_date, total_budget

When users ask questions about the database, you should:
1. Generate appropriate SQL to query the database (only use standard PostgreSQL syntax)
2. Format your response to be clear, concise and helpful, focusing on insights from the data
3. Always present the information in Portuguese, as this is a Portuguese database

Wrap your SQL in <SQL>your query here</SQL> tags

If you can't answer a question or generate a valid SQL query, explain why in Portuguese.
For SQL queries, make sure to REMOVE ANY SEMICOLONS from the end of the query.

Your main goal is to provide CLEAR INSIGHTS about the data, not just raw data. Explain patterns, notable details, and summarize the information.
`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { prompt, chatHistory = [], additionalContext = {} } = await req.json();
    
    console.log(`Making request to OpenAI API with model: gpt-4o-2024-11-20`);

    // Create a system prompt that explains the database schema
    const systemPrompt = getEnhancedSystemPrompt();

    // Extract any context provided by the client
    const energyKeywords = additionalContext.energyKeywords || [];
    const techKeywords = additionalContext.techKeywords || [];
    const regionKeywords = additionalContext.regionKeywords || [];
    
    let enhancedPrompt = prompt;
    
    // Add energy-related context if relevant
    if (energyKeywords.length > 0) {
      console.log("Energy-related query detected with keywords:", energyKeywords);
      enhancedPrompt = `${prompt}\n\nNote: This query is about renewable energy. Consider these related terms when searching the database: ${energyKeywords.join(', ')}. Use flexible matching with ILIKE and wildcards.`;
    }
    
    // Add technology-related context if relevant
    if (techKeywords.length > 0) {
      console.log("Technology-related query detected with keywords:", techKeywords);
      enhancedPrompt = `${enhancedPrompt}\n\nNote: This query is about technology. Consider these related terms when searching the database: ${techKeywords.join(', ')}. Use flexible matching with ILIKE and wildcards.`;
    }
    
    // Add region-related context if relevant
    if (regionKeywords.length > 0) {
      console.log("Region-related query detected with regions:", regionKeywords.map(r => r.original));
      
      // Create an enhanced prompt that lists all the region variations to try
      const regionVariationsPrompt = regionKeywords.map(region => {
        return `For "${region.original}" region, use these variations: ${region.variations.join(', ')}`;
      }).join('. ');
      
      enhancedPrompt = `${enhancedPrompt}\n\nNote: This query involves specific regions or cities. ${regionVariationsPrompt}. Use ILIKE with OR conditions to match all possible variations.`;
    }

    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-2024-11-20',
        messages: [
          { role: 'system', content: systemPrompt },
          // Include chat history
          ...chatHistory.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
          // Add the enhanced user prompt
          { role: 'user', content: enhancedPrompt }
        ],
        temperature: 0.4,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      throw new Error(`OpenAI API Error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    let aiResponse = result.choices[0].message.content;

    // Extract SQL query if present in the response
    const sqlMatch = aiResponse.match(/<SQL>([\s\S]*?)<\/SQL>/);
    if (sqlMatch && sqlMatch[1]) {
      const sqlQuery = sqlMatch[1].trim();
      console.log("Extracted SQL query:", sqlQuery);
      
      // Execute the SQL query
      const { data: queryResult, error: queryError } = await executeQuery(sqlQuery);
      
      if (queryError) {
        // If there's an error, include it in the response
        const errorMessage = queryError.message || "Unknown database error";
        console.log("Query execution error:", errorMessage);
        
        // Create an explanatory message
        const errorResponse = `Ocorreu um erro ao executar a consulta: ${errorMessage}. Por favor, verifique a sintaxe SQL ou reformule sua pergunta.`;
        
        // Return the response with the SQL query and error message
        return new Response(JSON.stringify({ 
          response: aiResponse.replace(/<SQL>[\s\S]*?<\/SQL>/, `<SQL>${sqlQuery}</SQL>`),
          sqlQuery: sqlQuery,
          results: null,
          error: errorMessage
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        // If successful, include the results
        const formattedResults = queryResult || [];
        console.log("Query execution results count:", formattedResults.length);
        
        // Remove the SQL tags from the AI response
        const cleanResponse = aiResponse.replace(/<SQL>[\s\S]*?<\/SQL>/, '').trim();
        
        // Return the response with the SQL query and results
        return new Response(JSON.stringify({ 
          response: cleanResponse,
          sqlQuery: sqlQuery,
          results: formattedResults
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Return the response (if no SQL was found)
    return new Response(JSON.stringify({ 
      response: aiResponse,
      sqlQuery: '',
      results: null
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: `Failed to generate response: ${error.message || "Unknown error"}`,
        response: "Desculpe, houve um erro ao processar sua consulta. Por favor, tente novamente com uma pergunta diferente.",
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
