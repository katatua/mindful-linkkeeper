
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COLORS } from './visualizationUtils';

interface LineChartComponentProps {
  data: any[];
  dataKeys: string[];
}

export const LineChartComponent: React.FC<LineChartComponentProps> = ({ data, dataKeys }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        {dataKeys.map((key, index) => (
          <Line 
            key={key} 
            type="monotone" 
            dataKey={key} 
            stroke={COLORS[index % COLORS.length]} 
            name={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
