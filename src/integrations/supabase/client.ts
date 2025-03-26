
import { createClient } from '@supabase/supabase-js';
import { mockClient } from './mockClient';

// Check if we're in a development environment
const isDevelopment = import.meta.env.DEV;

// Use a local database for development if the Supabase URL is not provided
const useLocalDatabase = isDevelopment && !import.meta.env.VITE_SUPABASE_URL;

// Create the Supabase client
let supabaseClient;

if (useLocalDatabase) {
  console.log('Using local mock database');
  supabaseClient = mockClient;
} else {
  // Use the actual Supabase client
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      'Supabase credentials not provided. Using mock client. ' +
      'To use a real Supabase instance, provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
    );
    supabaseClient = mockClient;
  } else {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
}

// Enhance the client to make it more Promise-friendly
const enhancedClient = {
  ...supabaseClient,
  from: (table: string) => {
    const originalFrom = supabaseClient.from(table);
    return {
      ...originalFrom,
      select: (columns?: string) => {
        const originalSelect = originalFrom.select(columns);
        
        // Replace then-based methods with proper Promise-based methods
        return {
          ...originalSelect,
          eq: (column: string, value: any) => {
            const query = originalSelect.eq(column, value);
            // Ensure it returns a Promise
            if (typeof query.then === 'function') {
              return Promise.resolve(query);
            }
            return Promise.resolve(query);
          },
          neq: (column: string, value: any) => {
            const query = originalSelect.neq ? originalSelect.neq(column, value) : originalSelect;
            // Ensure it returns a Promise
            if (typeof query.then === 'function') {
              return Promise.resolve(query);
            }
            return Promise.resolve(query);
          },
          order: (column: string, options: { ascending: boolean }) => {
            const query = originalSelect.order(column, options);
            return {
              ...query,
              limit: (limit: number) => {
                const limitQuery = query.limit(limit);
                return Promise.resolve(limitQuery);
              }
            };
          },
          limit: (limit: number) => {
            const query = originalSelect.limit(limit);
            return {
              ...query,
              order: (column: string, options: { ascending: boolean }) => {
                const orderQuery = query.order(column, options);
                return Promise.resolve(orderQuery);
              }
            };
          },
          single: () => {
            const query = originalSelect.single ? originalSelect.single() : originalSelect;
            return Promise.resolve(query);
          },
          maybeSingle: () => {
            const query = originalSelect.maybeSingle ? originalSelect.maybeSingle() : originalSelect;
            return Promise.resolve(query);
          }
        };
      },
      count: (options?: { exact?: boolean }) => {
        return Promise.resolve(originalFrom.count(options));
      }
    };
  }
};

export const supabase = enhancedClient;
