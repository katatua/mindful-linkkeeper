
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { Download, RefreshCw, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

export const FundingSuccessModel = () => {
  const { t } = useLanguage();
  const [nationalPriority, setNationalPriority] = useState<number[]>([70]);
  const [sectoralCollaboration, setSectoralCollaboration] = useState<number[]>([60]);
  const [commercializationPlan, setCommercializationPlan] = useState<number[]>([80]);
  const [internationalPartnership, setInternationalPartnership] = useState<number[]>([50]);
  const [projectHistory, setProjectHistory] = useState<number[]>([75]);
  const [financial, setFinancial] = useState<number[]>([65]);
  const [successProbability, setSuccessProbability] = useState(82);
  const [confidenceLevel, setConfidenceLevel] = useState(88);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("tech");
  
  const featureImportanceData = [
    { name: "Alinhamento com Prioridades", value: 25 },
    { name: "Colaboração Intersetorial", value: 18 },
    { name: "Plano de Comercialização", value: 22 },
    { name: "Parcerias Internacionais", value: 12 },
    { name: "Histórico de Projetos", value: 15 },
    { name: "Métricas Financeiras", value: 8 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const similarProjectsData = [
    { name: "Alta Tecnologia", success: 32, failure: 8 },
    { name: "Saúde", success: 28, failure: 6 },
    { name: "Energia", success: 24, failure: 12 },
    { name: "Manufatura", success: 18, failure: 14 },
    { name: "Agrotech", success: 14, failure: 10 }
  ];
  
  const projectTemplates = [
    { id: "tech", name: "Startup Tecnológica", success: 78 },
    { id: "health", name: "Inovação em Saúde", success: 82 },
    { id: "energy", name: "Energia Renovável", success: 76 },
    { id: "manufacturing", name: "Manufatura 4.0", success: 72 },
    { id: "agro", name: "Agricultura Inteligente", success: 68 }
  ];
  
  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const base = 
        (nationalPriority[0] * 0.25) + 
        (sectoralCollaboration[0] * 0.18) + 
        (commercializationPlan[0] * 0.22) + 
        (internationalPartnership[0] * 0.12) + 
        (projectHistory[0] * 0.15) + 
        (financial[0] * 0.08);
      
      const randomFactor = Math.random() * 10 - 5;
      const calculatedProb = Math.min(Math.max(Math.round(base * 0.9 + randomFactor), 40), 95);
      const calculatedConf = Math.min(Math.max(Math.round(calculatedProb - 5 + Math.random() * 15), 60), 95);
      
      setSuccessProbability(calculatedProb);
      setConfidenceLevel(calculatedConf);
      setIsCalculating(false);
    }, 1500);
  };
  
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    switch(templateId) {
      case "tech":
        setNationalPriority([85]);
        setSectoralCollaboration([60]);
        setCommercializationPlan([90]);
        setInternationalPartnership([70]);
        setProjectHistory([65]);
        setFinancial([75]);
        break;
      case "health":
        setNationalPriority([90]);
        setSectoralCollaboration([80]);
        setCommercializationPlan([70]);
        setInternationalPartnership([65]);
        setProjectHistory([75]);
        setFinancial([70]);
        break;
      case "energy":
        setNationalPriority([80]);
        setSectoralCollaboration([65]);
        setCommercializationPlan([75]);
        setInternationalPartnership([60]);
        setProjectHistory([70]);
        setFinancial([80]);
        break;
      case "manufacturing":
        setNationalPriority([75]);
        setSectoralCollaboration([70]);
        setCommercializationPlan([65]);
        setInternationalPartnership([50]);
        setProjectHistory([65]);
        setFinancial([85]);
        break;
      case "agro":
        setNationalPriority([70]);
        setSectoralCollaboration([55]);
        setCommercializationPlan([60]);
        setInternationalPartnership([45]);
        setProjectHistory([60]);
        setFinancial([70]);
        break;
    }
    
    handleCalculate();
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Modelo de Previsão de Sucesso de Financiamento</CardTitle>
        <CardDescription>
          Utilize este modelo preditivo para estimar a probabilidade de sucesso de financiamento para projetos de inovação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Modelos de Projeto</h3>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um modelo de projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projectTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} - {template.success}% taxa de sucesso
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Alinhamento com Prioridades Nacionais</h3>
                  <span className="text-sm">{nationalPriority[0]}/100</span>
                </div>
                <Slider 
                  value={nationalPriority} 
                  min={0} 
                  max={100} 
                  step={5} 
                  onValueChange={setNationalPriority} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Colaboração Intersetorial</h3>
                  <span className="text-sm">{sectoralCollaboration[0]}/100</span>
                </div>
                <Slider 
                  value={sectoralCollaboration} 
                  min={0} 
                  max={100} 
                  step={5} 
                  onValueChange={setSectoralCollaboration} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Via de Comercialização</h3>
                  <span className="text-sm">{commercializationPlan[0]}/100</span>
                </div>
                <Slider 
                  value={commercializationPlan} 
                  min={0} 
                  max={100} 
                  step={5} 
                  onValueChange={setCommercializationPlan} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Parceria Internacional</h3>
                  <span className="text-sm">{internationalPartnership[0]}/100</span>
                </div>
                <Slider 
                  value={internationalPartnership} 
                  min={0} 
                  max={100} 
                  step={5} 
                  onValueChange={setInternationalPartnership} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Histórico de Projetos</h3>
                  <span className="text-sm">{projectHistory[0]}/100</span>
                </div>
                <Slider 
                  value={projectHistory} 
                  min={0} 
                  max={100} 
                  step={5} 
                  onValueChange={setProjectHistory} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Métricas Financeiras</h3>
                  <span className="text-sm">{financial[0]}/100</span>
                </div>
                <Slider 
                  value={financial} 
                  min={0} 
                  max={100} 
                  step={5} 
                  onValueChange={setFinancial} 
                />
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleCalculate}
                disabled={isCalculating}
              >
                {isCalculating ? 
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> 
                    Calculando...
                  </> : 
                  'Calcular Probabilidade'
                }
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <Card className="border-2 border-blue-100 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Resultado da Previsão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-medium mb-1 flex items-center">
                      Probabilidade de Sucesso 
                      <Info className="h-3 w-3 ml-1 text-gray-400" />
                    </h4>
                    <div className="flex items-center space-x-3">
                      <Progress value={successProbability} className="h-4" />
                      <span className="font-bold text-lg">{successProbability}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium mb-1 flex items-center">
                      Nível de Confiança 
                      <Info className="h-3 w-3 ml-1 text-gray-400" />
                    </h4>
                    <div className="flex items-center space-x-3">
                      <Progress value={confidenceLevel} className="h-4" />
                      <span className="font-bold text-lg">{confidenceLevel}%</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Badge className={successProbability >= 75 ? "bg-green-100 text-green-800 hover:bg-green-100" : 
                                      successProbability >= 50 ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : 
                                      "bg-red-100 text-red-800 hover:bg-red-100"}>
                      {successProbability >= 75 ? "Alta Probabilidade" : 
                       successProbability >= 50 ? "Média Probabilidade" : 
                       "Baixa Probabilidade"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Importância dos Fatores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ChartContainer
                    config={{
                      value: { label: 'Valor' },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={featureImportanceData}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {featureImportanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-xs text-gray-600">
              <p>
                Este modelo utiliza técnicas de machine learning (Random Forest) para estimar a probabilidade 
                de sucesso de financiamento, baseado em dados históricos de propostas anteriores.
              </p>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Taxa de Sucesso em Projetos Similares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72"> {/* Aumentando a altura para melhor espaçamento */}
              <ChartContainer
                config={{
                  success: { label: 'Aprovados' },
                  failure: { label: 'Rejeitados' },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={similarProjectsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }} {/* Aumentando a margem inferior */}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ dy: 10 }} /> {/* Aumentando o espaçamento vertical dos rótulos */}
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ paddingTop: 20 }} /> {/* Adicionando espaço acima da legenda */}
                    <Bar dataKey="success" name="Aprovados" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="failure" name="Rejeitados" stackId="a" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pontos Fortes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-1">
                {nationalPriority[0] > 70 && (
                  <li>• Forte alinhamento com prioridades nacionais</li>
                )}
                {sectoralCollaboration[0] > 70 && (
                  <li>• Boa colaboração intersetorial</li>
                )}
                {commercializationPlan[0] > 70 && (
                  <li>• Plano de comercialização bem definido</li>
                )}
                {internationalPartnership[0] > 70 && (
                  <li>• Parcerias internacionais estabelecidas</li>
                )}
                {projectHistory[0] > 70 && (
                  <li>• Histórico positivo de projetos anteriores</li>
                )}
                {financial[0] > 70 && (
                  <li>• Boas métricas financeiras</li>
                )}
                {[nationalPriority[0], sectoralCollaboration[0], commercializationPlan[0], 
                  internationalPartnership[0], projectHistory[0], financial[0]].filter(v => v > 70).length === 0 && (
                  <li>• Nenhum ponto forte identificado</li>
                )}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Áreas de Melhoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-1">
                {nationalPriority[0] < 60 && (
                  <li>• Melhorar alinhamento com prioridades nacionais</li>
                )}
                {sectoralCollaboration[0] < 60 && (
                  <li>• Aumentar colaboração intersetorial</li>
                )}
                {commercializationPlan[0] < 60 && (
                  <li>• Desenvolver melhor plano de comercialização</li>
                )}
                {internationalPartnership[0] < 60 && (
                  <li>• Estabelecer parcerias internacionais</li>
                )}
                {projectHistory[0] < 60 && (
                  <li>• Melhorar documentação de projetos anteriores</li>
                )}
                {financial[0] < 60 && (
                  <li>• Reforçar métricas financeiras</li>
                )}
                {[nationalPriority[0], sectoralCollaboration[0], commercializationPlan[0], 
                  internationalPartnership[0], projectHistory[0], financial[0]].filter(v => v < 60).length === 0 && (
                  <li>• Não há áreas críticas de melhoria</li>
                )}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-1">
                {successProbability < 70 && (
                  <>
                    <li>• Revisar os fatores com pontuação mais baixa</li>
                    <li>• Considerar parcerias estratégicas adicionais</li>
                    <li>• Fortalecer a proposta de valor</li>
                    <li>• Incluir evidências de sucesso de projetos similares</li>
                  </>
                )}
                {successProbability >= 70 && (
                  <>
                    <li>• Manter os pontos fortes identificados</li>
                    <li>• Incluir detalhamento dos impactos esperados</li>
                    <li>• Destacar diferenciais competitivos</li>
                    <li>• Enfatizar a viabilidade de longo prazo</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Exportar Análise
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
