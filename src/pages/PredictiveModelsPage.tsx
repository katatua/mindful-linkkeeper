
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FundingSuccessModel } from '@/components/predictive/FundingSuccessModel';
import { FundingSuccessModelV2 } from '@/components/predictive/FundingSuccessModelV2';
import { InnovationTrendsModel } from '@/components/predictive/InnovationTrendsModel';
import { useLanguage } from '@/contexts/LanguageContext';

const PredictiveModelsPage = () => {
  const { t } = useLanguage();
  const [activeFundingModelVersion, setActiveFundingModelVersion] = useState("v1");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('predictive_models.title')}</h1>
      
      <div className="grid grid-cols-1 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle>{t('predictive_models.innovation_trends.title') || "Previsão de Tendências de Inovação"}</CardTitle>
          </CardHeader>
          <CardContent>
            <InnovationTrendsModel />
          </CardContent>
        </Card>
        {/* Add more predictive models here in the future */}
      </div>
    </div>
  );
};

export default PredictiveModelsPage;
