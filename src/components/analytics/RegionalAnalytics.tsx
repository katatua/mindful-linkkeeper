
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t } = useLanguage();
  
  // Sample data for regional analytics with translated names
  const projectsByRegion = [
    { name: t('region.north'), value: 42 },
    { name: t('region.central'), value: 58 },
    { name: t('region.south'), value: 38 },
    { name: t('region.islands'), value: 18 },
  ];
  
  const investmentByRegion = [
    { region: t('region.north'), value: 8.2 },
    { region: t('region.central'), value: 12.5 },
    { region: t('region.south'), value: 5.4 },
    { region: t('region.islands'), value: 2.4 },
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
    { region: t('region.north'), digital: 18, health: 12, energy: 6, manufacturing: 4, agriculture: 2 },
    { region: t('region.central'), digital: 22, health: 16, energy: 10, manufacturing: 6, agriculture: 4 },
    { region: t('region.south'), digital: 12, health: 14, energy: 8, manufacturing: 3, agriculture: 1 },
    { region: t('region.islands'), digital: 6, health: 4, energy: 6, manufacturing: 1, agriculture: 1 },
  ];

  const handleChartClick = (chartId, chartType) => {
    navigate(`/visualization/regional/${chartType}/${chartId}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('projects-by-region', 'pie')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('regional.projects_by_region')}</CardTitle>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('investment-by-region', 'bar')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('regional.investment_by_region')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={investmentByRegion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name={t('chart.total_investment')} fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('regional-growth', 'line')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('regional.growth_trends')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={regionalGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="north" name={t('region.north')} stroke="#8884d8" />
                  <Line type="monotone" dataKey="central" name={t('region.central')} stroke="#82ca9d" />
                  <Line type="monotone" dataKey="south" name={t('region.south')} stroke="#ffc658" />
                  <Line type="monotone" dataKey="islands" name={t('region.islands')} stroke="#ff8042" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('regional-sectors', 'bar')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('regional.sector_distribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalSectors}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="digital" name={t('sector.digital')} fill="#8884d8" />
                  <Bar dataKey="health" name={t('sector.healthcare')} fill="#82ca9d" />
                  <Bar dataKey="energy" name={t('sector.energy')} fill="#ffc658" />
                  <Bar dataKey="manufacturing" name={t('sector.manufacturing')} fill="#ff8042" />
                  <Bar dataKey="agriculture" name={t('sector.agriculture')} fill="#0088fe" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
