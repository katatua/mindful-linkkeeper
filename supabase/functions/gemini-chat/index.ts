
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

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

function formatNaturalLanguageResponse(originalQuestion: string, message: string, results: any[] | null, sqlQuery: string): string {
  // Start with the original question
  let formattedResponse = `${originalQuestion}\n\n`;
  
  // If there are no results, show a message and return early
  if (!results || results.length === 0) {
    return `${formattedResponse}**Não foram encontrados resultados para esta consulta.**`;
  }
  
  // Add a brief introduction
  const briefIntro = message.split('.')[0] + '.';
  formattedResponse += `${briefIntro}\n\n`;
  
  // Add the Results section with formatted table
  formattedResponse += "**Resultados:**\n";
  
  // Create a formatted table for the results
  if (results.length > 0) {
    // Generate table headers
    const headers = Object.keys(results[0]);
    formattedResponse += headers.join('\t') + '\n';
    
    // Generate table rows (limited to 10 for readability)
    const displayResults = results.slice(0, 10);
    displayResults.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (Array.isArray(value)) return value.join(', ');
        return String(value);
      });
      formattedResponse += values.join('\t') + '\n';
    });
    
    // Indicate if there are more results
    if (results.length > 10) {
      formattedResponse += `\n*Mostrando 10 dos ${results.length} resultados encontrados.*\n`;
    }
  }
  
  // Add the rest of the explanatory text after the results table
  if (message.length > briefIntro.length) {
    formattedResponse += `\n${message.substring(briefIntro.length).trim()}\n\n`;
  }
  
  // Add a summary section with bullet points
  formattedResponse += "**Resumo dos Resultados:**\n\n";
  
  const displayResults = results.slice(0, 5); // Limit to 5 for the summary
  displayResults.forEach((item, index) => {
    const itemDetails = Object.entries(item)
      .map(([key, value]) => {
        if (value === null || value === undefined) return null;
        if (Array.isArray(value)) return `${key}: ${value.join(', ')}`;
        return `${key}: ${value}`;
      })
      .filter(Boolean)
      .join(', ');
    
    formattedResponse += `• Resultado ${index + 1}: ${itemDetails}\n`;
  });
  
  // Add the SQL query at the end
  formattedResponse += `\nSQL Query:\n${sqlQuery}\n`;
  
  return formattedResponse;
}

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

You are a helpful assistant specialized in Portuguese language interactions about research and innovation data.

When users ask questions, even in Portuguese, you should:
1. Generate appropriate SQL to query the database (only use standard PostgreSQL syntax)
2. Format your response to be clear, concise and helpful, focusing on insights from the data
3. Always present the information in Portuguese, as this is a Portuguese database

DO NOT include semicolons (;) at the end of your SQL queries as they cause errors in the execution.

Wrap your SQL in <SQL>your query here</SQL> tags

If you can't answer a question or generate a valid SQL query, explain why in Portuguese.
For SQL queries, make sure to REMOVE ANY SEMICOLONS from the end of the query.

Your main goal is to provide CLEAR INSIGHTS about the data, not just raw data. Explain patterns, notable details, and summarize the information.

For R&D (Pesquisa e Desenvolvimento) questions:
- Look for metrics related to research investment
- Check funding amounts in the projects table
- Consider programs focused on research and innovation
- Use SUM, AVG, and other aggregate functions to provide meaningful insights

For time-based queries (like "2023"), be sure to:
- Filter date fields appropriately using EXTRACT(YEAR FROM date_field) = year
- For projects, check both start_date and end_date
- For metrics, use measurement_date

When searching for topics like R&D:
- Try multiple variations: 'R&D', 'Research and Development', 'Pesquisa e Desenvolvimento'
- Use the ILIKE operator with wildcards for partial matching
- Check in name, description, and other text fields

Special instructions for Portuguese queries:
- Recognize terms like "investimento" (investment), "pesquisa" (research), "desenvolvimento" (development)
- Use appropriate currency formatting for values in EUR
- Ensure your responses maintain formal Portuguese with proper grammar

Here are examples of questions users might ask and how to respond:
1. Q: "Qual o investimento em R&D em 2023?"
   A: Para encontrar o investimento em Pesquisa e Desenvolvimento em 2023:
      <SQL>
      SELECT SUM(funding_amount) as total_investimento
      FROM ani_projects 
      WHERE EXTRACT(YEAR FROM start_date) = 2023 
      AND (sector ILIKE '%research%' OR sector ILIKE '%R&D%' OR sector ILIKE '%desenvolvimento%')
      </SQL>
      
2. Q: "Quais são os programas de financiamento para energia renovável?"
   A: Estes são os programas de financiamento relacionados à energia renovável:
      <SQL>
      SELECT name, description, total_budget, application_deadline, funding_type
      FROM ani_funding_programs
      WHERE ARRAY_TO_STRING(sector_focus, ',') ILIKE '%renewable%' 
         OR ARRAY_TO_STRING(sector_focus, ',') ILIKE '%energy%'
         OR ARRAY_TO_STRING(sector_focus, ',') ILIKE '%energia%'
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
    const { prompt, chatHistory = [], additionalContext = {} } = await req.json();
    
    // Get the AI model to use
    const model = await getAIModel();
    console.log(`Making request to Gemini API with model: ${model}`);

    // Create a system prompt that explains the database schema
    const systemPrompt = getEnhancedSystemPrompt();

    // If this is a renewable energy query, add extra context to the user prompt
    const energyKeywords = additionalContext.energyKeywords || [];
    let enhancedPrompt = prompt;
    
    if (energyKeywords.length > 0) {
      console.log("Energy-related query detected with keywords:", energyKeywords);
      enhancedPrompt = `${prompt}\n\nNote: This query is about renewable energy. Consider these related terms when searching the database: ${energyKeywords.join(', ')}. Use flexible matching with ILIKE and wildcards.`;
    }

    // Detect language to improve prompt
    const isPortuguese = (/[áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/.test(prompt) || 
                         /\b(qual|como|onde|quem|porque|quais|quando)\b/i.test(prompt));
    
    if (isPortuguese) {
      console.log("Portuguese query detected");
      enhancedPrompt = `${prompt}\n\nNote: This query is in Portuguese. Please respond in Portuguese and use appropriate SQL operations for any date fields and text searches.`;
    }

    // Construct the conversation
    const messages = [
      { role: "user", parts: [{ text: systemPrompt }] },
      // Include chat history
      ...chatHistory.map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
      // Add the new user prompt
      { role: "user", parts: [{ text: enhancedPrompt }] },
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
            temperature: 0.3,
            topP: 0.95,
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
        const naturalLanguageResponse = formatNaturalLanguageResponse(
          prompt, // Pass the original question
          cleanResponse, 
          formattedResults, 
          sqlQuery
        );
        
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
