
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, FileText, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { jsPDF } from "jspdf";
import { Badge } from "@/components/ui/badge";
import { ShareEmailDialog } from "@/components/ShareEmailDialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

interface PDFReportProps {
  reportId: string;
}

export const PDFReportDetails = ({ reportId }: PDFReportProps) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);
  const [extraction, setExtraction] = useState<any>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        // Fetch the report
        const { data: reportData, error: reportError } = await supabase
          .from('pdf_reports')
          .select('*')
          .eq('id', reportId)
          .single();
          
        if (reportError) throw reportError;
        if (!reportData) throw new Error('Report not found');
        
        setReport(reportData);
        
        // Fetch the extraction data
        if (reportData.pdf_extraction_id) {
          const { data: extractionData, error: extractionError } = await supabase
            .from('pdf_extractions')
            .select('*')
            .eq('id', reportData.pdf_extraction_id)
            .single();
            
          if (extractionError) throw extractionError;
          setExtraction(extractionData);
          
          // Fetch the extracted elements
          const { data: elementsData, error: elementsError } = await supabase
            .from('pdf_extracted_elements')
            .select('*')
            .eq('pdf_extraction_id', reportData.pdf_extraction_id);
            
          if (elementsError) throw elementsError;
          setElements(elementsData || []);
        }
        
      } catch (err) {
        console.error('Error fetching report:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    if (reportId) {
      fetchReportData();
    }
  }, [reportId]);
  
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
      
      // Add title
      pdf.setFontSize(22);
      pdf.text(report.report_title, 20, 30);
      
      // Add metadata
      pdf.setFontSize(12);
      pdf.text(`Report ID: ${report.id}`, 20, 45);
      pdf.text(`Created: ${new Date(report.created_at).toLocaleString()}`, 20, 55);
      if (extraction) {
        pdf.text(`File: ${extraction.file_name}`, 20, 65);
      }
      
      // Add content
      pdf.setFontSize(16);
      pdf.text("Report Content", 20, 85);
      
      // Break content into lines
      const content = report.report_content || "No content available";
      const contentLines = pdf.splitTextToSize(content, 170);
      pdf.setFontSize(12);
      pdf.text(contentLines, 20, 95);
      
      // Add extracted data if available
      if (extraction) {
        const yPos = 95 + contentLines.length * 7;
        
        pdf.setFontSize(16);
        pdf.text("Extracted Data", 20, yPos);
        
        pdf.setFontSize(12);
        pdf.text(`Number fields: ${extraction.extracted_numbers ? extraction.extracted_numbers.length : 0}`, 20, yPos + 10);
        pdf.text(`Images: ${extraction.extracted_images ? extraction.extracted_images.length : 0}`, 20, yPos + 20);
      }
      
      // Add footer
      pdf.setFontSize(10);
      pdf.text(`Generated from extracted PDF on ${new Date().toLocaleString()}`, 20, 275);
      
      pdf.save(`${report.report_title.replace(/\s+/g, '-')}.pdf`);
      
      toast({
        title: language === 'en' ? "Download complete" : "Download completo",
        description: language === 'en' 
          ? `Report "${report.report_title}" has been downloaded.` 
          : `O relatório "${report.report_title}" foi baixado.`,
      });
    }, 500);
  };
  
  const handleShareReport = () => {
    setShareDialogOpen(true);
  };
  
  const handleViewSource = () => {
    if (extraction && extraction.file_url) {
      window.open(extraction.file_url, '_blank');
    }
  };
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {language === 'en' ? "Loading report details..." : "Carregando detalhes do relatório..."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !report) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-10">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h3 className="text-lg font-semibold">
              {language === 'en' ? "Error loading report" : "Erro ao carregar relatório"}
            </h3>
            <p className="text-sm text-muted-foreground">{error || 'Report not found'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
            <div>
              <CardTitle>{report.report_title}</CardTitle>
              <CardDescription>
                {language === 'en' ? "Created" : "Criado em"}: {new Date(report.created_at).toLocaleString()}
              </CardDescription>
            </div>
            <Badge 
              variant={report.report_status === 'completed' ? 'default' : 'outline'}
              className="md:self-start"
            >
              {report.report_status === 'completed' 
                ? (language === 'en' ? 'Completed' : 'Completo')
                : (language === 'en' ? 'Draft' : 'Rascunho')}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList className="mb-4">
              <TabsTrigger value="summary">
                {language === 'en' ? "Summary" : "Resumo"}
              </TabsTrigger>
              <TabsTrigger value="content">
                {language === 'en' ? "Full Content" : "Conteúdo Completo"}
              </TabsTrigger>
              <TabsTrigger value="data">
                {language === 'en' ? "Extracted Data" : "Dados Extraídos"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary">
              <div className="space-y-4">
                {report.report_data?.summary && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'en' ? "Executive Summary" : "Resumo Executivo"}
                    </h3>
                    <p className="text-gray-700">{report.report_data.summary}</p>
                  </div>
                )}
                
                {report.report_data?.key_metrics && report.report_data.key_metrics.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'en' ? "Key Metrics" : "Métricas Principais"}
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {report.report_data.key_metrics.map((metric: any, index: number) => (
                        <li key={index} className="text-gray-700">
                          {metric.context}: {metric.value} 
                          {metric.unit ? ` ${metric.unit}` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {extraction && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'en' ? "Source Document" : "Documento Fonte"}
                    </h3>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-gray-700 mb-1">
                        {language === 'en' ? "Filename" : "Nome do arquivo"}: {extraction.file_name}
                      </p>
                      {extraction.metadata && (
                        <>
                          <p className="text-gray-700 mb-1">
                            {language === 'en' ? "Size" : "Tamanho"}: {extraction.metadata.file_size}
                          </p>
                          <p className="text-gray-700">
                            {language === 'en' ? "Pages" : "Páginas"}: {extraction.metadata.page_count}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="content">
              <div className="prose max-w-none">
                {report.report_content
                  ? <div dangerouslySetInnerHTML={{ __html: report.report_content.replace(/\n/g, '<br/>') }} />
                  : <p className="text-gray-500 italic">
                      {language === 'en' ? "No content available" : "Nenhum conteúdo disponível"}
                    </p>
                }
              </div>
            </TabsContent>
            
            <TabsContent value="data">
              <div className="space-y-4">
                {extraction && (
                  <>
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        {language === 'en' ? "Extracted Text" : "Texto Extraído"}
                      </h3>
                      <div className="bg-muted p-3 rounded-md max-h-60 overflow-y-auto">
                        <p className="text-gray-700 whitespace-pre-line">
                          {extraction.extracted_text || (
                            <span className="text-gray-500 italic">
                              {language === 'en' ? "No text extracted" : "Nenhum texto extraído"}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    {extraction.extracted_numbers && extraction.extracted_numbers.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          {language === 'en' ? "Numerical Data" : "Dados Numéricos"}
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {language === 'en' ? "Type" : "Tipo"}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {language === 'en' ? "Value" : "Valor"}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {language === 'en' ? "Context" : "Contexto"}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {extraction.extracted_numbers.map((num: any, idx: number) => (
                                <tr key={idx}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {num.type}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {num.value} {num.unit || ''}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {num.context || ''}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {elements && elements.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          {language === 'en' ? "Extracted Elements" : "Elementos Extraídos"}
                        </h3>
                        <div className="space-y-2">
                          {elements.map((element, idx) => (
                            <Card key={idx} className="overflow-hidden">
                              <CardHeader className="py-2">
                                <CardTitle className="text-base">
                                  {element.element_type === 'table' 
                                    ? (language === 'en' ? 'Table' : 'Tabela') 
                                    : element.element_type === 'chart'
                                    ? (language === 'en' ? 'Chart' : 'Gráfico')
                                    : element.element_type}
                                  : {element.element_text}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="py-2">
                                {element.element_type === 'table' && element.element_data && (
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          {element.element_data.headers.map((header: string, i: number) => (
                                            <th key={i} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                              {header}
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                                        {element.element_data.rows.map((row: string[], rowIdx: number) => (
                                          <tr key={rowIdx}>
                                            {row.map((cell, cellIdx) => (
                                              <td key={cellIdx} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {cell}
                                              </td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                                
                                {element.element_type === 'chart' && (
                                  <div className="text-sm text-gray-500">
                                    {language === 'en' 
                                      ? "Chart data available for visualization" 
                                      : "Dados do gráfico disponíveis para visualização"}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-gray-500">
            {language === 'en' ? "PDF Analysis Report" : "Relatório de Análise de PDF"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-1" />
              {language === 'en' ? "Download" : "Baixar"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareReport}>
              <Share2 className="h-4 w-4 mr-1" />
              {language === 'en' ? "Share" : "Compartilhar"}
            </Button>
            {extraction?.file_url && (
              <Button variant="outline" size="sm" onClick={handleViewSource}>
                <ExternalLink className="h-4 w-4 mr-1" />
                {language === 'en' ? "Source" : "Fonte"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      <ShareEmailDialog 
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        title={report.report_title}
        contentType={language === 'en' ? "PDF Report" : "Relatório PDF"}
      />
    </div>
  );
};
