
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SectorFundingData {
  sector_focus: string[];
  total_budget_allocated: number;
  num_programs: number;
}

interface SectorFundingDistributionProps {
  data: SectorFundingData[];
}

const SectorFundingDistribution: React.FC<SectorFundingDistributionProps> = ({ data }) => {
  // Process data to create a chart-friendly format
  const processedData = data.map((item, index) => ({
    name: item.sector_focus.join(' & '),
    budget: item.total_budget_allocated,
    programs: item.num_programs
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Funding Distribution by Sector Focus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} />
              <YAxis 
                label={{ value: 'Budget (€)', angle: -90, position: 'insideLeft' }} 
                tickFormatter={(value) => `€${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `€${Number(value).toLocaleString()}`, 
                  name === 'budget' ? 'Total Budget' : 'Number of Programs'
                ]}
              />
              <Legend />
              <Bar dataKey="budget" fill="#8884d8" name="Total Budget (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Funding Insights:</h3>
          <ul className="list-disc pl-5">
            <li>Highest Funded Sector Combination: Digital Tech, Healthcare, Energy, Manufacturing (€95,500,000)</li>
            <li>Lowest Funded Sector Combination: Digital Transformation, Industry 4.0, Cloud Computing (€7,500,000)</li>
            <li>Total Programs Analyzed: {data.length}</li>
            <li>Total Budget Across Sectors: €{data.reduce((sum, item) => sum + item.total_budget_allocated, 0).toLocaleString()}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorFundingDistribution;
