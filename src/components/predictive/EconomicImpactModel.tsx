
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Database, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Sample data for the economic impact models
const sectorImpactData = [
  { sector: "Saúde", gdpImpact: 2.8, jobsCreated: 45000, investmentGrowth: 32 },
  { sector: "Agricultura", gdpImpact: 1.6, jobsCreated: 28000, investmentGrowth: 18 },
  { sector: "Energia", gdpImpact: 3.2, jobsCreated: 32000, investmentGrowth: 42 },
  { sector: "Transporte", gdpImpact: 2.1, jobsCreated: 25000, investmentGrowth: 24 },
  { sector: "Educação", gdpImpact: 1.2, jobsCreated: 31000, investmentGrowth: 15 }
];

const regionalImpactData = [
  { region: "Norte", value: 18 },
  { region: "Centro", value: 22 },
  { region: "Lisboa", value: 38 },
  { region: "Alentejo", value: 12 },
  { region: "Algarve", value: 10 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const EconomicImpactModel = () => {
  const { t } = useLanguage();
  const [predictionHorizon, setPredictionHorizon] = useState(5);
  const [selectedModel, setSelectedModel] = useState("lstm");
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  
  const handleHorizonChange = (value: number[]) => {
    setPredictionHorizon(value[0]);
  };
  
  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };
  
  const handleConfidenceChange = (value: number[]) => {
    setConfidenceLevel(value[0]);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('predictive.economic_impact.title') || "Simulação de Impacto Econômico"}
          </CardTitle>
          <CardDescription>
            {t('predictive.economic_impact.description') || "Previsão dos impactos econômicos de políticas de inovação na economia portuguesa"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Modelo Preditivo</label>
              <Select defaultValue={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dense">Redes Neurais Densas</SelectItem>
                  <SelectItem value="lstm">LSTM (Long Short-Term Memory)</SelectItem>
                  <SelectItem value="transformer">Transformer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Horizonte de Previsão (anos)</label>
              <div className="pt-2 px-1">
                <Slider 
                  defaultValue={[predictionHorizon]} 
                  max={10} 
                  min={1} 
                  step={1} 
                  onValueChange={handleHorizonChange}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 ano</span>
                  <span>{predictionHorizon} anos</span>
                  <span>10 anos</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Nível de Confiança (%)</label>
              <div className="pt-2 px-1">
                <Slider 
                  defaultValue={[confidenceLevel]} 
                  max={99} 
                  min={80} 
                  step={1} 
                  onValueChange={handleConfidenceChange}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>80%</span>
                  <span>{confidenceLevel}%</span>
                  <span>99%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-3">
              Confiança do Modelo: 
              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                {selectedModel === "dense" ? "88%" : selectedModel === "lstm" ? "93%" : "94%"}
              </Badge>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div>
              <h3 className="text-sm font-medium mb-4">Impacto Projetado por Setor (% PIB)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorImpactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sector" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="Impacto no PIB (%)" dataKey="gdpImpact" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-4">Distribuição de Impacto por Região (%)</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionalImpactData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {regionalImpactData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md mt-4">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
              <Database className="h-4 w-4" />
              Descobertas do Modelo
            </h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center flex-shrink-0 text-xs font-medium">1</span>
                <span>
                  O modelo {selectedModel === "dense" ? "de Redes Neurais" : selectedModel === "lstm" ? "LSTM" : "Transformer"} prevê que os maiores 
                  impactos econômicos estarão concentrados no setor de Energia e Saúde.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center flex-shrink-0 text-xs font-medium">2</span>
                <span>
                  Estima-se a criação de {selectedModel === "dense" ? "120,000" : selectedModel === "lstm" ? "161,000" : "175,000"} novos postos 
                  de trabalho nos próximos {predictionHorizon} anos como resultado direto de políticas de inovação.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center flex-shrink-0 text-xs font-medium">3</span>
                <span>
                  A região de Lisboa continuará a receber a maior parte dos benefícios econômicos, seguida pela região Centro.
                </span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>
            <Button>
              Gerar Relatório Detalhado
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
