
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FundingAnalytics } from "@/components/analytics/FundingAnalytics";
import { SectorAnalytics } from "@/components/analytics/SectorAnalytics";
import { PerformanceAnalytics } from "@/components/analytics/PerformanceAnalytics";
import { RegionalAnalytics } from "@/components/analytics/RegionalAnalytics";
import { PredictiveAnalytics } from "@/components/analytics/PredictiveAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";

const AnalyticsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  const handleExport = () => {
    toast({
      title: t('analytics.export.started'),
      description: t('analytics.export.description'),
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t('analytics.title')}</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={t('analytics.search')}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" /> {t('analytics.filter')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> {t('analytics.export')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="funding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funding">{t('analytics.tab.funding')}</TabsTrigger>
          <TabsTrigger value="sectors">{t('analytics.tab.sectors')}</TabsTrigger>
          <TabsTrigger value="performance">{t('analytics.tab.performance')}</TabsTrigger>
          <TabsTrigger value="regional">{t('analytics.tab.regional')}</TabsTrigger>
          <TabsTrigger value="predictive">{t('analytics.tab.predictive')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="funding">
          <FundingAnalytics />
        </TabsContent>
        
        <TabsContent value="sectors">
          <SectorAnalytics />
        </TabsContent>
        
        <TabsContent value="performance">
          <PerformanceAnalytics />
        </TabsContent>
        
        <TabsContent value="regional">
          <RegionalAnalytics />
        </TabsContent>
        
        <TabsContent value="predictive">
          <PredictiveAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
