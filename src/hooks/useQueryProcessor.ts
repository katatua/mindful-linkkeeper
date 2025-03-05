
/**
 * Hook for processing natural language queries into SQL and results
 */

import { isMetricsQuery } from "@/utils/queryDetection";
import { generateSqlFromNaturalLanguage } from "@/utils/sqlGeneration";
import { executeQuery } from "@/utils/queryExecution";

/**
 * Hook that provides utilities for detecting, generating, and executing queries
 */
export const useQueryProcessor = () => {
  return {
    isMetricsQuery,
    generateSqlFromNaturalLanguage,
    executeQuery
  };
};
