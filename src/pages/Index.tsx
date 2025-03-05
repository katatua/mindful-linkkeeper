
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">ANI Innovation Platform</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            {t('index.welcome')}. {t('index.choose')}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link to="/dashboard">
              <Button className="w-full">{t('index.view.dashboard')}</Button>
            </Link>
            <Link to="/assistant">
              <Button className="w-full" variant="outline">{t('index.ai.assistant')}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
