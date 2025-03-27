
import { supabase } from '@/integrations/supabase/client';

// Add the missing export for suggestedDatabaseQuestions
export const suggestedDatabaseQuestions = [
  "What funding programs are available for renewable energy research?",
  "Show me the projects with highest funding amounts in the technology sector",
  "What are the latest innovation metrics for Lisbon region?",
  "Which international collaborations involve AI research?",
  "What is the average funding amount for biotech projects?",
  "List all policy frameworks related to digital transformation",
  "Which research institutions have the most projects in healthcare?",
  "What was the funding success rate for startups last year?",
  "How many international collaborations are there with Germany?",
  "What metrics show the biggest improvement over the last 5 years?",
  "Which sectors receive the most funding in the North region?",
  "What's the timeline for implementing the National Innovation Strategy?",
  "Are there any funding programs specifically for SMEs?",
  "Who are the top patent holders in the pharmaceutical sector?",
  "What is the distribution of projects across different regions?"
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

// Update classifyDocument to accept an object with document properties
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
