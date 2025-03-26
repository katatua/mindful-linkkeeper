
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.7";
import { corsHeaders } from "../_shared/cors.ts";

// Create Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Ensure environment variables are set
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const { sqlQuery, operation = 'query' } = await req.json();
    
    // Validate input
    if (!sqlQuery || typeof sqlQuery !== 'string') {
      return new Response(
        JSON.stringify({ error: "SQL query must be provided as a string" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Clean the SQL by removing excess whitespace
    const cleanedSql = sqlQuery.trim();
    console.log("Cleaned SQL:", cleanedSql);

    // Before executing, log information about Supabase connection state
    console.log("Supabase URL:", supabaseUrl ? "Configured" : "Missing");
    console.log("Supabase Service Key:", supabaseServiceKey ? "Configured (length: " + supabaseServiceKey.length + ")" : "Missing");

    if (operation === 'write') {
      // For write operations (CREATE TABLE, INSERT, UPDATE, DELETE)
      try {
        // First attempt with RPC if available
        const { data, error } = await supabase.rpc('execute_raw_query', { sql_query: cleanedSql });
        
        if (!error) {
          return new Response(
            JSON.stringify({ message: "SQL executed successfully", result: data }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // If RPC fails, try using pg directly via a stored function
        // For demonstration, log the error but we'll need another approach
        console.error("RPC execution failed:", error);
        
        return new Response(
          JSON.stringify({ 
            error: "Database write operation failed", 
            details: error.message,
            hint: "You may need to create the execute_raw_query function in your database"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      } catch (error) {
        console.error("Error executing SQL write operation:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
    } 
    else {
      // For query operations (SELECT)
      try {
        // Try direct query for SELECT statements using PostgresJS
        const { data, error } = await supabase.rpc('execute_raw_query', { sql_query: cleanedSql });
        
        if (error) {
          // If the function doesn't exist or there's an error
          console.error("Database query error:", error);
          
          // For demonstration, we'll send a more detailed error
          return new Response(
            JSON.stringify({ 
              error: error.message, 
              hint: "Try creating a SQL function named execute_raw_query in your database",
              code: error.code || "UNKNOWN" 
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
        
        return new Response(
          JSON.stringify({ result: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Error executing query:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
