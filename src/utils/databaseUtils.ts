
// Utility functions for interacting with the Supabase database
import { supabase } from "@/integrations/supabase/client";
import { localDatabase, initializeLocalDatabase } from "@/utils/localDatabase";

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

// Detect if we're using the local database
const isUsingLocalDatabase = () => {
  // Check if Supabase client is actually the mock client
  return (supabase as any).isUsingLocalDb === true || 
         (supabase as any)._supabaseUrl === undefined ||
         import.meta.env.DEV && !import.meta.env.VITE_SUPABASE_URL;
};

// Utility function to check database status
export const checkDatabaseStatus = async (): Promise<Record<string, number>> => {
  try {
    const tables = DATABASE_TABLES;
    const usingLocalDb = isUsingLocalDatabase();
    
    if (usingLocalDb) {
      console.log("Using local database for status check");
      // Get status from local database
      const localDb = JSON.parse(localStorage.getItem('localDatabase') || '{}');
      
      return tables.reduce((acc, table) => {
        const tableData = localDb[table] || [];
        acc[table] = tableData.length;
        return acc;
      }, {} as Record<string, number>);
    }
    
    // Get counts from all tables in Supabase
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
    return {}; // Return empty object instead of an error object
  }
};

// Generate sample data for local database
const generateLocalSampleData = (tableName: string, count: number = 20) => {
  const records = [];
  
  for (let i = 0; i < count; i++) {
    let record: Record<string, any> = { id: `${tableName}-${i+1}` };
    
    // Add fields based on table name
    if (tableName === 'ani_metrics') {
      const categories = ['Investment', 'Output', 'Impact', 'Collaboration', 'Innovation'];
      const regions = ['Norte', 'Centro', 'Lisboa', 'Alentejo', 'Algarve'];
      const units = ['Count', 'EUR', 'Percentage', 'Score'];
      
      record = {
        ...record,
        name: `Metric ${i+1}`,
        value: Math.floor(Math.random() * 1000000) / 100,
        unit: units[Math.floor(Math.random() * units.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        region: regions[Math.floor(Math.random() * regions.length)],
        measurement_date: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } 
    else if (tableName === 'ani_projects') {
      const statuses = ['active', 'completed', 'pending', 'cancelled'];
      const sectors = ['Healthcare', 'Technology', 'Energy', 'Agriculture', 'Education'];
      const regions = ['Norte', 'Centro', 'Lisboa', 'Alentejo', 'Algarve'];
      
      record = {
        ...record,
        title: `Project ${i+1}: Innovation in ${sectors[Math.floor(Math.random() * sectors.length)]}`,
        description: `This is a sample project description for Project ${i+1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        sector: sectors[Math.floor(Math.random() * sectors.length)],
        region: regions[Math.floor(Math.random() * regions.length)],
        funding_amount: Math.floor(Math.random() * 50000) * 100,
        start_date: new Date(2020 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        end_date: new Date(2023 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    else if (tableName === 'ani_institutions') {
      const types = ['University', 'Research Center', 'Company', 'Government', 'Non-profit'];
      const regions = ['Norte', 'Centro', 'Lisboa', 'Alentejo', 'Algarve'];
      
      record = {
        ...record,
        institution_name: `Institution ${i+1}`,
        type: types[Math.floor(Math.random() * types.length)],
        region: regions[Math.floor(Math.random() * regions.length)],
        founding_date: new Date(1900 + Math.floor(Math.random() * 120), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        specialization_areas: ['AI', 'Biotechnology', 'Renewable Energy'].slice(0, Math.floor(Math.random() * 3) + 1),
        collaboration_count: Math.floor(Math.random() * 50),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    else if (tableName === 'ani_researchers') {
      const specializations = ['AI', 'Biotechnology', 'Renewable Energy', 'Agriculture', 'Medicine'];
      
      record = {
        ...record,
        name: `Researcher ${i+1}`,
        email: `researcher${i+1}@example.com`,
        specialization: specializations[Math.floor(Math.random() * specializations.length)],
        publication_count: Math.floor(Math.random() * 100),
        patent_count: Math.floor(Math.random() * 10),
        h_index: Math.floor(Math.random() * 40),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    else if (tableName === 'ani_database_status') {
      record = {
        ...record,
        table_name: DATABASE_TABLES[i % DATABASE_TABLES.length],
        record_count: Math.floor(Math.random() * 100),
        status: 'populated',
        last_populated: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    else {
      // Generic record for other tables
      record = {
        ...record,
        name: `Record ${i+1}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    records.push(record);
  }
  
  return records;
};

// Populate local database with sample data
const populateLocalDatabase = async (progressCallback?: (info: string) => void) => {
  try {
    if (progressCallback) {
      progressCallback("Starting local database population process...");
    }
    
    // Initialize an empty database structure
    let localDb: Record<string, any[]> = {};
    
    // Process tables one by one
    for (const table of DATABASE_TABLES) {
      try {
        if (progressCallback) {
          progressCallback(`Populating ${table}...`);
        }
        
        // Generate sample data for this table
        const sampleData = generateLocalSampleData(table, 25);
        
        // Store in the local database object
        localDb[table] = sampleData;
        
        if (progressCallback) {
          progressCallback(`Successfully populated ${table} with ${sampleData.length} records`);
        }
        
      } catch (err) {
        console.error(`Error processing table ${table}:`, err);
        if (progressCallback) {
          progressCallback(`Error processing ${table}: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
      }
    }
    
    // Store the populated database in localStorage
    localStorage.setItem('localDatabase', JSON.stringify(localDb));
    
    // Final status update
    if (progressCallback) {
      progressCallback("Local database population completed!");
    }
    
    return { success: true, message: "Local database populated successfully" };
  } catch (error) {
    console.error("Error populating local database:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};

// Function to populate the database with sample data
export const populateDatabase = async (progressCallback?: (info: string) => void) => {
  try {
    if (progressCallback) {
      progressCallback("Starting database population process...");
    }
    
    // Check if we're using local database
    const usingLocalDb = isUsingLocalDatabase();
    
    if (usingLocalDb) {
      console.log("Using local database for population");
      return populateLocalDatabase(progressCallback);
    }
    
    // Process tables one by one using the generate-synthetic-data function
    for (const table of DATABASE_TABLES) {
      try {
        if (progressCallback) {
          progressCallback(`Populating ${table}...`);
        }
        
        // Skip the database status table as it's populated by triggers
        if (table === 'ani_database_status') {
          if (progressCallback) {
            progressCallback(`Skipping ${table} (automatically updated)`);
          }
          continue;
        }
        
        // Call the edge function to generate synthetic data for this table
        const response = await supabase.functions.invoke('generate-synthetic-data', {
          body: { tableName: table, count: 25 }
        });
        
        if (response.error) {
          console.error(`Error populating ${table}:`, response.error);
          if (progressCallback) {
            progressCallback(`Error populating ${table}: ${response.error.message}`);
          }
          continue; // Continue with next table even if this one fails
        }
        
        if (progressCallback) {
          progressCallback(`Successfully populated ${table}`);
        }
        
      } catch (err) {
        console.error(`Error processing table ${table}:`, err);
        if (progressCallback) {
          progressCallback(`Error processing ${table}: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
        // Continue with next table
      }
    }
    
    // Final status update
    if (progressCallback) {
      progressCallback("Database population completed!");
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
    const response = await supabase.functions.invoke('show-database-status');
    
    if (response.error) {
      console.error('Error fetching database status:', response.error);
      return { success: false, message: response.error.message };
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Unexpected error in fetchDatabaseStatus:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
