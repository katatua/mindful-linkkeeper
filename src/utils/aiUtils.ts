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

// Helper function to identify if a query lacks sufficient context or is not in supported language
function isInvalidOrUnrecognizedQuery(query: string): boolean {
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
}

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
        was_successful: false, // Will update this after we get results
        language: isPortuguese ? 'pt' : 'en',
        error_message: "Pending execution"
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
    
    // Call the gemini-chat function with the prompt and additional context
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          prompt, 
          chatHistory: [],
          additionalContext: {
            energyKeywords: energyKeywords,
            isPortuguese: isPortuguese
          }
        }
      });

      if (error) {
        console.error('Error invoking Gemini Chat function:', error);
        
        // Update query status to failed
        if (queryId) {
          try {
            await supabase.from('query_history').update({
              was_successful: false,
              error_message: "Error invoking AI function: " + error.message
            }).eq('id', queryId);
          } catch (updateError) {
            console.error('Error updating query status:', updateError);
          }
        }
        
        const noResultsResponse = createNoResultsResponse(prompt, isInvalidOrUnrecognizedQuery(prompt));
        return {
          ...noResultsResponse,
          queryId: queryId || undefined
        };
      }

      // If there are no results, get analysis and recommendations
      let analysis = null;
      if (!data.results || data.results.length === 0) {
        try {
          // Call analyze-query to get recommendations
          const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-query', {
            body: { 
              query: data.sqlQuery || prompt,
              language: isPortuguese ? 'pt' : 'en'
            }
          });
          
          if (!analysisError && analysisData) {
            analysis = analysisData;
            
            // Save analysis to query_history
            if (queryId) {
              await supabase.from('query_history').update({
                analysis_result: analysis
              }).eq('id', queryId);
            }
          }
        } catch (analysisError) {
          console.error('Error analyzing query:', analysisError);
        }
      }

      // Update query status based on results
      if (queryId) {
        try {
          await supabase.from('query_history').update({
            was_successful: data.results && data.results.length > 0,
            error_message: data.results && data.results.length > 0 ? null : "No results found"
          }).eq('id', queryId);
        } catch (updateError) {
          console.error('Error updating query status:', updateError);
        }
      }
      
      if (!data.results || data.results.length === 0) {
        const noResultsResponse = createNoResultsResponse(prompt, isInvalidOrUnrecognizedQuery(prompt));
        return {
          ...noResultsResponse,
          queryId: queryId || undefined,
          analysis: analysis,
          sqlQuery: data.sqlQuery || '' // Include the SQL query even if no results
        };
      }
      
      return {
        message: data.response || 'Sorry, I could not process your query.',
        sqlQuery: data.sqlQuery || '',
        results: data.results || null,
        noResults: false,
        queryId: queryId || undefined,
        analysis: analysis
      };
    } catch (geminiError) {
      console.error('Error with Gemini API:', geminiError);
      
      // Update query status to failed
      if (queryId) {
        try {
          await supabase.from('query_history').update({
            was_successful: false,
            error_message: "Gemini API error: " + (geminiError instanceof Error ? geminiError.message : String(geminiError))
          }).eq('id', queryId);
        } catch (updateError) {
          console.error('Error updating query status:', updateError);
        }
      }
      
      const noResultsResponse = createNoResultsResponse(prompt, isInvalidOrUnrecognizedQuery(prompt));
      return {
        ...noResultsResponse,
        queryId: queryId || undefined
      };
    }
  } catch (error) {
    console.error('Error generating response:', error);
    const noResultsResponse = createNoResultsResponse(prompt, true);
    return noResultsResponse;
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
