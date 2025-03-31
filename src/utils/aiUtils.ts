import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface QueryResponseType {
  message: string;
  sqlQuery: string;
  results: any[] | null;
  error?: boolean;
  noResults?: boolean;
  queryId?: string;
  analysis?: any;
  isAIResponse?: boolean;
}

// Generate a unique ID
export const genId = () => uuidv4();

// Suggested queries for the user to try - now with 20+ Portuguese examples
export const suggestedDatabaseQueries = [
  // Original queries
  "Quais são as fontes de dados mais recentes?",
  "Quantos documentos foram extraídos no último mês?",
  "Liste as instituições que trabalham com tecnologia",
  "Mostre as cooperações internacionais ativas",
  "Qual é o volume total de financiamento de projetos em Lisboa?",
  
  // New additions - Patents
  "Quais universidades têm mais patentes registradas em Portugal?",
  "Qual é o índice médio de inovação dos detentores de patentes no setor de tecnologia?",
  "Compare o número de patentes entre instituições educacionais e empresas privadas",
  
  // Startups
  "Quais são as startups mais bem financiadas em Portugal?",
  "Qual região de Portugal tem mais startups no setor de tecnologia?",
  "Qual é o financiamento médio das startups portuguesas fundadas após 2015?",
  "Quantas startups em Lisboa têm mais de 100 funcionários?",
  
  // Technology Adoption
  "Qual tecnologia tem a maior taxa de adoção no setor financeiro?",
  "Quais são os principais desafios na adoção de Inteligência Artificial?",
  "Compare as taxas de adoção de tecnologias emergentes entre diferentes setores",
  
  // Innovation Networks
  "Quais são as maiores redes de inovação em Portugal por número de membros?",
  "Quais redes de inovação focam em sustentabilidade ou energia renovável?",
  "Que realizações foram alcançadas pela Rede Nacional de Inovação em Saúde?",
  
  // Innovation Policies
  "Quais políticas de inovação foram implementadas nos últimos 5 anos?",
  "Quais setores são mais beneficiados pelas políticas de inovação atuais?",
  "Quais são os incentivos fiscais disponíveis para atividades de I&D em Portugal?",
  
  // Research Publications
  "Quais são as publicações acadêmicas mais citadas de pesquisadores portugueses?",
  "Em quais áreas de pesquisa Portugal tem mais publicações de acesso aberto?",
  "Qual instituição portuguesa tem o maior fator de impacto médio em suas publicações?",
  
  // Innovation Metrics
  "Qual foi o investimento total em I&D em Portugal no último ano?",
  "Como se compara o investimento em inovação entre Lisboa e Porto?",
  "Qual é a tendência de crescimento das exportações de alta tecnologia?",
  
  // Funding Programs
  "Quais programas de financiamento têm os maiores orçamentos disponíveis?",
  "Quais áreas são prioritárias nos programas de financiamento atuais?",
  "Qual é a taxa de sucesso média das candidaturas a financiamento para inovação?",
  
  // Collaborations
  "Quais são os principais parceiros internacionais em projetos de inovação com Portugal?",
  "Quais colaborações internacionais têm o maior orçamento na área de energia renovável?",
  "Como evoluíram as parcerias internacionais de Portugal na última década?"
];

// Format database values for display
export const formatDatabaseValue = (value: any, columnName: string): string => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  
  // Handle date values
  if (columnName.includes('date') || columnName.includes('_at')) {
    if (typeof value === 'string' && value.includes('T')) {
      // If it's an ISO date string
      try {
        const date = new Date(value);
        return date.toLocaleDateString('pt-PT', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return value;
      }
    }
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  // Handle objects (like JSON)
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  // Handle numbers with appropriate formatting
  if (typeof value === 'number') {
    if (columnName.includes('amount') || columnName.includes('budget') || 
        columnName.includes('value') || columnName.includes('funding')) {
      // Format currency values
      return new Intl.NumberFormat('pt-PT', { 
        style: 'currency', 
        currency: 'EUR',
        maximumFractionDigits: 0
      }).format(value);
    } else if (columnName.includes('rate') || columnName.includes('percentage') ||
               columnName.includes('ratio') || columnName.includes('index')) {
      // Format percentages or indices
      return Number(value).toLocaleString('pt-PT', { 
        maximumFractionDigits: 2 
      });
    }
    
    // Regular number formatting
    return Number(value).toLocaleString('pt-PT');
  }
  
  // Default: return as string
  return String(value);
};

// Generate AI response to user query
export const generateResponse = async (query: string): Promise<QueryResponseType> => {
  try {
    console.log("Generating response for query:", query);
    
    // Call the edge function to process the query
    const { data, error } = await supabase.functions.invoke('gemini-chat', {
      body: { query }
    });
    
    if (error) {
      console.error("Error calling gemini-chat function:", error);
      
      return {
        message: "Ocorreu um erro ao processar sua consulta. Por favor, tente novamente em alguns instantes.",
        sqlQuery: "",
        results: null,
        error: true
      };
    }
    
    console.log("Response from edge function:", data);
    
    return {
      message: data.message || "Sem resposta do assistente.",
      sqlQuery: data.sqlQuery || "",
      results: data.results || null,
      error: data.error || false,
      noResults: data.noResults || false,
      queryId: data.queryId,
      analysis: data.analysis,
      isAIResponse: data.isAIResponse || false
    };
  } catch (error) {
    console.error("Error in generateResponse:", error);
    return {
      message: `Erro ao processar sua consulta: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      sqlQuery: "",
      results: null,
      error: true
    };
  }
};

// Document classification function
export const classifyDocument = async (document: { title: string, summary: string, fileName: string }): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('classify-document', {
      body: { 
        title: document.title,
        summary: document.summary,
        fileName: document.fileName
      }
    });
    
    if (error) {
      console.error("Error calling classify-document function:", error);
      return "unclassified";
    }
    
    return data?.classification || "unclassified";
  } catch (error) {
    console.error("Error in classifyDocument:", error);
    return "unclassified";
  }
};
