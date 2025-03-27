
-- Migration to create the query_history table
CREATE TABLE IF NOT EXISTS public.query_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  was_successful BOOLEAN NOT NULL DEFAULT true,
  created_tables TEXT[],
  error_message TEXT,
  user_id UUID REFERENCES auth.users(id)
);

-- Add an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_query_history_timestamp ON public.query_history(timestamp DESC);

-- Everyone can view query history
ALTER TABLE public.query_history ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all users to select from query history
CREATE POLICY "Everyone can view query history" ON public.query_history
  FOR SELECT USING (true);

-- Create a policy to allow authenticated users to insert their own query history
CREATE POLICY "Authenticated users can insert query history" ON public.query_history
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create a policy to allow anyone to insert query history (for unauthenticated users)
CREATE POLICY "Anyone can insert query history" ON public.query_history
  FOR INSERT
  WITH CHECK (user_id IS NULL);

-- Update ani_database_status function to track created tables
CREATE OR REPLACE FUNCTION public.track_dynamic_table_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Update ani_database_status with the new table information
  INSERT INTO public.ani_database_status (table_name, record_count, status, last_populated)
  VALUES (TG_TABLE_NAME, 0, 'empty', NOW())
  ON CONFLICT (table_name)
  DO UPDATE SET
    last_populated = NOW(),
    updated_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
