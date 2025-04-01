import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, MessageCircle, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  suggestedDatabaseQueries, 
  generateResponse, 
  genId,
  QueryResponseType 
} from '@/utils/aiUtils';
import { supabase } from '@/integrations/supabase/client';
import { 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  STORAGE_KEYS, 
  initializeDummyDataIfNeeded 
} from '@/utils/storageUtils';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { SuggestedQueries } from '@/components/chat/SuggestedQueries';
import { QueryResults } from '@/components/chat/QueryResults';
import { PopulateDataButton } from '@/components/database/PopulateDataButton';

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
  isAIResponse?: boolean;
  baiResponse?: string;
  baiError?: string;
  supportingDocuments?: Array<{title: string, url: string, relevance?: number}>;
}

export const AIChat: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<Message | null>(null);
  const [activeResponse, setActiveResponse] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [dataLoadStatus, setDataLoadStatus] = useState({
    allLoaded: false,
    loading: true
  });
  const { toast } = useToast();
  
  const getPortugueseSuggestions = () => {
    const allPortugueseSuggestions = suggestedDatabaseQueries.filter(q => 
      /[áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/.test(q) || 
      /\b(qual|como|onde|quem|porque|quais|quando)\b/i.test(q)
    );
    
    const maxSuggestions = 30;
    
    const numericalQuestions = allPortugueseSuggestions.filter(q => 
      q.startsWith("Quantos") || 
      q.startsWith("Qual") && /\bnúmero|\btotal|\bvalor|\bmédia|\bpercentual|\btaxa/.test(q)
    );
    
    const otherQuestions = allPortugueseSuggestions.filter(q => 
      !numericalQuestions.includes(q)
    );
    
    const combinedSuggestions = [...numericalQuestions, ...otherQuestions];
    
    return combinedSuggestions.slice(0, maxSuggestions);
  };
  
  const portugueseSuggestions = getPortugueseSuggestions();
  
  useEffect(() => {
    loadDummyData();
  }, []);

  const checkAllDataLoaded = () => {
    const keys = Object.values(STORAGE_KEYS);
    let allDataLoaded = true;
    let loadedCount = 0;
    
    for (const key of keys) {
      const data = loadFromLocalStorage(key, []);
      if (!Array.isArray(data) || data.length === 0) {
        allDataLoaded = false;
        console.log(`Dados não carregados para: ${key}`);
      } else {
        loadedCount++;
      }
    }
    
    console.log(`Status de carregamento: ${loadedCount}/${keys.length} tabelas carregadas`);
    return allDataLoaded;
  };
  
  const loadDummyData = async () => {
    setIsInitializing(true);
    setDataLoadStatus({ allLoaded: false, loading: true });
    
    try {
      console.log("Iniciando carregamento de dados de amostra...");
      await initializeDummyDataIfNeeded();
      
      setTimeout(() => {
        const allLoaded = checkAllDataLoaded();
        
        setDataLoadStatus({ 
          allLoaded: allLoaded,
          loading: false
        });
        
        console.log('Verificação de carregamento de dados:', allLoaded ? 'Todos carregados' : 'Carregamento incompleto');
        toast({
          title: allLoaded ? "Dados Carregados" : "Atenção",
          description: allLoaded 
            ? "Todos os dados de amostra foram carregados com sucesso."
            : "Alguns dados podem não ter sido carregados corretamente. Tente recarregar.",
          variant: allLoaded ? "default" : "destructive",
        });
        
        setIsInitializing(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao inicializar dados de amostra:', error);
      setDataLoadStatus({ 
        allLoaded: false,
        loading: false
      });
      toast({
        title: "Erro",
        description: "Falha ao carregar dados de amostra. Por favor, tente novamente.",
        variant: "destructive",
      });
      
      setIsInitializing(false);
    }
  };
  
  const handleSuggestionClick = async (question: string) => {
    await processQuery(question);
  };

  const logQueryHistory = async (question: string, response: QueryResponseType) => {
    try {
      console.log("Logging query to history:", question);
      const { data, error } = await supabase
        .from('query_history')
        .insert([
          { 
            query_text: question,
            was_successful: !response.error && !response.noResults,
            language: 'pt',
            error_message: response.error ? response.message : null,
            analysis_result: response.analysis || null,
            is_ai_response: response.isAIResponse || false
          }
        ]);

      if (error) {
        console.error('Erro ao salvar histórico de consulta:', error);
      } else {
        console.log('Query history saved successfully:', data);
      }
    } catch (err) {
      console.error('Falha ao salvar histórico de consulta:', err);
    }
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
      
      await logQueryHistory(queryText, response);
      
      let supportingDocs = undefined;
      if (response.baiResponse) {
        supportingDocs = [
          {
            title: "Política de Inovação 2023",
            url: "https://exemplo.gov.pt/politica-inovacao-2023.pdf",
            relevance: 0.92
          },
          {
            title: "Relatório Anual de Investimentos em I&D",
            url: "https://exemplo.gov.pt/relatorio-id-2022.pdf",
            relevance: 0.85
          },
          {
            title: "Guia de Financiamento para Projetos de Inovação",
            url: "https://exemplo.gov.pt/guia-financiamento.pdf",
            relevance: 0.78
          }
        ];
      }
      
      const assistantMessage: Message = {
        id: genId(),
        content: response.message,
        sqlQuery: response.sqlQuery,
        results: response.results,
        role: 'assistant',
        noResults: response.noResults,
        timestamp: new Date(),
        queryId: response.queryId || "",
        analysis: response.analysis || null,
        isAIResponse: response.isAIResponse || false,
        baiResponse: response.baiResponse,
        baiError: response.baiError,
        supportingDocuments: supportingDocs
      };
      
      setActiveResponse(assistantMessage);
      
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
      
      await logQueryHistory(queryText, {
        message: errorMessage.content,
        sqlQuery: "",
        results: null,
        error: true
      });
      
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

  const actuallyLoading = isInitializing || dataLoadStatus.loading;
  const actuallyReady = !actuallyLoading && dataLoadStatus.allLoaded;

  return (
    <div className="w-full flex flex-col">
      <SuggestedQueries 
        queries={portugueseSuggestions}
        onSelectQuery={handleSuggestionClick}
        disabled={!actuallyReady || isLoading}
      />
      
      <div className="mb-4">
        <ChatInput 
          onSendMessage={processQuery}
          isLoading={isLoading}
          disabled={!actuallyReady}
          placeholder="Faça uma pergunta sobre a base de dados em português..."
        />
      </div>
      
      <div className="flex-1 mb-6 space-y-4">
        {actuallyLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span>Carregando dados de amostra...</span>
          </div>
        ) : !dataLoadStatus.allLoaded ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Problemas com os dados</AlertTitle>
            <AlertDescription>
              Os dados podem não ter sido carregados corretamente. Clique em "Atualizar" para tentar novamente.
            </AlertDescription>
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadDummyData}
                className="flex items-center gap-1"
              >
                <Loader2 className="h-4 w-4 mr-1" />
                Atualizar Dados
              </Button>
            </div>
          </Alert>
        ) : (
          <>
            {activeQuestion && (
              <ChatMessage
                content={activeQuestion.content}
                role="user"
                className="mb-2"
              />
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : activeResponse ? (
              <div className="space-y-4">
                {activeResponse.error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription className="whitespace-pre-wrap">{activeResponse.content}</AlertDescription>
                  </Alert>
                ) : activeResponse.noResults && (!activeResponse.results || activeResponse.results.length === 0) ? (
                  <div className="space-y-3">
                    <ChatMessage
                      content={activeResponse.content}
                      role="assistant"
                      baiResponse={activeResponse.baiResponse}
                      baiError={activeResponse.baiError}
                      supportingDocuments={activeResponse.supportingDocuments}
                    />
                    <div className="mt-2">
                      <PopulateDataButton 
                        query={activeQuestion!.content}
                        queryId={activeResponse.queryId || ""}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ChatMessage
                      content={activeResponse.isAIResponse ? activeResponse.content : activeResponse.content.split('\n')[0]}
                      role="assistant"
                      isAIResponse={activeResponse.isAIResponse}
                      baiResponse={activeResponse.baiResponse}
                      baiError={activeResponse.baiError}
                      results={activeResponse.results}
                      sqlQuery={activeResponse.sqlQuery}
                      supportingDocuments={activeResponse.supportingDocuments}
                    />
                  </div>
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
    </div>
  );
};
