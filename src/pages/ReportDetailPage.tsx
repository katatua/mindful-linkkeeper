import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Download, Share2, Calendar, FileText, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { jsPDF } from 'jspdf';
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
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

interface ReportData {
  id: string;
  title: string;
  type: string;
  date: string;
  author: string;
  status: string;
  content: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

const ReportDetailPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const performanceData = [
    { year: 2018, success: 76, patents: 32, publications: 48 },
    { year: 2019, success: 78, patents: 38, publications: 52 },
    { year: 2020, success: 82, patents: 42, publications: 58 },
    { year: 2021, success: 85, patents: 48, publications: 64 },
    { year: 2022, success: 88, patents: 56, publications: 72 },
    { year: 2023, success: 92, patents: 62, publications: 78 },
  ];
  
  const fundingData = [
    { name: 'EU Horizon Europe', value: 42 },
    { name: 'National Funds', value: 28 },
    { name: 'Private Investment', value: 18 },
    { name: 'Regional Programs', value: 12 },
  ];
  
  const regionalData = [
    { region: 'North', projects: 42, funding: 8.2 },
    { region: 'Central', projects: 58, funding: 12.5 },
    { region: 'South', projects: 38, funding: 5.4 },
    { region: 'Islands', projects: 18, funding: 2.4 },
  ];
  
  const sectorData = [
    { name: 'Healthcare', value: 32 },
    { name: 'Digital Tech', value: 28 },
    { name: 'Energy', value: 18 },
    { name: 'Manufacturing', value: 14 },
    { name: 'Agriculture', value: 8 },
  ];
  
  useEffect(() => {
    const fetchReportDetails = () => {
      setLoading(true);
      
      // In a real app, we would fetch from an API
      // For now, we'll simulate loading from sample data
      setTimeout(() => {
        try {
          // Sample reports data (this should be fetched from a shared source)
          const reports = [
            {
              id: "REP-2023-001",
              title: "Q2 2023 Innovation Performance",
              type: "Quarterly Report",
              date: "Jun 30, 2023",
              author: "Maria Silva",
              status: "Final",
              content: "This report provides a comprehensive analysis of innovation performance across all funded projects during Q2 2023. Key highlights include a 12% increase in active projects, €24.7M in total R&D investment, and 87 new patent applications."
            },
            {
              id: "REP-2023-002",
              title: "Healthcare Innovation Projects Analysis",
              type: "Sector Report",
              date: "Jul 15, 2023",
              author: "João Santos",
              status: "Final",
              content: "An in-depth analysis of healthcare innovation projects, including medical devices, digital health solutions, and pharmaceutical research. The sector shows a 15% growth in funding allocation and represents 24% of the total innovation portfolio."
            },
            {
              id: "REP-2023-003",
              title: "Funding Allocation Analysis",
              type: "Financial Report",
              date: "Jul 10, 2023",
              author: "Ana Costa",
              status: "Final",
              content: "Detailed breakdown of funding allocation across regions, sectors, and project types. EU Horizon Europe represents 42% of total funding, followed by National Funds at 28%, Private Investment at 18%, and Regional Programs at 12%."
            },
            {
              id: "REP-2023-004",
              title: "Sustainable Energy Projects Overview",
              type: "Sector Report",
              date: "Jul 5, 2023",
              author: "Pedro Fernandes",
              status: "Draft",
              content: "Overview of sustainable energy innovation projects, including renewable energy technologies, energy storage solutions, and smart grid applications. The sector accounts for 18% of total funding and shows a 22% year-over-year growth."
            },
            {
              id: "REP-2023-005",
              title: "Regional Innovation Distribution",
              type: "Analytical Report",
              date: "Jun 28, 2023",
              author: "Sofia Martins",
              status: "Final",
              content: "Analysis of innovation project distribution across regions. The Central region leads with 58 projects, followed by the North with 42 projects, the South with 38 projects, and the Islands with 18 projects."
            },
            {
              id: "REP-2023-006",
              title: "Patent Applications Summary",
              type: "IP Report",
              date: "Jun 25, 2023",
              author: "Miguel Oliveira",
              status: "Review",
              content: "Summary of patent applications filed by funded projects. Healthcare sector leads with 32 patent applications, followed by Digital Technology with 28, Energy with 18, and Manufacturing with 9."
            },
          ];
          
          const foundReport = reports.find(r => r.id === reportId);
          
          if (foundReport) {
            setReport(foundReport);
          }
        } catch (error) {
          console.error('Error fetching report details:', error);
        } finally {
          setLoading(false);
        }
      }, 800); // Simulate loading delay
    };
    
    fetchReportDetails();
  }, [reportId]);

  const handleGoBack = () => {
    navigate('/reports');
  };

