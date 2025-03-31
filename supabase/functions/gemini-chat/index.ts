
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

function formatNaturalLanguageResponse(response: string, sqlQuery: string, results: any[]): string {
  // Format response with query results
  return `${response}\n\nSQL Query: ${sqlQuery}\n\nResults: ${JSON.stringify(results, null, 2)}`;
}

async function generateSQLQuery(userQuery: string): Promise<{ 
  sqlQuery: string; 
  explanation: string;
  analysis: any;
}> {
  try {
    if (!googleApiKey) {
      throw new Error("Google API key not configured");
    }

    const modelId = await getAIModel();
    console.log("Using AI model:", modelId);

    // Define available tables and provide a schema for each
    const tables = [
      { 
        name: "fontes_dados", 
        columns: ["id", "nome_sistema", "descricao", "tecnologia", "entidade", "data_importacao"]
      },
      { 
        name: "dados_extraidos", 
        columns: ["id", "fonte_id", "tipo", "conteudo", "data_extracao"]
      },
      { 
        name: "instituicoes", 
        columns: ["id", "nome_instituicao", "localizacao", "area_atividade", "outros_detalhes"]
      },
      { 
        name: "cooperacao_internacional", 
        columns: ["id", "nome_parceiro", "tipo_interacao", "data_inicio", "data_fim", "outros_detalhes"]
      },
      { 
        name: "documentos_extraidos", 
        columns: ["id", "fonte_id", "nome", "tipo", "tamanho", "data_extracao", "conteudo", "metadata", "ai_summary", "ai_analysis", "status"]
      },
      { 
        name: "ani_metrics", 
        columns: ["id", "name", "category", "value", "region", "measurement_date", "description", "unit", "source", "sector"]
      },
      { 
        name: "ani_projects", 
        columns: ["id", "title", "description", "funding_amount", "status", "sector", "region", "organization"]
      },
      { 
        name: "ani_funding_programs", 
        columns: ["id", "name", "description", "total_budget", "application_deadline", "end_date", "sector_focus", "funding_type"]
      },
      { 
        name: "ani_patent_holders", 
        columns: ["id", "organization_name", "patent_count", "innovation_index", "year", "sector", "country"]
      },
      { 
        name: "ani_funding_applications", 
        columns: ["id", "program_id", "status", "application_date", "decision_date", "requested_amount", "approved_amount", "year", "sector", "region", "organization"]
      },
      { 
        name: "ani_international_collaborations", 
        columns: ["id", "program_name", "country", "partnership_type", "start_date", "end_date", "total_budget", "focus_areas"]
      },
      { 
        name: "ani_institutions", 
        columns: ["id", "institution_name", "type", "region", "founding_date", "specialization_areas"]
      },
      { 
        name: "ani_policy_frameworks", 
        columns: ["id", "title", "description", "status", "implementation_date", "key_objectives"]
      },
      { 
        name: "ani_researchers", 
        columns: ["id", "name", "email", "specialization", "institution_id", "h_index", "publication_count"]
      },
      { 
        name: "ani_startups", 
        columns: ["id", "name", "founding_year", "sector", "funding_raised", "employees_count", "region", "description", "status"]
      },
      { 
        name: "ani_tech_adoption", 
        columns: ["id", "technology_name", "sector", "adoption_rate", "measurement_year", "region", "benefits", "challenges"]
      },
      { 
        name: "ani_innovation_networks", 
        columns: ["id", "network_name", "founding_year", "member_count", "focus_areas", "geographic_scope", "key_partners"]
      },
      { 
        name: "ani_innovation_policies", 
        columns: ["id", "policy_name", "implementation_year", "policy_type", "description", "target_sectors", "status"]
      },
      { 
        name: "ani_research_publications", 
        columns: ["id", "title", "authors", "publication_date", "journal", "institution", "research_area", "citation_count", "impact_factor"]
      }
    ];

    // Generate the prompt for the API
    const prompt = `
Você é um assistente especializado em transformar consultas em linguagem natural em consultas SQL.

Disponibilidade de tabelas:
${tables.map(table => `- Tabela: ${table.name}, Colunas: ${table.columns.join(', ')}`).join('\n')}

Consulta do usuário em linguagem natural: "${userQuery}"

Instruções:
1. Analise a intenção do usuário e identifique quais tabelas e colunas são relevantes.
2. Forneça uma consulta SQL (PostgreSQL) que responda à pergunta do usuário.
3. Crie uma explicação clara em português de como a consulta responde à pergunta do usuário.

Formato esperado da resposta (em formato JSON):
{
  "análise": {
    "intenção": "descrição da intenção do usuário",
    "tabelas_relevantes": ["lista", "de", "tabelas"],
    "filtros_necessários": ["filtros", "aplicados"]
  },
  "query": "SELECT ... FROM ... WHERE ...",
  "explicação": "Explicação de como a consulta SQL responde à pergunta."
}

Observações:
- As datas são armazenadas no formato padrão PostgreSQL.
- Use junções (JOINs) quando necessário para relacionar dados entre tabelas.
- Se a consulta não puder ser respondida com os dados disponíveis, explique o motivo.
- Sempre utilize aliases de tabela quando houver múltiplas tabelas.
- Não solicite dados não disponíveis nas tabelas - trabalhe apenas com as colunas listadas.
- Caso seja necessário fazer contagens ou agregações, use as funções SQL apropriadas (COUNT, AVG, SUM).
- Prefira usar CTE (WITH) para consultas complexas.
`;

    // Call the Gemini API to generate SQL query
    console.log("Calling Gemini with prompt:", prompt);
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;
    const response = await fetch(`${url}?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Gemini API response:", JSON.stringify(data).substring(0, 200) + "...");

    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
      throw new Error("No response from Gemini API");
    }

    // Extract the text from the response
    const text = data.candidates[0].content.parts[0].text;
    console.log("Extracted text:", text);

    // Identify where the JSON object starts and ends
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      console.error("No JSON object found in response");
      throw new Error("No SQL query found in response");
    }

    // Extract the JSON object
    const jsonStr = text.substring(jsonStart, jsonEnd);
    console.log("Extracted JSON:", jsonStr);
    
    // Parse the JSON object
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(jsonStr);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Error parsing Gemini API response");
    }

    // Check if the response has the expected structure
    if (!parsedResponse.query) {
      throw new Error("No SQL query found in response");
    }

    return {
      sqlQuery: parsedResponse.query,
      explanation: parsedResponse.explicação || "Consulta SQL gerada com sucesso.",
      analysis: parsedResponse.análise || {}
    };
  } catch (error) {
    console.error("Error generating SQL query:", error);
    throw error;
  }
}

async function processUserQuery(userQuery: string): Promise<{
  message: string;
  sqlQuery: string;
  results: any[] | null;
  error?: boolean;
  noResults?: boolean;
  queryId?: string;
  analysis?: any;
}> {
  try {
    console.log("Processing user query:", userQuery);
    
    // Generate SQL query
    const { sqlQuery, explanation, analysis } = await generateSQLQuery(userQuery);
    console.log("Generated SQL query:", sqlQuery);
    
    // Log query to history before execution
    const { data: queryHistoryData, error: historyError } = await supabase
      .from('query_history')
      .insert([
        { 
          query_text: userQuery,
          was_successful: false, // Will update after execution
          language: 'pt'
        }
      ])
      .select('id')
      .single();
      
    if (historyError) {
      console.error("Error logging query history:", historyError);
    }
    
    const queryId = queryHistoryData?.id;
    console.log("Query history logged, ID:", queryId);
    
    // Execute the query
    const { data, error } = await executeQuery(sqlQuery);
    
    if (error) {
      console.error("Error executing query:", error);
      
      // Update query history with error
      if (queryId) {
        await supabase
          .from('query_history')
          .update({ 
            was_successful: false,
            error_message: error.message || "Erro ao executar consulta"
          })
          .eq('id', queryId);
      }
      
      return {
        message: `Erro ao executar a consulta: ${error.message}`,
        sqlQuery,
        results: null,
        error: true,
        queryId
      };
    }
    
    // Update query history with success
    if (queryId) {
      await supabase
        .from('query_history')
        .update({ 
          was_successful: true,
          analysis_result: analysis || null
        })
        .eq('id', queryId);
    }
    
    // Check if we got any results
    if (!data || data.length === 0) {
      console.log("No results returned for query");
      return {
        message: "Não encontrei dados que respondam a essa consulta. Talvez seja necessário popular o banco de dados com informações relevantes.",
        sqlQuery,
        results: [],
        noResults: true,
        queryId,
        analysis
      };
    }
    
    // Format response with explanation and result summary
    const resultCount = data.length;
    let resultSummary = "";
    
    if (resultCount === 1) {
      resultSummary = "Encontrei 1 resultado.";
    } else {
      resultSummary = `Encontrei ${resultCount} resultados.`;
    }
    
    const message = `${explanation}\n\n${resultSummary}`;
    
    return {
      message,
      sqlQuery,
      results: data,
      queryId,
      analysis
    };
  } catch (error) {
    console.error("Error processing user query:", error);
    return {
      message: `Erro ao processar sua consulta: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      sqlQuery: "",
      results: null,
      error: true
    };
  }
}

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
        JSON.stringify({ error: 'No query provided' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    console.log('Received query:', query);

    const response = await processUserQuery(query);

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        sqlQuery: '',
        results: null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
