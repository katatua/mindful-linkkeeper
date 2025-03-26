import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { executeQuery } from "@/utils/queryExecution";
import { generateSqlFromNaturalLanguage } from "@/utils/sqlGeneration";
import { toast } from "sonner";
import { isMetricsQuery } from "@/utils/queryDetection";
import { dynamicQueryService } from "@/services/dynamicQueryService";
import { generateDummyResponse } from "@/utils/dummyData";

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
  const [query, setQuery] = useState<string>('');
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [interpretation, setInterpretation] = useState<string>('');
  const [error, setError] = useState<string>('');

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
   * Execute a SQL query directly with improved connection error handling
   */
  const executeQueryDirectly = async (sql: string): Promise<QueryResult> => {
    try {
      setIsProcessing(true);
      
      // If in offline mode, use dummy data
      if (useOfflineMode) {
        console.log("Using offline mode, returning dummy data");
        const dummyResult = generateDummyResponse(sql);
        const queryResult: QueryResult = {
          response: dummyResult.response,
          visualizationData: dummyResult.visualizationData,
          sql
        };
        setLastResult(queryResult);
        return queryResult;
      }
      
      // Check for connectivity to Supabase before executing the query
      try {
        const { data: connCheck, error: connError } = await supabase.from('ani_database_status').select('count(*)', { count: 'exact', head: true });
        
        if (connError) {
          console.error("Database connection check failed:", connError);
          console.log("Switching to offline mode due to connection error");
          toggleOfflineMode(true);
          const dummyResult = generateDummyResponse(sql);
          return {
            response: dummyResult.response,
            visualizationData: dummyResult.visualizationData,
            sql,
            isConnectionError: true
          };
        }
      } catch (connErr) {
        console.error("Connection check error:", connErr);
        toggleOfflineMode(true);
        const dummyResult = generateDummyResponse(sql);
        return {
          response: dummyResult.response,
          visualizationData: dummyResult.visualizationData,
          sql,
          isConnectionError: true
        };
      }
      
      const result = await executeQuery(sql);
      
      const queryResult: QueryResult = {
        response: result.response,
        visualizationData: result.visualizationData,
        sql
      };
      
      setLastResult(queryResult);
      return queryResult;
    } catch (error) {
      console.error("Error executing query:", error);
      
      // Determine if this is a connection error
      const isConnectionError = error instanceof Error && (
        error.message?.includes('Failed to send a request') || 
        error.message?.includes('network error') ||
        error.message?.includes('connection') ||
        error.message?.includes('timeout')
      );
      
      if (isConnectionError) {
        console.log("Connection error detected, using dummy data");
        toggleOfflineMode(true);
        const dummyResult = generateDummyResponse(sql);
        const errorResult: QueryResult = {
          response: dummyResult.response,
          visualizationData: dummyResult.visualizationData,
          sql,
          error: error instanceof Error ? error.message : String(error),
          isConnectionError: true
        };
        setLastResult(errorResult);
        return errorResult;
      }
      
      const errorResult: QueryResult = {
        response: `Error executing query: ${error instanceof Error ? error.message : String(error)}`,
        sql,
        error: error instanceof Error ? error.message : String(error),
        isConnectionError
      };
      
      // Log additional information for debugging
      console.log("Error details:", {
        errorType: error.constructor?.name,
        stack: error instanceof Error ? error.stack : '',
        isConnectionError
      });
      
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Process a natural language question to SQL and execute it
   */
  const processNaturalLanguageQuery = async (question: string): Promise<QueryResult> => {
    try {
      setIsProcessing(true);
      
      // If in offline mode, use dummy data
      if (useOfflineMode) {
        console.log("Using offline mode, returning dummy data");
        const dummyResult = generateDummyResponse(question);
        return {
          response: dummyResult.response,
          visualizationData: dummyResult.visualizationData
        };
      }
      
      // First generate SQL from the natural language question
      const sql = await generateSqlFromNaturalLanguage(question);
      
      if (!sql) {
        throw new Error("Failed to generate SQL query from question");
      }
      
      console.log("Generated SQL from natural language:", sql);
      
      // Execute the generated SQL
      return await executeQueryDirectly(sql);
    } catch (error) {
      console.error("Error processing natural language query:", error);
      
      // If this appears to be a connection error, use dummy data
      const isConnectionError = error instanceof Error && (
        error.message?.includes('connection') || 
        error.message?.includes('network') ||
        error.message?.includes('Failed to send')
      );
      
      if (isConnectionError) {
        console.log("Connection error detected, using dummy data");
        toggleOfflineMode(true);
        const dummyResult = generateDummyResponse(question);
        return {
          response: dummyResult.response,
          visualizationData: dummyResult.visualizationData,
          error: error instanceof Error ? error.message : String(error),
          isConnectionError: true
        };
      }
      
      toast.error("Failed to process question", {
        description: error instanceof Error ? error.message : String(error)
      });
      
      const errorResult: QueryResult = {
        response: `Error processing question: ${error instanceof Error ? error.message : String(error)}`,
        error: error instanceof Error ? error.message : String(error),
        isConnectionError: error instanceof Error && error.message?.includes('connection')
      };
      
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Process a question using the dynamic query service with improved error handling
   */
  const processQuestion = async (question: string, language: 'en' | 'pt' = 'en'): Promise<QueryResult> => {
    try {
      setIsProcessing(true);
      
      // If in offline mode, use dummy data directly
      if (useOfflineMode) {
        console.log("Using offline mode, returning dummy data");
        const dummyResult = generateDummyResponse(question, language);
        return {
          response: dummyResult.response,
          visualizationData: dummyResult.visualizationData
        };
      }
      
      // Attempt connection check
      let connectionOk = true;
      try {
        const { error: connError } = await supabase.from('ani_database_status').select('count(*)', { count: 'exact', head: true });
        if (connError) {
          console.error("Database connection check failed:", connError);
          connectionOk = false;
        }
      } catch (connCheckError) {
        console.error("Connection check error:", connCheckError);
        connectionOk = false;
      }
      
      // If connection is down, use dummy data
      if (!connectionOk) {
        console.log("Connection is down, using dummy data response");
        toggleOfflineMode(true);
        const dummyResult = generateDummyResponse(question, language);
        return {
          response: dummyResult.response,
          visualizationData: dummyResult.visualizationData,
          isConnectionError: true
        };
      }
      
      try {
        // Attempt to process with dynamic query service
        const result = await dynamicQueryService.processQuestion(question, language);
        
        const queryResult: QueryResult = {
          response: result.response,
          visualizationData: result.visualizationData,
          sql: result.sql
        };
        
        setLastResult(queryResult);
        return queryResult;
      } catch (error) {
        console.error("Error in dynamicQueryService:", error);
        
        // Check if this is a connection error
        const isConnectionError = error instanceof Error && (
          error.message?.includes('Failed to send a request') || 
          error.message?.includes('network error') ||
          error.message?.includes('connection') ||
          error.message?.includes('timeout')
        );
        
        // Enhanced error logging
        console.log("Query processing error details:", {
          errorType: error.constructor?.name,
          stack: error instanceof Error ? error.stack : '',
          message: error instanceof Error ? error.message : '',
          isConnectionError
        });
        
        if (isConnectionError) {
          console.log("Connection error detected, using dummy data");
          toggleOfflineMode(true);
          const dummyResult = generateDummyResponse(question, language);
          return {
            response: dummyResult.response,
            visualizationData: dummyResult.visualizationData,
            error: error instanceof Error ? error.message : String(error),
            isConnectionError: true
          };
        }
        
        // For non-connection errors, still return an error
        const errorResult: QueryResult = {
          response: `Error processing question: ${error instanceof Error ? error.message : String(error)}`,
          error: error instanceof Error ? error.message : String(error),
          isConnectionError
        };
        setLastResult(errorResult);
        return errorResult;
      }
    } catch (error) {
      console.error("Error processing question:", error);
      
      // Fallback to dummy data for any error
      const dummyResult = generateDummyResponse(question, language);
      const errorResult: QueryResult = {
        response: dummyResult.response,
        visualizationData: dummyResult.visualizationData,
        error: error instanceof Error ? error.message : String(error),
        isConnectionError: error instanceof Error && 
          (error.message?.includes('connection') || error.message?.includes('network'))
      };
      
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Process a query using the Supabase functions
   */
  const processQuery = async (question: string) => {
    try {
      setIsProcessing(true);
      setQuery(question);

      // Generate SQL from the question
      const generateResponse = await supabase.functions.invoke('generate-sql', {
        body: { question }
      });

      if (generateResponse.error) {
        setError(generateResponse.error.message);
        setIsProcessing(false);
        return { success: false, error: generateResponse.error.message };
      }

      const { sql } = generateResponse.data;
      setSqlQuery(sql);

      // Execute the SQL query
      const executeResponse = await supabase.functions.invoke('execute-sql', {
        body: { sqlQuery: sql }
      });

      if (executeResponse.error) {
        setError(executeResponse.error.message);
        setIsProcessing(false);
        return { success: false, error: executeResponse.error.message };
      }

      // Get the results
      const result = executeResponse.data.result;
      setResults(result);

      // Interpret the results in natural language
      const interpretResponse = await supabase.functions.invoke('interpret-results', {
        body: { 
          question, 
          sql,
          results: result 
        }
      });

      // Store the natural language interpretation
      if (!interpretResponse.error) {
        setInterpretation(interpretResponse.data.interpretation);
      } else {
        // Default interpretation if AI interpretation fails
        setInterpretation(`Query executed successfully. Found ${result.length} results.`);
      }

      setIsProcessing(false);
      return { 
        success: true, 
        data: result, 
        sql, 
        interpretation: interpretResponse.data?.interpretation || `Query executed successfully. Found ${result.length} results.`
      };
    } catch (error) {
      console.error("Error processing query:", error);
      
      // Fallback to dummy data for any error
      const dummyResult = generateDummyResponse(question);
      const errorResult: QueryResult = {
        response: dummyResult.response,
        visualizationData: dummyResult.visualizationData,
        error: error instanceof Error ? error.message : String(error),
        isConnectionError: error instanceof Error && 
          (error.message?.includes('connection') || error.message?.includes('network'))
      };
      
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    lastResult,
    useOfflineMode,
    toggleOfflineMode,
    executeQuery: executeQueryDirectly,
    processNaturalLanguageQuery,
    isMetricsQuery,
    generateSqlFromNaturalLanguage,
    processQuestion,
    processQuery
  };
};
