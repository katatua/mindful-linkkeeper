
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Eye, Share2, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface ReportsListProps {
  searchQuery: string;
}

export const ReportsList = ({ searchQuery }: ReportsListProps) => {
  const { toast } = useToast();
  
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
    
    // Create a temporary div to render the report
    const tempDiv = document.createElement('div');
    tempDiv.className = 'p-8 bg-white';
    tempDiv.style.width = '800px';
    
    // Add content to the div
    tempDiv.innerHTML = `
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">${report.title}</h1>
      <div style="margin-bottom: 16px;">
        <span style="font-weight: 500;">Type:</span> ${report.type}<br>
        <span style="font-weight: 500;">Author:</span> ${report.author}<br>
        <span style="font-weight: 500;">Date:</span> ${report.date}<br>
        <span style="font-weight: 500;">Status:</span> ${report.status}
      </div>
      <div style="margin-bottom: 24px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 4px;">
        ${report.content}
      </div>
      <div style="margin-top: 32px; color: #6b7280; font-size: 12px;">
        This is an official report generated from the ANI Innovation Portal.
        Document ID: ${report.id} | Generated on: ${new Date().toLocaleString()}
      </div>
    `;
    
    // Append to body but hide it
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    // Generate PDF
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
      pdf.save(`${report.id}-${report.title.replace(/\s+/g, '-')}.pdf`);
      
      // Remove the temporary div
      document.body.removeChild(tempDiv);
      
      toast({
        title: "Download complete",
        description: `Report "${report.title}" has been downloaded.`,
      });
    });
  };

  const handleViewReport = (report: any) => {
    // In a real app, this would navigate to a detailed report view
    toast({
      title: "Viewing report",
      description: `Opening report: ${report.title}`,
    });
  };

  const handleShareReport = (report: any) => {
    // In a real app, this would open a share dialog or generate a shareable URL
    toast({
      title: "Share report",
      description: `Share link for "${report.title}" has been generated and copied to clipboard`,
    });

    // Simulate copying to clipboard
    navigator.clipboard.writeText(`https://ani-portal.example.com/reports/${report.id}`).catch(() => {
      console.error("Failed to copy to clipboard");
    });
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
    </div>
  );
};
