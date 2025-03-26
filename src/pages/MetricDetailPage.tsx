
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { downloadAsPdf } from '@/utils/shareUtils';
import { ShareEmailDialog } from '@/components/ShareEmailDialog';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { LineChartComponent } from '@/components/DataVisualization/LineChartComponent';

// Define the different metric details based on metric ID
const metricDetailsMap = {
  'project-success-rate': {
    title: "Project Success Rate",
    description: "Overall success rate of innovation projects based on completion of milestones and achievement of outcomes.",
    currentValue: "92%",
    previousValue: "87%",
    changePercentage: "+5.7%",
    trend: "positive",
    historicalTrendData: [
      { month: 'Jan', value: 72 },
      { month: 'Feb', value: 75 },
      { month: 'Mar', value: 79 },
      { month: 'Apr', value: 82 },
      { month: 'May', value: 85 },
      { month: 'Jun', value: 88 },
      { month: 'Jul', value: 90 },
      { month: 'Aug', value: 92 },
    ],
    insights: [
      "Success rate has improved consistently over the last 4 quarters",
      "Healthcare projects show the highest success rate at 94%",
      "Projects with collaborative partnerships have 12% higher success rates",
      "Milestone achievement improved by 8% after implementing the new review process"
    ],
    recommendations: [
      "Apply the healthcare projects' approach to other sectors",
      "Continue promoting collaborative partnerships across sectors",
      "Implement the new review process across all project types"
    ]
  },
  'ai-innovation-index': {
    title: "AI Innovation Index",
    description: "Composite metric tracking AI innovation progress across Portugal's research institutions and industry.",
    currentValue: "78.3",
    previousValue: "71.6",
    changePercentage: "+9.4%",
    trend: "positive",
    historicalTrendData: [
      { month: 'Jan', value: 65 },
      { month: 'Feb', value: 68 },
      { month: 'Mar', value: 70 },
      { month: 'Apr', value: 73 },
      { month: 'May', value: 75 },
      { month: 'Jun', value: 76 },
      { month: 'Jul', value: 77 },
      { month: 'Aug', value: 78 },
    ],
    insights: [
      "The AI Innovation Index has seen steady growth for 8 consecutive months",
      "Research institutions are contributing 60% of the total innovation advances",
      "Natural language processing has the highest growth rate at 14.2%",
      "Cross-sector AI implementation has increased by 22% since last year"
    ],
    recommendations: [
      "Increase investment in computer vision research where we lag behind benchmarks",
      "Create more industry-academia partnerships to accelerate knowledge transfer",
      "Focus on AI implementation in healthcare and manufacturing sectors"
    ]
  },
  'rd-investment': {
    title: "R&D Investment",
    description: "Total annual research and development investment across sectors in millions of euros.",
    currentValue: "€235M",
    previousValue: "€198M",
    changePercentage: "+18.7%",
    trend: "positive",
    historicalTrendData: [
      { month: 'Jan', value: 180 },
      { month: 'Feb', value: 189 },
      { month: 'Mar', value: 195 },
      { month: 'Apr', value: 205 },
      { month: 'May', value: 215 },
      { month: 'Jun', value: 222 },
      { month: 'Jul', value: 229 },
      { month: 'Aug', value: 235 },
    ],
    insights: [
      "Private sector R&D investment has increased by 22% year-over-year",
      "Technology sector accounts for 43% of total R&D investment",
      "SME investment in innovation has doubled in the last 2 years",
      "Public-private partnerships have mobilized €45M in additional funding"
    ],
    recommendations: [
      "Implement targeted tax incentives for research-intensive industries",
      "Create a national fund for high-risk innovation projects",
      "Develop specialized innovation hubs in rural regions"
    ]
  },
  'patent-applications': {
    title: "Patent Applications",
    description: "Number of patent applications filed by Portuguese entities annually.",
    currentValue: "412",
    previousValue: "356",
    changePercentage: "+15.7%",
    trend: "positive",
    historicalTrendData: [
      { month: 'Jan', value: 320 },
      { month: 'Feb', value: 335 },
      { month: 'Mar', value: 350 },
      { month: 'Apr', value: 365 },
      { month: 'May', value: 380 },
      { month: 'Jun', value: 390 },
      { month: 'Jul', value: 400 },
      { month: 'Aug', value: 412 },
    ],
    insights: [
      "Biotech sector leads with 31% of all patent applications",
      "University-originated patents have increased by 28%",
      "International patent applications have increased by 45%",
      "Average time to patent approval reduced by 3 months"
    ],
    recommendations: [
      "Provide specialized legal support for SMEs filing patents",
      "Create a fast-track process for sustainability-related innovations",
      "Expand the patent voucher program to more sectors"
    ]
  },
  'active-projects': {
    title: "Active Projects",
    description: "Number of ongoing innovation projects across all sectors and regions.",
    currentValue: "186",
    previousValue: "152",
    changePercentage: "+22.4%",
    trend: "positive",
    historicalTrendData: [
      { month: 'Jan', value: 130 },
      { month: 'Feb', value: 138 },
      { month: 'Mar', value: 145 },
      { month: 'Apr', value: 153 },
      { month: 'May', value: 162 },
      { month: 'Jun', value: 171 },
      { month: 'Jul', value: 178 },
      { month: 'Aug', value: 186 },
    ],
    insights: [
      "Digital transformation projects have increased by 35% since last year",
      "Lisboa region leads with 42% of all active projects",
      "Cross-sector collaborative projects show 27% higher completion rates",
      "Average project duration has decreased by 1.5 months with new methodologies"
    ],
    recommendations: [
      "Expand project management training programs for project coordinators",
      "Implement regional innovation hubs in underrepresented areas",
      "Develop standardized metrics for measuring project impact across sectors"
    ]
  },
  'startups-incubated': {
    title: "Startups Incubated",
    description: "Total number of startups supported through national incubation programs.",
    currentValue: "124",
    previousValue: "98",
    changePercentage: "+26.5%",
    trend: "positive",
    historicalTrendData: [
      { month: 'Jan', value: 85 },
      { month: 'Feb', value: 90 },
      { month: 'Mar', value: 95 },
      { month: 'Apr', value: 102 },
      { month: 'May', value: 108 },
      { month: 'Jun', value: 115 },
      { month: 'Jul', value: 119 },
      { month: 'Aug', value: 124 },
    ],
    insights: [
      "Fintech startups represent the fastest growing segment at 31%",
      "Startups with female founders increased by 18% this year",
      "Average seed funding increased by €75,000 compared to last year",
      "Incubator programs with mentorship show 40% higher success rates"
    ],
    recommendations: [
      "Create specialized incubation tracks for deep tech startups",
      "Expand international market access programs for later-stage startups",
      "Develop targeted support for underrepresented founder demographics"
    ]
  },
  'international-collaborations': {
    title: "International Collaborations",
    description: "Number of active international research and innovation partnerships.",
    currentValue: "93",
    previousValue: "71",
    changePercentage: "+31.0%",
    trend: "positive",
    historicalTrendData: [
      { month: 'Jan', value: 60 },
      { month: 'Feb', value: 65 },
      { month: 'Mar', value: 71 },
      { month: 'Apr', value: 76 },
      { month: 'May', value: 81 },
      { month: 'Jun', value: 85 },
      { month: 'Jul', value: 89 },
      { month: 'Aug', value: 93 },
    ],
    insights: [
      "EU Horizon Europe partnerships account for 45% of all collaborations",
      "Bilateral partnerships with Germany and France have doubled",
      "Sustainability-focused collaborations have increased by 65%",
      "Joint publications resulting from collaborations increased by 28%"
    ],
    recommendations: [
      "Establish dedicated liaison offices for key international regions",
      "Create a central database of potential international partners",
      "Develop specialized funding for transatlantic innovation partnerships"
    ]
  },
};

