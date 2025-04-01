
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FundingSuccessModel } from '@/components/predictive/FundingSuccessModel';
import { useLanguage } from '@/contexts/LanguageContext';

const PredictiveModelsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('predictive_models.title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('predictive_models.funding_success.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <FundingSuccessModel />
          </CardContent>
        </Card>
        {/* Add more predictive models here in the future */}
      </div>
    </div>
  );
};

export default PredictiveModelsPage;
