
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Calendar, FileText, Share2, Clock, Filter, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ReportsList } from "@/components/reports/ReportsList";
import { ReportTemplates } from "@/components/reports/ReportTemplates";
import { ScheduledReports } from "@/components/reports/ScheduledReports";
import { useNavigate, useLocation } from "react-router-dom";
import { PDFReportDetails } from "@/components/reports/PDFReportDetails";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const ReportsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const [pdfReports, setPdfReports] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  
  // Get reportId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const reportId = queryParams.get('reportId');
  
  const [customReport, setCustomReport] = useState({
    title: "Q4 2023 Innovation Analytics",
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
  
  useEffect(() => {
    async function fetchPDFReports() {
      try {
        setLoadingReports(true);
        
        const { data, error } = await supabase
          .from('pdf_reports')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setPdfReports(data || []);
      } catch (err) {
        console.error('Error fetching PDF reports:', err);
        toast({
          title: language === 'en' ? "Error loading reports" : "Erro ao carregar relatórios",
          description: err instanceof Error ? err.message : 'Unknown error',
          variant: "destructive"
        });
      } finally {
        setLoadingReports(false);
      }
    }
    
    fetchPDFReports();
  }, [language, toast]);
  
  const recentReports = [
    {
      title: "Q3 2023 Innovation Performance",
      description: "Quarterly performance report on ANI's innovation programs",
      date: "Oct 15, 2023",
      status: "completed",
      author: "Maria Silva"
    },
    {
      title: "SME Startup Ecosystem Analysis",
      description: "Analysis of the Portuguese startup ecosystem funding and performance",
      date: "Sep 28, 2023",
      status: "completed",
      author: "Carlos Mendes"
    },
    {
      title: "R&D Tax Incentives Impact Study",
      description: "Assessment of SIFIDE II program impact on corporate R&D investments",
      date: "Sep 12, 2023",
      status: "completed",
      author: "Ana Costa"
    },
    {
      title: "International Innovation Benchmarking",
      description: "Comparison of Portuguese innovation metrics against EU countries",
      date: "Aug 30, 2023",
      status: "completed",
      author: "João Almeida"
    }
  ];

  const handleGenerateReport = () => {
    toast({
      title: language === 'en' ? "Report generation initiated" : "Geração de relatório iniciada",
      description: language === 'en' 
        ? "Your custom report is being prepared. It will be available in a few minutes." 
        : "Seu relatório personalizado está sendo preparado. Estará disponível em alguns minutos.",
      duration: 5000
    });
  };

  const handleSaveTemplate = () => {
    toast({
      title: language === 'en' ? "Template saved" : "Modelo salvo",
      description: language === 'en' 
        ? `The template "${customReport.title}" has been saved successfully.` 
        : `O modelo "${customReport.title}" foi salvo com sucesso.`,
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

  const handleChartClick = (chartId: string, category: string, chartType: string) => {
    navigate(`/visualization/${category}/${chartType}/${chartId}`);
  };
  
  const handlePDFReportClick = (reportId: string) => {
    navigate(`/reports?reportId=${reportId}`);
  };

  // If reportId is present, show the detailed report view
  if (reportId) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">
            {language === 'en' ? "PDF Analysis Report" : "Relatório de Análise de PDF"}
          </h1>
          
          <Button variant="outline" onClick={() => navigate('/reports')}>
            {language === 'en' ? "Back to Reports" : "Voltar para Relatórios"}
          </Button>
        </div>
        
        <PDFReportDetails reportId={reportId} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          {language === 'en' ? "Reports & Documentation" : "Relatórios e Documentação"}
        </h1>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={language === 'en' ? "Search reports..." : "Buscar relatórios..."}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" /> 
            {language === 'en' ? "Filter" : "Filtrar"}
          </Button>
          <Button variant="default" size="sm">
            <FileText className="h-4 w-4 mr-1" /> 
            {language === 'en' ? "Generate Report" : "Gerar Relatório"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">{language === 'en' ? "Recent Reports" : "Relatórios Recentes"}</TabsTrigger>
          <TabsTrigger value="pdf">{language === 'en' ? "PDF Reports" : "Relatórios PDF"}</TabsTrigger>
          <TabsTrigger value="templates">{language === 'en' ? "Report Templates" : "Modelos de Relatório"}</TabsTrigger>
          <TabsTrigger value="scheduled">{language === 'en' ? "Scheduled Reports" : "Relatórios Agendados"}</TabsTrigger>
          <TabsTrigger value="custom">{language === 'en' ? "Custom Reports" : "Relatórios Personalizados"}</TabsTrigger>
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
                    <span>By {report.author}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-between items-center w-full">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      {language === 'en' ? "Share" : "Compartilhar"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <ReportsList searchQuery={searchQuery} />
        </TabsContent>
        
        <TabsContent value="pdf">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'en' ? "PDF Analysis Reports" : "Relatórios de Análise de PDF"}
                </CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? "Reports generated from PDF document analysis" 
                    : "Relatórios gerados a partir da análise de documentos PDF"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingReports ? (
                  <div className="flex justify-center p-4">
                    <p className="text-gray-500">
                      {language === 'en' ? "Loading reports..." : "Carregando relatórios..."}
                    </p>
                  </div>
                ) : pdfReports.length === 0 ? (
                  <div className="text-center p-6 border border-dashed rounded-lg">
                    <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <h3 className="text-lg font-medium">
                      {language === 'en' ? "No PDF reports yet" : "Nenhum relatório PDF ainda"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {language === 'en' 
                        ? "Upload a PDF in the chat to generate your first report" 
                        : "Faça upload de um PDF no chat para gerar seu primeiro relatório"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pdfReports.map((report) => (
                      <Card 
                        key={report.id} 
                        className="hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handlePDFReportClick(report.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base font-medium">{report.report_title}</CardTitle>
                            <Badge variant={report.report_status === 'completed' ? 'default' : 'outline'}>
                              {report.report_status === 'completed' 
                                ? (language === 'en' ? 'Completed' : 'Completo') 
                                : (language === 'en' ? 'Processing' : 'Processando')}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(report.created_at).toLocaleDateString()}</span>
                          </div>
                          {report.report_data?.summary && (
                            <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                              {report.report_data.summary}
                            </p>
                          )}
                        </CardContent>
                        <CardFooter className="border-t pt-2 flex justify-end">
                          <Button variant="ghost" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handlePDFReportClick(report.id);
                          }}>
                            <FileText className="h-4 w-4 mr-1" />
                            {language === 'en' ? "View" : "Visualizar"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
              <CardTitle>{language === 'en' ? "Custom Report Generator" : "Gerador de Relatórios Personalizados"}</CardTitle>
              <CardDescription>
                {language === 'en'
                  ? "Create tailored reports by selecting the data sources, metrics, and visualization options"
                  : "Crie relatórios personalizados selecionando fontes de dados, métricas e opções de visualização"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {language === 'en' ? "1. Select Data Sources" : "1. Selecione as Fontes de Dados"}
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
                          {language === 'en' ? "Funding Data" : "Dados de Financiamento"}
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
                          {language === 'en' ? "Project Metrics" : "Métricas de Projetos"}
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
                          {language === 'en' ? "Regional Data" : "Dados Regionais"}
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
                          {language === 'en' ? "Sector Analysis" : "Análise Setorial"}
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
                          {language === 'en' ? "Performance KPIs" : "KPIs de Desempenho"}
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {language === 'en' ? "2. Report Options" : "2. Opções de Relatório"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label htmlFor="report-title" className="text-sm font-medium">
                          {language === 'en' ? "Report Title" : "Título do Relatório"}
                        </label>
                        <Input
                          id="report-title"
                          placeholder={language === 'en' ? "Enter report title" : "Digite o título do relatório"}
                          value={customReport.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="date-range" className="text-sm font-medium">
                          {language === 'en' ? "Date Range" : "Período"}
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
                          {language === 'en' ? "Report Format" : "Formato do Relatório"}
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
                      {language === 'en' ? "3. Schedule Options" : "3. Opções de Agendamento"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">
                          {language === 'en' ? "Generation Type" : "Tipo de Geração"}
                        </label>
                        <div className="flex gap-2">
                          <Button 
                            variant={customReport.generationType === 'one-time' ? "default" : "outline"} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setGenerationType('one-time')}
                          >
                            <Calendar className="h-4 w-4 mr-1" /> 
                            {language === 'en' ? "One-time" : "Única"}
                          </Button>
                          <Button 
                            variant={customReport.generationType === 'recurring' ? "default" : "outline"} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setGenerationType('recurring')}
                          >
                            <Clock className="h-4 w-4 mr-1" /> 
                            {language === 'en' ? "Recurring" : "Recorrente"}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="generate-date" className="text-sm font-medium">
                          {language === 'en' ? "Generation Date" : "Data de Geração"}
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
                          {language === 'en' ? "Distribution" : "Distribuição"}
                        </label>
                        <Input
                          placeholder={language === 'en' ? "Enter email recipients" : "Digite os emails dos destinatários"}
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
                  {language === 'en' ? "Save Template" : "Salvar Modelo"}
                </Button>
                <Button onClick={handleGenerateReport}>
                  {language === 'en' ? "Generate Report" : "Gerar Relatório"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
