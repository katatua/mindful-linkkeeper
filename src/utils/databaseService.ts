
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
    console.log("Fetching database tables...");
    const { data, error } = await supabase.functions.invoke('get-database-tables');
    
    if (error) {
      console.error("Error fetching database tables:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No tables found in the database");
    } else {
      console.log(`Found ${data.length} tables in the database`);
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
    console.log(`Fetching data from table: ${tableName}`);
    // Use the getTable helper function which safely handles dynamic table names
    const { data, error } = await getTable(tableName)
      .select('*')
      .limit(limit);
    
    if (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} rows from ${tableName}`);
    return data || [];
  } catch (error) {
    console.error(`Failed to fetch data from ${tableName}:`, error);
    return [];
  }
};
