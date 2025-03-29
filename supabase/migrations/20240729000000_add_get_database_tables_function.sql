
-- Create a function to get database tables schema
CREATE OR REPLACE FUNCTION public.get_database_tables()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Get information about all the tables in the public schema
  WITH table_info AS (
    SELECT
      t.table_name,
      jsonb_agg(
        jsonb_build_object(
          'column_name', c.column_name,
          'data_type', c.data_type,
          'is_nullable', c.is_nullable
        ) ORDER BY c.ordinal_position
      ) AS columns
    FROM 
      information_schema.tables t
    JOIN 
      information_schema.columns c 
    ON 
      t.table_name = c.table_name
    WHERE 
      t.table_schema = 'public' 
      AND t.table_type = 'BASE TABLE'
      AND c.table_schema = 'public'
    GROUP BY 
      t.table_name
  )
  SELECT 
    jsonb_agg(
      jsonb_build_object(
        'table_name', table_name,
        'columns', columns
      )
    )
  INTO result
  FROM 
    table_info;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_database_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_database_tables() TO anon;
GRANT EXECUTE ON FUNCTION public.get_database_tables() TO service_role;
