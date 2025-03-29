import { supabase } from "@/integrations/supabase/client";

// Update the suggested questions to better match our database schema and include Portuguese questions
export const suggestedDatabaseQuestions = [
  // Portuguese questions
  "Qual o investimento em R&D em 2023?",
  "Quais são os programas de financiamento para energia renovável?",
  "Qual a média de financiamento para projetos no sector de biotecnologia?",
  "Mostre-me os projetos com maior financiamento na região Norte",
  "Quais são as métricas de inovação para Lisboa em 2024?",
  "Quantas colaborações internacionais existem focadas em IA?",
  "Quantos projetos ativos existem na área de energia renovável?",
  "Quais são as instituições com mais patentes registradas?",
  "Qual é o total de investimento em inovação por região?",
  "Listar todas as políticas focadas em sustentabilidade",
  "Qual é o orçamento médio dos programas de financiamento?",
  "Quais são os principais parceiros internacionais em pesquisa?",
  
  // English questions
  "Which funding programs include renewable energy in their sector focus?",
  "Show me the top 5 projects with highest funding amounts in the technology sector",
  "What are the innovation metrics for the Lisbon region from 2024?",
  "Which international collaborations focus on AI research?",
  "What is the average funding amount for projects in the biotech sector?",
  "Which policy frameworks have 'active' status?",
  "What organizations have the most funded projects in Porto?",
  "List all funding programs with application deadlines in the next 6 months",
  "Which countries have the most international collaborations with Portugal?",
  "What technology metrics have shown improvement in the last year?",
  "Show me projects from the North region sorted by funding amount",
  "What policy frameworks were implemented in 2023?",
  "List funding programs specifically targeting SMEs",
  "Which sectors receive the highest average funding amounts?",
  "Show me the distribution of innovation metrics across different regions"
];

