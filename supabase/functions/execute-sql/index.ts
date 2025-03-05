
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const { sqlStatements, operation } = await req.json();
    
    // Validate input
    if (!sqlStatements || typeof sqlStatements !== 'string') {
      return new Response(
        JSON.stringify({ error: "SQL statements must be provided as a string" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Clean the SQL statements from markdown formatting
    const cleanedSql = cleanSqlFromMarkdown(sqlStatements);
    console.log("Cleaned SQL:", cleanedSql);

    if (operation === 'write') {
      // For write operations (INSERT, UPDATE, DELETE)
      console.log("Executing SQL write operation:", cleanedSql);
      
      // Split the SQL statements if there are multiple statements
      // Only consider non-empty statements after splitting by semicolon
      const statements = cleanedSql.split(';').filter(stmt => stmt.trim().length > 0);
      console.log(`Found ${statements.length} SQL statements to execute`);
      
      const results = [];
      
      for (const statement of statements) {
        const trimmedStatement = statement.trim();
        console.log("Executing statement:", trimmedStatement);
        
        // Execute each statement separately
        const { data, error } = await supabase.rpc(
          'execute_raw_query',
          { sql_query: trimmedStatement }
        );
        
        if (error) {
          console.error("Error executing SQL statement:", error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
        
        console.log("Statement result:", data);
        results.push(data);
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
      // For other operations, return an error
      return new Response(
        JSON.stringify({ error: "Unsupported operation type" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
