
import fs from 'fs';
import path from 'path';

// Define the base directory for our local database files
const DB_DIR = path.join(process.cwd(), 'local_db');

// Ensure the directory exists
if (typeof window === 'undefined') {
  if (!fs.existsSync(DB_DIR)) {
    try {
      fs.mkdirSync(DB_DIR, { recursive: true });
    } catch (error) {
      console.error('Error creating local database directory:', error);
    }
  }
}

// Define the tables we want to simulate from Supabase
export const LOCAL_TABLES = [
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

// Interface for database operations
export interface LocalDatabaseOperations {
  select: (table: string, options?: QueryOptions) => Promise<{ data: any[]; error: Error | null }>;
  insert: (table: string, data: any) => Promise<{ data: any; error: Error | null }>;
  update: (table: string, id: string, data: any) => Promise<{ data: any; error: Error | null }>;
  delete: (table: string, id: string) => Promise<{ error: Error | null }>;
  rpc: (functionName: string, params: any) => Promise<{ data: any; error: Error | null }>;
  functions: {
    invoke: (functionName: string, options?: { body?: any }) => Promise<{ data: any; error: Error | null }>;
  };
}

// Query options interface to simulate Supabase queries
export interface QueryOptions {
  select?: string;
  eq?: [string, any];
  limit?: number;
  order?: [string, { ascending: boolean }];
  count?: string;
  head?: boolean;
  from?: string;
  match?: [string, any];
}

// Helper to get the file path for a table
const getTablePath = (table: string): string => {
  return path.join(DB_DIR, `${table}.json`);
};

// Helper to read data from a table file
const readTable = (table: string): any[] => {
  if (typeof window !== 'undefined') {
    // In browser context, use localStorage as fallback
    const data = localStorage.getItem(`local_db_${table}`);
    return data ? JSON.parse(data) : [];
  }

  try {
    const filePath = getTablePath(table);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading from table ${table}:`, error);
    return [];
  }
};

// Helper to write data to a table file
const writeTable = (table: string, data: any[]): void => {
  if (typeof window !== 'undefined') {
    // In browser context, use localStorage as fallback
    localStorage.setItem(`local_db_${table}`, JSON.stringify(data));
    return;
  }

  try {
    const filePath = getTablePath(table);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing to table ${table}:`, error);
  }
};

// Initialize database with sample data
export const initializeLocalDatabase = (): void => {
  // Only initialize if tables don't exist
  LOCAL_TABLES.forEach(table => {
    const tableData = readTable(table);
    if (tableData.length === 0) {
      // Table doesn't exist or is empty, initialize with sample data
      const sampleData = generateSampleData(table);
      writeTable(table, sampleData);
    }
  });

  // Update database status table
  updateDatabaseStatus();
};

// Update the status table with counts from all tables
export const updateDatabaseStatus = (): void => {
  const statusRecords = LOCAL_TABLES.map(tableName => {
    const tableData = readTable(tableName);
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : `${tableName}-${Date.now()}`,
      table_name: tableName,
      record_count: tableData.length,
      status: tableData.length > 0 ? 'populated' : 'empty',
      last_populated: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });

  writeTable('ani_database_status', statusRecords);
};

