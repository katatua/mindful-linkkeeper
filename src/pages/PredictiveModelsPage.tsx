import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FundingSuccessModel } from '@/components/predictive/FundingSuccessModel';
import { FundingSuccessModelV2 } from '@/components/predictive/FundingSuccessModelV2';
import { InnovationTrendsModel } from '@/components/predictive/InnovationTrendsModel';
import { InnovationImpactModel } from '@/components/predictive/InnovationImpactModel';
import { EconomicImpactModel } from '@/components/predictive/EconomicImpactModel';
import { AutoMLModelSelector } from '@/components/predictive/AutoMLModelSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from "@/components/ui/sonner";

const PredictiveModelsPage = () => {
  const { t } = useLanguage();
  const [activeFundingModelVersion, setActiveFundingModelVersion] = useState("v1");
  const [activeModel, setActiveModel] = useState("funding");

  // Define the available models
  const models = [
    { id: "funding", name: t('predictive_models.funding_success.title') || "Previsão de Sucesso de Financiamento" },
    { id: "automl", name: t('predictive.automl.title') || "Seleção Automática de Modelos" },
    { id: "trends", name: t('predictive_models.innovation_trends.title') || "Previsão de Tendências de Inovação" },
    { id: "impact", name: "Simulação de Impacto de Inovação" },
    { id: "economic", name: "Impacto Econômico" }
  ];

  // Get the current model name to display in the dropdown button
  const currentModelName = models.find(model => model.id === activeModel)?.name || models[0].name;

  const handleAutoMLAction = (action: string) => {
    switch(action) {
      case 'details':
        toast.info("Detalhes do AutoML", {
          description: "Exibindo informações detalhadas sobre o modelo de seleção automática."
        });
        break;
      case 'execute':
        toast.success("Executando AutoML", {
          description: "Iniciando o processo de seleção e treinamento de modelo automático."
        });
        break;
    }
  };

  // Render the selected model component
  const renderActiveModel = () => {
    switch (activeModel) {
      case "funding":
        return (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <CardTitle>{t('predictive_models.funding_success.title')}</CardTitle>
                <Tabs value={activeFundingModelVersion} onValueChange={setActiveFundingModelVersion} className="w-auto">
                  <TabsList>
                    <TabsTrigger value="v1">Modelo V1</TabsTrigger>
                    <TabsTrigger value="v2">Modelo V2</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {activeFundingModelVersion === "v1" ? (
                <FundingSuccessModel />
              ) : (
                <FundingSuccessModelV2 />
              )}
            </CardContent>
          </Card>
        );
      case "automl":
        return (
          <div className="flex justify-between items-center mb-4">
            <AutoMLModelSelector />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-4">
                  Visualização
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => handleAutoMLAction('details')}>
                  Ver Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAutoMLAction('execute')}>
                  Executar AutoML
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      case "trends":
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t('predictive_models.innovation_trends.title') || "Previsão de Tendências de Inovação"}</CardTitle>
            </CardHeader>
            <CardContent>
              <InnovationTrendsModel />
            </CardContent>
          </Card>
        );
      case "impact":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Simulação de Impacto de Inovação</CardTitle>
            </CardHeader>
            <CardContent>
              <InnovationImpactModel />
            </CardContent>
          </Card>
        );
      case "economic":
        return <EconomicImpactModel />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">{t('predictive_models.title')}</h1>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {currentModelName}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {models.map((model) => (
              <DropdownMenuItem 
                key={model.id} 
                onClick={() => setActiveModel(model.id)}
                className="cursor-pointer"
              >
                {model.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {renderActiveModel()}
      </div>
    </div>
  );
};

export default PredictiveModelsPage;
