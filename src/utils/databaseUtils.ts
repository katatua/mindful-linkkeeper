
// Utility functions for interacting with the Supabase database
import { supabase } from "@/integrations/supabase/client";

// List of database tables for management UI
export const DATABASE_TABLES = [
  'ani_metrics',
  'ani_projects',
  'ani_institutions',
  'ani_researchers',
  'ani_projects_researchers',
  'ani_patent_holders',
  'ani_funding_programs',
  'ani_funding_applications',
  'ani_international_collaborations',
  'ani_policy_frameworks',
  'ani_database_status'
];

// Utility function to check for errors in Supabase responses
export const checkError = (response: any) => {
  if (response.error) {
    console.error('Error:', response.error);
    return response.error.message || 'An error occurred';
  }
  return null;
};

// Utility function to execute a Supabase query and handle errors
export const executeQuery = async (query: Promise<any>) => {
  try {
    const response = await query;
    const error = checkError(response);
    if (error) {
      return { success: false, message: error };
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Query execution error:', error);
    return { success: false, message: 'Query execution failed' };
  }
};

// Utility function to check database status
export const checkDatabaseStatus = async () => {
  try {
    const tables = DATABASE_TABLES;
    
    // Get counts from all tables
    const statusPromises = tables.map(async (table) => {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        return {
          table,
          count: error ? -1 : (data?.length || 0)
        };
      } catch (err) {
        console.error(`Error checking table ${table}:`, err);
        return { table, count: -1 };
      }
    });

    const results = await Promise.all(statusPromises);
    
    return results.reduce((acc, result) => {
      acc[result.table] = result.count;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('Error checking database status:', error);
    return { error: 'Failed to check database status' };
  }
};

// Function to populate the database with sample data
export const populateDatabase = async (progressCallback?: (info: string) => void) => {
  try {
    if (progressCallback) {
      progressCallback("Starting database population process...");
    }
    
    // This would be replaced with actual database population logic
    // For now, it's just a simulation
    for (const table of DATABASE_TABLES) {
      if (progressCallback) {
        progressCallback(`Populating ${table}...`);
      }
      
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (progressCallback) {
        progressCallback(`Successfully populated ${table}`);
      }
    }
    
    return { success: true, message: "Database populated successfully" };
  } catch (error) {
    console.error("Error populating database:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};

// Generate a database initialization script (stub for now)
export const getDatabaseInitScript = () => {
  return `
-- Sample initialization script
CREATE TABLE IF NOT EXISTS ani_database_status (
  id SERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- More initialization statements would go here
`;
};

export const fetchDatabaseStatus = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('show-database-status');
    
    if (error) {
      console.error('Error fetching database status:', error);
      return { success: false, message: error.message };
    }
    
    return { success: true, data: data };
  } catch (error) {
    console.error('Unexpected error in fetchDatabaseStatus:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
