
import React from 'react';
import { ChartFactory } from './ChartFactory';
import { determineTopic, determineChartType, extractChartTitle } from '@/utils/chartUtils';

interface BaiResponseChartRendererProps {
  query: string;
  baiResponse?: string;
  intentAlias?: string;
}

export const BaiResponseChartRenderer: React.FC<BaiResponseChartRendererProps> = ({
  query,
  baiResponse,
  intentAlias
}) => {
  // Determine chart properties based on user query and BAI response
  const topic = determineTopic(query);
  const chartType = determineChartType(query);
  const extractedTitle = extractChartTitle(query);
  
  // Extract additional information from BAI response if available
  let detectedType = chartType;
  if (baiResponse && baiResponse.includes('tipo:')) {
    const typeMatch = baiResponse.match(/tipo:\s*(\w+)/i);
    if (typeMatch && typeMatch[1]) {
      const mappedType = typeMatch[1].toLowerCase();
      if (['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea'].includes(mappedType)) {
        detectedType = mappedType as any;
      }
    }
  }
  
  // Use intent alias as an additional signal if available
  if (intentAlias) {
    if (intentAlias.includes('barra')) detectedType = 'bar';
    else if (intentAlias.includes('linha')) detectedType = 'line';
    else if (intentAlias.includes('pizza')) detectedType = 'pie';
    else if (intentAlias.includes('rosca') || intentAlias.includes('donut')) detectedType = 'doughnut';
    else if (intentAlias.includes('radar')) detectedType = 'radar';
    else if (intentAlias.includes('polar')) detectedType = 'polarArea';
  }

  return (
    <div className="mt-4 mb-6">
      <ChartFactory 
        topic={topic} 
        chartType={detectedType}
        title={extractedTitle || undefined}
      />
    </div>
  );
};

export default BaiResponseChartRenderer;
