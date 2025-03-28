
import { supabase } from "@/integrations/supabase/client";

// Function to provide fallback response when API is rate limited
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
  
  if (lowercasePrompt.includes('top') && 
      lowercasePrompt.includes('projects') && 
      lowercasePrompt.includes('technology')) {
    
    try {
      // Get top projects in technology sector
      const { data, error } = await supabase
        .from('ani_projects')
        .select('*')
        .eq('sector', 'technology')
        .order('funding_amount', { ascending: false })
        .limit(5);
      
      if (!error && data && data.length > 0) {
        return {
          message: "Here are the top 5 projects in the technology sector by funding amount. This is a fallback response.",
          sqlQuery: "SELECT * FROM ani_projects WHERE sector = 'technology' ORDER BY funding_amount DESC LIMIT 5",
          results: data
        };
      }
    } catch (e) {
      console.error('Error in fallback response generator:', e);
    }
  }
  
  // For API key errors, provide a specific message
  if (lowercasePrompt.includes('error') || lowercasePrompt.includes('not working')) {
    return {
      message: "It seems you're experiencing errors with the AI service. The most likely issue is with the API key configuration. Please check the following:\n\n1. If using OpenAI, make sure your API key starts with 'sk-' (not 'sk-proj-').\n2. Make sure you're using an API key from the correct service (OpenAI keys from platform.openai.com, Gemini keys from Google AI Studio).\n3. Check that your API key is active and has sufficient quota/credits.",
      sqlQuery: "",
      results: null
    };
  }
  
  // Default fallback response
  return {
    message: "I'm unable to process your query at the moment. This might be due to an API key configuration issue or a temporary service limitation. Please try switching to a different AI provider in the settings or try again later.",
    sqlQuery: "",
    results: null
  };
};
