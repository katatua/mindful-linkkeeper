
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { generateDummyResponse } from "@/utils/dummyData";
import { generateSqlFromNaturalLanguage } from "@/utils/sqlGeneration";

export interface QueryResult {
  response: string;
  visualizationData?: any[];
  sql?: string;
  error?: string;
  isConnectionError?: boolean;
}

export function useQueryProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<QueryResult | null>(null);
  const [useOfflineMode, setUseOfflineMode] = useState(false);

  /**
   * Toggle between online and offline mode
   */
  const toggleOfflineMode = (forceOffline?: boolean) => {
    const newMode = forceOffline !== undefined ? forceOffline : !useOfflineMode;
    setUseOfflineMode(newMode);
    toast.info(newMode ? "Offline mode activated" : "Online mode activated", {
      description: newMode 
        ? "Using dummy data for responses" 
        : "Using database for responses"
    });
    return newMode;
  };

  /**
   * Process a question using NL to SQL conversion and execute it
   */
  const processQuestion = async (question: string, language: 'en' | 'pt' = 'en'): Promise<QueryResult> => {
    try {
      setIsProcessing(true);
      // Always set lastResult to null when starting a new query
      setLastResult(null);
      
      console.log("Processing question:", question);
      
      // If in offline mode, use dummy data directly
      if (useOfflineMode || (supabase as any).isUsingLocalDb) {
        console.log("Using local/offline mode");
        
        // Generate a SQL query for display purposes even in offline mode
        let sqlQuery = "";
        try {
          sqlQuery = await generateSqlFromNaturalLanguage(question);
          console.log("Generated SQL for offline mode:", sqlQuery);
        } catch (sqlGenError) {
          console.error("Error generating SQL in offline mode:", sqlGenError);
          sqlQuery = `-- Failed to generate SQL: ${sqlGenError instanceof Error ? sqlGenError.message : String(sqlGenError)}`;
        }
        
        const dummyResult = generateDummyResponse(question, language);
        const result = {
          response: dummyResult.response,
          visualizationData: dummyResult.visualizationData,
          sql: sqlQuery || "-- Using local database"
        };
        
        setLastResult(result);
        return result;
      }
      
      // First, check if we can connect to the database
      try {
        const { error: connError } = await supabase
          .from('ani_database_status')
          .select('count(*)', { count: 'exact', head: true });
          
        if (connError) {
          console.error("Database connection check failed:", connError);
          toggleOfflineMode(true);
          
          // Try to generate SQL even if we switch to offline mode
          let fallbackSql = "";
          try {
            fallbackSql = await generateSqlFromNaturalLanguage(question);
          } catch (e) {
            fallbackSql = "-- Connection error, using local data";
          }
          
          const dummyResult = generateDummyResponse(question, language);
          return {
            response: dummyResult.response,
            visualizationData: dummyResult.visualizationData,
            sql: fallbackSql,
            isConnectionError: true
          };
        }
      } catch (connErr) {
        console.error("Connection error:", connErr);
        toggleOfflineMode(true);
        
        // Try to generate SQL even if we switch to offline mode
        let fallbackSql = "";
        try {
          fallbackSql = await generateSqlFromNaturalLanguage(question);
        } catch (e) {
          fallbackSql = "-- Connection error, using local data";
        }
        
        const dummyResult = generateDummyResponse(question, language);
        return {
          response: dummyResult.response,
          visualizationData: dummyResult.visualizationData,
          sql: fallbackSql,
          isConnectionError: true
        };
      }
      
      // Generate SQL from the natural language question
      let sqlQuery;
      try {
        console.log("Generating SQL from natural language question");
        const { data, error } = await supabase.functions.invoke('generate-sql', {
          body: { 
            question,
            language
          }
        });
        
        if (error) {
          console.error("Error generating SQL:", error);
          throw new Error(`Failed to generate SQL: ${error.message}`);
        }
        
        if (!data?.sql) {
          console.warn("No SQL was generated");
          throw new Error("No SQL was generated for your question");
        }
        
        sqlQuery = data.sql;
        console.log("Generated SQL:", sqlQuery);
      } catch (sqlGenError) {
        console.error("Error generating SQL:", sqlGenError);
        sqlQuery = await generateSqlFromNaturalLanguage(question);
        console.log("Using fallback SQL generation:", sqlQuery);
      }
      
      if (!sqlQuery) {
        throw new Error("Could not generate SQL query");
      }
      
      // Execute the SQL query
      try {
        console.log("Executing SQL query:", sqlQuery);
        const { data, error } = await supabase.functions.invoke('execute-sql', {
          body: { 
            sqlQuery,
            operation: 'query'
          }
        });
        
        if (error) {
          console.error("Error executing SQL:", error);
          throw new Error(`Failed to execute SQL: ${error.message}`);
        }
        
        // Generate natural language response from results
        let nlResponse;
        try {
          nlResponse = await generateNaturalLanguageInterpretation(question, sqlQuery, data.result || []);
        } catch (nlError) {
          console.error("Error generating natural language response:", nlError);
          nlResponse = `Query executed successfully. Found ${data.result?.length || 0} records.`;
        }
        
        const queryResult: QueryResult = {
          response: nlResponse,
          visualizationData: data.result || [],
          sql: sqlQuery
        };
        
        setLastResult(queryResult);
        return queryResult;
      } catch (execError) {
        console.error("Error executing SQL:", execError);
        
        // If it's a connection error, use dummy data
        if (execError instanceof Error && 
            (execError.message?.includes('connection') || 
            execError.message?.includes('network'))) {
          toggleOfflineMode(true);
          const dummyResult = generateDummyResponse(question, language);
          return {
            response: dummyResult.response,
            visualizationData: dummyResult.visualizationData,
            sql: sqlQuery,
            isConnectionError: true
          };
        }
        
        throw execError;
      }
    } catch (error) {
      console.error("Error processing question:", error);
      
      // Try to generate SQL for display even in error case
      let errorSql = "";
      try {
        errorSql = await generateSqlFromNaturalLanguage(question);
      } catch (e) {
        errorSql = `-- Error generating SQL: ${e instanceof Error ? e.message : String(e)}`;
      }
      
      // Fallback to dummy data for any error
      const dummyResult = generateDummyResponse(question, language);
      const result: QueryResult = {
        response: dummyResult.response,
        visualizationData: dummyResult.visualizationData,
        sql: errorSql,
        error: error instanceof Error ? error.message : String(error)
      };
      
      setLastResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  };
  
  /**
   * Generate a natural language interpretation of query results
   */
  const generateNaturalLanguageInterpretation = async (
    question: string,
    sqlQuery: string,
    results: any[]
  ): Promise<string> => {
    try {
      if (!results || results.length === 0) {
        return "The query did not return any results.";
      }
      
      // For small result sets, generate a simpler response
      if (results.length <= 5) {
        return `Here are the results for your query about ${question.toLowerCase()}: ${results.length} records found.`;
      }
      
      const { data, error } = await supabase.functions.invoke('interpret-results', {
        body: { 
          question,
          sqlQuery,
          results: results.slice(0, 20) // Limit to first 20 results for interpretation
        }
      });
      
      if (error) {
        throw new Error(`Error interpreting results: ${error.message}`);
      }
      
      return data.interpretation || `Found ${results.length} records matching your query.`;
    } catch (error) {
      console.error("Error generating natural language interpretation:", error);
      return `Found ${results.length} records matching your query.`;
    }
  };

  return {
    isProcessing,
    lastResult,
    useOfflineMode,
    toggleOfflineMode,
    processQuestion,
    generateSqlFromNaturalLanguage
  };
}
