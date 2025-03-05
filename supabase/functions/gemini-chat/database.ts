
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./utils.ts";

// Function to handle database queries
export async function handleDatabaseQuery(sqlQuery: string, originalResponse: string): Promise<string> {
  try {
    console.log("Executing SQL query:", sqlQuery);
    
    // Initialize Supabase client with service role key for database access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Execute the SQL query directly
    const { data, error } = await supabase.rpc('execute_sql_query', { sql_query: sqlQuery });
    
    if (error) {
      console.error("SQL query execution error:", error);
      
      // If the function doesn't exist, try direct query instead
      if (error.message.includes("Could not find the function")) {
        console.log("Function not found, trying direct query...");
        
        // Execute the query directly if it's only a SELECT statement
        if (!sqlQuery.trim().toLowerCase().startsWith('select')) {
          return `Erro: Por razões de segurança, apenas consultas SELECT são permitidas.\n\nA consulta que foi tentada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
        }
        
        // Execute raw query using rpc instead of .execute() which was causing the error
        const { data: rawData, error: rawError } = await supabase.rpc('execute_raw_query', { 
          sql_query: sqlQuery 
        });
        
        if (rawError) {
          console.error("Raw SQL query error:", rawError);
          return `Erro ao executar a consulta SQL: ${rawError.message}\n\nTente fazer uma consulta mais simples ou contate o administrador do sistema.\n\nA consulta que foi tentada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
        }
        
        return formatQueryResults(rawData || [], sqlQuery);
      }
      
      return `Erro ao executar a consulta SQL: ${error.message}\n\nA consulta que foi tentada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
    }
    
    return formatQueryResults(data || [], sqlQuery);
    
  } catch (error) {
    console.error("Error in SQL execution:", error);
    return `Ocorreu um erro ao processar sua consulta: ${error.message}`;
  }
}

// Helper function to format query results
function formatQueryResults(data: any[], sqlQuery: string): string {
  if (!Array.isArray(data) || data.length === 0) {
    return `Nenhum dado encontrado no banco de dados. As tabelas parecem estar vazias.\n\nConsulta executada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
  }
  
  const resultCount = data.length;
  const resultSummary = resultCount === 1 ? "1 resultado encontrado" : `${resultCount} resultados encontrados`;
  
  let formattedResponse = `# Conteúdo do Banco de Dados (${resultSummary})\n\n`;
  
  // Check if this is a table count query with table_name field
  if (data[0].table_name) {
    // Create a markdown table
    formattedResponse += "| Tabela | Contagem de Registros |\n";
    formattedResponse += "|-------|-------------:|\n";
    
    data.forEach((row: any) => {
      formattedResponse += `| ${row.table_name} | ${row.record_count || row.count || 0} |\n`;
    });
  } else {
    // For other queries, format as JSON
    formattedResponse += "```json\n" + JSON.stringify(data, null, 2) + "\n```\n\n";
  }
  
  formattedResponse += `\nConsulta executada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
  return formattedResponse;
}
