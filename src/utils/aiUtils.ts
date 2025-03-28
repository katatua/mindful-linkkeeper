import { supabase } from "@/integrations/supabase/client";

// Update the suggested questions to better match our database schema and sample data
export const suggestedDatabaseQuestions = [
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
  "Which researchers have the highest h-index in biotech?",
  "Compare the funding success rates between technology and renewable energy sectors",
  "What institutions have the most international collaborations?",
  "What is the trend of R&D investment in Portugal over the last 3 years?",
  "Which funding programs have the highest success rates?",
  "What are the key objectives of renewable energy policy frameworks?",
  "List all renewable energy projects with funding over 1 million euros",
  "Show me innovation metrics related to clean energy technologies",
  "Which international collaborations focus on sustainable energy development?",
  "What is the total budget allocated to renewable energy programs?"
];

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
    'income'
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
    'patents'
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
  if (query.trim().length < 10) return true;
  
  const databaseQueryWords = [
    'show', 'select', 'list', 'find', 'what', 'which', 'how', 'where', 'who',
    'mostrar', 'selecionar', 'listar', 'encontrar', 'qual', 'quais', 'como', 'onde', 'quem'
  ];
  
  const databaseEntities = [
    'project', 'funding', 'program', 'metric', 'policy', 'collaboration', 
    'projeto', 'financiamento', 'programa', 'métrica', 'política', 'colaboração',
    'research', 'innovation', 'tecnology', 'renewable', 'energy',
    'pesquisa', 'inovação', 'tecnologia', 'renovável', 'energia'
  ];
  
  const hasQueryWord = databaseQueryWords.some(word => 
    query.toLowerCase().includes(word.toLowerCase())
  );
  
  const hasEntity = databaseEntities.some(entity => 
    query.toLowerCase().includes(entity.toLowerCase())
  );
  
  return !(hasQueryWord && hasEntity);
}

// Define the response type for consistency
export interface AIQueryResponse {
  message: string;
  sqlQuery: string;
  results: any[] | null;
  noResults: boolean;
  queryId?: string;  // Make queryId optional
  analysis?: any;    // Add analysis field
}

// Helper function to create a consistent "no results" response
function createNoResultsResponse(prompt: string, isInvalid: boolean): AIQueryResponse {
  let message = '';
  
  if (isInvalid) {
    message = `No results found for your query: "${prompt}". The query format is not recognized or the requested information doesn't match our database schema.`;
  } else {
    message = `No results found for your query: "${prompt}". The requested data is not currently in our database, but you can populate it using the button below.`;
  }
  
  return {
    message: message,
    sqlQuery: '',
    results: null,
    noResults: true,
    queryId: undefined  // Explicitly set to undefined for consistency
  };
}

// Add function to extract energy-related keywords from a query
const extractEnergyKeywords = (query: string): string[] => {
  const lowercaseQuery = query.toLowerCase();
  
  const energyTerms = [
    'renewable energy', 'clean energy', 'green energy', 
    'sustainable energy', 'alternative energy',
    'solar', 'wind', 'hydro', 'biomass', 'geothermal',
    'photovoltaic', 'renewable', 'clean power', 'green power'
  ];
  
  return energyTerms.filter(term => lowercaseQuery.includes(term));
};

// Add function to handle database queries and AI responses
export const generateResponse = async (prompt: string): Promise<AIQueryResponse> => {
  try {
    const energyKeywords = extractEnergyKeywords(prompt);
    
    // Store the query in the database first to get a queryId
    let queryId = '';
    try {
      const userResponse = await supabase.auth.getUser();
      const userId = userResponse.data?.user?.id;
      
      const { data: queryData, error: queryError } = await supabase.from('query_history').insert({
        query_text: prompt,
        user_id: userId || null,
        was_successful: false, // Will update this after we get results
        language: 'en',
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
    
    // If the query is about renewable energy, directly call the get-funding-programs endpoint
    if (energyKeywords.length > 0) {
      console.log('Energy-related query detected with keywords:', energyKeywords);
      
      try {
        // Call the get-funding-programs function directly
        const { data: programsData, error: programsError } = await supabase.functions.invoke('get-funding-programs', {
          body: { sector: 'renewable energy' }
        });
        
        if (programsError) {
          console.error('Error fetching funding programs:', programsError);
          throw programsError;
        }
        
        if (!programsData || programsData.length === 0) {
          return {
            message: 'No renewable energy funding programs found.',
            sqlQuery: 'SELECT * FROM ani_funding_programs WHERE sector_focus ILIKE \'%renewable energy%\'',
            results: null,
            noResults: true,
            queryId: queryId || undefined
          };
        }
        
        // Update query status
        if (queryId) {
          await supabase.from('query_history').update({
            was_successful: true,
            error_message: null
          }).eq('id', queryId);
        }
        
        return {
          message: 'Here are the funding programs related to renewable energy:',
          sqlQuery: 'SELECT * FROM ani_funding_programs WHERE sector_focus ILIKE \'%renewable energy%\'',
          results: programsData,
          noResults: false,
          queryId: queryId || undefined
        };
      } catch (error) {
        console.error('Error handling energy-related query:', error);
      }
    }
    
    // Continue with the regular Gemini flow for non-energy queries
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          prompt, 
          chatHistory: [],
          additionalContext: {
            energyKeywords: energyKeywords
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
            body: { query: data.sqlQuery || prompt }
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
          analysis: analysis
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

// Update interface for document classification
export interface DocumentToClassify {
  title: string;
  summary?: string;
  fileName?: string;
}

// Add function to classify documents
export const classifyDocument = async (document: DocumentToClassify): Promise<string> => {
  try {
    const { title, summary = '', fileName = '' } = document;
    
    const { data, error } = await supabase.functions.invoke('classify-document', {
      body: { title, summary, fileName }
    });
    
    if (error) {
      console.error('Error classifying document:', error);
      return 'Unclassified';
    }
    
    return data?.classification || 'Unclassified';
  } catch (error) {
    console.error('Error in document classification:', error);
    return 'Unclassified';
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
