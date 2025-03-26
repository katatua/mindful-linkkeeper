
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
  isConnectionError?: boolean;
}

export const useQueryProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<QueryResult | null>(null);

  /**
   * Execute a SQL query directly with improved connection error handling
   */
  const executeQueryDirectly = async (sql: string): Promise<QueryResult> => {
    try {
      setIsProcessing(true);
      
      // Check for connectivity to Supabase before executing the query
      const { data: connCheck, error: connError } = await supabase.from('ani_database_status').select('count(*)', { count: 'exact', head: true });
      
      if (connError) {
        console.error("Database connection check failed:", connError);
        throw new Error(`Database connection error: ${connError.message}`);
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
      const isConnectionError = error.message?.includes('Failed to send a request') || 
                               error.message?.includes('network error') ||
                               error.message?.includes('connection') ||
                               error.message?.includes('timeout');
      
      const errorResult: QueryResult = {
        response: `Error executing query: ${error instanceof Error ? error.message : String(error)}`,
        sql,
        error: error instanceof Error ? error.message : String(error),
        isConnectionError
      };
      
      // Log additional information for debugging
      console.log("Error details:", {
        errorType: error.constructor.name,
        stack: error.stack,
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
        error: error instanceof Error ? error.message : String(error),
        isConnectionError: error.message?.includes('connection') || error.message?.includes('network')
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
      
      // Check if question is likely an R&D/Investment query for fallback handling
      const isRdQuery = question.toLowerCase().includes('r&d') || 
                         question.toLowerCase().includes('research') || 
                         question.toLowerCase().includes('investment');
      
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
      
      // If connection is down and this is an R&D query, immediately use fallback
      if (!connectionOk && isRdQuery) {
        console.log("Connection is down, using R&D fallback response directly");
        const fallbackResponse = language === 'en' 
          ? "I couldn't retrieve the real-time data due to a connection issue, but here's what we know about R&D investment trends in Portugal: R&D intensity (R&D/GDP) reached 1.41% in the most recent year, with the business sector accounting for the largest share of R&D expenditure at approximately 58%. Public research organizations and higher education institutions contribute about 42% of total R&D investment."
          : "Não foi possível recuperar os dados em tempo real devido a um problema de conexão, mas aqui está o que sabemos sobre as tendências de investimento em P&D em Portugal: A intensidade de P&D (P&D/PIB) atingiu 1,41% no ano mais recente, com o setor empresarial representando a maior parte do investimento em P&D, aproximadamente 58%. Organizações de pesquisa públicas e instituições de ensino superior contribuem com cerca de 42% do investimento total em P&D.";
        
        const fallbackResult: QueryResult = {
          response: fallbackResponse,
          error: "Connection to database unavailable",
          isConnectionError: true
        };
        
        setLastResult(fallbackResult);
        return fallbackResult;
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
        const isConnectionError = error.message?.includes('Failed to send a request') || 
                                 error.message?.includes('network error') ||
                                 error.message?.includes('connection') ||
                                 error.message?.includes('timeout');
        
        // Enhanced error logging
        console.log("Query processing error details:", {
          errorType: error.constructor?.name,
          stack: error.stack,
          message: error.message,
          isConnectionError
        });
        
        // Provide a fallback for R&D investment queries
        if (isRdQuery) {
          const fallbackResponse = language === 'en' 
            ? "I couldn't retrieve the real-time data due to a connection issue, but here's what we know about R&D investment trends in Portugal: R&D intensity (R&D/GDP) reached 1.41% in the most recent year, with the business sector accounting for the largest share of R&D expenditure at approximately 58%. Public research organizations and higher education institutions contribute about 42% of total R&D investment."
            : "Não foi possível recuperar os dados em tempo real devido a um problema de conexão, mas aqui está o que sabemos sobre as tendências de investimento em P&D em Portugal: A intensidade de P&D (P&D/PIB) atingiu 1,41% no ano mais recente, com o setor empresarial representando a maior parte do investimento em P&D, aproximadamente 58%. Organizações de pesquisa públicas e instituições de ensino superior contribuem com cerca de 42% do investimento total em P&D.";
            
          const errorResult: QueryResult = {
            response: fallbackResponse,
            error: error instanceof Error ? error.message : String(error),
            isConnectionError
          };
          setLastResult(errorResult);
          return errorResult;
        }
        
        // For non-R&D queries, return the error
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
      const errorResult: QueryResult = {
        response: `Error processing question: ${error instanceof Error ? error.message : String(error)}`,
        error: error instanceof Error ? error.message : String(error),
        isConnectionError: error.message?.includes('connection') || error.message?.includes('network')
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
    // Also expose these functions that are being used in useChatCore.ts
    isMetricsQuery,
    generateSqlFromNaturalLanguage,
    processQuestion
  };
};
