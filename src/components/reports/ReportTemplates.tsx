
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Copy } from "lucide-react";

export const ReportTemplates = () => {
  // Sample data for report templates
  const templates = [
    {
      id: "TEMP-001",
      title: "Project Performance Report",
      description: "A comprehensive template for analyzing project performance, milestones, and outcomes.",
      sections: ["Executive Summary", "Key Metrics", "Timeline Analysis", "Budget Review", "Risk Assessment", "Recommendations"],
      lastUsed: "Jul 10, 2023"
    },
    {
      id: "TEMP-002",
      title: "Quarterly Innovation Review",
      description: "Standard quarterly report template for innovation metrics across all sectors.",
      sections: ["Quarter Highlights", "Project Updates", "Funding Allocation", "Success Stories", "Challenges", "Next Quarter Outlook"],
      lastUsed: "Jun 30, 2023"
    },
    {
      id: "TEMP-003",
      title: "Funding Allocation Report",
      description: "Financial reporting template for tracking and analyzing innovation funding distribution.",
      sections: ["Summary", "Funding Sources", "Allocation by Sector", "ROI Analysis", "Budget Adherence", "Future Funding"],
      lastUsed: "Jul 5, 2023"
    },
    {
      id: "TEMP-004",
      title: "Sector Analysis Report",
      description: "Detailed template for analyzing innovation trends and performance within specific sectors.",
      sections: ["Sector Overview", "Key Projects", "Performance Metrics", "Competitive Analysis", "Opportunities", "Recommendations"],
      lastUsed: "Jul 2, 2023"
    },
    {
      id: "TEMP-005",
      title: "Executive Dashboard Report",
      description: "Concise, visual template designed for executive-level reporting and decision making.",
      sections: ["KPI Summary", "Strategic Highlights", "Risk Overview", "Key Decisions", "Strategic Recommendations"],
      lastUsed: "Jun 28, 2023"
    },
    {
      id: "TEMP-006",
      title: "Patent Activity Report",
      description: "Template for tracking and analyzing patent applications, approvals, and intellectual property.",
      sections: ["Patent Summary", "New Applications", "Granted Patents", "Technology Areas", "Competitive Landscape", "IP Strategy"],
      lastUsed: "Jun 15, 2023"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Available Templates</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" /> Create Template
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">{template.title}</CardTitle>
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <CardDescription className="text-sm">{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="font-medium">Sections:</div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {template.sections.slice(0, 4).map((section, index) => (
                    <li key={index}>{section}</li>
                  ))}
                  {template.sections.length > 4 && (
                    <li>+{template.sections.length - 4} more</li>
                  )}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <span className="text-xs text-gray-500">Last used: {template.lastUsed}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" /> Use
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
