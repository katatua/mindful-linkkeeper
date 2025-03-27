import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Share2, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { jsPDF } from "jspdf";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ReportsListProps {
  searchQuery: string;
}

export const ReportsList = ({ searchQuery }: ReportsListProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [currentReport, setCurrentReport] = useState<any>(null);
  
  // Sample data for reports
  const reports = [
    {
      id: "REP-2023-001",
      title: "Q2 2023 Innovation Performance",
      type: "Quarterly Report",
      date: "Jun 30, 2023",
      author: "Maria Silva",
      status: "Final",
      content: "This report provides a comprehensive analysis of innovation performance across all funded projects during Q2 2023. Key highlights include a 12% increase in active projects, €24.7M in total R&D investment, and 87 new patent applications."
    },
    {
      id: "REP-2023-002",
      title: "Healthcare Innovation Projects Analysis",
      type: "Sector Report",
      date: "Jul 15, 2023",
      author: "João Santos",
      status: "Final",
      content: "An in-depth analysis of healthcare innovation projects, including medical devices, digital health solutions, and pharmaceutical research. The sector shows a 15% growth in funding allocation and represents 24% of the total innovation portfolio."
    },
    {
      id: "REP-2023-003",
      title: "Funding Allocation Analysis",
      type: "Financial Report",
      date: "Jul 10, 2023",
      author: "Ana Costa",
      status: "Final",
      content: "Detailed breakdown of funding allocation across regions, sectors, and project types. EU Horizon Europe represents 42% of total funding, followed by National Funds at 28%, Private Investment at 18%, and Regional Programs at 12%."
    },
    {
      id: "REP-2023-004",
      title: "Sustainable Energy Projects Overview",
      type: "Sector Report",
      date: "Jul 5, 2023",
      author: "Pedro Fernandes",
      status: "Draft",
      content: "Overview of sustainable energy innovation projects, including renewable energy technologies, energy storage solutions, and smart grid applications. The sector accounts for 18% of total funding and shows a 22% year-over-year growth."
    },
    {
      id: "REP-2023-005",
      title: "Regional Innovation Distribution",
      type: "Analytical Report",
      date: "Jun 28, 2023",
      author: "Sofia Martins",
      status: "Final",
      content: "Analysis of innovation project distribution across regions. The Central region leads with 58 projects, followed by the North with 42 projects, the South with 38 projects, and the Islands with 18 projects."
    },
    {
      id: "REP-2023-006",
      title: "Patent Applications Summary",
      type: "IP Report",
      date: "Jun 25, 2023",
      author: "Miguel Oliveira",
      status: "Review",
      content: "Summary of patent applications filed by funded projects. Healthcare sector leads with 32 patent applications, followed by Digital Technology with 28, Energy with 18, and Manufacturing with 9."
    },
  ];
  
  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadPDF = (report: any) => {
    toast({
      title: "Downloading report",
      description: `Preparing ${report.title} for download`,
    });
    
    // Use pre-generated PDF instead of generating on the fly
    setTimeout(() => {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add sample content (simulating a pre-generated report)
      pdf.setFontSize(22);
      pdf.text(report.title, 20, 30);
      
      pdf.setFontSize(12);
      pdf.text(`Report ID: ${report.id}`, 20, 45);
      pdf.text(`Type: ${report.type}`, 20, 55);
      pdf.text(`Author: ${report.author}`, 20, 65);
      pdf.text(`Date: ${report.date}`, 20, 75);
      pdf.text(`Status: ${report.status}`, 20, 85);
      
      pdf.setFontSize(16);
      pdf.text("Executive Summary", 20, 105);
      
      pdf.setFontSize(12);
      // Break long content text into multiple lines
      const contentLines = pdf.splitTextToSize(report.content, 170);
      pdf.text(contentLines, 20, 115);
      
      // Add sample visualizations text
      pdf.setFontSize(16);
      pdf.text("Key Visualizations", 20, 155);
      
      pdf.setFontSize(12);
      pdf.text("[Performance charts and data visualizations would appear here]", 20, 165);
      
      pdf.setFontSize(16);
      pdf.text("Conclusions & Recommendations", 20, 185);
      
      pdf.setFontSize(12);
      pdf.text("Based on the analysis, we recommend continuing investment in high-performing", 20, 195);
      pdf.text("sectors and exploring new opportunities in emerging technology areas.", 20, 205);
      
      pdf.setFontSize(10);
      pdf.text(`This is an official report generated from the ANI Innovation Portal.`, 20, 265);
      pdf.text(`Document ID: ${report.id} | Generated on: ${new Date().toLocaleString()}`, 20, 275);
      
      pdf.save(`${report.id}-${report.title.replace(/\s+/g, '-')}.pdf`);
      
      toast({
        title: "Download complete",
        description: `Report "${report.title}" has been downloaded.`,
      });
    }, 500); // Short delay to simulate pre-generated PDF
  };

  const handleViewReport = (report: any) => {
    // Navigate to the report detail page
    navigate(`/reports/${report.id}`);
  };

  const handleShareReport = (report: any) => {
    setCurrentReport(report);
    setShareDialogOpen(true);
  };

  const handleShareSubmit = () => {
    if (!shareEmail || !currentReport) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Report shared",
      description: `"${currentReport.title}" has been shared with ${shareEmail}`,
    });
    setShareDialogOpen(false);
    setShareEmail('');
    setCurrentReport(null);
  };

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
              <Button variant="ghost" size="sm" onClick={() => handleViewReport(report)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDownloadPDF(report)}>
                <FileText className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleShareReport(report)}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Report</DialogTitle>
            <DialogDescription>
              Share this report with team members via email.
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
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleShareSubmit}>Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