// Mock data for different query types
const mockDataResponses = {
  funding_programs: [
    {
      id: '1',
      name: 'Programa Nacional de Inovação Digital',
      description: 'Financiamento para projetos de digitalização e inovação tecnológica',
      total_budget: 15000000,
      application_deadline: '2024-12-31',
      sector_focus: ['tecnologia', 'digitalização', 'inovação'],
      funding_type: 'subsídio'
    },
    {
      id: '2',
      name: 'Energia Renovável Portugal 2030',
      description: 'Programa de incentivo a projetos de energia renovável',
      total_budget: 25000000,
      application_deadline: '2025-06-30',
      sector_focus: ['energia renovável', 'sustentabilidade', 'energia solar', 'energia eólica'],
      funding_type: 'misto'
    },
    {
      id: '3',
      name: 'Biotech Inovação',
      description: 'Financiamento para pesquisa e desenvolvimento em biotecnologia',
      total_budget: 12000000,
      application_deadline: '2025-03-15',
      sector_focus: ['biotecnologia', 'saúde', 'pesquisa'],
      funding_type: 'empréstimo'
    },
    {
      id: '4',
      name: 'PME Digital',
      description: 'Apoio à digitalização de pequenas e médias empresas',
      total_budget: 8500000,
      application_deadline: '2024-09-30',
      sector_focus: ['digitalização', 'PME', 'tecnologia'],
      funding_type: 'subsídio'
    },
    {
      id: '5',
      name: 'Horizonte Verde',
      description: 'Programa para desenvolvimento de tecnologias sustentáveis',
      total_budget: 18000000,
      application_deadline: '2025-01-31',
      sector_focus: ['sustentabilidade', 'tecnologia verde', 'economia circular'],
      funding_type: 'misto'
    }
  ],
  projects: [
    {
      id: '1',
      title: 'Plataforma de Telemedicina Nacional',
      description: 'Desenvolvimento de uma plataforma integrada de telemedicina para o SNS',
      funding_amount: 1200000,
      start_date: '2023-06-01',
      status: 'Active',
      sector: 'Saúde',
      region: 'Lisboa',
      organization: 'Instituto de Tecnologias da Saúde'
    },
    {
      id: '2',
      title: 'Rede Inteligente de Monitorização Ambiental',
      description: 'Implementação de sensores IoT para monitorização ambiental',
      funding_amount: 950000,
      start_date: '2023-09-15',
      status: 'Active',
      sector: 'Ambiente',
      region: 'Porto',
      organization: 'EcoTech Portugal'
    },
    {
      id: '3',
      title: 'Agricultura de Precisão AI',
      description: 'Utilização de inteligência artificial para otimização de cultivos',
      funding_amount: 780000,
      start_date: '2023-11-01',
      status: 'Active',
      sector: 'Agricultura',
      region: 'Alentejo',
      organization: 'AgriTech Inovação'
    },
    {
      id: '4',
      title: 'Sistema de Energias Renováveis Integrado',
      description: 'Desenvolvimento de sistemas híbridos de energia solar e eólica',
      funding_amount: 1450000,
      start_date: '2024-01-20',
      status: 'Active',
      sector: 'Energia Renovável',
      region: 'Norte',
      organization: 'RenewTech Portugal'
    },
    {
      id: '5',
      title: 'Plataforma de Inteligência Artificial para Diagnóstico Médico',
      description: 'Desenvolvimento de algoritmos de IA para auxílio diagnóstico',
      funding_amount: 1650000,
      start_date: '2023-07-10',
      status: 'Active',
      sector: 'Saúde',
      region: 'Lisboa',
      organization: 'MedTech AI'
    }
  ],
  metrics: [
    {
      id: '1',
      name: 'Patentes Registadas',
      category: 'inovação',
      value: 342,
      region: 'Lisboa',
      measurement_date: '2024-01-15',
      unit: 'quantidade'
    },
    {
      id: '2',
      name: 'Investimento em I&D',
      category: 'financiamento',
      value: 45000000,
      region: 'Lisboa',
      measurement_date: '2024-02-20',
      unit: 'EUR'
    },
    {
      id: '3',
      name: 'Startups Criadas',
      category: 'empreendedorismo',
      value: 78,
      region: 'Lisboa',
      measurement_date: '2024-03-10',
      unit: 'quantidade'
    },
    {
      id: '4',
      name: 'Exportação de Tecnologia',
      category: 'economia',
      value: 37000000,
      region: 'Lisboa',
      measurement_date: '2024-03-25',
      unit: 'EUR'
    },
    {
      id: '5',
      name: 'Patentes Registadas',
      category: 'inovação',
      value: 187,
      region: 'Porto',
      measurement_date: '2024-01-15',
      unit: 'quantidade'
    },
    {
      id: '6',
      name: 'Investimento em I&D',
      category: 'financiamento',
      value: 28500000,
      region: 'Porto',
      measurement_date: '2024-02-20',
      unit: 'EUR'
    }
  ],
  policy_frameworks: [
    {
      id: '1',
      title: 'Plano Nacional de Energia e Clima 2030',
      description: 'Estratégia integrada para transição energética e sustentabilidade',
      implementation_date: '2023-01-01',
      status: 'active',
      key_objectives: ['Reduzir emissões de carbono', 'Aumentar produção renovável', 'Eficiência energética']
    },
    {
      id: '2',
      title: 'Estratégia Nacional para Inteligência Artificial',
      description: 'Plano para desenvolvimento e adoção de IA em Portugal',
      implementation_date: '2023-03-15',
      status: 'active',
      key_objectives: ['Formação em IA', 'Investimento em pesquisa', 'Ética em IA']
    },
    {
      id: '3',
      title: 'Agenda de Inovação para Agricultura',
      description: 'Modernização e sustentabilidade do setor agrícola',
      implementation_date: '2023-06-01',
      status: 'active',
      key_objectives: ['Agricultura de precisão', 'Produção sustentável', 'Digitalização']
    }
  ],
  international_collaborations: [
    {
      id: '1',
      program_name: 'Horizonte Europa - Portugal/Alemanha',
      country: 'Alemanha',
      partnership_type: 'Pesquisa e Desenvolvimento',
      focus_areas: ['energias renováveis', 'mobilidade sustentável'],
      start_date: '2023-01-01',
      total_budget: 12500000
    },
    {
      id: '2',
      program_name: 'Programa Bilateral Portugal/França em IA',
      country: 'França',
      partnership_type: 'Transferência de Tecnologia',
      focus_areas: ['inteligência artificial', 'computação quântica'],
      start_date: '2023-06-15',
      total_budget: 8700000
    },
    {
      id: '3',
      program_name: 'Programa Ibérico de Biotecnologia',
      country: 'Espanha',
      partnership_type: 'Pesquisa Conjunta',
      focus_areas: ['biotecnologia', 'genética'],
      start_date: '2023-04-01',
      total_budget: 7500000
    }
  ]
};

