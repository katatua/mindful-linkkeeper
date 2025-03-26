
// Mock Supabase client for local development
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Type definitions for responses
export interface QueryResponse<T> {
  data: T | null;
  error: Error | null;
  count?: number;
}

export interface FunctionInvokeResponse {
  data?: {
    success?: boolean;
    data?: any[];
    message?: string;
    result?: any[];
    response?: string;
    sql?: string;
    warning?: string;
    affectedRows?: number;
    extraction?: {
      id: string;
      content: string;
      extracted_text: string;
      extracted_numbers: any[];
      extracted_images: any[];
      elements: { type: string; content: string }[];
    };
    report?: {
      id: string;
      report_title: string;
      title: string;
      summary: string;
    };
  };
  error: Error | null;
}

// Create a local mock of the Supabase client
export const createMockSupabaseClient = () => {
  return {
    from: (table: string) => ({
      select: (cols?: string) => ({
        eq: (column: string, value: any): Promise<QueryResponse<any>> => 
          Promise.resolve({ data: [], error: null }),
        neq: (column: string, value: any): Promise<QueryResponse<any>> => 
          Promise.resolve({ data: [], error: null }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          limit: (limit: number) => ({
            data: [],
            error: null
          })
        }),
        limit: (limit: number) => ({
          order: (column: string, { ascending }: { ascending: boolean }) => ({
            data: [],
            error: null
          }),
          data: [],
          error: null
        }),
        single: (): Promise<QueryResponse<any>> => 
          Promise.resolve({ data: null, error: null }),
        maybeSingle: (): Promise<QueryResponse<any>> => 
          Promise.resolve({ data: null, error: null })
      }),
      insert: (data: any): Promise<QueryResponse<any>> => 
        Promise.resolve({ data: { id: uuidv4(), ...data }, error: null }),
      update: (data: any): Promise<QueryResponse<any>> => 
        Promise.resolve({ data, error: null }),
      delete: (): Promise<QueryResponse<any>> => 
        Promise.resolve({ data: null, error: null }),
      count: (options?: { exact?: boolean }): Promise<QueryResponse<{ count: number }>> => 
        Promise.resolve({ data: { count: 0 }, error: null }),
    }),
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, data: any, options?: any): Promise<QueryResponse<any>> => 
          Promise.resolve({ data: { path }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: `https://example.com/${path}` } }),
        remove: (paths: string[]): Promise<QueryResponse<any>> => 
          Promise.resolve({ data: { paths }, error: null })
      })
    },
    auth: {
      getSession: () => Promise.resolve({
        data: {
          session: {
            user: {
              id: 'mock-user-id',
              email: 'test@example.com',
              user_metadata: { name: 'Test User' },
              app_metadata: { role: 'user' },
              aud: 'authenticated',
              created_at: new Date().toISOString()
            },
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_at: new Date().getTime() + 3600000
          }
        },
        error: null
      }),
      getUser: () => Promise.resolve({
        data: {
          user: {
            id: 'mock-user-id',
            email: 'test@example.com',
            user_metadata: { name: 'Test User' },
            app_metadata: { role: 'user' },
            aud: 'authenticated',
            created_at: new Date().toISOString()
          }
        },
        error: null
      }),
      signUp: (credentials: { email: string; password: string }) => Promise.resolve({
        data: {
          user: {
            id: 'mock-user-id',
            email: credentials.email,
            app_metadata: {},
            user_metadata: {}
          },
          session: null
        },
        error: null
      }),
      signInWithPassword: (credentials: { email: string; password: string }) => Promise.resolve({
        data: {
          user: {
            id: 'mock-user-id',
            email: credentials.email,
            user_metadata: { name: 'Test User' },
            app_metadata: { role: 'user' },
            aud: 'authenticated',
            created_at: new Date().toISOString()
          },
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_at: new Date().getTime() + 3600000
          }
        },
        error: null
      }),
      signOut: () => Promise.resolve({ error: null })
    },
    functions: {
      invoke: (name: string, options?: { body?: any }): Promise<FunctionInvokeResponse> => {
        // Mock different responses for different function calls
        if (name === 'show-database-status') {
          return Promise.resolve({
            data: {
              success: true,
              data: [
                { 
                  id: '1',
                  table_name: 'ani_metrics',
                  record_count: 150,
                  status: 'populated',
                  last_populated: new Date().toISOString(),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                },
                {
                  id: '2',
                  table_name: 'ani_projects',
                  record_count: 35,
                  status: 'populated',
                  last_populated: new Date().toISOString(),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ],
              message: 'Database status retrieved successfully'
            },
            error: null
          });
        } else if (name === 'pdf-extractor') {
          return Promise.resolve({
            data: {
              extraction: {
                id: 'mock-extraction-id',
                content: 'PDF Content',
                extracted_text: 'Sample extracted text',
                extracted_numbers: [42, 123, 456],
                extracted_images: [{ url: 'image1.jpg' }, { url: 'image2.jpg' }],
                elements: [
                  { type: 'text', content: 'Text element' },
                  { type: 'image', content: 'image.jpg' }
                ]
              },
              report: {
                id: 'mock-report-id',
                report_title: 'Extracted Report',
                title: 'Report Title',
                summary: 'Report Summary'
              }
            },
            error: null
          });
        } else if (name === 'execute-sql') {
          return Promise.resolve({
            data: {
              result: [{ count: 10, table: 'test_table' }],
              affectedRows: 1,
              message: 'Query executed successfully'
            },
            error: null
          });
        } else if (name === 'generate-sql') {
          return Promise.resolve({
            data: {
              sql: 'SELECT * FROM ani_metrics LIMIT 10',
              warning: 'This is a mock SQL query'
            },
            error: null
          });
        } else {
          // Generic response for other function calls
          return Promise.resolve({
            data: {
              response: 'Mock response for ' + name
            },
            error: null
          });
        }
      }
    }
  };
};

// Creates a mock Supabase client for development
export const mockClient = createMockSupabaseClient();
