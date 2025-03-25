
/**
 * Hook for processing natural language queries into SQL and results
 */

import { dynamicQueryService } from "@/services/dynamicQueryService";

/**
 * Hook that provides utilities for detecting, generating, and executing queries
 */
export const useQueryProcessor = () => {
  return {
    isMetricsQuery: async (query: string) => {
      return await dynamicQueryService.classifyQuestion(query);
    },
    generateSqlFromNaturalLanguage: async (query: string) => {
      return await dynamicQueryService.generateSqlFromQuestion({ question: query });
    },
    executeQuery: async (sqlQuery: string) => {
      return await dynamicQueryService.executeQuery(sqlQuery);
    },
    processQuestion: async (question: string, language: 'en' | 'pt' = 'en') => {
      return await dynamicQueryService.processQuestion(question, language);
    }
  };
};
