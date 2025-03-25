
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || "";
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client with service role key for database access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Cache for storing entity IDs to create proper relationships
const entityCache: Record<string, string[]> = {
  ani_institutions: [],
  ani_researchers: [],
  ani_projects: [],
  ani_funding_programs: []
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tableName, count = 50 } = await req.json();
    
    if (!tableName) {
      return new Response(
        JSON.stringify({ error: "Table name is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Generating synthetic data for table: ${tableName}, count: ${count}`);
    
    // Get table schema
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('execute_sql_query', { 
        sql_query: `
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = '${tableName}'
          AND table_schema = 'public'
        `
      });
    
    if (tableError) {
      throw new Error(`Error fetching table schema: ${tableError.message}`);
    }
    
    if (!tableInfo || tableInfo.length === 0) {
      return new Response(
        JSON.stringify({ error: `Table '${tableName}' not found or has no columns` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If this is a relationship table, we need to handle it differently
    if (tableName === 'ani_projects_researchers') {
      return await handleRelationshipTable(tableName, count, tableInfo);
    }
    
    // Check if we need to fetch existing data for relationships
    await preloadEntityIds(tableName);
    
    // Create OpenAI prompt for synthetic data generation
    const prompt = createPrompt(tableName, tableInfo, count);
    
    // Call OpenAI API to generate synthetic data
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a database seeding expert that generates realistic synthetic data in JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenAI API error: ${errorData}`);
    }
    
    const data = await response.json();
    let syntheticDataStr = data.choices[0].message.content.trim();
    
    // Extract the JSON array from the response
    let syntheticData;
    try {
      // Handle cases where the response includes markdown code blocks
      if (syntheticDataStr.includes('```')) {
        syntheticDataStr = syntheticDataStr.replace(/```json\n|\n```|```/g, '');
      }
      syntheticData = JSON.parse(syntheticDataStr);
    } catch (e) {
      console.error('Error parsing synthetic data JSON:', e);
      throw new Error('Failed to parse the generated synthetic data');
    }
    
    // Process the synthetic data
    const processedData = processGeneratedData(syntheticData, tableInfo, tableName);
    
    // Clear existing data from the table
    const { error: clearError } = await supabase
      .from(tableName)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
    
    if (clearError) {
      throw new Error(`Error clearing table data: ${clearError.message}`);
    }
    
    // Insert synthetic data in batches
    const batchSize = 20;
    const results = [];
    
    for (let i = 0; i < processedData.length; i += batchSize) {
      const batch = processedData.slice(i, i + batchSize);
      
      const { data: insertData, error: insertError } = await supabase
        .from(tableName)
        .insert(batch)
        .select();
      
      if (insertError) {
        throw new Error(`Error inserting batch ${i/batchSize + 1}: ${insertError.message}`);
      }
      
      results.push(insertData);
      
      // If this is a main entity table, cache the IDs
      if (Object.keys(entityCache).includes(tableName) && insertData) {
        entityCache[tableName] = [
          ...entityCache[tableName], 
          ...insertData.map((item: any) => item.id)
        ];
      }
    }
    
    return new Response(
      JSON.stringify({ 
        message: `Successfully generated and inserted ${processedData.length} synthetic records into ${tableName}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating synthetic data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Function to preload entity IDs for relationships
async function preloadEntityIds(tableName: string) {
  // Only preload if necessary
  const needsPreloading = tableName === 'ani_researchers' || 
                          tableName === 'ani_projects' ||
                          tableName === 'ani_funding_applications' ||
                          tableName === 'ani_patent_holders';
  
  if (!needsPreloading) return;
  
  // Preload institution IDs if needed
  if (['ani_researchers', 'ani_projects', 'ani_patent_holders'].includes(tableName) && 
      entityCache.ani_institutions.length === 0) {
    const { data } = await supabase
      .from('ani_institutions')
      .select('id')
      .limit(100);
    
    if (data && data.length > 0) {
      entityCache.ani_institutions = data.map(item => item.id);
      console.log(`Preloaded ${entityCache.ani_institutions.length} institution IDs`);
    }
  }
  
  // Preload funding program IDs if needed
  if (tableName === 'ani_funding_applications' && entityCache.ani_funding_programs.length === 0) {
    const { data } = await supabase
      .from('ani_funding_programs')
      .select('id')
      .limit(100);
    
    if (data && data.length > 0) {
      entityCache.ani_funding_programs = data.map(item => item.id);
      console.log(`Preloaded ${entityCache.ani_funding_programs.length} funding program IDs`);
    }
  }
}

// Function to handle relationship tables
async function handleRelationshipTable(tableName: string, count: number, tableInfo: any[]) {
  // For relationship tables, we need existing records from both sides
  let projectIds: string[] = [];
  let researcherIds: string[] = [];
  
  // Get project IDs
  const { data: projects } = await supabase
    .from('ani_projects')
    .select('id')
    .limit(100);
  
  if (projects && projects.length > 0) {
    projectIds = projects.map(item => item.id);
  } else {
    return new Response(
      JSON.stringify({ error: "Cannot create relationships: No projects found" }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Get researcher IDs
  const { data: researchers } = await supabase
    .from('ani_researchers')
    .select('id')
    .limit(100);
  
  if (researchers && researchers.length > 0) {
    researcherIds = researchers.map(item => item.id);
  } else {
    return new Response(
      JSON.stringify({ error: "Cannot create relationships: No researchers found" }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Generate relationship data
  const roles = ["Principal Investigator", "Co-Investigator", "Research Assistant", 
                "Technical Lead", "Data Analyst", "Domain Expert"];
  
  // Clear existing relationships
  await supabase
    .from(tableName)
    .delete()
    .neq('project_id', '00000000-0000-0000-0000-000000000000');
  
  // Create relationships
  const relationshipData = [];
  const uniquePairs = new Set();
  
  // Cap count to avoid too many combinations
  const actualCount = Math.min(count, projectIds.length * researcherIds.length);
  
  for (let i = 0; i < actualCount; i++) {
    const projectId = projectIds[Math.floor(Math.random() * projectIds.length)];
    const researcherId = researcherIds[Math.floor(Math.random() * researcherIds.length)];
    const pairKey = `${projectId}-${researcherId}`;
    
    // Skip if this pair already exists
    if (uniquePairs.has(pairKey)) {
      continue;
    }
    
    uniquePairs.add(pairKey);
    relationshipData.push({
      project_id: projectId,
      researcher_id: researcherId,
      role: roles[Math.floor(Math.random() * roles.length)]
    });
  }
  
  // Insert the relationship data
  const { data: insertedData, error: insertError } = await supabase
    .from(tableName)
    .insert(relationshipData)
    .select();
  
  if (insertError) {
    throw new Error(`Error inserting relationship data: ${insertError.message}`);
  }
  
  return new Response(
    JSON.stringify({ 
      message: `Successfully created ${relationshipData.length} project-researcher relationships` 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Function to create the prompt for generating synthetic data
function createPrompt(tableName: string, tableInfo: any[], count: number) {
  // Basic prompt structure
  let prompt = `
    Generate synthetic data for a PostgreSQL table with these columns:
    ${tableInfo.map(col => `${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`).join('\n')}
    
    The data should be realistic for a Portuguese innovation agency database. Please generate exactly ${count} rows.
    Return the data as a JSON array with objects where the keys are the column names.
    For UUID columns, use the string "NEW_UUID" which I will replace with generated UUIDs.
    For date or timestamp columns, use ISO format strings.
    The data should be varied, diverse, and realistic.
    `;
  
  // Table-specific instructions
  switch (tableName) {
    case 'ani_institutions':
      prompt += `
        This table contains research institutions and innovation organizations in Portugal.
        For "institution_name", use realistic names of Portuguese universities, research centers, companies, etc.
        For "type", use values like: "University", "Research Center", "Company", "CoLAB", "State Laboratory".
        For "region", use Portuguese regions like: "Norte", "Centro", "Lisboa", "Alentejo", "Algarve", "Açores", "Madeira".
        For "specialization_areas", use a JSON array of fields like: ["Artificial Intelligence", "Renewable Energy", "Biotechnology"].
        For "project_history", include a JSON array of brief project titles or descriptions.
      `;
      break;
      
    case 'ani_researchers':
      prompt += `
        This table contains researchers affiliated with Portuguese institutions.
        For "name", use realistic Portuguese names.
        For "specialization", use research fields like: "Machine Learning", "Nanotechnology", "Marine Biology", etc.
        For "h_index", use realistic values between 1-50.
        For "institution_id", I'll replace these with actual institution IDs later.
        Make sure to include a good mix of junior and senior researchers with varying publication counts.
      `;
      break;
      
    case 'ani_projects':
      prompt += `
        For "title", create innovative project titles related to technology, research, and innovation.
        For "description", provide detailed summaries of the project goals and methodologies.
        For "status", use one of: "submitted", "approved", "active", "completed", "rejected".
        For "sector", use sectors like: "Digital Technology", "Health", "Energy", "Agriculture", "Manufacturing".
        For "region", use Portuguese regions.
        For "funding_amount", use realistic values between €10,000 and €2,000,000.
        For "institution_id", I'll replace with actual institution IDs later.
      `;
      break;
      
    case 'ani_funding_programs':
      prompt += `
        For "name", create realistic funding program names like "Horizon Europe Portugal", "Digital Innovation Hub", etc.
        For "funding_type", use values like: "Grant", "Subsidy", "Tax Incentive", "Co-funding", "Loan".
        For "sector_focus", use a JSON array of sectors.
        For "total_budget", use values between €100,000 and €50,000,000.
        For application deadlines and dates, use recent and upcoming dates (2023-2025).
      `;
      break;
      
    case 'ani_funding_applications':
      prompt += `
        For "organization", use realistic company or institution names.
        For "status", use: "submitted", "under review", "approved", "rejected", "completed".
        For "region", use Portuguese regions.
        For "requested_amount", use values between €50,000 and €500,000.
        For "approved_amount", use null for applications not yet approved, otherwise a value less than or equal to requested_amount.
        For "program_id", I'll replace with actual program IDs later.
        For application dates, use dates within the last 1-2 years.
      `;
      break;
      
    case 'ani_patent_holders':
      prompt += `
        For "organization_name", use realistic Portuguese institution or company names.
        For "sector", use industry sectors like: "Technology", "Healthcare", "Energy", "Manufacturing".
        For "patent_count", use values between 1 and 100.
        For "innovation_index", use a decimal between 0.1 and 5.0.
        For "year", use years between 2010 and 2023.
        For "country", primarily use "Portugal" but include some international entries like "Spain", "France", "Germany", "USA".
        For "institution_id", I'll replace with actual institution IDs later.
      `;
      break;
      
    case 'ani_international_collaborations':
      prompt += `
        For "program_name", use names of international collaboration programs.
        For "country", use a variety of countries that Portugal collaborates with.
        For "partnership_type", use: "Research", "Technology Transfer", "Capacity Building", "Joint Funding".
        For "focus_areas", use a JSON array of research or innovation areas.
        For "total_budget", use values between €100,000 and €10,000,000.
        For "portuguese_contribution", use a value less than the total_budget.
        For dates, use a mix of ongoing and completed collaborations (2018-2025).
      `;
      break;
      
    case 'ani_metrics':
      prompt += `
        For "name", use metric names like "R&D Investment", "Patent Applications", "Innovation Index", "Startup Formation Rate".
        For "category", use: "Investment", "Output", "Impact", "Collaboration", "Regional".
        For "value", use realistic numeric values appropriate for each metric.
        For "unit", use appropriate units like: "Million EUR", "Percentage", "Count", "Index Value".
        For "region", use Portuguese regions and "National".
        For "sector", use various industry sectors.
        For "measurement_date", use dates within the last 5 years.
        For "source", use Portuguese data sources like: "INE", "DGEEC", "FCT", "IAPMEI", "ANI Internal Data".
      `;
      break;
  }
  
  prompt += '\n\nOnly return the JSON array, no explanation.';
  
  return prompt;
}

// Function to process the generated data and handle relationships
function processGeneratedData(syntheticData: any[], tableInfo: any[], tableName: string) {
  return syntheticData.map((item: any) => {
    const processed: any = {};
    
    // Process each column
    for (const col of tableInfo) {
      const colName = col.column_name;
      let value = item[colName];
      
      // Skip id column if it's a UUID type (will be generated by the database)
      if (colName === 'id' && col.data_type.includes('uuid')) {
        continue;
      }
      
      // Replace 'NEW_UUID' with null for UUID columns (database will generate them)
      if (col.data_type.includes('uuid') && value === 'NEW_UUID') {
        value = null;
      }
      
      // Remove timestamp columns if they will be set by defaults
      if ((colName === 'created_at' || colName === 'updated_at') && 
          col.data_type.includes('timestamp')) {
        continue;
      }
      
      // Handle special foreign key relationships
      if (colName === 'institution_id' && tableName !== 'ani_institutions' && entityCache.ani_institutions.length > 0) {
        // Randomly assign an existing institution ID
        value = entityCache.ani_institutions[Math.floor(Math.random() * entityCache.ani_institutions.length)];
      }
      
      if (colName === 'program_id' && tableName === 'ani_funding_applications' && entityCache.ani_funding_programs.length > 0) {
        // Randomly assign an existing funding program ID
        value = entityCache.ani_funding_programs[Math.floor(Math.random() * entityCache.ani_funding_programs.length)];
      }
      
      // Handle array data types
      if (col.data_type.includes('ARRAY') && typeof value === 'string') {
        try {
          // Try to parse JSON array if it's a string
          value = JSON.parse(value);
        } catch (e) {
          // If it's not valid JSON, split by commas
          value = value.split(',').map((v: string) => v.trim());
        }
      }
      
      // Include the processed value
      processed[colName] = value;
    }
    
    return processed;
  });
}
