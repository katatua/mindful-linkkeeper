
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export const PredictiveAnalytics = () => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('analytics.predictive.title')}</CardTitle>
        <CardDescription>
          {t('analytics.predictive.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};
