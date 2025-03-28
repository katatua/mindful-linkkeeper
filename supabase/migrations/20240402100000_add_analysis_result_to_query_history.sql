
-- Add analysis_result column to query_history table
ALTER TABLE public.query_history ADD COLUMN IF NOT EXISTS analysis_result JSONB DEFAULT NULL;

-- Create a function to get database tables
CREATE OR REPLACE FUNCTION public.get_database_tables()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'table_name', table_name,
          'columns', columns
        )
      )
    FROM (
      SELECT 
        table_name,
        jsonb_agg(
          jsonb_build_object(
            'column_name', column_name,
            'data_type', data_type,
            'is_nullable', is_nullable
          )
        ) as columns
      FROM 
        information_schema.columns
      WHERE 
        table_schema = 'public' 
        AND table_name LIKE 'ani_%' 
      GROUP BY 
        table_name
      ORDER BY 
        table_name
    ) t
  );
END;
$$;
