
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Database, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  isLoading?: boolean;
  error?: boolean;
  results?: any[] | null;
  sqlQuery?: string;
  isAIResponse?: boolean;
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
      </div>
    </div>
  );
};
