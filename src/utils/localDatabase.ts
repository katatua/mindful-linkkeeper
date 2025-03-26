
/**
 * Local database implementation for development and testing
 * This file provides a mock implementation of the Supabase client
 * with file-based storage for simulating a database
 */

import { toast } from "sonner";

type MockData = Record<string, any[]>;

// Initial in-memory database with all tables
const localData: MockData = {
  ani_funding_applications: [],
  ani_funding_programs: [],
  ani_institutions: [],
  ani_international_collaborations: [],
  ani_metrics: [],
  ani_patent_holders: [],
  ani_policy_frameworks: [],
  ani_projects: [],
  ani_projects_researchers: [],
  ani_researchers: [],
  campaign_events: [],
  campaign_simulations: [],
  campaigns: [],
  content_variations: [],
  deployments: [],
  document_notes: [],
  esp_providers: [],
  generated_content: [],
  generated_images: [],
  images: [],
  links: [],
  list_personalization_rules: [],
  model_metrics: [],
  model_versions: [],
  models: [],
  newsletter_templates: [],
  newsletters: [],
  notes: [],
  pdf_extracted_elements: [],
  pdf_extractions: [],
  pdf_reports: [
    {
      id: 'report-1',
      report_title: 'Sample PDF Report',
      report_content: '<h2>Executive Summary</h2><p>This is a sample report generated for testing.</p>',
      created_at: new Date().toISOString(),
      pdf_extraction_id: 'extraction-1'
    }
  ],
  personalization_rules: [],
  subscriber_list_members: [],
  subscriber_lists: [],
  subscriber_segments: [],
  subscriber_tags: [],
  subscribers: [],
  synthetic_datasets: [],
  synthetic_samples: [],
  tasks: [],
  template_lists: [],
  ani_database_status: [{ status: 'connected', last_checked: new Date().toISOString() }]
};

// Sample user for authentication simulation
const sampleUser = {
  id: 'user-1',
  email: 'sample@example.com',
  user_metadata: { name: 'Sample User' },
  app_metadata: { role: 'authenticated' },
  aud: 'authenticated',
  created_at: new Date().toISOString()
};

// Mock session for auth simulation
const mockSession = {
  user: sampleUser,
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_at: Date.now() + 3600000,
};

// Current auth state
let currentUser: typeof sampleUser | null = sampleUser;
let currentSession: typeof mockSession | null = mockSession;

// Type for query response
interface QueryResponse<T> {
  data: T | null;
  error: Error | null;
  count?: number;
}

// Function to create a Promise that resolves to a QueryResponse
const createQueryPromise = <T>(data: T | null, error: Error | null = null, count?: number): Promise<QueryResponse<T>> => {
  return Promise.resolve({ data, error, count });
};

