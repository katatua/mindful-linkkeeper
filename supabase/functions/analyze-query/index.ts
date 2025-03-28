
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || query.trim() === '') {
      return new Response(
        JSON.stringify({
          error: 'Query is required'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Create Supabase client with service role key for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get database schema information
    const { data: tableList, error: tableError } = await supabase.rpc('get_database_tables');
    
    if (tableError) {
      throw new Error(`Failed to fetch database tables: ${tableError.message}`);
    }
    
    // Get AI model to use
    const { data: aiModel, error: modelError } = await supabase.rpc('get_database_setting', {
      setting_key: 'ai_model'
    });
    
    if (modelError) {
      console.error('Error fetching AI model:', modelError);
    }
    
    const model = aiModel || 'gemini-2.5-pro-exp-03-25';
    const googleApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!googleApiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    
    // Prepare system prompt with database schema
    const systemPrompt = `
You are a database expert that analyzes SQL queries and database schemas.

I have this query that yielded no results:
${query}

The database has the following tables with their columns:
${JSON.stringify(tableList, null, 2)}

Your task is to:
1. Identify which tables and columns are referenced in the query
2. Generate sample data that would satisfy the query conditions
3. Provide the INSERT statements needed to populate the database so the query will return results
4. Explain why the current query returns no results

Format your response as a JSON object with these fields:
- analysis: Your analysis of why the query returns no results
- tables: Array of tables that need data
- insertStatements: Array of SQL INSERT statements to populate the database
- expectedResults: What the query should return after inserting the data

Use only standard PostgreSQL syntax for the INSERT statements.
`;

    // Make request to Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${googleApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt }] }
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API Error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    const aiResponse = result.candidates[0].content.parts[0].text;
    
    // Parse AI response (handle both JSON and text formats)
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      // If response isn't valid JSON, extract what we can
      console.log("Failed to parse AI response as JSON, using text format");
      
      // Simple extraction attempt
      const analysis = aiResponse.indexOf("Analysis") > -1 ? 
        aiResponse.split("Analysis:")[1]?.split("\n\n")[0] : 
        "Analysis unavailable in structured format";
      
      // Extract SQL statements
      const insertStatements = [];
      const matches = aiResponse.matchAll(/```sql\s*(INSERT INTO[^`]*)\s*```/g);
      for (const match of matches) {
        if (match[1]) insertStatements.push(match[1].trim());
      }
      
      parsedResponse = {
        analysis: analysis.trim(),
        tables: [],
        insertStatements: insertStatements,
        expectedResults: "Results extraction not available in text format"
      };
    }
    
    // Save the analysis to query_history
    const { data: queryData, error: queryError } = await supabase
      .from('query_history')
      .select('id')
      .eq('query_text', query)
      .order('timestamp', { ascending: false })
      .limit(1);

    if (!queryError && queryData && queryData.length > 0) {
      const queryId = queryData[0].id;
      
      // Update the query record with analysis
      await supabase
        .from('query_history')
        .update({
          analysis_result: parsedResponse
        })
        .eq('id', queryId);
    }
    
    // Return the analysis
    return new Response(
      JSON.stringify(parsedResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Error in analyze-query function:", error);
    return new Response(
      JSON.stringify({
        error: `Failed to analyze query: ${error.message || "Unknown error"}`
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
