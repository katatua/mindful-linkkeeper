
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, BarChart4, PieChart } from "lucide-react";
import { FundingSuccessModel } from "@/components/predictive/FundingSuccessModel";

export const PredictiveAnalytics = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.predictive.title')}</CardTitle>
          <CardDescription>
            {t('analytics.predictive.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="funding-success">Sucesso de Financiamento</TabsTrigger>
              <TabsTrigger value="sector-growth">Crescimento Setorial</TabsTrigger>
              <TabsTrigger value="market-impact">Impacto no Mercado</TabsTrigger>
              <TabsTrigger value="policy-effects">Efeitos de Políticas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">{t('analytics.predictive.funding')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('analytics.predictive.funding.description')}
                    </p>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">{t('analytics.predictive.factors')}</h4>
                      <ul className="list-disc list-inside text-xs space-y-1 text-gray-600">
                        <li>{t('analytics.predictive.factor1')}</li>
                        <li>{t('analytics.predictive.factor2')}</li>
                        <li>{t('analytics.predictive.factor3')}</li>
                        <li>{t('analytics.predictive.factor4')}</li>
                        <li>{t('analytics.predictive.factor5')}</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">{t('analytics.predictive.trends')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('analytics.predictive.trends.description')}
                    </p>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Quantum Computing</span>
                          <span className="font-medium">92% {t('analytics.predictive.confidence')}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Advanced Biotech</span>
                          <span className="font-medium">87% {t('analytics.predictive.confidence')}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "87%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Green Hydrogen</span>
                          <span className="font-medium">83% {t('analytics.predictive.confidence')}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: "83%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">{t('analytics.predictive.simulation')}</CardTitle>
                  <CardDescription>
                    {t('analytics.predictive.simulation.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">{t('analytics.predictive.scenario.conservative')}</h4>
                      <ul className="text-xs space-y-2">
                        <li className="flex justify-between">
                          <span>{t('analytics.predictive.metric.jobs')}</span>
                          <span className="font-medium">+12,000</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t('analytics.predictive.metric.gdp')}</span>
                          <span className="font-medium">+0.8%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t('analytics.predictive.metric.patents')}</span>
                          <span className="font-medium">+320</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-3 border-blue-200 bg-blue-50">
                      <h4 className="text-sm font-medium mb-2">{t('analytics.predictive.scenario.moderate')}</h4>
                      <ul className="text-xs space-y-2">
                        <li className="flex justify-between">
                          <span>{t('analytics.predictive.metric.jobs')}</span>
                          <span className="font-medium">+24,000</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t('analytics.predictive.metric.gdp')}</span>
                          <span className="font-medium">+1.5%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t('analytics.predictive.metric.patents')}</span>
                          <span className="font-medium">+580</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">{t('analytics.predictive.scenario.ambitious')}</h4>
                      <ul className="text-xs space-y-2">
                        <li className="flex justify-between">
                          <span>{t('analytics.predictive.metric.jobs')}</span>
                          <span className="font-medium">+38,000</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t('analytics.predictive.metric.gdp')}</span>
                          <span className="font-medium">+2.3%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t('analytics.predictive.metric.patents')}</span>
                          <span className="font-medium">+780</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="funding-success">
              <FundingSuccessModel />
            </TabsContent>
            
            <TabsContent value="sector-growth">
              <Card>
                <CardHeader>
                  <CardTitle>Previsão de Crescimento por Setor</CardTitle>
                  <CardDescription>
                    Projeções de crescimento para diferentes setores baseadas em análise de tendências históricas e indicadores atuais.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-12">
                    <p className="text-muted-foreground">Modelo em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="market-impact">
              <Card>
                <CardHeader>
                  <CardTitle>Impacto de Mercado de Projetos</CardTitle>
                  <CardDescription>
                    Previsão do potencial impacto econômico e de mercado para projetos de inovação.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-12">
                    <p className="text-muted-foreground">Modelo em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="policy-effects">
              <Card>
                <CardHeader>
                  <CardTitle>Simulação de Efeitos de Políticas</CardTitle>
                  <CardDescription>
                    Análise preditiva dos efeitos de diferentes políticas de inovação na economia.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-12">
                    <p className="text-muted-foreground">Modelo em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
