
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const DATABASE_TABLES = [
  'ani_metrics',
  'ani_projects',
  'ani_funding_programs',
  'ani_funding_applications',
  'ani_international_collaborations',
  'ani_patent_holders'
];

/**
 * Generate synthetic data for a specific table
 */
export const generateSyntheticData = async (tableName: string, count: number = 50) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-synthetic-data', {
      body: { 
        tableName,
        count
      }
    });
    
    if (error) {
      console.error(`Error generating synthetic data for ${tableName}:`, error);
      throw new Error(`Failed to generate synthetic data: ${error.message}`);
    }
    
    return { success: true, message: data.message };
  } catch (error) {
    console.error(`Error in generateSyntheticData for ${tableName}:`, error);
    return { 
      success: false, 
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Populate the entire database with synthetic data
 */
export const populateDatabase = async (updateProgress?: (info: string) => void) => {
  const results: Record<string, { success: boolean, message: string }> = {};
  
  for (const table of DATABASE_TABLES) {
    if (updateProgress) {
      updateProgress(`Generating data for ${table}...`);
    }
    
    // Different numbers of records for different tables
    let count = 50;
    if (table === 'ani_metrics') count = 100;
    if (table === 'ani_projects') count = 75;
    if (table === 'ani_funding_programs') count = 25;
    
    results[table] = await generateSyntheticData(table, count);
    
    if (!results[table].success) {
      if (updateProgress) {
        updateProgress(`Error with ${table}: ${results[table].message}`);
      }
      toast.error(`Failed to populate ${table}`, {
        description: results[table].message
      });
    } else {
      if (updateProgress) {
        updateProgress(`Successfully populated ${table}`);
      }
      toast.success(`${table} populated successfully`, {
        description: results[table].message
      });
    }
  }
  
  return results;
};

/**
 * Check if database tables have data
 */
export const checkDatabaseStatus = async () => {
  const results: Record<string, number> = {};
  
  for (const table of DATABASE_TABLES) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      
      results[table] = count || 0;
    } catch (error) {
      console.error(`Error checking ${table}:`, error);
      results[table] = -1; // Error code
    }
  }
  
  return results;
};
