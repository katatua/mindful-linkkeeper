
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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
  Line,
} from "recharts";

const FundingPage = () => {
  const { toast } = useToast();
  const [activeYear, setActiveYear] = useState<"2023" | "2022" | "all">("2023");

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "The funding report is being downloaded.",
    });
  };

  const programsData = [
    { name: "Portugal 2030", value: 35 },
    { name: "Horizonte Europa", value: 20 },
    { name: "PRR", value: 18 },
    { name: "Incentivos Fiscais (SIFIDE II)", value: 15 },
    { name: "Innovation Vouchers", value: 12 },
  ];

  const monthlyFunding2023 = [
    { month: "Jan", value: 12.5 },
    { month: "Feb", value: 14.8 },
    { month: "Mar", value: 18.2 },
    { month: "Apr", value: 16.5 },
    { month: "May", value: 19.3 },
    { month: "Jun", value: 22.7 },
    { month: "Jul", value: 25.1 },
    { month: "Aug", value: 21.4 },
    { month: "Sep", value: 24.6 },
    { month: "Oct", value: 28.3 },
    { month: "Nov", value: 30.1 },
    { month: "Dec", value: 35.8 },
  ];

  const fundingTrends = [
    { year: 2018, value: 120 },
    { year: 2019, value: 150 },
    { year: 2020, value: 180 },
    { year: 2021, value: 210 },
    { year: 2022, value: 250 },
    { year: 2023, value: 310 },
  ];

  const sectorFunding = [
    { name: "Digital Technologies", value: 32.5 },
    { name: "Clean Energy", value: 24.8 },
    { name: "Health & Biotech", value: 18.7 },
    { name: "Advanced Manufacturing", value: 15.3 },
    { name: "Sustainable Mobility", value: 8.7 },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

  const keyPrograms = [
    {
      name: "Portugal 2030",
      description: "Strategic framework for Portugal's economic, social and territorial development for the 2021-2027 period.",
      budget: "€23 billion",
      focus: "Digital transition, climate transition, competitiveness and cohesion"
    },
    {
      name: "Plano de Recuperação e Resiliência (PRR)",
      description: "Recovery and Resilience Plan that aims to implement a set of reforms and investments to restore sustained economic growth.",
      budget: "€16.6 billion",
      focus: "Digital transition, climate resilience, and economic competitiveness"
    },
    {
      name: "Horizonte Europa",
      description: "EU's key funding program for research and innovation with a focus on scientific excellence, challenges and industrial competitiveness.",
      budget: "€95.5 billion (EU-wide)",
      focus: "Research, innovation, digital technologies, climate, energy, mobility"
    },
    {
      name: "SIFIDE II",
      description: "Tax Incentive System for Business R&D that allows companies to deduct R&D expenses from taxable income.",
      budget: "Variable (tax incentives)",
      focus: "R&D activities in all business sectors"
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Funding Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Total Funding</CardTitle>
                <CardDescription>2023</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€310 Million</div>
                <p className="text-xs text-muted-foreground mt-1">+24% from previous year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Active Projects</CardTitle>
                <CardDescription>Currently Funded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground mt-1">+18% from previous year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Success Rate</CardTitle>
                <CardDescription>Project Applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32.8%</div>
                <p className="text-xs text-muted-foreground mt-1">+2.5% from previous year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Return on Investment</CardTitle>
                <CardDescription>Economic Impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.7x</div>
                <p className="text-xs text-muted-foreground mt-1">For every €1 invested</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Monthly Funding Distribution (2023)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyFunding2023} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`€${value}M`, 'Funding']} />
                      <Legend />
                      <Bar dataKey="value" name="Funding (€M)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Funding by Program</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={programsData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {programsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="programs">
          <Card>
            <CardHeader>
              <CardTitle>Major Funding Programs</CardTitle>
              <CardDescription>Key innovation funding sources in Portugal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {keyPrograms.map((program, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{program.name}</h3>
                      <p className="text-sm text-gray-600">{program.description}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {program.budget}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span>Focus: {program.focus}</span>
                  </div>
                </div>
              ))}

              <div className="p-4 bg-blue-50 rounded-lg mt-6">
                <h4 className="font-medium mb-2">How to Apply for Funding</h4>
                <p className="text-sm mb-4">
                  Companies and research institutions can apply for funding through ANI's website by
                  following these steps:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Identify the appropriate funding program for your project</li>
                  <li>Verify eligibility criteria for the specific call</li>
                  <li>Prepare a project proposal according to the guidelines</li>
                  <li>Submit application through the electronic platform</li>
                  <li>Follow the evaluation process</li>
                </ol>
                <Button variant="link" className="mt-4 p-0">
                  Visit the official ANI website for more details
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Funding Distribution by Sector</CardTitle>
                <CardDescription>2023 allocation by industry sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sectorFunding} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => [`€${value}M`, 'Funding']} />
                      <Legend />
                      <Bar dataKey="value" name="Funding (€M)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sector Funding Trends</CardTitle>
                <CardDescription>Year-over-year sector performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Digital Technologies (+28% YoY)</h3>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Highest growth area with focus on AI, cybersecurity and cloud solutions</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Clean Energy (+24% YoY)</h3>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Strong growth in renewable technologies and energy efficiency</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Health & Biotech (+18% YoY)</h3>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "52%" }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Significant investment in biotechnology and medical devices</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Advanced Manufacturing (+15% YoY)</h3>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Growth in Industry 4.0 implementations and smart factories</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Sustainable Mobility (+12% YoY)</h3>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: "38%" }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Emerging focus on electric vehicles and smart transportation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Funding Trends (2018-2023)</CardTitle>
              <div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant={activeYear === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveYear("all")}
                  >
                    All Years
                  </Button>
                  <Button
                    variant={activeYear === "2023" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveYear("2023")}
                  >
                    2023
                  </Button>
                  <Button
                    variant={activeYear === "2022" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveYear("2022")}
                  >
                    2022
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={fundingTrends}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`€${value}M`, 'Total Funding']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Funding (€M)"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Key Observations</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Consistent year-over-year funding growth averaging 20% annually</li>
                  <li>Significant acceleration in funding allocation since 2021 (post-pandemic)</li>
                  <li>Projected funding for 2024 estimated at €350-380 million</li>
                  <li>Digital transformation and sustainability projects showing highest growth rates</li>
                  <li>SMEs receiving increased proportion of funding (up from 42% to 58% since 2020)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundingPage;
