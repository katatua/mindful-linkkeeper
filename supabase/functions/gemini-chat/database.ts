
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
      return `Erro ao executar a consulta SQL: ${error.message}\n\nA consulta que foi tentada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
    }
    
    // Format the results in a nice table
    let formattedResponse = "";
    if (Array.isArray(data) && data.length > 0) {
      const resultCount = data.length;
      const resultSummary = resultCount === 1 ? "1 resultado encontrado" : `${resultCount} resultados encontrados`;
      
      formattedResponse = `# Conteúdo do Banco de Dados (${resultSummary})\n\n`;
      
      // Check if this is a table count query with table_name field
      if (data[0].table_name) {
        // Create a markdown table
        formattedResponse += "| Tabela | Contagem de Registros |\n";
        formattedResponse += "|-------|-------------:|\n";
        
        data.forEach((row: any) => {
          formattedResponse += `| ${row.table_name} | ${row.record_count || row.num_records || 0} |\n`;
        });
      } else {
        // For other queries, format as JSON
        formattedResponse += "```json\n" + JSON.stringify(data, null, 2) + "\n```\n\n";
      }
      
      formattedResponse += `\nConsulta executada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
      return formattedResponse;
    } else {
      return `Nenhum dado encontrado no banco de dados. As tabelas parecem estar vazias.\n\nConsulta executada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
    }
  } catch (error) {
    console.error("Error in SQL execution:", error);
    return `Ocorreu um erro ao processar sua consulta: ${error.message}`;
  }
}
