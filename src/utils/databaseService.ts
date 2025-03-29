
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
    // Return mock data only if we can't connect to the database
    return [
      {
        table_name: 'fontes_dados',
        columns: [
          { column_name: 'id', data_type: 'integer', is_nullable: 'NO' },
          { column_name: 'nome_sistema', data_type: 'text', is_nullable: 'NO' },
          { column_name: 'descricao', data_type: 'text', is_nullable: 'NO' },
          { column_name: 'tecnologia', data_type: 'text', is_nullable: 'NO' },
          { column_name: 'entidade', data_type: 'text', is_nullable: 'YES' },
          { column_name: 'data_importacao', data_type: 'timestamp with time zone', is_nullable: 'YES' }
        ]
      },
      {
        table_name: 'dados_extraidos',
        columns: [
          { column_name: 'id', data_type: 'uuid', is_nullable: 'NO' },
          { column_name: 'fonte_id', data_type: 'integer', is_nullable: 'YES' },
          { column_name: 'tipo', data_type: 'text', is_nullable: 'NO' },
          { column_name: 'conteudo', data_type: 'jsonb', is_nullable: 'NO' },
          { column_name: 'data_extracao', data_type: 'timestamp with time zone', is_nullable: 'YES' }
        ]
      },
      {
        table_name: 'instituicoes',
        columns: [
          { column_name: 'id', data_type: 'uuid', is_nullable: 'NO' },
          { column_name: 'nome_instituicao', data_type: 'text', is_nullable: 'NO' },
          { column_name: 'localizacao', data_type: 'text', is_nullable: 'YES' },
          { column_name: 'area_atividade', data_type: 'text', is_nullable: 'YES' },
          { column_name: 'outros_detalhes', data_type: 'text', is_nullable: 'YES' }
        ]
      },
      {
        table_name: 'cooperacao_internacional',
        columns: [
          { column_name: 'id', data_type: 'uuid', is_nullable: 'NO' },
          { column_name: 'nome_parceiro', data_type: 'text', is_nullable: 'NO' },
          { column_name: 'tipo_interacao', data_type: 'text', is_nullable: 'NO' },
          { column_name: 'data_inicio', data_type: 'date', is_nullable: 'NO' },
          { column_name: 'data_fim', data_type: 'date', is_nullable: 'YES' },
          { column_name: 'outros_detalhes', data_type: 'text', is_nullable: 'YES' }
        ]
      },
      {
        table_name: 'documentos_extraidos',
        columns: [
          { column_name: 'id', data_type: 'uuid', is_nullable: 'NO' },
          { column_name: 'fonte_id', data_type: 'integer', is_nullable: 'YES' },
          { column_name: 'nome', data_type: 'text', is_nullable: 'NO' },
          { column_name: 'tipo', data_type: 'text', is_nullable: 'NO' },
          { column_name: 'tamanho', data_type: 'text', is_nullable: 'YES' },
          { column_name: 'data_extracao', data_type: 'timestamp with time zone', is_nullable: 'YES' },
          { column_name: 'conteudo', data_type: 'text', is_nullable: 'YES' },
          { column_name: 'metadata', data_type: 'jsonb', is_nullable: 'YES' },
          { column_name: 'ai_summary', data_type: 'text', is_nullable: 'YES' },
          { column_name: 'ai_analysis', data_type: 'text', is_nullable: 'YES' },
          { column_name: 'status', data_type: 'text', is_nullable: 'YES' }
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
      
      // Check for RLS policy violations
      if (error.code === '42501' || (error.message && error.message.includes('row-level security policy'))) {
        throw new Error(`Permissão negada: Você não tem acesso para ler os dados da tabela ${tableName}. Erro: ${error.message}`);
      }
      
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} rows from ${tableName}`);
    return data || [];
  } catch (error) {
    console.error(`Failed to fetch data from ${tableName}:`, error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const insertTableData = async (tableName: string, data: any): Promise<boolean> => {
  try {
    console.log(`Inserting data into table: ${tableName}`, data);
    const { error } = await getTable(tableName).insert(data);
    
    if (error) {
      console.error(`Error inserting data into ${tableName}:`, error);
      
      // Check for RLS policy violations
      if (error.code === '42501' || (error.message && error.message.includes('row-level security policy'))) {
        throw new Error(`Permissão negada: Você não tem permissão para inserir dados na tabela ${tableName}. Erro: ${error.message}`);
      }
      
      throw error;
    }
    
    console.log(`Successfully inserted data into ${tableName}`);
    return true;
  } catch (error) {
    console.error(`Failed to insert data into ${tableName}:`, error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const updateDatabaseTables = async (): Promise<boolean> => {
  try {
    console.log("Updating database tables...");
    const { error } = await supabase.functions.invoke('get-database-tables', {
      method: 'POST',
      body: { refresh: true }
    });
    
    if (error) {
      console.error("Error updating database tables:", error);
      return false;
    }
    
    console.log("Database tables updated successfully");
    return true;
  } catch (error) {
    console.error("Failed to update database tables:", error);
    return false;
  }
};

// Add new function to check permissions on a table
export const checkTablePermissions = async (tableName: string): Promise<{
  canRead: boolean;
  canWrite: boolean;
}> => {
  try {
    // Check read permissions
    let canRead = false;
    try {
      const { data: readData, error: readError } = await getTable(tableName)
        .select('*')
        .limit(1);
      
      canRead = !readError;
    } catch (error) {
      console.log(`No read permission for ${tableName}`);
    }
    
    // Check write permissions using a simple test (that will handle errors)
    let canWrite = false;
    try {
      // Try to check permissions by attempting a query that will be rejected if no permissions
      // We'll use execute_sql_query for more flexibility
      const { data, error } = await supabase.rpc('execute_sql_query', {
        sql_query: `SELECT has_table_privilege(current_user, '${tableName}', 'INSERT') as can_insert`
      });
      
      if (!error && data && data[0]) {
        canWrite = data[0].can_insert;
      }
    } catch (error) {
      console.log(`Error checking write permission for ${tableName}:`, error);
    }
    
    return { canRead, canWrite };
  } catch (error) {
    console.error(`Error checking permissions for ${tableName}:`, error);
    return { canRead: false, canWrite: false };
  }
};
