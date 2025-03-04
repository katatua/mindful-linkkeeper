
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, ArrowUpRight, Share2, FilePdf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const handleDownloadTemplate = () => {
    toast({
      title: "Template download started",
      description: `The "${title}" template is being downloaded`,
    });
    // In a real app, this would download the template
  };

  const handleShareTemplate = () => {
    toast({
      title: "Template shared",
      description: `Share link for "${title}" template has been copied to clipboard`,
    });
    // In a real app, this would generate a shareable link
    navigator.clipboard.writeText(`https://ani-portal.example.com/templates/${title.replace(/\s+/g, '-').toLowerCase()}`).catch(() => {
      console.error("Failed to copy to clipboard");
    });
  };

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
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleDownloadTemplate}>
              <FilePdf className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShareTemplate}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
