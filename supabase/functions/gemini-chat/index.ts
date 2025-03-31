
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// These values will be defined but not used since we're using mock data
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

// Mock responses for development and testing
const mockResponses: Record<string, any> = {
  "Quais são as fontes de dados mais recentes?": {
    sqlQuery: "SELECT * FROM fontes_dados ORDER BY data_importacao DESC LIMIT 10",
    results: [
      { id: 1, nome_sistema: "Sistema Nacional de Inovação", descricao: "Dados de inovação nacional", tecnologia: "PostgreSQL", entidade: "Ministério da Ciência", data_importacao: "2024-03-15" },
      { id: 2, nome_sistema: "Plataforma de Patentes PT", descricao: "Registro de patentes", tecnologia: "MongoDB", entidade: "INPI", data_importacao: "2024-03-10" },
      { id: 3, nome_sistema: "Research.PT", descricao: "Publicações científicas", tecnologia: "ElasticSearch", entidade: "FCT", data_importacao: "2024-03-05" }
    ],
    explanation: "Esta consulta retorna as fontes de dados mais recentes, ordenadas pela data de importação em ordem decrescente."
  },
  "Liste as instituições que trabalham com tecnologia": {
    sqlQuery: "SELECT * FROM instituicoes WHERE area_atividade LIKE '%tecnologia%' OR outros_detalhes LIKE '%tecnologia%'",
    results: [
      { id: 1, nome_instituicao: "Instituto Superior Técnico", localizacao: "Lisboa", area_atividade: "Ensino e Pesquisa em Tecnologia", outros_detalhes: "Fundado em 1911" },
      { id: 2, nome_instituicao: "Universidade do Porto", localizacao: "Porto", area_atividade: "Ensino Superior, Tecnologia", outros_detalhes: "Polo de tecnologia e inovação" },
      { id: 3, nome_instituicao: "INESC TEC", localizacao: "Porto", area_atividade: "Pesquisa em Tecnologia", outros_detalhes: "Centro de excelência em engenharia" }
    ],
    explanation: "Esta consulta filtra instituições cuja área de atividade ou outros detalhes incluem a palavra 'tecnologia'."
  },
  "Quantos documentos foram extraídos no último mês?": {
    sqlQuery: "SELECT COUNT(*) as total FROM documentos_extraidos WHERE data_extracao >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND data_extracao < DATE_TRUNC('month', CURRENT_DATE)",
    results: [
      { total: 256 }
    ],
    explanation: "Esta consulta conta o número de documentos extraídos no mês anterior ao atual."
  },
  "Qual é o volume total de financiamento de projetos em Lisboa?": {
    sqlQuery: "SELECT SUM(funding_amount) as total_funding FROM ani_projects WHERE region = 'Lisboa'",
    results: [
      { total_funding: 26500000 }
    ],
    explanation: "Esta consulta soma o valor total de financiamento para projetos na região de Lisboa."
  },
  "Mostre as cooperações internacionais ativas": {
    sqlQuery: "SELECT * FROM ani_international_collaborations WHERE end_date > CURRENT_DATE",
    results: [
      { id: 1, program_name: "Horizonte Europa", country: "França", partnership_type: "Pesquisa", start_date: "2023-01-15", end_date: "2025-12-31", total_budget: 3500000, focus_areas: "Energia renovável" },
      { id: 2, program_name: "Erasmus+", country: "Alemanha", partnership_type: "Educação", start_date: "2023-06-01", end_date: "2026-05-31", total_budget: 1200000, focus_areas: "Intercâmbio acadêmico" },
      { id: 3, program_name: "MIT Portugal", country: "Estados Unidos", partnership_type: "Pesquisa e Desenvolvimento", start_date: "2022-09-01", end_date: "2024-08-31", total_budget: 4800000, focus_areas: "Computação avançada" }
    ],
    explanation: "Esta consulta filtra as cooperações internacionais cuja data de término é posterior à data atual, ou seja, ainda estão ativas."
  }
};

// This function is not used since we're focusing on mock data
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
    
    // Generate mock query ID
    const queryId = crypto.randomUUID();
    
    // Log query to history
    try {
      await supabase
        .from('query_history')
        .insert([
          { 
            query_text: userQuery,
            was_successful: true,
            language: 'pt',
            id: queryId
          }
        ]);
      console.log("Query logged to history");
    } catch (err) {
      console.error("Error logging query:", err);
    }
    
    // Find exact match in mock responses
    if (mockResponses[userQuery]) {
      const mockData = mockResponses[userQuery];
      console.log("Found exact mock response match");
      return {
        message: mockData.explanation,
        sqlQuery: mockData.sqlQuery,
        results: mockData.results,
        queryId
      };
    }
    
    // Find fuzzy match in mock responses
    for (const [key, value] of Object.entries(mockResponses)) {
      // Check if key words from the mock response are in the user query
      const keyWords = key.toLowerCase().split(" ");
      const userQueryLower = userQuery.toLowerCase();
      
      // If one of the first two words (usually the most important) match, consider it a fuzzy match
      if (keyWords.length > 0 && userQueryLower.includes(keyWords[0]) || 
          (keyWords.length > 1 && userQueryLower.includes(keyWords[1]))) {
        console.log("Found fuzzy mock response match with:", key);
        return {
          message: `Resposta aproximada baseada em: "${key}"\n\n${value.explanation}`,
          sqlQuery: value.sqlQuery,
          results: value.results,
          queryId
        };
      }
    }
    
    // No match found
    console.log("No mock response match found");
    return {
      message: "Não encontrei dados que respondam a essa consulta. Por favor, tente reformular a pergunta ou escolha uma das sugestões fornecidas.",
      sqlQuery: "SELECT 'mock data only' as info",
      results: [],
      noResults: true,
      queryId
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
