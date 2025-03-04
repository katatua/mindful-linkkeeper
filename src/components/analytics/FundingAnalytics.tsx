
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

export const FundingAnalytics = () => {
  // Sample data for funding analytics
  const fundingBySource = [
    { name: 'EU Horizon Europe', value: 42 },
    { name: 'National Funds', value: 28 },
    { name: 'Private Investment', value: 18 },
    { name: 'Regional Programs', value: 12 },
  ];
  
  const fundingTrends = [
    { year: '2018', amount: 12.4 },
    { year: '2019', amount: 16.8 },
    { year: '2020', amount: 18.2 },
    { year: '2021', amount: 22.5 },
    { year: '2022', amount: 25.7 },
    { year: '2023', amount: 28.5 },
  ];
  
  const sectorFunding = [
    { name: 'Healthcare', total: 8.2, growth: 18 },
    { name: 'Energy', total: 6.4, growth: 12 },
    { name: 'Digital Tech', total: 7.8, growth: 22 },
    { name: 'Manufacturing', total: 4.2, growth: 7 },
    { name: 'Agriculture', total: 1.9, growth: 5 },
  ];
  
  const quarterlyFunding = [
    { quarter: 'Q1 2022', public: 4.2, private: 2.1 },
    { quarter: 'Q2 2022', public: 4.5, private: 2.4 },
    { quarter: 'Q3 2022', public: 5.1, private: 2.7 },
    { quarter: 'Q4 2022', public: 5.4, private: 3.0 },
    { quarter: 'Q1 2023', public: 5.8, private: 3.2 },
    { quarter: 'Q2 2023', public: 6.2, private: 3.7 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Funding Sources (2023)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fundingBySource}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {fundingBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Funding Growth (€M)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fundingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${value}M`, 'Funding']} />
                  <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sector Funding Allocation (€M)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorFunding}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${value}M`, 'Funding']} />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8" name="Total Funding (€M)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Public vs Private Funding (€M)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quarterlyFunding}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${value}M`, 'Funding']} />
                  <Legend />
                  <Line type="monotone" dataKey="public" stroke="#8884d8" name="Public Funding" />
                  <Line type="monotone" dataKey="private" stroke="#82ca9d" name="Private Funding" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