// Define predefined queries that users can run
export const predefinedQueries = [
  {
    name: "funding_renewable_energy",
    query: "SELECT * FROM ani_funding_programs WHERE 'energia renovável' = ANY(sector_focus) OR 'renewable energy' = ANY(sector_focus)",
    description: "Programas de financiamento para energia renovável",
    language: "pt"
  },
  {
    name: "recent_projects",
    query: "SELECT * FROM ani_projects ORDER BY start_date DESC LIMIT 5",
    description: "Projetos mais recentes",
    language: "pt"
  },
  {
    name: "lisbon_metrics",
    query: "SELECT * FROM ani_metrics WHERE region = 'Lisboa' ORDER BY measurement_date DESC",
    description: "Métricas de inovação para Lisboa",
    language: "pt"
  },
  {
    name: "active_policies",
    query: "SELECT * FROM ani_policy_frameworks WHERE status = 'active'",
    description: "Políticas e frameworks ativos",
    language: "pt"
  },
  {
    name: "international_ai_collaborations",
    query: "SELECT * FROM ani_international_collaborations WHERE ARRAY_TO_STRING(focus_areas, ',') ILIKE '%inteligência artificial%' OR ARRAY_TO_STRING(focus_areas, ',') ILIKE '%ai%'",
    description: "Colaborações internacionais em IA",
    language: "pt"
  },
  {
    name: "top_funded_projects",
    query: "SELECT * FROM ani_projects ORDER BY funding_amount DESC LIMIT 10",
    description: "Top 10 projetos com maior financiamento",
    language: "pt"
  }
];

