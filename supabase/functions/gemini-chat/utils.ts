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
  // Convert the message to lowercase for case-insensitive matching
  const message_lower = message.toLowerCase();
  
  // Define patterns for identifying database queries in both Portuguese and English
  
  // General database-related keywords
  const databaseKeywords = [
    "database", "sql", "query", "data", "find", 
    "show", "list", "get", "search", "count",
    "records", "tables", "in the database",
    "banco de dados", "consulta", "dados", "registros", "tabelas", "no banco de dados"
  ];
  
  // Metrics-related keywords
  const metricsKeywords = [
    "metrics", "métricas", "statistics", "estatísticas", 
    "numbers", "números", "figures", "valores",
    "indicators", "indicadores", "performance", "desempenho",
    "measurement", "medição", "analysis", "análise"
  ];
  
  // R&D and Innovation keywords
  const innovationKeywords = [
    "r&d", "p&d", "research", "pesquisa", "development", "desenvolvimento",
    "innovation", "inovação", "investment", "investimento",
    "patent", "patente", "projects", "projetos", "funding", "financiamento",
    "program", "programa", "policy", "política", "framework", "quadro",
    "sector", "setor", "region", "região", "success rate", "taxa de sucesso"
  ];
  
  // Question patterns
  const questionPatterns = [
    "how many", "how much", "what is", "what are", "tell me about",
    "quantos", "quanto", "qual", "quais", "me diga sobre",
    "show me", "mostre-me", "can you tell", "pode me dizer",
    "i want to know", "eu quero saber", "give me info", "me dê informações"
  ];
  
  // Check for database explicit keywords
  const hasDatabaseKeyword = databaseKeywords.some(keyword => message_lower.includes(keyword));
  
  // Check for metrics keywords
  const hasMetricsKeyword = metricsKeywords.some(keyword => message_lower.includes(keyword));
  
  // Check for innovation keywords
  const hasInnovationKeyword = innovationKeywords.some(keyword => message_lower.includes(keyword));
  
  // Check for question patterns
  const hasQuestionPattern = questionPatterns.some(pattern => message_lower.includes(pattern));
  
  // Specific metrics patterns - these are very likely database queries
  const specificMetricsPatterns = [
    "r&d investment", "investimento em p&d",
    "patent applications", "aplicações de patentes",
    "active projects", "projetos ativos",
    "success rate", "taxa de sucesso",
    "funding amount", "valor de financiamento",
    "sector distribution", "distribuição por setor",
    "regional data", "dados regionais"
  ];
  
  const hasSpecificMetricsPattern = specificMetricsPatterns.some(pattern => 
    message_lower.includes(pattern)
  );
  
  // If we have a specific metrics pattern, it's almost certainly a query
  if (hasSpecificMetricsPattern) {
    return true;
  }
  
  // If we have a question pattern + innovation keyword, it's likely a query
  if (hasQuestionPattern && hasInnovationKeyword) {
    return true;
  }
  
  // If we have a metrics keyword + innovation keyword, it's likely a query
  if (hasMetricsKeyword && hasInnovationKeyword) {
    return true;
  }
  
  // If we explicitly mention database or use SQL, it's a query
  if (hasDatabaseKeyword) {
    return true;
  }
  
  // Otherwise, it's probably not a database query
  return false;
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

  Quando perguntado sobre dados no banco de dados, gere uma consulta SQL que responda à pergunta de maneira clara e completa.
  
  Para investimento em P&D (R&D), você pode usar:
  <SQL>
  SELECT name, value, unit, measurement_date, source 
  FROM ani_metrics 
  WHERE (category = 'Investment' AND (name LIKE '%R&D%' OR name LIKE '%P&D%'))
  OR name = 'R&D Investment'
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
  
  Para métricas por setor, use:
  <SQL>
  SELECT name, value, unit, sector, measurement_date
  FROM ani_metrics
  WHERE sector IS NOT NULL
  ORDER BY sector, measurement_date DESC;
  </SQL>
  
  Para métricas por região, use:
  <SQL>
  SELECT name, value, unit, region, measurement_date
  FROM ani_metrics
  WHERE region IS NOT NULL
  ORDER BY region, measurement_date DESC;
  </SQL>
  
  Para programas de financiamento, use:
  <SQL>
  SELECT name, description, total_budget, start_date, end_date
  FROM ani_funding_programs
  ORDER BY total_budget DESC;
  </SQL>
  
  Para políticas e frameworks ativos, use:
  <SQL>
  SELECT title, description, implementation_date, scope
  FROM ani_policy_frameworks
  WHERE status = 'active'
  ORDER BY implementation_date DESC;
  </SQL>
  
  Se uma consulta parece muito complexa, divida-a em consultas mais simples. Responda no mesmo idioma da pergunta (inglês ou português).
  
  IMPORTANTE: Não se esqueça de colocar sua consulta SQL dentro das tags <SQL> e </SQL>. Os resultados serão automaticamente formatados para uma exibição clara e amigável para o usuário.
  
  Ao interpretar os resultados, apresente-os em linguagem natural, explicando o significado dos dados e proporcionando contexto. Não apenas liste os números, mas explique o que eles significam no contexto da inovação em Portugal.`;
}

export function getGeneralSystemPrompt(): string {
  return `You are the AI assistant for ANI (Agência Nacional de Inovação) of Portugal. 
  Provide accurate information about innovation, project funding, innovation policies, 
  and related metrics. If the user asks about specific metrics or data that might be in the ANI database,
  always provide the information by retrieving actual data from the database.
  
  When the user asks about metrics like "What's the R&D investment in Portugal?", "How many active projects do we have?",
  or "Tell me about patent applications", consider these as data queries that require checking the database.
  Never respond with phrases like "I don't have access to real-time data" or "I would need to check the database" - 
  the system will automatically retrieve the necessary data from the database for these queries.
  
  When you present data from the database, format it in a natural, conversational way, as if you are
  explaining the data to the user, not just showing raw results. Include relevant context, comparisons,
  trends when appropriate, and cite the source and date of the information.
  
  For example, if someone asks "What's the investment in R&D?", the system will retrieve the actual data
  and you should present it as: "According to the latest data from [source] as of [date], Portugal's
  investment in R&D stands at [amount] [unit]. This represents [any context or comparison if available]."
  
  Respond in the same language as the question (English or Portuguese).`;
}
