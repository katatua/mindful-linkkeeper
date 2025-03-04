
import { createClient } from '@supabase/supabase-js';

// Types for AI operations
export interface ClassificationResponse {
  classification: string;
}

export interface ClassificationRequest {
  title: string;
  summary?: string;
  fileName?: string;
}

export interface AIResponse {
  response: string;
  timestamp: Date;
}

// Function to classify documents via Supabase Edge Function
export const classifyDocument = async (data: ClassificationRequest): Promise<string> => {
  try {
    // Create a Supabase client - using public URLs and keys which is fine for edge functions
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration is missing');
      return 'unknown';
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Call the edge function
    const { data: responseData, error } = await supabase.functions.invoke<ClassificationResponse>(
      'classify-document',
      {
        body: data,
      }
    );
    
    if (error) {
      console.error('Error classifying document:', error);
      return 'unknown';
    }
    
    return responseData?.classification || 'unknown';
  } catch (error) {
    console.error('Unexpected error in document classification:', error);
    return 'unknown';
  }
};

// Helper to generate AI responses based on keywords or innovation topics
export const generateResponse = (userInput: string): string => {
  const input = userInput.toLowerCase();
  
  // Simple keyword matching for demo purposes
  const responses: Record<string, string> = {
    "innovation": "Portugal's innovation ecosystem has shown significant growth in the past 5 years, with a 28% increase in R&D investment and 134 active innovation projects currently monitored by ANI.",
    "funding": "ANI manages several funding programs including Portugal 2030 and Horizon Europe opportunities. The total available funding for the current cycle is €24.7M with 56 startups being supported.",
    "report": "I can help generate reports on innovation metrics, funding allocation, or project performance. What specific type of report would you like to create?",
    "policy": "Current innovation policies are aligned with the ENEI 2030 framework, focusing on digital transformation, sustainability, and knowledge transfer between academia and industry.",
    "help": "I can assist with innovation metrics, funding information, policy insights, report generation, and connecting you with relevant stakeholders. What specific area do you need help with?",
    "projects": "There are currently 134 active innovation projects across various sectors, with technology and healthcare leading in both number and funding allocation.",
    "analytics": "Our analytics tools can provide insights on funding allocation, project performance, regional distribution, and sectoral trends. What specific analytics are you interested in?",
    "sectors": "The leading innovation sectors are: Digital Technologies (32%), Health & Biotech (24%), Sustainable Energy (18%), Advanced Manufacturing (14%), and Agri-food (12%).",
  };
  
  // Check for keyword matches
  for (const [keyword, response] of Object.entries(responses)) {
    if (input.includes(keyword)) {
      return response;
    }
  }
  
  // Default response if no keyword matches
  return "I understand you're asking about " + input + ". While I don't have specific information on that topic yet, I can connect you with an ANI expert who can help. Would you like me to do that?";
};
