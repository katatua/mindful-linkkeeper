
/**
 * Query history utilities for storing and retrieving user queries
 */
import { supabase } from "@/integrations/supabase/client";
import { localDatabase } from "./localDatabase";

export interface StoredQuery {
  id: string;
  query_text: string;
  language: string;
  timestamp: string;
  was_successful: boolean;
  created_tables?: string[];
  error_message?: string;
}

/**
 * Save a query to history
 */
export const saveQueryToHistory = async (
  queryText: string, 
  language: 'en' | 'pt' = 'en',
  wasSuccessful: boolean = true,
  createdTables: string[] = [],
  errorMessage?: string
): Promise<StoredQuery | null> => {
  try {
    const newQuery = {
      query_text: queryText,
      language,
      timestamp: new Date().toISOString(),
      was_successful: wasSuccessful,
      created_tables: createdTables.length > 0 ? createdTables : undefined,
      error_message: errorMessage
    };

    // Try to use Supabase if connected
    try {
      // Get current user ID if authenticated
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (userId) {
        newQuery['user_id'] = userId;
      }

      console.log("Saving query to history:", newQuery);
      
      const { data, error } = await supabase
        .from('query_history')
        .insert(newQuery)
        .select('*')
        .single();

      if (error) {
        console.warn("Error saving to Supabase, using local storage:", error);
        throw error;
      }

      console.log("Successfully saved query to Supabase:", data);
      return data;
    } catch (err) {
      console.error("Falling back to local storage due to error:", err);
      // Fallback to local storage
      const localQuery = {
        id: crypto.randomUUID(),
        ...newQuery
      };
      
      // Get existing queries
      const existingQueries = localStorage.getItem('queryHistory');
      const queries = existingQueries ? JSON.parse(existingQueries) : [];
      
      // Add new query and save
      queries.push(localQuery);
      localStorage.setItem('queryHistory', JSON.stringify(queries));
      
      console.log("Saved query to local storage:", localQuery);
      return localQuery;
    }
  } catch (error) {
    console.error("Error saving query to history:", error);
    return null;
  }
};

/**
 * Check if a query is similar to existing queries that failed due to missing data
 */
export const findSimilarFailedQueries = (queryText: string): StoredQuery[] => {
  try {
    // Get stored queries from local storage
    const storedQueries = localStorage.getItem('queryHistory');
    if (!storedQueries) return [];
    
    const queries: StoredQuery[] = JSON.parse(storedQueries);
    
    // Find failed queries with similar text (simple substring match for now)
    return queries.filter(q => 
      !q.was_successful && 
      (
        queryText.toLowerCase().includes(q.query_text.toLowerCase()) ||
        q.query_text.toLowerCase().includes(queryText.toLowerCase())
      )
    );
  } catch (error) {
    console.error("Error finding similar failed queries:", error);
    return [];
  }
};

/**
 * Detect table names from a query
 */
export const detectPotentialTableNames = (queryText: string): string[] => {
  const lowercaseQuery = queryText.toLowerCase();
  
  // Common entities that might need tables
  const potentialEntities = [
    { name: 'patent', table: 'patents' },
    { name: 'funding', table: 'funding_programs' },
    { name: 'project', table: 'projects' },
    { name: 'investment', table: 'investments' },
    { name: 'institution', table: 'institutions' },
    { name: 'researcher', table: 'researchers' },
    { name: 'metric', table: 'metrics' },
    { name: 'collaboration', table: 'collaborations' },
    { name: 'publication', table: 'publications' },
    { name: 'region', table: 'regions' },
    { name: 'sector', table: 'sectors' }
  ];
  
  return potentialEntities
    .filter(entity => lowercaseQuery.includes(entity.name))
    .map(entity => entity.table);
};
