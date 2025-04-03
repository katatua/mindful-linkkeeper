
import { ChartTopicType, ChartTypeFormat } from '@/components/charts/ChartFactory';

/**
 * Determines the most likely chart topic based on user query
 */
export const determineTopic = (query: string): ChartTopicType => {
  const lowercaseQuery = query.toLowerCase();
  
  if (/investimento|i&d|r&d|financiamento|gasto|orçamento/i.test(lowercaseQuery)) {
    return 'investment';
  }
  
  if (/patente|propriedade intelectual|invenção/i.test(lowercaseQuery)) {
    return 'patents';
  }
  
  if (/startup|empreendedor|empresa nova|nova empresa/i.test(lowercaseQuery)) {
    return 'startups';
  }
  
  if (/setor|sector|indústria|área|tecnologia|saúde|energia/i.test(lowercaseQuery)) {
    return 'sector';
  }
  
  if (/regional|região|lisboa|porto|norte|centro|alentejo|algarve/i.test(lowercaseQuery)) {
    return 'regional';
  }
  
  if (/publicação|artigo|paper|journal|revista|citação/i.test(lowercaseQuery)) {
    return 'publications';
  }
  
  if (/fonte|financiamento|capital|risco|investidor|investimento/i.test(lowercaseQuery)) {
    return 'funding';
  }
  
  return 'default';
};

/**
 * Determines the best chart type based on user query
 */
export const determineChartType = (query: string): ChartTypeFormat => {
  const lowercaseQuery = query.toLowerCase();
  
  if (/gráfico de barra|barras|bar chart/i.test(lowercaseQuery)) {
    return 'bar';
  }
  
  if (/gráfico de linha|linhas|tendência|evolução|line chart/i.test(lowercaseQuery)) {
    return 'line';
  }
  
  if (/gráfico de pizza|pizza|pie chart|circle|circular/i.test(lowercaseQuery)) {
    return 'pie';
  }
  
  if (/gráfico de rosca|donut|doughnut/i.test(lowercaseQuery)) {
    return 'doughnut';
  }
  
  if (/radar|gráfico radar|spider/i.test(lowercaseQuery)) {
    return 'radar';
  }
  
  if (/polar|área polar/i.test(lowercaseQuery)) {
    return 'polarArea';
  }
  
  // Default based on context
  if (/distribuição|percentagem|proporção|share/i.test(lowercaseQuery)) {
    return 'pie';
  }
  
  if (/comparar|comparação|compare/i.test(lowercaseQuery)) {
    return 'bar';
  }
  
  if (/tendência|trend|tempo|evolution|evolução|anos|meses/i.test(lowercaseQuery)) {
    return 'line';
  }
  
  // Default to bar
  return 'bar';
};

/**
 * Determines if a query is asking for a chart
 */
export const isChartRequest = (query: string): boolean => {
  const chartKeywords = [
    "gráfico", "grafico", "chart", "diagrama", "visualização", "plot",
    "barra", "linha", "pie", "pizza", "donut", "área", "area",
    "histograma", "scatter", "dispersão", "radar", "polar",
    "mostrar", "exibir", "visualizar"
  ];
  
  const lowercaseQuery = query.toLowerCase();
  return chartKeywords.some(keyword => lowercaseQuery.includes(keyword));
};

/**
 * Extracts potential chart title from a query
 */
export const extractChartTitle = (query: string): string | null => {
  // Try to extract a meaningful title from the query
  const patterns = [
    /gráfico (de|sobre|para) (.+?)(\?|$)/i,
    /mostrar (um gráfico|gráfico) (de|sobre|para) (.+?)(\?|$)/i,
    /visualizar (.+?) em (forma de |um |formato de )?gráfico/i,
    /gerar (um )?gráfico (de|sobre|para) (.+?)(\?|$)/i
  ];
  
  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match) {
      // Get the relevant capture group
      const title = match[match.length - 2];
      if (title && title.length > 3) {
        // Capitalize first letter of each word
        return title
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
  }
  
  return null;
};
