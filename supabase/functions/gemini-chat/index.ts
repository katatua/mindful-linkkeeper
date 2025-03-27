
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
    
    // Check if this is a database query request
    const isDatabaseQuery = userMessage.toLowerCase().includes("database") || 
                            userMessage.toLowerCase().includes("sql") ||
                            userMessage.toLowerCase().includes("query") ||
                            userMessage.toLowerCase().includes("data") ||
                            userMessage.toLowerCase().includes("find") ||
                            userMessage.toLowerCase().includes("show") ||
                            userMessage.toLowerCase().includes("list") ||
                            userMessage.toLowerCase().includes("get");

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
          
          1. links - Documentos e links carregados pelos usuários
             - id (uuid): Identificador único
             - url (text): URL do documento
             - title (text): Título do documento
             - summary (text): Resumo do conteúdo
             - category (text): Categoria do documento
             - classification (text): Classificação do documento
             - source (text): Fonte do documento
             - created_at (timestamp): Data de criação
             - user_id (uuid): ID do usuário que fez upload
             - file_metadata (jsonb): Metadados do arquivo
          
          2. document_notes - Notas associadas a documentos
             - id (uuid): Identificador único
             - link_id (uuid): ID do documento relacionado
             - user_id (uuid): ID do usuário que criou a nota
             - content (text): Conteúdo da nota
             - created_at (timestamp): Data de criação
          
          3. notes - Notas gerais dos usuários
             - id (uuid): Identificador único
             - user_id (uuid): ID do usuário
             - content (text): Conteúdo da nota
             - created_at (timestamp): Data de criação
             - updated_at (timestamp): Data de atualização
          
          4. tasks - Tarefas dos usuários
             - id (uuid): Identificador único
             - title (text): Título da tarefa
             - description (text): Descrição da tarefa
             - status (text): Status da tarefa (pending, in_progress, completed)
             - priority (text): Prioridade (low, medium, high)
             - category (text): Categoria da tarefa
             - due_date (timestamp): Data de vencimento
             - link_id (uuid): ID do documento relacionado (opcional)
             - user_id (uuid): ID do usuário
             - created_at (timestamp): Data de criação
             - updated_at (timestamp): Data de atualização
          
          Quando o usuário fizer uma pergunta sobre dados, você deve:
          1. Analisar a pergunta para entender qual consulta SQL seria apropriada
          2. Gerar o SQL adequado que pode ser executado diretamente na banco de dados PostgreSQL
          3. Fazer a consulta retornar apenas os campos relevantes para a pergunta
          4. Fornecer o SQL no seguinte formato exato: <SQL>SELECT * FROM tabela WHERE condição</SQL>
          5. Não forneça explicações adicionais sobre o SQL, apenas gere-o dentro das tags <SQL></SQL>
          
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
    
    // Check if response contains SQL query
    const sqlMatch = assistantResponse.match(/<SQL>([\s\S]*?)<\/SQL>/);
    
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
