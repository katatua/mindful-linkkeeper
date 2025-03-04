
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, FileText, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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

  const handleUseTemplate = () => {
    toast({
      title: "Template selected",
      description: `Now creating a new report using the "${title}" template`,
    });
    // In a real app, this would navigate to a report creation page with the template pre-selected
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Downloading template",
      description: `Preparing "${title}" template for download`,
    });

    const tempDiv = document.createElement('div');
    tempDiv.className = 'p-8 bg-white';
    tempDiv.style.width = '800px';
    
    tempDiv.innerHTML = `
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">${title} - Template</h1>
      <div style="margin-bottom: 16px;">
        <span style="font-weight: 500;">Category:</span> ${category}<br>
        <span style="font-weight: 500;">Last Updated:</span> ${lastUpdated}<br>
        <span style="font-weight: 500;">Usage Count:</span> ${usageCount} times
      </div>
      <div style="margin-bottom: 24px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 4px;">
        <h2 style="font-size: 18px; font-weight: 500; margin-bottom: 12px;">Template Description</h2>
        <p>${description}</p>
      </div>
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 500; margin-bottom: 12px;">Template Structure</h2>
        <ul style="list-style-type: disc; margin-left: 20px;">
          <li style="margin-bottom: 8px;"><b>Executive Summary</b> - High-level overview of key findings</li>
          <li style="margin-bottom: 8px;"><b>Data Analysis</b> - Detailed breakdown of relevant metrics</li>
          <li style="margin-bottom: 8px;"><b>Visualizations</b> - Charts and graphs illustrating key trends</li>
          <li style="margin-bottom: 8px;"><b>Recommendations</b> - Strategic recommendations based on findings</li>
          <li style="margin-bottom: 8px;"><b>Next Steps</b> - Proposed actions and implementation timeline</li>
        </ul>
      </div>
      <div style="margin-top: 32px; color: #6b7280; font-size: 12px;">
        This is an official report template from the ANI Innovation Portal.
        Generated on: ${new Date().toLocaleString()}
      </div>
    `;
    
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    html2canvas(tempDiv, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${title.replace(/\s+/g, '-')}-Template.pdf`);
      
      document.body.removeChild(tempDiv);
      
      toast({
        title: "Download complete",
        description: `Template "${title}" has been downloaded.`,
      });
    });
  };

  const handleShareTemplate = () => {
    toast({
      title: "Share template",
      description: `Share link for "${title}" template has been copied to clipboard`,
    });

    // Simulate copying to clipboard
    navigator.clipboard.writeText(`https://ani-portal.example.com/reports/templates/${title.replace(/\s+/g, '-')}`).catch(() => {
      console.error("Failed to copy to clipboard");
    });
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
          <Button variant="ghost" size="sm" onClick={handleUseTemplate}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownloadTemplate}>
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShareTemplate}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
