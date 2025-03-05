
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28'];

export const SectorAnalytics = () => {
  const navigate = useNavigate();
  
  // Sample data for sector analytics
  const sectorDistribution = [
    { name: 'Digital Tech', projects: 42, value: 32 },
    { name: 'Healthcare', projects: 38, value: 24 },
    { name: 'Energy', projects: 27, value: 18 },
    { name: 'Manufacturing', projects: 21, value: 14 },
    { name: 'Agriculture', projects: 18, value: 12 },
  ];
  
  const sectorPerformance = [
    { sector: 'Digital Tech', success: 88, patents: 42, publications: 78 },
    { sector: 'Healthcare', success: 92, patents: 56, publications: 94 },
    { sector: 'Energy', success: 84, patents: 38, publications: 62 },
    { sector: 'Manufacturing', success: 78, patents: 32, publications: 45 },
    { sector: 'Agriculture', success: 82, patents: 28, publications: 52 },
  ];
  
  const sectorFundingVsOutput = [
    { x: 8.2, y: 92, z: 38, name: 'Healthcare' },
    { x: 7.8, y: 88, z: 42, name: 'Digital Tech' },
    { x: 6.4, y: 84, z: 27, name: 'Energy' },
    { x: 4.2, y: 78, z: 21, name: 'Manufacturing' },
    { x: 1.9, y: 82, z: 18, name: 'Agriculture' },
  ];
  
  const growthByRegion = [
    { region: 'North', digital: 24, health: 18, energy: 12, manufacturing: 8, agriculture: 6 },
    { region: 'Central', digital: 28, health: 24, energy: 14, manufacturing: 12, agriculture: 8 },
    { region: 'South', digital: 18, health: 22, energy: 26, manufacturing: 10, agriculture: 14 },
    { region: 'Islands', digital: 14, health: 12, energy: 18, manufacturing: 6, agriculture: 10 },
  ];
  
  // New data for investment by sector
  const investmentBySector = [
    { sector: 'Digital Tech', investment: 35.7, projects: 156, averageSize: 0.23 },
    { sector: 'Healthcare', investment: 24.3, projects: 98, averageSize: 0.25 },
    { sector: 'Energy', investment: 28.9, projects: 112, averageSize: 0.26 },
    { sector: 'Manufacturing', investment: 19.2, projects: 87, averageSize: 0.22 },
    { sector: 'Agriculture', investment: 15.8, projects: 72, averageSize: 0.22 },
    { sector: 'Space', investment: 12.5, projects: 42, averageSize: 0.30 },
    { sector: 'Ocean', investment: 14.3, projects: 63, averageSize: 0.23 },
  ];

  const handleChartClick = (chartId, chartType) => {
    navigate(`/visualization/sectors/${chartType}/${chartId}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('sector-distribution', 'pie')}>
          <CardHeader>
            <CardTitle className="text-lg">Sector Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {sectorDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('sector-performance', 'radar')}>
          <CardHeader>
            <CardTitle className="text-lg">Sector Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sectorPerformance}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="sector" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Success Rate (%)" dataKey="success" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Patents" dataKey="patents" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Radar name="Publications" dataKey="publications" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('investment-by-sector', 'bar')}>
          <CardHeader>
            <CardTitle className="text-lg">Investment by Sector (€M)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={investmentBySector}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => {
                    if (name === 'investment') return [`€${value}M`, 'Investment'];
                    if (name === 'projects') return [value, 'Projects'];
                    if (name === 'averageSize') return [`€${value}M`, 'Avg Project Size'];
                    return [value, name];
                  }} />
                  <Legend />
                  <Bar dataKey="investment" name="Total Investment (€M)" fill="#8884d8" />
                  <Bar dataKey="projects" name="Number of Projects" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('funding-vs-success', 'scatter')}>
          <CardHeader>
            <CardTitle className="text-lg">Funding vs Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="Funding (€M)" />
                  <YAxis type="number" dataKey="y" name="Success Rate (%)" />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} name="Projects" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => {
                    if (name === 'x') return [`€${value}M`, 'Funding'];
                    if (name === 'y') return [`${value}%`, 'Success Rate'];
                    if (name === 'z') return [value, 'Projects'];
                    return [value, name];
                  }} />
                  <Legend />
                  <Scatter name="Sectors" data={sectorFundingVsOutput} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('growth-by-region', 'bar')}>
        <CardHeader>
          <CardTitle className="text-lg">Growth by Region & Sector (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthByRegion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Growth']} />
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
  );
};
