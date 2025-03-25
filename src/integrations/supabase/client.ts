
import { createClient } from '@supabase/supabase-js';

// Safely access environment variables or fallback to project defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ncnewevucbkebrqjtufl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jbmV3ZXZ1Y2JrZWJycWp0dWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NTQ4NTgsImV4cCI6MjA1NTMzMDg1OH0.k1COvdcLYSB9C-X671zop6SdV7yaTPp49A4nJXWvmmc';

// Make sure we have valid values for URL and key
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Using fallback values for development.');
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

console.log('Supabase client initialized');
