
/**
 * Query execution utilities
 * Responsible for executing SQL queries and formatting results
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Executes a SQL query and returns formatted results
 */
export const executeQuery = async (
  sqlQuery: string
): Promise<{ response: string; visualizationData?: any[] }> => {
  try {
    console.log("Executing query:", sqlQuery);
    
    const { data, error } = await supabase.functions.invoke('gemini-chat', {
      body: { 
        userMessage: `Execute esta consulta SQL: ${sqlQuery}`,
        chatHistory: [] 
      }
    });
    
    if (error) {
      console.error("Error executing SQL:", error);
      throw new Error("Failed to execute SQL query");
    }
    
    const visualizationRegex = /<data-visualization>([\s\S]*?)<\/data-visualization>/;
    let visualizationData;
    let cleanResponse = data.response;
    
    const vizMatch = data.response.match(visualizationRegex);
    
    if (vizMatch && vizMatch[1]) {
      try {
        visualizationData = JSON.parse(vizMatch[1]);
        cleanResponse = data.response.replace(visualizationRegex, '');
      } catch (e) {
        console.error("Error parsing visualization data:", e);
      }
    }
    
    return { 
      response: cleanResponse,
      visualizationData: visualizationData
    };
  } catch (error) {
    console.error("Error in query execution:", error);
    return { 
      response: "I'm sorry, I couldn't retrieve the data due to a technical issue."
    };
  }
};
