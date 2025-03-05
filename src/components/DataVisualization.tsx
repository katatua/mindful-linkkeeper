
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, BarChart, LineChart, PieChart } from "lucide-react";
import { BarChartComponent } from './DataVisualization/BarChartComponent';
import { LineChartComponent } from './DataVisualization/LineChartComponent';
import { PieChartComponent } from './DataVisualization/PieChartComponent';
import { determineChartType, extractDataKeys } from './DataVisualization/visualizationUtils';

interface DataVisualizationProps {
  data: any[];
  onClose: () => void;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({ data, onClose }) => {
  const initialChartType = determineChartType(data);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>(initialChartType);
  const dataKeys = extractDataKeys(data);

  const handleChartTypeChange = (type: 'bar' | 'line' | 'pie') => {
    setChartType(type);
  };

  return (
    <Card className="w-full mb-6 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Data Visualization Results</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant={chartType === 'bar' ? "default" : "outline"} 
            size="sm"
            onClick={() => handleChartTypeChange('bar')}
          >
            <BarChart className="h-4 w-4 mr-1" />
            Bar
          </Button>
          <Button 
            variant={chartType === 'line' ? "default" : "outline"} 
            size="sm"
            onClick={() => handleChartTypeChange('line')}
          >
            <LineChart className="h-4 w-4 mr-1" />
            Line
          </Button>
          <Button 
            variant={chartType === 'pie' ? "default" : "outline"} 
            size="sm"
            onClick={() => handleChartTypeChange('pie')}
          >
            <PieChart className="h-4 w-4 mr-1" />
            Pie
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {chartType === 'bar' && <BarChartComponent data={data} dataKeys={dataKeys} />}
        {chartType === 'line' && <LineChartComponent data={data} dataKeys={dataKeys} />}
        {chartType === 'pie' && <PieChartComponent data={data} />}
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
