
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.7";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Edge function started: generate-synthetic-data");

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request with CORS headers");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request parameters
    const { tableName, count = 20 } = await req.json();
    
    if (!tableName) {
      console.error("Missing table name in request");
      return new Response(
        JSON.stringify({ 
          error: "Table name is required", 
          success: false 
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log(`Generating synthetic data for table: ${tableName}, count: ${count}`);
    
    // Get Supabase connection info from environment
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ 
          error: "Supabase environment variables are not configured",
          success: false 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Generate sample data based on table
    const sampleData = await generateSampleData(supabase, tableName, count);
    
    if (!sampleData.success) {
      return new Response(
        JSON.stringify(sampleData), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Clear existing data from the table
    console.log(`Clearing existing data from ${tableName}`);
    const { error: clearError } = await supabase
      .from(tableName)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
    
    if (clearError) {
      console.error(`Error clearing table data: ${clearError.message}`);
      return new Response(
        JSON.stringify({ 
          error: `Error clearing table data: ${clearError.message}`,
          success: false 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Insert sample data
    console.log(`Inserting ${sampleData.data.length} records into ${tableName}`);
    const { data: insertData, error: insertError } = await supabase
      .from(tableName)
      .insert(sampleData.data)
      .select();
    
    if (insertError) {
      console.error(`Error inserting data: ${insertError.message}`);
      return new Response(
        JSON.stringify({ 
          error: `Error inserting data: ${insertError.message}`,
          success: false 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        message: `Successfully generated and inserted ${sampleData.data.length} synthetic records into ${tableName}`,
        count: sampleData.data.length,
        success: true 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in generate-synthetic-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        success: false 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Function to generate sample data based on table schema
async function generateSampleData(supabase: any, tableName: string, count: number) {
  try {
    // Get table structure
    const { data: columns, error: schemaError } = await supabase
      .rpc('execute_sql_query', { 
        sql_query: `
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = '${tableName}'
          AND table_schema = 'public'
        `
      });
    
    if (schemaError) {
      console.error(`Error getting schema: ${schemaError.message}`);
      return { 
        success: false, 
        error: `Error getting schema: ${schemaError.message}`
      };
    }
    
    if (!columns || columns.length === 0) {
      return { 
        success: false, 
        error: `Table ${tableName} not found or has no columns`
      };
    }
    
    console.log(`Found ${columns.length} columns for table ${tableName}`);
    
    // Generate sample data
    const sampleData = [];
    
    for (let i = 0; i < count; i++) {
      const record: Record<string, any> = {};
      
      // Skip id field to let the database generate it
      for (const column of columns) {
        if (column.column_name === 'id' && column.data_type.includes('uuid')) {
          continue;
        }
        
        if (column.column_name === 'created_at' || column.column_name === 'updated_at') {
          continue; // Skip timestamps, they will be set automatically
        }
        
        record[column.column_name] = generateValueForColumn(column, tableName, i);
      }
      
      sampleData.push(record);
    }
    
    return { success: true, data: sampleData };
  } catch (error) {
    console.error('Error generating sample data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

// Function to generate values for different column types
function generateValueForColumn(column: any, tableName: string, index: number) {
  const { column_name, data_type, is_nullable } = column;
  
  // If nullable and random chance to be null (20%)
  if (is_nullable === 'YES' && Math.random() < 0.2) {
    return null;
  }
  
  // Generate based on data type
  switch (data_type.toLowerCase()) {
    case 'text':
      return generateTextValue(column_name, tableName, index);
    
    case 'integer':
      return generateIntegerValue(column_name);
    
    case 'numeric':
    case 'decimal':
    case 'double precision':
    case 'real':
      return generateNumericValue(column_name);
    
    case 'boolean':
      return Math.random() > 0.5;
    
    case 'date':
      return generateDateValue(column_name);
    
    case 'timestamp with time zone':
    case 'timestamp without time zone':
      return new Date().toISOString();
    
    case 'jsonb':
    case 'json':
      return {};
    
    case 'uuid':
      return crypto.randomUUID();
    
    case 'ARRAY':
      return generateArrayValue(column_name);
    
    default:
      console.log(`Unknown data type: ${data_type} for column ${column_name}`);
      return null;
  }
}

// Helper function to generate text values based on column name
function generateTextValue(columnName: string, tableName: string, index: number) {
  const lowerColumnName = columnName.toLowerCase();
  
  // Email fields
  if (lowerColumnName.includes('email')) {
    return `user${index}@example.com`;
  }
  
  // Name fields
  if (lowerColumnName === 'name' || lowerColumnName.endsWith('_name')) {
    if (tableName === 'ani_researchers') {
      const firstNames = ['João', 'Maria', 'Carlos', 'Ana', 'Pedro', 'Sofia', 'Miguel', 'Luísa', 'António', 'Teresa'];
      const lastNames = ['Silva', 'Santos', 'Ferreira', 'Costa', 'Oliveira', 'Rodrigues', 'Martins', 'Pereira', 'Alves', 'Ribeiro'];
      return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    }
    
    if (tableName === 'ani_institutions') {
      const prefixes = ['University of', 'Institute of', 'Research Center for', 'Laboratory of', 'Center for'];
      const fields = ['Technology', 'Sciences', 'Innovation', 'Applied Research', 'Digital Studies', 'Biological Sciences', 'Sustainable Energy'];
      const locations = ['Lisbon', 'Porto', 'Coimbra', 'Braga', 'Faro', 'Aveiro'];
      
      return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${fields[Math.floor(Math.random() * fields.length)]} - ${locations[Math.floor(Math.random() * locations.length)]}`;
    }
    
    return `Sample Name ${index + 1}`;
  }
  
  // Status fields
  if (lowerColumnName === 'status') {
    const statuses = ['active', 'completed', 'pending', 'draft', 'approved', 'rejected'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
  
  // Description fields
  if (lowerColumnName.includes('description')) {
    return `This is a sample description for record #${index + 1}. It contains information about the purpose and details of this specific record.`;
  }
  
  // Title fields
  if (lowerColumnName === 'title') {
    if (tableName === 'ani_projects') {
      const projectTypes = ['Development of', 'Research on', 'Innovation in', 'Advancing', 'Exploring'];
      const topics = ['Artificial Intelligence', 'Sustainable Energy', 'Biotechnology', 'Digital Transformation', 'Smart Materials', 'Agricultural Innovation', 'Healthcare Solutions'];
      
      return `${projectTypes[Math.floor(Math.random() * projectTypes.length)]} ${topics[Math.floor(Math.random() * topics.length)]} in Portugal`;
    }
    
    return `Sample Title ${index + 1}`;
  }
  
  // Region fields
  if (lowerColumnName === 'region') {
    const regions = ['Norte', 'Centro', 'Lisboa', 'Alentejo', 'Algarve', 'Açores', 'Madeira'];
    return regions[Math.floor(Math.random() * regions.length)];
  }
  
  // Sector fields
  if (lowerColumnName === 'sector') {
    const sectors = ['Healthcare', 'Technology', 'Energy', 'Agriculture', 'Education', 'Manufacturing', 'Finance'];
    return sectors[Math.floor(Math.random() * sectors.length)];
  }
  
  // Type fields
  if (lowerColumnName === 'type') {
    if (tableName === 'ani_institutions') {
      const types = ['University', 'Research Center', 'Company', 'CoLAB', 'State Laboratory'];
      return types[Math.floor(Math.random() * types.length)];
    }
    
    return `Type ${index % 5 + 1}`;
  }
  
  // Category fields
  if (lowerColumnName === 'category') {
    if (tableName === 'ani_metrics') {
      const categories = ['Investment', 'Output', 'Impact', 'Collaboration', 'Innovation'];
      return categories[Math.floor(Math.random() * categories.length)];
    }
    
    return `Category ${index % 4 + 1}`;
  }
  
  // Default text
  return `Sample text for ${columnName} #${index + 1}`;
}

// Helper function to generate integer values
function generateIntegerValue(columnName: string) {
  const lowerColumnName = columnName.toLowerCase();
  
  // Year fields
  if (lowerColumnName === 'year') {
    return 2020 + Math.floor(Math.random() * 5); // 2020-2024
  }
  
  // Count fields
  if (lowerColumnName.includes('count')) {
    return Math.floor(Math.random() * 500);
  }
  
  // Index fields
  if (lowerColumnName.includes('index')) {
    return Math.floor(Math.random() * 100);
  }
  
  // Default integer
  return Math.floor(Math.random() * 1000);
}

// Helper function to generate numeric values
function generateNumericValue(columnName: string) {
  const lowerColumnName = columnName.toLowerCase();
  
  // Amount fields
  if (lowerColumnName.includes('amount')) {
    return Math.floor(Math.random() * 1000000) / 100; // Up to 10,000.00
  }
  
  // Budget fields
  if (lowerColumnName.includes('budget')) {
    return Math.floor(Math.random() * 10000000) / 100; // Up to 100,000.00
  }
  
  // Value fields
  if (lowerColumnName === 'value') {
    return Math.floor(Math.random() * 10000) / 100; // Up to 100.00
  }
  
  // Rate/percentage fields
  if (lowerColumnName.includes('rate') || lowerColumnName.includes('percentage')) {
    return Math.floor(Math.random() * 10000) / 100; // Up to 100.00
  }
  
  // Default numeric
  return Math.floor(Math.random() * 1000) / 100;
}

// Helper function to generate date values
function generateDateValue(columnName: string) {
  const lowerColumnName = columnName.toLowerCase();
  
  // Function to generate a random date within a range
  const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
  };
  
  const today = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);
  
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(today.getFullYear() + 1);
  
  // Start date fields
  if (lowerColumnName.includes('start')) {
    return getRandomDate(fiveYearsAgo, today);
  }
  
  // End date fields
  if (lowerColumnName.includes('end')) {
    return getRandomDate(today, oneYearFromNow);
  }
  
  // Default date
  return getRandomDate(fiveYearsAgo, today);
}

// Helper function to generate array values
function generateArrayValue(columnName: string) {
  const lowerColumnName = columnName.toLowerCase();
  
  // Focus areas
  if (lowerColumnName.includes('area')) {
    const areas = ['AI', 'Robotics', 'Renewable Energy', 'Medicine', 'Agriculture', 'Fintech', 'Education'];
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 areas
    const result = [];
    
    for (let i = 0; i < count; i++) {
      result.push(areas[Math.floor(Math.random() * areas.length)]);
    }
    
    return result;
  }
  
  // Specialization areas
  if (lowerColumnName.includes('specialization')) {
    const specializations = ['Machine Learning', 'Data Analysis', 'Biotechnology', 'Sustainable Development', 'Renewable Energy', 'Digital Transformation'];
    const count = Math.floor(Math.random() * 2) + 1; // 1-2 specializations
    const result = [];
    
    for (let i = 0; i < count; i++) {
      result.push(specializations[Math.floor(Math.random() * specializations.length)]);
    }
    
    return result;
  }
  
  // Project history
  if (lowerColumnName.includes('history')) {
    const projects = ['AI for Healthcare', 'Smart Agriculture', 'Renewable Energy Storage', 'Digital Transformation Initiative', 'Smart City Solutions'];
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 projects
    const result = [];
    
    for (let i = 0; i < count; i++) {
      result.push(projects[Math.floor(Math.random() * projects.length)]);
    }
    
    return result;
  }
  
  // Default array
  return [`Item ${Math.floor(Math.random() * 10) + 1}`];
}
