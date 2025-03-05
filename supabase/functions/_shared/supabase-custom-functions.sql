
-- Function to safely execute SQL queries with restrictions (only SELECTs allowed)
CREATE OR REPLACE FUNCTION public.execute_sql_query(sql_query text)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Validate that the query is a SELECT statement
  IF NOT (lower(btrim(sql_query)) LIKE 'select%') THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed';
  END IF;
  
  -- Execute the query and get results as JSON
  EXECUTE 'SELECT json_agg(t) FROM (' || sql_query || ') t' INTO result;
  
  -- Return empty array instead of null
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- Function for raw SQL execution (for admins only)
CREATE OR REPLACE FUNCTION public.execute_raw_query(sql_query text)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Validate that the query is a SELECT statement
  IF NOT (lower(btrim(sql_query)) LIKE 'select%') THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed for security reasons';
  END IF;
  
  -- Execute the query and get results as JSON
  EXECUTE 'SELECT json_agg(t) FROM (' || sql_query || ') t' INTO result;
  
  -- Return empty array instead of null
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- Add row-level security and grants
REVOKE ALL ON FUNCTION public.execute_sql_query(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.execute_sql_query(text) TO service_role;

REVOKE ALL ON FUNCTION public.execute_raw_query(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.execute_raw_query(text) TO service_role;
