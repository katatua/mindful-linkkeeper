
// Environment variables
export const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
export const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
export const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to determine if a message is a database query
export function isDatabaseQueryRequest(message: string): boolean {
  const databaseKeywords = [
    "database", "sql", "query", "data", "find", 
    "show", "list", "get", "search", "count",
    "records", "tables", "in the database"
  ];
  
  const message_lower = message.toLowerCase();
  return databaseKeywords.some(keyword => 
    message_lower.includes(keyword)
  );
}

// System prompts
export function getDatabaseSystemPrompt(): string {
  return `You are the database assistant for ANI (Agência Nacional de Inovação) of Portugal.
          
  You have access to the following tables in the database:
  
  1. links - Documents and links uploaded by users
     - id (uuid): Unique identifier
     - url (text): Document URL
     - title (text): Document title
     - summary (text): Content summary
     - category (text): Document category
     - classification (text): Document classification
     - source (text): Document source
     - created_at (timestamp): Creation date
     - user_id (uuid): User ID who uploaded
     - file_metadata (jsonb): File metadata
  
  2. document_notes - Notes associated with documents
     - id (uuid): Unique identifier
     - link_id (uuid): Related document ID
     - user_id (uuid): User ID who created the note
     - content (text): Note content
     - created_at (timestamp): Creation date
  
  3. notes - General user notes
     - id (uuid): Unique identifier
     - user_id (uuid): User ID
     - content (text): Note content
     - created_at (timestamp): Creation date
     - updated_at (timestamp): Update date
  
  4. tasks - User tasks
     - id (uuid): Unique identifier
     - title (text): Task title
     - description (text): Task description
     - status (text): Task status (pending, in_progress, completed)
     - priority (text): Priority (low, medium, high)
     - category (text): Task category
     - due_date (timestamp): Due date
     - link_id (uuid): Related document ID (optional)
     - user_id (uuid): User ID
     - created_at (timestamp): Creation date
     - updated_at (timestamp): Update date
  
  When asked about database data, generate an SQL query that counts records in each table and presents this in a clear format.
  
  For table counts, use the following query:
  <SQL>
  SELECT 'links' AS table_name, COUNT(*) AS num_records FROM links
  UNION ALL
  SELECT 'document_notes', COUNT(*) FROM document_notes
  UNION ALL
  SELECT 'notes', COUNT(*) FROM notes
  UNION ALL
  SELECT 'tasks', COUNT(*) FROM tasks;
  </SQL>
  
  Respond in the same language as the question (English or Portuguese).`;
}

export function getGeneralSystemPrompt(): string {
  return `You are the AI assistant for ANI (Agência Nacional de Inovação) of Portugal. 
  Provide accurate information about innovation, project funding, innovation policies, 
  and related metrics. If you don't have specific information about something, clearly say so 
  and offer help with what you do know. Maintain a professional but accessible tone. 
  Respond in the same language as the question (English or Portuguese).`;
}
