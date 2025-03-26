import { supabase } from "@/integrations/supabase/client";
import { ClassificationRequest } from "@/utils/aiUtils";
import { toast } from "sonner";
import { generateDummyResponse, findRelevantDummyData } from "@/utils/dummyData";

// Types for service operations
export interface QueryGenerationRequest {
  question: string;
  language?: 'en' | 'pt';
}

export interface QueryExecutionResult {
  response: string;
  visualizationData?: any[];
  sql?: string;
}

/**
 * Service for generating SQL queries dynamically from natural language questions
 * and executing them against the database
 */
export const dynamicQueryService = {
  /**
   * Generates a SQL query based on a natural language question using AI
   */
  generateSqlFromQuestion: async (request: QueryGenerationRequest): Promise<string> => {
    try {
      console.log('Generating SQL for question:', request.question);
      
      // Generate SQL using the edge function which uses Gemini
      const { data, error } = await supabase.functions.invoke('generate-sql', {
        body: { 
          question: request.question,
          language: request.language || 'en',
        }
      });
      
      if (error) {
        console.error("Error generating SQL:", error);
        throw new Error(`Failed to generate SQL query: ${error.message}`);
      }
      
      if (!data?.sql) {
        console.error("No SQL was generated. Response:", data);
        throw new Error("No SQL was generated for your question");
      }
      
      console.log("Generated SQL:", data.sql);
      
      // If there was a warning, show it to the user
      if (data.warning) {
        toast.warning("Query Generation Notice", {
          description: data.warning
        });
      }
      
      return data.sql;
    } catch (error) {
      console.error("Error in SQL generation:", error);
      throw error;
    }
  },
  
  /**
   * Executes a SQL query and returns formatted results
   */
  executeQuery: async (sql: string): Promise<QueryExecutionResult> => {
    try {
      console.log("Executing query:", sql);
      
      // Determine if this is an R&D investment query for fallback handling
      const isRdQuery = sql.toLowerCase().includes('r&d') || 
                          sql.toLowerCase().includes('research') || 
                          sql.toLowerCase().includes('investment');
      
      try {
        // First try direct database connection to see if it's available
        const { data: connCheck, error: connCheckError } = await supabase
          .from('ani_database_status')
          .select('count(*)', { count: 'exact', head: true });
          
        if (connCheckError) {
          throw new Error("Database connection unavailable - using offline data");
        }
        
        // Call the execute-sql edge function with the SQL query
        const { data, error } = await supabase.functions.invoke('execute-sql', {
          body: { 
            sqlQuery: sql,
            operation: 'query'
          }
        });
        
        if (error) {
          console.error("Error executing SQL:", error);
          throw new Error(`Failed to execute SQL query: ${error.message}`);
        }

        if (!data?.result) {
          console.warn("Query executed but returned no results:", data);
          // Return empty response but don't throw an error
          return { 
            response: "The query executed successfully but did not return any data.",
            visualizationData: [],
            sql: sql
          };
        }
        
        // Generate a natural language response from the query results
        let nlResponse;
        try {
          nlResponse = await dynamicQueryService.generateNaturalLanguageResponse({
            question: "What does this data show?",
            sqlQuery: sql,
            queryResults: data.result || []
          });
        } catch (nlError) {
          console.error("Error generating natural language response:", nlError);
          // Fallback to basic response
          nlResponse = `Query results shown below. ${data.result.length} records found.`;
        }
        
        return { 
          response: nlResponse,
          visualizationData: data.result,
          sql: sql
        };
      } catch (executeError) {
        console.error("Error executing query:", executeError);
        console.log("Falling back to offline dummy data");
        
        // Generate a response from dummy data
        const dummyResponseResult = generateDummyResponse(sql);
        return {
          response: dummyResponseResult.response,
          visualizationData: dummyResponseResult.visualizationData,
          sql
        };
      }
    } catch (error) {
      console.error("Error in query execution:", error);
      
      // Even if we have an error, try to return dummy data as a last resort
      try {
        console.log("Attempting to use dummy data as final fallback");
        const dummyResponseResult = generateDummyResponse(error.message);
        return {
          response: dummyResponseResult.response,
          visualizationData: dummyResponseResult.visualizationData,
          sql
        };
      } catch (dummyError) {
        return { 
          response: `I'm sorry, I couldn't retrieve the data due to a technical issue: ${error.message}`,
          sql: sql
        };
      }
    }
  },
  
  /**
   * Process a natural language question end-to-end - generate SQL, execute it, and return results
   */
  processQuestion: async (question: string, language: 'en' | 'pt' = 'en'): Promise<QueryExecutionResult> => {
    try {
      console.log("Processing question:", question);
      
      // Always treat the input as a database query
      const isDbQuery = true;
      
      if (!isDbQuery) {
        return {
          response: "This doesn't appear to be a database query. Please ask about ANI data, metrics, or patterns.",
          sql: ""
        };
      }
      
      try {
        // Check database connectivity first
        try {
          const { error: connCheckError } = await supabase
            .from('ani_database_status')
            .select('count(*)', { count: 'exact', head: true });
            
          if (connCheckError) {
            throw new Error("Database connection unavailable");
          }
          
          // Database is available, proceed with normal flow
          
          // Generate SQL from the natural language question using AI
          const sqlQuery = await dynamicQueryService.generateSqlFromQuestion({
            question,
            language
          });
          
          // Execute the generated SQL
          return await dynamicQueryService.executeQuery(sqlQuery);
        } catch (connError) {
          console.log("Database connection error, using offline data:", connError);
          
          // Use dummy data when the database is not available
          const dummyResult = generateDummyResponse(question, language);
          return {
            response: dummyResult.response,
            visualizationData: dummyResult.visualizationData,
            sql: ""
          };
        }
      } catch (error) {
        console.error("Error in SQL generation or execution:", error);
        
        // Fallback to dummy data
        console.log("Using dummy data as fallback");
        const dummyResult = generateDummyResponse(question, language);
        return {
          response: dummyResult.response,
          visualizationData: dummyResult.visualizationData,
          sql: ""
        };
      }
    } catch (error) {
      console.error("Error processing question:", error);
      
      // Final fallback - use dummy data even if there's a processing error
      const dummyResult = generateDummyResponse(question, language);
      return {
        response: dummyResult.response,
        visualizationData: dummyResult.visualizationData,
        sql: ""
      };
    }
  },
  
  /**
   * Generate a natural language response from SQL query results
   */
  generateNaturalLanguageResponse: async (params: {
    question: string;
    sqlQuery: string;
    queryResults: any[];
  }): Promise<string> => {
    try {
      const { question, sqlQuery, queryResults } = params;
      
      if (!queryResults || queryResults.length === 0) {
        return "The query did not return any results.";
      }
      
      // For small result sets, prepare a simple response
      if (queryResults.length <= 5) {
        const resultStr = JSON.stringify(queryResults, null, 2);
        return `Here are the results of your query: ${resultStr}`;
      }
      
      try {
        // Call the AI to interpret the results
        const { data, error } = await supabase.functions.invoke('interpret-results', {
          body: { 
            question: question,
            sqlQuery: sqlQuery,
            results: queryResults
          }
        });
        
        if (error) {
          console.error("Error interpreting results:", error);
          throw new Error("Failed to interpret query results");
        }
        
        return data.response || "No explanation was generated for these results.";
      } catch (interpretError) {
        console.error("Error calling interpret-results:", interpretError);
        
        // Simple fallback formatting when AI interpretation fails
        const recordCount = queryResults.length;
        const columnNames = Object.keys(queryResults[0]).join(", ");
        
        return `Query returned ${recordCount} records with the following columns: ${columnNames}. You can view the data in the visualization section below.`;
      }
    } catch (error) {
      console.error("Error generating natural language response:", error);
      return `Here are the query results. (Error generating explanation: ${error.message})`;
    }
  },
  
  /**
   * Classify if a question is likely a database query
   */
  classifyQuestion: async (question: string): Promise<boolean> => {
    try {
      // Convert to lowercase for case-insensitive matching
      const lowerQuestion = question.toLowerCase();
      
      // Database-related keywords that strongly indicate a query
      const dbKeywords = [
        'r&d', 'investment', 'funding', 'metrics', 'data',
        'research', 'development', 'project', 'patent',
        'sector', 'region', 'total', 'count', 'average',
        'year', 'budget', 'distribution', 'program',
        'statistics', 'growth', 'trend', 'allocation',
        'compare', 'find', 'show', 'list', 'what is',
        'how many', 'how much', 'ani', 'database'
      ];
      
      // Check for direct keyword matches
      for (const keyword of dbKeywords) {
        if (lowerQuestion.includes(keyword)) {
          console.log(`Classified as DB query by keyword: "${keyword}"`);
          return true;
        }
      }
      
      // For safety, always return true to attempt the database query
      return true;
    } catch (error) {
      console.error("Error classifying question:", error);
      // Default to true to attempt the query anyway
      return true;
    }
  }
};
