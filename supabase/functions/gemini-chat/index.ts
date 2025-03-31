
// deno-lint-ignore-file no-explicit-any
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
    return data || 'gemini-2.5-pro-exp-03-25';
  } catch (error) {
    console.error('Error fetching AI model:', error);
    return 'gemini-2.5-pro-exp-03-25';
  }
}

// Listas de palavras-chave para identificar consultas que não dependem de dados
const generalKnowledgeKeywords = [
  'o que é', 'como funciona', 'explique', 'desafios', 'benefícios',
  'vantagens', 'desvantagens', 'comparar', 'diferença', 'impacto',
  'futuro', 'tendências', 'história', 'evolução', 'aplicações',
  'exemplos', 'casos de uso', 'melhores práticas', 'estratégias',
  'riscos', 'oportunidades', 'adoção'
];

// Determina se uma consulta é de conhecimento geral (não depende de dados)
function isGeneralKnowledgeQuery(query: string): boolean {
  const queryLower = query.toLowerCase();
  
  // Verifica palavras-chave de conhecimento geral
  for (const keyword of generalKnowledgeKeywords) {
    if (queryLower.includes(keyword)) {
      return true;
    }
  }
  
  // Verifica se a consulta contém palavras de questões específicas que normalmente são de conhecimento geral
  if (queryLower.includes('desafios na adoção') || 
      queryLower.includes('como implementar') || 
      queryLower.includes('futuro da') ||
      queryLower.includes('tendências') ||
      queryLower.includes('impacto de') ||
      queryLower.includes('explicar') ||
      queryLower.includes('conceituar') ||
      queryLower.includes('definir')) {
    return true;
  }
  
  return false;
}

async function handleGeneralKnowledgeQuery(query: string): Promise<any> {
  try {
    console.log("Processando consulta de conhecimento geral com IA:", query);
    
    // Obtém o modelo de IA a ser usado
    const modelName = await getAIModel();
    
    // Se a GEMINI_API_KEY não estiver configurada, retorne um erro
    if (!googleApiKey) {
      console.error("GEMINI_API_KEY não está configurada");
      return {
        message: "Configuração incompleta: a chave de API do Gemini não está configurada.",
        sqlQuery: "",
        results: null,
        error: true
      };
    }
    
    // Constrói o prompt para a consulta de conhecimento geral
    const promptTemplate = `
      Você é um assistente especializado em inovação, tecnologia e estratégias de negócios em Portugal.
      Forneça uma resposta informativa e útil para a seguinte pergunta:
      "${query}"
      
      Sua resposta deve:
      1. Ser abrangente, mas objetiva
      2. Incluir informações relevantes para o contexto português quando aplicável
      3. Ser estruturada em parágrafos para fácil leitura
      4. Incluir exemplos ou casos de uso quando apropriado
      5. Ter entre 200-300 palavras
    `;
    
    // Chamada para a API do Gemini
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
      console.error("Erro na API do Gemini:", errorData);
      throw new Error(`Erro na API do Gemini: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extrai o texto gerado pela IA
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                       "Não foi possível gerar uma resposta para esta pergunta.";
    
    // Salvar a consulta no histórico
    const queryId = crypto.randomUUID();
    
    try {
      const { error: historyError } = await supabase
        .from('query_history')
        .insert([
          { 
            id: queryId,
            query_text: query,
            was_successful: true,
            language: 'pt',
            is_ai_response: true
          }
        ]);
        
      if (historyError) {
        console.error("Erro ao salvar no histórico:", historyError);
      }
    } catch (historyErr) {
      console.error("Exceção ao salvar no histórico:", historyErr);
    }
    
    return {
      message: aiResponse,
      sqlQuery: "",
      results: null,
      queryId: queryId,
      isAIResponse: true
    };
  } catch (error) {
    console.error("Erro ao processar consulta de conhecimento geral:", error);
    return {
      message: `Ocorreu um erro ao processar sua consulta: ${error.message}`,
      sqlQuery: "",
      results: null,
      error: true
    };
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

    console.log("Received query:", query);
    
    const queryId = crypto.randomUUID();
    let isAIResponse = false;
    
    // Verifica se a consulta é de conhecimento geral (não depende de dados)
    if (isGeneralKnowledgeQuery(query)) {
      console.log("Identificada como consulta de conhecimento geral:", query);
      const aiResult = await handleGeneralKnowledgeQuery(query);
      
      return new Response(
        JSON.stringify({
          ...aiResult,
          queryId
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Continue com o fluxo normal para consultas baseadas em dados
    // Generate SQL from the query
    const sqlResult = await generateSQL(query);
    
    if (sqlResult.error) {
      // Save the failed query to history
      try {
        const { error: historyError } = await supabase
          .from('query_history')
          .insert([
            { 
              id: queryId,
              query_text: query,
              was_successful: false,
              language: 'pt',
              error_message: sqlResult.message
            }
          ]);
          
        if (historyError) {
          console.error("Error saving to history:", historyError);
        }
      } catch (historyErr) {
        console.error("Exception saving to history:", historyErr);
      }
      
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
      // Save the failed query to history
      try {
        const { error: historyError } = await supabase
          .from('query_history')
          .insert([
            { 
              id: queryId,
              query_text: query,
              was_successful: false,
              language: 'pt',
              sql_query: sqlResult.sqlQuery,
              error_message: executionResult.message
            }
          ]);
          
        if (historyError) {
          console.error("Error saving to history:", historyError);
        }
      } catch (historyErr) {
        console.error("Exception saving to history:", historyErr);
      }
      
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
    
    // Process the execution results
    let responseMessage;
    let analysisResult = null;
    
    if (executionResult.noResults) {
      responseMessage = "Não encontrei dados correspondentes à sua consulta. Você pode tentar reformular sua pergunta ou explorar outro tema.";
      
      // Try to analyze the query to see if we can provide more helpful information
      try {
        const { data: analysisData } = await supabase.functions.invoke('analyze-query', {
          body: { query }
        });
        
        if (analysisData) {
          analysisResult = analysisData;
        }
      } catch (analysisError) {
        console.error("Error calling analyze-query function:", analysisError);
      }
    } else {
      // Generate a natural language response based on the results
      responseMessage = await generateResponse(query, sqlResult.sqlQuery, executionResult.results);
    }
    
    // Save the successful query to history
    try {
      const { error: historyError } = await supabase
        .from('query_history')
        .insert([
          { 
            id: queryId,
            query_text: query,
            was_successful: true,
            language: 'pt',
            sql_query: sqlResult.sqlQuery,
            result_count: executionResult.results ? executionResult.results.length : 0,
            analysis_result: analysisResult
          }
        ]);
        
      if (historyError) {
        console.error("Error saving to history:", historyError);
      }
    } catch (historyErr) {
      console.error("Exception saving to history:", historyErr);
    }
    
    return new Response(
      JSON.stringify({
        message: responseMessage,
        sqlQuery: sqlResult.sqlQuery,
        results: executionResult.results,
        noResults: executionResult.noResults,
        queryId,
        analysis: analysisResult,
        isAIResponse
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
