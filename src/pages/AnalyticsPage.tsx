import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FundingAnalytics } from "@/components/analytics/FundingAnalytics";
import { SectorAnalytics } from "@/components/analytics/SectorAnalytics";
import { PerformanceAnalytics } from "@/components/analytics/PerformanceAnalytics";
import { RegionalAnalytics } from "@/components/analytics/RegionalAnalytics";

const AnalyticsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleExport = () => {
    toast({
      title: "Export Initiated",
      description: "Your analytics report is being generated.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search analytics..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" /> Filter
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="funding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funding">Funding Analysis</TabsTrigger>
          <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Models</TabsTrigger>
        </TabsList>
        
        <TabsContent value="funding">
          <FundingAnalytics />
        </TabsContent>
        
        <TabsContent value="sectors">
          <SectorAnalytics />
        </TabsContent>
        
        <TabsContent value="performance">
          <PerformanceAnalytics />
        </TabsContent>
        
        <TabsContent value="regional">
          <RegionalAnalytics />
        </TabsContent>
        
        <TabsContent value="predictive">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Innovation Models</CardTitle>
              <CardDescription>
                AI-powered forecasting of innovation trends and outcomes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Funding Success Prediction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our AI model predicts the likelihood of funding success for proposals based on historical data patterns and key success factors.
                    </p>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Key Success Factors:</h4>
                      <ul className="list-disc list-inside text-xs space-y-1 text-gray-600">
                        <li>Strong alignment with national innovation priorities</li>
                        <li>Cross-sector collaboration components</li>
                        <li>Clear commercialization pathway</li>
                        <li>International partnership elements</li>
                        <li>Previous successful project completion</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Innovation Trends Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Forecasting emerging technology trends based on patent data, research publications, and global innovation indicators.
                    </p>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Quantum Computing</span>
                          <span className="font-medium">92% confidence</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Advanced Biotech</span>
                          <span className="font-medium">87% confidence</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "87%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Green Hydrogen</span>
                          <span className="font-medium">83% confidence</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: "83%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Innovation Impact Simulation</CardTitle>
                  <CardDescription>
                    Scenario planning for innovation investments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">Conservative Scenario</h4>
                      <ul className="text-xs space-y-2">
                        <li className="flex justify-between">
                          <span>Job Creation</span>
                          <span className="font-medium">+12,000</span>
                        </li>
                        <li className="flex justify-between">
                          <span>GDP Impact</span>
                          <span className="font-medium">+0.8%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Patent Generation</span>
                          <span className="font-medium">+320</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-3 border-blue-200 bg-blue-50">
                      <h4 className="text-sm font-medium mb-2">Moderate Scenario</h4>
                      <ul className="text-xs space-y-2">
                        <li className="flex justify-between">
                          <span>Job Creation</span>
                          <span className="font-medium">+24,000</span>
                        </li>
                        <li className="flex justify-between">
                          <span>GDP Impact</span>
                          <span className="font-medium">+1.5%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Patent Generation</span>
                          <span className="font-medium">+580</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">Ambitious Scenario</h4>
                      <ul className="text-xs space-y-2">
                        <li className="flex justify-between">
                          <span>Job Creation</span>
                          <span className="font-medium">+38,000</span>
                        </li>
                        <li className="flex justify-between">
                          <span>GDP Impact</span>
                          <span className="font-medium">+2.3%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Patent Generation</span>
                          <span className="font-medium">+780</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
