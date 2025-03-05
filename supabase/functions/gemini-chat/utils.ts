
// Environment variables
export const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
export const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
export const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to determine if a message is a database query
export function isDatabaseQueryRequest(message: string): boolean {
  const databaseKeywords = [
    "database", "sql", "query", "data", "find", 
    "show", "list", "get", "search", "count",
    "records", "tables", "in the database",
    "banco de dados", "consulta", "dados", "registros", "tabelas", "no banco de dados",
    "metrics", "métricas", "r&d", "p&d", "investment", "investimento",
    "patent", "patente", "projects", "projetos", "funding", "financiamento",
    "program", "programa", "policy", "política", "framework", "quadro"
  ];
  
  const message_lower = message.toLowerCase();
  return databaseKeywords.some(keyword => 
    message_lower.includes(keyword)
  );
}

// System prompts
export function getDatabaseSystemPrompt(): string {
  return `Você é o assistente de banco de dados para ANI (Agência Nacional de Inovação) de Portugal.
          
  Você tem acesso às seguintes tabelas no banco de dados:
  
  1. ani_projects - Projetos de inovação
     - id (uuid): Identificador único
     - title (text): Título do projeto
     - description (text): Descrição do projeto
     - funding_amount (decimal): Valor do financiamento
     - status (text): Estado do projeto (submitted, active, pending, completed)
     - sector (text): Setor econômico
     - region (text): Região de Portugal
     - start_date (date): Data de início
     - end_date (date): Data de término
     - organization (text): Organização responsável
     - contact_email (text): Email de contato
     - contact_phone (text): Telefone de contato
     - created_at (timestamp): Data de criação
     - updated_at (timestamp): Data de atualização
  
  2. ani_funding_programs - Programas de financiamento
     - id (uuid): Identificador único
     - name (text): Nome do programa
     - description (text): Descrição do programa
     - total_budget (decimal): Orçamento total
     - start_date (date): Data de início
     - end_date (date): Data de término
     - eligibility_criteria (text): Critérios de elegibilidade
     - application_process (text): Processo de aplicação
     - sector_focus (text[]): Setores de foco (array)
     - created_at (timestamp): Data de criação
     - updated_at (timestamp): Data de atualização
  
  3. ani_policy_frameworks - Políticas e quadros de inovação
     - id (uuid): Identificador único
     - title (text): Título da política
     - description (text): Descrição da política
     - implementation_date (date): Data de implementação
     - status (text): Estado (active, inactive, draft)
     - scope (text): Escopo da política
     - key_objectives (text[]): Objetivos principais (array)
     - related_legislation (text): Legislação relacionada
     - created_at (timestamp): Data de criação
     - updated_at (timestamp): Data de atualização
  
  4. ani_metrics - Métricas e indicadores de inovação
     - id (uuid): Identificador único
     - name (text): Nome da métrica
     - category (text): Categoria da métrica
     - description (text): Descrição da métrica
     - value (decimal): Valor numérico
     - unit (text): Unidade de medida
     - measurement_date (date): Data da medição
     - source (text): Fonte da informação
     - region (text): Região relacionada
     - sector (text): Setor relacionado
     - created_at (timestamp): Data de criação
     - updated_at (timestamp): Data de atualização

  Quando perguntado sobre dados no banco de dados, gere uma consulta SQL que responda à pergunta e apresente isso em um formato claro.
  
  Para a métrica de investimento em P&D, você pode usar:
  <SQL>
  SELECT name, value, unit, measurement_date, source 
  FROM ani_metrics 
  WHERE category = 'Investment' AND name LIKE '%R&D%' OR name LIKE '%P&D%'
  ORDER BY measurement_date DESC LIMIT 1;
  </SQL>
  
  Para a contagem de projetos ativos, use:
  <SQL>
  SELECT COUNT(*) as total_active_projects
  FROM ani_projects
  WHERE status = 'active';
  </SQL>
  
  Para informações sobre patentes, use:
  <SQL>
  SELECT name, value, unit, measurement_date, source
  FROM ani_metrics
  WHERE category = 'Intellectual Property' AND name LIKE '%Patent%'
  ORDER BY measurement_date DESC LIMIT 1;
  </SQL>
  
  Se uma consulta parece muito complexa, divida-a em consultas mais simples. Responda no mesmo idioma da pergunta (inglês ou português).`;
}

export function getGeneralSystemPrompt(): string {
  return `You are the AI assistant for ANI (Agência Nacional de Inovação) of Portugal. 
  Provide accurate information about innovation, project funding, innovation policies, 
  and related metrics. If the user asks about specific metrics or data that should be in the ANI database,
  always try to provide that information by generating SQL queries. When you present data from the
  database, format it in a natural, conversational way, as if you are explaining the data to the user,
  not just showing raw results.
  
  For example, if someone asks "What's the investment in R&D?" you should provide the actual percentage
  or amount from the database, not just say you don't have access to real-time data.
  
  Respond in the same language as the question (English or Portuguese).`;
}
