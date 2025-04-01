
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Database, User, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  isLoading?: boolean;
  error?: boolean;
  results?: any[] | null;
  sqlQuery?: string;
  isAIResponse?: boolean;
  baiResponse?: string;
  baiError?: string;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  role,
  isLoading,
  error,
  results,
  sqlQuery,
  isAIResponse,
  baiResponse,
  baiError,
  className,
}) => {
  const formatBaiResponse = (response: string) => {
    if (!response) return "";
    
    try {
      const parsed = JSON.parse(response);
      
      if (typeof parsed === 'object') {
        if (parsed.text || parsed.content || parsed.message) {
          return parsed.text || parsed.content || parsed.message;
        }
        
        return Object.entries(parsed)
          .map(([key, value]) => {
            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
            return `**${formattedKey}**: ${value}`;
          })
          .join('\n\n');
      }
      
      return response;
    } catch (e) {
      return response;
    }
  };

  const formattedBaiResponse = baiResponse ? formatBaiResponse(baiResponse) : "";

  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg",
        role === 'user' ? "bg-blue-50" : "bg-gray-50",
        className
      )}
    >
      <Avatar className={cn(
        "h-8 w-8 shrink-0",
        role === 'user' ? "bg-blue-100" : "bg-primary/10"
      )}>
        {role === 'user' ? (
          <User className="h-4 w-4 text-blue-700" />
        ) : (
          isAIResponse ? (
            <BookOpen className="h-4 w-4 text-primary" />
          ) : (
            <Database className="h-4 w-4 text-primary" />
          )
        )}
        <AvatarFallback>
          {role === 'user' ? 'U' : 'AI'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="text-xl font-bold">
          {role === 'user' ? 'Você' : 'Assistente'}
          {isAIResponse && (
            <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Conhecimento Geral
            </span>
          )}
        </div>
        <div className="whitespace-pre-wrap text-sm">{content}</div>
        
        {results && results.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <div className="flex items-center gap-1 mb-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="text-xl font-bold">Base de dados</span>
            </div>
            <div className="overflow-x-auto border rounded-md">
              {/* Renderização dos resultados da base de dados */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {results[0] && Object.keys(results[0]).map((column) => (
                      <th 
                        key={column}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.entries(row).map(([column, value]) => (
                        <td 
                          key={`${rowIndex}-${column}`}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {value === null ? 'null' : 
                           typeof value === 'object' ? JSON.stringify(value) : 
                           String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {sqlQuery && (
              <div className="pt-2">
                <div className="flex items-center gap-1 text-sm font-medium text-gray-500 mb-1">
                  <Database className="h-4 w-4" />
                  <span>Consulta SQL:</span>
                </div>
                <pre className="bg-gray-800 text-gray-100 p-2 rounded-md text-sm overflow-x-auto">
                  {sqlQuery}
                </pre>
              </div>
            )}
          </div>
        )}
        
        {baiResponse && (
          <div className="mt-4 border-t pt-3">
            <div className="flex items-center gap-1 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-xl font-bold">Chat4Business - Resposta do Assistente ANI</span>
            </div>
            <div className="whitespace-pre-wrap text-sm bg-blue-50 p-3 rounded">
              {formattedBaiResponse.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h3 key={index} className="font-bold text-base mt-2 mb-1">
                      {paragraph.replace(/\*\*/g, '')}
                    </h3>
                  );
                }
                
                if (paragraph.startsWith('**')) {
                  const parts = paragraph.split('**');
                  return (
                    <div key={index} className="mb-2">
                      <span className="font-semibold">{parts[1]}</span>
                      {parts[2] || ''}
                    </div>
                  );
                }
                
                return paragraph ? (
                  <p key={index} className="mb-2">
                    {paragraph}
                  </p>
                ) : (
                  <br key={index} />
                );
              })}
            </div>
          </div>
        )}
        
        {baiError && !baiResponse && (
          <div className="mt-4">
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm text-red-600">
                <span className="font-semibold">Erro Assistente ANI:</span> {baiError}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};
