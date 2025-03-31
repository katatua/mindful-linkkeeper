import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, AlertCircle, Database, PlusCircle, Loader2 } from 'lucide-react';
import { 
  suggestedDatabaseQueries, 
  generateResponse, 
  genId, 
  formatDatabaseValue,
  QueryResponseType 
} from '@/utils/aiUtils';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PopulateDataButton } from '@/components/database/PopulateDataButton';
import { supabase } from '@/integrations/supabase/client';
import { 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  STORAGE_KEYS, 
  initializeDummyDataIfNeeded 
} from '@/utils/storageUtils';
import { LoadingStatusDisplay } from '@/components/database/LoadingStatusDisplay';

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

interface FundingProgram {
  name: string;
  description: string;
  total_budget: number;
  start_date: string;
  end_date: string;
  application_deadline: string;
  next_call_date: string;
  funding_type: string;
  sector_focus: string[];
  eligibility_criteria: string;
  application_process: string;
  review_time_days: number;
  success_rate: number;
}

export const AIAssistant: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<Message | null>(null);
  const [activeResponse, setActiveResponse] = useState<Message | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();
  
  const portugueseSuggestions = suggestedDatabaseQueries.filter(q => 
    /[áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/.test(q) || 
    /\b(qual|como|onde|quem|porque|quais|quando)\b/i.test(q)
  ).slice(0, 6);
  
  useEffect(() => {
    loadDummyData();
  }, [toast]);
  
  const loadDummyData = async () => {
    setIsInitializing(true);
    try {
      console.log("Iniciando carregamento de dados de amostra...");
      await initializeDummyDataIfNeeded();
      console.log('Todos os dados de amostra foram carregados com sucesso');
      toast({
        title: "Dados Carregados",
        description: "Todos os dados de amostra foram carregados com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao inicializar dados de amostra:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados de amostra. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };
  
  const handleSuggestionClick = async (question: string) => {
    setInput(question);
    await processQuery(question);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    await processQuery(input);
  };

  const processQuery = async (queryText: string) => {
    console.log("Processing query:", queryText);
    
    const userMessage: Message = {
      id: genId(),
      content: queryText,
      role: 'user',
      timestamp: new Date()
    };
    
    setActiveQuestion(userMessage);
    setActiveResponse(null);
    setIsLoading(true);
    
    try {
      toast({
        title: "Processando consulta",
        description: "Aguarde enquanto processamos sua consulta...",
      });
      
      console.log("Sending query to generateResponse:", queryText);
      const response = await generateResponse(queryText);
      console.log("Response received:", response);
      
      const assistantMessage: Message = {
        id: genId(),
        content: response.message,
        sqlQuery: response.sqlQuery,
        results: response.results,
        role: 'assistant',
        noResults: response.noResults || false,
        timestamp: new Date(),
        queryId: response.queryId || "",
        analysis: response.analysis || null
      };
      
      setActiveResponse(assistantMessage);
      setInput('');
      
    } catch (error) {
      console.error('Error getting response:', error);
      
      const errorMessage: Message = {
        id: genId(),
        content: `Falha ao obter resposta: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Por favor, tente novamente ou reformule sua pergunta.`,
        role: 'assistant',
        error: true,
        timestamp: new Date()
      };
      
      setActiveResponse(errorMessage);
      
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
    setActiveQuestion(null);
    setActiveResponse(null);
    setInput('');
    
    const currentUrl = window.location.pathname;
    window.history.replaceState({}, document.title, currentUrl);
  };
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryToRetry = urlParams.get('queryToRetry');
    
    if (queryToRetry) {
      console.log("Found queryToRetry parameter, processing:", queryToRetry);
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      processQuery(queryToRetry);
    }
  }, []);

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
      <LoadingStatusDisplay onRefresh={loadDummyData} />
      
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-3">Consultas Sugeridas:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {portugueseSuggestions.map((question, index) => (
            <Button 
              key={index} 
              variant="outline"
              className="text-left justify-start h-auto py-2 px-3 text-sm"
              onClick={() => handleSuggestionClick(question)}
              disabled={isLoading || isInitializing}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Faça uma pergunta sobre a base de dados em português..."
          className="resize-none"
          disabled={isLoading || isInitializing}
        />
        <Button type="submit" size="icon" disabled={isLoading || isInitializing}>
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {isInitializing ? (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span>Carregando dados de amostra...</span>
        </div>
      ) : (
        <>
          {activeQuestion && (
            <div className="mb-4 p-3 rounded-lg bg-blue-100">
              <p className="text-sm font-semibold mb-1">Você</p>
              <div className="whitespace-pre-wrap">{activeQuestion.content}</div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : activeResponse ? (
            <div className="p-3 rounded-lg bg-gray-100">
              <p className="text-sm font-semibold mb-1">Assistente</p>
              
              {activeResponse.error ? (
                <Alert variant="destructive" className="bg-transparent border-none p-0">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription className="whitespace-pre-wrap">{activeResponse.content}</AlertDescription>
                </Alert>
              ) : activeResponse.noResults ? (
                <Alert variant="default" className="mb-3">
                  <AlertTitle>Nenhum resultado encontrado</AlertTitle>
                  <AlertDescription>
                    {activeResponse.content}
                    <div className="mt-2">
                      <PopulateDataButton 
                        query={activeQuestion.content}
                        queryId={activeResponse.queryId || ""}
                      />
                    </div>
                  </AlertDescription>
                </Alert>
              ) : activeResponse.results && activeResponse.results.length > 0 ? (
                <div>
                  <div className="font-medium text-primary mb-4">
                    {activeResponse.content.split('\n')[0]}
                  </div>
                  {renderResults(activeResponse.results)}
                  
                  {activeResponse.sqlQuery && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-500 mb-1">
                        <Database className="h-4 w-4" />
                        <span>Consulta SQL:</span>
                      </div>
                      <pre className="bg-gray-800 text-gray-100 p-2 rounded-md text-sm overflow-x-auto">
                        {activeResponse.sqlQuery}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{activeResponse.content}</div>
              )}
            </div>
          ) : null}
          
          {(activeQuestion || activeResponse) && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetConversation}
              className="flex items-center gap-1 mt-4"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Nova Consulta
            </Button>
          )}
        </>
      )}
    </div>
  );
};
