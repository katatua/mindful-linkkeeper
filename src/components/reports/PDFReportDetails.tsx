
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { jsPDF } from "jspdf";
import ReactMarkdown from "react-markdown";
import { ShareEmailDialog } from "@/components/ShareEmailDialog";

interface PDFReportDetailsProps {
  reportId: string;
}

export const PDFReportDetails = ({ reportId }: PDFReportDetailsProps) => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    async function fetchReportDetails() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching report details for ID:', reportId);
        
        const { data, error } = await supabase
          .from('pdf_reports')
          .select('*, pdf_extraction:pdf_extraction_id(*)')
          .eq('id', reportId)
          .single();
          
        if (error) {
          console.error('Error fetching report details:', error);
          throw error;
        }
        
        console.log('Report details fetched:', data);
        setReport(data);
      } catch (err) {
        console.error('Error loading report:', err);
        setError(language === 'en' 
          ? "Failed to load report details. Please try again." 
          : "Falha ao carregar detalhes do relatório. Por favor, tente novamente.");
        
        toast({
          title: language === 'en' ? "Error loading report" : "Erro ao carregar relatório",
          description: err instanceof Error ? err.message : "Unknown error",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    if (reportId) {
      fetchReportDetails();
    }
  }, [reportId, language, toast]);

  const handleDownloadPDF = () => {
    if (!report) return;
    
    toast({
      title: language === 'en' ? "Downloading report" : "Baixando relatório",
      description: language === 'en' 
        ? `Preparing ${report.report_title} for download` 
        : `Preparando ${report.report_title} para download`,
    });
    
    setTimeout(() => {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add header
      pdf.setFontSize(22);
      pdf.text(report.report_title, 20, 30);
      
      pdf.setFontSize(12);
      pdf.text(`Report ID: ${report.id}`, 20, 45);
      pdf.text(`Generated: ${new Date(report.created_at).toLocaleString()}`, 20, 55);
      
      pdf.setFontSize(16);
      pdf.text("Content Summary", 20, 75);
      
      // Add report content if available
      if (report.report_content) {
        pdf.setFontSize(12);
        const contentLines = pdf.splitTextToSize(report.report_content, 170);
        pdf.text(contentLines, 20, 85);
      }
      
      // Add key metrics if available
      if (report.report_data?.key_metrics?.length > 0) {
        pdf.setFontSize(16);
        pdf.text("Key Metrics", 20, 160);
        
        pdf.setFontSize(12);
        report.report_data.key_metrics.forEach((metric: any, index: number) => {
          pdf.text(`• ${metric.type}: ${metric.value} ${metric.unit || ''}`, 20, 170 + (index * 10));
        });
      }
      
      pdf.setFontSize(10);
      pdf.text(`Generated from ANI Innovation Portal - ${new Date().toLocaleString()}`, 20, 270);
      
      pdf.save(`${report.id}-${report.report_title.replace(/\s+/g, '-')}.pdf`);
      
      toast({
        title: language === 'en' ? "Download complete" : "Download completo",
        description: language === 'en' 
          ? `Report "${report.report_title}" has been downloaded.` 
          : `Relatório "${report.report_title}" foi baixado.`,
      });
    }, 500);
  };

  const handleShareReport = () => {
    setShareDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive font-medium">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            {language === 'en' ? "Try Again" : "Tentar Novamente"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">
            {language === 'en' ? "Report not found" : "Relatório não encontrado"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{report.report_title}</CardTitle>
          <p className="text-sm text-gray-500">
            {language === 'en' ? "Generated on: " : "Gerado em: "}
            {new Date(report.created_at).toLocaleString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              {language === 'en' ? "Download PDF" : "Baixar PDF"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareReport}>
              <Share2 className="h-4 w-4 mr-2" />
              {language === 'en' ? "Share Report" : "Compartilhar"}
            </Button>
          </div>
          
          <Separator />
          
          {report.report_content ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{report.report_content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              {language === 'en' ? "No report content available" : "Nenhum conteúdo de relatório disponível"}
            </p>
          )}
          
          {report.report_data && (
            <>
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {language === 'en' ? "Key Metrics" : "Métricas Chave"}
                </h3>
                
                {report.report_data.key_metrics?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.report_data.key_metrics.map((metric: any, index: number) => (
                      <Card key={index} className="bg-gray-50">
                        <CardContent className="p-4">
                          <p className="text-gray-600 text-sm">{metric.type}</p>
                          <div className="text-xl font-medium">
                            {metric.value} {metric.unit}
                          </div>
                          {metric.context && (
                            <p className="text-sm text-gray-500 mt-1">{metric.context}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    {language === 'en' ? "No metrics available" : "Nenhuma métrica disponível"}
                  </p>
                )}
              </div>
              
              {report.pdf_extraction && (
                <>
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'en' ? "Source Document" : "Documento Fonte"}
                    </h3>
                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{report.pdf_extraction.file_name}</p>
                        <p className="text-sm text-gray-500">
                          {language === 'en' ? "Processed on: " : "Processado em: "}
                          {new Date(report.pdf_extraction.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      <ShareEmailDialog 
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        title={report?.report_title || ""}
        contentType="Report"
      />
    </>
  );
};
