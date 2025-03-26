import { v4 as uuidv4 } from 'uuid';
import { localDatabase, getLocalDatabaseData, initializeLocalDatabase } from "@/utils/localDatabase";

// A simplified mock of the Supabase client for local development
export const mockClient = {
  isUsingLocalDb: true, // Identifier to detect mock client
  
  auth: {
    getSession: async () => {
      return {
        data: {
          session: null
        },
        error: null
      };
    },
    onAuthStateChange: (_event, _callback) => {
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Mock sign in - in a real app this would validate credentials
      console.log('Mock sign in with', email, password);
      return {
        data: {
          user: {
            id: uuidv4(),
            email,
          },
          session: {
            access_token: 'mock-token'
          }
        },
        error: null
      };
    },
    signUp: async ({ email, password }: { email: string; password: string }) => {
      console.log('Mock sign up with', email, password);
      return {
        data: {
          user: {
            id: uuidv4(),
            email,
          },
          session: null
        },
        error: null
      };
    },
    signOut: async () => {
      console.log('Mock sign out');
      return {
        error: null
      };
    }
  },
  from: (table: string) => ({
    select: (columns?: string) => {
      return {
        eq: async (column: string, value: any) => {
          const data = getLocalDatabaseData(table);
          const filtered = data.filter(row => row[column] === value);
          return { data: filtered, error: null };
        },
        neq: async (column: string, value: any) => {
          const data = getLocalDatabaseData(table);
          const filtered = data.filter(row => row[column] !== value);
          return { data: filtered, error: null };
        },
        then: (callback: any) => {
          const data = getLocalDatabaseData(table);
          return Promise.resolve({ data, error: null }).then(callback);
        },
        limit: (count: number) => {
          const data = getLocalDatabaseData(table).slice(0, count);
          return {
            then: (callback: any) => {
              return Promise.resolve({ data, error: null }).then(callback);
            }
          };
        },
        order: (column: string, { ascending = true }: { ascending: boolean }) => {
          const data = [...getLocalDatabaseData(table)].sort((a, b) => {
            if (ascending) {
              return a[column] > b[column] ? 1 : -1;
            } else {
              return a[column] < b[column] ? 1 : -1;
            }
          });
          return {
            then: (callback: any) => {
              return Promise.resolve({ data, error: null }).then(callback);
            },
            limit: (count: number) => {
              const limitedData = data.slice(0, count);
              return {
                then: (callback: any) => {
                  return Promise.resolve({ data: limitedData, error: null }).then(callback);
                }
              };
            }
          };
        }
      };
    },
    insert: (data: any) => {
      return {
        then: (callback: any) => {
          // If data is an array, insert all items
          if (Array.isArray(data)) {
            const results = data.map(item => localDatabase.insert(table, item));
            return Promise.resolve({ data: results, error: null }).then(callback);
          }
          
          // Otherwise insert single item
          const result = localDatabase.insert(table, data);
          return Promise.resolve({ data: result, error: null }).then(callback);
        },
        select: () => {
          return {
            then: (callback: any) => {
              // If data is an array, insert all items
              if (Array.isArray(data)) {
                const results = data.map(item => localDatabase.insert(table, item));
                return Promise.resolve({ data: results, error: null }).then(callback);
              }
              
              // Otherwise insert single item
              const result = localDatabase.insert(table, data);
              return Promise.resolve({ data: result, error: null }).then(callback);
            }
          };
        }
      };
    },
    delete: () => {
      return {
        neq: async (column: string, value: any) => {
          try {
            // Get current data
            const dbJson = localStorage.getItem('localDatabase');
            if (!dbJson) return { data: null, error: null };
            
            const db = JSON.parse(dbJson);
            
            // Filter out records that don't match the condition
            if (db[table]) {
              db[table] = db[table].filter((row: any) => row[column] === value);
              localStorage.setItem('localDatabase', JSON.stringify(db));
            }
            
            return { data: null, error: null };
          } catch (error) {
            console.error('Error deleting from mock database:', error);
            return { 
              data: null, 
              error: { message: error instanceof Error ? error.message : 'Unknown error' } 
            };
          }
        },
        then: (callback: any) => {
          try {
            // Clear the table
            const dbJson = localStorage.getItem('localDatabase');
            if (!dbJson) return Promise.resolve({ data: null, error: null }).then(callback);
            
            const db = JSON.parse(dbJson);
            if (db[table]) {
              db[table] = [];
              localStorage.setItem('localDatabase', JSON.stringify(db));
            }
            
            return Promise.resolve({ data: null, error: null }).then(callback);
          } catch (error) {
            console.error('Error clearing table in mock database:', error);
            return Promise.resolve({ 
              data: null, 
              error: { message: error instanceof Error ? error.message : 'Unknown error' } 
            }).then(callback);
          }
        }
      };
    }
  }),
  functions: {
    invoke: (functionName: string, { body }: { body: any }) => {
      // Mock function to handle generate-synthetic-data
      if (functionName === 'generate-synthetic-data') {
        const { tableName, count } = body;
        console.log(`Mock generate-synthetic-data function called for table ${tableName}`);
        
        // This won't generate data - we'll handle it in the populateDatabase function
        return Promise.resolve({
          data: { 
            message: `Successfully generated and inserted synthetic records into ${tableName}`,
            count: count,
            success: true 
          },
          error: null
        });
      }
      
      // Simulate execute-sql function behavior
      if (functionName === 'execute-sql') {
        const { sqlQuery } = body;
        console.log('Mock execute-sql function called with:', sqlQuery);
        
        // For metrics or funding-related queries, return some sample data
        if (sqlQuery.toLowerCase().includes('metrics') || 
            sqlQuery.toLowerCase().includes('funding') ||
            sqlQuery.toLowerCase().includes('investment')) {
          return Promise.resolve({
            data: {
              result: [
                { year: 2023, value: 1200000, unit: "EUR", category: "Investment" },
                { year: 2022, value: 980000, unit: "EUR", category: "Investment" },
                { year: 2021, value: 870000, unit: "EUR", category: "Investment" }
              ]
            },
            error: null
          });
        }
        
        // For project-related queries
        if (sqlQuery.toLowerCase().includes('project')) {
          return Promise.resolve({
            data: {
              result: [
                { title: "AI Healthcare Project", status: "active", funding_amount: 350000 },
                { title: "Smart Grid Research", status: "completed", funding_amount: 275000 },
                { title: "Sustainable Materials Development", status: "active", funding_amount: 420000 }
              ]
            },
            error: null
          });
        }
        
        // Default fallback
        return Promise.resolve({
          data: { result: [] },
          error: null
        });
      }
      
      if (functionName === 'generate-sql') {
        const { question } = body;
        console.log('Mock generate-sql function called with:', question);
        
        // Generate a reasonable SQL query based on the question
        let sql = "";
        
        if (question.toLowerCase().includes('investment') || 
            question.toLowerCase().includes('funding')) {
          sql = `SELECT EXTRACT(YEAR FROM measurement_date) as year, 
                 SUM(value) as value, unit 
                 FROM ani_metrics 
                 WHERE category = 'Investment' 
                 GROUP BY year, unit 
                 ORDER BY year DESC`;
        } 
        else if (question.toLowerCase().includes('project')) {
          sql = `SELECT title, status, funding_amount 
                 FROM ani_projects 
                 ORDER BY funding_amount DESC 
                 LIMIT 10`;
        }
        else {
          sql = `SELECT * FROM ani_metrics LIMIT 5`;
        }
        
        return Promise.resolve({
          data: { sql },
          error: null
        });
      }
      
      // Mock show-database-status
      if (functionName === 'show-database-status') {
        // Return mock status data
        const dbJson = localStorage.getItem('localDatabase');
        if (!dbJson) {
          return Promise.resolve({
            data: { 
              statusRecords: [],
              success: true 
            },
            error: null
          });
        }
        
        const db = JSON.parse(dbJson);
        const statusRecords = db['ani_database_status'] || [];
        
        return Promise.resolve({
          data: { 
            statusRecords,
            success: true 
          },
          error: null
        });
      }
      
      // Default mock response
      return Promise.resolve({
        data: null,
        error: { message: `Mock function ${functionName} not implemented` }
      });
    }
  }
};
