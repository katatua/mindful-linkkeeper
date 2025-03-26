
/**
 * Utilities for dynamically creating database tables and sample data
 * when a query references data that doesn't exist
 */
import { supabase } from "@/integrations/supabase/client";

/**
 * Create a dynamic table and populate it with sample data
 */
export const createDynamicTable = async (
  tableName: string, 
  queryContext: string
): Promise<{success: boolean, message: string, createdTable?: string}> => {
  try {
    console.log(`Attempting to create dynamic table: ${tableName} based on: ${queryContext}`);
    
    // Get table schema based on detected table name
    const tableSchema = getTableSchemaForEntity(tableName);
    
    if (!tableSchema) {
      return { 
        success: false, 
        message: `Unable to generate schema for table: ${tableName}` 
      };
    }
    
    try {
      // Check if we can connect to Supabase
      const { error: connectionError } = await supabase
        .from('ani_database_status')
        .select('count(*)', { count: 'exact', head: true });
      
      if (connectionError) {
        throw new Error("Database connection not available");
      }
      
      // Create the table
      const { error: createTableError } = await supabase.rpc(
        'execute_sql_query',
        { sql_query: tableSchema.createTableSQL }
      );
      
      if (createTableError) {
        throw new Error(`Error creating table: ${createTableError.message}`);
      }
      
      // Insert sample data
      for (const insertSQL of tableSchema.sampleDataSQL) {
        const { error: insertError } = await supabase.rpc(
          'execute_sql_query',
          { sql_query: insertSQL }
        );
        
        if (insertError) {
          console.error(`Error inserting data: ${insertError.message}`);
          // Continue with other inserts even if one fails
        }
      }
      
      // Update database status
      await supabase.rpc(
        'execute_sql_query',
        { 
          sql_query: `
            INSERT INTO ani_database_status (table_name, record_count, status, last_populated)
            VALUES ('${tableName}', ${tableSchema.sampleDataSQL.length}, 'populated', CURRENT_TIMESTAMP)
            ON CONFLICT (table_name) 
            DO UPDATE SET
              record_count = ${tableSchema.sampleDataSQL.length},
              status = 'populated',
              last_populated = CURRENT_TIMESTAMP
          `
        }
      );
      
      return { 
        success: true, 
        message: `Created table ${tableName} with ${tableSchema.sampleDataSQL.length} sample records`,
        createdTable: tableName
      };
    } catch (error) {
      console.error("Error creating dynamic table in database:", error);
      
      // If Supabase fails, add to local database
      localStorage.setItem(`dynamicTable_${tableName}`, JSON.stringify({
        schema: tableSchema.createTableSQL,
        sampleData: tableSchema.sampleDataSQL,
        createdAt: new Date().toISOString()
      }));
      
      return { 
        success: true, 
        message: `Created table ${tableName} locally (database unavailable)`,
        createdTable: tableName
      };
    }
  } catch (error) {
    console.error("Error in createDynamicTable:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Get a table schema definition for a detected entity
 */
function getTableSchemaForEntity(tableName: string): {
  createTableSQL: string;
  sampleDataSQL: string[];
} | null {
  switch (tableName) {
    case 'patents':
      return {
        createTableSQL: `
          CREATE TABLE IF NOT EXISTS patents (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            application_date DATE NOT NULL,
            grant_date DATE,
            inventor TEXT,
            assignee TEXT,
            classification TEXT,
            country TEXT DEFAULT 'Portugal',
            year INTEGER NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          )
        `,
        sampleDataSQL: [
          `INSERT INTO patents (title, application_date, grant_date, inventor, assignee, classification, country, year, status) 
           VALUES ('Smart Energy Distribution System', '2020-03-15', '2020-09-20', 'João Silva', 'University of Lisbon', 'Energy', 'Portugal', 2020, 'granted')`,
          `INSERT INTO patents (title, application_date, grant_date, inventor, assignee, classification, country, year, status) 
           VALUES ('Advanced Water Filtration Method', '2020-05-10', '2021-01-15', 'Maria Costa', 'Technical University of Lisbon', 'Environment', 'Portugal', 2020, 'granted')`,
          `INSERT INTO patents (title, application_date, grant_date, inventor, assignee, classification, country, year, status) 
           VALUES ('AI-Based Medical Diagnostic Tool', '2020-07-22', '2021-02-28', 'António Pereira', 'University of Porto', 'Healthcare', 'Portugal', 2020, 'granted')`,
          `INSERT INTO patents (title, application_date, grant_date, inventor, assignee, classification, country, year, status) 
           VALUES ('Sustainable Building Material', '2020-09-05', null, 'Sofia Martinez', 'EcoTech Solutions', 'Construction', 'Portugal', 2020, 'pending')`,
          `INSERT INTO patents (title, application_date, grant_date, inventor, assignee, classification, country, year, status) 
           VALUES ('Quantum Computing Algorithm', '2020-11-18', '2021-05-30', 'Carlos Oliveira', 'Institute of Cybernetics', 'IT', 'Portugal', 2020, 'granted')`,
        ]
      };
    case 'projects':
      return {
        createTableSQL: `
          CREATE TABLE IF NOT EXISTS projects (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            description TEXT,
            start_date DATE NOT NULL,
            end_date DATE,
            status TEXT DEFAULT 'active',
            funding_amount NUMERIC,
            sector TEXT,
            region TEXT,
            organization TEXT,
            year INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          )
        `,
        sampleDataSQL: [
          `INSERT INTO projects (title, description, start_date, end_date, status, funding_amount, sector, region, organization, year) 
           VALUES ('Green Energy Transition', 'Developing renewable energy infrastructure', '2021-01-15', '2023-01-14', 'active', 1250000, 'Energy', 'Norte', 'Renewable Future', 2021)`,
          `INSERT INTO projects (title, description, start_date, end_date, status, funding_amount, sector, region, organization, year) 
           VALUES ('AI for Healthcare', 'Machine learning for medical diagnostics', '2020-03-10', '2022-03-09', 'completed', 980000, 'Healthcare', 'Lisboa', 'Health Innovations', 2020)`,
          `INSERT INTO projects (title, description, start_date, end_date, status, funding_amount, sector, region, organization, year) 
           VALUES ('Smart Agriculture Systems', 'IoT sensors for crop optimization', '2022-05-20', '2024-05-19', 'active', 750000, 'Agriculture', 'Alentejo', 'FarmTech', 2022)`,
        ]
      };
    
    // More table definitions can be added here
    
    default:
      return null;
  }
}
