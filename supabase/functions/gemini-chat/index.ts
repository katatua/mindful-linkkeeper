
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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
    const requestData = await req.json();
    const { prompt } = requestData;
    const chatHistory = requestData.chatHistory || [];
    
    // Determine if this is a database query based on prompt content
    const isDatabaseQuery = prompt.toLowerCase().includes('database') || 
                            prompt.toLowerCase().includes('sql') ||
                            prompt.toLowerCase().includes('query') ||
                            prompt.toLowerCase().includes('data') ||
                            prompt.toLowerCase().includes('show me') ||
                            prompt.toLowerCase().includes('metrics') ||
                            prompt.toLowerCase().includes('funding') ||
                            prompt.toLowerCase().includes('projects') ||
                            prompt.toLowerCase().includes('collaborations') ||
                            prompt.toLowerCase().match(/^(show|list|what|which|how many|where|when)/i) !== null;
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Dynamically fetch the AI model from database settings
    const { data: aiModelData, error: aiModelError } = await supabase.rpc('get_database_setting', { setting_key: 'ai_model' });
    
    if (aiModelError) {
      console.error('Error fetching AI model:', aiModelError);
      throw new Error('Could not retrieve AI model configuration');
    }

    // Default to a stable model if none is found
    const model = aiModelData || "gemini-1.5-flash-001";
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    // Prepare chat history for Gemini
    const messages = [];
    
    // Add chat history if available
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      messages.push(...chatHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })));
    }
    
    // Add current user message
    messages.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    // Define system prompt based on query type
    let systemPrompt;

    if (isDatabaseQuery) {
      const { data: databaseTypeResult } = await supabase.rpc('get_database_setting', { setting_key: 'database_type' });
      const { data: databaseVersionResult } = await supabase.rpc('get_database_setting', { setting_key: 'database_version' });
      
      const databaseType = databaseTypeResult || 'PostgreSQL';
      const databaseVersion = databaseVersionResult || '14.x';

      systemPrompt = {
        role: 'model',
        parts: [{ 
          text: `Você é o assistente de IA da ANI (Agência Nacional de Inovação) especializado em consultas de banco de dados ${databaseType} (versão ${databaseVersion}).
          
          IMPORTANTE: Este projeto usa ${databaseType} (versão ${databaseVersion}), então você DEVE usar a sintaxe correta do ${databaseType}:
          - Use CURRENT_DATE em vez de DATE('now')
          - Use EXTRACT(YEAR FROM coluna) em vez de strftime('%Y', coluna)
          - Use TO_CHAR(coluna, 'YYYY-MM-DD') para formatação de datas
          - Use CURRENT_TIMESTAMP em vez de NOW()
          - Nunca coloque ponto e vírgula no meio da consulta, apenas no final se necessário
          
          Você tem acesso às seguintes tabelas no banco de dados ${databaseType}:
          
          1. ani_metrics - Armazena dados de métricas diversas
             - id (uuid): Identificador único
             - name (text): Nome da métrica
             - category (text): Categoria da métrica
             - value (numeric): Valor da métrica
             - unit (text): Unidade de medida
             - measurement_date (date): Data da medição
             - region (text): Região
             - sector (text): Setor
             - source (text): Fonte dos dados
             - description (text): Descrição detalhada
          
          2. ani_funding_programs - Armazena informações sobre programas de financiamento
             - id (uuid): Identificador único
             - name (text): Nome do programa
             - description (text): Descrição do programa
             - total_budget (numeric): Orçamento total disponível
             - start_date (date): Data de início
             - end_date (date): Data de término
             - application_deadline (date): Prazo para inscrições
             - next_call_date (date): Data da próxima chamada
             - funding_type (text): Tipo de financiamento
             - sector_focus (text[]): Setores alvo
             - eligibility_criteria (text): Quem pode se candidatar
             - application_process (text): Como se candidatar
             - review_time_days (integer): Tempo de revisão da candidatura
             - success_rate (numeric): Taxa de sucesso
          
          3. ani_projects - Contém informações sobre projetos
             - id (uuid): Identificador único
             - title (text): Título do projeto
             - description (text): Descrição do projeto
             - start_date (date): Data de início
             - end_date (date): Data de término
             - funding_amount (numeric): Valor financiado
             - status (text): Status do projeto
             - sector (text): Setor
             - region (text): Região
             - organization (text): Organização líder
             - contact_email (text): Email de contato
             - contact_phone (text): Telefone de contato
          
          4. ani_policy_frameworks - Armazena dados sobre estruturas de políticas
             - id (uuid): Identificador único
             - title (text): Título
             - description (text): Descrição
             - scope (text): Escopo
             - implementation_date (date): Data de implementação
             - status (text): Status
             - key_objectives (text[]): Objetivos principais
             - related_legislation (text): Legislação relacionada
          
          5. ani_international_collaborations - Rastreia parcerias internacionais
             - id (uuid): Identificador único
             - program_name (text): Nome do programa
             - country (text): País
             - partnership_type (text): Tipo de parceria
             - start_date (date): Data de início
             - end_date (date): Data de término
             - total_budget (numeric): Orçamento total
             - portuguese_contribution (numeric): Contribuição portuguesa
             - focus_areas (text[]): Áreas de foco
          
          Quando o usuário fizer uma pergunta sobre dados, você deve:
          1. Analisar a pergunta para entender qual consulta SQL seria apropriada
          2. Gerar o SQL adequado para ${databaseType} e colocá-lo entre as tags <SQL> e </SQL>
          3. Tentar evitar erros comuns:
             - Use "ILIKE '%texto%'" para buscas case-insensitive em vez de LIKE
             - Use aspas simples para strings
             - Não use aspas duplas para nomes de colunas, a menos que seja absolutamente necessário
             - Verifique cuidadosamente o nome das colunas
          4. Sua resposta final deve ter a seguinte estrutura:
          
          <SQL>consulta SQL aqui</SQL>
          
          Seguida por sua explicação em linguagem natural.`
        }]
      };
    } else {
      systemPrompt = {
        role: 'model',
        parts: [{ 
          text: `Você é o assistente de IA da ANI (Agência Nacional de Inovação) de Portugal. 
          Forneça informações precisas sobre inovação, financiamento de projetos, políticas de inovação, 
          e métricas relacionadas. Se você não tiver informações específicas sobre algo, diga isso claramente 
          e ofereça ajudar com o que sabe. Mantenha um tom profissional mas acessível. 
          Responda no mesmo idioma da pergunta (Português ou Inglês).`
        }]
      };
    }
    
    // Insert system prompt at the beginning
    messages.unshift(systemPrompt);

    console.log(`Making request to Gemini API with model: ${model}`);
    
    // Make request to Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: isDatabaseQuery ? 0.2 : 0.7,
          topP: 0.95,
          topK: 40,
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
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error(`Gemini API Error: ${JSON.stringify(data)}`);
    }
    
    // Extract response text
    let assistantResponse = "Desculpe, não consegui processar sua solicitação.";
    
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0]) {
      assistantResponse = data.candidates[0].content.parts[0].text;
    }
    
    // For database queries, extract and execute SQL
    if (isDatabaseQuery) {
      try {
        // Extract SQL query
        const sqlMatch = assistantResponse.match(/<SQL>([\s\S]*?)<\/SQL>/);
        
        if (sqlMatch && sqlMatch[1]) {
          let sqlQuery = sqlMatch[1].trim();
          
          // Remove code formatting if present
          sqlQuery = sqlQuery.replace(/```sql\n/g, '').replace(/```/g, '');
          
          console.log("Executing SQL query:", sqlQuery);
          
          // Execute the SQL query using the custom function
          const { data: queryResults, error: queryError } = await supabase.rpc('execute_sql_query', {
            sql_query: sqlQuery
          });
          
          if (queryError) {
            console.error("SQL query execution error:", queryError);
            
            // Return the error with the original query
            assistantResponse = `<SQL>${sqlQuery}</SQL>\n\n<RESULTS>[]</RESULTS>\n\nOcorreu um erro ao executar a consulta: ${queryError.message}. Por favor, verifique a sintaxe SQL ou reformule sua pergunta.`;
          } else {
            // Success with the query
            assistantResponse = `<SQL>${sqlQuery}</SQL>\n\n<RESULTS>${JSON.stringify(queryResults)}</RESULTS>\n\n${generateResponseText(queryResults, prompt)}`;
          }
        } else {
          assistantResponse = "Não consegui gerar uma consulta SQL apropriada para sua pergunta. Por favor, reformule sua pergunta sendo mais específico sobre quais dados você está buscando.";
        }
      } catch (sqlExecError) {
        console.error("Error in SQL execution:", sqlExecError);
        assistantResponse = `Ocorreu um erro ao processar sua consulta: ${sqlExecError.message}`;
      }
    }
    
    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Helper function to generate a human-readable response based on SQL results