// Function to get mock data for a given query
const getMockDataForQuery = (query: string): { data: any[], sqlQuery: string, message: string } => {
  const queryLower = query.toLowerCase();
  
  // Detect language
  const isPortuguese = /[áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/.test(query) || 
                     /\b(qual|como|onde|quem|porque|quais|quando)\b/i.test(query);
  
  // Look for specific keywords
  if (queryLower.includes('financiamento') || queryLower.includes('funding program') || 
      queryLower.includes('programa') || queryLower.includes('orçamento')) {
    return {
      data: mockDataResponses.funding_programs,
      sqlQuery: "SELECT * FROM ani_funding_programs LIMIT 5",
      message: isPortuguese ? 
        "Aqui estão os programas de financiamento disponíveis." : 
        "Here are the available funding programs."
    };
  } else if (queryLower.includes('projeto') || queryLower.includes('project')) {
    return {
      data: mockDataResponses.projects,
      sqlQuery: "SELECT * FROM ani_projects ORDER BY funding_amount DESC LIMIT 5",
      message: isPortuguese ? 
        "Aqui estão os principais projetos ordenados por valor de financiamento." : 
        "Here are the top projects sorted by funding amount."
    };
  } else if (queryLower.includes('métrica') || queryLower.includes('metric') || 
             queryLower.includes('inovação') || queryLower.includes('innovation') || 
             queryLower.includes('lisboa') || queryLower.includes('porto')) {
    return {
      data: mockDataResponses.metrics,
      sqlQuery: "SELECT * FROM ani_metrics WHERE region IN ('Lisboa', 'Porto') ORDER BY measurement_date DESC LIMIT 6",
      message: isPortuguese ? 
        "Aqui estão as métricas de inovação para as regiões de Lisboa e Porto." : 
        "Here are the innovation metrics for the Lisbon and Porto regions."
    };
  } else if (queryLower.includes('política') || queryLower.includes('policy') || 
             queryLower.includes('framework') || queryLower.includes('estratégia')) {
    return {
      data: mockDataResponses.policy_frameworks,
      sqlQuery: "SELECT * FROM ani_policy_frameworks WHERE status = 'active' LIMIT 3",
      message: isPortuguese ? 
        "Aqui estão as políticas e frameworks ativos." : 
        "Here are the active policy frameworks."
    };
  } else if (queryLower.includes('internacional') || queryLower.includes('international') || 
             queryLower.includes('colaboração') || queryLower.includes('collaboration')) {
    return {
      data: mockDataResponses.international_collaborations,
      sqlQuery: "SELECT * FROM ani_international_collaborations ORDER BY start_date DESC LIMIT 3",
      message: isPortuguese ? 
        "Aqui estão as colaborações internacionais mais recentes." : 
        "Here are the most recent international collaborations."
    };
  } else if (queryLower.includes('energia') || queryLower.includes('energy') || 
             queryLower.includes('renovável') || queryLower.includes('renewable')) {
    return {
      data: mockDataResponses.funding_programs.filter(p => 
        p.sector_focus.some(s => s.includes('energia') || s.includes('energy') || s.includes('renovável') || s.includes('renewable'))
      ),
      sqlQuery: "SELECT * FROM ani_funding_programs WHERE 'energia renovável' = ANY(sector_focus) OR 'renewable energy' = ANY(sector_focus)",
      message: isPortuguese ? 
        "Aqui estão os programas de financiamento relacionados a energia renovável." : 
        "Here are the funding programs related to renewable energy."
    };
  } 
  
  // Default response with a mix of data
  return {
    data: [...mockDataResponses.projects.slice(0, 2), ...mockDataResponses.metrics.slice(0, 2)],
    sqlQuery: "SELECT * FROM ani_projects UNION SELECT * FROM ani_metrics LIMIT 4",
    message: isPortuguese ? 
      "Aqui está uma amostra de dados do sistema." : 
      "Here's a sample of data from the system."
  };
};

// Function to execute a predefined query
export const executePredefinedQuery = async (queryId: string): Promise<AIQueryResponse> => {
  const predefinedQuery = predefinedQueries.find(q => q.name === queryId);
  
  if (!predefinedQuery) {
    return {
      message: "Predefined query not found",
      sqlQuery: "",
      results: null,
      noResults: true
    };
  }
  
  try {
    // Execute the predefined SQL query
    const { data, error } = await supabase.rpc('execute_sql_query', {
      sql_query: predefinedQuery.query
    });
    
    if (error) {
      console.error('Error executing predefined query:', error);
      return {
        message: `Error executing query: ${error.message}`,
        sqlQuery: predefinedQuery.query,
        results: null,
        noResults: true
      };
    }
    
    // Check if data is an array and has items
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        message: "The query executed successfully but returned no results.",
        sqlQuery: predefinedQuery.query,
        results: null,
        noResults: true
      };
    }
    
    // Generate a human-readable response based on the predefined query
    const isPortuguese = predefinedQuery.language === 'pt';
    const message = isPortuguese
      ? `Aqui estão os resultados para "${predefinedQuery.description}". Encontramos ${data.length} registros.`
      : `Here are the results for "${predefinedQuery.description}". Found ${data.length} records.`;
    
    return {
      message: message,
      sqlQuery: predefinedQuery.query,
      results: data,
      noResults: false
    };
  } catch (error) {
    console.error('Error in executePredefinedQuery:', error);
    return {
      message: `Failed to execute query: ${error instanceof Error ? error.message : 'Unknown error'}`,
      sqlQuery: predefinedQuery.query,
      results: null,
      noResults: true
    };
  }
};

// Add function to classify documents based on title and content
export const classifyDocument = async (data: {
  title: string;
  summary?: string;
  fileName?: string;
}): Promise<string> => {
  try {
    // Call the classify-document edge function
    const { data: classificationData, error } = await supabase.functions.invoke('classify-document', {
      body: {
        title: data.title,
        summary: data.summary || "",
        fileName: data.fileName || ""
      }
    });
    
    if (error) {
      console.error('Error classifying document:', error);
      return 'unclassified';
    }
    
    return classificationData?.classification || 'unclassified';
  } catch (error) {
    console.error('Error in document classification:', error);
    return 'unclassified';
  }
};

// Add function to get the current AI model
export const getCurrentAIModel = async () => {
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
};

