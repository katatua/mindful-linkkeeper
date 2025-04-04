
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MetricDetailPage: React.FC = () => {
  const { metricId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    toast({
      title: "Download started",
      description: "Metric details are being downloaded as PDF"
    });
    // In a real application, this would generate and download a PDF
  };

  const handleShare = () => {
    toast({
      title: "Share link copied",
      description: "Link to this metric has been copied to clipboard"
    });
    // Simulate copying to clipboard
    navigator.clipboard.writeText(window.location.href);
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
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
            <p className="text-gray-500">Historical trend chart would appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricDetailPage;
