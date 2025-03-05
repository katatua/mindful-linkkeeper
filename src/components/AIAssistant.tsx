
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizonal, Bot, User, Info, Database } from "lucide-react";
import { generateResponse, genId } from "@/utils/aiUtils";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const { t, language } = useLanguage();
  const initialMessage = language === 'en' 
    ? "Hello! I'm the ANI AI Assistant. How can I help you with innovation information today?"
    : "Olá! Sou o Assistente de IA da ANI. Como posso ajudá-lo com informações sobre inovação hoje?";
  
  const systemInfo = language === 'en'
    ? "You can ask questions about documents, links or files you've uploaded to the platform. I can also provide general information about innovation, funding, policies, and metrics or query the ANI database for you."
    : "Pode fazer perguntas sobre os documentos, links ou ficheiros que carregou na plataforma. Também posso fornecer informações gerais sobre inovação, financiamento, políticas e métricas, ou consultar o banco de dados da ANI para você.";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update initial messages when language changes
  useEffect(() => {
    setMessages(INITIAL_MESSAGES);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if a message is about querying active projects
  const isActiveProjectsQuery = (message: string): boolean => {
    const lowerMsg = message.toLowerCase();
    
    // English patterns
    if (lowerMsg.includes("how many active projects") || 
        lowerMsg.includes("number of active projects") ||
        lowerMsg.includes("active projects count")) {
      return true;
    }
    
    // Portuguese patterns
    if (lowerMsg.includes("quantos projetos ativos") || 
        lowerMsg.includes("quantos projetos estão ativos") ||
        lowerMsg.includes("número de projetos ativos") ||
        lowerMsg.includes("contagem de projetos ativos")) {
      return true;
    }
    
    return false;
  };

  // Query the database for active projects
  const queryActiveProjects = async (): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          userMessage: `Execute esta consulta SQL: SELECT COUNT(*) FROM ani_projects WHERE status = 'active'`,
          chatHistory: [] 
        }
      });
      
      if (error) {
        console.error("Error querying database:", error);
        return language === 'en'
          ? "I'm sorry, I encountered an error when trying to query the database."
          : "Desculpe, encontrei um erro ao tentar consultar o banco de dados.";
      }
      
      // Parse the response to extract the count
      const responseText = data.response;
      const match = responseText.match(/(\d+)/);
      const count = match ? match[1] : "unknown";
      
      return language === 'en'
        ? `There are currently ${count} active projects in the ANI database.`
        : `Existem atualmente ${count} projetos ativos no banco de dados da ANI.`;
    } catch (error) {
      console.error("Error in queryActiveProjects:", error);
      return language === 'en'
        ? "I'm sorry, I couldn't retrieve the active projects count due to a technical issue."
        : "Desculpe, não consegui obter a contagem de projetos ativos devido a um problema técnico.";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessageId = genId();
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    try {
      let response: string;
      
      // Check if this is a query about active projects
      if (isActiveProjectsQuery(input)) {
        response = await queryActiveProjects();
      } else {
        // Get regular response from the AI
        response = await generateResponse(input);
      }
      
      const assistantMessage: Message = {
        id: genId(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
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
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
      <div className="border-b px-4 py-3 flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="font-medium">{language === 'en' ? 'ANI Assistant' : 'Assistente ANI'}</h3>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'system' ? (
                <div className="bg-blue-50 rounded-lg px-4 py-2 max-w-[90%] border border-blue-100 flex gap-2">
                  <Info className="h-5 w-5 mt-1 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="whitespace-pre-wrap text-sm text-blue-700">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div 
                  className={`rounded-lg px-4 py-2 max-w-[80%] flex gap-2 ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white ml-auto' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
                  )}
                  <div>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <User className="h-5 w-5 mt-1 flex-shrink-0" />
                  )}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-800">
                <div className="flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t flex gap-2">
        <Input
          placeholder={language === 'en' 
            ? "Ask about innovation metrics, funding, or policies..." 
            : "Pergunte sobre métricas de inovação, financiamento ou políticas..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} disabled={isTyping || !input.trim()}>
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export { AIAssistant };
