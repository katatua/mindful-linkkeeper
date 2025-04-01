
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Download, RefreshCw } from "lucide-react";

export const SectorGrowthModel = () => {
  const { t } = useLanguage();
  const [timeHorizon, setTimeHorizon] = useState<number[]>([3]);
  const [selectedSector, setSelectedSector] = useState("technology");
  const [investmentLevel, setInvestmentLevel] = useState<number[]>([50]);
  const [policySupport, setPolicySupport] = useState<number[]>([50]);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const sectors = [
    { id: "technology", name: "Tecnologia Digital" },
    { id: "health", name: "Saúde e Biotecnologia" },
    { id: "energy", name: "Energia Sustentável" },
    { id: "manufacturing", name: "Manufatura Avançada" },
    { id: "agriculture", name: "Agrotech" }
  ];
  
  const growthProjectionData = [
    { year: "2024", baseline: 3.2, optimistic: 4.8, conservative: 2.1 },
    { year: "2025", baseline: 3.8, optimistic: 5.7, conservative: 2.4 },
    { year: "2026", baseline: 4.2, optimistic: 6.5, conservative: 2.8 },
    { year: "2027", baseline: 4.9, optimistic: 7.8, conservative: 3.2 },
    { year: "2028", baseline: 5.6, optimistic: 8.9, conservative: 3.6 }
  ];
  
  const subsectorData = [
    { name: "IA e Machine Learning", growth: 8.4 },
    { name: "Cloud Computing", growth: 7.2 },
    { name: "Cibersegurança", growth: 6.9 },
    { name: "Internet das Coisas", growth: 6.3 },
    { name: "Blockchain", growth: 5.8 },
    { name: "Robótica", growth: 5.2 }
  ];
  
  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão de Crescimento por Setor</CardTitle>
        <CardDescription>
          Analise as projeções de crescimento para diferentes setores e simule diferentes cenários de investimento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Setor</h3>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um setor" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(sector => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Horizonte Temporal (anos)</h3>
                <span className="text-sm">{timeHorizon[0]}</span>
              </div>
              <Slider 
                value={timeHorizon} 
                min={1} 
                max={10} 
                step={1} 
                onValueChange={setTimeHorizon} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Nível de Investimento</h3>
                <span className="text-sm">{investmentLevel[0]}%</span>
              </div>
              <Slider 
                value={investmentLevel} 
                min={10} 
                max={100} 
                step={5} 
                onValueChange={setInvestmentLevel} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Suporte de Políticas Públicas</h3>
                <span className="text-sm">{policySupport[0]}%</span>
              </div>
              <Slider 
                value={policySupport} 
                min={10} 
                max={100} 
                step={5} 
                onValueChange={setPolicySupport} 
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleCalculate}
              disabled={isCalculating}
            >
              {isCalculating ? 
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> 
                  Calculando...
                </> : 
                'Calcular Projeção'
              }
            </Button>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Crescimento Projetado (CAGR)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthProjectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis unit="%" />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="optimistic" name="Cenário Optimista" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="baseline" name="Cenário Base" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="conservative" name="Cenário Conservador" stroke="#ff8042" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <Card className="bg-gray-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Crescimento Projetado por Subsetor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subsectorData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" unit="%" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="growth" name="CAGR Projetado" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Fatores de Impacto</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-1">
                <li>• Taxa de adoção tecnológica: <span className="font-medium">Alto</span></li>
                <li>• Investimento em P&D: <span className="font-medium">Médio-Alto</span></li>
                <li>• Disponibilidade de talento: <span className="font-medium">Médio</span></li>
                <li>• Regulamentação: <span className="font-medium">Favorável</span></li>
                <li>• Competição internacional: <span className="font-medium">Alta</span></li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-1">
                <li>• Aumentar investimento em programas de qualificação</li>
                <li>• Criar incentivos fiscais para startups no setor</li>
                <li>• Estabelecer hubs de inovação em regiões estratégicas</li>
                <li>• Facilitar parcerias internacionais para transferência de tecnologia</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Métricas Chave</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-1">
                <li className="flex justify-between">
                  <span>CAGR Médio (5 anos):</span>
                  <span className="font-medium">6.2%</span>
                </li>
                <li className="flex justify-between">
                  <span>Potencial de Criação de Empregos:</span>
                  <span className="font-medium">42,000+</span>
                </li>
                <li className="flex justify-between">
                  <span>Impacto no PIB:</span>
                  <span className="font-medium">+1.8%</span>
                </li>
                <li className="flex justify-between">
                  <span>Índice de Confiança:</span>
                  <span className="font-medium">82%</span>
                </li>
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
