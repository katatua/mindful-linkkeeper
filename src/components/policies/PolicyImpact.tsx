
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const PolicyImpact = () => {
  // Sample data for charts
  const rdInvestmentData = [
    { year: '2018', value: 1.4 },
    { year: '2019', value: 1.5 },
    { year: '2020', value: 1.6 },
    { year: '2021', value: 1.7 },
    { year: '2022', value: 1.9 },
    { year: '2023', value: 2.1 }
  ];
  
  const startupCreationData = [
    { year: '2018', value: 321 },
    { year: '2019', value: 347 },
    { year: '2020', value: 305 },
    { year: '2021', value: 389 },
    { year: '2022', value: 412 },
    { year: '2023', value: 436 }
  ];
  
  const policyImpactData = [
    { name: 'Tax Incentives', impact: 8.5 },
    { name: 'Grants', impact: 7.2 },
    { name: 'Tech Transfer', impact: 6.8 },
    { name: 'Startup Support', impact: 8.2 },
    { name: 'Intl Partnerships', impact: 5.4 },
    { name: 'Regulatory', impact: 4.3 }
  ];
  
  const sectoralImpactData = [
    { name: 'Health Sciences', currentYear: 8.5, previousYear: 7.2 },
    { name: 'Digital Tech', currentYear: 9.2, previousYear: 8.5 },
    { name: 'Energy & Environment', currentYear: 7.8, previousYear: 6.2 },
    { name: 'Manufacturing', currentYear: 6.5, previousYear: 6.3 },
    { name: 'Agriculture', currentYear: 5.9, previousYear: 4.8 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">R&D Investment Trend</CardTitle>
            <CardDescription>
              Impact of innovation policies on R&D investment (% of GDP)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rdInvestmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[1, 2.5]} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#2563eb" fill="#dbeafe" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Innovative Startup Creation</CardTitle>
            <CardDescription>
              Annual number of innovative startups registered
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={startupCreationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[250, 450]} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#0891b2" fill="#cffafe" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Policy Effectiveness Rating</CardTitle>
          <CardDescription>
            Estimated impact of different policy instruments (1-10 scale)
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={policyImpactData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 10]} />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="impact" fill="#4f46e5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Sectoral Analysis</CardTitle>
          <CardDescription>
            Impact of innovation policies by sector
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectoralImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="previousYear" name="2022" fill="#94a3b8" />
                  <Bar dataKey="currentYear" name="2023" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="analysis">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Digital Technologies</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    The digital sector has shown the strongest response to innovation policies, with a 8.2% increase in 
                    value creation. Implementation of the Digital Transition Action Plan has been particularly effective 
                    in stimulating research and commercial applications.
                  </p>
                  <div className="bg-blue-50 text-blue-800 text-sm p-2 rounded">
                    Key success: Digital Innovation Hubs program connecting startups with industry
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Energy & Environment</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Green transition policies have driven significant innovation in this sector, showing a 25.8% improvement 
                    year-over-year. The integration of sustainability criteria in funding programs has shifted R&D focus.
                  </p>
                  <div className="bg-blue-50 text-blue-800 text-sm p-2 rounded">
                    Key success: Green Deal Portugal alignment with European initiatives
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Health Sciences</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Moderate impact observed with 18.1% improvement. Recent focus on biotech has led to new 
                    ventures but results will require longer maturation periods.
                  </p>
                  <div className="bg-blue-50 text-blue-800 text-sm p-2 rounded">
                    Key success: Health Cluster Portugal initiative strengthening regional competitiveness
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button>View Full Impact Report</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
