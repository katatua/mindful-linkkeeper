import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataCard } from "@/components/DataCard";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ViewToggle } from "@/components/ViewToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { FundingAnalytics } from "@/components/analytics/FundingAnalytics";
import { SectorAnalytics } from "@/components/analytics/SectorAnalytics";
import { PerformanceAnalytics } from "@/components/analytics/PerformanceAnalytics";
import { RegionalAnalytics } from "@/components/analytics/RegionalAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";

export const Dashboard = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const innovationMetrics = [
    {
      title: t('dashboard.metrics.active'),
      value: 134,
      trend: 'up' as const,
      percentChange: 12,
      category: "Project Monitoring",
      date: t('dashboard.metrics.updated'),
      chartData: [30, 40, 45, 60, 80, 95, 110, 120, 134],
      icon: "chart"
    },
    {
      title: t('dashboard.metrics.investment'),
      value: "€24.7M",
      trend: 'up' as const,
      percentChange: 8,
      category: "Financial",
      date: t('dashboard.metrics.q2'),
      chartData: [10, 12, 15, 18, 20, 22, 24, 24.7],
      icon: "activity"
    },
    {
      title: t('dashboard.metrics.patents'),
      value: 87,
      trend: 'down' as const,
      percentChange: 3,
      category: "Intellectual Property",
      date: t('dashboard.metrics.last12'),
      chartData: [95, 92, 90, 88, 85, 84, 86, 87],
      icon: "file"
    },
    {
      title: t('dashboard.metrics.startups'),
      value: 56,
      trend: 'up' as const,
      percentChange: 15,
      category: "Entrepreneurship",
      date: t('dashboard.metrics.ytd'),
      chartData: [32, 38, 42, 45, 48, 52, 56],
      icon: "chart"
    },
    {
      title: t('dashboard.metrics.collaborations'),
      value: 28,
      trend: 'up' as const,
      percentChange: 4,
      category: "International Relations",
      date: t('dashboard.metrics.quarter'),
      chartData: [22, 23, 25, 26, 27, 28],
      icon: "calendar"
    },
    {
      title: t('dashboard.metrics.ai'),
      value: 72.3,
      trend: 'up' as const,
      percentChange: 6.5,
      category: "AI & Technology",
      date: t('dashboard.metrics.q2'),
      chartData: [65, 66, 68, 69, 70, 72.3],
      icon: "activity"
    }
  ];

  const barChartData = [
    { name: 'Jan', value: 20 },
    { name: 'Feb', value: 28 },
    { name: 'Mar', value: 35 },
    { name: 'Apr', value: 42 },
    { name: 'May', value: 38 },
    { name: 'Jun', value: 45 },
    { name: 'Jul', value: 53 },
    { name: 'Aug', value: 49 },
    { name: 'Sep', value: 58 },
    { name: 'Oct', value: 63 },
    { name: 'Nov', value: 69 },
    { name: 'Dec', value: 72 },
  ];

  const lineChartData = [
    { name: 'Q1 2022', investment: 12.8, projects: 84 },
    { name: 'Q2 2022', investment: 16.2, projects: 96 },
    { name: 'Q3 2022', investment: 18.5, projects: 102 },
    { name: 'Q4 2022', investment: 21.3, projects: 118 },
    { name: 'Q1 2023', investment: 22.1, projects: 124 },
    { name: 'Q2 2023', investment: 24.7, projects: 134 },
  ];

  const pieChartData = [
    { name: 'AI & ML', value: 35 },
    { name: 'Clean Tech', value: 25 },
    { name: 'Biotechnology', value: 18 },
    { name: 'Digital Health', value: 12 },
    { name: 'Smart Cities', value: 10 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

  const areaChartData = [
    { name: '2018', value: 1200 },
    { name: '2019', value: 1900 },
    { name: '2020', value: 2300 },
    { name: '2021', value: 3100 },
    { name: '2022', value: 3800 },
    { name: '2023', value: 4700 },
  ];
  
  const filteredMetrics = innovationMetrics.filter(metric => 
    metric.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    metric.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChartClick = (chartId, chartType, category = "overview") => {
    console.log(`Navigating to: /visualization/${category}/${chartType}/${chartId}`);
    navigate(`/visualization/${category}/${chartType}/${chartId}`);
  };

  const handleMetricDetailClick = (metricId) => {
    console.log(`Navigating to metric detail: ${metricId}`);
    navigate(`/metrics/${metricId}`);
  };

  const exportToPdf = async () => {
    toast({
      title: t('dashboard.export.started'),
      description: "This may take a few seconds.",
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dashboardElement = document.getElementById('dashboard-content');
      if (!dashboardElement) {
        toast({
          title: t('dashboard.export.fail'),
          description: t('dashboard.export.fail.desc'),
          variant: "destructive",
        });
        return;
      }

      const canvas = await html2canvas(dashboardElement, {
        scale: 1.5,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      pdf.setFontSize(16);
      pdf.text(t('app.title'), 20, 15);
      
      pdf.setFontSize(10);
      pdf.text(`${t('dashboard.metrics.updated')}: ${new Date().toLocaleDateString()}`, 20, 22);
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, (pdfHeight - 30) / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, 30, imgWidth * ratio, imgHeight * ratio);
      
      pdf.save('ANI_Innovation_Dashboard.pdf');
      
      toast({
        title: t('dashboard.export.success'),
        description: t('dashboard.export.success.desc'),
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: t('dashboard.export.fail'),
        description: t('dashboard.export.fail.desc'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={t('dashboard.search')}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" /> {t('dashboard.filter')}
          </Button>
          <Button variant="outline" size="sm" onClick={exportToPdf}>
            <Download className="h-4 w-4 mr-1" /> {t('dashboard.export')}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" /> {t('dashboard.refresh')}
          </Button>
          <ViewToggle isGrid={isGridView} onToggle={() => setIsGridView(!isGridView)} />
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">{t('dashboard.tab.overview')}</TabsTrigger>
          <TabsTrigger value="funding">{t('dashboard.tab.funding')}</TabsTrigger>
          <TabsTrigger value="sectors">{t('dashboard.tab.sectors')}</TabsTrigger>
          <TabsTrigger value="performance">{t('dashboard.tab.performance')}</TabsTrigger>
          <TabsTrigger value="regional">{t('dashboard.tab.regional')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div id="dashboard-content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMetrics.map((metric, index) => {
                const metricId = metric.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
                
                return (
                  <div 
                    key={index} 
                    className="cursor-pointer" 
                    onClick={() => handleMetricDetailClick(metricId)}
                  >
                    <DataCard
                      title={metric.title}
                      value={metric.value}
                      trend={metric.trend}
                      percentChange={metric.percentChange}
                      category={metric.category}
                      date={metric.date}
                      chartData={metric.chartData}
                      isGrid={isGridView}
                      icon={metric.icon}
                    />
                  </div>
                );
              })}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
              <Card 
                className="cursor-pointer hover:shadow-md transition-all" 
                onClick={() => handleChartClick('project-growth', 'bar')}
              >
                <CardHeader>
                  <CardTitle className="text-base font-medium">{t('dashboard.charts.project')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="New Projects" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:shadow-md transition-all" 
                onClick={() => handleChartClick('innovation-investments', 'line')}
              >
                <CardHeader>
                  <CardTitle className="text-base font-medium">{t('dashboard.charts.investment')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="investment" stroke="#8884d8" name="Investment (€M)" />
                        <Line yAxisId="right" type="monotone" dataKey="projects" stroke="#82ca9d" name="Active Projects" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
              <Card 
                className="cursor-pointer hover:shadow-md transition-all" 
                onClick={() => handleChartClick('sector-distribution', 'pie')}
              >
                <CardHeader>
                  <CardTitle className="text-base font-medium">{t('dashboard.charts.sectors')}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:shadow-md transition-all" 
                onClick={() => handleChartClick('funding-growth', 'area')}
              >
                <CardHeader>
                  <CardTitle className="text-base font-medium">{t('dashboard.charts.funding')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={areaChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`€${value}K`, 'Funding']} />
                        <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
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
      </Tabs>
    </div>
  );
};
