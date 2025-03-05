import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { FileCode, Download, RefreshCw, Database, Info, BarChart, FileText, Briefcase, Award } from "lucide-react";
import { generateResponse } from "@/utils/aiUtils";
import { Header } from "@/components/Header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const SyntheticDataPage = () => {
  const [dataType, setDataType] = useState("funding");
  const [rowCount, setRowCount] = useState(10);
  const [generatingData, setGeneratingData] = useState(false);
  const [generatedData, setGeneratedData] = useState("");
  const [includeSourceInfo, setIncludeSourceInfo] = useState(false);
  const [parameters, setParameters] = useState<Record<string, any>>({
    funding: {
      minBudget: 50000,
      maxBudget: 5000000,
      startDateRange: "2024-2026",
      sectors: ["Digital", "Health", "Energy", "Manufacturing"],
      fundingTypes: ["FEEI", "PRR", "Horizonte Europa"],
      eligibilityCriteria: true,
      successRate: true
    },
    projects: {
      minFunding: 10000,
      maxFunding: 1000000,
      duration: "1-3 years",
      regions: ["North", "Center", "Lisbon", "Alentejo"],
      organizations: ["Empresas", "Universidades", "Centros de I&D", "Laboratórios Colaborativos"],
      includeTechnicalDetails: true
    },
    metrics: {
      categories: ["Investment", "Innovation", "Patents"],
      timePeriod: "2020-2024",
      regions: ["Portugal", "Europe"],
      includeSourceAttribution: true
    },
    patents: {
      sectors: ["ICT", "Health", "Energy", "Manufacturing"],
      organizationTypes: ["Empresas", "Universidades", "Laboratórios"],
      timePeriod: "2020-2024",
      includeInternationalData: true
    },
    institutions: {
      types: ["Empresas", "Universidades", "Laboratórios de Estado", "Centros Tecnológicos", "CoLABs"],
      regions: ["North", "Center", "Lisbon", "Alentejo", "International"],
      includeCollaborationData: true,
      includeProjectHistory: true
    }
  });
  const { toast } = useToast();

  const handleParameterChange = (dataTypeKey: string, paramKey: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [dataTypeKey]: {
        ...prev[dataTypeKey],
        [paramKey]: value
      }
    }));
  };

  const dataSources = {
    funding: [
      "Dados de projetos financiados por Fundos Europeus (Horizonte Europa, PRR)",
      "Dados sobre Cooperação Internacional",
      "Dados sobre projetos da Missão Interface",
      "Portal do Financiamento (IAPMEI)",
      "Agendas Mobilizadoras e outros instrumentos PRR"
    ],
    projects: [
      "Dados relativos à atribuição de financiamento através de fundos europeus",
      "Dados sobre projetos ligados ao aumento da capacidade da I&I em Portugal",
      "Projetos de I&D (FCT)",
      "Candidaturas de projetos e pareceres de peritos"
    ],
    metrics: [
      "Inquérito ao Potencial Científico e Tecnológico Nacional",
      "Community Innovation Survey (INE)",
      "Indicadores de atividade económica (GEE)",
      "Previsões para a Economia Portuguesa"
    ],
    patents: [
      "Estatísticas nacionais e internacionais de PI (INPI)",
      "Bases de dados de registos de propriedade industrial",
      "Produção Científica Portuguesa (DGEEC)"
    ],
    institutions: [
      "Instituições de I&D",
      "Dados sobre Empreendedorismo, Inovação e Clusters",
      "Qualificação e Certificação de Reconhecimento de Idoneidade",
      "Rede nacional de incubadoras"
    ]
  };

  const generateSyntheticData = async () => {
    setGeneratingData(true);
    
    try {
      const currentParams = parameters[dataType];
      let prompt = `Generate synthetic data in SQL INSERT format for ${rowCount} rows of ANI ${dataType} data with the following parameters:\n`;
      
      Object.entries(currentParams).forEach(([key, value]) => {
        prompt += `- ${key}: ${Array.isArray(value) ? value.join(", ") : value}\n`;
      });
      
      if (includeSourceInfo) {
        prompt += `\nThis data should simulate real data from these sources:\n`;
        dataSources[dataType as keyof typeof dataSources].forEach(source => {
          prompt += `- ${source}\n`;
        });
      }
      
      let tableName = dataType;
      if (dataType === 'funding') tableName = 'ani_funding_programs';
      else if (dataType === 'projects') tableName = 'ani_projects';
      else if (dataType === 'metrics') tableName = 'ani_metrics';
      else if (dataType === 'patents') tableName = 'ani_patent_holders';
      else if (dataType === 'institutions') tableName = 'ani_institutions';
      
      prompt += `\nThe SQL should be valid for the '${tableName}' table. Only return valid SQL INSERT statements.`;
      
      if (dataType === 'funding') {
        prompt += `\n\nThe ani_funding_programs table has the following columns: id (UUID), name (text), description (text), total_budget (numeric), start_date (date), end_date (date), application_deadline (date), next_call_date (date), funding_type (text), sector_focus (text array), eligibility_criteria (text), application_process (text), review_time_days (integer), success_rate (numeric)`;
      } else if (dataType === 'projects') {
        prompt += `\n\nThe ani_projects table has the following columns: id (UUID), title (text), description (text), start_date (date), end_date (date), funding_amount (numeric), status (text), sector (text), region (text), organization (text), contact_email (text), contact_phone (text)`;
      } else if (dataType === 'metrics') {
        prompt += `\n\nThe ani_metrics table has the following columns: id (UUID), name (text), category (text), value (numeric), unit (text), measurement_date (date), region (text), sector (text), source (text), description (text)`;
      } else if (dataType === 'patents') {
        prompt += `\n\nThe ani_patent_holders table has the following columns: id (UUID), organization_name (text), sector (text), patent_count (integer), innovation_index (numeric), year (integer), country (text)`;
      } else if (dataType === 'institutions') {
        prompt += `\n\nUse this example structure for a new ani_institutions table: id (UUID), institution_name (text), type (text), region (text), specialization_areas (text array), founding_date (date), collaboration_count (integer), project_history (text array)`;
      }
      
      const response = await generateResponse(prompt);
      setGeneratedData(response);
      
      toast({
        title: "Dados Sintéticos Gerados",
        description: `Foram gerados com sucesso ${rowCount} registos de dados ${dataType}.`
      });
    } catch (error) {
      console.error("Error generating synthetic data:", error);
      toast({
        variant: "destructive",
        title: "Falha na Geração",
        description: "Ocorreu um erro ao gerar dados sintéticos. Por favor, tente novamente."
      });
    } finally {
      setGeneratingData(false);
    }
  };

  const downloadSQL = () => {
    if (!generatedData) return;
    
    const blob = new Blob([generatedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synthetic_${dataType}_data.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-6">
      <Header />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerador de Dados Sintéticos ANI</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Parâmetros
              </CardTitle>
              <CardDescription>
                Configure os parâmetros para geração de dados sintéticos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-type">Tipo de Dados</Label>
                <Select value={dataType} onValueChange={setDataType}>
                  <SelectTrigger id="data-type">
                    <SelectValue placeholder="Selecione o tipo de dados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Dados Principais</SelectLabel>
                      <SelectItem value="funding">Programas de Financiamento</SelectItem>
                      <SelectItem value="projects">Projetos</SelectItem>
                      <SelectItem value="metrics">Métricas e Indicadores</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Dados Específicos</SelectLabel>
                      <SelectItem value="patents">Patentes e Propriedade Intelectual</SelectItem>
                      <SelectItem value="institutions">Instituições e Entidades</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="row-count">Número de Registos</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="row-count"
                    value={[rowCount]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={(value) => setRowCount(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{rowCount}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pb-2">
                <Checkbox 
                  id="include-source" 
                  checked={includeSourceInfo}
                  onCheckedChange={(checked) => setIncludeSourceInfo(checked as boolean)}
                />
                <label
                  htmlFor="include-source"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Incluir informação sobre fontes de dados ANI
                </label>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="datasources">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Fontes de Dados ANI
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      {dataSources[dataType as keyof typeof dataSources].map((source, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="min-w-4">•</div>
                          <div>{source}</div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Tabs defaultValue={dataType} value={dataType} onValueChange={setDataType}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="funding">Financiamento</TabsTrigger>
                  <TabsTrigger value="projects">Projetos</TabsTrigger>
                  <TabsTrigger value="metrics">Métricas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="funding" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Orçamento (€)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="number"
                          value={parameters.funding.minBudget}
                          onChange={(e) => handleParameterChange('funding', 'minBudget', parseInt(e.target.value))}
                          placeholder="Orçamento Mínimo"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={parameters.funding.maxBudget}
                          onChange={(e) => handleParameterChange('funding', 'maxBudget', parseInt(e.target.value))}
                          placeholder="Orçamento Máximo"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Período Inicial</Label>
                    <Input
                      value={parameters.funding.startDateRange}
                      onChange={(e) => handleParameterChange('funding', 'startDateRange', e.target.value)}
                      placeholder="ex: 2024-2026"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Setores (separados por vírgula)</Label>
                    <Textarea
                      value={parameters.funding.sectors.join(", ")}
                      onChange={(e) => handleParameterChange('funding', 'sectors', e.target.value.split(",").map(s => s.trim()))}
                      placeholder="Digital, Saúde, Energia..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tipos de Financiamento (separados por vírgula)</Label>
                    <Textarea
                      value={parameters.funding.fundingTypes.join(", ")}
                      onChange={(e) => handleParameterChange('funding', 'fundingTypes', e.target.value.split(",").map(s => s.trim()))}
                      placeholder="FEEI, PRR, Horizonte Europa..."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="eligibility" 
                      checked={parameters.funding.eligibilityCriteria}
                      onCheckedChange={(checked) => handleParameterChange('funding', 'eligibilityCriteria', !!checked)}
                    />
                    <label
                      htmlFor="eligibility"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Incluir critérios de elegibilidade
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="success-rate" 
                      checked={parameters.funding.successRate}
                      onCheckedChange={(checked) => handleParameterChange('funding', 'successRate', !!checked)}
                    />
                    <label
                      htmlFor="success-rate"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Incluir taxa de sucesso
                    </label>
                  </div>
                </TabsContent>
                
                <TabsContent value="projects" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Financiamento (€)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="number"
                          value={parameters.projects.minFunding}
                          onChange={(e) => handleParameterChange('projects', 'minFunding', parseInt(e.target.value))}
                          placeholder="Financiamento Mínimo"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={parameters.projects.maxFunding}
                          onChange={(e) => handleParameterChange('projects', 'maxFunding', parseInt(e.target.value))}
                          placeholder="Financiamento Máximo"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Duração</Label>
                    <Input
                      value={parameters.projects.duration}
                      onChange={(e) => handleParameterChange('projects', 'duration', e.target.value)}
                      placeholder="ex: 1-3 anos"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Regiões (separadas por vírgula)</Label>
                    <Textarea
                      value={parameters.projects.regions.join(", ")}
                      onChange={(e) => handleParameterChange('projects', 'regions', e.target.value.split(",").map(s => s.trim()))}
                      placeholder="Norte, Centro, Lisboa..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Organizações (separadas por vírgula)</Label>
                    <Textarea
                      value={parameters.projects.organizations.join(", ")}
                      onChange={(e) => handleParameterChange('projects', 'organizations', e.target.value.split(",").map(s => s.trim()))}
                      placeholder="Empresas, Universidades, CoLABs..."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tech-details" 
                      checked={parameters.projects.includeTechnicalDetails}
                      onCheckedChange={(checked) => handleParameterChange('projects', 'includeTechnicalDetails', !!checked)}
                    />
                    <label
                      htmlFor="tech-details"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Incluir detalhes técnicos
                    </label>
                  </div>
                </TabsContent>
                
                <TabsContent value="metrics" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Categorias (separadas por vírgula)</Label>
                    <Textarea
                      value={parameters.metrics.categories.join(", ")}
                      onChange={(e) => handleParameterChange('metrics', 'categories', e.target.value.split(",").map(s => s.trim()))}
                      placeholder="Investimento, Inovação, Patentes..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Período Temporal</Label>
                    <Input
                      value={parameters.metrics.timePeriod}
                      onChange={(e) => handleParameterChange('metrics', 'timePeriod', e.target.value)}
                      placeholder="ex: 2020-2024"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Regiões (separadas por vírgula)</Label>
                    <Textarea
                      value={parameters.metrics.regions.join(", ")}
                      onChange={(e) => handleParameterChange('metrics', 'regions', e.target.value.split(",").map(s => s.trim()))}
                      placeholder="Portugal, Europa..."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="source-attr" 
                      checked={parameters.metrics.includeSourceAttribution}
                      onCheckedChange={(checked) => handleParameterChange('metrics', 'includeSourceAttribution', !!checked)}
                    />
                    <label
                      htmlFor="source-attr"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Incluir atribuição de fonte (ex: DGEEC, INE)
                    </label>
                  </div>
                </TabsContent>
                
                <TabsContent value="patents" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Setores (separados por vírgula)</Label>
                    <Textarea
                      value={parameters.patents.sectors.join(", ")}
                      onChange={(e) => handleParameterChange('patents', 'sectors', e.target.value.split(",").map(s => s.trim()))}
                      placeholder="TICs, Saúde, Energia..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tipos de Organizações (separados por vírgula)</Label>
                    <Textarea
                      value={parameters.patents.organizationTypes.join(", ")}
                      onChange={(e) => handleParameterChange('patents', 'organizationTypes', e.target.value.split(",").map(s => s.trim()))}
                      placeholder="Empresas, Universidades, Laboratórios..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Período Temporal</Label>
                    <Input
                      value={parameters.patents.timePeriod}
                      onChange={(e) => handleParameterChange('patents', 'timePeriod', e.target.value)}
                      placeholder="ex: 2020-2024"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="intl-data" 
                      checked={parameters.patents.includeInternationalData}
                      onCheckedChange={(checked) => handleParameterChange('patents', 'includeInternationalData', !!checked)}
                    />
                    <label
                      htmlFor="intl-data"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Incluir dados internacionais
                    </label>
                  </div>
                </TabsContent>
                
                <TabsContent value="institutions" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipos de Instituições (separados por vírgula)</Label>
                    <Textarea
                      value={parameters.institutions.types.join(", ")}
                      onChange={(e) => handleParameterChange('institutions', 'types', e.target.value.split(",").map(s => s.trim()))}
                      placeholder="Empresas, Universidades, CoLABs..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Regiões (separadas por vírgula)</Label>
                    <Textarea
                      value={parameters.institutions.regions.join(", ")}
                      onChange={(e) => handleParameterChange('institutions', 'regions', e.target.value.split(",").map(s => s.trim()))}
                      placeholder="Norte, Centro, Lisboa..."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="collab-data" 
                      checked={parameters.institutions.includeCollaborationData}
                      onCheckedChange={(checked) => handleParameterChange('institutions', 'includeCollaborationData', !!checked)}
                    />
                    <label
                      htmlFor="collab-data"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Incluir dados de colaboração
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="proj-history" 
                      checked={parameters.institutions.includeProjectHistory}
                      onCheckedChange={(checked) => handleParameterChange('institutions', 'includeProjectHistory', !!checked)}
                    />
                    <label
                      htmlFor="proj-history"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Incluir histórico de projetos
                    </label>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                onClick={generateSyntheticData}
                disabled={generatingData}
              >
                {generatingData ? (
                  <>
                    <RefreshCw className="h-6 w-6 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Database className="h-6 w-6 mr-2" />
                    Gerar Dados Sintéticos SQL
                  </>
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Clique no botão acima para gerar os dados SQL com base nos parâmetros selecionados
              </p>
            </CardFooter>
          </Card>

          <div className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Exemplos de Fontes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BarChart className="h-3 w-3" />
                    DGEEC
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    FCT
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    IAPMEI
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    INPI
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Os dados sintéticos gerados são modelados a partir das fontes de dados oficiais da ANI, incluindo sistemas internos e parcerias externas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  SQL Gerado
                </span>
                {generatedData && (
                  <Button variant="outline" size="sm" onClick={downloadSQL}>
                    <Download className="h-4 w-4 mr-2" />
                    Download SQL
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Comandos SQL para geração de dados sintéticos
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <Textarea
                value={generatedData}
                placeholder="O SQL gerado aparecerá aqui após clicar no botão 'Gerar Dados Sintéticos SQL'"
                className="h-[500px] font-mono text-sm"
                readOnly
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="md:hidden fixed bottom-6 right-6 left-6 z-10">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 shadow-lg rounded-xl"
          onClick={generateSyntheticData}
          disabled={generatingData}
        >
          {generatingData ? (
            <>
              <RefreshCw className="h-6 w-6 mr-2 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Database className="h-6 w-6 mr-2" />
              Gerar Dados Sintéticos
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SyntheticDataPage;
