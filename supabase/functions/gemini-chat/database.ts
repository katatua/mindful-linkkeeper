
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./utils.ts";

// Function to handle database queries
export async function handleDatabaseQuery(sqlQuery: string, originalResponse: string): Promise<string> {
  try {
    console.log("Executing SQL query:", sqlQuery);
    
    // Initialize Supabase client with service role key for database access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Execute the SQL query using the custom function
    const { data: queryResults, error: queryError } = await supabase.rpc('execute_sql_query', {
      sql_query: sqlQuery
    });
    
    if (queryError) {
      console.error("SQL query execution error:", queryError);
      return `Encontrei um erro ao executar a consulta SQL: ${queryError.message}\n\nA consulta que tentei executar foi:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
    } else {
      // Format the results nicely
      const resultCount = Array.isArray(queryResults) ? queryResults.length : 0;
      const resultSummary = resultCount === 1 ? "1 resultado encontrado" : `${resultCount} resultados encontrados`;
      
      // Generate response with results
      if (resultCount > 0) {
        const formattedResults = JSON.stringify(queryResults, null, 2);
        return `Aqui estão os resultados da sua consulta (${resultSummary}):\n\n\`\`\`json\n${formattedResults}\n\`\`\`\n\nA consulta executada foi:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
      } else {
        return `Não encontrei resultados para sua consulta. A consulta executada foi:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
      }
    }
  } catch (sqlExecError) {
    console.error("Error in SQL execution:", sqlExecError);
    return `Ocorreu um erro ao processar sua consulta: ${sqlExecError.message}`;
  }
}
