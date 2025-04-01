
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const RegionalAnalysisModel = () => {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState("north");
  const [selectedTimeframe, setSelectedTimeframe] = useState("medium");
  const [isCalculating, setIsCalculating] = useState(false);
  
  const regions = [
    { id: "north", name: "Norte" },
    { id: "central", name: "Centro" },
    { id: "lisbon", name: "Lisboa" },
    { id: "alentejo", name: "Alentejo" },
    { id: "algarve", name: "Algarve" },
    { id: "islands", name: "Ilhas" }
  ];
  
  const timeframes = [
    { id: "short", name: "Curto Prazo (1-2 anos)" },
    { id: "medium", name: "Médio Prazo (3-5 anos)" },
    { id: "long", name: "Longo Prazo (> 5 anos)" }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const policyImpactData = [
    { 
      policy: "Incentivos Fiscais para P&D", 
      jobs: 4800, 
      investment: 65, 
      startups: 42, 
      patents: 120 
    },
    { 
      policy: "Infraestrutura Tecnológica", 
      jobs: 3600, 
      investment: 48, 
      startups: 28, 
      patents: 85 
    },
    { 
      policy: "Formação Técnica Avançada", 
      jobs: 5200, 
      investment: 35, 
      startups: 22, 
      patents: 65 
    },
    { 
      policy: "Parcerias Universidade-Empresa", 
      jobs: 2900, 
      investment: 42, 
      startups: 35, 
      patents: 110 
    },
    { 
      policy: "Apoio à Internacionalização", 
      jobs: 3200, 
      investment: 52, 
      startups: 18, 
      patents: 45 
    }
  ];
  
  const regionClusterData = [
    { name: "Tecnologia Digital", value: 35 },
    { name: "Saúde", value: 25 },
    { name: "Energia", value: 20 },
    { name: "Manufatura", value: 12 },
    { name: "Agrotech", value: 8 }
  ];
  
  const economicTimeSeriesData = [
    { year: "2024", gdpGrowth: 1.2, employmentGrowth: 0.8, investmentGrowth: 2.2 },
    { year: "2025", gdpGrowth: 1.5, employmentGrowth: 1.1, investmentGrowth: 2.7 },
    { year: "2026", gdpGrowth: 1.8, employmentGrowth: 1.4, investmentGrowth: 3.1 },
    { year: "2027", gdpGrowth: 2.1, employmentGrowth: 1.7, investmentGrowth: 3.5 },
    { year: "2028", gdpGrowth: 2.4, employmentGrowth: 2.0, investmentGrowth: 3.9 }
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
        <CardTitle>Simulação de Efeitos de Políticas por Região</CardTitle>
        <CardDescription>
          Modele os impactos econômicos e sociais de diferentes políticas de inovação nas regiões portuguesas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Região</h3>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma região" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Horizonte Temporal</h3>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o horizonte temporal" />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map(time => (
                  <SelectItem key={time.id} value={time.id}>
                    {time.name}
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
                  Simulando...
                </> : 
                'Simular Efeitos'
              }
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="policy">
          <TabsList>
            <TabsTrigger value="policy">Impacto de Políticas</TabsTrigger>
            <TabsTrigger value="clusters">Clusters Regionais</TabsTrigger>
            <TabsTrigger value="economic">Projeções Econômicas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="policy" className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={policyImpactData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="policy" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="jobs" name="Empregos Gerados" fill="#8884d8" />
                  <Bar dataKey="investment" name="Investimento (M€)" fill="#82ca9d" />
                  <Bar dataKey="startups" name="Novas Startups" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="clusters" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionClusterData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {regionClusterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                <Card className="bg-slate-50 border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Potencial de Especialização Regional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span>Tecnologia Digital</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600">Alto Potencial</Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span>Saúde e Biotecnologia</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600">Alto Potencial</Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span>Energia Sustentável</span>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-600">Médio Potencial</Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span>Manufatura Avançada</span>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-600">Médio Potencial</Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span>Agrotech</span>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-600">Médio Potencial</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-xs text-gray-600">
                  <p>
                    A análise de clusters regionais indica áreas de especialização com maior potencial 
                    baseado em recursos existentes, infraestrutura e capital humano disponível na região.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="economic" className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={economicTimeSeriesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="gdpGrowth" name="Crescimento do PIB (%)" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="employmentGrowth" name="Crescimento do Emprego (%)" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="investmentGrowth" name="Crescimento do Investimento (%)" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
        
        <Card className="bg-gray-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Impactos Econômicos Projetados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded border">
                <h4 className="text-xs font-medium text-gray-500">Crescimento do PIB Regional</h4>
                <p className="text-xl font-bold">+2.1%</p>
                <p className="text-xs text-gray-500">Média anual em 5 anos</p>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <h4 className="text-xs font-medium text-gray-500">Novos Empregos</h4>
                <p className="text-xl font-bold">12,400</p>
                <p className="text-xs text-gray-500">Estimativa em 5 anos</p>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <h4 className="text-xs font-medium text-gray-500">Novas Empresas</h4>
                <p className="text-xl font-bold">280+</p>
                <p className="text-xs text-gray-500">Expectativa em 5 anos</p>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <h4 className="text-xs font-medium text-gray-500">Índice de Inovação</h4>
                <p className="text-xl font-bold">↑ 18.5%</p>
                <p className="text-xs text-gray-500">Incremento projetado</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recomendações de Políticas para a Região</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="font-medium mr-2">1.</span>
                <div>
                  <p className="font-medium">Estabelecer um hub regional de inovação</p>
                  <p className="text-xs text-gray-600">
                    Criar um centro integrado para conectar pesquisadores, empresas e investidores, 
                    focado nos setores prioritários identificados na análise de clusters.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start">
                <span className="font-medium mr-2">2.</span>
                <div>
                  <p className="font-medium">Programa de capacitação técnica avançada</p>
                  <p className="text-xs text-gray-600">
                    Desenvolver programas educacionais alinhados às necessidades de mercado 
                    nos setores de alto potencial, em parceria com universidades locais.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start">
                <span className="font-medium mr-2">3.</span>
                <div>
                  <p className="font-medium">Fundo de capital semente para startups regionais</p>
                  <p className="text-xs text-gray-600">
                    Criar um fundo específico para financiar startups inovadoras nos estágios iniciais, 
                    com foco em soluções para desafios regionais.
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Exportar Simulação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
