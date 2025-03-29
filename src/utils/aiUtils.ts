
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
  "Quantas patentes foram registadas em 2022?",
  "Quais são as áreas com maior número de patentes?",
  
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
  "Show me the distribution of innovation metrics across different regions",
  "How many patents were registered in 2022?",
  "Which institutions hold the most patents?"
];

// Mock data for different query types
const mockDataResponses = {
  funding_programs: [
    {
      id: '1',
      name: 'Horizonte Europa',
      description: 'Programa de financiamento para pesquisa e inovação na Europa',
      total_budget: 95000000000,
      application_deadline: '2023-05-15',
      end_date: '2027-12-31',
      sector_focus: ['pesquisa científica', 'inovação tecnológica', 'energia renovável'],
      funding_type: 'grant'
    },
    {
      id: '2',
      name: 'Portugal 2030',
      description: 'Programa nacional de financiamento para modernização',
      total_budget: 23000000000,
      application_deadline: '2023-08-30',
      end_date: '2030-12-31',
      sector_focus: ['transformação digital', 'energia renovável', 'biotecnologia'],
      funding_type: 'mixed'
    },
    {
      id: '3',
      name: 'Programa Operacional Competitividade e Internacionalização',
      description: 'Apoio à competitividade das PME portuguesas',
      total_budget: 4500000000,
      application_deadline: '2023-06-22',
      end_date: '2027-12-31',
      sector_focus: ['internacionalização', 'competitividade empresarial'],
      funding_type: 'grant'
    }
  ],

  projects: [
    {
      id: '1',
      title: 'Desenvolvimento de tecnologias sustentáveis para tratamento de água',
      description: 'Pesquisa e implementação de métodos inovadores para purificação de água',
      funding_amount: 750000,
      start_date: '2022-03-15',
      end_date: '2025-03-14',
      status: 'active',
      sector: 'Ambiente',
      region: 'Norte',
      organization: 'Universidade do Porto'
    },
    {
      id: '2',
      title: 'Aplicação de Inteligência Artificial em diagnósticos médicos',
      description: 'Desenvolvimento de algoritmos para auxiliar diagnósticos precoces',
      funding_amount: 1200000,
      start_date: '2022-06-01',
      end_date: '2024-05-31',
      status: 'active',
      sector: 'Saúde',
      region: 'Lisboa',
      organization: 'Instituto Superior Técnico'
    },
    {
      id: '3',
      title: 'Sistemas energéticos inteligentes para edifícios comerciais',
      description: 'Implementação de redes elétricas inteligentes com gestão por IA',
      funding_amount: 830000,
      start_date: '2022-01-15',
      end_date: '2023-12-31',
      status: 'completed',
      sector: 'Energia',
      region: 'Centro',
      organization: 'Universidade de Coimbra'
    }
  ],

  metrics: [
    {
      id: '1',
      name: 'Investimento em R&D',
      category: 'Financiamento',
      value: 3200000000,
      unit: 'EUR',
      measurement_date: '2023-12-31',
      region: 'Portugal',
      sector: 'Todos',
      source: 'INE'
    },
    {
      id: '2',
      name: 'Patentes Registradas',
      category: 'Propriedade Intelectual',
      value: 143,
      unit: 'Quantidade',
      measurement_date: '2022-12-31',
      region: 'Lisboa',
      sector: 'Tecnologia',
      source: 'INPI'
    },
    {
      id: '3',
      name: 'Startups Criadas',
      category: 'Empreendedorismo',
      value: 856,
      unit: 'Quantidade',
      measurement_date: '2023-12-31',
      region: 'Portugal',
      sector: 'Todos',
      source: 'Startup Portugal'
    }
  ],

  policy_frameworks: [
    {
      id: '1',
      title: 'Estratégia Nacional para o Hidrogénio',
      description: 'Plano para implementação de infraestrutura de hidrogénio verde em Portugal',
      implementation_date: '2023-02-15',
      status: 'active',
      key_objectives: ['Descarbonização', 'Transição energética', 'Criação de empregos verdes']
    },
    {
      id: '2',
      title: 'Agenda de Inovação para a Agricultura',
      description: 'Transformação do setor agrícola através de tecnologia e práticas sustentáveis',
      implementation_date: '2022-05-10',
      status: 'active',
      key_objectives: ['Modernização agrícola', 'Sustentabilidade', 'Economia circular']
    },
    {
      id: '3',
      title: 'Plano Nacional de Ação para a Eficiência Energética',
      description: 'Medidas para aumentar a eficiência energética em todos os setores',
      implementation_date: '2021-11-30',
      status: 'active',
      key_objectives: ['Redução do consumo energético', 'Eficiência energética', 'Metas climáticas']
    }
  ],

  international_collaborations: [
    {
      id: '1',
      program_name: 'Portugal-Alemanha em IA',
      country: 'Alemanha',
      partnership_type: 'Bilateral',
      focus_areas: ['Inteligência Artificial', 'Machine Learning', 'Robótica'],
      start_date: '2022-06-15',
      end_date: '2026-06-14',
      total_budget: 5000000
    },
    {
      id: '2',
      program_name: 'Cooperação Portugal-Brasil em Biotecnologia',
      country: 'Brasil',
      partnership_type: 'Bilateral',
      focus_areas: ['Biotecnologia', 'Saúde', 'Agricultura'],
      start_date: '2021-09-01',
      end_date: '2025-08-31',
      total_budget: 3800000
    },
    {
      id: '3',
      program_name: 'Rede Ibérica de Energias Renováveis',
      country: 'Espanha',
      partnership_type: 'Regional',
      focus_areas: ['Energia Solar', 'Energia Eólica', 'Redes Inteligentes'],
      start_date: '2022-01-20',
      end_date: '2027-01-19',
      total_budget: 12000000
    }
  ],
  
  patents: [
    {
      id: '1',
      patent_title: 'Sistema de Energia Renovável Integrada',
      filing_date: '2022-03-15',
      grant_date: '2022-08-22',
      organization: 'Instituto de Tecnologia Energética',
      inventor_names: ['Maria Silva', 'João Costa'],
      sector: 'Energia Renovável',
      registration_year: 2022,
      region: 'Lisboa'
    },
    {
      id: '2',
      patent_title: 'Método de Purificação de Água usando Nanotecnologia',
      filing_date: '2022-05-03',
      grant_date: '2022-11-10',
      organization: 'Universidade de Lisboa',
      inventor_names: ['António Ferreira', 'Carolina Pereira'],
      sector: 'Ambiente',
      registration_year: 2022,
      region: 'Lisboa'
    },
    {
      id: '3',
      patent_title: 'Dispositivo Médico para Monitorização Cardíaca',
      filing_date: '2022-01-20',
      grant_date: '2022-07-18',
      organization: 'Faculdade de Medicina do Porto',
      inventor_names: ['Ricardo Santos', 'Ana Rodrigues'],
      sector: 'Saúde',
      registration_year: 2022,
      region: 'Porto'
    },
    {
      id: '4',
      patent_title: 'Algoritmo de Inteligência Artificial para Previsão de Mercado',
      filing_date: '2022-08-05',
      grant_date: '2023-01-15',
      organization: 'Instituto Superior Técnico',
      inventor_names: ['Miguel Costa', 'Sofia Lopes'],
      sector: 'Tecnologia',
      registration_year: 2022,
      region: 'Lisboa'
    },
    {
      id: '5',
      patent_title: 'Método de Produção de Bioplástico Biodegradável',
      filing_date: '2022-06-12',
      grant_date: '2022-12-20',
      organization: 'Universidade do Minho',
      inventor_names: ['Pedro Oliveira', 'Mariana Santos'],
      sector: 'Biotecnologia',
      registration_year: 2022,
      region: 'Norte'
    },
    {
      id: '6',
      patent_title: 'Sistema de Irrigação Inteligente',
      filing_date: '2022-04-08',
      grant_date: '2022-10-05',
      organization: 'Instituto Politécnico de Beja',
      inventor_names: ['Joaquim Mendes', 'Teresa Almeida'],
      sector: 'Agricultura',
      registration_year: 2022,
      region: 'Alentejo'
    }
  ],
  
  patent_holders: [
    {
      id: '1',
      organization_name: 'Universidade de Lisboa',
      sector: 'Académico',
      region: 'Lisboa',
      patent_count: 45,
      patents_in_2022: 12,
      innovation_index: 87.5
    },
    {
      id: '2',
      organization_name: 'Instituto Superior Técnico',
      sector: 'Académico',
      region: 'Lisboa',
      patent_count: 38,
      patents_in_2022: 9,
      innovation_index: 92.3
    },
    {
      id: '3',
      organization_name: 'Universidade do Porto',
      sector: 'Académico',
      region: 'Porto',
      patent_count: 32,
      patents_in_2022: 7,
      innovation_index: 84.1
    },
    {
      id: '4',
      organization_name: 'Universidade do Minho',
      sector: 'Académico',
      region: 'Norte',
      patent_count: 28,
      patents_in_2022: 6,
      innovation_index: 79.8
    },
    {
      id: '5',
      organization_name: 'Hovione',
      sector: 'Farmacêutico',
      region: 'Lisboa',
      patent_count: 25,
      patents_in_2022: 5,
      innovation_index: 88.3
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
  },
  {
    name: "patents_2022",
    query: "SELECT * FROM ani_patents WHERE EXTRACT(YEAR FROM filing_date) = 2022",
    description: "Patentes registadas em 2022",
    language: "pt"
  },
  {
    name: "patent_holders",
    query: "SELECT * FROM ani_patent_holders ORDER BY patent_count DESC",
    description: "Instituições com mais patentes",
    language: "pt"
  }
];

// Function to get mock data for a given query
const getMockDataForQuery = (query: string): { data: any[], sqlQuery: string, message: string } => {
  const queryLower = query.toLowerCase();
  
  // Detect language
  const isPortuguese = /[áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/.test(query) || 
                     /\b(qual|como|onde|quem|porque|quais|quando|quantas)\b/i.test(query);
  
  // Patent-specific queries
  if (queryLower.includes('patente') || queryLower.includes('patent') || 
      queryLower.includes('registad') || queryLower.includes('register')) {
    
    // Check for year-specific patent queries
    if (queryLower.includes('2022')) {
      return {
        data: mockDataResponses.patents.filter(p => p.registration_year === 2022),
        sqlQuery: "SELECT * FROM ani_patents WHERE EXTRACT(YEAR FROM filing_date) = 2022",
        message: isPortuguese ? 
          `Foram registadas ${mockDataResponses.patents.filter(p => p.registration_year === 2022).length} patentes em 2022. Aqui estão os detalhes:` : 
          `There were ${mockDataResponses.patents.filter(p => p.registration_year === 2022).length} patents registered in 2022. Here are the details:`
      };
    }
    
    // General patent queries
    return {
      data: mockDataResponses.patents,
      sqlQuery: "SELECT * FROM ani_patents ORDER BY filing_date DESC",
      message: isPortuguese ? 
        "Aqui estão os dados de patentes disponíveis no sistema:" : 
        "Here are the patent data available in the system:"
    };
  }
  
  // Institution patent holders
  if ((queryLower.includes('instituição') || queryLower.includes('institution') || 
       queryLower.includes('organização') || queryLower.includes('organization')) && 
      (queryLower.includes('patente') || queryLower.includes('patent'))) {
    return {
      data: mockDataResponses.patent_holders,
      sqlQuery: "SELECT * FROM ani_patent_holders ORDER BY patent_count DESC",
      message: isPortuguese ? 
        "Aqui estão as instituições com mais patentes registradas:" : 
        "Here are the institutions with the most registered patents:"
    };
  }
  
  // Look for specific keywords for other types of queries
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
    'show', 'select', 'list', 'find', 'what', 'which', 'how', 'where', 'who', 'how many',
    // Portuguese query words
    'mostrar', 'selecionar', 'listar', 'encontrar', 'qual', 'quais', 'como', 'onde', 'quem', 'quantas', 'quantos'
  ];
  
  // Database entities in English and Portuguese
  const databaseEntities = [
    // English entities
    'project', 'funding', 'program', 'metric', 'policy', 'collaboration', 
    'research', 'innovation', 'technology', 'renewable', 'energy', 'patent',
    // Portuguese entities
    'projeto', 'financiamento', 'programa', 'métrica', 'política', 'colaboração',
    'pesquisa', 'inovação', 'tecnologia', 'renovável', 'energia', 'patente'
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
