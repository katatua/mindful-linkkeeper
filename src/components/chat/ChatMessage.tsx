
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
        <div className="text-sm font-semibold">
          {role === 'user' ? 'Você' : 'Assistente'}
          {isAIResponse && (
            <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Conhecimento Geral
            </span>
          )}
        </div>
        <div className="whitespace-pre-wrap text-sm">{content}</div>
        
        {/* Display BAI Response if available */}
        {baiResponse && (
          <div className="mt-4 border-t pt-3">
            <div className="flex items-center gap-1 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Resposta do Assistente ANI:</span>
            </div>
            <div className="whitespace-pre-wrap text-sm bg-blue-50 p-3 rounded">
              {baiResponse}
            </div>
          </div>
        )}
        
        {/* Display BAI Error if available */}
        {baiError && (
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
