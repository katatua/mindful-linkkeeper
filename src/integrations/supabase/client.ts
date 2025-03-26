
// This file now uses the local database instead of the actual Supabase client

import { mockSupabase } from '@/utils/localDatabase';
import type { Database } from './types';

export const SUPABASE_URL = "https://tujvvuqhvjicbcqzmcwq.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1anZ2dXFodmppY2JjcXptY3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTc2MjYsImV4cCI6MjA1ODU3MzYyNn0.JByr4xw9fd6vnZ59Y4MKR07a3MGFqsSJJYSJa2iIWAI";
export const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1anZ2dXFodmppY2JjcXptY3dxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mjk5NzYyNiwiZXhwIjoyMDU4NTczNjI2fQ.3YK8QgsQhLJILWL0_k5TgGsfH2dcwXQwKhOcD8o_exw";

// Instead of using the actual Supabase client, we use our mock implementation
export const supabase = mockSupabase;

// Service client with admin privileges - for consistency, also use the mock
export const supabaseAdmin = mockSupabase;
