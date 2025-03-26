import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.7";

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Ensure environment variables are set
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Helper function to clean SQL statements from markdown formatting
 */
function cleanSqlFromMarkdown(sqlText: string): string {
  // Remove markdown code blocks if present
  sqlText = sqlText.replace(/```sql\n|\n```|```/g, '');
  
  // Trim whitespace
  return sqlText.trim();
}

/**
 * Fix common UUID format issues
 */
function fixUUIDFormat(sqlStatement: string): string {
  // Find potential UUIDs in the statement
  const uuidCandidates = sqlStatement.match(/'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'/gi);
  
  if (!uuidCandidates) return sqlStatement;
  
  let fixedStatement = sqlStatement;
  
  // Check each UUID candidate
  for (const candidate of uuidCandidates) {
    // Remove the quotes to get just the UUID
    const uuid = candidate.substring(1, candidate.length - 1);
    
    // If it's not a valid UUID, attempt to fix common mistakes
    if (!isValidUUID(uuid)) {
      // Replace non-hex characters in each section
      const sections = uuid.split('-');
      const fixedSections = sections.map(section => 
        section.replace(/[^0-9a-f]/gi, '0')
      );
      
      // Ensure each section has the correct length
      if (fixedSections[0].length !== 8) fixedSections[0] = fixedSections[0].padEnd(8, '0');
      if (fixedSections[1].length !== 4) fixedSections[1] = fixedSections[1].padEnd(4, '0');
      if (fixedSections[2].length !== 4) fixedSections[2] = fixedSections[2].padEnd(4, '0');
      if (fixedSections[3].length !== 4) fixedSections[3] = fixedSections[3].padEnd(4, '0');
      if (fixedSections[4].length !== 12) fixedSections[4] = fixedSections[4].padEnd(12, '0');
      
      const fixedUUID = fixedSections.join('-');
      fixedStatement = fixedStatement.replace(candidate, `'${fixedUUID}'`);
    }
  }
  
  return fixedStatement;
}

/**
 * Alternative approach to insert data by generating new UUIDs
 * instead of using the provided ones
 */
function replaceUUIDsWithGenerated(sqlStatement: string): string {
  // If INSERT statement, replace all UUIDs with gen_random_uuid() function
  if (sqlStatement.trim().toLowerCase().startsWith('insert')) {
    // Check if there are UUIDs in the statement
    const containsUUID = /'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'/gi.test(sqlStatement);
    
    if (containsUUID) {
      // Look for columns that are likely UUID primary keys
      const idColumnMatch = sqlStatement.match(/\b(id|uuid)\b/i);
      
      if (idColumnMatch) {
        // Try to identify the position of the id column
        const columnNames = sqlStatement.match(/INSERT INTO \w+ \(([^)]+)\)/i);
        
        if (columnNames && columnNames[1]) {
          const columns = columnNames[1].split(',').map(c => c.trim());
          const idColIndex = columns.findIndex(col => 
            col.toLowerCase() === 'id' || col.toLowerCase() === 'uuid'
          );
          
          if (idColIndex >= 0) {
            // Match VALUES clauses
            const valuesMatches = sqlStatement.matchAll(/VALUES\s*\(([^)]+)\)/gi);
            
            let newSql = sqlStatement;
            for (const match of valuesMatches) {
              if (match[1]) {
                const values = match[1].split(',');
                if (values.length > idColIndex) {
                  // Replace the UUID value with gen_random_uuid()
                  values[idColIndex] = 'gen_random_uuid()';
                  const newValues = `VALUES(${values.join(',')})`;
                  newSql = newSql.replace(match[0], newValues);
                }
              }
            }
            return newSql;
          }
        }
      }
    }
  }
  
  return sqlStatement;
}

/**
 * Validate UUID format
 * A valid UUID follows the 8-4-4-4-12 format with hexadecimal characters
 */
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const { sqlQuery, sqlStatements, operation } = await req.json();
    const query = sqlQuery || sqlStatements;
    
    // Validate input
    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: "SQL query must be provided as a string" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Clean the SQL statements from markdown formatting
    const cleanedSql = cleanSqlFromMarkdown(query);
    console.log("Cleaned SQL:", cleanedSql);

    // Add timeout for connection health check
    const connectionPromise = Promise.race([
      supabase.from('ani_database_status').select('count(*)', { count: 'exact', head: true }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
      )
    ]);
    
    try {
      await connectionPromise;
    } catch (connError) {
      console.error("Database connection error:", connError);
      return new Response(
        JSON.stringify({ 
          error: "Database connection error. The service might be temporarily unavailable.",
          errorDetail: connError.message,
          isConnectionError: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 503 }
      );
    }

    if (operation === 'write') {
      // For write operations (INSERT, UPDATE, DELETE)
      console.log("Executing SQL write operation:", cleanedSql);
      
      // Split the SQL statements if there are multiple statements
      // Only consider non-empty statements after splitting by semicolon
      const statements = cleanedSql.split(';').filter(stmt => stmt.trim().length > 0);
      console.log(`Found ${statements.length} SQL statements to execute`);
      
      const results = [];
      
      for (const statement of statements) {
        let trimmedStatement = statement.trim();
        
        // First, try to fix any invalid UUID formats
        trimmedStatement = fixUUIDFormat(trimmedStatement);
        
        // If that doesn't work, try replacing UUIDs with generated ones
        if (trimmedStatement.toLowerCase().includes('insert')) {
          trimmedStatement = replaceUUIDsWithGenerated(trimmedStatement);
        }
        
        console.log("Executing statement:", trimmedStatement);
        
        // Execute each statement separately with timeout
        const executePromise = Promise.race([
          supabase.rpc('execute_raw_query', { sql_query: trimmedStatement }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Query execution timeout')), 10000)
          )
        ]);
        
        try {
          const { data, error } = await executePromise;
          
          if (error) {
            console.error("Error executing SQL statement:", error);
            
            // Special handling for UUID errors
            if (error.message && error.message.includes('invalid input syntax for type uuid')) {
              return new Response(
                JSON.stringify({ 
                  error: `UUID format error: ${error.message}. 
                          Please use valid UUIDs in format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
                          or remove ID columns to let the system generate them automatically.` 
                }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
              );
            }
            
            return new Response(
              JSON.stringify({ error: error.message }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
            );
          }
          
          console.log("Statement result:", data);
          results.push(data);
        } catch (timeoutError) {
          console.error("Query execution timeout:", timeoutError);
          return new Response(
            JSON.stringify({ 
              error: "Query execution timed out after 10 seconds. Please try again with a simpler query.",
              isTimeout: true
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 408 }
          );
        }
      }
      
      return new Response(
        JSON.stringify({ 
          message: "SQL executed successfully", 
          affectedRows: results.reduce((sum, r) => {
            // Handle both array results and affected_rows object
            if (r && r.affected_rows !== undefined) {
              return sum + r.affected_rows;
            } else if (Array.isArray(r)) {
              return sum + r.length;
            }
            return sum;
          }, 0),
          result: results 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } 
    else {
      // For query operations (SELECT)
      console.log("Executing SQL query operation:", cleanedSql);
      
      // Execute the SQL query with timeout
      const executePromise = Promise.race([
        supabase.rpc('execute_raw_query', { sql_query: cleanedSql }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query execution timeout')), 10000)
        )
      ]);
      
      try {
        const { data, error } = await executePromise;
        
        if (error) {
          console.error("Error executing SQL query:", error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
        
        return new Response(
          JSON.stringify({ result: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (timeoutError) {
        console.error("Query execution timeout:", timeoutError);
        return new Response(
          JSON.stringify({ 
            error: "Query execution timed out after 10 seconds. Please try again with a simpler query.",
            isTimeout: true
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 408 }
        );
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        isConnectionError: error.message.includes('connection') || error.message.includes('timeout')
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
