
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
  | 'ani_researchers'
  | 'profiles';

export const checkAdminStatus = async (): Promise<boolean> => {
  try {
    // Call the is_admin function we created in the database
    const { data, error } = await supabase.rpc('is_admin');
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Unexpected error during admin check:', error);
    return false;
  }
};

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
  // Check admin status before allowing database initialization
  const isAdmin = await checkAdminStatus();
  if (!isAdmin) {
    return {
      success: false,
      message: 'Admin permission required for database initialization',
      details: { error: 'Permission denied' }
    };
  }

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
  // Check admin status before allowing database status check
  const isAdmin = await checkAdminStatus();
  if (!isAdmin) {
    console.warn('Non-admin user attempted to check database status');
    return { error: 'Admin permission required' };
  }

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
      'ani_researchers',
      'profiles'
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
    return { error: 'Failed to check database status' };
  }
};