// Helper to simulate delayed response
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Supabase client implementation
export const mockSupabase = {
  from: (table: string) => {
    // Ensure table exists in local data
    if (!localData[table]) {
      localData[table] = [];
    }

    // Initialize query state
    let selectedData = [...localData[table]];
    let selectedColumns: string[] | undefined = undefined;
    let filterConditions: { column: string; value: any; operator: string }[] = [];
    let limitValue: number | undefined = undefined;
    let orderByColumn: string | undefined = undefined;
    let orderDirection: 'asc' | 'desc' = 'asc';
    
    return {
      select: (cols?: string) => {
        if (cols) {
          selectedColumns = cols.split(',').map(col => col.trim());
        }
        
        return {
          limit: (limit: number) => {
            limitValue = limit;
            
            return {
              order: (column: string, options?: { ascending: boolean }) => {
                orderByColumn = column;
                orderDirection = options?.ascending === false ? 'desc' : 'asc';
                
                return {
                  eq: (column: string, value: any) => {
                    filterConditions.push({ column, value, operator: 'eq' });

                    // Execute the query and return results
                    const result = executeLocalQuery(
                      table, 
                      selectedData,
                      selectedColumns,
                      filterConditions,
                      limitValue,
                      orderByColumn,
                      orderDirection
                    );

                    return createQueryPromise(result);
                  },
                  neq: (column: string, value: any) => {
                    filterConditions.push({ column, value, operator: 'neq' });

                    // Execute the query and return results
                    const result = executeLocalQuery(
                      table, 
                      selectedData,
                      selectedColumns,
                      filterConditions,
                      limitValue,
                      orderByColumn,
                      orderDirection
                    );

                    return createQueryPromise(result);
                  },
                  single: () => {
                    // Execute the query and return a single result
                    const results = executeLocalQuery(
                      table, 
                      selectedData,
                      selectedColumns,
                      filterConditions,
                      1, // Limit to 1 result
                      orderByColumn,
                      orderDirection
                    );
                    
                    const result = results.length > 0 ? results[0] : null;
                    const error = results.length === 0 
                      ? new Error(`No rows found in ${table}`)
                      : results.length > 1 
                      ? new Error(`Multiple rows found in ${table}`)
                      : null;
                      
                    return createQueryPromise(result, error);
                  },
                  then: (callback: Function) => {
                    // Execute query and pass results to callback
                    const results = executeLocalQuery(
                      table, 
                      selectedData,
                      selectedColumns,
                      filterConditions,
                      limitValue,
                      orderByColumn,
                      orderDirection
                    );
                    callback({ data: results, error: null });
                  },
                  data: executeLocalQuery(
                    table, 
                    selectedData,
                    selectedColumns,
                    filterConditions,
                    limitValue,
                    orderByColumn,
                    orderDirection
                  ),
                  error: null
                };
              },
              eq: (column: string, value: any) => {
                filterConditions.push({ column, value, operator: 'eq' });
                
                return {
                  single: () => {
                    // Execute the query and return a single result
                    const results = executeLocalQuery(
                      table, 
                      selectedData,
                      selectedColumns,
                      filterConditions,
                      1, // Limit to 1
                      orderByColumn,
                      orderDirection
                    );
                    
                    const result = results.length > 0 ? results[0] : null;
                    const error = results.length === 0 
                      ? new Error(`No rows found in ${table}`)
                      : results.length > 1 
                      ? new Error(`Multiple rows found in ${table}`)
                      : null;
                      
                    return createQueryPromise(result, error);
                  },
                  then: (callback: Function) => {
                    // Execute query and pass results to callback
                    const results = executeLocalQuery(
                      table, 
                      selectedData,
                      selectedColumns,
                      filterConditions,
                      limitValue,
                      orderByColumn,
                      orderDirection
                    );
                    callback({ data: results, error: null });
                  }
                };
              },
              then: (callback: Function) => {
                // Execute query and pass results to callback
                const results = executeLocalQuery(
                  table, 
                  selectedData,
                  selectedColumns,
                  filterConditions,
                  limitValue,
                  orderByColumn,
                  orderDirection
                );
                callback({ data: results, error: null });
              }
            };
          },
          eq: (column: string, value: any) => {
            filterConditions.push({ column, value, operator: 'eq' });
            
            return {
              single: () => {
                // Execute the query and return a single result
                const results = executeLocalQuery(
                  table, 
                  selectedData,
                  selectedColumns,
                  filterConditions,
                  1, // Limit to 1
                  orderByColumn,
                  orderDirection
                );
                
                const result = results.length > 0 ? results[0] : null;
                const error = results.length === 0 
                  ? new Error(`No rows found in ${table}`)
                  : results.length > 1 
                  ? new Error(`Multiple rows found in ${table}`)
                  : null;
                  
                return createQueryPromise(result, error);
              },
              order: (column: string, options?: { ascending: boolean }) => {
                orderByColumn = column;
                orderDirection = options?.ascending === false ? 'desc' : 'asc';
                
                return {
                  then: (callback: Function) => {
                    // Execute query and pass results to callback
                    const results = executeLocalQuery(
                      table, 
                      selectedData,
                      selectedColumns,
                      filterConditions,
                      limitValue,
                      orderByColumn,
                      orderDirection
                    );
                    callback({ data: results, error: null });
                  }
                };
              },
              then: (callback: Function) => {
                // Execute query and pass results to callback
                const results = executeLocalQuery(
                  table, 
                  selectedData,
                  selectedColumns,
                  filterConditions,
                  limitValue,
                  orderByColumn,
                  orderDirection
                );
                callback({ data: results, error: null });
              }
            };
          },
          single: () => {
            // Return a promise for a single record
            return createQueryPromise(
              localData[table].length > 0 ? localData[table][0] : null,
              localData[table].length === 0 
                ? new Error(`No rows found in ${table}`) 
                : localData[table].length > 1 
                ? new Error(`Multiple rows found in ${table}`)
                : null
            );
          },
          order: (column: string, options?: { ascending: boolean }) => {
            orderByColumn = column;
            orderDirection = options?.ascending === false ? 'desc' : 'asc';
            
            return {
              limit: (limit: number) => {
                limitValue = limit;
                
                return {
                  then: (callback: Function) => {
                    // Execute query and pass results to callback
                    const results = executeLocalQuery(
                      table, 
                      selectedData,
                      selectedColumns,
                      filterConditions,
                      limitValue,
                      orderByColumn,
                      orderDirection
                    );
                    callback({ data: results, error: null });
                  }
                };
              },
              then: (callback: Function) => {
                // Execute query and pass results to callback
                const results = executeLocalQuery(
                  table, 
                  selectedData,
                  selectedColumns,
                  filterConditions,
                  limitValue,
                  orderByColumn,
                  orderDirection
                );
                callback({ data: results, error: null });
              }
            };
          },
          then: (callback: Function) => {
            // Execute query and pass results to callback
            const results = executeLocalQuery(
              table, 
              selectedData,
              selectedColumns,
              filterConditions,
              limitValue,
              orderByColumn,
              orderDirection
            );
            callback({ data: results, error: null });
          }
        };
      },
      insert: (data: any) => {
        // Add ID if not present
        const newItem = {
          id: data.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          created_at: data.created_at || new Date().toISOString(),
          ...data
        };
        
        localData[table].push(newItem);
        console.log(`Inserted data into ${table}:`, newItem);
        
        return createQueryPromise(newItem);
      },
      update: (data: any) => {
        // Find and update item
        const index = localData[table].findIndex(item => item.id === data.id);
        
        if (index !== -1) {
          localData[table][index] = {
            ...localData[table][index],
            ...data,
            updated_at: new Date().toISOString()
          };
          console.log(`Updated data in ${table}:`, localData[table][index]);
          return createQueryPromise(localData[table][index]);
        }
        
        return createQueryPromise(null, new Error(`Item with ID ${data.id} not found in ${table}`));
      },
      delete: () => {
        // Delete based on filters
        return {
          eq: (column: string, value: any) => {
            const beforeCount = localData[table].length;
            localData[table] = localData[table].filter(item => item[column] !== value);
            const deletedCount = beforeCount - localData[table].length;
            
            console.log(`Deleted ${deletedCount} items from ${table} where ${column} = ${value}`);
            return createQueryPromise({ count: deletedCount });
          }
        };
      },
      count: (column: string = 'id', { head = false }: { head?: boolean } = {}) => {
        const count = localData[table].length;
        return createQueryPromise({ count }, null, count);
      }
    };
  },
  // Mock auth functions
  auth: {
    getUser: async () => {
      return { data: { user: currentUser }, error: null };
    },
    getSession: async () => {
      return { data: { session: currentSession }, error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simulate auth state change
      callback('SIGNED_IN', currentSession);
      
      // Return mock subscription
      return {
        data: {
          subscription: {
            unsubscribe: () => console.log('Unsubscribed from auth state change')
          }
        }
      };
    },
    signUp: async ({ email, password }: { email: string; password: string }) => {
      await delay(500); // Simulate network delay
      
      if (!email || !password) {
        return { error: new Error('Email and password are required'), data: null };
      }
      
      currentUser = {
        ...sampleUser,
        email,
        id: `user-${Date.now()}`
      };
      
      currentSession = {
        ...mockSession,
        user: currentUser,
        expires_at: Date.now() + 3600000
      };
      
      console.log('User signed up:', currentUser);
      return { data: { user: currentUser, session: currentSession }, error: null };
    },
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      await delay(500); // Simulate network delay
      
      if (email === 'error@example.com') {
        return { error: new Error('Authentication failed'), data: null };
      }
      
      currentUser = {
        ...sampleUser,
        email,
        id: `user-${Date.now()}`
      };
      
      currentSession = {
        ...mockSession,
        user: currentUser,
        expires_at: Date.now() + 3600000
      };
      
      console.log('User signed in:', currentUser);
      return { data: { user: currentUser, session: currentSession }, error: null };
    },
    signOut: async () => {
      currentUser = null;
      currentSession = null;
      console.log('User signed out');
      return { error: null };
    }
  },
  // Mock storage functions
  storage: {
    from: (bucket: string) => {
      return {
        upload: async (path: string, file: File) => {
          console.log(`Uploading ${file.name} to ${bucket}/${path}`);
          return { data: { path }, error: null };
        },
        download: async (path: string) => {
          console.log(`Downloading from ${bucket}/${path}`);
          return { data: new Blob(['Mock file content']), error: null };
        },
        getPublicUrl: (path: string) => {
          return { data: { publicUrl: `https://example.com/storage/${bucket}/${path}` } };
        },
        remove: async (paths: string[]) => {
          console.log(`Removing files from ${bucket}:`, paths);
          return { data: { count: paths.length }, error: null };
        }
      };
    }
  },
  // Mock RPC function
  rpc: (functionName: string, params?: any) => {
    console.log(`Calling RPC function: ${functionName}`, params);
    return createQueryPromise({ success: true, result: "RPC call simulated" });
  },
  // Mock functions API
  functions: {
    invoke: async (functionName: string, options?: { body?: any }) => {
      console.log(`Invoking function: ${functionName}`, options?.body);
      
      // Simulate common function responses
      if (functionName === 'classify-document') {
        return { data: { classification: 'document' }, error: null };
      }
      
      if (functionName === 'claude-chat' || functionName === 'gemini-chat') {
        return { 
          data: { 
            response: `This is a mock AI response to: ${options?.body?.userMessage || 'your query'}`,
            thinking: options?.body?.thinkingEnabled ? 'Thinking about the response...' : undefined
          }, 
          error: null 
        };
      }
      
      if (functionName === 'generate-sql') {
        return { 
          data: { 
            sql: 'SELECT * FROM sample_table LIMIT 10;',
            warning: 'This is a mock SQL generation'
          }, 
          error: null 
        };
      }
      
      if (functionName === 'execute-sql') {
        return { 
          data: { 
            result: [{ id: 1, name: 'Sample data' }],
            message: 'Query executed successfully',
            affectedRows: 1
          }, 
          error: null 
        };
      }
      
      if (functionName === 'pdf-extractor') {
        return {
          data: {
            extraction: {
              id: `extraction-${Date.now()}`,
              content: "Extracted content from PDF",
              elements: [{ type: "text", content: "Sample text" }]
            },
            report: {
              id: `report-${Date.now()}`,
              title: "Generated Report",
              summary: "Report summary"
            }
          },
          error: null
        };
      }
      
      // Default response
      return { 
        data: { message: 'Function executed successfully (mock)' }, 
        error: null 
      };
    }
  }
};

