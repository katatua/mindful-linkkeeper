
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const SUPABASE_URL = "https://ncnewevucbkebrqjtufl.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jbmV3ZXZ1Y2JrZWJycWp0dWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NTQ4NTgsImV4cCI6MjA1NTMzMDg1OH0.k1COvdcLYSB9C-X671zop6SdV7yaTPp49A4nJXWvmmc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
