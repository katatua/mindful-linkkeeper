
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

// Search uploaded documents and generate an AI response
export const generateResponse = async (userInput: string): Promise<string> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration is missing');
      return getFallbackResponse(userInput);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Search for relevant documents in the database
    const { data: searchResults, error } = await supabase
      .rpc('search_links_improved', { 
        search_query: userInput,
        similarity_threshold: 0.2
      });
    
    if (error || !searchResults || searchResults.length === 0) {
      console.log('No search results found, using fallback response');
      return getFallbackResponse(userInput);
    }
    
    // Get the top 3 most relevant documents
    const topLinks = searchResults.slice(0, 3);
    
    // Fetch the full information for these documents
    const { data: documents, error: docsError } = await supabase
      .from('links')
      .select('title, url, summary, category, classification')
      .in('id', topLinks.map(result => result.id));
    
    if (docsError || !documents || documents.length === 0) {
      console.log('Error fetching documents, using fallback response');
      return getFallbackResponse(userInput);
    }
    
    // Generate a response based on the found documents
    const responseText = composeResponseFromDocuments(userInput, documents);
    return responseText;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return getFallbackResponse(userInput);
  }
};

// Compose a response based on the found documents
const composeResponseFromDocuments = (query: string, documents: any[]): string => {
  // Extract relevant information from documents
  const topics = documents.map(doc => doc.title).join(', ');
  const classifications = [...new Set(documents.map(doc => doc.classification).filter(Boolean))];
  const categories = [...new Set(documents.map(doc => doc.category).filter(Boolean))];
  
  // Create a response that references the found documents
  let response = `Based on the information in our innovation database, I found ${documents.length} relevant resources about ${topics}.`;
  
  // Add classification if available
  if (classifications.length > 0) {
    response += ` These relate to the ${classifications.join(' and ')} innovation areas.`;
  }
  
  // Add categories if available
  if (categories.length > 0) {
    response += ` They fall under the ${categories.join(' and ')} categories.`;
  }
  
  // Add specific information from the first document
  if (documents[0].summary) {
    response += `\n\nHere's a key insight: ${documents[0].summary}`;
  }
  
  // Add a reference to the found documents
  response += `\n\nWould you like more specific information about any of these resources?`;
  
  return response;
};

// Fallback to predefined responses when no relevant documents are found
const getFallbackResponse = (userInput: string): string => {
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
  return "I understand you're asking about " + input + ". While I don't have specific information on that topic yet in our database, I can connect you with an ANI expert who can help. Would you like me to do that?";
};
