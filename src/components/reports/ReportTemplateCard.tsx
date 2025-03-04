
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, FileText, Share2, PlusSquare, BarChart4, FileCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

export interface ReportTemplateProps {
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
  usageCount: number;
}

export const ReportTemplateCard: React.FC<ReportTemplateProps> = ({
  title,
  description,
  category,
  lastUpdated,
  usageCount
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isConfigureDialogOpen, setIsConfigureDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [configSettings, setConfigSettings] = useState({
    includeCharts: true,
    includeAiAnalysis: true,
    includeSummary: true,
    includeRecommendations: true
  });

  const handleUseTemplate = () => {
    setIsConfigureDialogOpen(true);
  };

  const handleSaveConfiguration = () => {
    toast({
      title: "Template configured",
      description: `Configuration saved for "${title}" template`,
    });
    setIsConfigureDialogOpen(false);
  };

  const handleViewTemplate = () => {
    setIsViewDialogOpen(true);
  };

  const handleShareTemplate = () => {
    setIsShareDialogOpen(true);
  };

  const handleShareSubmit = () => {
    if (!shareEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Template shared",
      description: `"${title}" template has been shared with ${shareEmail}`,
    });
    setIsShareDialogOpen(false);
    setShareEmail('');
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Downloading template",
      description: `Preparing "${title}" template for download`,
    });

    // Use a pre-generated PDF instead of generating on the fly
    setTimeout(() => {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add sample content (simulating a pre-generated template)
      pdf.setFontSize(24);
      pdf.text(title, 20, 30);
      
      pdf.setFontSize(12);
      pdf.text(`Category: ${category}`, 20, 50);
      pdf.text(`Last Updated: ${lastUpdated}`, 20, 60);
      pdf.text(`Usage Count: ${usageCount} times`, 20, 70);
      
      pdf.setFontSize(16);
      pdf.text("Template Description", 20, 90);
      
      pdf.setFontSize(12);
      pdf.text(description, 20, 100);
      
      pdf.setFontSize(16);
      pdf.text("Template Structure", 20, 130);
      
      pdf.setFontSize(12);
      pdf.text("• Executive Summary - High-level overview of key findings", 20, 140);
      pdf.text("• Data Analysis - Detailed breakdown of relevant metrics", 20, 150);
      pdf.text("• Visualizations - Charts and graphs illustrating key trends", 20, 160);
      pdf.text("• Recommendations - Strategic recommendations based on findings", 20, 170);
      pdf.text("• Next Steps - Proposed actions and implementation timeline", 20, 180);
      
      pdf.setFontSize(10);
      pdf.text(`This is an official report template from the ANI Innovation Portal.`, 20, 260);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 270);
      
      pdf.save(`${title.replace(/\s+/g, '-')}-Template.pdf`);
      
      toast({
        title: "Download complete",
        description: `Template "${title}" has been downloaded.`,
      });
    }, 500); // Short delay to simulate pre-generated PDF
  };

  return (
    <Card className="hover:shadow-md transition-all h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <Badge variant="outline">{category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between items-center">
        <div className="flex flex-col text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Updated: {lastUpdated}</span>
          </div>
          <div className="mt-1">
            <span>Used {usageCount} times</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleViewTemplate}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownloadTemplate}>
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShareTemplate}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleUseTemplate}>
            <PlusSquare className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>

      {/* View Template Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Category: {category} | Last Updated: {lastUpdated}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Template Structure</h3>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>Executive Summary - High-level overview of key findings</li>
                <li>Data Analysis - Detailed breakdown of relevant metrics</li>
                <li>Visualizations - Charts and graphs illustrating key trends</li>
                <li>Recommendations - Strategic recommendations based on findings</li>
                <li>Next Steps - Proposed actions and implementation timeline</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Usage Statistics</h3>
              <p className="text-sm text-gray-600">This template has been used {usageCount} times.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={handleDownloadTemplate}>
              <FileText className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Template Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Template</DialogTitle>
            <DialogDescription>
              Share this template with team members via email.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="email" className="text-sm font-medium mb-2 block">
              Email Address
            </label>
            <Input
              id="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="colleague@example.com"
              type="email"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleShareSubmit}>Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configure Template Dialog */}
      <Dialog open={isConfigureDialogOpen} onOpenChange={setIsConfigureDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Configure Report Template</DialogTitle>
            <DialogDescription>
              Customize the "{title}" template to fit your needs.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Select Report Components</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="charts"
                  checked={configSettings.includeCharts}
                  onCheckedChange={(checked) => 
                    setConfigSettings({...configSettings, includeCharts: checked as boolean})
                  }
                />
                <label
                  htmlFor="charts"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include Visualizations
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ai-analysis"
                  checked={configSettings.includeAiAnalysis}
                  onCheckedChange={(checked) => 
                    setConfigSettings({...configSettings, includeAiAnalysis: checked as boolean})
                  }
                />
                <label
                  htmlFor="ai-analysis"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include AI Analysis
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="summary"
                  checked={configSettings.includeSummary}
                  onCheckedChange={(checked) => 
                    setConfigSettings({...configSettings, includeSummary: checked as boolean})
                  }
                />
                <label
                  htmlFor="summary"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include Executive Summary
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recommendations"
                  checked={configSettings.includeRecommendations}
                  onCheckedChange={(checked) => 
                    setConfigSettings({...configSettings, includeRecommendations: checked as boolean})
                  }
                />
                <label
                  htmlFor="recommendations"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include Recommendations
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Select Visualizations</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="justify-start text-left h-auto py-2"
                  onClick={() => navigate('/visualization/performance/line/performance-trends')}
                >
                  <BarChart4 className="h-4 w-4 mr-2" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">Performance Trends</span>
                    <span className="text-xs text-gray-500">Line chart</span>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start text-left h-auto py-2"
                  onClick={() => navigate('/visualization/performance/bar/kpi-performance')}
                >
                  <BarChart4 className="h-4 w-4 mr-2" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">KPI Performance</span>
                    <span className="text-xs text-gray-500">Bar chart</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigureDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveConfiguration}>
              <FileCheck className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
