import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
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
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart
} from "recharts";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28'];

interface VisualizationParams {
  chartId?: string;
  chartType?: string;
  category?: string;
}

const VisualizationDetailPage = () => {
  const { chartId, chartType, category } = useParams<VisualizationParams>();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [chartTitle, setChartTitle] = useState("");
  const [chartDescription, setChartDescription] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    const fetchVisualizationData = () => {
      if (category === "funding") {
        getFundingData();
      } else if (category === "sectors") {
        getSectorData();
      } else if (category === "performance") {
        getPerformanceData();
      } else if (category === "regional") {
        getRegionalData();
      } else if (category === "predictive") {
        getPredictiveData();
      } else {
        setChartData([]);
        setChartTitle(t('visualization.unknown'));
        setChartDescription(t('visualization.no_data'));
      }
    };

    fetchVisualizationData();
  }, [chartId, chartType, category, t]);

  const getPredictiveData = () => {
    if (chartId === "funding-prediction") {
      setChartData([
        { name: "Recursos e financiamento", value: 85 },
        { name: "Equipe qualificada", value: 78 },
        { name: "Redes de colaboração", value: 68 },
        { name: "Infraestrutura", value: 63 },
        { name: "Propriedade intelectual", value: 55 },
      ]);
      setChartTitle("Fatores de Sucesso em Projetos de Inovação");
      setChartDescription("Análise dos principais fatores que influenciam o sucesso de projetos de inovação");
    } else if (chartId === "growth-trends") {
      setChartData([
        { year: '2024', quantumComputing: 92, biotech: 87, greenHydrogen: 83 },
        { year: '2025', quantumComputing: 94, biotech: 90, greenHydrogen: 87 },
        { year: '2026', quantumComputing: 95, biotech: 92, greenHydrogen: 90 },
        { year: '2027', quantumComputing: 97, biotech: 94, greenHydrogen: 92 },
        { year: '2028', quantumComputing: 98, biotech: 96, greenHydrogen: 94 },
      ]);
      setChartTitle("Tendências de Crescimento por Setor");
      setChartDescription("Projeção de crescimento para setores emergentes de alta tecnologia");
    } else {
      setChartData([]);
      setChartTitle("Dados Não Disponíveis");
      setChartDescription("Não foram encontrados dados para este modelo preditivo");
    }
  };

  const getFundingData = () => {
    if (chartId === "funding-sources") {
      setChartData([
        { name: t('funding.source.eu'), value: 42 },
        { name: t('funding.source.national'), value: 28 },
        { name: t('funding.source.private'), value: 18 },
        { name: t('funding.source.regional'), value: 12 },
      ]);
      setChartTitle(t('funding.sources.title'));
      setChartDescription(t('funding.sources.description'));
    } else if (chartId === "funding-growth") {
      setChartData([
        { year: '2018', amount: 12.4 },
        { year: '2019', amount: 16.8 },
        { year: '2020', amount: 18.2 },
        { year: '2021', amount: 22.5 },
        { year: '2022', amount: 25.7 },
        { year: '2023', amount: 28.5 },
      ]);
      setChartTitle(t('funding.growth.title'));
      setChartDescription(t('funding.growth.description'));
    } else if (chartId === "sector-funding") {
      setChartData([
        { name: t('sector.healthcare'), total: 8.2, growth: 18 },
        { name: t('sector.energy'), total: 6.4, growth: 12 },
        { name: t('sector.digital'), total: 7.8, growth: 22 },
        { name: t('sector.manufacturing'), total: 4.2, growth: 7 },
        { name: t('sector.agriculture'), total: 1.9, growth: 5 },
      ]);
      setChartTitle(t('funding.sector.allocation'));
      setChartDescription(t('funding.sector.description'));
    } else if (chartId === "quarterly-funding") {
      setChartData([
        { quarter: 'Q1 2022', public: 4.2, private: 2.1 },
        { quarter: 'Q2 2022', public: 4.5, private: 2.4 },
        { quarter: 'Q3 2022', public: 5.1, private: 2.7 },
        { quarter: 'Q4 2022', public: 5.4, private: 3.0 },
        { quarter: 'Q1 2023', public: 5.8, private: 3.2 },
        { quarter: 'Q2 2023', public: 6.2, private: 3.7 },
      ]);
      setChartTitle(t('funding.public_private'));
      setChartDescription(t('funding.public_private.description'));
    }
  };

  const getSectorData = () => {
    if (chartId === "sector-distribution") {
      setChartData([
        { name: t('sector.digital'), projects: 42, value: 32 },
        { name: t('sector.healthcare'), projects: 38, value: 24 },
        { name: t('sector.energy'), projects: 27, value: 18 },
        { name: t('sector.manufacturing'), projects: 21, value: 14 },
        { name: t('sector.agriculture'), projects: 18, value: 12 },
      ]);
      setChartTitle(t('sector.distribution'));
      setChartDescription(t('sector.distribution.description'));
    } else if (chartId === "sector-performance") {
      setChartData([
        { sector: t('sector.digital'), success: 88, patents: 42, publications: 78 },
        { sector: t('sector.healthcare'), success: 92, patents: 56, publications: 94 },
        { sector: t('sector.energy'), success: 84, patents: 38, publications: 62 },
        { sector: t('sector.manufacturing'), success: 78, patents: 32, publications: 45 },
        { sector: t('sector.agriculture'), success: 82, patents: 28, publications: 52 },
      ]);
      setChartTitle(t('sector.performance.metrics'));
      setChartDescription(t('sector.performance.metrics.description'));
    } else if (chartId === "funding-vs-success") {
      setChartData([
        { x: 8.2, y: 92, z: 38, name: t('sector.healthcare') },
        { x: 7.8, y: 88, z: 42, name: t('sector.digital') },
        { x: 6.4, y: 84, z: 27, name: t('sector.energy') },
        { x: 4.2, y: 78, z: 21, name: t('sector.manufacturing') },
        { x: 1.9, y: 82, z: 18, name: t('sector.agriculture') },
      ]);
      setChartTitle(t('funding.success.rate'));
      setChartDescription(t('funding.success.rate.description'));
    } else if (chartId === "growth-by-region") {
      setChartData([
        { region: t('region.north'), digital: 24, health: 18, energy: 12, manufacturing: 8, agriculture: 6 },
        { region: t('region.central'), digital: 28, health: 24, energy: 14, manufacturing: 12, agriculture: 8 },
        { region: t('region.south'), digital: 18, health: 22, energy: 26, manufacturing: 10, agriculture: 14 },
        { region: t('region.islands'), digital: 14, health: 12, energy: 18, manufacturing: 6, agriculture: 10 },
      ]);
      setChartTitle(t('region.growth.by.sector'));
      setChartDescription(t('region.growth.by.sector.description'));
    }
  };

  const getPerformanceData = () => {
    if (chartId === "performance-trends") {
      setChartData([
        { year: 2018, success: 76, patents: 32, publications: 48, commercialization: 15 },
        { year: 2019, success: 78, patents: 38, publications: 52, commercialization: 18 },
        { year: 2020, success: 82, patents: 42, publications: 58, commercialization: 22 },
        { year: 2021, success: 85, patents: 48, publications: 64, commercialization: 26 },
        { year: 2022, success: 88, patents: 56, publications: 72, commercialization: 32 },
        { year: 2023, success: 92, patents: 62, publications: 78, commercialization: 38 },
      ]);
      setChartTitle(t('performance.trends'));
      setChartDescription(t('performance.trends.description'));
    } else if (chartId === "project-completion") {
      setChartData([
        { quarter: 'Q1 2022', onTime: 68, delayed: 32 },
        { quarter: 'Q2 2022', onTime: 72, delayed: 28 },
        { quarter: 'Q3 2022', onTime: 75, delayed: 25 },
        { quarter: 'Q4 2022', onTime: 78, delayed: 22 },
        { quarter: 'Q1 2023', onTime: 82, delayed: 18 },
        { quarter: 'Q2 2023', onTime: 85, delayed: 15 },
      ]);
      setChartTitle(t('project.completion'));
      setChartDescription(t('project.completion.description'));
    } else if (chartId === "budget-adherence") {
      setChartData([
        { year: 2018, underBudget: 32, withinBudget: 43, overBudget: 25 },
        { year: 2019, underBudget: 35, withinBudget: 45, overBudget: 20 },
        { year: 2020, underBudget: 38, withinBudget: 47, overBudget: 15 },
        { year: 2021, underBudget: 42, withinBudget: 48, overBudget: 10 },
        { year: 2022, underBudget: 45, withinBudget: 48, overBudget: 7 },
        { year: 2023, underBudget: 48, withinBudget: 47, overBudget: 5 },
      ]);
      setChartTitle(t('budget.adherence'));
      setChartDescription(t('budget.adherence.description'));
    } else if (chartId === "kpi-performance") {
      setChartData([
        { kpi: t('kpi.project.success'), value: 92, target: 85 },
        { kpi: t('kpi.patent.applications'), value: 62, target: 50 },
        { kpi: t('kpi.publications'), value: 78, target: 70 },
        { kpi: t('kpi.commercialization'), value: 38, target: 30 },
        { kpi: t('kpi.budget.adherence'), value: 95, target: 90 },
        { kpi: t('kpi.on.time.completion'), value: 85, target: 80 },
      ]);
      setChartTitle(t('kpi.performance'));
      setChartDescription(t('kpi.performance.description'));
    }
  };

  const getRegionalData = () => {
    if (chartId === "projects-by-region") {
      setChartData([
        { name: t('region.north'), value: 42 },
        { name: t('region.central'), value: 58 },
        { name: t('region.south'), value: 38 },
        { name: t('region.islands'), value: 18 },
      ]);
      setChartTitle(t('region.projects'));
      setChartDescription(t('region.projects.description'));
    } else if (chartId === "investment-by-region") {
      setChartData([
        { region: t('region.north'), value: 8.2 },
        { region: t('region.central'), value: 12.5 },
        { region: t('region.south'), value: 5.4 },
        { region: t('region.islands'), value: 2.4 },
      ]);
      setChartTitle(t('region.investment'));
      setChartDescription(t('region.investment.description'));
    } else if (chartId === "regional-growth") {
      setChartData([
        { year: 2018, north: 8, central: 12, south: 5, islands: 3 },
        { year: 2019, north: 10, central: 14, south: 7, islands: 4 },
        { year: 2020, north: 12, central: 16, south: 8, islands: 5 },
        { year: 2021, north: 15, central: 18, south: 10, islands: 6 },
        { year: 2022, north: 18, central: 22, south: 12, islands: 7 },
        { year: 2023, north: 22, central: 26, south: 15, islands: 9 },
      ]);
      setChartTitle(t('region.growth.trends'));
      setChartDescription(t('region.growth.trends.description'));
    } else if (chartId === "regional-sectors") {
      setChartData([
        { region: t('region.north'), digital: 18, health: 12, energy: 6, manufacturing: 4, agriculture: 2 },
        { region: t('region.central'), digital: 22, health: 16, energy: 10, manufacturing: 6, agriculture: 4 },
        { region: t('region.south'), digital: 12, health: 14, energy: 8, manufacturing: 3, agriculture: 1 },
        { region: t('region.islands'), digital: 6, health: 4, energy: 6, manufacturing: 1, agriculture: 1 },
      ]);
      setChartTitle(t('region.sector.distribution'));
      setChartDescription(t('region.sector.distribution.description'));
    }
  };

  const renderChart = () => {
    if (!chartData || chartData.length === 0) {
      return <div className="h-80 flex items-center justify-center">{t('visualization.loading')}</div>;
    }

    switch (chartType) {
      case 'pie':
        return (
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={200}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'bar':
        return (
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(chartData[0])
                  .filter(key => key !== 'name' && key !== Object.keys(chartData[0])[0])
                  .map((key, index) => (
                    <Bar 
                      key={key} 
                      dataKey={key} 
                      fill={COLORS[index % COLORS.length]} 
                      name={t(`chart.label.${key}`, { defaultValue: key })} 
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'line':
        return (
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={Object.keys(chartData[0])[0]} />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(chartData[0])
                  .filter(key => key !== 'name' && key !== Object.keys(chartData[0])[0])
                  .map((key, index) => (
                    <Line 
                      key={key} 
                      type="monotone" 
                      dataKey={key} 
                      stroke={COLORS[index % COLORS.length]} 
                      activeDot={{ r: 8 }} 
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'area':
        return (
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={Object.keys(chartData[0])[0]} />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(chartData[0])
                  .filter(key => key !== 'name' && key !== Object.keys(chartData[0])[0])
                  .map((key, index) => (
                    <Area 
                      key={key} 
                      type="monotone" 
                      dataKey={key} 
                      stroke={COLORS[index % COLORS.length]} 
                      fill={COLORS[index % COLORS.length]} 
                      fillOpacity={0.3} 
                    />
                  ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case 'scatter':
        return (
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="Funding (€M)" />
                <YAxis type="number" dataKey="y" name="Success Rate (%)" />
                <ZAxis type="number" dataKey="z" range={[60, 400]} name="Projects" />
                <Tooltip />
                <Legend />
                <Scatter name="Sectors" data={chartData} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );

      case 'radar':
        return (
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="sector" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                {Object.keys(chartData[0])
                  .filter(key => key !== 'sector' && key !== 'name')
                  .map((key, index) => (
                    <Radar 
                      key={key} 
                      name={key} 
                      dataKey={key} 
                      stroke={COLORS[index % COLORS.length]} 
                      fill={COLORS[index % COLORS.length]} 
                      fillOpacity={0.6} 
                    />
                  ))}
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'composed':
        return (
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={Object.keys(chartData[0])[0]} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="onTime" name="On Time" fill="#82ca9d" stroke="#82ca9d" />
                <Bar dataKey="delayed" name="Delayed" fill="#ff8042" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        );

      case 'model':
        if (chartId === 'funding-prediction') {
          return (
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={200}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          );
        } else if (chartId === 'growth-trends') {
          return (
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="quantumComputing" name="Quantum Computing" stroke="#8884d8" />
                  <Line type="monotone" dataKey="biotech" name="Biotecnologia Avançada" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="greenHydrogen" name="Hidrogênio Verde" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        }
        return (
          <div className="h-80 flex items-center justify-center">Modelo não disponível</div>
        );

      default:
        return (
          <div className="h-80 flex items-center justify-center">
            {t('visualization.unknown_type')}: {chartType}
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> {t('visualization.back')}
        </Button>
        <h1 className="text-2xl font-bold">{chartTitle}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{chartTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">{chartDescription}</p>
          {renderChart()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('visualization.insights')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {t('visualization.insight_description')}
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2">{t('visualization.observations')}</h4>
              <ul className="text-xs space-y-2 list-disc pl-4">
                <li>{t('visualization.observation1')}</li>
                <li>{t('visualization.observation2')}</li>
                <li>{t('visualization.observation3')}</li>
                <li>{t('visualization.observation4')}</li>
              </ul>
            </div>
            <div className="border rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2">{t('visualization.recommendations')}</h4>
              <ul className="text-xs space-y-2 list-disc pl-4">
                <li>{t('visualization.recommendation1')}</li>
                <li>{t('visualization.recommendation2')}</li>
                <li>{t('visualization.recommendation3')}</li>
                <li>{t('visualization.recommendation4')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualizationDetailPage;
