import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const DATABASE_TABLES = [
  'ani_metrics',
  'ani_projects',
  'ani_funding_programs',
  'ani_funding_applications',
  'ani_international_collaborations',
  'ani_patent_holders',
  'ani_institutions',
  'ani_researchers',
  'ani_projects_researchers'
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
  
  // Define a specific order to respect foreign key dependencies
  const populationOrder = [
    'ani_institutions',            // First, populate institutions
    'ani_researchers',             // Then researchers (depends on institutions)
    'ani_metrics',                 // Independent
    'ani_funding_programs',        // Independent
    'ani_projects',                // Depends on institutions
    'ani_funding_applications',    // Depends on funding programs
    'ani_patent_holders',          // Depends on institutions
    'ani_international_collaborations', // Independent
    'ani_projects_researchers'     // Depends on projects and researchers
  ];
  
  for (const table of populationOrder) {
    if (updateProgress) {
      updateProgress(`Generating data for ${table}...`);
    }
    
    // Different numbers of records for different tables
    let count = 50;
    if (table === 'ani_metrics') count = 100;
    if (table === 'ani_projects') count = 75;
    if (table === 'ani_funding_programs') count = 25;
    if (table === 'ani_institutions') count = 20;
    if (table === 'ani_researchers') count = 40;
    if (table === 'ani_projects_researchers') count = 120;
    
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
      // Add type assertion to tell TypeScript that the table name is valid
      const { count, error } = await supabase
        .from(table as any)
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

/**
 * Gets the SQL script needed to initialize the database
 * This can be copied and run manually in the SQL Editor if edge functions fail
 */
export const getDatabaseInitScript = () => {
  return `
-- Create the ani_database_status table to track database tables status
CREATE TABLE IF NOT EXISTS public.ani_database_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL UNIQUE,
  record_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'empty',
  last_populated TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create execute_raw_query function for administrative operations
CREATE OR REPLACE FUNCTION public.execute_raw_query(sql_query text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- For security, restrict to SELECT statements in this function
  IF NOT (lower(btrim(sql_query)) LIKE 'select%') THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed for security reasons';
  END IF;
  
  -- Execute the query and get results as JSON
  EXECUTE 'SELECT json_agg(t) FROM (' || sql_query || ') t' INTO result;
  
  -- Return empty array instead of null
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- Create is_admin function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;
`;
};
