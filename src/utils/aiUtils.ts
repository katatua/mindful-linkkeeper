
import { supabase } from '@/integrations/supabase/client';

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
  "Show me the distribution of innovation metrics across different regions"
];

// Add function to get the current AI model
export const getCurrentAIModel = async () => {
  try {
    const { data, error } = await supabase.rpc('get_database_setting', {
      setting_key: 'ai_model'
    });
    
    if (error) throw error;
    return data || 'gemini-1.0-pro';
  } catch (error) {
    console.error('Error fetching AI model:', error);
    return 'gemini-1.0-pro';
  }
};

// Add function to generate a unique ID
export const genId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Add function to handle database queries and AI responses
export const generateResponse = async (prompt: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-chat', {
      body: { prompt, chatHistory: [] }
    });

    if (error) {
      console.error('Error invoking Gemini Chat function:', error);
      throw new Error(`Failed to generate response: ${error.message}`);
    }

    // Extract SQL and results from the response if available
    let sqlQuery = '';
    let queryResults = null;
    
    if (data && data.response) {
      const sqlMatch = data.response.match(/<SQL>([\s\S]*?)<\/SQL>/);
      const resultsMatch = data.response.match(/<RESULTS>([\s\S]*?)<\/RESULTS>/);
      
      if (sqlMatch && sqlMatch[1]) {
        sqlQuery = sqlMatch[1].trim();
      }
      
      if (resultsMatch && resultsMatch[1]) {
        try {
          queryResults = JSON.parse(resultsMatch[1]);
        } catch (e) {
          console.error('Failed to parse results JSON:', e);
          queryResults = [];
        }
      }
      
      // Clean up the response by removing the SQL and RESULTS tags
      let cleanResponse = data.response
        .replace(/<SQL>[\s\S]*?<\/SQL>/g, '')
        .replace(/<RESULTS>[\s\S]*?<\/RESULTS>/g, '')
        .trim();
        
      return cleanResponse;
    }
    
    return data.response || 'Sorry, I could not process your query.';
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
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
