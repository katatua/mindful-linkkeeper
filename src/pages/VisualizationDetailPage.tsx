
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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

const VisualizationDetailPage = () => {
  const { chartId, chartType, category } = useParams();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [chartTitle, setChartTitle] = useState("");
  const [chartDescription, setChartDescription] = useState("");

  useEffect(() => {
    // This function would normally fetch data from an API
    // For this demo, we'll use mock data based on the chartId and chartType
    const fetchVisualizationData = () => {
      // Sample data providers based on category
      if (category === "funding") {
        getFundingData();
      } else if (category === "sectors") {
        getSectorData();
      } else if (category === "performance") {
        getPerformanceData();
      } else if (category === "regional") {
        getRegionalData();
      } else {
        // Default data
        setChartData([]);
        setChartTitle("Unknown Chart");
        setChartDescription("No data available for this visualization");
      }
    };

    fetchVisualizationData();
  }, [chartId, chartType, category]);

  const getFundingData = () => {
    if (chartId === "funding-sources") {
      setChartData([
        { name: 'EU Horizon Europe', value: 42 },
        { name: 'National Funds', value: 28 },
        { name: 'Private Investment', value: 18 },
        { name: 'Regional Programs', value: 12 },
      ]);
      setChartTitle("Funding Sources (2023)");
      setChartDescription("Detailed breakdown of innovation funding by source for the year 2023. The European Union's Horizon Europe program represents the largest funding source at 42%, followed by National Funds at 28%, Private Investment at 18%, and Regional Programs at 12%.");
    } else if (chartId === "funding-growth") {
      setChartData([
        { year: '2018', amount: 12.4 },
        { year: '2019', amount: 16.8 },
        { year: '2020', amount: 18.2 },
        { year: '2021', amount: 22.5 },
        { year: '2022', amount: 25.7 },
        { year: '2023', amount: 28.5 },
      ]);
      setChartTitle("Funding Growth (€M)");
      setChartDescription("Year-over-year growth in innovation funding from 2018 to 2023. The data shows a consistent upward trend, with total funding more than doubling from €12.4M in 2018 to €28.5M in 2023.");
    } else if (chartId === "sector-funding") {
      setChartData([
        { name: 'Healthcare', total: 8.2, growth: 18 },
        { name: 'Energy', total: 6.4, growth: 12 },
        { name: 'Digital Tech', total: 7.8, growth: 22 },
        { name: 'Manufacturing', total: 4.2, growth: 7 },
        { name: 'Agriculture', total: 1.9, growth: 5 },
      ]);
      setChartTitle("Sector Funding Allocation (€M)");
      setChartDescription("Funding allocation across different innovation sectors. Healthcare leads with €8.2M, followed closely by Digital Tech with €7.8M. Energy, Manufacturing, and Agriculture receive €6.4M, €4.2M, and €1.9M respectively.");
    } else if (chartId === "quarterly-funding") {
      setChartData([
        { quarter: 'Q1 2022', public: 4.2, private: 2.1 },
        { quarter: 'Q2 2022', public: 4.5, private: 2.4 },
        { quarter: 'Q3 2022', public: 5.1, private: 2.7 },
        { quarter: 'Q4 2022', public: 5.4, private: 3.0 },
        { quarter: 'Q1 2023', public: 5.8, private: 3.2 },
        { quarter: 'Q2 2023', public: 6.2, private: 3.7 },
      ]);
      setChartTitle("Public vs Private Funding (€M)");
      setChartDescription("Quarterly comparison of public and private funding sources from Q1 2022 to Q2 2023. Public funding consistently outpaces private investment, though both show steady growth. By Q2 2023, public funding reached €6.2M while private funding grew to €3.7M.");
    }
  };

  const getSectorData = () => {
    if (chartId === "sector-distribution") {
      setChartData([
        { name: 'Digital Tech', projects: 42, value: 32 },
        { name: 'Healthcare', projects: 38, value: 24 },
        { name: 'Energy', projects: 27, value: 18 },
        { name: 'Manufacturing', projects: 21, value: 14 },
        { name: 'Agriculture', projects: 18, value: 12 },
      ]);
      setChartTitle("Sector Distribution");
      setChartDescription("Distribution of innovation projects across different sectors. Digital Technology leads with 42 projects (32%), followed by Healthcare with 38 projects (24%), Energy with 27 projects (18%), Manufacturing with 21 projects (14%), and Agriculture with 18 projects (12%).");
    } else if (chartId === "sector-performance") {
      setChartData([
        { sector: 'Digital Tech', success: 88, patents: 42, publications: 78 },
        { sector: 'Healthcare', success: 92, patents: 56, publications: 94 },
        { sector: 'Energy', success: 84, patents: 38, publications: 62 },
        { sector: 'Manufacturing', success: 78, patents: 32, publications: 45 },
        { sector: 'Agriculture', success: 82, patents: 28, publications: 52 },
      ]);
      setChartTitle("Sector Performance Metrics");
      setChartDescription("Comparative analysis of key performance indicators across sectors. Healthcare shows the highest success rate at 92% and leads in patents (56) and publications (94). Digital Tech follows with an 88% success rate, while Manufacturing has the lowest success rate at 78%.");
    } else if (chartId === "funding-vs-success") {
      setChartData([
        { x: 8.2, y: 92, z: 38, name: 'Healthcare' },
        { x: 7.8, y: 88, z: 42, name: 'Digital Tech' },
        { x: 6.4, y: 84, z: 27, name: 'Energy' },
        { x: 4.2, y: 78, z: 21, name: 'Manufacturing' },
        { x: 1.9, y: 82, z: 18, name: 'Agriculture' },
      ]);
      setChartTitle("Funding vs Success Rate");
      setChartDescription("Correlation between funding allocation (x-axis, €M), success rate (y-axis, %), and number of projects (bubble size). Healthcare shows the highest success rate (92%) with €8.2M funding, while Agriculture achieves an 82% success rate with only €1.9M in funding.");
    } else if (chartId === "growth-by-region") {
      setChartData([
        { region: 'North', digital: 24, health: 18, energy: 12, manufacturing: 8, agriculture: 6 },
        { region: 'Central', digital: 28, health: 24, energy: 14, manufacturing: 12, agriculture: 8 },
        { region: 'South', digital: 18, health: 22, energy: 26, manufacturing: 10, agriculture: 14 },
        { region: 'Islands', digital: 14, health: 12, energy: 18, manufacturing: 6, agriculture: 10 },
      ]);
      setChartTitle("Growth by Region & Sector (%)");
      setChartDescription("Regional growth rates across different sectors. The Central region leads in Digital Tech (28%) and Manufacturing (12%), while the South region shows strongest growth in Energy (26%) and Agriculture (14%). The Islands region generally shows lower growth rates across most sectors.");
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
      setChartTitle("Performance Trends");
      setChartDescription("Year-over-year trends in key performance metrics from 2018 to 2023. All metrics show consistent growth, with success rate improving from 76% to 92%, patents increasing from 32 to 62, publications growing from 48 to 78, and commercialization rising from 15 to 38.");
    } else if (chartId === "project-completion") {
      setChartData([
        { quarter: 'Q1 2022', onTime: 68, delayed: 32 },
        { quarter: 'Q2 2022', onTime: 72, delayed: 28 },
        { quarter: 'Q3 2022', onTime: 75, delayed: 25 },
        { quarter: 'Q4 2022', onTime: 78, delayed: 22 },
        { quarter: 'Q1 2023', onTime: 82, delayed: 18 },
        { quarter: 'Q2 2023', onTime: 85, delayed: 15 },
      ]);
      setChartTitle("Project Completion Rates (%)");
      setChartDescription("Quarterly project completion rates, showing the percentage of projects completed on time versus delayed. On-time completion has improved from 68% in Q1 2022 to 85% in Q2 2023, while delayed projects have decreased from 32% to 15% in the same period.");
    } else if (chartId === "budget-adherence") {
      setChartData([
        { year: 2018, underBudget: 32, withinBudget: 43, overBudget: 25 },
        { year: 2019, underBudget: 35, withinBudget: 45, overBudget: 20 },
        { year: 2020, underBudget: 38, withinBudget: 47, overBudget: 15 },
        { year: 2021, underBudget: 42, withinBudget: 48, overBudget: 10 },
        { year: 2022, underBudget: 45, withinBudget: 48, overBudget: 7 },
        { year: 2023, underBudget: 48, withinBudget: 47, overBudget: 5 },
      ]);
      setChartTitle("Budget Adherence (%)");
      setChartDescription("Annual budget adherence trends from 2018 to 2023. Projects completing under budget have increased from 32% to 48%, those within budget have remained relatively stable (43% to 47%), while over-budget projects have significantly decreased from 25% to just 5%.");
    } else if (chartId === "kpi-performance") {
      setChartData([
        { kpi: 'Project Success Rate', value: 92, target: 85 },
        { kpi: 'Patent Applications', value: 62, target: 50 },
        { kpi: 'Publications', value: 78, target: 70 },
        { kpi: 'Commercialization', value: 38, target: 30 },
        { kpi: 'Budget Adherence', value: 95, target: 90 },
        { kpi: 'On-time Completion', value: 85, target: 80 },
      ]);
      setChartTitle("KPI Performance vs Target");
      setChartDescription("Comparison of current KPI values against their targets. All KPIs are exceeding their targets, with particularly strong performance in Project Success Rate (92% vs 85% target) and Patent Applications (62 vs 50 target).");
    }
  };

  const getRegionalData = () => {
    if (chartId === "projects-by-region") {
      setChartData([
        { name: 'North', value: 42 },
        { name: 'Central', value: 58 },
        { name: 'South', value: 38 },
        { name: 'Islands', value: 18 },
      ]);
      setChartTitle("Projects by Region");
      setChartDescription("Distribution of innovation projects across regions. The Central region leads with 58 projects, followed by the North with 42 projects, the South with 38 projects, and the Islands with 18 projects.");
    } else if (chartId === "investment-by-region") {
      setChartData([
        { region: 'North', value: 8.2 },
        { region: 'Central', value: 12.5 },
        { region: 'South', value: 5.4 },
        { region: 'Islands', value: 2.4 },
      ]);
      setChartTitle("Investment by Region (€M)");
      setChartDescription("Regional distribution of innovation investment. The Central region receives the largest share at €12.5M, followed by the North at €8.2M, the South at €5.4M, and the Islands at €2.4M.");
    } else if (chartId === "regional-growth") {
      setChartData([
        { year: 2018, north: 8, central: 12, south: 5, islands: 3 },
        { year: 2019, north: 10, central: 14, south: 7, islands: 4 },
        { year: 2020, north: 12, central: 16, south: 8, islands: 5 },
        { year: 2021, north: 15, central: 18, south: 10, islands: 6 },
        { year: 2022, north: 18, central: 22, south: 12, islands: 7 },
        { year: 2023, north: 22, central: 26, south: 15, islands: 9 },
      ]);
      setChartTitle("Regional Growth Trends (€M)");
      setChartDescription("Year-over-year growth in regional investment from 2018 to 2023. All regions show steady growth, with the Central region consistently receiving the highest investment, growing from €12M to €26M. The North region shows the second-highest growth, from €8M to €22M.");
    } else if (chartId === "regional-sectors") {
      setChartData([
        { region: 'North', digital: 18, health: 12, energy: 6, manufacturing: 4, agriculture: 2 },
        { region: 'Central', digital: 22, health: 16, energy: 10, manufacturing: 6, agriculture: 4 },
        { region: 'South', digital: 12, health: 14, energy: 8, manufacturing: 3, agriculture: 1 },
        { region: 'Islands', digital: 6, health: 4, energy: 6, manufacturing: 1, agriculture: 1 },
      ]);
      setChartTitle("Regional Sector Distribution");
      setChartDescription("Distribution of projects across sectors within each region. The Central region leads in all sectors except Agriculture, with particular strength in Digital Tech (22 projects) and Healthcare (16 projects). The South region shows stronger focus on Healthcare than Digital Tech.");
    }
  };

  const renderChart = () => {
    if (!chartData || chartData.length === 0) {
      return <div className="h-80 flex items-center justify-center">Loading data...</div>;
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
                <Tooltip formatter={(value, name, props) => {
                  if (name === 'value') return [`${value}`, 'Value'];
                  return [value, name];
                }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'bar':
        return (
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={Object.keys(chartData[0])[0]} />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(chartData[0])
                  .filter(key => key !== 'name' && key !== Object.keys(chartData[0])[0])
                  .map((key, index) => (
                    <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
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
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => {
                  if (name === 'x') return [`€${value}M`, 'Funding'];
                  if (name === 'y') return [`${value}%`, 'Success Rate'];
                  if (name === 'z') return [value, 'Projects'];
                  return [value, name];
                }} />
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

      default:
        return (
          <div className="h-80 flex items-center justify-center">
            Unknown chart type: {chartType}
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
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
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
          <CardTitle className="text-sm">Additional Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            This detailed view provides deeper analysis of the data presented in the main dashboard.
            You can explore trends, patterns, and anomalies more thoroughly with this expanded visualization.
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2">Key Observations</h4>
              <ul className="text-xs space-y-2 list-disc pl-4">
                <li>Trend shows consistent growth over the observed period</li>
                <li>Regional variations indicate different adoption patterns</li>
                <li>Correlations between funding and outcomes are significant</li>
                <li>Year-over-year improvements across all key metrics</li>
              </ul>
            </div>
            <div className="border rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2">Recommendations</h4>
              <ul className="text-xs space-y-2 list-disc pl-4">
                <li>Continue current investment strategy given positive outcomes</li>
                <li>Consider rebalancing regional allocations to address disparities</li>
                <li>Develop enhanced metrics for tracking long-term impact</li>
                <li>Implement targeted interventions for underperforming areas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualizationDetailPage;
