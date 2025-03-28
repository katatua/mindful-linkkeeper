
-- Function to safely execute SQL queries (now supporting INSERT statements)
CREATE OR REPLACE FUNCTION public.execute_sql_query(sql_query text)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  statement_type text;
BEGIN
  -- Extract the first word to determine statement type
  statement_type := lower(split_part(btrim(sql_query), ' ', 1));
  
  -- Handle different statement types
  IF statement_type = 'select' THEN
    -- For SELECT: return results as JSON
    EXECUTE 'SELECT json_agg(t) FROM (' || sql_query || ') t' INTO result;
    RETURN COALESCE(result, '[]'::jsonb);
  ELSIF statement_type = 'insert' THEN
    -- For INSERT: execute and return success message
    EXECUTE sql_query;
    RETURN jsonb_build_object('status', 'success', 'message', 'Insert completed successfully');
  ELSE
    RAISE EXCEPTION 'Only SELECT and INSERT statements are allowed';
  END IF;
EXCEPTION
  WHEN others THEN
    RETURN jsonb_build_object(
      'status', 'error',
      'message', SQLERRM,
      'detail', SQLSTATE
    );
END;
$$;

-- Add row-level security and grants
REVOKE ALL ON FUNCTION public.execute_sql_query(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.execute_sql_query(text) TO service_role;
