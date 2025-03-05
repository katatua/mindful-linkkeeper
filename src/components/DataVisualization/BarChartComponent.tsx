
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COLORS } from './visualizationUtils';

interface BarChartComponentProps {
  data: any[];
  dataKeys: string[];
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({ data, dataKeys }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {dataKeys.map((key, index) => (
          <Bar 
            key={key} 
            dataKey={key} 
            fill={COLORS[index % COLORS.length]} 
            name={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
