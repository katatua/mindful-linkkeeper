
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Download, RefreshCw, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const PerformanceMetricsModel = () => {
  const { t } = useLanguage();
  const [selectedCompanySize, setSelectedCompanySize] = useState("medium");
  const [selectedSector, setSelectedSector] = useState("technology");
  const [isCalculating, setIsCalculating] = useState(false);
  
  const companySizes = [
    { id: "small", name: "Pequena (< 50 funcionários)" },
    { id: "medium", name: "Média (50-250 funcionários)" },
    { id: "large", name: "Grande (> 250 funcionários)" }
  ];
  
  const sectors = [
    { id: "technology", name: "Tecnologia" },
    { id: "health", name: "Saúde" },
    { id: "energy", name: "Energia" },
    { id: "manufacturing", name: "Manufatura" },
    { id: "agriculture", name: "Agricultura" }
  ];
  
  const performanceMetricsData = [
    { year: "2024", roi: 12, marketShare: 4.2, productivity: 6.8, innovation: 7.5 },
    { year: "2025", roi: 14, marketShare: 5.1, productivity: 7.6, innovation: 8.2 },
    { year: "2026", roi: 15, marketShare: 5.8, productivity: 8.3, innovation: 8.8 },
    { year: "2027", roi: 17, marketShare: 6.5, productivity: 9.1, innovation: 9.5 },
    { year: "2028", roi: 18, marketShare: 7.2, productivity: 9.8, innovation: 10.2 }
  ];
  
  const benchmarkData = [
    { metric: "ROI em Inovação", yourCompany: 14, industryAvg: 10, topPerformer: 18 },
    { metric: "Velocidade de Go-to-Market (meses)", yourCompany: 6, industryAvg: 9, topPerformer: 4 },
    { metric: "Taxa de Adoção", yourCompany: 72, industryAvg: 65, topPerformer: 82 },
    { metric: "Eficiência de P&D", yourCompany: 68, industryAvg: 62, topPerformer: 78 },
    { metric: "Índice de Inovação", yourCompany: 74, industryAvg: 68, topPerformer: 86 }
  ];
  
  const radarData = [
    { subject: "ROI", A: 85, B: 65, fullMark: 100 },
    { subject: "Crescimento", A: 78, B: 60, fullMark: 100 },
    { subject: "Inovação", A: 92, B: 70, fullMark: 100 },
    { subject: "Produtividade", A: 82, B: 75, fullMark: 100 },
    { subject: "Qualidade", A: 88, B: 80, fullMark: 100 },
    { subject: "Custo-Eficiência", A: 76, B: 72, fullMark: 100 },
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
        <CardTitle>Impacto de Mercado e Métricas de Desempenho</CardTitle>
        <CardDescription>
          Analise o impacto projetado de investimentos em inovação nas principais métricas de desempenho empresarial
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Tamanho da Empresa</h3>
            <Select value={selectedCompanySize} onValueChange={setSelectedCompanySize}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tamanho da empresa" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map(size => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Setor</h3>
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
          
          <div className="flex items-end">
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
                'Recalcular Projeções'
              }
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="metrics">
          <TabsList>
            <TabsTrigger value="metrics">Métricas de Desempenho</TabsTrigger>
            <TabsTrigger value="benchmark">Benchmark Competitivo</TabsTrigger>
            <TabsTrigger value="radar">Perfil de Inovação</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceMetricsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="roi" name="ROI (%)" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="marketShare" name="Market Share (%)" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="productivity" name="Índice de Produtividade" stroke="#ffc658" />
                  <Line type="monotone" dataKey="innovation" name="Índice de Inovação" stroke="#ff8042" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="benchmark" className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="yourCompany" name="Sua Empresa" fill="#8884d8" />
                  <Bar dataKey="industryAvg" name="Média do Setor" fill="#82ca9d" />
                  <Bar dataKey="topPerformer" name="Top Performer" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="radar" className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Sua Empresa" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Média do Setor" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Insights Principais</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-1.5">
                <li className="flex items-start">
                  <ArrowRight className="h-3 w-3 mt-0.5 mr-1 text-blue-500" />
                  <span>Investimentos em inovação mostram ROI crescente nos primeiros 3 anos</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-3 w-3 mt-0.5 mr-1 text-blue-500" />
                  <span>Ganhos de produtividade tendem a estabilizar após o 4º ano</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-3 w-3 mt-0.5 mr-1 text-blue-500" />
                  <span>Empresas de médio porte demonstram maior ganho relativo</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Fatores de Influência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span>Investimento em P&D</span>
                  <Badge variant="outline" className="text-green-600 bg-green-50">Alto Impacto</Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Capacitação de Pessoal</span>
                  <Badge variant="outline" className="text-green-600 bg-green-50">Alto Impacto</Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Infraestrutura Tecnológica</span>
                  <Badge variant="outline" className="text-yellow-600 bg-yellow-50">Médio Impacto</Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Ambiente Regulatório</span>
                  <Badge variant="outline" className="text-yellow-600 bg-yellow-50">Médio Impacto</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-1.5">
                <li className="flex items-start">
                  <ArrowRight className="h-3 w-3 mt-0.5 mr-1 text-blue-500" />
                  <span>Focar em inovações com ciclo rápido de implementação</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-3 w-3 mt-0.5 mr-1 text-blue-500" />
                  <span>Estabelecer parcerias com universidades para P&D</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-3 w-3 mt-0.5 mr-1 text-blue-500" />
                  <span>Criar programa de inovação aberta com fornecedores</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Exportar Relatório
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
