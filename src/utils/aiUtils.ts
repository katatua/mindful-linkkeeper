import { supabase } from "@/integrations/supabase/client";

// Updated suggested questions with a wider variety of complex query types
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

// Add function to get the current AI model with error handling
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

// Add function to get the current AI provider
export const getCurrentAIProvider = async () => {
  try {
    const { data, error } = await supabase.rpc('get_database_setting', {
      setting_key: 'ai_provider'
    });
    
    if (error) throw error;
    return data || 'gemini'; // Default to gemini if not set
  } catch (error) {
    console.error('Error fetching AI provider:', error);
    return 'gemini';
  }
};

// Add function to get provider-specific model
export const getProviderModel = async (provider) => {
  try {
    const settingKey = provider === 'gemini' ? 'gemini_model' : 'openai_model';
    const { data, error } = await supabase.rpc('get_database_setting', {
      setting_key: settingKey
    });
    
    if (error) throw error;
    
    // Default models per provider
    const defaultModel = provider === 'gemini' 
      ? 'gemini-2.5-pro-exp-03-25' 
      : 'gpt-4o-2024-11-20';
      
    return data || defaultModel;
  } catch (error) {
    console.error(`Error fetching ${provider} model:`, error);
    return provider === 'gemini' ? 'gemini-2.5-pro-exp-03-25' : 'gpt-4o-2024-11-20';
  }
};

