
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import * as GoogleAuth from "https://deno.land/x/googlejwtsa@v0.1.5/mod.ts";

const googleApiKey = Deno.env.get('GEMINI_API_KEY');
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

async function getAIModel(): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('get_database_setting', {
      setting_key: 'ai_model'
    });
    
    if (error) throw error;
    return data || 'gemini-2.5-pro-exp-03-25';
  } catch (error) {
    console.error('Error fetching AI model:', error);
    return 'gemini-2.5-pro-exp-03-25';
  }
}

function formatNaturalLanguageResponse(message: string, results: any[] | null): string {
  if (!results || results.length === 0) {
    return message + "\n\nNão foram encontrados resultados para esta consulta.";
  }

  // Extract a sample of results for the summary
  const resultCount = results.length;
  const sampleSize = Math.min(resultCount, 3);
  const sample = results.slice(0, sampleSize);
  
  // Format key points from the results
  let keyPoints = "";
  
  // For a small number of results, list them directly
  if (resultCount <= 10) {
    sample.forEach((item, index) => {
      const itemDesc = Object.entries(item)
        .filter(([key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
          // Format array values nicely
          if (Array.isArray(value)) {
            return `${key}: ${value.join(', ')}`;
          }
          return `${key}: ${value}`;
        })
        .join(', ');
      keyPoints += `\n• Resultado ${index + 1}: ${itemDesc}`;
    });
    
    if (resultCount > sampleSize) {
      keyPoints += `\n... e mais ${resultCount - sampleSize} resultados.`;
    }
  } else {
    // For many results, just summarize
    keyPoints = `Foram encontrados ${resultCount} resultados.`;
    
    // Add a brief summary of the first few results
    sample.forEach((item, index) => {
      const keys = Object.keys(item);
      const mainKey = keys[0] || "item";
      keyPoints += `\n• ${mainKey}: ${item[mainKey]}`;
    });
    
    keyPoints += `\n... e mais ${resultCount - sampleSize} resultados.`;
  }
  
  return `${message}\n\n**Resumo dos Resultados:**\n${keyPoints}`;
}

// Add specific knowledge about renewable energy programs
function getEnhancedSystemPrompt() {
  return `
You are an AI database assistant that helps users query and understand data in a research and innovation database.

The database contains the following tables:
1. ani_funding_programs - Information about funding programs for research and innovation
   - id, name, description, total_budget, application_deadline, end_date, sector_focus (array), funding_type
   
2. ani_projects - Details about specific research projects
   - id, title, description, funding_amount, start_date, end_date, status, sector, region, organization
   
3. ani_metrics - Innovation and research metrics data
   - id, name, category, value, unit, measurement_date, region, sector, source
   
4. ani_policy_frameworks - Policy frameworks related to innovation
   - id, title, description, implementation_date, status, key_objectives (array)
   
5. ani_international_collaborations - International research partnerships
   - id, program_name, country, partnership_type, focus_areas (array), start_date, end_date, total_budget

When users ask about renewable energy programs, here are some key details to include:
- Renewable energy programs often focus on solar, wind, hydroelectric, biomass, and geothermal technologies
- Common funding types include grants, loans, tax incentives, and equity investments
- Portugal has set a target of 80% renewable electricity by 2030
- Important metrics include: CO2 emissions avoided, energy capacity installed (MW), and cost per kWh
- The European Green Deal and Portugal's National Energy and Climate Plan are key policy frameworks
- Funding success rates for renewable energy projects range from 25-40% depending on program competitiveness

When users ask questions about the database, you should:
1. Generate appropriate SQL to query the database (only use standard PostgreSQL syntax)
2. Format your response to be clear, concise and helpful, focusing on insights from the data
3. Always present the information in Portuguese, as this is a Portuguese database

DO NOT include semicolons (;) at the end of your SQL queries as they cause errors in the execution.

Wrap your SQL in <SQL>your query here</SQL> tags

If you can't answer a question or generate a valid SQL query, explain why in Portuguese.
For SQL queries, make sure to REMOVE ANY SEMICOLONS from the end of the query.

Your main goal is to provide CLEAR INSIGHTS about the data, not just raw data. Explain patterns, notable details, and summarize the information.

Here are examples of questions users might ask and how to respond:
1. Q: "Show me funding programs for renewable energy"
   A: Aqui estão os programas de financiamento relacionados à energia renovável:
      <SQL>
      SELECT name, description, total_budget, application_deadline
      FROM ani_funding_programs
      WHERE 'renewable energy' = ANY(sector_focus)
      </SQL>
      
2. Q: "What is the average funding amount for biotech projects?"
   A: O valor médio de financiamento para projetos de biotecnologia é:
      <SQL>
      SELECT AVG(funding_amount)
      FROM ani_projects
      WHERE sector ILIKE 'biotech'
      </SQL>
    `;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { prompt, chatHistory = [] } = await req.json();
    
    // Get the AI model to use
    const model = await getAIModel();
    console.log(`Making request to Gemini API with model: ${model}`);

    // Create a system prompt that explains the database schema
    const systemPrompt = getEnhancedSystemPrompt();

    // Construct the conversation
    const messages = [
      { role: "user", parts: [{ text: systemPrompt }] },
      // Include chat history
      ...chatHistory.map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
      // Add the new user prompt
      { role: "user", parts: [{ text: prompt }] },
    ];

    // Make request to Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${googleApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.4,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API error:", error);
      throw new Error(`Gemini API Error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    let aiResponse = result.candidates[0].content.parts[0].text;

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
        // If successful, format the results in a natural language response
        const formattedResults = queryResult || [];
        console.log("Query execution results count:", formattedResults.length);
        
        // Remove the SQL tags from the AI response to prepare for formatting
        const cleanResponse = aiResponse.replace(/<SQL>[\s\S]*?<\/SQL>/, '').trim();
        
        // Create a formatted natural language response with insights from the data
        const naturalLanguageResponse = formatNaturalLanguageResponse(cleanResponse, formattedResults);
        
        // Return the response with the SQL query and results
        return new Response(JSON.stringify({ 
          response: naturalLanguageResponse,
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