const MetricDetailPage: React.FC = () => {
  const { metricId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  // Find the metric details based on the metricId
  const metricDetails = metricDetailsMap[metricId as keyof typeof metricDetailsMap] || metricDetailsMap['project-success-rate'];
  
  const handleBack = () => {
    navigate(-1);
  };

  const handleDownload = () => {
    downloadAsPdf('metric-detail-content', `Metric-${metricId}.pdf`, toast);
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
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
      
      <div id="metric-detail-content">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{metricDetails.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">{metricDetails.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Current Value</p>
                <p className="text-3xl font-bold text-blue-600">{metricDetails.currentValue}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Previous Value</p>
                <p className="text-3xl font-bold">{metricDetails.previousValue}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Change</p>
                <p className={`text-3xl font-bold ${metricDetails.trend === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {metricDetails.changePercentage}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Key Insights</h3>
              <ul className="list-disc pl-5 space-y-2">
                {metricDetails.insights.map((insight, index) => (
                  <li key={index} className="text-gray-700">{insight}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Recommendations</h3>
              <ul className="list-disc pl-5 space-y-2">
                {metricDetails.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-gray-700">{recommendation}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Historical Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricDetails.historicalTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip formatter={(value) => {
                    if (metricId === 'rd-investment') {
                      return [`€${value}M`, 'Investment'];
                    }
                    if (metricId === 'ai-innovation-index' || metricId === 'project-success-rate') {
                      return [`${value}`, 'Score'];
                    }
                    return [value, metricDetails.title];
                  }} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name={metricDetails.title} 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ShareEmailDialog 
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        title={metricDetails.title}
        contentType="Metric"
      />
    </div>
  );
};

export default MetricDetailPage;
