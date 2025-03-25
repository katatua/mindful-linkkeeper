
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { executeQuery } from "@/utils/queryExecution";
import { generateSqlFromNaturalLanguage } from "@/utils/sqlGeneration";
import { toast } from "sonner";
import { isMetricsQuery } from "@/utils/queryDetection";
import { dynamicQueryService } from "@/services/dynamicQueryService";

export interface QueryResult {
  response: string;
  visualizationData?: any[];
  sql?: string;
  error?: string;
}

export const useQueryProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<QueryResult | null>(null);

  /**
   * Execute a SQL query directly
   */
  const executeQueryDirectly = async (sql: string): Promise<QueryResult> => {
    try {
      setIsProcessing(true);
      
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
      const errorResult: QueryResult = {
        response: `Error executing query: ${error instanceof Error ? error.message : String(error)}`,
        sql,
        error: error instanceof Error ? error.message : String(error)
      };
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
      
      // First generate SQL from the natural language question
      const sql = await generateSqlFromNaturalLanguage(question);
      
      if (!sql) {
        throw new Error("Failed to generate SQL query from question");
      }
      
      // Execute the generated SQL
      return await executeQueryDirectly(sql);
    } catch (error) {
      console.error("Error processing natural language query:", error);
      toast.error("Failed to process question", {
        description: error instanceof Error ? error.message : String(error)
      });
      
      const errorResult: QueryResult = {
        response: `Error processing question: ${error instanceof Error ? error.message : String(error)}`,
        error: error instanceof Error ? error.message : String(error)
      };
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Process a question using the dynamic query service
   */
  const processQuestion = async (question: string, language: 'en' | 'pt'): Promise<QueryResult> => {
    try {
      setIsProcessing(true);
      
      const result = await dynamicQueryService.processQuestion(question, language);
      
      const queryResult: QueryResult = {
        response: result.response,
        visualizationData: result.visualizationData,
        sql: result.sql
      };
      
      setLastResult(queryResult);
      return queryResult;
    } catch (error) {
      console.error("Error processing question:", error);
      const errorResult: QueryResult = {
        response: `Error processing question: ${error instanceof Error ? error.message : String(error)}`,
        error: error instanceof Error ? error.message : String(error)
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
    executeQuery: executeQueryDirectly,
    processNaturalLanguageQuery,
    // Add the missing functions that are being used in useChatCore.ts
    isMetricsQuery,
    generateSqlFromNaturalLanguage,
    processQuestion
  };
};
