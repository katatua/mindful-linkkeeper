
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { BarChartComponent } from './BarChartComponent';
import { LineChartComponent } from './LineChartComponent';
import { PieChartComponent } from './PieChartComponent';
import { determineDataStructure } from './visualizationUtils';

interface DataVisualizationProps {
  data: any[];
  onClose: () => void;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({ data, onClose }) => {
  const [visualizationType, setVisualizationType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [dataKeys, setDataKeys] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('Visualização de Dados');

  useEffect(() => {
    const { processedData, dataKeys, type, title } = determineDataStructure(data);
    setProcessedData(processedData);
    setDataKeys(dataKeys);
    setVisualizationType(type);
    setTitle(title);
  }, [data]);

  const renderVisualization = () => {
    switch (visualizationType) {
      case 'bar':
        return <BarChartComponent data={processedData} dataKeys={dataKeys} />;
      case 'line':
        return <LineChartComponent data={processedData} dataKeys={dataKeys} />;
      case 'pie':
        return <PieChartComponent data={processedData} />;
      default:
        return <div>Não foi possível gerar uma visualização para os dados.</div>;
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Visualização baseada em {data.length} registro{data.length !== 1 ? 's' : ''}
          </CardDescription>
        </div>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
          <X className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent>
        {renderVisualization()}
      </CardContent>
    </Card>
  );
};
