
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
        
        // Additional processing for patent-related data to enhance visualization
        if (sqlQuery.toLowerCase().includes('patent') && visualizationData.length > 0) {
          // Check if this is a technology area query
          if (sqlQuery.toLowerCase().includes('sector') && 
              visualizationData[0].sector && 
              visualizationData[0].value) {
            
            // Transform data for better visualization
            visualizationData = visualizationData.map((item: any) => ({
              name: item.sector || 'Unknown',
              value: parseFloat(item.value),
              unit: item.unit || 'count',
              description: item.name || 'Patent count'
            }));
          }
          
          // Check if this is a growth rate query
          else if (sqlQuery.toLowerCase().includes('growth rate')) {
            visualizationData = visualizationData.map((item: any) => ({
              name: item.name.replace('Patent Growth Rate ', '') || item.measurement_date,
              value: parseFloat(item.value),
              unit: item.unit || '%',
              description: 'Growth rate'
            }));
          }
          
          // Check if this is international patents query
          else if (sqlQuery.toLowerCase().includes('international') && 
                   visualizationData[0].region) {
            
            visualizationData = visualizationData.map((item: any) => ({
              name: item.region || 'Unknown',
              value: parseFloat(item.value),
              unit: item.unit || 'count',
              description: item.name || 'Patent count'
            }));
          }
          
          // Check if this is patent holders query
          else if (sqlQuery.toLowerCase().includes('ani_patent_holders')) {
            visualizationData = visualizationData.map((item: any) => ({
              name: item.organization_name || 'Unknown',
              value: parseInt(item.patent_count),
              sector: item.sector || 'Unknown',
              innovationIndex: parseFloat(item.innovation_index) || 0,
              description: 'Patent holder'
            }));
          }
        }
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
