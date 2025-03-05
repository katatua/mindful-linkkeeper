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
        
        // NEW: Additional processing for funding program applications
        else if (sqlQuery.toLowerCase().includes('ani_funding_programs') && visualizationData.length > 0) {
          // Check if this is a program deadlines query
          if (sqlQuery.toLowerCase().includes('deadline') || 
              sqlQuery.toLowerCase().includes('application_deadline')) {
            
            // Transform data for timeline visualization
            visualizationData = visualizationData.map((item: any) => ({
              name: item.name || 'Unknown Program',
              value: item.total_budget ? parseFloat(item.total_budget) : 0,
              date: item.application_deadline || item.next_call_date || 'No date',
              unit: '€',
              description: item.description || 'Funding program',
              status: new Date(item.application_deadline) > new Date() ? 'upcoming' : 'past',
              sectors: Array.isArray(item.sector_focus) ? item.sector_focus : []
            }));
            
            // Sort by deadline date
            visualizationData.sort((a: any, b: any) => 
              new Date(a.date).getTime() - new Date(b.date).getTime()
            );
          }
          
          // Check if this is a sector focus query
          else if (sqlQuery.toLowerCase().includes('sector_focus')) {
            // Flatten sector focus arrays into countable items
            const sectorCounts: Record<string, number> = {};
            
            visualizationData.forEach((item: any) => {
              if (Array.isArray(item.sector_focus)) {
                item.sector_focus.forEach((sector: string) => {
                  sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
                });
              }
            });
            
            // Transform for visualization
            visualizationData = Object.entries(sectorCounts).map(([sector, count]) => ({
              name: sector,
              value: count,
              unit: 'programs',
              description: 'Programs by sector'
            }));
            
            // Sort by count descending
            visualizationData.sort((a: any, b: any) => b.value - a.value);
          }
          
          // Default program visualization
          else {
            visualizationData = visualizationData.map((item: any) => ({
              name: item.name || 'Unknown Program',
              value: item.total_budget ? parseFloat(item.total_budget) : 0,
              unit: '€',
              description: item.description || 'Funding program',
              startDate: item.start_date || null,
              endDate: item.end_date || null,
              applicationDeadline: item.application_deadline || null,
              sectors: Array.isArray(item.sector_focus) ? item.sector_focus : []
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

/**
 * Executes a SQL write operation (INSERT, UPDATE, DELETE)
 * This is used for executing SQL statements that modify data
 */
export const executeSqlWrite = async (
  sqlStatements: string
): Promise<{ success: boolean; message: string; affectedRows?: number }> => {
  try {
    console.log("Executing SQL write operation:", sqlStatements);
    
    // Remove any markdown formatting from the SQL if it's present
    const cleanedSql = sqlStatements.replace(/```sql\n|\n```|```/g, '').trim();
    
    // Call the execute-sql edge function with the SQL statements
    const { data, error } = await supabase.functions.invoke('execute-sql', {
      body: { 
        sqlStatements: cleanedSql,
        operation: 'write'
      }
    });
    
    if (error) {
      console.error("Error executing SQL write operation:", error);
      return { 
        success: false, 
        message: `Failed to execute SQL: ${error.message}` 
      };
    }
    
    return { 
      success: true, 
      message: data.message || "SQL executed successfully",
      affectedRows: data.affectedRows 
    };
  } catch (error) {
    console.error("Error in SQL write execution:", error);
    return { 
      success: false, 
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
