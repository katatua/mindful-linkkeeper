import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Database, User, AlertCircle, FileText, FileDown, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QueryResults } from '@/components/chat/QueryResults';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  supportingDocuments?: Array<{title: string, url: string, relevance?: number}>;
  baiFiles?: Array<{filename: string | null, download_url: string}>;
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
  supportingDocuments,
  baiFiles,
  className,
}) => {
  const formatBaiResponse = (response: string) => {
    if (!response) return "";
    
    if (response.trim().startsWith('{') && response.trim().endsWith('}')) {
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
      } catch (e) {
      }
    }
    
    return response;
  };

  const formattedBaiResponse = baiResponse ? formatBaiResponse(baiResponse) : "";
  
  const extractLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s"'<>]+)/g;
    return text.match(urlRegex) || [];
  };
  
  const embeddedLinks = [
    ...(formattedBaiResponse ? extractLinks(formattedBaiResponse) : []),
    ...(baiFiles ? baiFiles
      .filter(file => file.download_url && file.download_url.trim() !== '')
      .map(file => file.download_url) 
      : []
    )
  ];

  console.log("Extracted links:", embeddedLinks); // Debug log to see extracted links
  
  const hasValidFiles = baiFiles && baiFiles.length > 0 && baiFiles.some(file => file.download_url && file.download_url.trim() !== "");

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
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="text-xl font-bold">
          {role === 'user' ? 'Você' : 'Assistente'}
          {isAIResponse && (
            <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Conhecimento Geral
            </span>
          )}
        </div>
        <div className="whitespace-pre-wrap text-sm break-words overflow-auto max-w-full">{content}</div>
        
        {results && results.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <div className="flex items-center gap-1 mb-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="text-xl font-bold">Base de dados</span>
            </div>
            <ScrollArea className="max-h-[400px]">
              <QueryResults results={results} sqlQuery={sqlQuery} />
            </ScrollArea>
          </div>
        )}
        
        {baiResponse && (
          <div className="mt-4 border-t pt-3">
            <div className="flex items-center gap-1 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-xl font-bold">Chat4Business - Resposta do Assistente ANI</span>
            </div>
            <div className="whitespace-pre-wrap text-sm bg-blue-50 p-3 rounded break-words overflow-auto">
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
            
            {hasValidFiles && (
              <div className="mt-4 border-t pt-3">
                <div className="flex items-center gap-1 mb-2">
                  <FileDown className="h-4 w-4 text-primary" />
                  <span className="text-xl font-bold">Arquivos de Referência</span>
                </div>
                <div className="space-y-2">
                  {baiFiles.map((file, index) => {
                    if (!file.download_url || file.download_url.trim() === "") return null;
                    
                    const fileName = file.filename || file.download_url.split('/').pop() || `Arquivo ${index + 1}`;
                    const isExternalLink = file.download_url.startsWith('http');
                    const fileType = file.download_url.toLowerCase().endsWith('.csv') ? 'CSV' : 
                                     file.download_url.toLowerCase().endsWith('.pdf') ? 'PDF' : 
                                     file.download_url.toLowerCase().endsWith('.xlsx') ? 'Excel' : 'Documento';
                    
                    return (
                      <div key={index} className="flex items-start p-2 bg-gray-50 rounded border border-gray-100">
                        {isExternalLink ? (
                          <LinkIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                        ) : (
                          <FileDown className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <a 
                            href={file.download_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline font-medium break-all"
                          >
                            {fileName}
                          </a>
                          <div className="text-xs text-gray-500 mt-1">
                            {fileType} • {isExternalLink ? 'Link externo' : 'Arquivo para download'}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => window.open(file.download_url, '_blank')}
                          className="ml-2 shrink-0"
                        >
                          {isExternalLink ? 'Abrir' : 'Download'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {supportingDocuments && supportingDocuments.length > 0 && (
              <div className="mt-4 border-t pt-3">
                <div className="flex items-center gap-1 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-xl font-bold">Documentos de Suporte</span>
                </div>
                <div className="space-y-2">
                  {supportingDocuments.map((doc, index) => (
                    <div key={index} className="flex items-start p-2 bg-gray-50 rounded border border-gray-100">
                      <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium break-all">
                          {doc.title}
                        </a>
                        {doc.relevance && (
                          <div className="text-xs text-gray-500 mt-1">
                            Relevância: {Math.round(doc.relevance * 100)}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {baiError && !baiResponse && (
          <div className="mt-4">
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm text-red-600 break-words">
                <span className="font-semibold">Erro Assistente ANI:</span> {baiError}
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {embeddedLinks.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <div className="flex items-center gap-1 mb-2">
              <LinkIcon className="h-4 w-4 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">Links Referenciados</span>
            </div>
            <ScrollArea className="max-h-[200px]">
              <div className="space-y-2">
                {embeddedLinks.map((link, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-2 bg-blue-50 rounded border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    <LinkIcon className="h-5 w-5 text-blue-600 mr-2 shrink-0" />
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-700 hover:underline break-all max-w-full overflow-hidden"
                    >
                      {link}
                    </a>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
