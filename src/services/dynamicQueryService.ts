
import { supabase } from "@/integrations/supabase/client";
import { ClassificationRequest } from "@/utils/aiUtils";

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
      
      // Generate SQL using Gemini model which is better at code generation
      const { data, error } = await supabase.functions.invoke('generate-sql', {
        body: { 
          question: request.question,
          language: request.language || 'en',
        }
      });
      
      if (error) {
        console.error("Error generating SQL:", error);
        throw new Error("Failed to generate SQL query");
      }
      
      if (!data.sql) {
        throw new Error("No SQL was generated");
      }
      
      console.log("Generated SQL:", data.sql);
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
      
      // Generate a natural language response from the query results
      const nlResponse = await dynamicQueryService.generateNaturalLanguageResponse({
        question: "What does this data show?",
        sqlQuery: sql,
        queryResults: data.result || []
      });
      
      return { 
        response: nlResponse,
        visualizationData: data.result,
        sql: sql
      };
    } catch (error) {
      console.error("Error in query execution:", error);
      return { 
        response: `I'm sorry, I couldn't retrieve the data due to a technical issue: ${error.message}`,
        sql: sql
      };
    }
  },
  
  /**
   * Process a natural language question end-to-end - generate SQL, execute it, and return results
   */
  processQuestion: async (question: string, language: 'en' | 'pt' = 'en'): Promise<QueryExecutionResult> => {
    try {
      console.log("Processing question:", question);
      
      // Check if this is likely a database query or just a general question
      const isDbQuery = await dynamicQueryService.classifyQuestion(question);
      
      if (!isDbQuery) {
        return {
          response: "This doesn't appear to be a database query. Please ask about ANI data, metrics, or patterns.",
          sql: ""
        };
      }
      
      // Generate SQL from the natural language question
      const sqlQuery = await dynamicQueryService.generateSqlFromQuestion({
        question,
        language
      });
      
      // Execute the generated SQL
      return await dynamicQueryService.executeQuery(sqlQuery);
    } catch (error) {
      console.error("Error processing question:", error);
      return {
        response: `I'm sorry, I couldn't process your question. ${error.message}`,
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
      const data: ClassificationRequest = {
        title: question,
        summary: question
      };
      
      // This uses the existing classify-document edge function 
      const classification = await supabase.functions.invoke('classify-document', {
        body: data
      });
      
      // Consider database related classifications
      const dbRelatedClassifications = ['database', 'metrics', 'statistics', 'data', 'query'];
      const result = classification?.data?.classification || '';
      
      return dbRelatedClassifications.some(cls => result.toLowerCase().includes(cls));
    } catch (error) {
      console.error("Error classifying question:", error);
      // Default to true to attempt the query anyway
      return true;
    }
  }
};
