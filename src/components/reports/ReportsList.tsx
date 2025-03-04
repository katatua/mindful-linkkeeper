
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Eye, Share2 } from "lucide-react";

interface ReportsListProps {
  searchQuery: string;
}

export const ReportsList = ({ searchQuery }: ReportsListProps) => {
  // Sample data for reports
  const reports = [
    {
      id: "REP-2023-001",
      title: "Q2 2023 Innovation Performance",
      type: "Quarterly Report",
      date: "Jun 30, 2023",
      author: "Maria Silva",
      status: "Final",
    },
    {
      id: "REP-2023-002",
      title: "Healthcare Innovation Projects Analysis",
      type: "Sector Report",
      date: "Jul 15, 2023",
      author: "João Santos",
      status: "Final",
    },
    {
      id: "REP-2023-003",
      title: "Funding Allocation Analysis",
      type: "Financial Report",
      date: "Jul 10, 2023",
      author: "Ana Costa",
      status: "Final",
    },
    {
      id: "REP-2023-004",
      title: "Sustainable Energy Projects Overview",
      type: "Sector Report",
      date: "Jul 5, 2023",
      author: "Pedro Fernandes",
      status: "Draft",
    },
    {
      id: "REP-2023-005",
      title: "Regional Innovation Distribution",
      type: "Analytical Report",
      date: "Jun 28, 2023",
      author: "Sofia Martins",
      status: "Final",
    },
    {
      id: "REP-2023-006",
      title: "Patent Applications Summary",
      type: "IP Report",
      date: "Jun 25, 2023",
      author: "Miguel Oliveira",
      status: "Review",
    },
  ];
  
  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredReports.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No reports found matching your criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredReports.map((report) => (
        <Card key={report.id} className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-medium">{report.title}</CardTitle>
              <Badge variant={
                report.status === 'Final' ? 'default' : 
                report.status === 'Draft' ? 'outline' : 
                'secondary'
              }>
                {report.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{report.type}</p>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between items-center">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>{report.date}</span>
              <span className="mx-1">•</span>
              <span>By {report.author}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
