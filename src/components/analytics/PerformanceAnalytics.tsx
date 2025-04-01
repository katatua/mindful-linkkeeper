
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  BarChart
} from "recharts";

export const PerformanceAnalytics = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Sample data for performance analytics
  const performanceTrends = [
    { year: 2018, success: 76, patents: 32, publications: 48, commercialization: 15 },
    { year: 2019, success: 78, patents: 38, publications: 52, commercialization: 18 },
    { year: 2020, success: 82, patents: 42, publications: 58, commercialization: 22 },
    { year: 2021, success: 85, patents: 48, publications: 64, commercialization: 26 },
    { year: 2022, success: 88, patents: 56, publications: 72, commercialization: 32 },
    { year: 2023, success: 92, patents: 62, publications: 78, commercialization: 38 },
  ];
  
  const projectCompletion = [
    { quarter: 'Q1 2022', onTime: 68, delayed: 32 },
    { quarter: 'Q2 2022', onTime: 72, delayed: 28 },
    { quarter: 'Q3 2022', onTime: 75, delayed: 25 },
    { quarter: 'Q4 2022', onTime: 78, delayed: 22 },
    { quarter: 'Q1 2023', onTime: 82, delayed: 18 },
    { quarter: 'Q2 2023', onTime: 85, delayed: 15 },
  ];
  
  const budgetAdherence = [
    { year: 2018, underBudget: 32, withinBudget: 43, overBudget: 25 },
    { year: 2019, underBudget: 35, withinBudget: 45, overBudget: 20 },
    { year: 2020, underBudget: 38, withinBudget: 47, overBudget: 15 },
    { year: 2021, underBudget: 42, withinBudget: 48, overBudget: 10 },
    { year: 2022, underBudget: 45, withinBudget: 48, overBudget: 7 },
    { year: 2023, underBudget: 48, withinBudget: 47, overBudget: 5 },
  ];
  
  const kpiPerformance = [
    { kpi: t('performance.kpi.success_rate'), value: 92, target: 85 },
    { kpi: t('performance.kpi.patents'), value: 62, target: 50 },
    { kpi: t('performance.kpi.publications'), value: 78, target: 70 },
    { kpi: t('performance.kpi.commercialization'), value: 38, target: 30 },
    { kpi: t('performance.kpi.budget'), value: 95, target: 90 },
    { kpi: t('performance.kpi.completion'), value: 85, target: 80 },
  ];

  const handleChartClick = (chartId, chartType) => {
    navigate(`/visualization/performance/${chartType}/${chartId}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('performance-trends', 'line')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('performance.trends')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="success" name={t('performance.success_rate')} stroke="#8884d8" />
                  <Line type="monotone" dataKey="patents" name={t('performance.patents')} stroke="#82ca9d" />
                  <Line type="monotone" dataKey="publications" name={t('performance.publications')} stroke="#ffc658" />
                  <Line type="monotone" dataKey="commercialization" name={t('performance.commercialization')} stroke="#ff8042" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('project-completion', 'composed')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('performance.completion_rates')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={projectCompletion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, t('chart.percentage')]} />
                  <Legend />
                  <Area type="monotone" dataKey="onTime" name={t('performance.on_time')} fill="#82ca9d" stroke="#82ca9d" />
                  <Bar dataKey="delayed" name={t('performance.delayed')} fill="#ff8042" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('budget-adherence', 'bar')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('performance.budget_adherence')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetAdherence}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, t('chart.percentage')]} />
                  <Legend />
                  <Bar dataKey="underBudget" name={t('performance.under_budget')} stackId="a" fill="#82ca9d" />
                  <Bar dataKey="withinBudget" name={t('performance.within_budget')} stackId="a" fill="#8884d8" />
                  <Bar dataKey="overBudget" name={t('performance.over_budget')} stackId="a" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('kpi-performance', 'bar')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('performance.kpi_vs_target')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpiPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="kpi" />
                  <Tooltip formatter={(value) => [`${value}`, t('chart.value')]} />
                  <Legend />
                  <Bar dataKey="value" name={t('performance.current')} fill="#8884d8" />
                  <Bar dataKey="target" name={t('performance.target')} fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
