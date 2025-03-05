
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./utils.ts";

// Function to handle database queries
export async function handleDatabaseQuery(sqlQuery: string, originalResponse: string): Promise<string> {
  try {
    // Clean up the SQL query by removing trailing semicolons which can cause syntax errors
    const cleanedQuery = sqlQuery.trim().replace(/;+$/, '');
    
    console.log("Executing SQL query:", cleanedQuery);
    
    // Initialize Supabase client with service role key for database access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Make sure query is SELECT only for security
    if (!cleanedQuery.toLowerCase().startsWith('select')) {
      return `Erro: Por razões de segurança, apenas consultas SELECT são permitidas.\n\nA consulta que foi tentada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
    }
    
    // Try using the execute_sql_query function
    try {
      const { data, error } = await supabase.rpc('execute_sql_query', { 
        sql_query: cleanedQuery 
      });
      
      if (error) {
        throw new Error(`SQL function error: ${error.message}`);
      }
      
      return formatQueryResults(data || [], sqlQuery);
    } catch (functionError) {
      console.error("Error calling execute_sql_query:", functionError);
      
      // If the function call fails, try direct query using fetch
      try {
        console.log("Attempting direct REST API call...");
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/rpc/execute_sql_query`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'apikey': SUPABASE_SERVICE_ROLE_KEY
            },
            body: JSON.stringify({ sql_query: cleanedQuery })
          }
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Database query failed: ${errorText}`);
        }
        
        const data = await response.json();
        return formatQueryResults(data, sqlQuery);
      } catch (fetchError) {
        console.error("Direct fetch error:", fetchError);
        return `Erro ao executar a consulta SQL: ${fetchError.message}\n\nTente fazer uma consulta mais simples ou contate o administrador do sistema.\n\nA consulta que foi tentada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
      }
    }
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
