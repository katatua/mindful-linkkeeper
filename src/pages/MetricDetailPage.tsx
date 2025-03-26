
import React, { useState } from 'react';
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

const MetricDetailPage: React.FC = () => {
  const { metricId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  // Historical trend data for the chart
  const historicalTrendData = [
    { month: 'Jan', value: 72 },
    { month: 'Feb', value: 75 },
    { month: 'Mar', value: 79 },
    { month: 'Apr', value: 82 },
    { month: 'May', value: 85 },
    { month: 'Jun', value: 88 },
    { month: 'Jul', value: 90 },
    { month: 'Aug', value: 92 },
  ];
  
  // Mock data for metrics
  const metricDetails = {
    id: metricId,
    title: "Project Success Rate",
    description: "Overall success rate of innovation projects based on completion of milestones and achievement of outcomes.",
    currentValue: "92%",
    previousValue: "87%",
    changePercentage: "+5.7%",
    trend: "positive",
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
  };

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
                <LineChart data={historicalTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Success Rate (%)" 
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
