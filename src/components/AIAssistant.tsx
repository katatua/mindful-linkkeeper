
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, AlertCircle, Database, PlusCircle, Loader2 } from 'lucide-react';
import { suggestedDatabaseQuestions, generateResponse, genId, formatDatabaseValue, executePredefinedQuery } from '@/utils/aiUtils';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PopulateDataButton } from '@/components/database/PopulateDataButton';
import { QueryDataRecommendations } from '@/components/database/QueryDataRecommendations';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  sqlQuery?: string;
  results?: any[] | null;
  error?: boolean;
  noResults?: boolean;
  timestamp?: Date;
  queryId?: string;
  analysis?: any;
  isPredefined?: boolean;
}

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Filter for Portuguese suggestions
  const portugueseSuggestions = suggestedDatabaseQuestions.filter(q => 
    /[áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/.test(q) || 
    /\b(qual|como|onde|quem|porque|quais|quando)\b/i.test(q)
  ).slice(0, 6);
  
  // Add event listener for setting input from examples
  useEffect(() => {
    const handleSetQueryInput = (e: CustomEvent) => {
      if (e.detail?.query) {
        setInput(e.detail.query);
      }
    };
    
    window.addEventListener('set-query-input', handleSetQueryInput as EventListener);
    
    return () => {
      window.removeEventListener('set-query-input', handleSetQueryInput as EventListener);
    };
  }, []);
  
  // Add event listener for executing predefined queries
  useEffect(() => {
    const handleExecutePredefinedQuery = async (e: CustomEvent) => {
      if (e.detail?.queryName) {
        await executePredefinedQueryHandler(e.detail.queryName);
      }
    };
    
    window.addEventListener('execute-predefined-query', handleExecutePredefinedQuery as EventListener);
    
    return () => {
      window.removeEventListener('execute-predefined-query', handleExecutePredefinedQuery as EventListener);
    };
  }, []);
  
  const executePredefinedQueryHandler = async (queryName: string) => {
    setIsLoading(true);
    
    try {
      const userMessage: Message = {
        id: genId(),
        content: `Execute predefined query: ${queryName}`,
        role: 'user',
        timestamp: new Date(),
        isPredefined: true
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      const response = await executePredefinedQuery(queryName);
      
      const assistantMessage: Message = {
        id: genId(),
        content: response.message,
        sqlQuery: response.sqlQuery,
        results: response.results,
        role: 'assistant',
        noResults: response.noResults,
        timestamp: new Date(),
        isPredefined: true
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error executing predefined query:', error);
      
      const errorMessage: Message = {
        id: genId(),
        content: `Falha ao executar consulta predefinida: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        role: 'assistant',
        error: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Erro",
        description: "Falha ao executar consulta predefinida. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = async (question: string) => {
    setInput(question);
    await handleSubmit(new CustomEvent('click') as unknown as React.FormEvent);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: genId(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await generateResponse(input);
      
      const assistantMessage: Message = {
        id: genId(),
        content: response.message,
        sqlQuery: response.sqlQuery,
        results: response.results,
        role: 'assistant',
        noResults: response.noResults,
        timestamp: new Date(),
        queryId: response.queryId,
        analysis: response.analysis
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      try {
        const historyItem = {
          id: assistantMessage.id,
          question: input,
          timestamp: new Date(),
          result: {
            message: response.message,
            sqlQuery: response.sqlQuery,
            results: response.results
          },
          isCorrect: null,
          queryId: response.queryId
        };
        
        const existingHistory = JSON.parse(localStorage.getItem('queryHistory') || '[]');
        const updatedHistory = [historyItem, ...existingHistory];
        localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }
      
    } catch (error) {
      console.error('Error getting response:', error);
      
      const errorMessage: Message = {
        id: genId(),
        content: `Falha ao obter resposta: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Por favor, tente novamente ou reformule sua pergunta.`,
        role: 'assistant',
        error: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Erro",
        description: "Falha ao obter resposta. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setInput('');
  };

  const checkQueryStatus = async (queryId: string) => {
    if (!queryId) return null;
    
    try {
      const { data, error } = await supabase
        .from('query_history')
        .select('*')
        .eq('id', queryId)
        .single();
        
      if (error) {
        console.error('Error checking query status:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in checkQueryStatus:', error);
      return null;
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedMessages = [...messages];
      let hasUpdates = false;
      
      for (let i = 0; i < updatedMessages.length; i++) {
        const message = updatedMessages[i];
        if (message.role === 'assistant' && message.noResults && message.queryId) {
          const queryStatus = await checkQueryStatus(message.queryId);
          
          if (queryStatus && queryStatus.created_tables && queryStatus.was_successful) {
            hasUpdates = true;
            updatedMessages[i] = {
              ...message,
              content: `Os dados para sua consulta foram populados. Por favor, tente sua consulta novamente.`,
              noResults: false
            };
          }
        }
      }
      
      if (hasUpdates) {
        setMessages(updatedMessages);
        toast({
          title: "Base de Dados Atualizada",
          description: "Novos dados foram adicionados à base de dados. Você pode executar sua consulta novamente.",
        });
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, [messages, toast]);

  const renderResults = (results: any[] | null) => {
    if (!results || results.length === 0) {
      return <p className="text-gray-500 italic">Nenhum resultado encontrado</p>;
    }

    const columns = Object.keys(results[0]);

    return (
      <div className="overflow-x-auto border rounded-md mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.slice(0, 10).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map(column => (
                  <TableCell 
                    key={`${rowIndex}-${column}`}
                    data-column={column}
                  >
                    {formatDatabaseValue(row[column], column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {results.length > 10 && (
          <div className="text-xs text-gray-500 p-2 text-center border-t">
            Mostrando 10 de {results.length} resultados
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-3">Consultas Sugeridas:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {portugueseSuggestions.map((question, index) => (
              <Button 
                key={index} 
                variant="outline"
                className="text-left justify-start h-auto py-2 px-3 text-sm"
                onClick={() => handleSuggestionClick(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
        
        {messages.length === 0 && (
          <Alert variant="default" className="mb-4">
            <AlertDescription>
              Este assistente ajuda você a consultar a base de dados usando linguagem natural em português.
              Digite uma pergunta como <strong>"Qual o investimento em R&D em 2023?"</strong> ou <strong>"Mostrar todos os programas de financiamento para energia renovável"</strong>.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <ScrollArea className="space-y-4 mb-4 max-h-[400px] overflow-y-auto p-1 border rounded-md bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            <p>Faça uma pergunta sobre a base de dados, como:</p>
            <p className="italic mt-2">
              "Qual o investimento em R&D em 2023?" ou
              "Mostrar todos os projetos com maiores valores de financiamento no setor de tecnologia"
            </p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`p-3 rounded-lg mb-4 ${
                message.role === 'user' 
                  ? 'bg-blue-100 ml-8' 
                  : message.error 
                    ? 'bg-red-50 border border-red-200 mr-8' 
                    : 'bg-gray-100 mr-8'
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.role === 'user' ? 'Você' : 'Assistente'}
                {message.isPredefined && message.role === 'user' && (
                  <span className="ml-2 text-xs text-blue-600">(Consulta Predefinida)</span>
                )}
              </p>
              {message.error ? (
                <Alert variant="destructive" className="bg-transparent border-none p-0">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription className="whitespace-pre-wrap">{message.content}</AlertDescription>
                </Alert>
              ) : (
                <>
                  {message.role === 'assistant' ? (
                    <Tabs defaultValue="resposta" className="w-full">
                      <TabsList className="mb-2">
                        <TabsTrigger value="resposta">Resposta</TabsTrigger>
                        <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="resposta">
                        <div className="whitespace-pre-wrap">
                          {message.noResults ? (
                            <Alert variant="default" className="mb-3">
                              <AlertTitle>Nenhum resultado encontrado</AlertTitle>
                              <AlertDescription>
                                {message.content}
                                <div className="mt-2">
                                  <PopulateDataButton 
                                    query={
                                      messages[messages.findIndex(m => m.id === message.id) - 1]?.content || ""
                                    } 
                                    queryId={message.queryId}
                                  />
                                </div>
                              </AlertDescription>
                            </Alert>
                          ) : message.results && message.results.length > 0 ? (
                            <div>
                              <div className="font-medium text-primary mb-4">{message.content.split('\n')[0]}</div>
                              {renderResults(message.results)}
                            </div>
                          ) : (
                            message.content
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="detalhes">
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        
                        {message.sqlQuery && (
                          <div className="mt-3">
                            <div className="flex items-center gap-1 text-sm font-medium text-gray-500 mb-1">
                              <Database className="h-4 w-4" />
                              <span>Consulta SQL:</span>
                            </div>
                            <pre className="bg-gray-800 text-gray-100 p-2 rounded-md text-sm overflow-x-auto">
                              {message.sqlQuery}
                            </pre>
                          </div>
                        )}
                        
                        {message.analysis && message.analysis.insertStatements && message.analysis.insertStatements.length > 0 && (
                          <QueryDataRecommendations
                            query={messages[messages.findIndex(m => m.id === message.id) - 1]?.content || ""}
                            queryId={message.queryId}
                            insertStatements={message.analysis.insertStatements}
                            onInsertSuccess={() => {
                              const updatedMessages = [...messages];
                              const index = updatedMessages.findIndex(m => m.id === message.id);
                              if (index >= 0) {
                                updatedMessages[index] = {
                                  ...message,
                                  content: "Os dados foram populados com sucesso. Por favor, tente sua consulta novamente.",
                                  noResults: false
                                };
                                setMessages(updatedMessages);
                              }
                            }}
                          />
                        )}
                        
                        {message.queryId && (
                          <div className="mt-2 text-xs text-gray-500">
                            ID da Consulta: {message.queryId}
                          </div>
                        )}
                        
                        {message.timestamp && (
                          <div className="mt-1 text-xs text-gray-500">
                            Hora: {message.timestamp.toLocaleString()}
                          </div>
                        )}
                        
                        {message.results && message.results.length > 0 ? (
                          <div className="mt-3">
                            <div className="flex items-center gap-1 text-sm font-medium text-gray-500 mb-1">
                              <Database className="h-4 w-4" />
                              <span>Resultados:</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs h-6 ml-auto"
                                onClick={() => {
                                  try {
                                    const jsonStr = JSON.stringify(message.results, null, 2);
                                    const blob = new Blob([jsonStr], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.download = `resultados-consulta-${new Date().toISOString().slice(0, 10)}.json`;
                                    a.href = url;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                  } catch (e) {
                                    console.error('Error downloading results:', e);
                                    toast({
                                      title: "Erro",
                                      description: "Falha ao baixar resultados.",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                Baixar JSON
                              </Button>
                            </div>
                            {renderResults(message.results)}
                          </div>
                        ) : message.noResults ? (
                          <Alert variant="default" className="mt-3">
                            <AlertTitle>Nenhum resultado encontrado</AlertTitle>
                            <AlertDescription>
                              A base de dados não contém dados correspondentes a esta consulta.
                              <div className="mt-2">
                                <PopulateDataButton 
                                  query={
                                    messages[messages.findIndex(m => m.id === message.id) - 1]?.content || ""
                                  }
                                  queryId={message.queryId}
                                />
                              </div>
                            </AlertDescription>
                          </Alert>
                        ) : null}
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                </>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </ScrollArea>
      
      {messages.length > 0 && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={resetConversation}
          className="flex items-center gap-1 mb-4"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Nova Consulta
        </Button>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Faça uma pergunta sobre a base de dados em português..."
          className="resize-none"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
