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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { userMessage, chatHistory, databaseInfo } = requestData;
    
    const isDatabaseQuery = userMessage.toLowerCase().includes("database") || 
                            userMessage.toLowerCase().includes("sql") ||
                            userMessage.toLowerCase().includes("query") ||
                            userMessage.toLowerCase().includes("data") ||
                            userMessage.toLowerCase().includes("find") ||
                            userMessage.toLowerCase().includes("show") ||
                            userMessage.toLowerCase().includes("list") ||
                            userMessage.toLowerCase().includes("get") ||
                            userMessage.toLowerCase().includes("banco de dados") ||
                            userMessage.toLowerCase().includes("consulta") ||
                            userMessage.toLowerCase().includes("dados") ||
                            userMessage.toLowerCase().includes("encontrar") ||
                            userMessage.toLowerCase().includes("mostrar") ||
                            userMessage.toLowerCase().includes("listar") ||
                            userMessage.toLowerCase().includes("obter") ||
                            userMessage.toLowerCase().includes("programas") ||
                            userMessage.toLowerCase().includes("tabela") ||
                            userMessage.toLowerCase().includes("buscar") ||
                            userMessage.toLowerCase().includes("abertos") ||
                            userMessage.toLowerCase().includes("que") ||
                            userMessage.toLowerCase().includes("estão") ||
                            userMessage.toLowerCase().includes("ano") ||
                            userMessage.toLowerCase().includes("year") ||
                            userMessage.toLowerCase().includes("2024") ||
                            userMessage.toLowerCase().includes("open for applications") ||
                            userMessage.toLowerCase().includes("currently open") ||
                            userMessage.toLowerCase().includes("available funding") ||
                            userMessage.toLowerCase().includes("can apply") ||
                            userMessage.toLowerCase().includes("active programs");

    const messages = chatHistory.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    messages.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    let systemPrompt;
    
    if (isDatabaseQuery) {
      systemPrompt = {
        role: 'model',
        parts: [{ 
          text: `Você é o assistente de IA da ANI (Agência Nacional de Inovação) de Portugal especializado em consultas de banco de dados PostgreSQL.
          
          IMPORTANTE: Este projeto usa PostgreSQL (versão 14), então você DEVE usar a sintaxe correta do PostgreSQL:
          - Use CURRENT_DATE em vez de DATE('now')
          - Use EXTRACT(YEAR FROM coluna) em vez de strftime('%Y', coluna)
          - Use TO_CHAR(coluna, 'YYYY-MM-DD') para formatação de datas
          - Use CURRENT_TIMESTAMP em vez de NOW()
          - Nunca coloque ponto e vírgula no meio da consulta, apenas no final se necessário
          
          REGRA IMPORTANTE:
          - Um programa de financiamento está aberto para aplicações se a data de término (end_date) for posterior à data atual. Para verificar programas abertos, use: 
          "WHERE end_date > CURRENT_DATE"
          
          Você tem acesso às seguintes tabelas no banco de dados PostgreSQL:
          
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
          2. Gerar o SQL adequado para PostgreSQL e colocá-lo entre as tags <SQL> e </SQL>
          3. Incluir os resultados brutos entre as tags <RESULTS> e </RESULTS> para que o frontend possa extraí-los (estes serão adicionados posteriormente)
          4. Explicar os resultados em linguagem natural de forma clara e bem estruturada
          
          Sua resposta final deve ser:
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
    
    messages.unshift(systemPrompt);

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
    
    let assistantResponse = "Desculpe, não consegui processar sua solicitação.";
    
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0]) {
      assistantResponse = data.candidates[0].content.parts[0].text;
    }
    
    if (isDatabaseQuery) {
      let sqlMatch = assistantResponse.match(/<SQL>([\s\S]*?)<\/SQL>/);
      
      if (!sqlMatch) {
        const sqlPatterns = [
          /SELECT[\s\S]*?FROM[\s\S]*?(WHERE[\s\S]*?)?(ORDER BY[\s\S]*?)?(LIMIT[\s\S]*?)?;?/i,
          /SELECT[\s\S]*?FROM[\s\S]*?(?:WHERE|ORDER|LIMIT|GROUP)?[\s\S]*?;?/i
        ];
        
        for (const pattern of sqlPatterns) {
          const match = assistantResponse.match(pattern);
          if (match && match[0]) {
            console.log("Found SQL without tags:", match[0]);
            const extractedSql = match[0].trim().replace(/;$/, '');
            assistantResponse = extractedSql;
            sqlMatch = [null, extractedSql];
            break;
          }
        }
      }
      
      if (sqlMatch && sqlMatch[1] && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        let sqlQuery = sqlMatch[1].trim();
        console.log("Original SQL query:", sqlQuery);
        
        if (sqlQuery.includes(';') && sqlQuery.indexOf(';') < sqlQuery.length - 1) {
          sqlQuery = sqlQuery.replace(/;(?!\s*$)/g, ' ');
        }
        
        sqlQuery = sqlQuery.replace(/DATE\s*\(\s*['"]now['"]\s*\)/gi, 'CURRENT_DATE');
        sqlQuery = sqlQuery.replace(/strftime\s*\(\s*['"]%Y['"]\s*,\s*([^)]+)\s*\)/gi, 'EXTRACT(YEAR FROM $1)');
        
        const whereOrderByMatch = sqlQuery.match(/WHERE\s+(.*?)\s*ORDER\s+BY\s+(.*?)(?:$|LIMIT|GROUP)/i);
        if (whereOrderByMatch) {
          const wherePart = whereOrderByMatch[1];
          const orderByPart = whereOrderByMatch[2];
          
          const beforeWhere = sqlQuery.substring(0, sqlQuery.toLowerCase().indexOf('where'));
          const afterOrderBy = sqlQuery.substring(
            sqlQuery.toLowerCase().indexOf('order by') + 'order by'.length + orderByPart.length
          );
          
          sqlQuery = `${beforeWhere} WHERE ${wherePart} ORDER BY ${orderByPart}${afterOrderBy}`;
        }
        
        if (userMessage.toLowerCase().includes("open for applications") || 
            userMessage.toLowerCase().includes("currently open") ||
            userMessage.toLowerCase().includes("abertos") ||
            userMessage.toLowerCase().includes("disponíveis") ||
            userMessage.toLowerCase().includes("open")) {
          
          if (sqlQuery.toLowerCase().includes("ani_funding_programs") && 
              !sqlQuery.toLowerCase().includes("end_date")) {
            if (sqlQuery.toLowerCase().includes("where")) {
              sqlQuery = sqlQuery.replace(/where\s+/i, "WHERE end_date > CURRENT_DATE AND ");
            } else {
              if (sqlQuery.toLowerCase().includes("order by")) {
                sqlQuery = sqlQuery.replace(/order\s+by/i, "WHERE end_date > CURRENT_DATE ORDER BY");
              } else {
                sqlQuery = sqlQuery + " WHERE end_date > CURRENT_DATE";
              }
            }
          }
        }
        
        console.log("Executing SQL query:", sqlQuery);
        
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        const { data: queryResults, error: queryError } = await supabase.rpc('execute_sql_query', {
          sql_query: sqlQuery
        });
        
        if (queryError) {
          console.error("SQL query execution error:", queryError);
          
          let fallbackQuery = "";
          
          if (userMessage.toLowerCase().includes("open for applications") || 
              userMessage.toLowerCase().includes("currently open") ||
              userMessage.toLowerCase().includes("abertos") ||
              userMessage.toLowerCase().includes("disponíveis") ||
              userMessage.toLowerCase().includes("open")) {
            fallbackQuery = "SELECT id, name, description, application_deadline, end_date, total_budget FROM ani_funding_programs WHERE end_date > CURRENT_DATE ORDER BY application_deadline ASC";
          }
          
          if (fallbackQuery) {
            console.log("Using fallback query:", fallbackQuery);
            const fallbackResult = await supabase.rpc('execute_sql_query', {
              sql_query: fallbackQuery
            });
            
            if (!fallbackResult.error) {
              const fallbackData = fallbackResult.data;
              assistantResponse = `<SQL>${fallbackQuery}</SQL>\n\n<RESULTS>${JSON.stringify(fallbackData)}</RESULTS>\n\nAqui estão os programas de financiamento atualmente abertos para aplicações (com data de término após a data atual).`;
            }
          } else {
            assistantResponse = `<SQL>${sqlQuery}</SQL>\n\n<RESULTS>[]</RESULTS>\n\nNão foi possível executar a consulta. Erro: ${queryError.message}`;
          }
        } else {
          const resultCount = Array.isArray(queryResults) ? queryResults.length : 0;
          
          let nlPrompt;
          if (resultCount > 0) {
            nlPrompt = `Aqui estão os resultados da consulta SQL (${resultCount} ${resultCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}):\n\n${JSON.stringify(queryResults, null, 2)}\n\nPor favor, formate e apresente estes dados de maneira clara e concisa, explicando o que eles significam em relação à pergunta original: "${userMessage}".`;
          } else {
            nlPrompt = `A consulta SQL não retornou nenhum resultado. Por favor, explique isso de maneira amigável. A consulta executada foi:\n\`\`\`sql\n${sqlQuery}\n\`\`\`\nA pergunta original foi: "${userMessage}"`;
          }
          
          const nlMessages = [
            {
              role: 'model',
              parts: [{ text: systemPrompt.parts[0].text.replace('especializado em consultas de banco de dados', 'especializado em explicar dados') }]
            },
            {
              role: 'user',
              parts: [{ text: nlPrompt }]
            }
          ];
          
          const nlResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: nlMessages,
              generationConfig: {
                temperature: 0.4,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 1024,
              }
            }),
          });
          
          const nlData = await nlResponse.json();
          
          if (nlData.candidates && 
              nlData.candidates[0] && 
              nlData.candidates[0].content && 
              nlData.candidates[0].content.parts && 
              nlData.candidates[0].content.parts[0]) {
            assistantResponse = `<SQL>${sqlQuery}</SQL>\n\n<RESULTS>${JSON.stringify(queryResults)}</RESULTS>\n\n${nlData.candidates[0].content.parts[0].text}`;
          } else {
            if (resultCount > 0) {
              assistantResponse = `<SQL>${sqlQuery}</SQL>\n\n<RESULTS>${JSON.stringify(queryResults)}</RESULTS>\n\nEncontrei ${resultCount} ${resultCount === 1 ? 'resultado' : 'resultados'} para sua consulta.`;
            } else {
              assistantResponse = `<SQL>${sqlQuery}</SQL>\n\n<RESULTS>[]</RESULTS>\n\nNão encontrei resultados para sua consulta.`;
            }
          }
        }
      } else if (isDatabaseQuery && !sqlMatch) {
        const sqlGenerationPrompt = `Por favor, gere uma consulta SQL para responder à seguinte pergunta: "${userMessage}"

Sua resposta deve conter apenas a consulta SQL, sem explicação, entre as tags <SQL> e </SQL>.`;
        
        const sqlGenMessages = [
          {
            role: 'model',
            parts: [{ text: systemPrompt.parts[0].text }]
          },
          {
            role: 'user',
            parts: [{ text: sqlGenerationPrompt }]
          }
        ];
        
        try {
          const sqlGenResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: sqlGenMessages,
              generationConfig: {
                temperature: 0.1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 1024,
              }
            }),
          });
          
          const sqlGenData = await sqlGenResponse.json();
          
          if (sqlGenData.candidates && 
              sqlGenData.candidates[0] && 
              sqlGenData.candidates[0].content && 
              sqlGenData.candidates[0].content.parts && 
              sqlGenData.candidates[0].content.parts[0]) {
            
            const sqlGenOutput = sqlGenData.candidates[0].content.parts[0].text;
            const secondAttemptMatch = sqlGenOutput.match(/<SQL>([\s\S]*?)<\/SQL>/);
            
            if (secondAttemptMatch && secondAttemptMatch[1]) {
              const sqlQuery = secondAttemptMatch[1].trim();
              console.log("Second attempt SQL query:", sqlQuery);
              
              const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
              
              const { data: queryResults, error: queryError } = await supabase.rpc('execute_sql_query', {
                sql_query: sqlQuery
              });
              
              if (queryError) {
                console.error("Second attempt SQL error:", queryError);
                
                let fallbackQuery = "";
                
                if (userMessage.toLowerCase().includes("open for applications") || 
                    userMessage.toLowerCase().includes("currently open") ||
                    userMessage.toLowerCase().includes("abertos") ||
                    userMessage.toLowerCase().includes("disponíveis") ||
                    userMessage.toLowerCase().includes("open")) {
                  fallbackQuery = "SELECT id, name, description, application_deadline, end_date, total_budget FROM ani_funding_programs WHERE end_date > CURRENT_DATE ORDER BY application_deadline ASC";
                }
                
                if (fallbackQuery) {
                  console.log("Using fallback query:", fallbackQuery);
                  const fallbackResult = await supabase.rpc('execute_sql_query', {
                    sql_query: fallbackQuery
                  });
                  
                  if (!fallbackResult.error) {
                    const fallbackData = fallbackResult.data;
                    assistantResponse = `<SQL>${fallbackQuery}</SQL>\n\n<RESULTS>${JSON.stringify(fallbackData)}</RESULTS>\n\nAqui estão os programas de financiamento atualmente abertos para aplicações (com data de término após a data atual).`;
                  } else {
                    assistantResponse = `<SQL>${sqlQuery}</SQL>\n\n<RESULTS>[]</RESULTS>\n\nNão consegui executar uma consulta apropriada para sua pergunta. Por favor, reformule sua pergunta sendo mais específico sobre quais dados você está buscando.`;
                  }
                } else {
                  assistantResponse = `<SQL>${sqlQuery}</SQL>\n\n<RESULTS>[]</RESULTS>\n\nNão consegui executar uma consulta apropriada para sua pergunta. Por favor, reformule sua pergunta sendo mais específico sobre quais dados você está buscando.`;
                }
              } else {
                const resultCount = Array.isArray(queryResults) ? queryResults.length : 0;
                
                let nlPrompt;
                if (resultCount > 0) {
                  nlPrompt = `Aqui estão os resultados da consulta SQL (${resultCount} ${resultCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}):\n\n${JSON.stringify(queryResults, null, 2)}\n\nPor favor, formate e apresente estes dados de maneira clara e concisa, explicando o que eles significam em relação à pergunta original: "${userMessage}".`;
                } else {
                  nlPrompt = `A consulta SQL não retornou nenhum resultado. Por favor, explique isso de maneira amigável. A pergunta original foi: "${userMessage}"`;
                }
                
                const nlMessages = [
                  {
                    role: 'model',
                    parts: [{ text: systemPrompt.parts[0].text.replace('especializado em consultas de banco de dados', 'especializado em explicar dados') }]
                  },
                  {
                    role: 'user',
                    parts: [{ text: nlPrompt }]
                  }
                ];
                
                const nlResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    contents: nlMessages,
                    generationConfig: {
                      temperature: 0.4,
                      topP: 0.8,
                      topK: 40,
                      maxOutputTokens: 1024,
                    }
                  }),
                });
                
                const nlData = await nlResponse.json();
                
                if (nlData.candidates && 
                    nlData.candidates[0] && 
                    nlData.candidates[0].content && 
                    nlData.candidates[0].content.parts && 
                    nlData.candidates[0].content.parts[0]) {
                  assistantResponse = `<SQL>${sqlQuery}</SQL>\n\n<RESULTS>${JSON.stringify(queryResults)}</RESULTS>\n\n${nlData.candidates[0].content.parts[0].text}`;
                } else {
                  if (resultCount > 0) {
                    assistantResponse = `<SQL>${sqlQuery}</SQL>\n\n<RESULTS>${JSON.stringify(queryResults)}</RESULTS>\n\nEncontrei ${resultCount} ${resultCount === 1 ? 'resultado' : 'resultados'} para sua consulta.`;
                  } else {
                    assistantResponse = `<SQL>${sqlQuery}</SQL>\n\n<RESULTS>[]</RESULTS>\n\nNão encontrei resultados para sua consulta.`;
                  }
                }
              }
            } else {
              assistantResponse = `Não consegui gerar uma consulta SQL para sua pergunta. Por favor, reformule sua pergunta, sendo mais específico sobre qual informação você está buscando no banco de dados.`;
            }
          } else {
            assistantResponse = `Não consegui gerar uma consulta SQL para sua pergunta. Por favor, reformule sua pergunta, sendo mais específico sobre qual informação você está buscando no banco de dados.`;
          }
        } catch (secondAttemptError) {
          console.error("Error in second SQL generation attempt:", secondAttemptError);
          assistantResponse = `Encontrei dificuldades para processar sua consulta. Por favor, reformule sua pergunta de forma mais específica.`;
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
