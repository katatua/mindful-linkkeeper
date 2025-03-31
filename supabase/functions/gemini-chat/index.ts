
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const googleApiKey = Deno.env.get('GEMINI_API_KEY');

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getAIModel(): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('get_database_setting', {
      setting_key: 'ai_model'
    });
    
    if (error) throw error;
    // Return a more reliable model name instead of the experimental one
    return data || 'gemini-1.5-pro';
  } catch (error) {
    console.error('Error fetching AI model:', error);
    return 'gemini-1.5-pro';
  }
}

async function generateSQL(query: string): Promise<any> {
  try {
    console.log("Generating SQL for query:", query);
    
    // Get the AI model to use
    const modelName = await getAIModel();
    
    if (!googleApiKey) {
      console.error("GEMINI_API_KEY is not set");
      return {
        message: "Incomplete setup: The Gemini API key is not configured.",
        sqlQuery: "",
        results: null,
        error: true
      };
    }

    // Define the prompt template for SQL generation
    const promptTemplate = `
      Você é um assistente especializado em converter perguntas em português para consultas SQL.
      
      Você tem acesso às seguintes tabelas:
      
      - ani_funding_programs: Programas de financiamento para pesquisa e inovação
      - ani_projects: Projetos de pesquisa e inovação financiados
      - ani_metrics: Métricas e estatísticas de inovação
      - ani_researchers: Pesquisadores e cientistas
      - ani_institutions: Instituições de pesquisa e empresas
      - ani_patent_holders: Titulares de patentes
      - ani_policy_frameworks: Estruturas de políticas de inovação
      - ani_international_collaborations: Colaborações internacionais de pesquisa
      - ani_funding_applications: Candidaturas a programas de financiamento
      - ani_startups: Startups e empresas inovadoras
      - ani_tech_adoption: Adoção de tecnologias por setor
      - ani_innovation_networks: Redes de inovação e colaboração
      - ani_innovation_policies: Políticas de inovação implementadas
      - ani_research_publications: Publicações científicas e acadêmicas
      
      A seguir está uma pergunta em português: "${query}"
      
      Por favor, converta esta pergunta em uma consulta SQL que possa ser executada contra as tabelas descritas.
      Forneça apenas a instrução SQL sem explicações adicionais.
    `;
    
    // Make the API call to Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: promptTemplate }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error from Gemini API:", errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the generated SQL from the response
    let generatedSQL = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Clean up the SQL (remove markdown code blocks if present)
    generatedSQL = generatedSQL.replace(/```sql\s*|\s*```/g, '').trim();
    
    // Attempt to diagnose and fix common SQL generation issues
    if (!generatedSQL || generatedSQL.length < 10) {
      throw new Error("Generated SQL is empty or too short");
    }
    
    // Log the generated SQL for debugging
    console.log("Generated SQL:", generatedSQL);
    
    return {
      message: "SQL generated successfully",
      sqlQuery: generatedSQL
    };
  } catch (error) {
    console.error("Error generating SQL:", error);
    return {
      message: `Error generating SQL: ${error.message}`,
      sqlQuery: "",
      error: true
    };
  }
}

// Function to execute SQL and return results
async function executeSQL(sql: string): Promise<any> {
  try {
    console.log("Executing SQL:", sql);
    
    // Execute the SQL query using rpc function
    const { data, error } = await supabase.rpc('execute_sql_query', {
      sql_query: sql
    });
    
    if (error) {
      console.error("SQL execution error:", error);
      throw error;
    }
    
    console.log("SQL execution result:", data);
    
    return {
      message: "Query executed successfully",
      results: data,
      noResults: Array.isArray(data) && data.length === 0
    };
  } catch (error) {
    console.error("Error executing SQL:", error);
    return {
      message: `Error executing SQL: ${error.message}`,
      results: null,
      error: true
    };
  }
}

// Function to generate a natural language response based on the results
async function generateResponse(query: string, sqlQuery: string, results: any[]): Promise<string> {
  try {
    console.log("Generating response for:", query);
    
    // Get the AI model to use
    const modelName = await getAIModel();
    
    if (!googleApiKey) {
      console.error("GEMINI_API_KEY is not set");
      return "Não foi possível gerar uma resposta devido a problemas de configuração.";
    }
    
    // Create a prompt that includes the original query, SQL, and results
    const resultsString = JSON.stringify(results, null, 2);
    const promptTemplate = `
      Você é um assistente que responde perguntas sobre dados de inovação e pesquisa em Portugal.
      
      Pergunta original: "${query}"
      
      Consulta SQL executada: ${sqlQuery}
      
      Resultados (${results.length} registros): ${resultsString}
      
      Por favor, gere uma resposta em português que:
      1. Responda diretamente à pergunta com base nos resultados
      2. Destaque os pontos principais dos dados
      3. Seja clara e informativa
      4. Use linguagem natural e profissional
      5. Seja concisa (máximo de 200 palavras)
      
      Não mencione que você está analisando resultados de uma consulta SQL.
    `;
    
    // Make the API call to Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: promptTemplate }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error from Gemini API:", errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the generated response
    const generatedResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                             "Não foi possível gerar uma resposta para esta consulta.";
    
    console.log("Generated response:", generatedResponse);
    
    return generatedResponse;
  } catch (error) {
    console.error("Error generating response:", error);
    return `Desculpe, encontrei um problema ao analisar os resultados: ${error.message}`;
  }
}

// Main handler function for the edge function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const requestData = await req.json();
    const { query = '' } = requestData;

    if (!query) {
      return new Response(
        JSON.stringify({ 
          message: 'Nenhuma consulta fornecida',
          sqlQuery: '',
          results: null,
          error: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const queryId = crypto.randomUUID();
    
    // Generate SQL from the query
    const sqlResult = await generateSQL(query);
    
    if (sqlResult.error) {
      return new Response(
        JSON.stringify({
          ...sqlResult,
          queryId
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Execute the generated SQL
    const executionResult = await executeSQL(sqlResult.sqlQuery);
    
    if (executionResult.error) {
      return new Response(
        JSON.stringify({
          ...executionResult,
          sqlQuery: sqlResult.sqlQuery,
          queryId
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    let responseMessage;
    
    if (executionResult.noResults) {
      responseMessage = "Não encontrei dados correspondentes à sua consulta. Você pode tentar reformular sua pergunta ou explorar outro tema.";
    } else {
      // Generate a natural language response based on the results
      responseMessage = await generateResponse(query, sqlResult.sqlQuery, executionResult.results);
    }
    
    return new Response(
      JSON.stringify({
        message: responseMessage,
        sqlQuery: sqlResult.sqlQuery,
        results: executionResult.results,
        noResults: executionResult.noResults,
        queryId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ 
        message: `Ocorreu um erro ao processar sua consulta: ${error.message}`,
        sqlQuery: "",
        results: null,
        error: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
