
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

    console.log(`Processing question (${language}): "${question}"`);

    // Get database schema information with detailed column types
    const schema = `
    Tables in the ANI database:
    
    1. ani_metrics - Contains various innovation metrics and statistics
    Columns: 
      id UUID PRIMARY KEY, 
      name TEXT NOT NULL, 
      value NUMERIC, 
      unit TEXT, 
      category TEXT NOT NULL, 
      sector TEXT, 
      region TEXT, 
      measurement_date DATE, 
      description TEXT, 
      source TEXT, 
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    
    2. ani_projects - Contains information about innovation projects
    Columns: 
      id UUID PRIMARY KEY, 
      title TEXT NOT NULL, 
      description TEXT, 
      organization TEXT, 
      sector TEXT, 
      region TEXT, 
      status TEXT NOT NULL DEFAULT 'submitted', 
      start_date DATE, 
      end_date DATE, 
      funding_amount NUMERIC, 
      contact_email TEXT, 
      contact_phone TEXT, 
      institution_id UUID, 
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    
    3. ani_funding_programs - Contains details about funding programs
    Columns: 
      id UUID PRIMARY KEY, 
      name TEXT NOT NULL, 
      description TEXT, 
      total_budget NUMERIC, 
      start_date DATE, 
      end_date DATE, 
      application_deadline DATE, 
      next_call_date DATE, 
      funding_type TEXT, 
      sector_focus TEXT[], 
      application_process TEXT, 
      eligibility_criteria TEXT, 
      success_rate NUMERIC, 
      review_time_days INTEGER, 
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    
    4. ani_funding_applications - Tracks applications to funding programs
    Columns: 
      id UUID PRIMARY KEY, 
      program_id UUID, 
      organization TEXT, 
      sector TEXT, 
      region TEXT, 
      requested_amount NUMERIC, 
      approved_amount NUMERIC, 
      status TEXT NOT NULL, 
      application_date DATE NOT NULL, 
      decision_date DATE, 
      year INTEGER NOT NULL, 
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    
    5. ani_international_collaborations - International research partnerships
    Columns: 
      id UUID PRIMARY KEY, 
      program_name TEXT NOT NULL, 
      country TEXT NOT NULL, 
      partnership_type TEXT, 
      start_date DATE, 
      end_date DATE, 
      total_budget NUMERIC, 
      portuguese_contribution NUMERIC, 
      focus_areas TEXT[], 
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    
    6. ani_patent_holders - Organizations with patents
    Columns: 
      id UUID PRIMARY KEY, 
      organization_name TEXT NOT NULL, 
      sector TEXT, 
      patent_count INTEGER NOT NULL, 
      innovation_index NUMERIC, 
      year INTEGER NOT NULL, 
      country TEXT, 
      institution_id UUID, 
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    
    7. ani_institutions - Research and innovation institutions
    Columns: 
      id UUID PRIMARY KEY, 
      institution_name TEXT NOT NULL, 
      type TEXT NOT NULL, 
      region TEXT, 
      specialization_areas TEXT[], 
      collaboration_count INTEGER DEFAULT 0, 
      founding_date DATE, 
      project_history TEXT[], 
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    
    8. ani_researchers - Researchers information
    Columns: 
      id UUID PRIMARY KEY, 
      name TEXT NOT NULL, 
      email TEXT, 
      specialization TEXT, 
      institution_id UUID, 
      h_index INTEGER, 
      publication_count INTEGER DEFAULT 0, 
      patent_count INTEGER DEFAULT 0, 
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    
    9. ani_projects_researchers - Many-to-many relationship between projects and researchers
    Columns: 
      project_id UUID NOT NULL, 
      researcher_id UUID NOT NULL, 
      role TEXT
    
    10. ani_database_status - Status of each ANI database table
    Columns: 
      id UUID PRIMARY KEY, 
      table_name TEXT NOT NULL, 
      last_populated TIMESTAMP WITH TIME ZONE, 
      record_count INTEGER DEFAULT 0, 
      status TEXT DEFAULT 'empty', 
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    
    11. ani_policy_frameworks - Policy frameworks for innovation
    Columns: 
      id UUID PRIMARY KEY, 
      title TEXT NOT NULL, 
      description TEXT, 
      status TEXT NOT NULL DEFAULT 'active', 
      implementation_date DATE, 
      key_objectives TEXT[], 
      related_legislation TEXT, 
      scope TEXT, 
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    `;

    // System prompt for SQL generation with detailed instructions and examples
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
    11. For R&D investment questions:
       - Use the ani_metrics table where category = 'Investment' or name ILIKE '%R&D%' or name ILIKE '%research%'
       - Filter by region, date ranges, or sectors as appropriate
       - Use aggregate functions (SUM, AVG) when analyzing spending
    12. Make sure to handle language consistency whether the question is in English or Portuguese.
    13. For time-based queries, use measurement_date in ani_metrics, start_date/end_date in projects tables.
    
    EXAMPLES:
    Question: "What was the total R&D investment in Portugal in 2023?"
    SQL: 
    SELECT SUM(value) as total_investment, unit
    FROM ani_metrics 
    WHERE category = 'Investment' 
    AND name ILIKE '%R&D%' 
    AND region = 'Portugal' 
    AND EXTRACT(YEAR FROM measurement_date) = 2023
    GROUP BY unit;
    
    Question: "Show me funding programs with deadlines in the next 3 months"
    SQL:
    SELECT name, description, application_deadline, total_budget
    FROM ani_funding_programs
    WHERE application_deadline BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '3 months')
    ORDER BY application_deadline ASC
    LIMIT 20;`;

    // User prompt is the question itself with language handling
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
        max_tokens: 600
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
      JSON.stringify({ error: `Failed to generate SQL: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
