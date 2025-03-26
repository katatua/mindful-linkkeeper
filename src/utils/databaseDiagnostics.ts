
import { supabase } from "@/integrations/supabase/client";

type DatabaseTable = 
  | 'ani_database_status'
  | 'ani_funding_applications'
  | 'ani_funding_programs'
  | 'ani_institutions'
  | 'ani_international_collaborations'
  | 'ani_metrics'
  | 'ani_patent_holders'
  | 'ani_policy_frameworks'
  | 'ani_projects'
  | 'ani_projects_researchers'
  | 'ani_researchers';

export const testDatabaseConnection = async () => {
  try {
    // Test connection by attempting to fetch from a known table
    const { data, error } = await supabase
      .from('ani_database_status')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Database connection test failed:', error);
      return {
        success: false,
        message: error.message,
        details: error
      };
    }

    return {
      success: true,
      message: 'Database connection successful',
      data
    };
  } catch (error) {
    console.error('Unexpected error during database connection test:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
};

export const initializeDatabase = async () => {
  try {
    // Create ani_database_status table if it doesn't exist
    const { data, error } = await supabase.rpc('execute_raw_query', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS ani_database_status (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          table_name TEXT NOT NULL,
          record_count INTEGER DEFAULT 0,
          status TEXT DEFAULT 'empty',
          last_populated TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (error) {
      console.error('Database initialization failed:', error);
      return {
        success: false,
        message: error.message,
        details: error
      };
    }

    return {
      success: true,
      message: 'Database initialized successfully',
      data
    };
  } catch (error) {
    console.error('Unexpected error during database initialization:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
};

export const checkDatabaseStatus = async () => {
  try {
    const tables: DatabaseTable[] = [
      'ani_database_status',
      'ani_funding_applications',
      'ani_funding_programs',
      'ani_institutions',
      'ani_international_collaborations',
      'ani_metrics',
      'ani_patent_holders',
      'ani_policy_frameworks',
      'ani_projects',
      'ani_projects_researchers',
      'ani_researchers'
    ];

    const statusPromises = tables.map(async (table) => {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      return {
        table,
        count: error ? -1 : count || 0
      };
    });

    const results = await Promise.all(statusPromises);
    
    return results.reduce((acc, result) => {
      acc[result.table] = result.count;
      return acc;
    }, {} as Record<DatabaseTable, number>);
  } catch (error) {
    console.error('Error checking database status:', error);
    return {};
  }
};
