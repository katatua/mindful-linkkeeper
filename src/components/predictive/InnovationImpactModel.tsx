
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AreaChart, Area } from "recharts";
import { Badge } from "@/components/ui/badge";

export const InnovationImpactModel = () => {
  const { t } = useLanguage();
  const [investmentLevel, setInvestmentLevel] = useState(50);
  const [selectedSector, setSelectedSector] = useState("all");
  const [timeframe, setTimeframe] = useState("medium");
  const [selectedScenario, setSelectedScenario] = useState("moderate");
  
  // Simulation data for different scenarios
  const scenarioData = {
    conservative: {
      jobsCreated: 12000,
      gdpGrowth: 0.8,
      patents: 320,
      spillover: 0.4
    },
    moderate: {
      jobsCreated: 24000,
      gdpGrowth: 1.5,
      patents: 580,
      spillover: 0.7
    },
    ambitious: {
      jobsCreated: 38000,
      gdpGrowth: 2.3,
      patents: 780,
      spillover: 1.2
    }
  };
  
  // Economic impact chart data
  const economicImpactData = [
    { year: '2024', conservative: 0.2, moderate: 0.3, ambitious: 0.5 },
    { year: '2025', conservative: 0.5, moderate: 0.8, ambitious: 1.2 },
    { year: '2026', conservative: 0.8, moderate: 1.5, ambitious: 2.3 },
    { year: '2027', conservative: 1.0, moderate: 1.8, ambitious: 2.8 },
    { year: '2028', conservative: 1.2, moderate: 2.1, ambitious: 3.2 }
  ];
  
  // Jobs created chart data
  const jobsCreatedData = [
    { year: '2024', conservative: 3000, moderate: 6000, ambitious: 10000 },
    { year: '2025', conservative: 6000, moderate: 12000, ambitious: 18000 },
    { year: '2026', conservative: 9000, moderate: 18000, ambitious: 28000 },
    { year: '2027', conservative: 10500, moderate: 21000, ambitious: 34000 },
    { year: '2028', conservative: 12000, moderate: 24000, ambitious: 38000 }
  ];
  
  // Patents generated chart data
  const patentsData = [
    { year: '2024', conservative: 80, moderate: 140, ambitious: 200 },
    { year: '2025', conservative: 160, moderate: 280, ambitious: 400 },
    { year: '2026', conservative: 240, moderate: 420, ambitious: 600 },
    { year: '2027', conservative: 280, moderate: 500, ambitious: 700 },
    { year: '2028', conservative: 320, moderate: 580, ambitious: 780 }
  ];
  
  // Sector-specific impact data
  const sectorImpactData = [
    { sector: 'Biotecnologia', gdpImpact: 2.1, jobsCreation: 12500, patentsGeneration: 280 },
    { sector: 'Computação Quântica', gdpImpact: 1.8, jobsCreation: 9800, patentsGeneration: 320 },
    { sector: 'Energias Renováveis', gdpImpact: 1.6, jobsCreation: 15300, patentsGeneration: 210 },
    { sector: 'Inteligência Artificial', gdpImpact: 2.3, jobsCreation: 13700, patentsGeneration: 410 },
    { sector: 'Materiais Avançados', gdpImpact: 1.4, jobsCreation: 8600, patentsGeneration: 190 }
  ];
  
  // Calculate adjusted values based on investment level
  const investmentFactor = investmentLevel / 50;
  const adjustedImpact = {
    jobsCreated: Math.round(scenarioData[selectedScenario].jobsCreated * investmentFactor),
    gdpGrowth: (scenarioData[selectedScenario].gdpGrowth * investmentFactor).toFixed(1),
    patents: Math.round(scenarioData[selectedScenario].patents * investmentFactor),
    spillover: (scenarioData[selectedScenario].spillover * investmentFactor).toFixed(1)
  };
  
  // Handle scenario change
  const handleScenarioChange = (value) => {
    setSelectedScenario(value);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Simulação de Impacto de Inovação</CardTitle>
            <CardDescription>
              Análise de impacto econômico e social de investimentos em inovação
            </CardDescription>
          </div>
          <Badge variant={
            selectedScenario === "conservative" ? "outline" : 
            selectedScenario === "moderate" ? "secondary" : "default"
          }>
            {selectedScenario === "conservative" ? "Conservador" : 
             selectedScenario === "moderate" ? "Moderado" : "Ambicioso"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="investment-level">Nível de Investimento em P&D</Label>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">Baixo</span>
                <Slider 
                  id="investment-level"
                  value={[investmentLevel]} 
                  onValueChange={(value) => setInvestmentLevel(value[0])}
                  min={10} 
                  max={100} 
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">Alto</span>
              </div>
              <div className="text-right text-sm mt-1">
                {investmentLevel}% do ideal
              </div>
            </div>
            
            <div>
              <Label htmlFor="sector-select">Setor Alvo</Label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger id="sector-select" className="mt-2">
                  <SelectValue placeholder="Selecione um setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Setores</SelectItem>
                  <SelectItem value="biotech">Biotecnologia</SelectItem>
                  <SelectItem value="quantum">Computação Quântica</SelectItem>
                  <SelectItem value="energy">Energias Renováveis</SelectItem>
                  <SelectItem value="ai">Inteligência Artificial</SelectItem>
                  <SelectItem value="materials">Materiais Avançados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="timeframe-select">Período de Análise</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger id="timeframe-select" className="mt-2">
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Curto Prazo (1-2 anos)</SelectItem>
                  <SelectItem value="medium">Médio Prazo (3-5 anos)</SelectItem>
                  <SelectItem value="long">Longo Prazo (6-10 anos)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="economic">Impacto Econômico</TabsTrigger>
                <TabsTrigger value="jobs">Empregos</TabsTrigger>
                <TabsTrigger value="innovation">Inovação</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm font-medium">Empregos Criados</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="text-2xl font-bold">+{adjustedImpact.jobsCreated}</div>
                      <p className="text-xs text-muted-foreground">Novos postos de trabalho</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm font-medium">Crescimento do PIB</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="text-2xl font-bold">+{adjustedImpact.gdpGrowth}%</div>
                      <p className="text-xs text-muted-foreground">Impacto percentual</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm font-medium">Patentes Geradas</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="text-2xl font-bold">+{adjustedImpact.patents}</div>
                      <p className="text-xs text-muted-foreground">Novas patentes</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm font-medium">Efeito Spillover</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="text-2xl font-bold">{adjustedImpact.spillover}x</div>
                      <p className="text-xs text-muted-foreground">Multiplicador econômico</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-2">Metodologia de Simulação</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Esta simulação utiliza uma combinação de modelos econométricos e abordagem de dinâmica de sistemas para projetar impactos:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Elasticidade de emprego baseada em dados históricos do setor</li>
                    <li>Correlação entre investimento em P&D e crescimento do PIB</li>
                    <li>Taxas de geração de patentes por setor e nível de investimento</li>
                    <li>Efeitos indiretos (spillover) em setores correlacionados</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="economic">
                <div className="h-[300px] mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={economicImpactData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis label={{ value: 'Impacto no PIB (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Impacto PIB']}
                        labelFormatter={(label) => `Ano: ${label}`}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="conservative" stackId="1" stroke="#8884d8" fill="#8884d8" name="Conservador" />
                      <Area type="monotone" dataKey="moderate" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Moderado" />
                      <Area type="monotone" dataKey="ambitious" stackId="3" stroke="#ffc658" fill="#ffc658" name="Ambicioso" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">Análise de Impacto Econômico</h4>
                  <p className="text-sm text-muted-foreground">
                    O cenário {selectedScenario === "conservative" ? "conservador" : 
                              selectedScenario === "moderate" ? "moderado" : "ambicioso"} 
                    projeta um crescimento do PIB de {adjustedImpact.gdpGrowth}% em 5 anos, 
                    considerando o nível atual de investimento. Esse resultado se baseia na correlação histórica 
                    entre investimentos em P&D e crescimento econômico, ajustado pelo multiplicador específico do setor.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="jobs">
                <div className="h-[300px] mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={jobsCreatedData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis label={{ value: 'Empregos Criados', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                      <Tooltip 
                        formatter={(value) => [value, 'Empregos']}
                        labelFormatter={(label) => `Ano: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="conservative" fill="#8884d8" name="Conservador" />
                      <Bar dataKey="moderate" fill="#82ca9d" name="Moderado" />
                      <Bar dataKey="ambitious" fill="#ffc658" name="Ambicioso" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">Criação de Empregos</h4>
                  <p className="text-sm text-muted-foreground">
                    A projeção de criação de {adjustedImpact.jobsCreated} novos postos de trabalho considera 
                    tanto empregos diretos em P&D quanto indiretos na cadeia produtiva. A elasticidade do 
                    emprego varia de acordo com o setor, sendo maior em áreas intensivas em conhecimento.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="innovation">
                <div className="h-[300px] mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sectorImpactData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="sector" type="category" width={150} />
                      <Tooltip 
                        formatter={(value) => [value, 'Patentes']}
                        labelFormatter={(label) => `Setor: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="patentsGeneration" fill="#8884d8" name="Patentes" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">Geração de Patentes por Setor</h4>
                  <p className="text-sm text-muted-foreground">
                    A geração de patentes varia significativamente entre setores, com áreas como 
                    Inteligência Artificial e Computação Quântica apresentando maior produtividade 
                    de inovação por investimento. No cenário atual, projetamos {adjustedImpact.patents} 
                    novas patentes em 5 anos.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="space-x-2">
          <Button 
            variant={selectedScenario === "conservative" ? "default" : "outline"} 
            onClick={() => handleScenarioChange("conservative")}
            size="sm"
          >
            Conservador
          </Button>
          <Button 
            variant={selectedScenario === "moderate" ? "default" : "outline"} 
            onClick={() => handleScenarioChange("moderate")}
            size="sm"
          >
            Moderado
          </Button>
          <Button 
            variant={selectedScenario === "ambitious" ? "default" : "outline"} 
            onClick={() => handleScenarioChange("ambitious")}
            size="sm"
          >
            Ambicioso
          </Button>
        </div>
        <Button variant="outline" size="sm">
          Exportar Simulação
        </Button>
      </CardFooter>
    </Card>
  );
};
