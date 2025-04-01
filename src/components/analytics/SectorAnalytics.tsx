
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
  const { t } = useLanguage();
  
  // Sample data for sector analytics with translated names
  const sectorDistribution = [
    { name: t('sector.digital'), projects: 42, value: 32 },
    { name: t('sector.healthcare'), projects: 38, value: 24 },
    { name: t('sector.energy'), projects: 27, value: 18 },
    { name: t('sector.manufacturing'), projects: 21, value: 14 },
    { name: t('sector.agriculture'), projects: 18, value: 12 },
  ];
  
  const sectorPerformance = [
    { sector: t('sector.digital'), success: 88, patents: 42, publications: 78 },
    { sector: t('sector.healthcare'), success: 92, patents: 56, publications: 94 },
    { sector: t('sector.energy'), success: 84, patents: 38, publications: 62 },
    { sector: t('sector.manufacturing'), success: 78, patents: 32, publications: 45 },
    { sector: t('sector.agriculture'), success: 82, patents: 28, publications: 52 },
  ];
  
  const sectorFundingVsOutput = [
    { x: 8.2, y: 92, z: 38, name: t('sector.healthcare') },
    { x: 7.8, y: 88, z: 42, name: t('sector.digital') },
    { x: 6.4, y: 84, z: 27, name: t('sector.energy') },
    { x: 4.2, y: 78, z: 21, name: t('sector.manufacturing') },
    { x: 1.9, y: 82, z: 18, name: t('sector.agriculture') },
  ];
  
  const growthByRegion = [
    { region: t('region.north'), digital: 24, health: 18, energy: 12, manufacturing: 8, agriculture: 6 },
    { region: t('region.central'), digital: 28, health: 24, energy: 14, manufacturing: 12, agriculture: 8 },
    { region: t('region.south'), digital: 18, health: 22, energy: 26, manufacturing: 10, agriculture: 14 },
    { region: t('region.islands'), digital: 14, health: 12, energy: 18, manufacturing: 6, agriculture: 10 },
  ];

  const handleChartClick = (chartId, chartType) => {
    navigate(`/visualization/sectors/${chartType}/${chartId}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('sector-distribution', 'pie')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('sector.distribution')}</CardTitle>
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
                  <Tooltip formatter={(value) => [`${value}%`, t('chart.percentage')]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('sector-performance', 'radar')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('sector.performance_metrics')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sectorPerformance}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="sector" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name={t('performance.success_rate')} dataKey="success" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name={t('performance.patents')} dataKey="patents" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Radar name={t('performance.publications')} dataKey="publications" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('funding-vs-success', 'scatter')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('sector.funding_vs_success')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name={t('chart.funding_eur')} />
                  <YAxis type="number" dataKey="y" name={t('chart.success_rate')} />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} name={t('chart.projects')} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => {
                    if (name === 'x') return [`€${value}M`, t('chart.funding')];
                    if (name === 'y') return [`${value}%`, t('chart.success_rate')];
                    if (name === 'z') return [value, t('chart.projects')];
                    return [value, name];
                  }} />
                  <Legend />
                  <Scatter name={t('chart.sectors')} data={sectorFundingVsOutput} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('growth-by-region', 'bar')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('sector.growth_by_region')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthByRegion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, t('chart.growth')]} />
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
