// Utility functions for interacting with the Supabase database
import { supabase } from "@/integrations/supabase/client";

// Utility function to check for errors in Supabase responses
const checkError = (response: any) => {
  if (response.error) {
    console.error('Error:', response.error);
    return response.error.message || 'An error occurred';
  }
  return null;
};

// Utility function to execute a Supabase query and handle errors
const executeQuery = async (query: Promise<any>) => {
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

// Fix duplicate checkError declarations
const checkResponseError = (response: any) => {
  if (response.error) {
    console.error('Error:', response.error);
    return response.error.message || 'An error occurred';
  }
  return null;
};

export const fetchDatabaseStatus = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('show-database-status');
    
    if (error) {
      console.error('Error fetching database status:', error);
      return { success: false, message: error.message };
    }
    
    return { success: true, data: data };
  } catch (error) {
    console.error('Unexpected error in fetchDatabaseStatus:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
