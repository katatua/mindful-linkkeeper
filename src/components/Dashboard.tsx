
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataCard } from "@/components/DataCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ViewToggle } from "@/components/ViewToggle";

export const Dashboard = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample data for demonstration
  const innovationMetrics = [
    {
      title: "Active Innovation Projects",
      value: 134,
      trend: 'up' as const,
      percentChange: 12,
      category: "Project Monitoring",
      date: "Updated today",
      chartData: [30, 40, 45, 60, 80, 95, 110, 120, 134]
    },
    {
      title: "R&D Investment",
      value: "€24.7M",
      trend: 'up' as const,
      percentChange: 8,
      category: "Financial",
      date: "Q2 2023",
      chartData: [10, 12, 15, 18, 20, 22, 24, 24.7]
    },
    {
      title: "Patent Applications",
      value: 87,
      trend: 'down' as const,
      percentChange: 3,
      category: "Intellectual Property",
      date: "Last 12 months",
      chartData: [95, 92, 90, 88, 85, 84, 86, 87]
    },
    {
      title: "Startups Incubated",
      value: 56,
      trend: 'up' as const,
      percentChange: 15,
      category: "Entrepreneurship",
      date: "2023 YTD",
      chartData: [32, 38, 42, 45, 48, 52, 56]
    },
    {
      title: "International Collaborations",
      value: 28,
      trend: 'up' as const,
      percentChange: 4,
      category: "International Relations",
      date: "This quarter",
      chartData: [22, 23, 25, 26, 27, 28]
    },
    {
      title: "AI Innovation Index",
      value: 72.3,
      trend: 'up' as const,
      percentChange: 6.5,
      category: "AI & Technology",
      date: "Q2 2023",
      chartData: [65, 66, 68, 69, 70, 72.3]
    }
  ];
  
  const filteredMetrics = innovationMetrics.filter(metric => 
    metric.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    metric.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">ANI Innovation Dashboard</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search metrics..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ViewToggle isGrid={isGridView} onToggle={() => setIsGridView(!isGridView)} />
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMetrics.map((metric, index) => (
              <DataCard
                key={index}
                title={metric.title}
                value={metric.value}
                trend={metric.trend}
                percentChange={metric.percentChange}
                category={metric.category}
                date={metric.date}
                chartData={metric.chartData}
                isGrid={isGridView}
              />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button variant="outline">Load More Metrics</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="projects">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Projects Module</h3>
            <p className="text-gray-600">
              This module will display detailed project monitoring, timeline tracking, and collaboration tools.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="financial">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Financial Analytics Module</h3>
            <p className="text-gray-600">
              This module will include budget tracking, funding allocations, and ROI measurements for innovation initiatives.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="forecasting">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Forecasting & Predictive Analytics</h3>
            <p className="text-gray-600">
              This module will provide trend analysis, predictive models, and scenario planning tools for future innovation strategies.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Reports & Documentation</h3>
            <p className="text-gray-600">
              This module will offer automated report generation, document management, and policy tracking capabilities.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