  const handleDownload = () => {
    if (!report) return;
    
    toast({
      title: "Downloading report",
      description: `Preparing ${report.title} for download`,
    });
    
    // Use pre-generated PDF instead of generating on the fly
    setTimeout(() => {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add sample content
      pdf.setFontSize(22);
      pdf.text(report.title, 20, 30);
      
      pdf.setFontSize(12);
      pdf.text(`Report ID: ${report.id}`, 20, 45);
      pdf.text(`Type: ${report.type}`, 20, 55);
      pdf.text(`Author: ${report.author}`, 20, 65);
      pdf.text(`Date: ${report.date}`, 20, 75);
      pdf.text(`Status: ${report.status}`, 20, 85);
      
      pdf.setFontSize(16);
      pdf.text("Executive Summary", 20, 105);
      
      pdf.setFontSize(12);
      const contentLines = pdf.splitTextToSize(report.content, 170);
      pdf.text(contentLines, 20, 115);
      
      pdf.setFontSize(16);
      pdf.text("Key Visualizations", 20, 155);
      
      pdf.setFontSize(12);
      pdf.text("[Performance charts and data visualizations would appear here]", 20, 165);
      
      pdf.save(`${report.id}-${report.title.replace(/\s+/g, '-')}.pdf`);
      
      toast({
        title: "Download complete",
        description: `Report "${report.title}" has been downloaded.`,
      });
    }, 500);
  };

  const handleShare = () => {
    toast({
      title: "Share link copied",
      description: "Link to this report has been copied to clipboard"
    });
    navigator.clipboard.writeText(window.location.href);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" className="mb-6" onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Button>
        
        <div className="space-y-6">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" className="mb-6" onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Button>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-1">Report Not Found</h2>
            <p className="text-gray-500 mb-4">The report you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleGoBack}>Return to Reports</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{report.title}</h1>
        <div className="flex items-center gap-3 mt-2">
          <Badge variant={
            report.status === 'Final' ? 'default' : 
            report.status === 'Draft' ? 'outline' : 
            'secondary'
          }>
            {report.status}
          </Badge>
          <span className="text-sm text-gray-500">{report.type}</span>
        </div>
        <div className="flex items-center gap-3 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{report.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{report.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>ID: {report.id}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
              <CardDescription>Key findings and highlights from the report</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{report.content}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="visualizations">
          <Card>
            <CardHeader>
              <CardTitle>Data Visualizations</CardTitle>
              <CardDescription>Visual representation of key metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-gray-700 font-medium mb-4">Performance Trend Chart</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="success" stroke="#8884d8" name="Success Rate %" />
                        <Line type="monotone" dataKey="patents" stroke="#82ca9d" name="Patents" />
                        <Line type="monotone" dataKey="publications" stroke="#ffc658" name="Publications" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-gray-700 font-medium mb-4">Funding Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={fundingData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {fundingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-gray-700 font-medium mb-4">Regional Comparison</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={regionalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="projects" fill="#8884d8" name="Projects" />
                        <Bar dataKey="funding" fill="#82ca9d" name="Funding (€M)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-gray-700 font-medium mb-4">Sector Analysis</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        layout="vertical" 
                        data={sectorData} 
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" name="Patent Applications" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>Comprehensive breakdown of the report findings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Methodology</h3>
                  <p className="text-gray-700">This report utilizes data collected from multiple sources including project databases, funding allocation records, and performance metrics tracking systems. The analysis follows established methodologies for innovation performance assessment.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Findings</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Innovation funding has increased by 14% compared to the previous reporting period</li>
                    <li>Project completion rates improved by 8% across all sectors</li>
                    <li>The healthcare sector showed the strongest performance indicators</li>
                    <li>Regional distribution of innovation projects has become more balanced</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Comparative Analysis</h3>
                  <p className="text-gray-700">When compared to previous periods, this reporting cycle demonstrates significant improvements in key metrics. The data indicates positive trends across most innovation indicators.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Suggested actions based on report findings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-700 mb-2">Strategic Recommendations</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Increase funding allocation to high-performing sectors</li>
                    <li>Expand regional innovation hubs to underserved areas</li>
                    <li>Develop more targeted support programs for early-stage projects</li>
                    <li>Enhance cross-sector collaboration mechanisms</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="text-lg font-medium text-green-700 mb-2">Implementation Suggestions</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Create working groups focused on addressing key challenges</li>
                    <li>Develop new metrics for tracking innovation impact</li>
                    <li>Establish quarterly review processes for all innovation programs</li>
                    <li>Launch a communication campaign to highlight success stories</li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <h3 className="text-lg font-medium text-amber-700 mb-2">Areas for Improvement</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Address delays in funding disbursement processes</li>
                    <li>Improve data collection methodologies for outcome measurement</li>
                    <li>Enhance support mechanisms for underperforming projects</li>
                    <li>Streamline reporting requirements to reduce administrative burden</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <p className="text-sm text-gray-500">These recommendations have been developed based on the analysis of current data and trends. Implementation should be adapted to specific contexts and priorities.</p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDetailPage;
