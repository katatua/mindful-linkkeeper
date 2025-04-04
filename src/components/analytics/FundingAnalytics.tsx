
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Area
} from "recharts";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

export const FundingAnalytics = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Sample data for funding analytics with translated names
  const fundingBySource = [
    { name: t('funding.source.eu'), value: 42 },
    { name: t('funding.source.national'), value: 28 },
    { name: t('funding.source.private'), value: 18 },
    { name: t('funding.source.regional'), value: 12 },
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
    { name: t('sector.healthcare'), total: 8.2, growth: 18 },
    { name: t('sector.energy'), total: 6.4, growth: 12 },
    { name: t('sector.digital'), total: 7.8, growth: 22 },
    { name: t('sector.manufacturing'), total: 4.2, growth: 7 },
    { name: t('sector.agriculture'), total: 1.9, growth: 5 },
  ];
  
  const quarterlyFunding = [
    { quarter: 'Q1 2022', public: 4.2, private: 2.1 },
    { quarter: 'Q2 2022', public: 4.5, private: 2.4 },
    { quarter: 'Q3 2022', public: 5.1, private: 2.7 },
    { quarter: 'Q4 2022', public: 5.4, private: 3.0 },
    { quarter: 'Q1 2023', public: 5.8, private: 3.2 },
    { quarter: 'Q2 2023', public: 6.2, private: 3.7 },
  ];

  const handleChartClick = (chartId, chartType) => {
    navigate(`/visualization/funding/${chartType}/${chartId}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('funding-sources', 'pie')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('funding.sources.title')}</CardTitle>
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
                  <Tooltip formatter={(value) => [`${value}%`, t('chart.percentage')]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('funding-growth', 'area')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('funding.growth.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fundingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${value}M`, t('chart.funding')]} />
                  <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name={t('chart.amount')} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('sector-funding', 'bar')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('funding.sector.allocation')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorFunding}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${value}M`, t('chart.funding')]} />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8" name={t('chart.total_funding')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChartClick('quarterly-funding', 'line')}>
          <CardHeader>
            <CardTitle className="text-lg">{t('funding.public_private')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quarterlyFunding}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${value}M`, t('chart.funding')]} />
                  <Legend />
                  <Line type="monotone" dataKey="public" stroke="#8884d8" name={t('chart.public_funding')} />
                  <Line type="monotone" dataKey="private" stroke="#82ca9d" name={t('chart.private_funding')} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
