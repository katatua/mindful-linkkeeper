
import { supabase, getTable } from '@/integrations/supabase/client';

export interface DatabaseTable {
  table_name: string;
  columns: Array<{
    column_name: string;
    data_type: string;
    is_nullable: string;
  }>;
}

export const fetchDatabaseTables = async (): Promise<DatabaseTable[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-database-tables');
    
    if (error) {
      console.error("Error fetching database tables:", error);
      throw error;
    }
    
    return data as DatabaseTable[];
  } catch (error) {
    console.error("Failed to fetch database tables:", error);
    // Return mock data for development if the function fails
    return [
      {
        table_name: 'ani_funding_programs',
        columns: [
          { column_name: 'id', data_type: 'uuid', is_nullable: 'NO' },
          { column_name: 'name', data_type: 'text', is_nullable: 'NO' },
          { column_name: 'description', data_type: 'text', is_nullable: 'YES' },
          { column_name: 'total_budget', data_type: 'numeric', is_nullable: 'YES' }
        ]
      },
      {
        table_name: 'ani_projects',
        columns: [
          { column_name: 'id', data_type: 'uuid', is_nullable: 'NO' },
          { column_name: 'title', data_type: 'text', is_nullable: 'NO' },
          { column_name: 'description', data_type: 'text', is_nullable: 'YES' }
        ]
      }
    ];
  }
};

export const fetchTableData = async (tableName: string, limit: number = 50): Promise<any[]> => {
  try {
    // Use the getTable helper function which safely handles dynamic table names
    const { data, error } = await getTable(tableName)
      .select('*')
      .limit(limit);
    
    if (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Failed to fetch data from ${tableName}:`, error);
    return [];
  }
};
