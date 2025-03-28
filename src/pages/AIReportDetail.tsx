
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AIGeneratedReport, generatePDF, extractVisualizations } from "@/utils/reportService";
import { useLanguage } from "@/contexts/LanguageContext";
import { ReportVisualizer } from "@/components/reports/ReportVisualizer";
import { ChevronLeft, Download, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const AIReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [report, setReport] = useState<AIGeneratedReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setIsLoading(true);
        
        // First check session storage (for direct navigation from the list)
        const storedReport = sessionStorage.getItem('currentReport');
        if (storedReport) {
          const parsedReport = JSON.parse(storedReport);
          if (parsedReport.id === id) {
            setReport(parsedReport);
            setIsLoading(false);
            return;
          }
        }
        
        // If not in session storage or ID doesn't match, fetch from database
        const { data, error } = await supabase
          .from('ai_generated_reports')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setReport(data as AIGeneratedReport);
        } else {
          navigate('/reports');
          toast({
            title: language === 'pt' ? "Relatório não encontrado" : "Report not found",
            description: language === 'pt' 
              ? "O relatório solicitado não existe ou foi removido." 
              : "The requested report does not exist or has been removed.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error loading report:", error);
        toast({
          title: language === 'pt' ? "Erro ao carregar relatório" : "Error loading report",
          description: language === 'pt' 
            ? "Não foi possível carregar os detalhes do relatório." 
            : "Could not load the report details.",
          variant: "destructive"
        });
        navigate('/reports');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReport();
  }, [id, navigate, toast, language]);

  const handleDownloadPDF = () => {
    if (!report) return;
    
    try {
      toast({
        title: language === 'pt' ? "Preparando download" : "Preparing download",
        description: language === 'pt' 
          ? "Gerando PDF para download..." 
          : "Generating PDF for download..."
      });
      
      const dataUri = generatePDF(report);
      
      // Create a link element and trigger the download
      const link = document.createElement('a');
      const fileName = report.title.replace(/\s+/g, '-').toLowerCase() + '.pdf';
      link.href = dataUri;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: language === 'pt' ? "Download concluído" : "Download complete",
        description: language === 'pt' 
          ? `O relatório "${report.title}" foi baixado.` 
          : `The report "${report.title}" has been downloaded.`
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: language === 'pt' ? "Erro ao gerar PDF" : "Error generating PDF",
        description: language === 'pt' 
          ? "Não foi possível gerar o PDF para download." 
          : "Could not generate the PDF for download.",
        variant: "destructive"
      });
    }
  };

  const goBackToReports = () => {
    navigate('/reports');
  };

  const renderContent = (content: string) => {
    if (!content) return null;
    
    // Split the content by visualization markers
    const segments = content.split(/\[Visualization:[^\]]+\]/g);
    const visualizationMarkers = content.match(/\[Visualization:[^\]]+\]/g) || [];
    
    return segments.map((segment, index) => {
      // Process segment (paragraph or section)
      const processedSegment = segment.split('\n').map((line, lineIndex) => {
        if (line.startsWith('# ')) {
          return <h1 key={`line-${index}-${lineIndex}`} className="text-2xl font-bold mt-6 mb-4">{line.replace('# ', '')}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={`line-${index}-${lineIndex}`} className="text-xl font-semibold mt-5 mb-3">{line.replace('## ', '')}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={`line-${index}-${lineIndex}`} className="text-lg font-medium mt-4 mb-2">{line.replace('### ', '')}</h3>;
        } else if (line === '') {
          return <br key={`line-${index}-${lineIndex}`} />;
        } else {
          return <p key={`line-${index}-${lineIndex}`} className="my-3 text-gray-700">{line}</p>;
        }
      });
      
      // Render segment + visualization if available
      const result = [
        <div key={`segment-${index}`}>{processedSegment}</div>
      ];
      
      // Add visualization after the segment if there is one for this segment
      if (visualizationMarkers[index]) {
        try {
          const marker = visualizationMarkers[index];
          const jsonStr = marker.substring(14, marker.length - 1);
          const vizData = JSON.parse(jsonStr);
          
          result.push(
            <div key={`viz-${index}`} className="my-6 p-4 border border-gray-200 rounded-md bg-gray-50">
              <ReportVisualizer visualization={vizData} />
            </div>
          );
        } catch (e) {
          console.error('Error parsing visualization data:', e);
        }
      }
      
      return result;
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Button variant="ghost" onClick={goBackToReports} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {language === 'pt' ? "Voltar para Relatórios" : "Back to Reports"}
        </Button>
        
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={goBackToReports}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          {language === 'pt' ? "Voltar para Relatórios" : "Back to Reports"}
        </Button>
        
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {language === 'pt' 
                ? "Relatório não encontrado ou foi removido." 
                : "Report not found or has been removed."}
            </p>
            <Button 
              className="mt-4" 
              onClick={goBackToReports}
            >
              {language === 'pt' ? "Voltar para Relatórios" : "Back to Reports"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button variant="ghost" onClick={goBackToReports}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          {language === 'pt' ? "Voltar para Relatórios" : "Back to Reports"}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleDownloadPDF}
        >
          <Download className="h-4 w-4 mr-2" />
          {language === 'pt' ? "Baixar como PDF" : "Download as PDF"}
        </Button>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{report.title}</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date(report.created_at).toLocaleDateString(
            language === 'pt' ? 'pt-BR' : 'en-US',
            { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }
          )}
          {report.report_type && (
            <>
              <span className="mx-2">•</span>
              <span>{report.report_type}</span>
            </>
          )}
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="prose max-w-none">
            {renderContent(report.content)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIReportDetail;
