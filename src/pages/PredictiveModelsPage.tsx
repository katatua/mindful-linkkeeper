
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { PredictiveAnalytics } from "@/components/analytics/PredictiveAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PredictiveModelsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">Modelos Preditivos</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modelos Preditivos e Análise Avançada</CardTitle>
          <CardDescription>
            Ferramentas para previsão, simulação e análise de cenários futuros baseados em dados históricos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PredictiveAnalytics />
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveModelsPage;