// Generate sample data for tables
export const generateSampleData = (table: string): any[] => {
  switch (table) {
    case 'ani_database_status':
      return [];
    
    case 'ani_metrics':
      return [
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `metric-1`,
          name: "R&D Intensity",
          value: 1.41,
          unit: "%",
          category: "Investment",
          measurement_date: "2023-12-31",
          description: "R&D expenditure as percentage of GDP",
          source: "Statistics Portugal",
          sector: null,
          region: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `metric-2`,
          name: "Private Sector R&D Investment",
          value: 58.2,
          unit: "%",
          category: "Investment",
          measurement_date: "2023-12-31",
          description: "Percentage of total R&D performed by business sector",
          source: "Statistics Portugal",
          sector: "Business",
          region: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `metric-3`,
          name: "Patent Applications",
          value: 235,
          unit: "applications",
          category: "Intellectual Property",
          measurement_date: "2023-12-31",
          description: "Number of patent applications filed",
          source: "European Patent Office",
          sector: null,
          region: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    
    case 'ani_projects':
      return [
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `project-1`,
          title: "AI for Medical Diagnostics",
          description: "Development of AI algorithms for early disease detection",
          status: "active",
          funding_amount: 750000,
          start_date: "2023-02-15",
          end_date: "2025-02-14",
          sector: "Healthcare",
          region: "Lisboa",
          organization: "Lisbon Medical Center",
          contact_email: "contact@lisbonmedical.pt",
          contact_phone: "+351123456789",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `project-2`,
          title: "Sustainable Energy Storage",
          description: "Research into advanced battery technologies for renewable energy",
          status: "active",
          funding_amount: 620000,
          start_date: "2023-05-10",
          end_date: "2025-05-09",
          sector: "Energy",
          region: "Norte",
          organization: "Porto Energy Research Center",
          contact_email: "research@portoenergy.pt",
          contact_phone: "+351987654321",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    
    case 'ani_funding_programs':
      return [
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `program-1`,
          name: "Innovation Boost",
          description: "Funding for innovative projects in SMEs",
          funding_type: "Grant",
          total_budget: 25000000,
          start_date: "2023-01-15",
          end_date: "2024-12-31",
          application_deadline: "2024-06-30",
          sector_focus: ["ICT", "Manufacturing", "Health"],
          eligibility_criteria: "SMEs with innovative projects",
          success_rate: 45.5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `program-2`,
          name: "Green Tech Initiative",
          description: "Support for sustainable technology development",
          funding_type: "Co-financing",
          total_budget: 18500000,
          start_date: "2023-03-01",
          end_date: "2025-02-28",
          application_deadline: "2024-07-15",
          sector_focus: ["Renewable Energy", "Sustainability"],
          eligibility_criteria: "Organizations developing green technologies",
          success_rate: 38.2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    
    case 'ani_institutions':
      return [
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `institution-1`,
          institution_name: "University of Lisbon",
          type: "Higher Education",
          region: "Lisboa",
          specialization_areas: ["Computer Science", "Medicine", "Engineering"],
          founding_date: "1911-03-23",
          collaboration_count: 45,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `institution-2`,
          institution_name: "Porto Research Institute",
          type: "Research",
          region: "Norte",
          specialization_areas: ["Biotechnology", "Materials Science"],
          founding_date: "1987-05-10",
          collaboration_count: 32,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    
    case 'ani_patent_holders':
      return [
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `patent-1`,
          organization_name: "University of Lisbon",
          patent_count: 48,
          year: 2023,
          sector: "Higher Education",
          innovation_index: 8.7,
          created_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `patent-2`,
          organization_name: "PharmaTech Solutions",
          patent_count: 35,
          year: 2023,
          sector: "Pharmaceuticals",
          innovation_index: 9.2,
          created_at: new Date().toISOString()
        }
      ];
    
    case 'ani_international_collaborations':
      return [
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `collab-1`,
          program_name: "EU Research Consortium",
          country: "Germany",
          partnership_type: "Joint Research",
          focus_areas: ["AI", "Healthcare"],
          total_budget: 3500000,
          portuguese_contribution: 850000,
          start_date: "2023-01-01",
          end_date: "2025-12-31",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `collab-2`,
          program_name: "Sustainable Energy Coalition",
          country: "Spain",
          partnership_type: "Technology Transfer",
          focus_areas: ["Renewable Energy"],
          total_budget: 2800000,
          portuguese_contribution: 720000,
          start_date: "2023-03-15",
          end_date: "2025-03-14",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    
    case 'ani_researchers':
      return [
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `researcher-1`,
          name: "Maria Silva",
          specialization: "Artificial Intelligence",
          institution_id: null, // Would normally link to an institution
          email: "maria.silva@research.pt",
          h_index: 24,
          publication_count: 78,
          patent_count: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `researcher-2`,
          name: "João Santos",
          specialization: "Biotechnology",
          institution_id: null,
          email: "joao.santos@research.pt",
          h_index: 18,
          publication_count: 45,
          patent_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    
    case 'profiles':
      return [
        {
          id: "user-1",
          email: "admin@example.com",
          first_name: "Admin",
          last_name: "User",
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "user-2",
          email: "viewer@example.com",
          first_name: "Viewer",
          last_name: "User",
          role: "viewer",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    
    // Generate empty arrays for other tables
    default:
      return [];
  }
};

// Create the local database client with similar API to Supabase
export const localDatabase: LocalDatabaseOperations = {
  select: async (table: string, options?: QueryOptions) => {
    try {
      let data = readTable(table);
      
      // Apply filters if provided
      if (options?.eq) {
        const [field, value] = options.eq;
        data = data.filter(item => item[field] === value);
      }
      
      // Apply limit
      if (options?.limit) {
        data = data.slice(0, options.limit);
      }
      
      // Apply ordering
      if (options?.order) {
        const [field, { ascending }] = options.order;
        data.sort((a, b) => {
          if (ascending) {
            return a[field] > b[field] ? 1 : -1;
          } else {
            return a[field] < b[field] ? 1 : -1;
          }
        });
      }
      
      // Handle count requests
      if (options?.count === 'exact') {
        if (options?.head) {
          return { data: null, count: data.length, error: null };
        }
      }
      
      return { data, error: null };
    } catch (error) {
      console.error(`Error in local database select operation for ${table}:`, error);
      return { data: null, error: error as Error };
    }
  },
  
  insert: async (table: string, data: any) => {
    try {
      const tableData = readTable(table);
      
      // Ensure the data has an ID
      const newItem = {
        ...data,
        id: data.id || (crypto.randomUUID ? crypto.randomUUID() : `${table}-${Date.now()}`),
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
      
      tableData.push(newItem);
      writeTable(table, tableData);
      
      // Update database status
      updateDatabaseStatus();
      
      return { data: newItem, error: null };
    } catch (error) {
      console.error(`Error in local database insert operation for ${table}:`, error);
      return { data: null, error: error as Error };
    }
  },
  
  update: async (table: string, id: string, data: any) => {
    try {
      let tableData = readTable(table);
      const index = tableData.findIndex(item => item.id === id);
      
      if (index === -1) {
        throw new Error(`Item with ID ${id} not found in table ${table}`);
      }
      
      // Update the item
      tableData[index] = {
        ...tableData[index],
        ...data,
        updated_at: new Date().toISOString()
      };
      
      writeTable(table, tableData);
      
      return { data: tableData[index], error: null };
    } catch (error) {
      console.error(`Error in local database update operation for ${table}:`, error);
      return { data: null, error: error as Error };
    }
  },
  
  delete: async (table: string, id: string) => {
    try {
      let tableData = readTable(table);
      const filteredData = tableData.filter(item => item.id !== id);
      
      writeTable(table, filteredData);
      
      // Update database status
      updateDatabaseStatus();
      
      return { error: null };
    } catch (error) {
      console.error(`Error in local database delete operation for ${table}:`, error);
      return { error: error as Error };
    }
  },
  
  rpc: async (functionName: string, params: any) => {
    try {
      // Simulate RPC functions
      if (functionName === 'execute_raw_query') {
        // Simple implementation for select queries
        const { sql_query } = params;
        
        // Very basic SQL parser to extract table
        const match = sql_query.match(/FROM\s+([a-zA-Z_]+)/i);
        if (match && match[1]) {
          const table = match[1];
          const data = readTable(table);
          return { data, error: null };
        }
        
        return { data: [], error: null };
      }
      
      if (functionName === 'is_admin') {
        // Check if user is admin (simulate by returning true)
        return { data: true, error: null };
      }
      
      throw new Error(`RPC function ${functionName} not implemented`);
    } catch (error) {
      console.error(`Error in local database RPC call for ${functionName}:`, error);
      return { data: null, error: error as Error };
    }
  },
  
  functions: {
    invoke: async (functionName: string, options?: { body?: any }) => {
      try {
        // Simulate Supabase Edge Functions
        if (functionName === 'initialize-database') {
          // Initialize all tables with sample data
          LOCAL_TABLES.forEach(table => {
            const sampleData = generateSampleData(table);
            writeTable(table, sampleData);
          });
          
          return { 
            data: { success: true, message: "Database initialized successfully" }, 
            error: null 
          };
        }
        
        if (functionName === 'show-database-status') {
          // Return status of all tables
          const statusData = readTable('ani_database_status');
          return { 
            data: { success: true, data: statusData }, 
            error: null 
          };
        }
        
        if (functionName === 'generate-sql') {
          // Simulate SQL generation from natural language
          const { question } = options?.body || {};
          let sql = '';
          
          if (question.toLowerCase().includes('metrics')) {
            sql = 'SELECT * FROM ani_metrics LIMIT 10';
          } else if (question.toLowerCase().includes('project')) {
            sql = 'SELECT * FROM ani_projects LIMIT 10';
          } else if (question.toLowerCase().includes('funding')) {
            sql = 'SELECT * FROM ani_funding_programs LIMIT 10';
          } else if (question.toLowerCase().includes('patent')) {
            sql = 'SELECT * FROM ani_patent_holders LIMIT 10';
          } else {
            sql = 'SELECT * FROM ani_metrics LIMIT 5';
          }
          
          return { 
            data: { sql, warning: null }, 
            error: null 
          };
        }
        
        if (functionName === 'execute-sql') {
          // Simulate SQL execution
          const { sqlQuery } = options?.body || {};
          
          // Very basic SQL parser to extract table
          const match = sqlQuery.match(/FROM\s+([a-zA-Z_]+)/i);
          if (match && match[1]) {
            const table = match[1];
            const data = readTable(table);
            return { 
              data: { result: data.slice(0, 10) }, 
              error: null 
            };
          }
          
          return { 
            data: { result: [] }, 
            error: null 
          };
        }
        
        if (functionName === 'interpret-results') {
          // Simulate result interpretation
          return { 
            data: { response: "Here are the results of your query. The data shows trends in the selected metrics." }, 
            error: null 
          };
        }
        
        throw new Error(`Edge function ${functionName} not implemented`);
      } catch (error) {
        console.error(`Error in local database function call for ${functionName}:`, error);
        return { data: null, error: error as Error };
      }
    }
  }
};

// Create a replacement for the Supabase client that uses our local database
export const localSupabaseClient = {
  from: (table: string) => ({
    select: (cols?: string) => ({
      limit: (limit: number) => ({
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          then: (callback: Function) => {
            localDatabase.select(table, { 
              select: cols, 
              limit, 
              order: [column, { ascending }] 
            })
            .then(result => callback(result))
            .catch(error => callback({ error }));
          },
          eq: (column: string, value: any) => ({
            then: (callback: Function) => {
              localDatabase.select(table, { 
                select: cols, 
                limit, 
                order: [column, { ascending }],
                eq: [column, value]
              })
              .then(result => callback(result))
              .catch(error => callback({ error }));
            }
          }),
          data: null,
          error: null
        }),
        eq: (column: string, value: any) => ({
          then: (callback: Function) => {
            localDatabase.select(table, { 
              select: cols, 
              limit,
              eq: [column, value]
            })
            .then(result => callback(result))
            .catch(error => callback({ error }));
          }
        }),
        then: (callback: Function) => {
          localDatabase.select(table, { 
            select: cols, 
            limit 
          })
          .then(result => callback(result))
          .catch(error => callback({ error }));
        }
      }),
      eq: (column: string, value: any) => ({
        then: (callback: Function) => {
          localDatabase.select(table, { 
            select: cols,
            eq: [column, value]
          })
          .then(result => callback(result))
          .catch(error => callback({ error }));
        }
      }),
      count: (countType: string, options?: { head: boolean }) => {
        return localDatabase.select(table, { count: countType, head: options?.head });
      },
      then: (callback: Function) => {
        localDatabase.select(table, { select: cols })
          .then(result => callback(result))
          .catch(error => callback({ error }));
      }
    }),
    insert: (data: any) => ({
      then: (callback: Function) => {
        localDatabase.insert(table, data)
          .then(result => callback(result))
          .catch(error => callback({ error }));
      }
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        then: (callback: Function) => {
          // Find the item first
          localDatabase.select(table, { eq: [column, value] })
            .then(result => {
              if (result.data && result.data.length > 0) {
                const id = result.data[0].id;
                localDatabase.update(table, id, data)
                  .then(updateResult => callback(updateResult))
                  .catch(error => callback({ error }));
              } else {
                callback({ data: null, error: new Error(`No item found in ${table} where ${column} = ${value}`) });
              }
            })
            .catch(error => callback({ error }));
        }
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        then: (callback: Function) => {
          // Find the item first
          localDatabase.select(table, { eq: [column, value] })
            .then(result => {
              if (result.data && result.data.length > 0) {
                const id = result.data[0].id;
                localDatabase.delete(table, id)
                  .then(deleteResult => callback(deleteResult))
                  .catch(error => callback({ error }));
              } else {
                callback({ error: null }); // Nothing to delete
              }
            })
            .catch(error => callback({ error }));
        }
      })
    })
  }),
  rpc: (functionName: string, params: any) => ({
    then: (callback: Function) => {
      localDatabase.rpc(functionName, params)
        .then(result => callback(result))
        .catch(error => callback({ error }));
    }
  }),
  functions: {
    invoke: (functionName: string, options?: { body?: any }) => {
      return localDatabase.functions.invoke(functionName, options);
    }
  }
};

// Initialize the database when this module is imported
// Only in Node.js environment or once in browser
if (typeof window === 'undefined' || !localStorage.getItem('local_db_initialized')) {
  initializeLocalDatabase();
  if (typeof window !== 'undefined') {
    localStorage.setItem('local_db_initialized', 'true');
  }
}

// Export a mock of the supabase client
export const mockSupabase = localSupabaseClient;
