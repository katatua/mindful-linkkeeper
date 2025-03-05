
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
      return `There was an error executing the SQL query: ${queryError.message}\n\nThe query that was attempted:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
    }
    
    // Format the results nicely
    const resultCount = Array.isArray(queryResults) ? queryResults.length : 0;
    const resultSummary = resultCount === 1 ? "1 result found" : `${resultCount} results found`;
    
    // Generate response with results
    if (resultCount > 0) {
      let formattedResponse = `# Database Content (${resultSummary})\n\n`;
      
      // Check if this is a table count query
      if (queryResults[0].table_name) {
        formattedResponse += "| Table | Record Count |\n";
        formattedResponse += "|-------|-------------:|\n";
        
        queryResults.forEach((result: any) => {
          formattedResponse += `| ${result.table_name} | ${result.num_records} |\n`;
        });
      } else {
        // Generic JSON format for other queries
        formattedResponse += "```json\n" + JSON.stringify(queryResults, null, 2) + "\n```\n\n";
      }
      
      formattedResponse += `\nQuery executed:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
      return formattedResponse;
    } else {
      return `No data found in the database. The tables appear to be empty.\n\nQuery executed:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
    }
  } catch (sqlExecError) {
    console.error("Error in SQL execution:", sqlExecError);
    return `An error occurred while processing your query: ${sqlExecError.message}`;
  }
}
