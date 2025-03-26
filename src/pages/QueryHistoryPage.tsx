
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { QueryHistoryViewer } from "@/components/QueryHistoryViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QueryHistoryPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/portal/database");
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack} 
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Back to Database' : 'Voltar para o Banco de Dados'}
        </Button>
        <h1 className="text-2xl font-bold">
          {language === 'en' ? 'Database Query History' : 'Histórico de Consultas ao Banco de Dados'}
        </h1>
      </div>
      
      <div className="mb-6">
        <p className="text-muted-foreground">
          {language === 'en' 
            ? 'This page shows all past database queries, their results, and any actions taken by the system to resolve the queries (like creating tables or adding data).'
            : 'Esta página mostra todas as consultas anteriores ao banco de dados, seus resultados e quaisquer ações tomadas pelo sistema para resolver as consultas (como criar tabelas ou adicionar dados).'}
        </p>
      </div>
      
      <div className="grid gap-6">
        <QueryHistoryViewer />
      </div>
    </div>
  );
}
