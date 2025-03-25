
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || "";

// Set up CORS headers
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
    const { question, language = 'en' } = await req.json();

    if (!question) {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get database schema information
    // This would normally be fetched from the database, but for simplicity we'll use a predefined schema
    const schema = `
    Tables in the ANI database:
    
    1. ani_metrics - Contains various innovation metrics and statistics
    Columns: id, name, value, unit, category, sector, region, measurement_date, description, source, created_at, updated_at
    
    2. ani_projects - Contains information about innovation projects
    Columns: id, title, description, organization, sector, region, status, start_date, end_date, funding_amount, contact_email, contact_phone, created_at, updated_at
    
    3. ani_funding_programs - Contains details about funding programs
    Columns: id, name, description, total_budget, start_date, end_date, application_deadline, next_call_date, funding_type, sector_focus, application_process, eligibility_criteria, success_rate, review_time_days, created_at, updated_at
    
    4. ani_funding_applications - Tracks applications to funding programs
    Columns: id, program_id, organization, sector, region, requested_amount, approved_amount, status, application_date, decision_date, year, created_at, updated_at
    
    5. ani_international_collaborations - International research partnerships
    Columns: id, program_name, country, partnership_type, start_date, end_date, total_budget, portuguese_contribution, focus_areas, created_at, updated_at
    
    6. ani_patent_holders - Organizations with patents
    Columns: id, organization_name, sector, patent_count, innovation_index, year, country, created_at
    
    7. ani_institutions - Research and innovation institutions
    Columns: id, institution_name, type, region, specialization_areas, collaboration_count, founding_date, project_history, created_at, updated_at
    
    8. ani_researchers - Researchers information
    Columns: id, name, email, specialization, institution_id, h_index, publication_count, patent_count, created_at, updated_at
    
    9. ani_projects_researchers - Many-to-many relationship between projects and researchers
    Columns: project_id, researcher_id, role
    `;

    // System prompt for SQL generation
    const systemPrompt = `You are an expert SQL query generator for the National Innovation Agency (ANI) database. 
    You translate natural language questions into valid PostgreSQL queries.
    
    Here is the database schema:
    ${schema}
    
    IMPORTANT GUIDELINES:
    1. Generate ONLY SQL code without any explanation.
    2. Never use functions or features not available in PostgreSQL.
    3. Always use explicit column names (never SELECT *).
    4. Include appropriate joins when needed.
    5. Limit results to a reasonable number (10-20 rows) unless specified otherwise.
    6. Consider appropriate filtering, sorting, and grouping based on the question.
    7. Only output a valid SQL statement, nothing else.
    8. Return your response as a plain SQL query with no markdown formatting.
    9. For questions about trends or comparisons over time, use appropriate date functions and ordering.
    10. Respond with ERROR if the question cannot be answered using the available tables.
    11. For R&D investment questions, use the ani_metrics table with category = 'Investment' or name containing 'R&D'.
    12. Make sure to handle language consistency whether the question is in English or Portuguese.`;

    // User prompt is the question itself
    const userPrompt = `${language === 'pt' ? 'Traduzir para SQL: ' : 'Translate to SQL: '}${question}`;

    console.log("Sending to OpenAI with system prompt:", systemPrompt.substring(0, 100) + "...");
    console.log("User prompt:", userPrompt);

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const data = await response.json();
    let sql = data.choices[0].message.content.trim();

    console.log("Generated SQL:", sql);

    // If response starts with "ERROR", return it as an error message
    if (sql.startsWith("ERROR")) {
      return new Response(
        JSON.stringify({ error: sql.replace("ERROR", "").trim() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean up any markdown formatting that might be included
    sql = sql.replace(/```sql\n|\n```|```/g, '');

    console.log("Final SQL to execute:", sql);

    return new Response(
      JSON.stringify({ sql }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error generating SQL:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
