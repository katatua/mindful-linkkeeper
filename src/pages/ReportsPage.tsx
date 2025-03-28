
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Calendar, FileText, Share2, Clock, Filter, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ReportsList } from "@/components/reports/ReportsList";
import { ReportTemplates } from "@/components/reports/ReportTemplates";
import { ScheduledReports } from "@/components/reports/ScheduledReports";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { AIGeneratedReports } from "@/components/reports/AIGeneratedReports";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useLanguage } from "@/contexts/LanguageContext";

const ReportsPage = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [customReport, setCustomReport] = useState({
    title: language === 'pt' ? "Análise de Inovação Q4 2023" : "Q4 2023 Innovation Analytics",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    format: "pdf",
    generationType: "one-time",
    generateDate: "2023-12-31",
    distribution: "team@ani.pt",
    dataSources: {
      fundingData: true,
      projectMetrics: true,
      regionalData: true,
      sectorAnalysis: false,
      performanceKPIs: false
    }
  });
  
  const recentReports = [
    {
      title: language === 'pt' ? "Desempenho de Inovação Q3 2023" : "Q3 2023 Innovation Performance",
      description: language === 'pt' ? "Relatório trimestral sobre programas de inovação da ANI" : "Quarterly performance report on ANI's innovation programs",
      date: language === 'pt' ? "15 de Out, 2023" : "Oct 15, 2023",
      status: "completed",
      author: "Maria Silva"
    },
    {
      title: language === 'pt' ? "Análise do Ecossistema de Startups PME" : "SME Startup Ecosystem Analysis",
      description: language === 'pt' ? "Análise do financiamento e desempenho do ecossistema de startups portuguesas" : "Analysis of the Portuguese startup ecosystem funding and performance",
      date: language === 'pt' ? "28 de Set, 2023" : "Sep 28, 2023",
      status: "completed",
      author: "Carlos Mendes"
    },
    {
      title: language === 'pt' ? "Estudo de Impacto dos Incentivos Fiscais em I&D" : "R&D Tax Incentives Impact Study",
      description: language === 'pt' ? "Avaliação do impacto do programa SIFIDE II nos investimentos empresariais em I&D" : "Assessment of SIFIDE II program impact on corporate R&D investments",
      date: language === 'pt' ? "12 de Set, 2023" : "Sep 12, 2023",
      status: "completed",
      author: "Ana Costa"
    },
    {
      title: language === 'pt' ? "Comparação Internacional de Inovação" : "International Innovation Benchmarking",
      description: language === 'pt' ? "Comparação das métricas de inovação portuguesas com países da UE" : "Comparison of Portuguese innovation metrics against EU countries",
      date: language === 'pt' ? "30 de Ago, 2023" : "Aug 30, 2023",
      status: "completed",
      author: "João Almeida"
    }
  ];

  const handleGenerateReport = () => {
    toast({
      title: language === 'pt' ? "Geração de relatório iniciada" : "Report generation initiated",
      description: language === 'pt' ? 
        "Seu relatório personalizado está sendo preparado. Estará disponível em alguns minutos." : 
        "Your custom report is being prepared. It will be available in a few minutes.",
      duration: 5000
    });
  };

  const handleSaveTemplate = () => {
    toast({
      title: language === 'pt' ? "Modelo salvo" : "Template saved",
      description: language === 'pt' ?
        `O modelo "${customReport.title}" foi salvo com sucesso.` :
        `The template "${customReport.title}" has been saved successfully.`,
      duration: 5000
    });
    
    setTimeout(() => {
      const tabsElement = document.querySelector('[data-state="inactive"][data-value="templates"]') as HTMLElement;
      if (tabsElement) {
        tabsElement.click();
      }
    }, 500);
  };

  const handleDataSourceChange = (source: keyof typeof customReport.dataSources) => {
    setCustomReport(prev => ({
      ...prev,
      dataSources: {
        ...prev.dataSources,
        [source]: !prev.dataSources[source]
      }
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomReport(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const setReportFormat = (format: string) => {
    setCustomReport(prev => ({
      ...prev,
      format
    }));
  };

  const setGenerationType = (type: string) => {
    setCustomReport(prev => ({
      ...prev,
      generationType: type
    }));
  };

  const handleDownloadPDF = (report: any) => {
    toast({
      title: language === 'pt' ? "Baixando relatório" : "Downloading report",
      description: language === 'pt' ?
        `Preparando ${report.title} para download` :
        `Preparing ${report.title} for download`,
    });
    
    setTimeout(() => {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      pdf.setFontSize(22);
      pdf.text(report.title, 20, 30);
      
      pdf.setFontSize(12);
      pdf.text(`${language === 'pt' ? 'Tipo de Relatório' : 'Report Type'}: ${report.description}`, 20, 45);
      pdf.text(`${language === 'pt' ? 'Data' : 'Date'}: ${report.date}`, 20, 55);
      pdf.text(`${language === 'pt' ? 'Autor' : 'Author'}: ${report.author}`, 20, 65);
      
      pdf.setFontSize(16);
      pdf.text(language === 'pt' ? "Resumo Executivo" : "Executive Summary", 20, 85);
      
      pdf.setFontSize(12);
      const content = language === 'pt' 
        ? "Este é um resumo de relatório gerado automaticamente. O conteúdo completo incluiria análises detalhadas, gráficos e análise de dados abrangente relevante para o tipo de relatório selecionado."
        : "This is an automatically generated report summary. The full content would include detailed analytics, charts, and comprehensive data analysis relevant to the selected report type.";
      const contentLines = pdf.splitTextToSize(content, 170);
      pdf.text(contentLines, 20, 95);
      
      pdf.save(`${report.title.replace(/\s+/g, '-')}.pdf`);
      
      toast({
        title: language === 'pt' ? "Download completo" : "Download complete",
        description: language === 'pt' ?
          `O relatório "${report.title}" foi baixado.` :
          `Report "${report.title}" has been downloaded.`,
      });
    }, 500);
  };

  const handleShareReport = (report: any) => {
    toast({
      title: language === 'pt' ? "Relatório compartilhado" : "Report shared",
      description: language === 'pt' ?
        `Um link de compartilhamento para "${report.title}" foi copiado para a área de transferência` :
        `A sharing link for "${report.title}" has been copied to clipboard`,
    });
    
    navigator.clipboard.writeText(`https://ani-portal.example.com/shared-reports/${report.title.replace(/\s+/g, '-')}`);
  };

  const handleChartClick = (chartId: string, category: string, chartType: string) => {
    navigate(`/visualization/${category}/${chartType}/${chartId}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{language === 'pt' ? "Relatórios e Documentação" : "Reports & Documentation"}</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={language === 'pt' ? "Buscar relatórios..." : "Search reports..."}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" /> {language === 'pt' ? "Filtrar" : "Filter"}
          </Button>
          <Button variant="default" size="sm">
            <FileText className="h-4 w-4 mr-1" /> {language === 'pt' ? "Gerar Relatório" : "Generate Report"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">{language === 'pt' ? "Relatórios Recentes" : "Recent Reports"}</TabsTrigger>
          <TabsTrigger value="templates">{language === 'pt' ? "Modelos de Relatórios" : "Report Templates"}</TabsTrigger>
          <TabsTrigger value="scheduled">{language === 'pt' ? "Relatórios Agendados" : "Scheduled Reports"}</TabsTrigger>
          <TabsTrigger value="custom">{language === 'pt' ? "Relatórios Personalizados" : "Custom Reports"}</TabsTrigger>
          <TabsTrigger value="ai-generator">{language === 'pt' ? "Gerador de Relatórios IA" : "AI Report Generator"}</TabsTrigger>
          <TabsTrigger value="ai-reports">{language === 'pt' ? "Relatórios Gerados por IA" : "AI-Generated Reports"}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentReports.map((report, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium">{report.title}</CardTitle>
                    {report.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  <CardDescription>
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{report.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{language === 'pt' ? "Por" : "By"} {report.author}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-between items-center w-full">
                    <Button variant="ghost" size="sm" onClick={() => handleDownloadPDF(report)}>
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleShareReport(report)}>
                      <Share2 className="h-4 w-4 mr-1" />
                      {language === 'pt' ? "Compartilhar" : "Share"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <ReportsList searchQuery={searchQuery} />
        </TabsContent>
        
        <TabsContent value="templates">
          <ReportTemplates />
        </TabsContent>
        
        <TabsContent value="scheduled">
          <ScheduledReports />
        </TabsContent>
        
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'pt' ? "Gerador de Relatórios Personalizados" : "Custom Report Generator"}</CardTitle>
              <CardDescription>
                {language === 'pt' 
                  ? "Crie relatórios personalizados selecionando as fontes de dados, métricas e opções de visualização"
                  : "Create tailored reports by selecting the data sources, metrics, and visualization options"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {language === 'pt' ? "1. Selecione Fontes de Dados" : "1. Select Data Sources"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="funding-data" 
                          className="checkbox" 
                          checked={customReport.dataSources.fundingData}
                          onChange={() => handleDataSourceChange('fundingData')}
                        />
                        <label htmlFor="funding-data" className="text-sm">
                          {language === 'pt' ? "Dados de Financiamento" : "Funding Data"}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="project-metrics" 
                          className="checkbox" 
                          checked={customReport.dataSources.projectMetrics}
                          onChange={() => handleDataSourceChange('projectMetrics')}
                        />
                        <label htmlFor="project-metrics" className="text-sm">
                          {language === 'pt' ? "Métricas de Projetos" : "Project Metrics"}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="regional-data" 
                          className="checkbox" 
                          checked={customReport.dataSources.regionalData}
                          onChange={() => handleDataSourceChange('regionalData')}
                        />
                        <label htmlFor="regional-data" className="text-sm">
                          {language === 'pt' ? "Dados Regionais" : "Regional Data"}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="sector-analysis" 
                          className="checkbox"
                          checked={customReport.dataSources.sectorAnalysis}
                          onChange={() => handleDataSourceChange('sectorAnalysis')}
                        />
                        <label htmlFor="sector-analysis" className="text-sm">
                          {language === 'pt' ? "Análise Setorial" : "Sector Analysis"}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="performance-kpis" 
                          className="checkbox"
                          checked={customReport.dataSources.performanceKPIs}
                          onChange={() => handleDataSourceChange('performanceKPIs')}
                        />
                        <label htmlFor="performance-kpis" className="text-sm">
                          {language === 'pt' ? "KPIs de Desempenho" : "Performance KPIs"}
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {language === 'pt' ? "2. Opções de Relatório" : "2. Report Options"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label htmlFor="report-title" className="text-sm font-medium">
                          {language === 'pt' ? "Título do Relatório" : "Report Title"}
                        </label>
                        <Input
                          id="report-title"
                          placeholder={language === 'pt' ? "Insira o título do relatório" : "Enter report title"}
                          value={customReport.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="date-range" className="text-sm font-medium">
                          {language === 'pt' ? "Período" : "Date Range"}
                        </label>
                        <div className="flex gap-2">
                          <Input
                            id="date-range-start"
                            type="date"
                            value={customReport.startDate}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                          />
                          <Input
                            id="date-range-end"
                            type="date"
                            value={customReport.endDate}
                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium">
                          {language === 'pt' ? "Formato do Relatório" : "Report Format"}
                        </label>
                        <div className="flex gap-2">
                          <Button 
                            variant={customReport.format === 'pdf' ? "default" : "outline"} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setReportFormat('pdf')}
                          >
                            <FileText className="h-4 w-4 mr-1" /> PDF
                          </Button>
                          <Button 
                            variant={customReport.format === 'excel' ? "default" : "outline"} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setReportFormat('excel')}
                          >
                            Excel
                          </Button>
                          <Button 
                            variant={customReport.format === 'web' ? "default" : "outline"} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setReportFormat('web')}
                          >
                            Web
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {language === 'pt' ? "3. Opções de Agendamento" : "3. Schedule Options"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">
                          {language === 'pt' ? "Tipo de Geração" : "Generation Type"}
                        </label>
                        <div className="flex gap-2">
                          <Button 
                            variant={customReport.generationType === 'one-time' ? "default" : "outline"} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setGenerationType('one-time')}
                          >
                            <Calendar className="h-4 w-4 mr-1" /> 
                            {language === 'pt' ? "Única" : "One-time"}
                          </Button>
                          <Button 
                            variant={customReport.generationType === 'recurring' ? "default" : "outline"} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setGenerationType('recurring')}
                          >
                            <Clock className="h-4 w-4 mr-1" /> 
                            {language === 'pt' ? "Recorrente" : "Recurring"}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="generate-date" className="text-sm font-medium">
                          {language === 'pt' ? "Data de Geração" : "Generation Date"}
                        </label>
                        <Input
                          id="generate-date"
                          type="date"
                          value={customReport.generateDate}
                          onChange={(e) => handleInputChange('generateDate', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium">
                          {language === 'pt' ? "Distribuição" : "Distribution"}
                        </label>
                        <Input
                          placeholder={language === 'pt' ? "Insira destinatários de email" : "Enter email recipients"}
                          value={customReport.distribution}
                          onChange={(e) => handleInputChange('distribution', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end">
                <Button className="mr-2" variant="outline" onClick={handleSaveTemplate}>
                  {language === 'pt' ? "Salvar Modelo" : "Save Template"}
                </Button>
                <Button onClick={handleGenerateReport}>
                  {language === 'pt' ? "Gerar Relatório" : "Generate Report"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-generator">
          <ReportGenerator />
        </TabsContent>
        
        <TabsContent value="ai-reports">
          <AIGeneratedReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
