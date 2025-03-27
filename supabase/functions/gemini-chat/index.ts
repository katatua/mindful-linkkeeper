
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
    const systemPrompt = `
You are an AI database assistant that helps users query and understand data in a research and innovation database.

The database contains the following tables:
1. ani_funding_programs - Information about funding programs for research and innovation
2. ani_projects - Details about specific research projects
3. ani_metrics - Innovation and research metrics data
4. ani_policy_frameworks - Policy frameworks related to innovation
5. ani_international_collaborations - International research partnerships

When users ask questions about the database, you should:
1. Determine what they are looking for
2. Generate appropriate SQL to query the database (only use standard PostgreSQL syntax)
3. Format your response to be clear and helpful

DO NOT include semicolons (;) at the end of your SQL queries as they cause errors in the execution.

Wrap your SQL in <SQL>your query here</SQL> tags
Wrap the results in <RESULTS>your results here</RESULTS> tags

If you can't answer a question or generate a valid SQL query, explain why in Portuguese.
For SQL queries, make sure to REMOVE ANY SEMICOLONS from the end of the query.

Here are examples of questions users might ask and how to respond:
1. Q: "Show me funding programs for renewable energy"
   A: Let me find funding programs related to renewable energy.
      <SQL>
      SELECT name, description, total_budget, application_deadline
      FROM ani_funding_programs
      WHERE 'renewable energy' = ANY(sector_focus)
      </SQL>
      <RESULTS>[results here]</RESULTS>
      
2. Q: "What is the average funding amount for biotech projects?"
   A: Here's the average funding amount for biotech projects:
      <SQL>
      SELECT AVG(funding_amount)
      FROM ani_projects
      WHERE sector ILIKE 'biotech'
      </SQL>
      <RESULTS>[results here]</RESULTS>
    `;

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
      
      // Execute the SQL query
      const { data: queryResult, error: queryError } = await executeQuery(sqlQuery);
      
      if (queryError) {
        // If there's an error, include it in the response
        const errorMessage = queryError.message || "Unknown database error";
        // If there was an error, try to fix it and retry
        console.log("Fixed query still has error:", queryError);
        
        aiResponse = aiResponse.replace(
          /<RESULTS>[\s\S]*?<\/RESULTS>/,
          `<RESULTS>[]</RESULTS>`
        );
        
        // Add error message after the results
        aiResponse += `\n\nOcorreu um erro ao executar a consulta: ${errorMessage}. Por favor, verifique a sintaxe SQL ou reformule sua pergunta.`;
      } else {
        // If successful, include the results in the response
        const formattedResults = JSON.stringify(queryResult || []);
        
        // Replace the RESULTS placeholder with actual results
        if (aiResponse.includes("<RESULTS>")) {
          aiResponse = aiResponse.replace(
            /<RESULTS>[\s\S]*?<\/RESULTS>/,
            `<RESULTS>${formattedResults}</RESULTS>`
          );
        } else {
          // If there's no RESULTS placeholder, add it after the SQL
          aiResponse = aiResponse.replace(
            /<\/SQL>/,
            `</SQL>\n\n<RESULTS>${formattedResults}</RESULTS>`
          );
        }
      }
    }

    // Return the final response
    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: `Failed to generate response: ${error.message || "Unknown error"}`,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
