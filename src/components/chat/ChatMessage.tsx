
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Database, User, AlertCircle, FileText, FileDown, Link as LinkIcon, BarChart, LineChart, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QueryResults } from '@/components/chat/QueryResults';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { isChartRequest, determineChartType, generateSampleChartData } from '@/utils/baiApiUtils';
import ChartDisplay from '@/components/charts/ChartDisplay';

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
  intentAlias?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  role,
  intentAlias,
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
  // Format BAI responses that might be in JSON format
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
        // Silent fail if not valid JSON
      }
    }
    
    return response;
  };

  const formattedBaiResponse = baiResponse ? formatBaiResponse(baiResponse) : "";
  
  // Extract links from the BAI response
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
  
  const hasValidFiles = baiFiles && baiFiles.length > 0 && baiFiles.some(file => file.download_url && file.download_url.trim() !== "");

  const messageContent = content || '';
  
  // Check if this is a chart request either by content analysis or intent alias
  const isChart = isChartRequest(messageContent) || (intentAlias === 'criar-grafico');
  
  // Determine chart type and generate sample data if it's a chart request
  const chartType = isChart ? determineChartType(messageContent || intentAlias || '') : null;
  const chartData = chartType ? generateSampleChartData(chartType, messageContent) : null;
  
  // Flag to determine if we should hide database results
  const shouldHideResults = isChart || (baiResponse && (!results || results.length === 0));

  const handleAssistantBadgeClick = () => {
    // Try to maximize the BAI widget if available
    if (window.BAI && typeof window.BAI.maximizeWidget === 'function') {
      window.BAI.maximizeWidget();
    } else {
      // Try to find and click the maximize button
      const widgetMaximizeButton = document.querySelector('.bai-widget-maximize-button');
      if (widgetMaximizeButton && widgetMaximizeButton instanceof HTMLElement) {
        widgetMaximizeButton.click();
      }
      
      // If there's a response from the assistant, scroll to it
      if (baiResponse) {
        // Find the BAI response section and scroll to it
        const baiResponseSection = document.querySelector('[data-bai-response]');
        if (baiResponseSection) {
          baiResponseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  // Chart icon based on chart type
  const getChartIcon = () => {
    if (!chartType) return null;
    
    switch (chartType) {
      case 'bar':
        return <BarChart className="h-4 w-4 text-blue-600" />;
      case 'line':
        return <LineChart className="h-4 w-4 text-blue-600" />;
      case 'pie':
      case 'doughnut':
        return <PieChart className="h-4 w-4 text-blue-600" />;
      default:
        return <BarChart className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg mb-4",
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
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xl font-bold">
            {role === 'user' ? 'Você' : 'Assistente'}
          </span>
          
          {role === 'user' && intentAlias && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              intent found: {intentAlias}
            </span>
          )}
          
          {role === 'assistant' && (
            <button 
              onClick={handleAssistantBadgeClick}
              className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Chat4Business - Resposta do Assistente ANI
            </button>
          )}
        </div>
        
        <div className="whitespace-pre-wrap text-sm break-words overflow-auto max-w-full">
          {content}
        </div>
        
        {/* Only show database results if we shouldn't hide them */}
        {results && results.length > 0 && !shouldHideResults && (
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
          <div className="mt-4 border-t pt-3" data-bai-response>
            <div className="flex items-center gap-1 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-xl font-bold">
                <button 
                  onClick={handleAssistantBadgeClick}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Chat4Business - Resposta do Assistente ANI
                </button>
              </span>
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
        
        {/* Always display chart in assistant message when it's a chart request */}
        {role === 'assistant' && isChart && chartType && chartData && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-1">
            <div className="flex items-center gap-1 mb-2 px-3 pt-2">
              {getChartIcon()}
              <span className="text-lg font-semibold text-blue-700">
                Visualização do Gráfico
              </span>
            </div>
            <ChartDisplay 
              chartType={chartType} 
              chartData={chartData} 
              title={`Gráfico de ${chartType === 'bar' ? 'Barras' : 
                        chartType === 'line' ? 'Linhas' : 
                        chartType === 'pie' ? 'Pizza' : 
                        'Visualização'}`} 
              description="Visualização gerada com base na sua solicitação"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
