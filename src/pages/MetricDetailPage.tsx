
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MetricDetailPage = () => {
  const { metricId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [metricData, setMetricData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Mock data for different metrics
  const metricDetails = {
    'active-projects': {
      title: "Active Projects",
      value: 134,
      trend: 'up',
      percentChange: 12,
      category: "Project Monitoring",
      description: "Total number of active innovation projects currently funded and in progress. This includes projects across all sectors and regions.",
      chartData: [
        { month: 'Jan', value: 95 },
        { month: 'Feb', value: 98 },
        { month: 'Mar', value: 102 },
        { month: 'Apr', value: 110 },
        { month: 'May', value: 115 },
        { month: 'Jun', value: 120 },
        { month: 'Jul', value: 125 },
        { month: 'Aug', value: 128 },
        { month: 'Sep', value: 130 },
        { month: 'Oct', value: 134 },
      ],
      insights: [
        "12% year-over-year growth in active projects",
        "Digital sector shows the strongest growth with 28 new projects",
        "Average project duration is 18 months",
        "75% of projects involve at least one research institution"
      ],
      recommendations: [
        "Increase support for healthcare innovation projects",
        "Consider additional funding for cross-sector collaborations",
        "Implement quarterly review process for at-risk projects",
        "Develop mentorship program for early-stage projects"
      ]
    },
    'r&d-investment': {
      title: "R&D Investment",
      value: "€24.7M",
      trend: 'up',
      percentChange: 8,
      category: "Financial",
      description: "Total investment in research and development across all innovation programs and projects for the current fiscal period.",
      chartData: [
        { quarter: 'Q1 2022', value: 18.2 },
        { quarter: 'Q2 2022', value: 19.4 },
        { quarter: 'Q3 2022', value: 20.8 },
        { quarter: 'Q4 2022', value: 22.1 },
        { quarter: 'Q1 2023', value: 23.5 },
        { quarter: 'Q2 2023', value: 24.7 },
      ],
      insights: [
        "8% increase in R&D funding compared to previous quarter",
        "EU Horizon Europe program represents 42% of total funding",
        "Private sector co-investment has increased by 15%",
        "Average grant size is €320,000"
      ],
      recommendations: [
        "Diversify funding sources to reduce dependency on EU programs",
        "Develop targeted funding for early TRL innovations",
        "Implement ROI tracking for large-scale investments",
        "Create fast-track funding for high-potential projects"
      ]
    },
    'patent-applications': {
      title: "Patent Applications",
      value: 87,
      trend: 'down',
      percentChange: 3,
      category: "Intellectual Property",
      description: "Total number of patent applications filed by funded projects and research partners over the last 12 months.",
      chartData: [
        { month: 'Nov', value: 95 },
        { month: 'Dec', value: 93 },
        { month: 'Jan', value: 91 },
        { month: 'Feb', value: 90 },
        { month: 'Mar', value: 88 },
        { month: 'Apr', value: 87 },
        { month: 'May', value: 85 },
        { month: 'Jun', value: 84 },
        { month: 'Jul', value: 86 },
        { month: 'Aug', value: 87 },
      ],
      insights: [
        "3% decrease in patent applications year-over-year",
        "Healthcare sector leads with 32 patent applications",
        "68% of patents include international co-inventors",
        "Average time from research to patent filing is 9 months"
      ],
      recommendations: [
        "Provide enhanced IP support services to researchers",
        "Consider patent filing cost subsidies for promising innovations",
        "Develop IP strategy workshops for project teams",
        "Create collaborative patent pools for related technologies"
      ]
    },
    'startups-incubated': {
      title: "Startups Incubated",
      value: 56,
      trend: 'up',
      percentChange: 15,
      category: "Entrepreneurship",
      description: "Total number of startup companies that have been incubated or received direct support through innovation programs this year.",
      chartData: [
        { month: 'Jan', value: 38 },
        { month: 'Feb', value: 40 },
        { month: 'Mar', value: 42 },
        { month: 'Apr', value: 45 },
        { month: 'May', value: 48 },
        { month: 'Jun', value: 50 },
        { month: 'Jul', value: 52 },
        { month: 'Aug', value: 54 },
        { month: 'Sep', value: 56 },
      ],
      insights: [
        "15% increase in startups compared to previous year",
        "Digital health startups represent 28% of the total",
        "Average seed funding secured is €420,000",
        "72% survival rate after two years of operation"
      ],
      recommendations: [
        "Expand incubation services for deep tech startups",
        "Develop specialized mentorship for female founders",
        "Create investor matchmaking events for later-stage startups",
        "Implement cross-border startup exchange program"
      ]
    },
    'international-collaborations': {
      title: "International Collaborations",
      value: 28,
      trend: 'up',
      percentChange: 4,
      category: "International Relations",
      description: "Number of active international research and innovation partnerships and collaborative projects in the current quarter.",
      chartData: [
        { month: 'May', value: 22 },
        { month: 'Jun', value: 23 },
        { month: 'Jul', value: 24 },
        { month: 'Aug', value: 25 },
        { month: 'Sep', value: 26 },
        { month: 'Oct', value: 28 },
      ],
      insights: [
        "4% growth in international partnerships this quarter",
        "Germany and France are top collaboration partners",
        "75% of collaborations involve academic institutions",
        "Average collaboration duration is 24 months"
      ],
      recommendations: [
        "Develop strategic partnerships with Asian innovation hubs",
        "Create international exchange program for researchers",
        "Implement digital collaboration platforms for remote teams",
        "Establish joint funding mechanisms with key partner countries"
      ]
    },
    'ai-innovation-index': {
      title: "AI Innovation Index",
      value: 72.3,
      trend: 'up',
      percentChange: 6.5,
      category: "AI & Technology",
      description: "Composite score measuring the strength and growth of AI innovation activities across all programs and sectors.",
      chartData: [
        { month: 'May', value: 65 },
        { month: 'Jun', value: 66 },
        { month: 'Jul', value: 68 },
        { month: 'Aug', value: 69 },
        { month: 'Sep', value: 70 },
        { month: 'Oct', value: 72.3 },
      ],
      insights: [
        "6.5% improvement in AI innovation performance",
        "Natural language processing leads with 28% of AI projects",
        "52% of AI projects involve cross-sector applications",
        "Public sector adoption of AI solutions growing at 12%"
      ],
      recommendations: [
        "Develop specialized AI ethics framework for projects",
        "Create AI talent development program for critical skills",
        "Establish regulatory sandboxes for AI experimentation",
        "Implement AI readiness assessments for traditional sectors"
      ]
    }
  };

  useEffect(() => {
    // Simulating data fetching
    setLoading(true);
    setTimeout(() => {
      if (metricId && metricId in metricDetails) {
        setMetricData(metricDetails[metricId]);
      } else {
        // Handle unknown metric ID
        toast({
          title: "Metric not found",
          description: "The requested metric information could not be found.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 500);
  }, [metricId, toast]);

  const exportToPdf = async () => {
    if (!metricData) return;
    
    toast({
      title: "Preparing PDF export...",
      description: "This may take a few seconds.",
    });

    try {
      const metricElement = document.getElementById('metric-detail-content');
      if (!metricElement) {
        toast({
          title: "Export failed",
          description: "Could not find content to export.",
          variant: "destructive",
        });
        return;
      }

      const canvas = await html2canvas(metricElement, {
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
      pdf.text(`ANI Metric Detail: ${metricData.title}`, 20, 15);
      
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 22);
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, (pdfHeight - 30) / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, 30, imgWidth * ratio, imgHeight * ratio);
      
      pdf.save(`ANI_Metric_${metricId}.pdf`);
      
      toast({
        title: "Export successful",
        description: "Your metric report has been exported as a PDF.",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!metricData) {
    return (
      <div className="container mx-auto py-12">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Metric Not Found</h2>
              <p className="text-gray-500 mb-4">The requested metric information could not be found.</p>
              <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold">{metricData.title}</h1>
        </div>
        <Button variant="outline" size="sm" onClick={exportToPdf}>
          <Download className="h-4 w-4 mr-2" /> Export PDF
        </Button>
      </div>

      <div id="metric-detail-content" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{metricData.title}</CardTitle>
              <div className="flex items-center">
                <span className={`text-lg font-bold ${metricData.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {metricData.value}
                </span>
                <span className={`ml-2 text-sm ${metricData.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {metricData.trend === 'up' ? '↑' : '↓'} {metricData.percentChange}%
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">{metricData.description}</p>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricData.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={Object.keys(metricData.chartData[0])[0]} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                    name={metricData.title}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                {metricData.insights.map((insight, index) => (
                  <li key={index} className="text-gray-700">{insight}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                {metricData.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-700">{rec}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div>
                <h3 className="font-medium mb-1">Category:</h3>
                <p className="text-gray-700">{metricData.category}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Impact Assessment:</h3>
                <p className="text-gray-700">
                  This metric shows {metricData.trend === 'up' ? 'positive' : 'negative'} trends with {metricData.percentChange}% 
                  {metricData.trend === 'up' ? ' growth' : ' decrease'} over the measured period. 
                  {metricData.trend === 'up' 
                    ? ' Continued investment and support is recommended to maintain this positive trajectory.'
                    : ' Strategic intervention may be required to reverse this negative trend.'}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Related Metrics:</h3>
                <div className="flex flex-wrap gap-2">
                  {['Active Projects', 'R&D Investment', 'Patent Applications'].filter(m => m !== metricData.title).map((metric, i) => (
                    <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetricDetailPage;
