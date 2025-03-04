import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Calendar, FileText, Share2, Clock, Filter, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ReportsList } from "@/components/reports/ReportsList";
import { ReportTemplates } from "@/components/reports/ReportTemplates";
import { ScheduledReports } from "@/components/reports/ScheduledReports";
import { useNavigate } from "react-router-dom";

const ReportsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [customReport, setCustomReport] = useState({
    title: "Q4 2023 Innovation Analytics",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    format: "pdf",
    generationType: "one-time",
    generateDate: "2023-12-31",
    distribution: "team@ani.pt",
    dataSources: {
      fundingData: true,
      projectMetrics: true,
      regionalData: true,
      sectorAnalysis: false,
      performanceKPIs: false
    }
  });
  
  const recentReports = [
    {
      title: "Q3 2023 Innovation Performance",
      description: "Quarterly performance report on ANI's innovation programs",
      date: "Oct 15, 2023",
      status: "completed",
      author: "Maria Silva"
    },
    {
      title: "SME Startup Ecosystem Analysis",
      description: "Analysis of the Portuguese startup ecosystem funding and performance",
      date: "Sep 28, 2023",
      status: "completed",
      author: "Carlos Mendes"
    },
    {
      title: "R&D Tax Incentives Impact Study",
      description: "Assessment of SIFIDE II program impact on corporate R&D investments",
      date: "Sep 12, 2023",
      status: "completed",
      author: "Ana Costa"
    },
    {
      title: "International Innovation Benchmarking",
      description: "Comparison of Portuguese innovation metrics against EU countries",
      date: "Aug 30, 2023",
      status: "completed",
      author: "João Almeida"
    }
  ];

  const handleGenerateReport = () => {
    toast({
      title: "Report generation initiated",
      description: "Your custom report is being prepared. It will be available in a few minutes.",
      duration: 5000
    });
  };

  const handleSaveTemplate = () => {
    toast({
      title: "Template saved",
      description: `The template "${customReport.title}" has been saved successfully.`,
      duration: 5000
    });
    
    // Navigate to templates tab after saving
    setTimeout(() => {
      document.querySelector('[data-state="inactive"][data-value="templates"]')?.click();
    }, 500);
  };

  const handleDataSourceChange = (source: keyof typeof customReport.dataSources) => {
    setCustomReport(prev => ({
      ...prev,
      dataSources: {
        ...prev.dataSources,
        [source]: !prev.dataSources[source]
      }
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomReport(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const setReportFormat = (format: string) => {
    setCustomReport(prev => ({
      ...prev,
      format
    }));
  };

  const setGenerationType = (type: string) => {
    setCustomReport(prev => ({
      ...prev,
      generationType: type
    }));
  };

  const handleChartClick = () => {
    const chartElement = document.querySelector('.chart-element');
    if (chartElement instanceof HTMLElement) {
      chartElement.click();
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Reports & Documentation</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search reports..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" /> Filter
          </Button>
          <Button variant="default" size="sm">
            <FileText className="h-4 w-4 mr-1" /> Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentReports.map((report, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium">{report.title}</CardTitle>
                    {report.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  <CardDescription>
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{report.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FileText className="h-3.5 w-3.5" />
                    <span>By {report.author}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-between items-center w-full">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <ReportsList searchQuery={searchQuery} />
        </TabsContent>
        
        <TabsContent value="templates">
          <ReportTemplates />
        </TabsContent>
        
        <TabsContent value="scheduled">
          <ScheduledReports />
        </TabsContent>
        
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Generator</CardTitle>
              <CardDescription>
                Create tailored reports by selecting the data sources, metrics, and visualization options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">1. Select Data Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="funding-data" 
                          className="checkbox" 
                          checked={customReport.dataSources.fundingData}
                          onChange={() => handleDataSourceChange('fundingData')}
                        />
                        <label htmlFor="funding-data" className="text-sm">Funding Data</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="project-metrics" 
                          className="checkbox" 
                          checked={customReport.dataSources.projectMetrics}
                          onChange={() => handleDataSourceChange('projectMetrics')}
                        />
                        <label htmlFor="project-metrics" className="text-sm">Project Metrics</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="regional-data" 
                          className="checkbox" 
                          checked={customReport.dataSources.regionalData}
                          onChange={() => handleDataSourceChange('regionalData')}
                        />
                        <label htmlFor="regional-data" className="text-sm">Regional Data</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="sector-analysis" 
                          className="checkbox"
                          checked={customReport.dataSources.sectorAnalysis}
                          onChange={() => handleDataSourceChange('sectorAnalysis')}
                        />
                        <label htmlFor="sector-analysis" className="text-sm">Sector Analysis</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="performance-kpis" 
                          className="checkbox"
                          checked={customReport.dataSources.performanceKPIs}
                          onChange={() => handleDataSourceChange('performanceKPIs')}
                        />
                        <label htmlFor="performance-kpis" className="text-sm">Performance KPIs</label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">2. Report Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label htmlFor="report-title" className="text-sm font-medium">Report Title</label>
                        <Input
                          id="report-title"
                          placeholder="Enter report title"
                          value={customReport.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="date-range" className="text-sm font-medium">Date Range</label>
                        <div className="flex gap-2">
                          <Input
                            id="date-range-start"
                            type="date"
                            value={customReport.startDate}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                          />
                          <Input
                            id="date-range-end"
                            type="date"
                            value={customReport.endDate}
                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Report Format</label>
                        <div className="flex gap-2">
                          <Button 
                            variant={customReport.format === 'pdf' ? "default" : "outline"} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setReportFormat('pdf')}
                          >
                            <FileText className="h-4 w-4 mr-1" /> PDF
                          </Button>
                          <Button 
                            variant={customReport.format === 'excel' ? "default" : "outline"} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setReportFormat('excel')}
                          >
                            Excel
                          </Button>
                          <Button 
                            variant={customReport.format === 'web' ? "default" : "outline"} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setReportFormat('web')}
                          >
                            Web
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">3. Schedule Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Generation Type</label>
                        <div className="flex gap-2">
                          <Button 
                            variant={customReport.generationType === 'one-time' ? "default" : "outline"} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setGenerationType('one-time')}
                          >
                            <Calendar className="h-4 w-4 mr-1" /> One-time
                          </Button>
                          <Button 
                            variant={customReport.generationType === 'recurring' ? "default" : "outline"} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setGenerationType('recurring')}
                          >
                            <Clock className="h-4 w-4 mr-1" /> Recurring
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="generate-date" className="text-sm font-medium">Generation Date</label>
                        <Input
                          id="generate-date"
                          type="date"
                          value={customReport.generateDate}
                          onChange={(e) => handleInputChange('generateDate', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Distribution</label>
                        <Input
                          placeholder="Enter email recipients"
                          value={customReport.distribution}
                          onChange={(e) => handleInputChange('distribution', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end">
                <Button className="mr-2" variant="outline" onClick={handleSaveTemplate}>
                  Save Template
                </Button>
                <Button onClick={handleGenerateReport}>
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
