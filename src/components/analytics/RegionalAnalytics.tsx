
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

export const RegionalAnalytics = () => {
  const navigate = useNavigate();
  
  // Sample data for regional analytics
  const projectsByRegion = [
    { name: 'North', value: 42 },
    { name: 'Central', value: 58 },
    { name: 'South', value: 38 },
    { name: 'Islands', value: 18 },
  ];
  
  const investmentByRegion = [
    { region: 'North', value: 8.2 },
    { region: 'Central', value: 12.5 },
    { region: 'South', value: 5.4 },
    { region: 'Islands', value: 2.4 },
  ];
  
  const regionalGrowth = [
    { year: 2018, north: 8, central: 12, south: 5, islands: 3 },
    { year: 2019, north: 10, central: 14, south: 7, islands: 4 },
    { year: 2020, north: 12, central: 16, south: 8, islands: 5 },
    { year: 2021, north: 15, central: 18, south: 10, islands: 6 },
    { year: 2022, north: 18, central: 22, south: 12, islands: 7 },
    { year: 2023, north: 22, central: 26, south: 15, islands: 9 },
  ];
  
  const regionalSectors = [
    { region: 'North', digital: 18, health: 12, energy: 6, manufacturing: 4, agriculture: 2 },
    { region: 'Central', digital: 22, health: 16, energy: 10, manufacturing: 6, agriculture: 4 },
    { region: 'South', digital: 12, health: 14, energy: 8, manufacturing: 3, agriculture: 1 },
    { region: 'Islands', digital: 6, health: 4, energy: 6, manufacturing: 1, agriculture: 1 },
  ];

  const handleChartClick = (chartId, chartType) => {
    navigate(`/visualization/regional/${chartType}/${chartId}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('projects-by-region', 'pie')}>
          <CardHeader>
            <CardTitle className="text-lg">Projects by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectsByRegion}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {projectsByRegion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} Projects`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('investment-by-region', 'bar')}>
          <CardHeader>
            <CardTitle className="text-lg">Investment by Region (€M)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={investmentByRegion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${value}M`, 'Investment']} />
                  <Legend />
                  <Bar dataKey="value" name="Total Investment" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('regional-growth', 'line')}>
          <CardHeader>
            <CardTitle className="text-lg">Regional Growth Trends (€M)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={regionalGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${value}M`, 'Investment']} />
                  <Legend />
                  <Line type="monotone" dataKey="north" name="North" stroke="#8884d8" />
                  <Line type="monotone" dataKey="central" name="Central" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="south" name="South" stroke="#ffc658" />
                  <Line type="monotone" dataKey="islands" name="Islands" stroke="#ff8042" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('regional-sectors', 'bar')}>
          <CardHeader>
            <CardTitle className="text-lg">Regional Sector Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalSectors}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} Projects`, 'Count']} />
                  <Legend />
                  <Bar dataKey="digital" name="Digital Tech" fill="#8884d8" />
                  <Bar dataKey="health" name="Healthcare" fill="#82ca9d" />
                  <Bar dataKey="energy" name="Energy" fill="#ffc658" />
                  <Bar dataKey="manufacturing" name="Manufacturing" fill="#ff8042" />
                  <Bar dataKey="agriculture" name="Agriculture" fill="#0088fe" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
