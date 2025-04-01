
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, TrendingUp, Search, LineChart as LineChartIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data for the innovation trends prediction model
const trendData = [
  { year: '2024', quantumComputing: 92, biotech: 87, greenHydrogen: 83, ai: 95 },
  { year: '2025', quantumComputing: 94, biotech: 90, greenHydrogen: 87, ai: 97 },
  { year: '2026', quantumComputing: 95, biotech: 92, greenHydrogen: 90, ai: 98 },
  { year: '2027', quantumComputing: 97, biotech: 94, greenHydrogen: 92, ai: 99 },
  { year: '2028', quantumComputing: 98, biotech: 96, greenHydrogen: 94, ai: 99 }
];

const patentData = [
  { month: 'Jan 2023', quantum: 125, biotech: 180, hydrogen: 95, ai: 320 },
  { month: 'Apr 2023', quantum: 140, biotech: 195, hydrogen: 110, ai: 360 },
  { month: 'Jul 2023', quantum: 160, biotech: 210, hydrogen: 130, ai: 410 },
  { month: 'Oct 2023', quantum: 180, biotech: 230, hydrogen: 150, ai: 460 },
  { month: 'Jan 2024', quantum: 200, biotech: 250, hydrogen: 170, ai: 520 },
  { month: 'Apr 2024', quantum: 220, biotech: 270, hydrogen: 190, ai: 580 }
];

const topicTrends = [
  { topic: "Quantum Computing", growth: 28, relevance: 85, investment: 12.5 },
  { topic: "Advanced Biotech", growth: 22, relevance: 82, investment: 18.3 },
  { topic: "Green Hydrogen", growth: 32, relevance: 78, investment: 8.7 },
  { topic: "Artificial Intelligence", growth: 42, relevance: 95, investment: 32.1 },
  { topic: "Nanotechnology", growth: 18, relevance: 72, investment: 5.2 },
  { topic: "Fusion Energy", growth: 25, relevance: 68, investment: 4.9 }
];

export const InnovationTrendsModel = () => {
  const { t } = useLanguage();
  const [selectedModelType, setSelectedModelType] = useState("timeSeries");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [forecastPeriod, setForecastPeriod] = useState(5);
  
  const handleModelTypeChange = (value: string) => {
    setSelectedModelType(value);
  };
  
  const handleTopicChange = (value: string) => {
    setSelectedTopic(value);
  };
  
  const handleForecastPeriodChange = (value: number[]) => {
    setForecastPeriod(value[0]);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('predictive.innovation_trends.title') || "Previsão de Tendências de Inovação"}
          </CardTitle>
          <CardDescription>
            {t('predictive.innovation_trends.description') || "Análise e previsão de tendências emergentes em áreas tecnológicas baseadas em patentes, publicações e investimentos"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Modelo de Previsão</label>
              <Select defaultValue={selectedModelType} onValueChange={handleModelTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timeSeries">ARIMA/SARIMA</SelectItem>
                  <SelectItem value="lstm">LSTM (Redes Neurais)</SelectItem>
                  <SelectItem value="nlp">Análise de Texto (NLP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Área Tecnológica</label>
              <Select defaultValue={selectedTopic} onValueChange={handleTopicChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a tecnologia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Áreas</SelectItem>
                  <SelectItem value="quantum">Computação Quântica</SelectItem>
                  <SelectItem value="biotech">Biotecnologia</SelectItem>
                  <SelectItem value="hydrogen">Hidrogênio Verde</SelectItem>
                  <SelectItem value="ai">Inteligência Artificial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Período de Previsão (anos)</label>
              <div className="pt-2 px-1">
                <Slider 
                  defaultValue={[forecastPeriod]} 
                  max={10} 
                  min={1} 
                  step={1} 
                  onValueChange={handleForecastPeriodChange}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 ano</span>
                  <span>{forecastPeriod} anos</span>
                  <span>10 anos</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <h3 className="text-sm font-medium mb-3">
              Confiança do Modelo: 
              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                {selectedModelType === "timeSeries" ? "92%" : selectedModelType === "lstm" ? "94%" : "89%"}
              </Badge>
            </h3>
            <Progress value={selectedModelType === "timeSeries" ? 92 : selectedModelType === "lstm" ? 94 : 89} className="h-2" />
          </div>
          
          <Tabs defaultValue="growth" className="pt-2">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="growth">Crescimento Projetado</TabsTrigger>
              <TabsTrigger value="patents">Patentes por Período</TabsTrigger>
              <TabsTrigger value="topics">Ranking de Tópicos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="growth" className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" name="Computação Quântica" dataKey="quantumComputing" stroke="#8884d8" />
                    <Line type="monotone" name="Biotecnologia" dataKey="biotech" stroke="#82ca9d" />
                    <Line type="monotone" name="Hidrogênio Verde" dataKey="greenHydrogen" stroke="#ffc658" />
                    <Line type="monotone" name="Inteligência Artificial" dataKey="ai" stroke="#ff8042" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                Previsão de crescimento (%) ao longo dos próximos anos
              </div>
            </TabsContent>
            
            <TabsContent value="patents" className="pt-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="Computação Quântica" dataKey="quantum" fill="#8884d8" />
                    <Bar name="Biotecnologia" dataKey="biotech" fill="#82ca9d" />
                    <Bar name="Hidrogênio Verde" dataKey="hydrogen" fill="#ffc658" />
                    <Bar name="Inteligência Artificial" dataKey="ai" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                Número de patentes registradas por trimestre
              </div>
            </TabsContent>
            
            <TabsContent value="topics" className="pt-2">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="p-2 text-left font-medium">Tópico</th>
                      <th className="p-2 text-center font-medium">Crescimento Anual (%)</th>
                      <th className="p-2 text-center font-medium">Relevância</th>
                      <th className="p-2 text-right font-medium">Investimento (M€)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topicTrends.map((topic, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{topic.topic}</td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center">
                            <span className={`font-medium ${topic.growth > 25 ? 'text-green-600' : 'text-blue-600'}`}>
                              {topic.growth}%
                            </span>
                            {topic.growth > 30 && <TrendingUp className="h-4 w-4 ml-1 text-green-600" />}
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${topic.relevance}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="p-2 text-right font-medium">{topic.investment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-blue-50 p-4 rounded-md mt-6">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
              <BrainCircuit className="h-4 w-4" />
              Insights do Modelo
            </h3>
            <ul className="text-sm space-y-2">
              <li className="flex gap-2">
                <Search className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>
                  {selectedModelType === "timeSeries" 
                    ? "O modelo ARIMA prevê um crescimento acelerado em Inteligência Artificial nos próximos 3 anos."
                    : selectedModelType === "lstm" 
                    ? "As redes neurais LSTM detectaram padrões cíclicos no desenvolvimento de tecnologias quânticas."
                    : "A análise NLP identificou 237 termos emergentes em publicações científicas recentes."}
                </span>
              </li>
              <li className="flex gap-2">
                <Search className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Patentes em Hidrogênio Verde mostram a maior taxa de crescimento entre tecnologias emergentes.</span>
              </li>
              <li className="flex gap-2">
                <Search className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>As publicações em Biotecnologia apresentam a maior diversidade geográfica de autores.</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline">Exportar Dados</Button>
            <Button>
              <LineChartIcon className="h-4 w-4 mr-2" />
              Gerar Relatório Detalhado
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
