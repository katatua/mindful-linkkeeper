import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { 
  saveReport, 
  ReportTopic, 
  generateReportTopics, 
  generateTopicContent, 
  assembleFullReport 
} from "@/utils/reportService";

export const ReportGenerator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [topic, setTopic] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [topics, setTopics] = useState<ReportTopic[]>([]);
  const [topicContents, setTopicContents] = useState<string[]>([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(-1);
  
  const resetState = () => {
    setGenerationProgress(0);
    setCurrentStep("");
    setTopics([]);
    setTopicContents([]);
    setCurrentTopicIndex(-1);
  };

  const handleGenerate = async () => {
    console.log("Generate button clicked");
    if (!topic.trim()) {
      toast({
        title: language === 'pt' ? "Tópico necessário" : "Topic required",
        description: language === 'pt' ? 
          "Por favor, forneça um tópico para o relatório" : 
          "Please provide a topic for the report",
        variant: "destructive"
      });
      return;
    }
    
    setGenerating(true);
    resetState();
    
    try {
      console.log("Starting report generation process");
      // Step 1: Generate topics
      setCurrentStep(language === 'pt' ? "Gerando estrutura do relatório..." : "Generating report structure...");
      setGenerationProgress(10);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Generating topics for:", topic);
      
      const generatedTopics = generateReportTopics(topic, language);
      console.log("Generated topics:", generatedTopics);
      setTopics(generatedTopics);
      setGenerationProgress(25);
      setCurrentTopicIndex(0);
      
      // Step 2: Generate content for each topic
      const contents: string[] = [];
      
      for (let i = 0; i < generatedTopics.length; i++) {
        const topicItem = generatedTopics[i];
        setCurrentTopicIndex(i);
        setCurrentStep(
          language === 'pt' 
            ? `Gerando conteúdo para: ${topicItem.title}...` 
            : `Generating content for: ${topicItem.title}...`
        );
        
        console.log("Generating content for topic:", topicItem.title);
        // Simulate API delay for each topic
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const topicContent = generateTopicContent(topicItem, topic, language);
        contents.push(topicContent);
        console.log("Generated content length:", topicContent.length);
        
        // Update progress - distribute remaining 65% across all topics
        const progressIncrement = 65 / generatedTopics.length;
        setGenerationProgress(25 + (i + 1) * progressIncrement);
        
        // Update the topic contents state for UI updates
        setTopicContents([...contents]);
      }
      
      // Step 3: Assemble the full report
      setCurrentStep(language === 'pt' ? "Finalizando relatório..." : "Finalizing report...");
      setGenerationProgress(90);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const title = language === 'pt' 
        ? `Relatório sobre ${topic} - ${new Date().toLocaleDateString('pt-BR')}` 
        : `Report on ${topic} - ${new Date().toLocaleDateString()}`;
      
      console.log("Assembling full report with title:", title);
      const fullReport = assembleFullReport(title, generatedTopics, contents);
      console.log("Full report assembled, length:", fullReport.length);
      
      // Generate chart data - ensure we have diverse visualizations
      const chartData = {
        financingData: [
          { year: "2019", value: Math.floor(Math.random() * 400) + 100 },
          { year: "2020", value: Math.floor(Math.random() * 400) + 100 },
          { year: "2021", value: Math.floor(Math.random() * 400) + 100 },
          { year: "2022", value: Math.floor(Math.random() * 400) + 100 },
          { year: "2023", value: Math.floor(Math.random() * 400) + 100 }
        ],
        sectorDistribution: [
          { name: "Technology", value: Math.floor(Math.random() * 400) + 100 },
          { name: "Healthcare", value: Math.floor(Math.random() * 400) + 100 },
          { name: "Energy", value: Math.floor(Math.random() * 400) + 100 },
          { name: "Manufacturing", value: Math.floor(Math.random() * 400) + 100 },
          { name: "Services", value: Math.floor(Math.random() * 400) + 100 }
        ]
      };
      
      // Save the report
      console.log("Saving report to database");
      try {
        const reportData = {
          title,
          content: fullReport,
          language,
          user_id: null,
          metadata: {
            topic,
            generationMethod: "step-by-step",
            additionalInstructions: additionalInstructions || null
          },
          chart_data: chartData,
          report_type: "AI Generated",
          file_url: null
        };
        
        console.log("Report data to save:", reportData);
        
        const savedReport = await saveReport(reportData);
        
        console.log("Report saved successfully with ID:", savedReport.id);
        setGenerationProgress(100);
        setCurrentStep(language === 'pt' ? "Relatório concluído!" : "Report completed!");
        
        toast({
          title: language === 'pt' ? "Relatório gerado com sucesso!" : "Report generated successfully!",
          description: language === 'pt' 
            ? "Seu relatório foi criado e está pronto para visualização" 
            : "Your report has been created and is ready for viewing"
        });
        
        // Save the report to session storage for direct access
        sessionStorage.setItem('currentReport', JSON.stringify(savedReport));
        
        // Navigate to the report detail page
        setTimeout(() => {
          console.log("Navigating to report detail page:", savedReport.id);
          navigate(`/ai-report/${savedReport.id}`);
        }, 1000);
      } catch (saveError) {
        console.error("Error saving report:", saveError);
        
        // Handle the case where database save fails but we still have the report
        const devReport = {
          id: 'dev-report-' + Date.now(),
          title,
          content: fullReport,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: null,
          language,
          metadata: {
            topic,
            generationMethod: "step-by-step",
            additionalInstructions: additionalInstructions || null
          },
          chart_data: chartData,
          report_type: "AI Generated",
          file_url: null
        };
        
        // Save to session storage for viewing
        sessionStorage.setItem('currentReport', JSON.stringify(devReport));
        
        // Show a warning but still allow viewing the report
        toast({
          title: language === 'pt' ? "Relatório gerado com limitações" : "Report generated with limitations",
          description: language === 'pt' 
            ? "O relatório foi gerado mas não pôde ser salvo no banco de dados. Você ainda pode visualizá-lo." 
            : "The report was generated but couldn't be saved to the database. You can still view it.",
          variant: "warning"
        });
        
        setTimeout(() => {
          navigate(`/ai-report/${devReport.id}`);
        }, 1000);
      }
      
    } catch (error) {
      console.error("Error generating report:", error);
      
      toast({
        title: language === 'pt' ? "Erro ao gerar relatório" : "Error generating report",
        description: language === 'pt' 
          ? "Ocorreu um erro ao gerar o relatório. Por favor, tente novamente." 
          : "An error occurred while generating the report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {language === 'pt' ? "Gerador de Relatórios com IA" : "AI Report Generator"}
        </CardTitle>
        <CardDescription>
          {language === 'pt' 
            ? "Gere relatórios detalhados com visualizações usando IA" 
            : "Generate detailed reports with visualizations using AI"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!generating ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === 'pt' ? "Tópico do Relatório" : "Report Topic"}
              </label>
              <Input
                placeholder={language === 'pt' 
                  ? "Ex: Financiamento de Inovação em Portugal" 
                  : "E.g., Innovation Funding in Portugal"}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === 'pt' ? "Instruções Adicionais (opcional)" : "Additional Instructions (optional)"}
              </label>
              <Textarea
                placeholder={language === 'pt' 
                  ? "Adicione instruções específicas ou requisitos para seu relatório" 
                  : "Add specific instructions or requirements for your report"}
                rows={4}
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleGenerate}
              disabled={!topic.trim()}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {language === 'pt' ? "Gerar Relatório" : "Generate Report"}
            </Button>
          </>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {currentStep}
                </span>
                <span className="text-sm text-gray-500">
                  {generationProgress}%
                </span>
              </div>
              <Progress value={generationProgress} />
            </div>
            
            {topics.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">
                  {language === 'pt' ? "Estrutura do Relatório" : "Report Structure"}
                </h3>
                <div className="space-y-2">
                  {topics.map((topicItem, index) => (
                    <div key={index} className="flex items-center p-2 rounded border">
                      {index === currentTopicIndex ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-500" />
                      ) : index < currentTopicIndex ? (
                        <FileText className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                      )}
                      <div>
                        <p className={`font-medium ${index === currentTopicIndex ? 'text-blue-500' : index < currentTopicIndex ? 'text-green-500' : 'text-gray-400'}`}>
                          {topicItem.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {topicItem.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
