
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    { kpi: 'Project Success Rate', value: 92, target: 85 },
    { kpi: 'Patent Applications', value: 62, target: 50 },
    { kpi: 'Publications', value: 78, target: 70 },
    { kpi: 'Commercialization', value: 38, target: 30 },
    { kpi: 'Budget Adherence', value: 95, target: 90 },
    { kpi: 'On-time Completion', value: 85, target: 80 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Trends</CardTitle>
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
                  <Line type="monotone" dataKey="success" name="Success Rate (%)" stroke="#8884d8" />
                  <Line type="monotone" dataKey="patents" name="Patents" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="publications" name="Publications" stroke="#ffc658" />
                  <Line type="monotone" dataKey="commercialization" name="Commercialization" stroke="#ff8042" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Completion Rates (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={projectCompletion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                  <Area type="monotone" dataKey="onTime" name="On Time" fill="#82ca9d" stroke="#82ca9d" />
                  <Bar dataKey="delayed" name="Delayed" fill="#ff8042" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Budget Adherence (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetAdherence}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                  <Bar dataKey="underBudget" name="Under Budget" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="withinBudget" name="Within Budget" stackId="a" fill="#8884d8" />
                  <Bar dataKey="overBudget" name="Over Budget" stackId="a" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">KPI Performance vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpiPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="kpi" />
                  <Tooltip formatter={(value) => [`${value}`, 'Value']} />
                  <Legend />
                  <Bar dataKey="value" name="Current" fill="#8884d8" />
                  <Bar dataKey="target" name="Target" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
