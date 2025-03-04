
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ReportTemplates = () => {
  const templates = [
    {
      title: "Quarterly Performance Report",
      description: "Comprehensive analysis of quarterly funding allocation and project performance",
      category: "Performance",
      lastUpdated: "Jul 5, 2023",
      usageCount: 28
    },
    {
      title: "Regional Innovation Distribution",
      description: "Geographic analysis of innovation activities and funding across regions",
      category: "Regional",
      lastUpdated: "Jun 20, 2023",
      usageCount: 15
    },
    {
      title: "Sector Analysis Report",
      description: "In-depth analysis of innovation activities by industry sector",
      category: "Sector",
      lastUpdated: "Jul 2, 2023",
      usageCount: 22
    },
    {
      title: "Funding Impact Assessment",
      description: "Evaluation of economic and innovation impact of funding programs",
      category: "Impact",
      lastUpdated: "Jun 15, 2023",
      usageCount: 17
    },
    {
      title: "Program Effectiveness Review",
      description: "Assessment of program KPIs against strategic objectives",
      category: "Performance",
      lastUpdated: "Jul 10, 2023",
      usageCount: 9
    },
    {
      title: "Innovation Ecosystem Mapping",
      description: "Comprehensive map of key innovation stakeholders and relationships",
      category: "Ecosystem",
      lastUpdated: "Jun 28, 2023",
      usageCount: 11
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-medium">{template.title}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>
              <CardDescription>
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Updated: {template.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FileText className="h-3.5 w-3.5" />
                <span>Used {template.usageCount} times</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="flex justify-between items-center w-full">
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Use
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
