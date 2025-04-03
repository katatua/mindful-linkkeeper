import React from 'react';
import { cn } from "@/lib/utils";
import { QueryResults } from '@/components/chat/QueryResults';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  sqlQuery?: string;
  results?: any[] | null;
  className?: string;
  isAIResponse?: boolean;
  baiResponse?: string;
  baiError?: string;
  supportingDocuments?: Array<{title: string, url: string, relevance?: number}>;
  baiFiles?: Array<{filename: string | null, download_url: string}>;
  intentAlias?: string;
}

import { BaiResponseChartRenderer } from '@/components/charts/BaiResponseChartRenderer';

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  role,
  sqlQuery,
  results,
  className,
  isAIResponse,
  baiResponse,
  baiError,
  supportingDocuments,
  baiFiles,
  intentAlias
}) => {
  
  // Check if this is a chart request
  const isChartIntent = intentAlias === 'criar-grafico';
  
  return (
    <div
      className={cn(
        'flex flex-col rounded-lg p-3 max-w-full',
        role === 'user' ? 'bg-secondary ml-auto' : 'bg-muted',
        className
      )}
    >
      <div className={cn('text-sm whitespace-pre-wrap', role === 'user' ? 'ml-auto' : '')}>
        {content}
      </div>
      
      {/* Render chart for chart intents */}
      {isChartIntent && (
        <BaiResponseChartRenderer 
          query={content}
          baiResponse={baiResponse}
          intentAlias={intentAlias}
        />
      )}
      
      {sqlQuery && (
        <div className="mt-2 p-2 bg-gray-900 text-green-400 rounded-md overflow-x-auto">
          <pre className="text-xs">{sqlQuery}</pre>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="mt-2">
          <QueryResults results={results} />
        </div>
      )}
      
      {baiResponse && !isChartIntent && (
        <div className="mt-2 p-3 bg-blue-50 text-blue-800 rounded-md">
          <h4 className="text-xs font-semibold mb-1">Resposta do Assistente BAI:</h4>
          <div className="text-sm whitespace-pre-wrap">{baiResponse}</div>
        </div>
      )}
      
      {baiError && (
        <div className="mt-2 p-3 bg-red-50 text-red-800 rounded-md">
          <h4 className="text-xs font-semibold mb-1">Erro na Consulta BAI:</h4>
          <div className="text-sm whitespace-pre-wrap">{baiError}</div>
        </div>
      )}
      
      {supportingDocuments && supportingDocuments.length > 0 && (
        <div className="mt-2 p-3 bg-amber-50 rounded-md">
          <h4 className="text-xs font-semibold mb-1 text-amber-800">Documentos de Referência:</h4>
          <ul className="text-sm space-y-1">
            {supportingDocuments.map((doc, idx) => (
              <li key={idx} className="flex items-center">
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {doc.title}
                </a>
                {doc.relevance && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Relevância: {Math.round(doc.relevance * 100)}%)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {baiFiles && baiFiles.length > 0 && (
        <div className="mt-2 p-3 bg-purple-50 rounded-md">
          <h4 className="text-xs font-semibold mb-1 text-purple-800">Arquivos Gerados:</h4>
          <ul className="text-sm space-y-1">
            {baiFiles.map((file, idx) => (
              <li key={idx}>
                <a 
                  href={file.download_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {file.filename || `Arquivo ${idx+1}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
