
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const PDFReportDetails = ({ reportId }: { reportId?: string }) => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const params = useParams();
  const navigate = useNavigate();
  
  // Use reportId from props or from URL parameters
  const id = reportId || params.id;
  
  useEffect(() => {
    async function fetchReport() {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch report by ID
        const result = await supabase
          .from('pdf_reports')
          .select()
          .eq('id', id)
          .single();
        
        if (result.error) throw result.error;
        
        setReport(result.data);
      } catch (err) {
        console.error('Error fetching report:', err);
        toast({
          title: "Error loading report",
          description: err instanceof Error ? err.message : 'Unknown error',
          variant: "destructive"
        });
        
        // Try to fetch report by extraction ID if the first query failed
        try {
          const extractionResult = await supabase
            .from('pdf_reports')
            .select()
            .eq('pdf_extraction_id', id)
            .single();
            
          if (extractionResult.error) throw extractionResult.error;
          
          setReport(extractionResult.data);
        } catch (extractionError) {
          console.error('Error fetching report by extraction ID:', extractionError);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchReport();
  }, [id, toast]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleDownload = () => {
    // Implementation for downloading the report
    toast({
      title: "Download started",
      description: "Your report is being prepared for download."
    });
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full max-w-md" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  
  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Report Not Found</h2>
        <p className="text-gray-500 mb-6">The report you are looking for could not be found.</p>
        <Button onClick={handleBack} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Button>
        
        <Button 
          className="flex items-center gap-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold">{report.report_title}</h1>
      
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: report.report_content }}></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFReportDetails;