// Utility function to execute queries locally
function executeLocalQuery(
  table: string,
  data: any[],
  columns?: string[],
  filters?: { column: string; value: any; operator: string }[],
  limit?: number,
  orderBy?: string,
  orderDir: 'asc' | 'desc' = 'asc'
): any[] {
  // Start with all data for the table
  let result = [...data];
  
  // Apply filters
  if (filters && filters.length > 0) {
    result = result.filter(item => {
      return filters.every(filter => {
        if (filter.operator === 'eq') {
          return item[filter.column] === filter.value;
        } else if (filter.operator === 'neq') {
          return item[filter.column] !== filter.value;
        }
        return true;
      });
    });
  }
  
  // Apply sorting
  if (orderBy) {
    result.sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      
      if (aValue < bValue) return orderDir === 'asc' ? -1 : 1;
      if (aValue > bValue) return orderDir === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  // Apply limit
  if (limit && limit > 0) {
    result = result.slice(0, limit);
  }
  
  // Apply column selection
  if (columns && columns.length > 0) {
    result = result.map(item => {
      const newItem: Record<string, any> = {};
      columns.forEach(col => {
        if (col === '*') {
          Object.assign(newItem, item);
        } else {
          newItem[col] = item[col];
        }
      });
      return newItem;
    });
  }
  
  return result;
}

// Export the database instance for direct manipulation
export const localDatabase = {
  data: localData,
  reset: () => {
    Object.keys(localData).forEach(table => {
      localData[table] = [];
    });
    console.log('Local database reset');
  },
  seed: (data: MockData) => {
    Object.keys(data).forEach(table => {
      localData[table] = [...data[table]];
    });
    console.log('Local database seeded with data');
  },
  getTables: () => Object.keys(localData),
  getTableData: (table: string) => localData[table] || [],
  select: (table: string) => {
    return {
      data: localData[table] || [],
      error: null
    };
  }
};

// This is the missing function that needs to be implemented
export const initializeLocalDatabase = () => {
  try {
    // Reset any existing data
    localDatabase.reset();
    
    // Seed with some initial data for testing
    localDatabase.seed({
      ani_database_status: [
        { 
          id: 'status-1', 
          status: 'connected', 
          last_checked: new Date().toISOString(), 
          version: '1.0.0' 
        }
      ],
      ani_funding_programs: [
        {
          id: 'program-1',
          name: 'Innovation Fund 2023',
          description: 'Funding for innovative tech projects',
          budget_allocated: 5000000,
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          sector_focus: ['Digital Tech', 'Healthcare', 'Energy'],
          created_at: new Date().toISOString()
        },
        {
          id: 'program-2',
          name: 'Research Grant 2023',
          description: 'Support for academic research',
          budget_allocated: 3000000,
          start_date: '2023-03-01',
          end_date: '2024-02-28',
          sector_focus: ['Academia', 'Science', 'Healthcare'],
          created_at: new Date().toISOString()
        }
      ],
      ani_funding_applications: [
        {
          id: 'app-1',
          program_id: 'program-1',
          applicant_id: 'researcher-1',
          project_title: 'AI in Healthcare',
          requested_amount: 250000,
          status: 'approved',
          submission_date: '2023-02-15',
          decision_date: '2023-04-10',
          created_at: new Date().toISOString()
        }
      ],
      ani_researchers: [
        {
          id: 'researcher-1',
          name: 'Dr. Maria Silva',
          institution_id: 'inst-1',
          research_areas: ['AI', 'Healthcare'],
          email: 'maria.silva@example.com',
          created_at: new Date().toISOString()
        }
      ],
      ani_institutions: [
        {
          id: 'inst-1',
          name: 'University of Lisbon',
          type: 'academic',
          region: 'Lisboa',
          website: 'www.ulisboa.pt',
          created_at: new Date().toISOString()
        }
      ],
      pdf_reports: [
        {
          id: 'report-1',
          report_title: 'Innovation Funding Trends 2023',
          report_content: '<h1>Innovation Funding Trends 2023</h1><p>This report analyzes the distribution of innovation funding across various sectors in Portugal during 2023.</p><h2>Key Findings</h2><ul><li>Digital technology received the highest allocation</li><li>Healthcare projects saw a 25% increase in funding</li><li>Regional distribution showed balance across the country</li></ul>',
          created_at: new Date().toISOString(),
          pdf_extraction_id: 'extraction-1'
        }
      ]
    });
    
    console.log('Local database initialized successfully');
    toast.success('Local database initialized', {
      description: 'Sample data has been loaded'
    });
    
    return true;
  } catch (error) {
    console.error('Error initializing local database:', error);
    toast.error('Database initialization failed', {
      description: error instanceof Error ? error.message : 'Unknown error occurred'
    });
    
    return false;
  }
};
