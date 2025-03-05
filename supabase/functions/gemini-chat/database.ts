
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./utils.ts";

// Function to handle database queries
export async function handleDatabaseQuery(sqlQuery: string, originalResponse: string): Promise<string> {
  try {
    console.log("Executing SQL query:", sqlQuery);
    
    // Initialize Supabase client with service role key for database access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Execute the SQL query directly using Supabase's query method
    const { data: queryResults, error: queryError } = await supabase
      .from('_dummy_query')
      .select('*', { count: 'exact', head: true })
      .then(async () => {
        // The above query is just a placeholder to initialize the connection
        // Now we run the actual raw SQL query
        return await supabase.rpc('execute_sql_query', { sql_query: sqlQuery });
      });
    
    if (queryError) {
      console.error("SQL query execution error:", queryError);
      return `Erro ao executar a consulta SQL: ${queryError.message}\n\nA consulta que foi tentada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
    }
    
    // Format the results nicely
    const resultCount = Array.isArray(queryResults) ? queryResults.length : 0;
    const resultSummary = resultCount === 1 ? "1 resultado encontrado" : `${resultCount} resultados encontrados`;
    
    // Generate response with results
    if (resultCount > 0) {
      let formattedResponse = `# Conteúdo do Banco de Dados (${resultSummary})\n\n`;
      
      // Check if this is a table count query
      if (queryResults[0].table_name) {
        formattedResponse += "| Tabela | Contagem de Registros |\n";
        formattedResponse += "|-------|-------------:|\n";
        
        queryResults.forEach((result: any) => {
          formattedResponse += `| ${result.table_name} | ${result.record_count || result.num_records || 0} |\n`;
        });
      } else {
        // Generic JSON format for other queries
        formattedResponse += "```json\n" + JSON.stringify(queryResults, null, 2) + "\n```\n\n";
      }
      
      formattedResponse += `\nConsulta executada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
      return formattedResponse;
    } else {
      return `Nenhum dado encontrado no banco de dados. As tabelas parecem estar vazias.\n\nConsulta executada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
    }
  } catch (sqlExecError) {
    console.error("Error in SQL execution:", sqlExecError);
    return `Ocorreu um erro ao processar sua consulta: ${sqlExecError.message}`;
  }
}
