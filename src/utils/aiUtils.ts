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
  
  // If it's already a number, just return it
  if (typeof value === 'number') {
    // Only format monetary columns as currency
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
  
  // Try to handle string values that might contain numbers
  if (typeof value === 'string') {
    // Clean the string from currency symbols and spaces
    const cleanValue = value.trim().replace(/[€$£\s]/g, '');
    
    // Check if it's a valid number after cleaning
    if (!isNaN(Number(cleanValue)) && cleanValue !== '') {
      const numValue = Number(cleanValue);
      
      // If column suggests monetary value, format it as currency
      if (columnName && isMonetaryColumn(columnName)) {
        return new Intl.NumberFormat('pt-PT', { 
          style: 'currency', 
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(numValue);
      }
      
      // Otherwise, return the clean number
      return numValue.toLocaleString('pt-PT');
    }
  }
  
  // If all else fails, return the original value as string
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
  
  // First check if it's explicitly a non-monetary column despite containing monetary terms
  for (const term of nonMonetaryTerms) {
    if (colName.includes(term)) {
      return false;
    }
  }
  
  // Then check if it's a monetary column
  for (const term of monetaryTerms) {
    if (colName.includes(term)) {
      return true;
    }
  }
  
  return false;
};

// Add improved function to directly execute SQL query when AI service is unavailable
const executeFallbackQuery = async (query: string) => {
  try {
    console.log("Executing fallback SQL query for:", query);
    
    // Check if the query is likely meaningless or in a non-supported language
    if (isLikelyNonsenseQuery(query)) {
      return {
        message: `No results found for this query: "${query}". The requested information doesn't appear to be in the database or the query format is not recognized.`,
        sqlQuery: "",
        results: null,
        noResults: true
      };
    }
    
    // Determine which table to query based on keywords
    let sqlQuery = "";
    let resultsMessage = "Here are the results based on your query:";
    
    if (query.toLowerCase().includes("innovation metrics") && query.toLowerCase().includes("lisbon")) {
      sqlQuery = `
        SELECT name, category, value, unit, measurement_date, region 
        FROM ani_metrics 
        WHERE LOWER(region) LIKE '%lisbon%' 
        AND measurement_date >= '2024-01-01'
        ORDER BY name ASC
        LIMIT 10
      `;
      resultsMessage = "Innovation metrics for Lisbon region from 2024:";
    } 
    else if (query.toLowerCase().includes("renewable energy") && query.toLowerCase().includes("sector focus")) {
      sqlQuery = `
        SELECT name, description, total_budget, application_deadline, funding_type
        FROM ani_funding_programs
        WHERE ARRAY_TO_STRING(sector_focus, ',') ILIKE '%renewable%' 
           OR ARRAY_TO_STRING(sector_focus, ',') ILIKE '%energy%'
        LIMIT 10
      `;
      resultsMessage = "Funding programs that include renewable energy in their sector focus:";
    }
    else if (query.toLowerCase().includes("projects") && query.toLowerCase().includes("funding") && query.toLowerCase().includes("technology")) {
      sqlQuery = `
        SELECT title, funding_amount, start_date, end_date, status
        FROM ani_projects
        WHERE sector ILIKE '%technology%' OR sector ILIKE '%tech%'
        ORDER BY funding_amount DESC
        LIMIT 5
      `;
      resultsMessage = "Top 5 projects with highest funding in the technology sector:";
    }
    else if (query.toLowerCase().includes("policy frameworks") && query.toLowerCase().includes("active")) {
      sqlQuery = `
        SELECT title, implementation_date, status
        FROM ani_policy_frameworks
        WHERE status ILIKE '%active%'
        LIMIT 10
      `;
      resultsMessage = "Policy frameworks with 'active' status:";
    }
    else if (query.toLowerCase().includes("international collaborations") && query.toLowerCase().includes("ai")) {
      sqlQuery = `
        SELECT program_name, country, partnership_type, total_budget
        FROM ani_international_collaborations
        WHERE ARRAY_TO_STRING(focus_areas, ',') ILIKE '%ai%' 
           OR ARRAY_TO_STRING(focus_areas, ',') ILIKE '%artificial intelligence%'
        LIMIT 10
      `;
      resultsMessage = "International collaborations focusing on AI research:";
    }
    else {
      // For unrecognized queries or nonsense queries, return a clear "no results" response
      return {
        message: `No results found for this query: "${query}". The requested data might not be in the database.`,
        sqlQuery: "",
        results: null,
        noResults: true
      };
    }
    
    // Execute the query
    const { data: queryResult, error: queryError } = await supabase.rpc('execute_sql_query', {
      sql_query: sqlQuery.trim()
    });
    
    if (queryError) throw queryError;
    
    // If we executed a query but got no results, return a no results message
    if (!queryResult || queryResult.length === 0) {
      return {
        message: `No results found for this query: "${query}". The requested data might not be in the database.`,
        sqlQuery: sqlQuery,
        results: null,
        noResults: true
      };
    }
    
    return {
      message: resultsMessage,
      sqlQuery: sqlQuery,
      results: queryResult || []
    };
  } catch (error) {
    console.error('Error executing fallback query:', error);
    return {
      message: "Unable to process your query. Please try a simpler query or try again later.",
      sqlQuery: "",
      results: null,
      noResults: true
    };
  }
};

// Helper function to identify likely nonsense or unsupported language queries
function isLikelyNonsenseQuery(query: string): boolean {
  // Check if query is too short (less than 10 characters)
  if (query.trim().length < 10) return true;
  
  // Check for common Portuguese/English database question words
  const databaseQueryWords = [
    'show', 'select', 'list', 'find', 'what', 'which', 'how', 'where', 'who',
    'mostrar', 'selecionar', 'listar', 'encontrar', 'qual', 'quais', 'como', 'onde', 'quem'
  ];
  
  // Check for common database entities in our system
  const databaseEntities = [
    'project', 'funding', 'program', 'metric', 'policy', 'collaboration', 
    'projeto', 'financiamento', 'programa', 'métrica', 'política', 'colaboração',
    'research', 'innovation', 'tecnology', 'renewable', 'energy',
    'pesquisa', 'inovação', 'tecnologia', 'renovável', 'energia'
  ];
  
  // Check if query contains at least one query word AND one entity
  const hasQueryWord = databaseQueryWords.some(word => 
    query.toLowerCase().includes(word.toLowerCase())
  );
  
  const hasEntity = databaseEntities.some(entity => 
    query.toLowerCase().includes(entity.toLowerCase())
  );
  
  // If query doesn't have both a query word and an entity, it might be nonsense
  return !(hasQueryWord && hasEntity);
}

// Add function to handle database queries and AI responses
export const generateResponse = async (prompt: string) => {
  try {
    // Extract keywords for energy-related queries to improve matching
    const energyKeywords = extractEnergyKeywords(prompt);
    
    // Try to use the Gemini API first
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          prompt, 
          chatHistory: [],
          // Pass additional context to help the query processing
          additionalContext: {
            energyKeywords: energyKeywords
          }
        }
      });

      if (error) {
        console.error('Error invoking Gemini Chat function:', error);
        // Instead of throwing, we'll fall back to direct SQL execution
        console.log('Falling back to direct SQL execution');
        return await executeFallbackQuery(prompt);
      }

      // Store query history in the database
      try {
        const userResponse = await supabase.auth.getUser();
        const userId = userResponse.data?.user?.id;
        
        const { error: historyError } = await supabase.from('query_history').insert({
          query_text: prompt,
          user_id: userId || null,
          was_successful: true,
          language: 'en',
          error_message: null,
          created_tables: null
        });

        if (historyError) {
          console.error('Error storing query history:', historyError);
        }
      } catch (historyStoreError) {
        console.error('Error storing query history:', historyStoreError);
      }
      
      // If no results, return a clear message indicating no data found
      if (!data.results || data.results.length === 0) {
        return {
          message: `No results found for this query: "${prompt}". The requested data might not be in the database.`,
          sqlQuery: data.sqlQuery || '',
          results: null,
          noResults: true
        };
      }
      
      return {
        message: data.response || 'Sorry, I could not process your query.',
        sqlQuery: data.sqlQuery || '',
        results: data.results || null
      };
    } catch (geminiError) {
      console.error('Error with Gemini API, falling back to direct SQL execution:', geminiError);
      return await executeFallbackQuery(prompt);
    }
  } catch (error) {
    console.error('Error generating response:', error);
    // As last resort, return a friendly error
    return {
      message: `I apologize, but I'm having trouble processing your query. Try asking one of the suggested questions instead.`,
      sqlQuery: '',
      results: null
    };
  }
};

// Helper function to extract energy-related keywords from a query
const extractEnergyKeywords = (query: string): string[] => {
  const lowercaseQuery = query.toLowerCase();
  
  // Define sets of related terms to improve matching
  const energyTerms = [
    'renewable energy', 'clean energy', 'green energy', 
    'sustainable energy', 'alternative energy',
    'solar', 'wind', 'hydro', 'biomass', 'geothermal',
    'photovoltaic', 'renewable', 'clean power', 'green power'
  ];
  
  // Return all matching terms found in the query
  return energyTerms.filter(term => lowercaseQuery.includes(term));
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
    // Extract values from the document object
    const { title, summary = '', fileName = '' } = document;
    
    // Call the classify-document edge function
    const { data, error } = await supabase.functions.invoke('classify-document', {
      body: { title, summary, fileName }
    });
    
    if (error) {
      console.error('Error classifying document:', error);
      return 'Unclassified';
    }
    
    // Return the classification or a default value
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
