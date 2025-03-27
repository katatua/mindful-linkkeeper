
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { QueryHistoryViewer } from "@/components/QueryHistoryViewer";

export default function QueryHistoryPage() {
  const { language } = useLanguage();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'Database Query History' : 'Histórico de Consultas ao Banco de Dados'}
      </h1>
      
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
