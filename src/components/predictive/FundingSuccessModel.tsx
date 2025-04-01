
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  BarChart,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle
} from "lucide-react";

// Mock data for the model
const modelFeatures = {
  name: "Previsão de Sucesso de Financiamento",
  type: "Regressão Logística / Random Forest",
  accuracy: 0.86,
  precision: 0.83,
  recall: 0.79,
  f1Score: 0.81,
  lastUpdated: "2023-11-15",
  featuresImportance: [
    { name: "Alinhamento com prioridades nacionais", importance: 0.28 },
    { name: "Colaboração intersetorial", importance: 0.22 },
    { name: "Via de comercialização", importance: 0.17 },
    { name: "Parcerias internacionais", importance: 0.13 },
    { name: "Histórico de projetos", importance: 0.11 },
    { name: "Métricas financeiras", importance: 0.09 }
  ]
};

// Sample project templates
const projectTemplates = [
  { 
    id: 1,
    name: "Projeto de Tecnologia Verde",
    description: "Pesquisa em tecnologias sustentáveis para redução de carbono", 
    values: {
      nationalPriorities: 87,
      sectorialCollaboration: 72,
      commercialization: 65,
      internationalPartnerships: 60,
      previousProjects: 78,
      financialMetrics: 69
    },
    successProbability: 0.83
  },
  {
    id: 2,
    name: "Iniciativa de IA na Saúde",
    description: "Aplicação de inteligência artificial para diagnósticos médicos",
    values: {
      nationalPriorities: 92,
      sectorialCollaboration: 85,
      commercialization: 78,
      internationalPartnerships: 65,
      previousProjects: 50,
      financialMetrics: 72
    },
    successProbability: 0.88
  },
  {
    id: 3,
    name: "Transformação Digital Industrial",
    description: "Implementação de tecnologias 4.0 em manufatura",
    values: {
      nationalPriorities: 75,
      sectorialCollaboration: 80,
      commercialization: 83,
      internationalPartnerships: 45,
      previousProjects: 60,
      financialMetrics: 65
    },
    successProbability: 0.71
  }
];

