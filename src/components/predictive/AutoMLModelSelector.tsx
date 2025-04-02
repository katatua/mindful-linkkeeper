import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BrainCircuit, Gauge, ArrowUpRight, Eye, ChevronDown } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Sample data for model performance
const modelPerformanceData = [
  { epoch: 1, denseLoss: 0.42, lstmLoss: 0.45, transformerLoss: 0.48 },
  { epoch: 2, denseLoss: 0.38, lstmLoss: 0.39, transformerLoss: 0.41 },
  { epoch: 5, denseLoss: 0.32, lstmLoss: 0.31, transformerLoss: 0.32 },
  { epoch: 10, denseLoss: 0.28, lstmLoss: 0.25, transformerLoss: 0.24 },
  { epoch: 15, denseLoss: 0.25, lstmLoss: 0.21, transformerLoss: 0.18 },
  { epoch: 20, denseLoss: 0.23, lstmLoss: 0.18, transformerLoss: 0.15 },
  { epoch: 25, denseLoss: 0.22, lstmLoss: 0.16, transformerLoss: 0.13 },
  { epoch: 30, denseLoss: 0.21, lstmLoss: 0.15, transformerLoss: 0.11 },
];

export const AutoMLModelSelector = () => {
  const { t } = useLanguage();
  const [selectedModel, setSelectedModel] = useState("transformer");
  const [complexity, setComplexity] = useState(50);
  const [trainingEpochs, setTrainingEpochs] = useState(20);
  const [isRunning, setIsRunning] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("default");
  
  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };
  
  const handleComplexityChange = (value: number[]) => {
    setComplexity(value[0]);
  };
  
  const handleEpochsChange = (value: number[]) => {
    setTrainingEpochs(value[0]);
  };

  const handleRunAutoML = () => {
    setIsRunning(true);
    // Show a loading toast
    toast({
      title: "AutoML em execução",
      description: `Executando ${selectedModel} com complexidade ${complexity} e ${trainingEpochs} épocas...`,
      variant: "default", // This needs to be "default" instead of "success"
    });
    
    // Simulate a process running
    setTimeout(() => {
      setIsRunning(false);
      // Show a success toast when done
      toast({
        title: "AutoML concluído",
        description: "Processo de treinamento finalizado com sucesso!",
        variant: "default", // This needs to be "default" instead of "success"
      });
    }, 3000);
  };
  
  const handleViewChange = (view: string) => {
    setSelectedView(view);
  };
  
  const getModelFullName = () => {
    switch(selectedModel) {
      case 'dense': return 'Redes Densas (DNN)';
      case 'lstm': return 'LSTM (Long Short-Term Memory)';
      case 'transformer': return 'Transformer';
      default: return selectedModel;
    }
  };

  return (
    <Card className="border rounded-lg">
      <CardHeader className="bg-slate-50">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BrainCircuit className="h-5 w-5 text-purple-600" />
            {t('predictive.automl.title') || "Seleção Automática de Modelos (AutoML)"}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                Visualização
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-white">
              <DropdownMenuItem onClick={() => handleViewChange("default")}>
                Padrão
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange("advanced")}>
                Avançado
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange("simple")}>
                Simplificado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Tipo de Modelo</label>
            <Select defaultValue={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dense">Redes Densas (DNN)</SelectItem>
                <SelectItem value="lstm">LSTM (Long Short-Term Memory)</SelectItem>
                <SelectItem value="transformer">Transformer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Complexidade do Modelo</label>
            <div className="pt-2 px-1">
              <Slider 
                defaultValue={[complexity]} 
                max={100} 
                min={0} 
                step={10} 
                onValueChange={handleComplexityChange}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Simples</span>
                <span>Complexo</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Épocas de Treinamento</label>
            <div className="pt-2 px-1">
              <Slider 
                defaultValue={[trainingEpochs]} 
                max={30} 
                min={1} 
                step={1} 
                onValueChange={handleEpochsChange}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>{trainingEpochs}</span>
                <span>30</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-md">
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <Gauge className="h-4 w-4 mr-2 text-blue-600" />
            Desempenho dos Modelos (Loss)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={modelPerformanceData.slice(0, trainingEpochs/5 + 1)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  name="Redes Densas" 
                  dataKey="denseLoss" 
                  stroke="#8884d8" 
                  strokeWidth={selectedModel === "dense" ? 3 : 1}
                  opacity={selectedModel === "dense" ? 1 : 0.5}
                />
                <Line 
                  type="monotone" 
                  name="LSTM" 
                  dataKey="lstmLoss" 
                  stroke="#82ca9d" 
                  strokeWidth={selectedModel === "lstm" ? 3 : 1}
                  opacity={selectedModel === "lstm" ? 1 : 0.5}
                />
                <Line 
                  type="monotone" 
                  name="Transformer" 
                  dataKey="transformerLoss" 
                  stroke="#ff8042" 
                  strokeWidth={selectedModel === "transformer" ? 3 : 1}
                  opacity={selectedModel === "transformer" ? 1 : 0.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card className="border border-blue-100 bg-blue-50">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-1">Redes Densas (DNN)</h4>
              <p className="text-sm text-blue-700">
                Rápidas e eficazes para identificar relações não-lineares em dados. Ideal para previsões com múltiplas variáveis.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-green-100 bg-green-50">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-800 mb-1">LSTM (Long Short-Term Memory)</h4>
              <p className="text-sm text-green-700">
                Excelentes para séries temporais e previsão. Capturam dependências de longo prazo nos dados.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-orange-100 bg-orange-50">
            <CardContent className="p-4">
              <h4 className="font-medium text-orange-800 mb-1">Transformer</h4>
              <p className="text-sm text-orange-700">
                Capturam padrões complexos e interdependentes. Ideais para modelar dependências contextuais.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsDetailsOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700" 
            onClick={handleRunAutoML}
            disabled={isRunning}
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            {isRunning ? "Executando..." : "Executar AutoML"}
          </Button>
        </div>
      </CardContent>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Detalhes do Modelo: {getModelFullName()}</DialogTitle>
            <DialogDescription>
              Configuração e parâmetros detalhados do modelo selecionado
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2">Parâmetros do Modelo</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-md">
                    <span className="text-sm font-medium">Tipo:</span>
                    <p className="text-sm">{getModelFullName()}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md">
                    <span className="text-sm font-medium">Complexidade:</span>
                    <p className="text-sm">{complexity}% ({complexity < 30 ? 'Baixa' : complexity < 70 ? 'Média' : 'Alta'})</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md">
                    <span className="text-sm font-medium">Épocas:</span>
                    <p className="text-sm">{trainingEpochs}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md">
                    <span className="text-sm font-medium">Taxa de Aprendizado:</span>
                    <p className="text-sm">{0.001 - (complexity / 10000)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-lg mb-2">Métricas Estimadas</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-md">
                    <span className="text-sm font-medium">Precisão:</span>
                    <p className="text-sm">{(90 + (complexity / 10)).toFixed(1)}%</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md">
                    <span className="text-sm font-medium">Recall:</span>
                    <p className="text-sm">{(85 + (complexity / 8)).toFixed(1)}%</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md">
                    <span className="text-sm font-medium">F1-Score:</span>
                    <p className="text-sm">{(87 + (complexity / 9)).toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-lg mb-2">Informações Adicionais</h3>
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-sm">
                    {selectedModel === 'dense' && 'O modelo de Redes Densas utilizará ' + (3 + Math.floor(complexity / 20)) + ' camadas ocultas com função de ativação ReLU.'}
                    {selectedModel === 'lstm' && 'O modelo LSTM utilizará ' + (2 + Math.floor(complexity / 25)) + ' camadas recorrentes com ' + (64 + complexity) + ' unidades por camada.'}
                    {selectedModel === 'transformer' && 'O modelo Transformer utilizará ' + (2 + Math.floor(complexity / 25)) + ' camadas de atenção com ' + (4 + Math.floor(complexity / 20)) + ' cabeças de atenção.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Fechar
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                setIsDetailsOpen(false);
                handleRunAutoML();
              }}
            >
              Executar com estes parâmetros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
