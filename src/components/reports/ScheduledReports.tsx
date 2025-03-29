
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, RefreshCw, Trash2, PauseCircle, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ScheduledReports = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const scheduledReportsEN = [
    {
      id: "SCH-2023-001",
      title: "Monthly Funding Overview",
      description: "Automated monthly report on funding allocation and utilization",
      frequency: "Monthly",
      nextGeneration: "Aug 1, 2023",
      status: "Active",
      recipients: ["innovation-team@ani.pt", "management@ani.pt"],
      content: "This automated report provides a comprehensive overview of monthly funding allocations and utilization across all active innovation programs and projects."
    },
    {
      id: "SCH-2023-002",
      title: "Quarterly Performance Metrics",
      description: "Quarterly analysis of innovation program performance metrics",
      frequency: "Quarterly",
      nextGeneration: "Oct 1, 2023",
      status: "Active",
      recipients: ["executive-board@ani.pt", "program-leads@ani.pt"],
      content: "This quarterly performance report analyzes key metrics across all innovation programs, including funding efficiency, project completion rates, and innovation outcomes."
    },
    {
      id: "SCH-2023-003",
      title: "Weekly Project Updates",
      description: "Weekly summary of project status changes and milestones",
      frequency: "Weekly",
      nextGeneration: "Jul 24, 2023",
      status: "Active",
      recipients: ["project-managers@ani.pt"],
      content: "This weekly report summarizes all project status changes, achieved milestones, and emerging issues requiring attention across the innovation portfolio."
    },
    {
      id: "SCH-2023-004",
      title: "Regional Innovation Dashboard",
      description: "Monthly dashboard of regional innovation metrics and changes",
      frequency: "Monthly",
      nextGeneration: "Aug 5, 2023",
      status: "Paused",
      recipients: ["regional-team@ani.pt", "analytics@ani.pt"],
      content: "This monthly dashboard visualizes innovation metrics by region, highlighting geographic trends, regional specializations, and comparative performance indicators."
    }
  ];
  
  const scheduledReportsPT = [
    {
      id: "SCH-2023-001",
      title: "Visão Geral Mensal de Financiamento",
      description: "Relatório mensal automatizado sobre alocação e utilização de financiamento",
      frequency: "Mensal",
      nextGeneration: "1 Ago, 2023",
      status: "Ativo",
      recipients: ["innovation-team@ani.pt", "management@ani.pt"],
      content: "Este relatório automatizado fornece uma visão abrangente das alocações e utilização de financiamento mensal em todos os programas e projetos de inovação ativos."
    },
    {
      id: "SCH-2023-002",
      title: "Métricas de Desempenho Trimestrais",
      description: "Análise trimestral de métricas de desempenho do programa de inovação",
      frequency: "Trimestral",
      nextGeneration: "1 Out, 2023",
      status: "Ativo",
      recipients: ["executive-board@ani.pt", "program-leads@ani.pt"],
      content: "Este relatório de desempenho trimestral analisa métricas-chave em todos os programas de inovação, incluindo eficiência de financiamento, taxas de conclusão de projetos e resultados de inovação."
    },
    {
      id: "SCH-2023-003",
      title: "Atualizações Semanais de Projetos",
      description: "Resumo semanal de alterações de status e marcos de projetos",
      frequency: "Semanal",
      nextGeneration: "24 Jul, 2023",
      status: "Ativo",
      recipients: ["project-managers@ani.pt"],
      content: "Este relatório semanal resume todas as alterações de status do projeto, marcos alcançados e questões emergentes que requerem atenção em todo o portfólio de inovação."
    },
    {
      id: "SCH-2023-004",
      title: "Painel de Inovação Regional",
      description: "Painel mensal de métricas de inovação regional e mudanças",
      frequency: "Mensal",
      nextGeneration: "5 Ago, 2023",
      status: "Pausado",
      recipients: ["regional-team@ani.pt", "analytics@ani.pt"],
      content: "Este painel mensal visualiza métricas de inovação por região, destacando tendências geográficas, especializações regionais e indicadores de desempenho comparativos."
    }
  ];
  
  // Select reports based on current language
  const scheduledReports = language === 'en' ? scheduledReportsEN : scheduledReportsPT;

  const handlePreviewReport = (report: any) => {
    // Create a temporary report object to store in session
    const reportObject = {
      id: report.id,
      title: report.title,
      content: report.content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      language: language,
      report_type: "Scheduled Report",
      user_id: null,
      metadata: {
        frequency: report.frequency,
        nextGeneration: report.nextGeneration,
        status: report.status,
        recipients: report.recipients
      }
    };
    
    // Store the report in session storage for the detail page to access
    sessionStorage.setItem('currentReport', JSON.stringify(reportObject));
    
    // Navigate to the report detail page
    navigate(`/ai-report/${report.id}`);
  };

  const handlePauseResume = (report: any) => {
    const isActive = report.status === 'Active' || report.status === 'Ativo';
    const newStatus = isActive ? 
      (language === 'en' ? 'Paused' : 'Pausado') : 
      (language === 'en' ? 'Active' : 'Ativo');
    
    toast({
      title: language === 'en' ? 
        `Report ${isActive ? 'paused' : 'resumed'}` : 
        `Relatório ${isActive ? 'pausado' : 'reativado'}`,
      description: language === 'en' ? 
        `"${report.title}" is now ${newStatus.toLowerCase()}` : 
        `"${report.title}" agora está ${newStatus.toLowerCase()}`
    });
  };

  const handleDelete = (report: any) => {
    toast({
      title: language === 'en' ? "Report deleted" : "Relatório excluído",
      description: language === 'en' ? 
        `"${report.title}" has been deleted` : 
        `"${report.title}" foi excluído`
    });
  };

  return (
    <div className="space-y-4">
      {scheduledReports.map((report, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-medium">{report.title}</CardTitle>
              <Badge variant={report.status === 'Active' || report.status === 'Ativo' ? 'default' : 'outline'}>
                {report.status}
              </Badge>
            </div>
            <CardDescription>
              {report.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>{t('reports.frequency')} {report.frequency}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{t('reports.next')} {report.nextGeneration}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{t('reports.generated')} 08:00 AM</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-2 rounded text-xs">
              <div className="text-gray-600 mb-1">{t('reports.recipients')}</div>
              <div className="flex flex-wrap gap-2">
                {report.recipients.map((recipient, i) => (
                  <div key={i} className="bg-white px-2 py-1 rounded border text-xs">
                    {recipient}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t">
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handlePreviewReport(report)}>
                  <FileText className="h-4 w-4 mr-1" />
                  {t('reports.preview')}
                </Button>
                {(report.status === 'Active' || report.status === 'Ativo') ? (
                  <Button variant="ghost" size="sm" onClick={() => handlePauseResume(report)}>
                    <PauseCircle className="h-4 w-4 mr-1" />
                    {t('reports.pause')}
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => handlePauseResume(report)}>
                    <PlayCircle className="h-4 w-4 mr-1" />
                    {t('reports.resume')}
                  </Button>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(report)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
