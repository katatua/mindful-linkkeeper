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
      
      return formatQueryResults(data || [], sqlQuery, originalResponse);
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
        return formatQueryResults(data, sqlQuery, originalResponse);
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
function formatQueryResults(data: any[], sqlQuery: string, originalResponse: string): string {
  if (!Array.isArray(data) || data.length === 0) {
    return `Nenhum dado encontrado no banco de dados. As tabelas parecem estar vazias.\n\nConsulta executada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
  }
  
  // Keep track of whether the original response contained the SQL query
  const includesSql = originalResponse.includes("<SQL>") && originalResponse.includes("</SQL>");
  
  // Extract the AI's explanation/context if present (everything before the SQL tags)
  let aiContext = "";
  if (includesSql) {
    const beforeSql = originalResponse.split("<SQL>")[0].trim();
    if (beforeSql) {
      aiContext = beforeSql + "\n\n";
    }
  }
  
  let naturalLanguageIntro = "";
  
  // Check what kind of data we're dealing with to create appropriate natural language intro
  
  // R&D Investment metric
  if (sqlQuery.toLowerCase().includes("r&d") || sqlQuery.toLowerCase().includes("p&d")) {
    if (data[0].name && data[0].value && data[0].unit && data[0].measurement_date) {
      const { name, value, unit, measurement_date, source } = data[0];
      const formattedDate = new Date(measurement_date).toLocaleDateString('pt-PT', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });
      naturalLanguageIntro = `De acordo com os dados mais recentes ${source ? `de ${source}` : ''} (${formattedDate}), o ${name} em Portugal é de ${value} ${unit}.\n\n`;
    }
  }
  
  // Patents metric
  else if (sqlQuery.toLowerCase().includes("patent") || sqlQuery.toLowerCase().includes("patente")) {
    if (data[0].name && data[0].value && data[0].unit && data[0].measurement_date) {
      const { name, value, unit, measurement_date, source } = data[0];
      const formattedDate = new Date(measurement_date).toLocaleDateString('pt-PT', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });
      naturalLanguageIntro = `De acordo com os dados mais recentes ${source ? `de ${source}` : ''} (${formattedDate}), ${name} em Portugal é de ${value} ${unit}.\n\n`;
    }
  }
  
  // Active projects count
  else if (sqlQuery.toLowerCase().includes("count") && sqlQuery.toLowerCase().includes("active")) {
    if (data[0].total_active_projects) {
      naturalLanguageIntro = `Atualmente, existem ${data[0].total_active_projects} projetos ativos na Agência Nacional de Inovação.\n\n`;
    }
  }
  
  // Format the result
  let formattedResponse = aiContext + naturalLanguageIntro;
  
  // If we're dealing with a result with table_name field (like a count query)
  if (data[0].table_name) {
    // Create a markdown table
    formattedResponse += "| Tabela | Contagem de Registros |\n";
    formattedResponse += "|-------|-------------:|\n";
    
    data.forEach((row: any) => {
      formattedResponse += `| ${row.table_name} | ${row.record_count || row.count || 0} |\n`;
    });
  } 
  // If it's a single row with total_active_projects
  else if (data.length === 1 && data[0].total_active_projects !== undefined) {
    formattedResponse += `**Total de Projetos Ativos**: ${data[0].total_active_projects}\n`;
  }
  // R&D Investment or similar metric
  else if (data.length === 1 && data[0].name && data[0].value && data[0].unit) {
    formattedResponse += `**${data[0].name}**: ${data[0].value} ${data[0].unit}\n`;
    if (data[0].measurement_date) {
      const date = new Date(data[0].measurement_date);
      formattedResponse += `**Data da Medição**: ${date.toLocaleDateString('pt-PT')}\n`;
    }
    if (data[0].source) {
      formattedResponse += `**Fonte**: ${data[0].source}\n`;
    }
  }
  // For other queries with multiple rows or complex data
  else {
    // Format as JSON for debugging but try to make a nice table if possible
    let canUseTable = true;
    const columns = Object.keys(data[0]);
    
    if (columns.length <= 6) { // Limit to 6 columns for readability
      // Create a markdown table
      formattedResponse += "| " + columns.join(" | ") + " |\n";
      formattedResponse += "|" + columns.map(() => "---").join("|") + "|\n";
      
      data.forEach((row: any) => {
        let rowText = "| ";
        columns.forEach(col => {
          let value = row[col];
          // Format dates
          if (col.includes('date') && value) {
            try {
              value = new Date(value).toLocaleDateString('pt-PT');
            } catch (e) {
              // Keep original if date parsing fails
            }
          }
          // Format arrays
          if (Array.isArray(value)) {
            value = value.join(", ");
          }
          // Handle null/undefined
          if (value === null || value === undefined) {
            value = "-";
          }
          rowText += value + " | ";
        });
        formattedResponse += rowText.trim() + "\n";
      });
    } else {
      canUseTable = false;
    }
    
    // If we can't make a nice table, fall back to JSON
    if (!canUseTable) {
      formattedResponse += "```json\n" + JSON.stringify(data, null, 2) + "\n```\n\n";
    }
  }
  
  // Only include the SQL query if we aren't already responding to an AI message that included the SQL
  if (!includesSql) {
    formattedResponse += `\n**Consulta executada:**\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
  }
  
  return formattedResponse;
}
