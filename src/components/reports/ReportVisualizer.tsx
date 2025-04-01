
import React, { useMemo } from 'react';
import { Visualization } from '@/utils/reportService';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  ResponsiveContainer, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Line, 
  Pie, 
  Cell 
} from 'recharts';

interface ReportVisualizerProps {
  visualization: Visualization;
}

export const ReportVisualizer: React.FC<ReportVisualizerProps> = ({ visualization }) => {
  const { type, title, description, data, colors = ['#36B37E', '#00B8D9', '#6554C0', '#FF5630', '#FFAB00'] } = visualization;

  // Memoize the chart to prevent unnecessary re-renders
  const memoizedChart = useMemo(() => {
    if (!data || data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <h3 className="font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
          <p className="text-sm text-red-500 mt-4">No data available for visualization</p>
        </div>
      );
    }

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              {Object.keys(data[0]).filter(key => key !== 'name').map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={colors[index % colors.length]} 
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              {Object.keys(data[0]).filter(key => key !== 'name').map((key, index) => (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[index % colors.length]} 
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <div className="text-center text-red-500">
            Unsupported visualization type: {type}
          </div>
        );
    }
  }, [type, title, description, data, colors]);

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="font-medium text-lg text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mb-2">{description}</p>
      <ChartContainer
        config={{
          value: { label: 'Value' },
          name: { label: 'Name' },
        }}
      >
        {memoizedChart}
      </ChartContainer>
    </div>
  );
};

export default ReportVisualizer;
