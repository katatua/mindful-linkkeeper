import { useState, useEffect } from "react";
import { Message } from "@/types/chatTypes";
import { generateResponse, genId } from "@/utils/aiUtils";
import { useToast } from "@/components/ui/use-toast";
import { useChatSuggestions } from "./useChatSuggestions";
import { useVisualization } from "./useVisualization";
import { useQueryProcessor } from "./useQueryProcessor";

export const useChatCore = (language: string) => {
  const initialMessage = language === 'en' 
    ? "Hello! I'm the ANI AI Assistant. How can I help you with innovation information today?"
    : "Olá! Sou o Assistente de IA da ANI. Como posso ajudá-lo com informações sobre inovação hoje?";
  
  const systemInfo = language === 'en'
    ? "You can ask me about innovation metrics, funding programs, active projects, and other ANI database information. Just ask in natural language and I'll provide the data."
    : "Você pode me perguntar sobre métricas de inovação, programas de financiamento, projetos ativos e outras informações do banco de dados da ANI. Basta perguntar em linguagem natural e eu fornecerei os dados.";

  const INITIAL_MESSAGES: Message[] = [
    {
      id: '1',
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date()
    },
    {
      id: '2',
      role: 'system',
      content: systemInfo,
      timestamp: new Date()
    }
  ];

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const { toast } = useToast();
  
  const { 
    isMetricsQuery, 
    generateSqlFromNaturalLanguage, 
    executeQuery 
  } = useQueryProcessor();
  
  const {
    showVisualization,
    setShowVisualization,
    visualizationData,
    setVisualizationData,
    handleVisualizationData
  } = useVisualization();
  
  const {
    suggestionLinks,
    setSuggestionLinks,
    getInitialSuggestions,
    generateContextualSuggestions,
    generateRandomSuggestions
  } = useChatSuggestions(language);

  useEffect(() => {
    setMessages(INITIAL_MESSAGES);
    setSuggestionLinks(getInitialSuggestions());
  }, [language]);

  useEffect(() => {
    if (messages.length > 2) {
      const userMessages = messages.filter(msg => msg.role === 'user');
      if (userMessages.length > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1];
        const newSuggestions = generateContextualSuggestions(lastUserMessage.content);
        setSuggestionLinks(newSuggestions);
      }
    }
  }, [messages, language]);

  const processAndRespondToMessage = async (messageContent: string) => {
    setIsTyping(true);
    
    try {
      let response: string;
      let vizData: any[] | undefined;
      
      if (isMetricsQuery(messageContent)) {
        console.log("Detected metrics query");
        const sqlQuery = await generateSqlFromNaturalLanguage(messageContent);
        console.log("Generated SQL query:", sqlQuery);
        
        const queryResult = await executeQuery(sqlQuery);
        console.log("Query result:", queryResult);
        
        response = queryResult.response;
        
        // Remove SQL query from the response
        const sqlRegex = /\n\*\*Consulta executada:\*\*\n```sql[\s\S]*?```/;
        response = response.replace(sqlRegex, '');
        
        vizData = queryResult.visualizationData;
        
        if (vizData && vizData.length > 0) {
          handleVisualizationData(vizData);
        }
      } else {
        response = await generateResponse(messageContent);
      }
      
      if (!response || response.trim() === '') {
        response = language === 'en' 
          ? "I'm sorry, but I couldn't generate a response for that query. Please try again or ask a different question."
          : "Desculpe, mas não consegui gerar uma resposta para essa consulta. Por favor, tente novamente ou faça uma pergunta diferente.";
      }
      
      const assistantMessage: Message = {
        id: genId(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      const newSuggestions = generateContextualSuggestions(messageContent);
      setSuggestionLinks(newSuggestions);
      
      return assistantMessage;
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: language === 'en' ? "Error processing response" : "Erro ao processar a resposta",
        description: language === 'en' 
          ? "There was a problem querying the knowledge base. Please try again." 
          : "Ocorreu um problema ao consultar a base de conhecimento. Por favor, tente novamente.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: genId(),
        role: 'assistant',
        content: language === 'en'
          ? "I'm sorry, but I encountered an error processing your request. Please try again later or contact technical support if the problem persists."
          : "Peço desculpa, mas encontrei um erro ao processar o seu pedido. Por favor, tente novamente mais tarde ou contacte o suporte técnico se o problema persistir.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      return errorMessage;
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendCustomMessage = async (messageContent: string, isSystemMessage = false) => {
    if (!messageContent.trim()) return;
    
    const userMessageId = genId();
    const userMessage: Message = {
      id: userMessageId,
      role: isSystemMessage ? 'system' : 'user',
      content: messageContent,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    if (!isSystemMessage) {
      return await processAndRespondToMessage(messageContent);
    }
    
    return userMessage;
  };

  const handleSuggestionClick = async (query: string) => {
    if (!query.trim()) return;
    
    const userMessageId = genId();
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: query,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    await processAndRespondToMessage(query);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessageId = genId();
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    await processAndRespondToMessage(input);
  };

  const refreshSuggestions = () => {
    const userMessages = messages.filter(msg => msg.role === 'user');
    const lastUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
    
    if (lastUserMessage) {
      const newSuggestions = generateRandomSuggestions(lastUserMessage.content);
      setSuggestionLinks(newSuggestions);
    } else {
      const newSuggestions = generateRandomSuggestions("");
      setSuggestionLinks(newSuggestions);
    }
  };

  return {
    messages,
    input,
    setInput,
    isTyping,
    showVisualization,
    setShowVisualization,
    visualizationData,
    suggestionLinks,
    handleSuggestionClick,
    handleSendMessage,
    handleSendCustomMessage,
    refreshSuggestions
  };
};