function generateResponseText(results: any[], originalQuestion: string): string {
  if (!Array.isArray(results) || results.length === 0) {
    return "Não foram encontrados resultados que correspondam à sua consulta.";
  }
  
  // Count the results
  const count = results.length;
  
  // Basic response for results found
  let response = `Encontrei ${count} ${count === 1 ? 'resultado' : 'resultados'} para sua consulta.\n\n`;
  
  // Add a simple summary of the data
  if (count <= 5) {
    // For small result sets, we can be more detailed
    response += `Aqui está o resultado completo:\n\n`;
    results.forEach((item, index) => {
      response += `**Item ${index+1}:**\n`;
      Object.entries(item).forEach(([key, value]) => {
        response += `- ${key}: ${formatValue(value)}\n`;
      });
      response += '\n';
    });
  } else {
    // For larger result sets, summarize the first few
    response += `Aqui estão os primeiros ${Math.min(count, 3)} resultados:\n\n`;
    for (let i = 0; i < Math.min(count, 3); i++) {
      response += `**Item ${i+1}:**\n`;
      Object.entries(results[i]).forEach(([key, value]) => {
        response += `- ${key}: ${formatValue(value)}\n`;
      });
      response += '\n';
    }
    
    if (count > 3) {
      response += `... e mais ${count - 3} ${count - 3 === 1 ? 'resultado' : 'resultados'}.`;
    }
  }
  
  return response;
}

// Helper function to format values for display
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}
