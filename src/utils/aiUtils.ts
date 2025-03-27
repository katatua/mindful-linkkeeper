
import { supabase } from '@/integrations/supabase/client';

// Function to get the current AI model from database settings
export const getCurrentAIModel = async () => {
  try {
    const { data, error } = await supabase.rpc('get_database_setting', { setting_key: 'ai_model' });
    
    if (error) {
      console.error('Error fetching AI model:', error);
      return 'Unknown';
    }
    
    return data || 'Not set';
  } catch (err) {
    console.error('Unexpected error fetching AI model:', err);
    return 'Error retrieving model';
  }
};

// Generate a unique ID for messages
export const genId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Generate an AI response using the Supabase edge function
export const generateResponse = async (prompt: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-chat', {
      body: { prompt }
    });
    
    if (error) throw error;
    
    return data?.response || "Sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate response');
  }
};

// Classify a document using the Supabase edge function
export const classifyDocument = async (documentInfo: {
  title: string;
  summary: string;
  fileName: string;
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('classify-document', {
      body: documentInfo
    });
    
    if (error) throw error;
    
    return data?.classification || 'uncategorized';
  } catch (error) {
    console.error('Error classifying document:', error);
    return 'uncategorized';
  }
};

// Suggested questions for the database explorer
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
