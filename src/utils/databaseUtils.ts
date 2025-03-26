
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
    // Log the request details for debugging
    console.log(`Generating synthetic data for table: ${tableName}, count: ${count}`);
    
    // First check if the table exists by querying its schema information
    const { data: tableInfo, error: tableCheckError } = await supabase
      .rpc('execute_raw_query', { 
        sql_query: `
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = '${tableName}'
          AND table_schema = 'public'
          LIMIT 1
        `
      });
    
    if (tableCheckError || !tableInfo || !Array.isArray(tableInfo) || tableInfo.length === 0) {
      console.error(`Table check failed for ${tableName}:`, tableCheckError || "Table not found");
      return { 
        success: false, 
        message: `Table '${tableName}' doesn't exist or isn't accessible. Please initialize the database first.`
      };
    }
    
    // Try to call the edge function
    console.log(`Calling edge function for ${tableName}`);
    const { data, error } = await supabase.functions.invoke('generate-synthetic-data', {
      body: { 
        tableName,
        count
      }
    }).catch(err => {
      console.error(`Edge function error for ${tableName}:`, err);
      return { data: null, error: err };
    });
    
    if (error) {
      console.error(`Error generating synthetic data for ${tableName}:`, error);
      
      // Try direct SQL insertion as a fallback
      console.log(`Attempting direct SQL insertion for ${tableName}`);
      
      // This is a fallback to generate some basic data directly when the edge function fails
      const fallbackResult = await generateFallbackData(tableName, count);
      if (fallbackResult.success) {
        return fallbackResult;
      }
      
      throw new Error(`Failed to generate synthetic data: ${error.message}`);
    }
    
    return { success: true, message: data?.message || `Generated data for ${tableName}` };
  } catch (error) {
    console.error(`Error in generateSyntheticData for ${tableName}:`, error);
    return { 
      success: false, 
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Fallback method to generate basic data when edge function fails
 */
const generateFallbackData = async (tableName: string, count: number) => {
  try {
    let columnsQuery = `
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = '${tableName}'
      AND table_schema = 'public'
      AND column_name != 'id'
      ORDER BY ordinal_position
    `;
    
    const { data: columnsData, error: columnsError } = await supabase
      .rpc('execute_raw_query', { sql_query: columnsQuery });
      
    if (columnsError || !columnsData || !Array.isArray(columnsData) || columnsData.length === 0) {
      return { 
        success: false, 
        message: `Couldn't get column information for ${tableName}`
      };
    }
    
    // Clear existing data
    await supabase.from(tableName as any).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Generate simple insertion data based on column types
    let insertData = [];
    const currentDate = new Date().toISOString();
    
    for (let i = 0; i < count; i++) {
      let record: Record<string, any> = {};
      
      if (Array.isArray(columnsData)) {
        columnsData.forEach((col: any) => {
          const colName = col.column_name;
          
          if (col.data_type.includes('timestamp')) {
            record[colName] = currentDate;
          } else if (col.data_type === 'integer' || col.data_type === 'numeric') {
            record[colName] = Math.floor(Math.random() * 1000);
          } else if (col.data_type === 'boolean') {
            record[colName] = Math.random() > 0.5;
          } else if (col.data_type.includes('uuid') && (colName.endsWith('_id'))) {
            // Skip foreign keys for simplicity in fallback mode
            if (col.is_nullable === 'YES') {
              record[colName] = null;
            }
          } else if (col.data_type === 'ARRAY') {
            record[colName] = ['Sample Item 1', 'Sample Item 2'];
          } else {
            // Default to text values
            record[colName] = `${tableName.replace('ani_', '')} ${colName} ${i + 1}`;
          }
        });
      }
      
      insertData.push(record);
    }
    
    // Insert in batches of 20
    const batchSize = 20;
    for (let i = 0; i < insertData.length; i += batchSize) {
      const batch = insertData.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from(tableName as any)
        .insert(batch);
        
      if (insertError) {
        console.error(`Error inserting fallback data into ${tableName}:`, insertError);
        return { 
          success: false, 
          message: `Fallback data insertion failed: ${insertError.message}`
        };
      }
    }
    
    return { 
      success: true, 
      message: `Generated basic fallback data for ${tableName} (${count} records)`
    };
  } catch (error) {
    console.error(`Fallback data generation failed for ${tableName}:`, error);
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
      // Try a more reliable method to check if table exists first
      const { data: tableExists, error: existsError } = await supabase
        .rpc('execute_raw_query', { 
          sql_query: `
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_name = '${table}' AND table_schema = 'public'
            ) as exists
          `
        });
      
      if (existsError || !tableExists || !tableExists[0] || !tableExists[0].exists) {
        results[table] = -1; // Table doesn't exist
        continue;
      }
      
      // Add type assertion to tell TypeScript that the table name is valid
      const { data: existingRows, error: countError } = await supabase
        .from(table)
        .select('count(*)', { count: 'exact' });
      
      if (countError || !existingRows || !Array.isArray(existingRows) || existingRows.length === 0) {
        results[table] = -1; // Error code
      } else {
        results[table] = existingRows[0].count;
      }
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

-- Create tables for the ANI database if they don't exist
CREATE TABLE IF NOT EXISTS public.ani_institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name TEXT NOT NULL,
  type TEXT NOT NULL,
  region TEXT,
  specialization_areas TEXT[] DEFAULT '{}',
  founding_date DATE,
  collaboration_count INTEGER DEFAULT 0,
  project_history TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ani_researchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialization TEXT,
  email TEXT,
  institution_id UUID REFERENCES public.ani_institutions(id),
  h_index INTEGER,
  publication_count INTEGER DEFAULT 0,
  patent_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ani_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  value NUMERIC,
  unit TEXT,
  measurement_date DATE,
  region TEXT,
  sector TEXT,
  source TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ani_funding_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  funding_type TEXT,
  total_budget NUMERIC,
  start_date DATE,
  end_date DATE,
  application_deadline DATE,
  next_call_date DATE,
  sector_focus TEXT[],
  eligibility_criteria TEXT,
  application_process TEXT,
  review_time_days INTEGER,
  success_rate NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ani_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  funding_amount NUMERIC,
  status TEXT NOT NULL DEFAULT 'submitted',
  sector TEXT,
  region TEXT,
  organization TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  institution_id UUID REFERENCES public.ani_institutions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ani_funding_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID,
  organization TEXT,
  status TEXT NOT NULL,
  requested_amount NUMERIC,
  approved_amount NUMERIC,
  application_date DATE NOT NULL,
  decision_date DATE,
  region TEXT,
  sector TEXT,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ani_patent_holders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  sector TEXT,
  patent_count INTEGER NOT NULL,
  innovation_index NUMERIC,
  year INTEGER NOT NULL,
  country TEXT,
  institution_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ani_international_collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name TEXT NOT NULL,
  country TEXT NOT NULL,
  partnership_type TEXT,
  focus_areas TEXT[],
  start_date DATE,
  end_date DATE,
  total_budget NUMERIC,
  portuguese_contribution NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ani_projects_researchers (
  project_id UUID NOT NULL,
  researcher_id UUID NOT NULL,
  role TEXT,
  PRIMARY KEY (project_id, researcher_id)
);

-- Create a trigger function to update the ani_database_status table
CREATE OR REPLACE FUNCTION public.update_database_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  query text;
  record_count integer;
BEGIN
  -- Build a dynamic query to count records in the table
  query := 'SELECT count(*) FROM public.' || quote_ident(TG_TABLE_NAME);
  
  -- Execute the query to get the count
  EXECUTE query INTO record_count;
  
  -- Update the status table with the count of records
  INSERT INTO public.ani_database_status (table_name, last_populated, record_count, status)
  VALUES (TG_TABLE_NAME, now(), record_count, 
         CASE WHEN record_count > 0 THEN 'populated' ELSE 'empty' END)
  ON CONFLICT (table_name) 
  DO UPDATE SET
    last_populated = now(),
    record_count = record_count,
    status = CASE WHEN record_count > 0 THEN 'populated' ELSE 'empty' END,
    updated_at = now();
  
  RETURN NULL;
END;
$$;

-- Create triggers for each table to update the status
CREATE TRIGGER trigger_update_metrics_status
AFTER INSERT OR UPDATE OR DELETE ON public.ani_metrics
FOR EACH STATEMENT EXECUTE FUNCTION update_database_status();

CREATE TRIGGER trigger_update_projects_status
AFTER INSERT OR UPDATE OR DELETE ON public.ani_projects
FOR EACH STATEMENT EXECUTE FUNCTION update_database_status();

CREATE TRIGGER trigger_update_funding_programs_status
AFTER INSERT OR UPDATE OR DELETE ON public.ani_funding_programs
FOR EACH STATEMENT EXECUTE FUNCTION update_database_status();

CREATE TRIGGER trigger_update_funding_applications_status
AFTER INSERT OR UPDATE OR DELETE ON public.ani_funding_applications
FOR EACH STATEMENT EXECUTE FUNCTION update_database_status();

CREATE TRIGGER trigger_update_patent_holders_status
AFTER INSERT OR UPDATE OR DELETE ON public.ani_patent_holders
FOR EACH STATEMENT EXECUTE FUNCTION update_database_status();

CREATE TRIGGER trigger_update_intl_collaborations_status
AFTER INSERT OR UPDATE OR DELETE ON public.ani_international_collaborations
FOR EACH STATEMENT EXECUTE FUNCTION update_database_status();

CREATE TRIGGER trigger_update_institutions_status
AFTER INSERT OR UPDATE OR DELETE ON public.ani_institutions
FOR EACH STATEMENT EXECUTE FUNCTION update_database_status();

CREATE TRIGGER trigger_update_researchers_status
AFTER INSERT OR UPDATE OR DELETE ON public.ani_researchers
FOR EACH STATEMENT EXECUTE FUNCTION update_database_status();

CREATE TRIGGER trigger_update_projects_researchers_status
AFTER INSERT OR UPDATE OR DELETE ON public.ani_projects_researchers
FOR EACH STATEMENT EXECUTE FUNCTION update_database_status();

-- Initialize ani_database_status table with all tables' status
INSERT INTO public.ani_database_status (table_name, record_count, status)
SELECT table_name, 0, 'empty'
FROM (
  VALUES 
    ('ani_metrics'),
    ('ani_projects'),
    ('ani_funding_programs'),
    ('ani_funding_applications'),
    ('ani_patent_holders'),
    ('ani_international_collaborations'),
    ('ani_institutions'),
    ('ani_researchers'),
    ('ani_projects_researchers')
) AS t(table_name)
ON CONFLICT (table_name) DO NOTHING;
`;
};
