
/**
 * Query detection utility functions
 * Responsible for determining if a message contains a metrics-related query
 */

/**
 * Checks if a message contains patterns that indicate it's a metrics query
 */
export const isMetricsQuery = (message: string): boolean => {
  const lowerMsg = message.toLowerCase();
  
  const englishPatterns = [
    'how much is', 'what is the', 'tell me about', 'show me', 
    'r&d investment', 'investment in r&d', 'patent', 'innovation', 
    'metric', 'performance', 'percentage', 'value', 'number of',
    'how many', 'statistic', 'success rate', 'funding', 'deadline', 
    'international', 'collaboration', 'program', 'sector', 'application',
    'investment by sector', 'sectoral investment', 'sector funding'
  ];
  
  const portuguesePatterns = [
    'qual', 'quanto', 'quantos', 'mostre', 'diga-me', 'apresente',
    'investimento em p&d', 'investimento em r&d', 'patente', 'inovação',
    'métrica', 'desempenho', 'percentagem', 'porcentagem', 'valor', 'número de',
    'estatística', 'taxa de sucesso', 'financiamento', 'prazo', 'internacional',
    'colaboração', 'programa', 'setor', 'aplicação', 'candidatura',
    'investimento por setor', 'investimento setorial', 'financiamento por setor'
  ];
  
  return englishPatterns.some(pattern => lowerMsg.includes(pattern)) || 
         portuguesePatterns.some(pattern => lowerMsg.includes(pattern));
};
