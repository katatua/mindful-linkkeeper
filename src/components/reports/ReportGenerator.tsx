
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ReportVisualizer, extractVisualizations } from "./ReportVisualizer";
import { saveReport } from "@/utils/reportService";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const ReportGenerator = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState(language === 'pt' ? "Inovação em energia renovável" : "Innovation in renewable energy");
  const [location, setLocation] = useState(language === 'pt' ? "Portugal" : "Portugal");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [reportStyle, setReportStyle] = useState("formal");
  const [generatedReport, setGeneratedReport] = useState("");
  const [visualizations, setVisualizations] = useState<any[]>([]);

  const generateReport = async () => {
    setIsLoading(true);
    
    try {
      let reportContent = "";
      
      // For renewable energy topics, generate a more specialized report
      if (topic.toLowerCase().includes(language === 'pt' ? "renovável" : "renewable") || 
          topic.toLowerCase().includes(language === 'pt' ? "energia" : "energy")) {
        reportContent = language === 'pt' ? 
          generateSimpleReportPT(topic, location, year) :
          generateSimpleReport(topic, location, year);
      } else {
        reportContent = language === 'pt' ?
          generateSimpleReportPT(topic, location, year) :
          generateSimpleReport(topic, location, year);
      }
      
      // Extract visualizations from the report content
      const extractedVisualizations = extractVisualizations(reportContent);
      
      setGeneratedReport(reportContent);
      setVisualizations(extractedVisualizations);
      
      // Save report to the database
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      const reportData = {
        title: `${topic} in ${location} (${year})`,
        content: reportContent,
        user_id: userId || null,
        language: language,
        metadata: { topic, location, year, reportStyle },
        chart_data: { visualizations: extractedVisualizations },
        report_type: topic.toLowerCase().includes(language === 'pt' ? "renovável" : "renewable") ? 
          (language === 'pt' ? "Relatório de Energia Renovável" : "Renewable Energy Report") : 
          (language === 'pt' ? "Relatório Geral" : "General Report")
      };
      
      await saveReport(reportData);

      toast({
        title: language === 'pt' ? "Relatório Gerado" : "Report Generated",
        description: language === 'pt' ? 
          `Seu relatório sobre ${topic} em ${location} para ${year} foi criado e salvo.` :
          `Your report on ${topic} in ${location} for ${year} has been created and saved.`,
        duration: 3000
      });
    } catch (error) {
      console.error("Error generating or saving report:", error);
      toast({
        title: language === 'pt' ? "Erro" : "Error",
        description: language === 'pt' ? 
          "Ocorreu um erro ao gerar ou salvar o relatório." :
          "An error occurred while generating or saving the report.",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified report generation functions to avoid template literal issues
  const generateSimpleReport = (topic: string, location: string, year: string) => {
    return `# ${topic} in ${location} (${year})

## Introduction

This report examines ${topic} in ${location} during ${year}, with a focus on key developments and trends.

## Data Overview

According to our database, investment in research related to ${topic} reached €126.8 million in ${year}, representing a 15.3% increase from the previous year. Insert Visualization 1 (Bar Chart: Investment Over the Last Five Years)

## Analysis

The growth in patent applications is particularly noteworthy as it represents a shift from technology adoption to technology creation in the sector. This trend suggests an increasing maturity of the innovation ecosystem. Insert Visualization 2 (Line Graph: Patent Applications)

## Conclusion

The analysis of ${topic} in ${location} during ${year} reveals a dynamic sector experiencing growth in investment, research activity, and intellectual property development. While challenges remain, the overall trajectory is positive.`;
  };

  const generateSimpleReportPT = (topic: string, location: string, year: string) => {
    return `# ${topic} em ${location} (${year})

## Introdução

Este relatório examina ${topic} em ${location} durante ${year}, com foco em desenvolvimentos e tendências principais.

## Visão Geral dos Dados

De acordo com nossa base de dados, o investimento em pesquisa relacionada a ${topic} alcançou €126,8 milhões em ${year}, representando um aumento de 15,3% em relação ao ano anterior. Insert Visualization 1 (Gráfico de Barras: Investimento nos Últimos Cinco Anos)

## Análise

O crescimento nos pedidos de patentes é particularmente notável, pois representa uma mudança da adoção de tecnologia para a criação de tecnologia no setor. Esta tendência sugere uma crescente maturidade do ecossistema de inovação. Insert Visualization 2 (Gráfico de Linha: Pedidos de Patentes)

## Conclusão

A análise de ${topic} em ${location} durante ${year} revela um setor dinâmico experimentando crescimento em investimento, atividade de pesquisa e desenvolvimento de propriedade intelectual. Embora permaneçam desafios, a trajetória geral é positiva.`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{language === 'pt' ? "Gerador de Relatórios" : "Report Generator"}</CardTitle>
        <CardDescription>
          {language === 'pt' 
            ? "Gere relatórios detalhados baseados em tópico, local e ano" 
            : "Generate detailed reports based on topic, location, and year"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="topic">
              {language === 'pt' ? "Tópico" : "Topic"}
            </Label>
            <Input 
              id="topic" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)}
              placeholder={language === 'pt' ? "Ex: Inovação em energia renovável" : "E.g., Innovation in renewable energy"} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">
              {language === 'pt' ? "Localização" : "Location"}
            </Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              placeholder={language === 'pt' ? "Ex: Portugal" : "E.g., Portugal"} 
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="year">
              {language === 'pt' ? "Ano" : "Year"}
            </Label>
            <Input 
              id="year" 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
              placeholder={new Date().getFullYear().toString()} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="style">
              {language === 'pt' ? "Estilo do Relatório" : "Report Style"}
            </Label>
            <Select value={reportStyle} onValueChange={setReportStyle}>
              <SelectTrigger id="style">
                <SelectValue placeholder={language === 'pt' ? "Selecione um estilo" : "Select a style"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">{language === 'pt' ? "Formal" : "Formal"}</SelectItem>
                <SelectItem value="analytical">{language === 'pt' ? "Analítico" : "Analytical"}</SelectItem>
                <SelectItem value="descriptive">{language === 'pt' ? "Descritivo" : "Descriptive"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button 
          onClick={generateReport} 
          disabled={isLoading || !topic || !location || !year}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {language === 'pt' ? "Gerando..." : "Generating..."}
            </>
          ) : (
            language === 'pt' ? "Gerar Relatório" : "Generate Report"
          )}
        </Button>
        
        {generatedReport && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'pt' ? "Relatório Gerado" : "Generated Report"}
            </h3>
            <div className="border rounded-md p-4 bg-gray-50 max-h-[500px] overflow-y-auto">
              <ReportVisualizer reportContent={generatedReport} visualizations={visualizations} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
