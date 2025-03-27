
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
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
    const { userMessage, chatHistory } = await req.json();
    
    // Check if this is a database query request - Now include Portuguese terms
    const isDatabaseQuery = userMessage.toLowerCase().includes("database") || 
                            userMessage.toLowerCase().includes("sql") ||
                            userMessage.toLowerCase().includes("query") ||
                            userMessage.toLowerCase().includes("data") ||
                            userMessage.toLowerCase().includes("find") ||
                            userMessage.toLowerCase().includes("show") ||
                            userMessage.toLowerCase().includes("list") ||
                            userMessage.toLowerCase().includes("get") ||
                            // Portuguese terms
                            userMessage.toLowerCase().includes("banco de dados") ||
                            userMessage.toLowerCase().includes("consulta") ||
                            userMessage.toLowerCase().includes("dados") ||
                            userMessage.toLowerCase().includes("encontrar") ||
                            userMessage.toLowerCase().includes("mostrar") ||
                            userMessage.toLowerCase().includes("listar") ||
                            userMessage.toLowerCase().includes("obter") ||
                            userMessage.toLowerCase().includes("programas") ||
                            userMessage.toLowerCase().includes("tabela");

    // Prepare chat history for Gemini
    const messages = chatHistory.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    // Add current user message
    messages.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    // Add system prompt with database schema knowledge if this is a database query
    let systemPrompt;
    
    if (isDatabaseQuery) {
      systemPrompt = {
        role: 'model',
        parts: [{ 
          text: `Você é o assistente de IA da ANI (Agência Nacional de Inovação) de Portugal especializado em consultas de banco de dados.
          
          Você tem acesso às seguintes tabelas no banco de dados:
          
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
          2. Gerar o SQL adequado que pode ser executado diretamente na banco de dados PostgreSQL
          3. Fazer a consulta retornar apenas os campos relevantes para a pergunta
          4. Fornecer o SQL utilizando a seguinte sintaxe exata: <SQL>SELECT * FROM tabela WHERE condição</SQL>
          5. Certifique-se de que o código SQL esteja dentro das tags <SQL></SQL> e seja válido para PostgreSQL
          
          Para perguntas em português como "que funding programs ainda estão abertos?", você deve gerar uma consulta SQL que busque programas com data limite de inscrição no futuro.
          
          Responda sempre no mesmo idioma da pergunta (Português ou Inglês).`
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

    // Make request to Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: isDatabaseQuery ? 0.2 : 0.7, // Lower temperature for SQL generation
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
    
    // For database queries, try to handle queries without proper SQL tags
    if (isDatabaseQuery) {
      // Try to extract SQL with the tags first
      let sqlMatch = assistantResponse.match(/<SQL>([\s\S]*?)<\/SQL>/);
      
      // If no match with tags, try to extract anything that looks like a SQL query
      if (!sqlMatch) {
        // Look for SQL patterns without tags
        const sqlPatterns = [
          /SELECT[\s\S]*?FROM[\s\S]*?(WHERE[\s\S]*?)?(ORDER BY[\s\S]*?)?(LIMIT[\s\S]*?)?;?/i,
          /SELECT[\s\S]*?FROM[\s\S]*?(?:WHERE|ORDER|LIMIT|GROUP)?[\s\S]*?;?/i
        ];
        
        for (const pattern of sqlPatterns) {
          const match = assistantResponse.match(pattern);
          if (match && match[0]) {
            // Found something that looks like SQL, wrap it in tags
            console.log("Found SQL without tags:", match[0]);
            const extractedSql = match[0].trim().replace(/;$/, ''); // Remove trailing semicolon
            // Insert SQL tags into the response
            assistantResponse = assistantResponse.replace(
              extractedSql, 
              `<SQL>${extractedSql}</SQL>`
            );
            break;
          }
        }
        
        // Check if we now have SQL tags
        sqlMatch = assistantResponse.match(/<SQL>([\s\S]*?)<\/SQL>/);
      }
      
      // If we have a SQL match (either originally or after fixing), execute it
      if (sqlMatch && sqlMatch[1] && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const sqlQuery = sqlMatch[1].trim();
          console.log("Executing SQL query:", sqlQuery);
          
          // Initialize Supabase client with service role key for database access
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          
          // Execute the SQL query using the custom function
          const { data: queryResults, error: queryError } = await supabase.rpc('execute_sql_query', {
            sql_query: sqlQuery
          });
          
          if (queryError) {
            console.error("SQL query execution error:", queryError);
            assistantResponse = `Encontrei um erro ao executar a consulta SQL: ${queryError.message}\n\nA consulta que tentei executar foi:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
          } else {
            // Format the results nicely
            const resultCount = Array.isArray(queryResults) ? queryResults.length : 0;
            const resultSummary = resultCount === 1 ? "1 resultado encontrado" : `${resultCount} resultados encontrados`;
            
            // Generate response with results
            if (resultCount > 0) {
              const formattedResults = JSON.stringify(queryResults, null, 2);
              assistantResponse = `Aqui estão os resultados da sua consulta (${resultSummary}):\n\n\`\`\`json\n${formattedResults}\n\`\`\`\n\nA consulta executada foi:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
            } else {
              assistantResponse = `Não encontrei resultados para sua consulta. A consulta executada foi:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
            }
          }
        } catch (sqlExecError) {
          console.error("Error in SQL execution:", sqlExecError);
          assistantResponse = `Ocorreu um erro ao processar sua consulta: ${sqlExecError.message}`;
        }
      } else if (isDatabaseQuery) {
        // This is a database query, but no SQL was found or generated
        // Generate a specific SQL query for the common Portuguese query about open funding programs
        if (userMessage.toLowerCase().includes("funding") && 
            userMessage.toLowerCase().includes("program") && 
            (userMessage.toLowerCase().includes("aberto") || userMessage.toLowerCase().includes("open"))) {
          
          const sqlQuery = "SELECT id, name, description, application_deadline FROM ani_funding_programs WHERE application_deadline >= CURRENT_DATE ORDER BY application_deadline";
          console.log("Executing SQL query:", sqlQuery);
          
          try {
            // Initialize Supabase client
            const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
            
            // Execute the SQL query
            const { data: queryResults, error: queryError } = await supabase.rpc('execute_sql_query', {
              sql_query: sqlQuery
            });
            
            if (queryError) {
              console.error("SQL query execution error:", queryError);
              assistantResponse = `Encontrei um erro ao executar a consulta SQL: ${queryError.message}`;
            } else {
              // Format the results nicely
              const resultCount = Array.isArray(queryResults) ? queryResults.length : 0;
              const resultSummary = resultCount === 1 ? "1 programa de financiamento aberto encontrado" : `${resultCount} programas de financiamento abertos encontrados`;
              
              if (resultCount > 0) {
                const formattedResults = JSON.stringify(queryResults, null, 2);
                assistantResponse = `Aqui estão os programas de financiamento que ainda estão abertos (${resultSummary}):\n\n\`\`\`json\n${formattedResults}\n\`\`\`\n\nA consulta executada foi:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
              } else {
                assistantResponse = `Não encontrei nenhum programa de financiamento aberto. A consulta executada foi:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
              }
            }
          } catch (sqlExecError) {
            console.error("Error in SQL execution:", sqlExecError);
            assistantResponse = `Ocorreu um erro ao processar sua consulta: ${sqlExecError.message}`;
          }
        } else {
          // No SQL was found in the response and it's not a common query we can handle
          assistantResponse = `Não consegui gerar uma consulta SQL para sua pergunta. Por favor, reformule sua pergunta, sendo mais específico sobre qual informação você está buscando no banco de dados.`;
        }
      }
    }
    
    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
