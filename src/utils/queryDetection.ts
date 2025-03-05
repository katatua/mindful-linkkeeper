
/**
 * Utility functions for detecting query types
 */

// Function to check if a query is related to metrics
export const isMetricsQuery = (query: string): boolean => {
  const lowerQuery = query.toLowerCase();
  
  // Check if query contains keywords related to metrics
  return (
    lowerQuery.includes("métrica") ||
    lowerQuery.includes("metric") ||
    lowerQuery.includes("estatística") ||
    lowerQuery.includes("statistic") ||
    lowerQuery.includes("indicador") ||
    lowerQuery.includes("indicator") ||
    lowerQuery.includes("medida") ||
    lowerQuery.includes("measure") ||
    lowerQuery.includes("percentagem") ||
    lowerQuery.includes("percentage") ||
    lowerQuery.includes("investimento") ||
    lowerQuery.includes("investment") ||
    lowerQuery.includes("patente") ||
    lowerQuery.includes("patent") ||
    lowerQuery.includes("inovação") ||
    lowerQuery.includes("innovation") ||
    lowerQuery.includes("emprego") ||
    lowerQuery.includes("employment") ||
    lowerQuery.includes("financiamento") ||
    lowerQuery.includes("funding") ||
    lowerQuery.includes("comércio") ||
    lowerQuery.includes("commerce") ||
    lowerQuery.includes("exportação") ||
    lowerQuery.includes("export") ||
    lowerQuery.includes("importação") ||
    lowerQuery.includes("import") ||
    lowerQuery.includes("programa") ||
    lowerQuery.includes("program") ||
    lowerQuery.includes("projeto") ||
    lowerQuery.includes("project") ||
    lowerQuery.includes("investigação") ||
    lowerQuery.includes("research") ||
    lowerQuery.includes("desenvolvimento") ||
    lowerQuery.includes("development") ||
    lowerQuery.includes("instituição") ||
    lowerQuery.includes("institution") ||
    lowerQuery.includes("universidade") ||
    lowerQuery.includes("university") ||
    lowerQuery.includes("centro") ||
    lowerQuery.includes("center") ||
    lowerQuery.includes("laboratório") ||
    lowerQuery.includes("laboratory") ||
    lowerQuery.includes("colab") ||
    lowerQuery.includes("colaborativo") ||
    lowerQuery.includes("collaborative")
  );
};

// Function to check if a query is a write operation (INSERT, UPDATE, DELETE)
export const isSqlWriteOperation = (query: string): boolean => {
  const lowerQuery = query.toLowerCase().trim();
  
  return (
    lowerQuery.startsWith("insert ") ||
    lowerQuery.startsWith("update ") ||
    lowerQuery.startsWith("delete ") ||
    lowerQuery.includes("insert into") ||
    lowerQuery.includes("update ") ||
    lowerQuery.includes("delete from")
  );
};
