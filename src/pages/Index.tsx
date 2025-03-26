import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { DatabaseStatusRetriever } from "@/components/DatabaseStatusRetriever";

const Index = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const goToDashboard = () => {
    navigate("/portal");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div 
        className="flex items-center gap-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={goToDashboard}
      >
        <img 
          src="https://via.placeholder.com/50?text=ANI" 
          alt="ANI Logo" 
          className="h-12 w-12 rounded" 
        />
        <h1 className="text-2xl font-bold">{t('app.title') || 'ANI Innovation Platform'}</h1>
      </div>
      
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">{language === 'en' ? 'ANI Innovation Platform' : 'Plataforma de Inovação ANI'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            {t('index.welcome') || 'Welcome to the ANI Innovation Platform'}. {t('index.choose') || 'Choose an option below:'}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button onClick={goToDashboard} className="w-full">{t('index.view.dashboard') || 'View Dashboard'}</Button>
            <Link to="/portal">
              <Button className="w-full" variant="outline">{t('index.ai.assistant') || 'AI Assistant'}</Button>
            </Link>
          </div>
          
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-medium mb-4">Database Status</h3>
            <DatabaseStatusRetriever />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