export const FundingSuccessModel = () => {
  // State for project input values
  const [inputValues, setInputValues] = useState({
    nationalPriorities: 50,
    sectorialCollaboration: 50,
    commercialization: 50,
    internationalPartnerships: 50,
    previousProjects: 50,
    financialMetrics: 50
  });
  
  // State for the model output
  const [successProbability, setSuccessProbability] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  
  // Update slider values
  const handleSliderChange = (name: string, value: number[]) => {
    setInputValues({
      ...inputValues,
      [name]: value[0]
    });
  };
  
  // Load a template project
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    
    if (value) {
      const templateIndex = parseInt(value) - 1;
      if (templateIndex >= 0 && templateIndex < projectTemplates.length) {
        const template = projectTemplates[templateIndex];
        setInputValues(template.values);
        setSuccessProbability(null); // Reset prediction
      }
    }
  };
  
  // Run the prediction model
  const runPrediction = () => {
    setIsLoading(true);
    
    // Simulate model processing time
    setTimeout(() => {
      // Simple weighted average for demo purposes
      const weights = modelFeatures.featuresImportance.map(f => f.importance);
      const values = [
        inputValues.nationalPriorities / 100,
        inputValues.sectorialCollaboration / 100,
        inputValues.commercialization / 100,
        inputValues.internationalPartnerships / 100,
        inputValues.previousProjects / 100,
        inputValues.financialMetrics / 100
      ];
      
      // Calculate weighted probability
      let probability = 0;
      for (let i = 0; i < weights.length; i++) {
        probability += weights[i] * values[i];
      }
      
      // Add some randomness for demo
      probability = Math.min(1, Math.max(0, probability + (Math.random() * 0.1 - 0.05)));
      
      setSuccessProbability(probability);
      setIsLoading(false);
    }, 1500);
  };
  
  // Get status based on probability
  const getStatusBadge = (probability: number) => {
    if (probability >= 0.75) {
      return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Alta Probabilidade</Badge>;
    } else if (probability >= 0.5) {
      return <Badge className="bg-yellow-500"><Info className="h-3 w-3 mr-1" /> Probabilidade Média</Badge>;
    } else {
      return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" /> Baixa Probabilidade</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{modelFeatures.name}</CardTitle>
              <CardDescription>
                Avalie a probabilidade de uma proposta receber financiamento baseado em diversos fatores chave
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> {modelFeatures.type}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="w-full md:w-2/3">
              <Label htmlFor="template">Escolha um modelo de projeto ou personalize manualmente:</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger id="template" className="mt-1">
                  <SelectValue placeholder="Selecione um modelo de projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Personalizado</SelectItem>
                  {projectTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedTemplate && (
                <p className="text-sm text-muted-foreground mt-2">
                  {projectTemplates[parseInt(selectedTemplate) - 1]?.description}
                </p>
              )}
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center border rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-medium mb-1">Precisão do Modelo</p>
              <div className="text-2xl font-bold">{(modelFeatures.accuracy * 100).toFixed(1)}%</div>
              <div className="w-full mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>F1-Score</span>
                  <span>{modelFeatures.f1Score.toFixed(2)}</span>
                </div>
                <Progress value={modelFeatures.f1Score * 100} className="h-1" />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Parameters */}
            <div className="space-y-6">
              {/* National Priorities Alignment */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="national-priorities">Alinhamento com prioridades nacionais</Label>
                  <span className="text-sm font-medium">{inputValues.nationalPriorities}%</span>
                </div>
                <Slider 
                  id="national-priorities"
                  min={0} 
                  max={100} 
                  step={1} 
                  value={[inputValues.nationalPriorities]} 
                  onValueChange={(value) => handleSliderChange('nationalPriorities', value)}
                />
                <p className="text-xs text-muted-foreground">
                  Quão bem o projeto se alinha com as prioridades estratégicas nacionais
                </p>
              </div>
              
              {/* Sectorial Collaboration */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="sectorial-collaboration">Colaboração intersetorial</Label>
                  <span className="text-sm font-medium">{inputValues.sectorialCollaboration}%</span>
                </div>
                <Slider 
                  id="sectorial-collaboration"
                  min={0} 
                  max={100} 
                  step={1} 
                  value={[inputValues.sectorialCollaboration]} 
                  onValueChange={(value) => handleSliderChange('sectorialCollaboration', value)}
                />
                <p className="text-xs text-muted-foreground">
                  Nível de colaboração entre diferentes setores (universidades, empresas, governo)
                </p>
              </div>
              
              {/* Commercialization Path */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="commercialization">Via de comercialização</Label>
                  <span className="text-sm font-medium">{inputValues.commercialization}%</span>
                </div>
                <Slider 
                  id="commercialization"
                  min={0} 
                  max={100} 
                  step={1} 
                  value={[inputValues.commercialization]} 
                  onValueChange={(value) => handleSliderChange('commercialization', value)}
                />
                <p className="text-xs text-muted-foreground">
                  Clareza do plano de comercialização e tempo estimado para chegar ao mercado
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* International Partnerships */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="international-partnerships">Parcerias internacionais</Label>
                  <span className="text-sm font-medium">{inputValues.internationalPartnerships}%</span>
                </div>
                <Slider 
                  id="international-partnerships"
                  min={0} 
                  max={100} 
                  step={1} 
                  value={[inputValues.internationalPartnerships]} 
                  onValueChange={(value) => handleSliderChange('internationalPartnerships', value)}
                />
                <p className="text-xs text-muted-foreground">
                  Presença de parceiros estrangeiros e acordos internacionais
                </p>
              </div>
              
              {/* Previous Projects */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="previous-projects">Histórico de projetos</Label>
                  <span className="text-sm font-medium">{inputValues.previousProjects}%</span>
                </div>
                <Slider 
                  id="previous-projects"
                  min={0} 
                  max={100} 
                  step={1} 
                  value={[inputValues.previousProjects]} 
                  onValueChange={(value) => handleSliderChange('previousProjects', value)}
                />
                <p className="text-xs text-muted-foreground">
                  Histórico de sucesso em projetos anteriores e resultados gerados
                </p>
              </div>
              
              {/* Financial Metrics */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="financial-metrics">Métricas financeiras</Label>
                  <span className="text-sm font-medium">{inputValues.financialMetrics}%</span>
                </div>
                <Slider 
                  id="financial-metrics"
                  min={0} 
                  max={100} 
                  step={1} 
                  value={[inputValues.financialMetrics]} 
                  onValueChange={(value) => handleSliderChange('financialMetrics', value)}
                />
                <p className="text-xs text-muted-foreground">
                  Indicadores como ROI esperado, contrapartida financeira e fluxo de caixa projetado
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Button 
            className="w-full md:w-auto" 
            onClick={runPrediction}
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "Executar Previsão"}
          </Button>
          
          {successProbability !== null && (
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="text-sm font-medium">Probabilidade de sucesso:</div>
              <div className="flex items-center gap-2">
                <div className="text-xl font-bold">
                  {(successProbability * 100).toFixed(1)}%
                </div>
                {getStatusBadge(successProbability)}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Importância dos Fatores</CardTitle>
          <CardDescription>
            Influência relativa de cada fator no modelo de previsão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {modelFeatures.featuresImportance.map(feature => (
              <div key={feature.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{feature.name}</span>
                  <span className="font-medium">{(feature.importance * 100).toFixed(1)}%</span>
                </div>
                <Progress value={feature.importance * 100} className="h-2" />
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium">Nota sobre o modelo</p>
              <p className="mt-1">
                Este modelo é baseado em dados históricos de propostas anteriores. A importância dos fatores pode variar conforme a linha de financiamento específica e o período de avaliação.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
