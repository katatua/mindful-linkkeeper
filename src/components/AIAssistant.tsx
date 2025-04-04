
import React from 'react';
import { AIChat } from '@/components/chat/AIChat';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export const AIAssistant: React.FC = () => {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertTitle>Dica de uso</AlertTitle>
        <AlertDescription>
          Este assistente é dedicado exclusivamente para consultas sobre <strong>dados e estatísticas</strong> da base de dados.
          Para perguntas gerais sobre a ANI ou outras informações, utilize o assistente flutuante no canto inferior direito.
        </AlertDescription>
      </Alert>
      <AIChat />
    </div>
  );
};
