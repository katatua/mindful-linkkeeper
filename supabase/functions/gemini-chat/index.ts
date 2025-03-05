
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

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
                            userMessage.toLowerCase().includes("find");

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
          2. Gerar o SQL adequado
          3. Explicar como esse SQL responderia à pergunta do usuário
          4. Explicar quais informações o SQL retornaria
          
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
