
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface PolicyImpactProps {
  className?: string;
}

export const PolicyImpact = ({ className }: PolicyImpactProps) => {
  // Sample data for policy impact metrics
  const sectoralImpactData = [
    { name: "Digital Tech", value: 78 },
    { name: "Health & Biotech", value: 65 },
    { name: "Clean Energy", value: 82 },
    { name: "Advanced Manuf.", value: 54 },
    { name: "Agri-food", value: 47 },
  ];

  const timeSeriesData = [
    { year: "2018", patentApplications: 230, startupCreation: 120, privateInvestment: 85 },
    { year: "2019", patentApplications: 280, startupCreation: 150, privateInvestment: 95 },
    { year: "2020", patentApplications: 310, startupCreation: 140, privateInvestment: 90 },
    { year: "2021", patentApplications: 350, startupCreation: 180, privateInvestment: 110 },
    { year: "2022", patentApplications: 410, startupCreation: 220, privateInvestment: 145 },
    { year: "2023", patentApplications: 470, startupCreation: 250, privateInvestment: 170 },
  ];

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sectoral Impact (Policy Effectiveness Score)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sectoralImpactData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}/100`, 'Score']} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Innovation Indicators (2018-2023)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeSeriesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="patentApplications" stroke="#3b82f6" activeDot={{ r: 8 }} name="Patent Applications" />
                <Line type="monotone" dataKey="startupCreation" stroke="#10b981" name="Startup Creation" />
                <Line type="monotone" dataKey="privateInvestment" stroke="#f59e0b" name="Private Investment (€M)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Policy Impact Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Key Achievements</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-gray-600">104% increase in patent applications (2018-2023)</li>
                <li className="text-gray-600">108% increase in startup creation rate</li>
                <li className="text-gray-600">100% growth in private investment in R&D</li>
                <li className="text-gray-600">82% effectiveness score in Clean Energy policies</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Areas for Improvement</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-gray-600">Agri-food innovation ecosystem requires additional support</li>
                <li className="text-gray-600">Advanced Manufacturing policy effectiveness below target (54%)</li>
                <li className="text-gray-600">Regional disparity in innovation outcomes persists</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyImpact;
