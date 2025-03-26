
import { supabase } from "@/integrations/supabase/client";
import { localDatabase } from "@/utils/localDatabase";

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
    // In our local database environment, all users are considered admins
    return true;
  } catch (error) {
    console.error('Unexpected error during admin check:', error);
    return false;
  }
};

export const testDatabaseConnection = async () => {
  try {
    // Test connection by attempting to fetch from the database status table
    const data = await localDatabase.select('ani_database_status');

    if (!data) {
      console.error('Local database connection test failed: no data returned');
      return {
        success: false,
        message: 'No data returned from database',
        details: 'Database connection test failed'
      };
    }

    return {
      success: true,
      message: 'Local database connection successful',
      data
    };
  } catch (error) {
    console.error('Unexpected error during local database connection test:', error);
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
      'ani_researchers',
      'profiles'
    ];

    // Get counts from all tables
    const statusPromises = tables.map(async (table) => {
      const data = await localDatabase.select(table);
      
      return {
        table,
        count: data ? data.length : 0
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
