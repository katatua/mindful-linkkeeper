
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ReportTemplateProps {
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
  usageCount: number;
}

export const ReportTemplateCard = ({ 
  title, 
  description, 
  category, 
  lastUpdated, 
  usageCount 
}: ReportTemplateProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        </div>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>Updated: {lastUpdated}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <FileText className="h-3.5 w-3.5" />
          <span>Used {usageCount} times</span>
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
  );
};
