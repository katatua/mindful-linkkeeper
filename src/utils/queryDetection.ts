
/**
 * Utility to detect if a query is requesting metrics data
 */
export const isMetricsQuery = async (question: string): Promise<boolean> => {
  // Convert to lowercase for case-insensitive matching
  const lowerQuestion = question.toLowerCase();
  
  // Keywords related to metrics queries
  const metricsKeywords = [
    'how many', 'how much', 'total', 'count', 
    'average', 'mean', 'median', 'statistics',
    'metrics', 'measure', 'trend', 'growth',
    'percentage', 'rate', 'distribution', 'breakdown',
    'investment', 'r&d', 'research', 'development',
    'funding', 'financial', 'budget', 'spent',
    'allocation', 'sector', 'industry', 'region',
    'annual', 'quarterly', 'monthly', 'yearly',
    'increase', 'decrease', 'compare', 'comparison',
    'project', 'program', 'patent', 'innovation',
    'performance', 'effectiveness', 'impact', 'outcome',
    'ani', 'database', 'data', 'portugal', 'show', 'find', 'list',
    'what', 'who', 'where', 'when', 'why', 'which', 'was', 'is'
  ];
  
  // Check if the question contains metrics-related keywords
  for (const keyword of metricsKeywords) {
    if (lowerQuestion.includes(keyword)) {
      console.log(`Identified as metrics query by keyword: "${keyword}"`);
      return true;
    }
  }
  
  // Default to true for ambiguous queries to favor showing data
  return true;
}