// Add function to generate a unique ID
export const genId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Add utility function to detect and clean numeric values
export const formatDatabaseValue = (value: any, columnName?: string): any => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  if (typeof value === 'number') {
    if (columnName && isMonetaryColumn(columnName)) {
      return new Intl.NumberFormat('pt-PT', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return value.toLocaleString('pt-PT');
  }
  
  if (typeof value === 'string') {
    const cleanValue = value.trim().replace(/[€$£\s]/g, '');
    
    if (!isNaN(Number(cleanValue)) && cleanValue !== '') {
      const numValue = Number(cleanValue);
      
      if (columnName && isMonetaryColumn(columnName)) {
        return new Intl.NumberFormat('pt-PT', { 
          style: 'currency', 
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(numValue);
      }
      
      return numValue.toLocaleString('pt-PT');
    }
  }
  
  return String(value);
};

// Helper function to check if a column should be treated as monetary value
export const isMonetaryColumn = (columnName: string): boolean => {
  const monetaryTerms = [
    'budget', 
    'amount', 
    'funding', 
    'cost',
    'price',
    'value', 
    'contribution',
    'investment',
    'expense',
    'revenue',
    'income',
    'orçamento',
    'financiamento',
    'investimento',
    'custo',
    'preço',
    'valor'
  ];
  
  const nonMonetaryTerms = [
    'count',
    'total_collaborations',
    'number',
    'qty',
    'quantity',
    'applications',
    'projects',
    'startups',
    'collaborations',
    'patents',
    'contagem',
    'total',
    'número',
    'quantidade',
    'aplicações',
    'projetos',
    'patentes'
  ];
  
  const colName = columnName.toLowerCase();
  
  for (const term of nonMonetaryTerms) {
    if (colName.includes(term)) {
      return false;
    }
  }
  
  for (const term of monetaryTerms) {
    if (colName.includes(term)) {
      return true;
    }
  }
  
  return false;
};

// Helper function to detect and clean numeric values
export const isInvalidOrUnrecognizedQuery = (query: string): boolean => {
  if (query.trim().length < 5) return true;
  
  // Database query words in English and Portuguese
  const databaseQueryWords = [
    // English query words
    'show', 'select', 'list', 'find', 'what', 'which', 'how', 'where', 'who',
    // Portuguese query words
    'mostrar', 'selecionar', 'listar', 'encontrar', 'qual', 'quais', 'como', 'onde', 'quem'
  ];
  
  // Database entities in English and Portuguese
  const databaseEntities = [
    // English entities
    'project', 'funding', 'program', 'metric', 'policy', 'collaboration', 
    'research', 'innovation', 'technology', 'renewable', 'energy',
    // Portuguese entities
    'projeto', 'financiamento', 'programa', 'métrica', 'política', 'colaboração',
    'pesquisa', 'inovação', 'tecnologia', 'renovável', 'energia'
  ];
  
  // Check if query contains at least one query word
  const hasQueryWord = databaseQueryWords.some(word => 
    query.toLowerCase().includes(word.toLowerCase())
  );
  
  // Check if query contains at least one entity
  const hasEntity = databaseEntities.some(entity => 
    query.toLowerCase().includes(entity.toLowerCase())
  );
  
  // Return true if the query is invalid (missing either query word or entity)
  return !(hasQueryWord || hasEntity);
};

// Define the response type for consistency
export interface AIQueryResponse {
  message: string;
  sqlQuery: string;
  results: any[] | null;
  noResults: boolean;
  queryId?: string;
  analysis?: any;
}

// Helper function to create a consistent "no results" response
function createNoResultsResponse(prompt: string, isInvalid: boolean): AIQueryResponse {
  // Detect language for appropriate message
  const isPortuguese = (/[áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/.test(prompt) || 
                       /\b(qual|como|onde|quem|porque|quais|quando)\b/i.test(prompt));
  
  let message = '';
  
  if (isPortuguese) {
    if (isInvalid) {
      message = `Nenhum resultado encontrado para sua consulta: "${prompt}". O formato da consulta não é reconhecido ou as informações solicitadas não correspondem ao esquema do nosso banco de dados.`;
    } else {
      message = `Nenhum resultado encontrado para sua consulta: "${prompt}". Os dados solicitados não estão atualmente em nosso banco de dados, mas você pode populá-lo usando o botão abaixo.`;
    }
  } else {
    if (isInvalid) {
      message = `No results found for your query: "${prompt}". The query format is not recognized or the requested information doesn't match our database schema.`;
    } else {
      message = `No results found for your query: "${prompt}". The requested data is not currently in our database, but you can populate it using the button below.`;
    }
  }
  
  return {
    message: message,
    sqlQuery: '',
    results: null,
    noResults: true,
    queryId: undefined
  };
}

// Add function to extract energy-related keywords from a query
const extractEnergyKeywords = (query: string): string[] => {
  const lowercaseQuery = query.toLowerCase();
  
  // Energy terms in English and Portuguese
  const energyTerms = [
    // English terms
    'renewable energy', 'clean energy', 'green energy', 
    'sustainable energy', 'alternative energy',
    'solar', 'wind', 'hydro', 'biomass', 'geothermal',
    'photovoltaic', 'renewable', 'clean power', 'green power',
    // Portuguese terms
    'energia renovável', 'energia limpa', 'energia verde',
    'energia sustentável', 'energia alternativa',
    'solar', 'eólica', 'hídrica', 'biomassa', 'geotérmica',
    'fotovoltaica', 'renovável'
  ];
  
  return energyTerms.filter(term => lowercaseQuery.includes(term));
};

// Function to identify Portuguese language in query
const isPortugueseQuery = (query: string): boolean => {
  // Check for accented characters common in Portuguese
  const hasAccentedChars = /[áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/.test(query);
  
  // Check for common Portuguese question words
  const hasPortugueseWords = /\b(qual|como|onde|quem|porque|quais|quando|mostrar|listar|encontrar)\b/i.test(query);
  
  return hasAccentedChars || hasPortugueseWords;
};

// Add function to handle database queries and AI responses
export const generateResponse = async (prompt: string): Promise<AIQueryResponse> => {
  try {
    // Detect language and keywords to enhance the prompt
    const energyKeywords = extractEnergyKeywords(prompt);
    const isPortuguese = isPortugueseQuery(prompt);
    
    // Store the query in the database first to get a queryId
    let queryId = '';
    try {
      const userResponse = await supabase.auth.getUser();
      const userId = userResponse.data?.user?.id;
      
      const { data: queryData, error: queryError } = await supabase.from('query_history').insert({
        query_text: prompt,
        user_id: userId || null,
        was_successful: true, // Set to true since we'll always return mock data
        language: isPortuguese ? 'pt' : 'en',
        error_message: null
      }).select('id');
      
      if (queryError) {
        console.error('Error storing query in database:', queryError);
      } else if (queryData && queryData.length > 0) {
        queryId = queryData[0].id;
        console.log('Query stored with ID:', queryId);
      }
    } catch (dbError) {
      console.error('Error saving to database:', dbError);
    }
    
    // Get mock data for the query
    const mockResponse = getMockDataForQuery(prompt);
    
    return {
      message: mockResponse.message,
      sqlQuery: mockResponse.sqlQuery,
      results: mockResponse.data,
      noResults: false,
      queryId: queryId
    };
  } catch (error) {
    console.error('Error generating response:', error);
    return {
      message: 'Desculpe, ocorreu um erro ao processar sua consulta.',
      sqlQuery: '',
      results: null,
      noResults: true
    };
  }
};

// Add function to enhance the system prompt with renewable energy domain knowledge
export const getEnhancedSystemPrompt = () => {
  return `
When users ask about renewable energy programs, here are some key details to include:
- Renewable energy programs often focus on solar, wind, hydroelectric, biomass, and geothermal technologies
- Common funding types include grants, loans, tax incentives, and equity investments
- Portugal has set a target of 80% renewable electricity by 2030
- Important metrics include: CO2 emissions avoided, energy capacity installed (MW), and cost per kWh
- The European Green Deal and Portugal's National Energy and Climate Plan are key policy frameworks
- Success rates for renewable energy projects range from 25-40% depending on program competitiveness
  `;
};
