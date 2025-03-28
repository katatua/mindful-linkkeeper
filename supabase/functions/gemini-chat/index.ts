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

// Function to get the current Gemini model from database settings
async function getCurrentGeminiModel(): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('get_database_setting', {
      setting_key: 'gemini_model'
    });
    
    if (error) {
      console.error("Error fetching Gemini model:", error.message);
      return 'gemini-2.5-pro-exp-03-25'; // Default model
    }
    
    return data || 'gemini-2.5-pro-exp-03-25';
  } catch (error) {
    console.error("Error in getCurrentGeminiModel:", error);
    return 'gemini-2.5-pro-exp-03-25';
  }
}

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
  let formattedResponse = `${originalQuestion}\n`;
  
  // Extract a brief introduction (first sentence)
  const briefIntro = message.split('.')[0] + '.';
  formattedResponse += `${briefIntro}\n\n`;
  
  // If there are no results, show a message and return early
  if (!results || results.length === 0) {
    return `${formattedResponse}**Não foram encontrados resultados para esta consulta.**`;
  }
  
  // Add the Results section with formatted table immediately after the brief intro
  formattedResponse += "**Resultados:**\n";
  
  // Create a formatted table for the results right at the top
  if (results.length > 0) {
    // Generate table headers
    const headers = Object.keys(results[0]);
    formattedResponse += headers.join('\t') + '\n';
    
    // Generate table rows
    results.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (Array.isArray(value)) return value.join(', ');
        return String(value);
      });
      formattedResponse += values.join('\t') + '\n';
    });
  }
  
  // Add the rest of the explanatory text after the results table
  if (message.length > briefIntro.length) {
    formattedResponse += `\n${message.substring(briefIntro.length).trim()}\n\n`;
  }
  
  // Add domain-specific context for energy-related queries
  if (message.includes("energia renovável") || 
      sqlQuery.toLowerCase().includes("energy") || 
      sqlQuery.toLowerCase().includes("renewable")) {
    formattedResponse += "**Informações adicionais:**\n";
    formattedResponse += "Estes programas apoiam tipicamente o desenvolvimento e implementação de tecnologias como solar, eólica, hídrica, biomassa e geotérmica. Os tipos de financiamento comuns incluem subvenções, empréstimos e incentivos fiscais, alinhados com os objetivos de Portugal de atingir 80% de eletricidade renovável até 2030 e com o Pacto Ecológico Europeu.\n\n";
  }
  
  // Add domain-specific context for technology-related queries
  if (message.includes("tecnologia") || 
      sqlQuery.toLowerCase().includes("tech") || 
      sqlQuery.toLowerCase().includes("digital") ||
      sqlQuery.toLowerCase().includes("software")) {
    formattedResponse += "**Informações adicionais sobre o setor tecnológico:**\n";
    formattedResponse += "O setor de tecnologia em Portugal tem crescido significativamente, com foco em áreas como inteligência artificial, software, fintech e cibersegurança. Os projetos tecnológicos geralmente recebem financiamento através de programas governamentais, fundos europeus e investimento privado. A estratégia nacional Portugal Digital 2030 visa aumentar a competitividade tecnológica do país.\n\n";
  }
  
  // Add a summary section with bullet points
  formattedResponse += "**Resumo dos Resultados:**\n\n";
  
  results.forEach((item, index) => {
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
   
3. ani_metrics - Innovation and research metrics
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

When users ask about technology sector projects, be flexible in your search:
- Include related terms like 'digital', 'software', 'hardware', 'IT', 'telecommunications', 'computing'
- For AI-related searches include 'artificial intelligence', 'machine learning', 'data science', 'analytics'
- For emerging tech include 'blockchain', 'IoT', 'internet of things', 'robotics', 'automation'
- For specific industries include 'fintech', 'healthtech', 'cybersecurity', 'cloud computing'
- Use ILIKE operator with wildcards for partial matching when searching technology fields

When users ask about regions or cities, handle different naming variations:
- For Lisbon/Lisboa queries, search for both spellings: region ILIKE '%lisbon%' OR region ILIKE '%lisboa%'
- For Porto/Oporto, search for both variations 
- For North/Norte region, handle both English and Portuguese terms
- Always use pattern matching with wildcards for flexibility in region names
- Consider common misspellings and abbreviations

When users ask questions about the database, you should:
1. Generate appropriate SQL to query the database (only use standard PostgreSQL syntax)
2. Format your response to be clear, concise and helpful, focusing on insights from the data
3. Always present the information in Portuguese, as this is a Portuguese database

DO NOT include semicolons (;) at the end of your SQL queries as they cause errors in the execution.

Wrap your SQL in <SQL>your query here</SQL> tags

If you can't answer a question or generate a valid SQL query, explain why in Portuguese.
For SQL queries, make sure to REMOVE ANY SEMICOLONS from the end of the query.

Your main goal is to provide CLEAR INSIGHTS about the data, not just raw data. Explain patterns, notable details, and summarize the information.

For energy/renewable energy topics, be flexible in your search. Consider these variations:
- For ENERGY searches include 'renewable energy', 'clean energy', 'green energy', 'sustainable energy', 'alternative energy'
- For specific TECHNOLOGIES include 'solar', 'wind', 'hydro', 'hydroelectric', 'biomass', 'geothermal', 'tidal'
- Other relevant terms: 'photovoltaic', 'renewable', 'clean power', 'green power', 'sustainability'

When searching for renewable energy in arrays, use the ILIKE operator with wildcards for partial matching.

Here are examples of questions users might ask and how to respond:
1. Q: "Show me funding programs for renewable energy"
   A: Aqui estão os programas de financiamento relacionados à energia renovável:
      <SQL>
      SELECT name, description, total_budget, application_deadline, funding_type
      FROM ani_funding_programs
      WHERE ARRAY_TO_STRING(sector_focus, ',') ILIKE '%renewable%' 
         OR ARRAY_TO_STRING(sector_focus, ',') ILIKE '%energy%'
         OR ARRAY_TO_STRING(sector_focus, ',') ILIKE '%solar%'
         OR ARRAY_TO_STRING(sector_focus, ',') ILIKE '%wind%'
      </SQL>
      
2. Q: "What is the average funding amount for biotech projects?"
   A: O valor médio de financiamento para projetos de biotecnologia é:
      <SQL>
      SELECT AVG(funding_amount)
      FROM ani_projects
      WHERE sector ILIKE 'biotech'
      </SQL>
      
3. Q: "Show me the top 5 projects with highest funding amounts in the technology sector"
   A: Aqui estão os 5 principais projetos no setor de tecnologia com os maiores montantes de financiamento:
      <SQL>
      SELECT title, funding_amount
      FROM ani_projects
      WHERE sector ILIKE '%tech%' 
         OR sector ILIKE '%digital%'
         OR sector ILIKE '%software%'
         OR sector ILIKE '%IT%'
         OR sector ILIKE '%computing%'
      ORDER BY funding_amount DESC
      LIMIT 5
      </SQL>
      
4. Q: "What are the innovation metrics for the Lisbon region from 2024?"
   A: Aqui estão as métricas de inovação para a região de Lisboa em 2024:
      <SQL>
      SELECT name, category, value, unit, measurement_date
      FROM ani_metrics
      WHERE (region ILIKE '%lisbon%' OR region ILIKE '%lisboa%')
        AND EXTRACT(YEAR FROM measurement_date) = 2024
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
