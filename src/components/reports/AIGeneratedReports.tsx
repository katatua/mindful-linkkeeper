
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AIGeneratedReport, fetchReports, deleteReport, generatePDF, extractVisualizations } from "@/utils/reportService";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Download, FileText, Trash2, RefreshCw, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const AIGeneratedReports = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [reports, setReports] = useState<AIGeneratedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    loadReports();
  }, [language]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const fetchedReports = await fetchReports(language);
      setReports(fetchedReports);
    } catch (error) {
      console.error("Error loading reports:", error);
      toast({
        title: language === 'pt' ? "Erro ao carregar relatórios" : "Error loading reports",
        description: language === 'pt' ? 
          "Não foi possível carregar os relatórios gerados por IA." : 
          "Could not load AI-generated reports.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewReport = (report: AIGeneratedReport) => {
    // Store the report in session storage for viewing in detail
    sessionStorage.setItem('currentReport', JSON.stringify(report));
    navigate(`/reports/ai/${report.id}`);
  };

  const handleDeleteReport = async (id: string) => {
    try {
      await deleteReport(id);
      setReports(reports.filter(report => report.id !== id));
      toast({
        title: language === 'pt' ? "Relatório excluído" : "Report deleted",
        description: language === 'pt' ? 
          "O relatório foi excluído com sucesso." : 
          "The report has been successfully deleted."
      });
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: language === 'pt' ? "Erro ao excluir" : "Error deleting",
        description: language === 'pt' ? 
          "Não foi possível excluir o relatório." : 
          "Could not delete the report.",
        variant: "destructive"
      });
    }
    setShowConfirmDialog(false);
    setReportToDelete(null);
  };

  const handleDownloadPDF = (report: AIGeneratedReport) => {
    try {
      toast({
        title: language === 'pt' ? "Preparando download" : "Preparing download",
        description: language === 'pt' ? 
          "Gerando PDF para download..." : 
          "Generating PDF for download..."
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
        description: language === 'pt' ? 
          `O relatório "${report.title}" foi baixado.` : 
          `The report "${report.title}" has been downloaded.`
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: language === 'pt' ? "Erro ao gerar PDF" : "Error generating PDF",
        description: language === 'pt' ? 
          "Não foi possível gerar o PDF para download." : 
          "Could not generate the PDF for download.",
        variant: "destructive"
      });
    }
  };
  
  const getWordCount = (content: string): number => {
    // Remove visualization markers before counting words
    const cleanText = content.replace(/\[Visualization:[^\]]+\]/g, '');
    return cleanText.split(/\s+/).length;
  };
  
  const hasVisualizations = (content: string): boolean => {
    return content.includes('[Visualization:');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {language === 'pt' ? "Relatórios Gerados por IA" : "AI-Generated Reports"}
        </h2>
        <Button 
          variant="outline" 
          onClick={loadReports} 
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {language === 'pt' ? "Atualizar" : "Refresh"}
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            {language === 'pt' ? "Carregando relatórios..." : "Loading reports..."}
          </p>
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {language === 'pt' 
                ? "Nenhum relatório gerado por IA encontrado. Gere um relatório usando o gerador de IA." 
                : "No AI-generated reports found. Generate a report using the AI generator."}
            </p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/reports')}
            >
              {language === 'pt' ? "Ir para Gerador de Relatórios" : "Go to Report Generator"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => {
            const wordCount = getWordCount(report.content);
            const visualizationsPresent = hasVisualizations(report.content);
            
            return (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium truncate">{report.title}</CardTitle>
                  <CardDescription>
                    {report.report_type || (language === 'pt' ? "Relatório Gerado por IA" : "AI-Generated Report")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(report.created_at).toLocaleDateString(
                        language === 'pt' ? 'pt-BR' : 'en-US',
                        { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                        }
                      )}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {visualizationsPresent && <BarChart className="h-3.5 w-3.5 text-blue-500" />}
                      <span>{wordCount.toLocaleString()} {language === 'pt' ? "palavras" : "words"}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm line-clamp-3">
                    {report.content.replace(/\[Visualization:[^\]]+\]/g, '').substring(0, 150)}...
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewReport(report)}
                  >
                    {language === 'pt' ? "Visualizar" : "View"}
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadPDF(report)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <AlertDialog open={showConfirmDialog && reportToDelete === report.id} onOpenChange={setShowConfirmDialog}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setReportToDelete(report.id);
                            setShowConfirmDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {language === 'pt' ? "Excluir Relatório?" : "Delete Report?"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {language === 'pt' 
                              ? "Esta ação não pode ser desfeita. Isso excluirá permanentemente o relatório." 
                              : "This action cannot be undone. This will permanently delete the report."}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {language === 'pt' ? "Cancelar" : "Cancel"}
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => reportToDelete && handleDeleteReport(reportToDelete)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            {language === 'pt' ? "Excluir" : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