// Add function to set the AI provider
export const setAIProvider = async (provider: 'gemini' | 'openai') => {
  try {
    // First, get the provider-specific model that was previously selected
    const providerModel = await getProviderModel(provider);
    console.log(`Setting provider to ${provider} with model ${providerModel}`);
    
    const promises = [
      // Update the provider setting
      supabase.from('ani_database_settings').upsert({ 
        setting_key: 'ai_provider', 
        setting_value: provider,
        updated_at: new Date().toISOString()
      }),
      
      // Also update the current model to the provider-specific model
      supabase.from('ani_database_settings').upsert({ 
        setting_key: 'ai_model', 
        setting_value: providerModel,
        updated_at: new Date().toISOString()
      })
    ];
    
    const results = await Promise.all(promises);
    const hasError = results.some(result => result.error);
    
    if (hasError) {
      console.error('Errors in updating provider settings:', results.map(r => r.error));
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error setting AI provider:', error);
    return false;
  }
};

// Add function to set the AI model
export const setAIModel = async (model: string) => {
  try {
    // First get the current provider to know which model setting to update
    const provider = await getCurrentAIProvider();
    console.log(`Setting model to ${model} for provider ${provider}`);
    
    // Update both the current model and the provider-specific model
    const promises = [
      // Update the main ai_model setting
      supabase.from('ani_database_settings').upsert({ 
        setting_key: 'ai_model', 
        setting_value: model,
        updated_at: new Date().toISOString()
      }),
      
      // Also update the provider-specific model setting for persistence
      supabase.from('ani_database_settings').upsert({ 
        setting_key: provider === 'gemini' ? 'gemini_model' : 'openai_model', 
        setting_value: model,
        updated_at: new Date().toISOString()
      })
    ];
    
    const results = await Promise.all(promises);
    const hasError = results.some(result => result.error);
    
    if (hasError) {
      console.error('Errors in updating model settings:', results.map(r => r.error));
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error setting AI model:', error);
    return false;
  }
};

// Add function to generate a unique ID
export const genId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Helper function for delay in retry mechanism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced query handling with better context extraction, error management and retry mechanism
export const generateResponse = async (prompt: string, retryCount = 0, maxRetries = 2) => {
  try {
    // Extract keywords for energy-related queries to improve matching
    const energyKeywords = extractEnergyKeywords(prompt);
    
    // Add technology-related keywords extraction
    const techKeywords = extractTechnologyKeywords(prompt);
    
    // Add region-related keywords extraction for better city/region matching
    const regionKeywords = extractRegionKeywords(prompt);
    
    // Determine which AI provider to use
    const provider = await getCurrentAIProvider();
    
    // Call the appropriate edge function based on the provider
    const functionName = provider === 'openai' ? 'openai-chat' : 'gemini-chat';
    
    console.log(`Using AI provider: ${provider}`);
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: { 
        prompt, 
        chatHistory: [],
        // Pass additional context to help the query processing
        additionalContext: {
          energyKeywords: energyKeywords,
          techKeywords: techKeywords,
          regionKeywords: regionKeywords
        }
      }
    });

    if (error) {
      // Check if error contains rate limit or quota information (status 429)
      const isRateLimitError = error.message?.includes('429') || 
                              error.message?.includes('quota') ||
                              error.message?.includes('rate limit');
      
      if (isRateLimitError && retryCount < maxRetries) {
        // Calculate exponential backoff time
        const backoffTime = Math.pow(2, retryCount) * 1000;
        console.log(`Rate limit detected, retrying in ${backoffTime}ms (attempt ${retryCount + 1}/${maxRetries})`);
        
        // Wait for the backoff time
        await delay(backoffTime);
        
        // Retry the request
        return generateResponse(prompt, retryCount + 1, maxRetries);
      }
      
      if (isRateLimitError) {
        console.error('AI API quota exceeded:', error);
        throw new Error('The AI query service is currently experiencing high demand. Please try again in a few minutes.');
      } else {
        console.error(`Error invoking ${functionName} function:`, error);
        throw new Error(`Failed to generate response: ${error.message}`);
      }
    }

    // Fallback handling if data structure is unexpected
    if (!data || (!data.response && !data.error)) {
      throw new Error('Received invalid response format from AI service');
    }
    
    // If there's an error message in the response, throw it
    if (data.error) {
      throw new Error(data.error);
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
    
    return {
      message: data.response || 'Sorry, I could not process your query.',
      sqlQuery: data.sqlQuery || '',
      results: data.results || null
    };
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
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

// New helper function to extract technology-related keywords from a query
const extractTechnologyKeywords = (query: string): string[] => {
  const lowercaseQuery = query.toLowerCase();
  
  // Define sets of related terms to improve matching
  const techTerms = [
    'technology', 'tech', 'digital', 'software', 'hardware', 
    'ai', 'artificial intelligence', 'machine learning', 'ml',
    'data science', 'cloud', 'iot', 'internet of things',
    'blockchain', 'cyber', 'cybersecurity', 'robotics',
    'automation', 'computing', 'fintech', 'information technology',
    'it', 'telecommunications', 'telecom'
  ];
  
  // Return all matching terms found in the query
  return techTerms.filter(term => lowercaseQuery.includes(term));
};

// New helper function to extract region-related keywords and their variations from a query
const extractRegionKeywords = (query: string): { original: string, variations: string[] }[] => {
  const lowercaseQuery = query.toLowerCase();
  
  // Define region names and their variations (English/Portuguese spellings)
  const regionMappings = [
    { original: 'lisbon', variations: ['lisbon', 'lisboa'] },
    { original: 'porto', variations: ['porto', 'oporto'] },
    { original: 'north', variations: ['north', 'norte'] },
    { original: 'south', variations: ['south', 'sul'] },
    { original: 'algarve', variations: ['algarve'] },
    { original: 'azores', variations: ['azores', 'açores'] },
    { original: 'madeira', variations: ['madeira'] },
    { original: 'center', variations: ['center', 'centro', 'central'] },
    { original: 'alentejo', variations: ['alentejo'] },
    { original: 'braga', variations: ['braga'] },
    { original: 'coimbra', variations: ['coimbra'] },
    { original: 'evora', variations: ['evora', 'évora'] }
  ];
  
  // Find all region terms that match the query
  return regionMappings.filter(region => 
    region.variations.some(variation => lowercaseQuery.includes(variation))
  );
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

// Fallback response generator when API is rate limited
export const generateFallbackResponse = async (prompt: string) => {
  // This function provides pre-computed responses for common queries when the AI is rate-limited
  const lowercasePrompt = prompt.toLowerCase();
  
  // Check for pre-computed fallback answers for common queries
  if (lowercasePrompt.includes('renewable energy') && 
      (lowercasePrompt.includes('programs') || lowercasePrompt.includes('funding'))) {
    
    try {
      // Get data directly from database instead of using AI
      const { data, error } = await supabase
        .from('ani_funding_programs')
        .select('name, description, total_budget, application_deadline, funding_type')
        .filter('sector_focus', 'cs', '{renewable energy, solar, wind, hydro, biomass, geothermal}')
        .limit(5);
      
      if (!error && data && data.length > 0) {
        return {
          message: "Here are some renewable energy funding programs. This is a fallback response while the AI service is busy.",
          sqlQuery: "SELECT name, description, total_budget, application_deadline, funding_type FROM ani_funding_programs WHERE sector_focus @> '{renewable energy}' OR sector_focus @> '{solar}' OR sector_focus @> '{wind}'",
          results: data
        };
      }
    } catch (e) {
      console.error('Error in fallback response generator:', e);
    }
  }
  
  // Default fallback response
  return {
    message: "The AI query service is currently experiencing high demand. Please try again in a few minutes.",
    sqlQuery: "",
    results: null
  };
};
