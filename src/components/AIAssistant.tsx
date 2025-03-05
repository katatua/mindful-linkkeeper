
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizonal, Bot, User, Info, Database } from "lucide-react";
import { generateResponse, genId } from "@/utils/aiUtils";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import DataVisualization from "./DataVisualization";

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  visualizationData?: any[];
}

const AIAssistant = () => {
  const { t, language } = useLanguage();
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
  const [showVisualization, setShowVisualization] = useState(false);
  const [visualizationData, setVisualizationData] = useState<any[]>([]);
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

  // Detect if query is about metrics
  const isMetricsQuery = (message: string): boolean => {
    const lowerMsg = message.toLowerCase();
    
    // Patterns for English and Portuguese covering R&D investment, patents, etc.
    const englishPatterns = [
      'how much is', 'what is the', 'tell me about', 'show me', 
      'r&d investment', 'investment in r&d', 'patent', 'innovation', 
      'metric', 'performance', 'percentage', 'value', 'number of',
      'how many', 'statistic'
    ];
    
    const portuguesePatterns = [
      'qual', 'quanto', 'quantos', 'mostre', 'diga-me', 'apresente',
      'investimento em p&d', 'investimento em r&d', 'patente', 'inovação',
      'métrica', 'desempenho', 'percentagem', 'porcentagem', 'valor', 'número de',
      'estatística'
    ];
    
    return englishPatterns.some(pattern => lowerMsg.includes(pattern)) || 
           portuguesePatterns.some(pattern => lowerMsg.includes(pattern));
  };

  // Function to generate SQL from natural language
  const generateSqlFromNaturalLanguage = async (query: string): Promise<string> => {
    try {
      const lowerQuery = query.toLowerCase();
      
      // For "active projects" type questions
      if (lowerQuery.includes('project') || lowerQuery.includes('projeto')) {
        if (lowerQuery.includes('active') || lowerQuery.includes('ativo')) {
          return `SELECT COUNT(*) AS total_active_projects FROM ani_projects WHERE status = 'active'`;
        }
      }
      
      // For R&D investment questions
      if (lowerQuery.includes('r&d') || lowerQuery.includes('p&d') || 
          lowerQuery.includes('research') || lowerQuery.includes('pesquisa') ||
          lowerQuery.includes('investment') || lowerQuery.includes('investimento')) {
        
        if (lowerQuery.includes('year') || lowerQuery.includes('ano') || 
            lowerQuery.includes('years') || lowerQuery.includes('anos') ||
            lowerQuery.includes('last') || lowerQuery.includes('últimos')) {
          
          // Check if asking for data from multiple years
          const yearMatch = lowerQuery.match(/(\d+)\s*(year|ano|years|anos)/);
          const numYears = yearMatch ? parseInt(yearMatch[1]) : 3; // Default to 3 years if not specified
          
          return `SELECT name, value, unit, measurement_date, source 
                 FROM ani_metrics 
                 WHERE (category = 'Investment' OR category = 'Annual Funding') 
                 AND (name LIKE '%R&D%' OR name LIKE '%P&D%' OR name LIKE '%Investment%') 
                 ORDER BY measurement_date DESC 
                 LIMIT ${numYears}`;
        }
        
        return `SELECT name, value, unit, measurement_date, source 
               FROM ani_metrics 
               WHERE category = 'Investment' 
               AND (name LIKE '%R&D%' OR name LIKE '%P&D%') 
               ORDER BY measurement_date DESC 
               LIMIT 1`;
      }
      
      // For patent questions
      if (lowerQuery.includes('patent') || lowerQuery.includes('patente')) {
        if (lowerQuery.includes('year') || lowerQuery.includes('ano') || 
            lowerQuery.includes('years') || lowerQuery.includes('anos') ||
            lowerQuery.includes('last') || lowerQuery.includes('últimos')) {
          
          const yearMatch = lowerQuery.match(/(\d+)\s*(year|ano|years|anos)/);
          const numYears = yearMatch ? parseInt(yearMatch[1]) : 3;
          
          return `SELECT name, value, unit, measurement_date, source 
                 FROM ani_metrics 
                 WHERE category = 'Intellectual Property' 
                 AND (name LIKE '%Patent%' OR name LIKE '%Patente%') 
                 ORDER BY measurement_date DESC 
                 LIMIT ${numYears}`;
        }
        
        return `SELECT name, value, unit, measurement_date, source 
               FROM ani_metrics 
               WHERE category = 'Intellectual Property' 
               AND (name LIKE '%Patent%' OR name LIKE '%Patente%') 
               ORDER BY measurement_date DESC 
               LIMIT 1`;
      }
      
      // For metric/statistic general questions
      if (lowerQuery.includes('metric') || lowerQuery.includes('métrica') ||
          lowerQuery.includes('statistic') || lowerQuery.includes('estatística')) {
        return `SELECT name, category, value, unit, measurement_date, source 
               FROM ani_metrics 
               ORDER BY measurement_date DESC 
               LIMIT 5`;
      }
      
      // For funding programs
      if (lowerQuery.includes('funding') || lowerQuery.includes('financiamento') ||
          lowerQuery.includes('program') || lowerQuery.includes('programa')) {
        return `SELECT name, description, total_budget, start_date, end_date 
               FROM ani_funding_programs 
               ORDER BY total_budget DESC 
               LIMIT 5`;
      }
      
      // For sector questions
      if (lowerQuery.includes('sector') || lowerQuery.includes('setor')) {
        return `SELECT sector, COUNT(*) as count 
               FROM ani_projects 
               WHERE sector IS NOT NULL 
               GROUP BY sector 
               ORDER BY count DESC`;
      }
      
      // For regional questions
      if (lowerQuery.includes('region') || lowerQuery.includes('região')) {
        return `SELECT region, COUNT(*) as count 
               FROM ani_projects 
               WHERE region IS NOT NULL 
               GROUP BY region 
               ORDER BY count DESC`;
      }
      
      // Use Gemini to generate SQL for more complex queries
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          userMessage: `Generate a SQL query for the ANI database to answer this question: "${query}"`,
          chatHistory: [] 
        }
      });
      
      if (error) {
        console.error("Error generating SQL:", error);
        throw new Error("Failed to generate SQL query");
      }
      
      // Extract SQL from Gemini response
      const sqlMatch = data.response.match(/<SQL>([\s\S]*?)<\/SQL>/);
      if (sqlMatch && sqlMatch[1]) {
        return sqlMatch[1].trim();
      }
      
      // Fallback to a generic query if no specific SQL could be generated
      return `SELECT * FROM ani_metrics ORDER BY measurement_date DESC LIMIT 5`;
    } catch (error) {
      console.error("Error in SQL generation:", error);
      return `SELECT * FROM ani_metrics ORDER BY measurement_date DESC LIMIT 5`;
    }
  };

  // Execute the SQL query and format results
  const executeQuery = async (sqlQuery: string): Promise<{ response: string, visualizationData?: any[] }> => {
    try {
      console.log("Executing query:", sqlQuery);
      
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          userMessage: `Execute esta consulta SQL: ${sqlQuery}`,
          chatHistory: [] 
        }
      });
      
      if (error) {
        console.error("Error executing SQL:", error);
        throw new Error("Failed to execute SQL query");
      }
      
      // Check if response contains visualization data marker
      const visualizationRegex = /<data-visualization>([\s\S]*?)<\/data-visualization>/;
      const vizMatch = data.response.match(visualizationRegex);
      
      let visualizationData;
      let cleanResponse = data.response;
      
      if (vizMatch && vizMatch[1]) {
        try {
          visualizationData = JSON.parse(vizMatch[1]);
          // Remove the visualization marker from the response
          cleanResponse = data.response.replace(visualizationRegex, '');
        } catch (e) {
          console.error("Error parsing visualization data:", e);
        }
      }
      
      return { 
        response: cleanResponse,
        visualizationData: visualizationData
      };
    } catch (error) {
      console.error("Error in query execution:", error);
      return { 
        response: language === 'en' 
          ? "I'm sorry, I couldn't retrieve the data due to a technical issue."
          : "Desculpe, não consegui recuperar os dados devido a um problema técnico."
      };
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
      let vizData: any[] | undefined;
      
      // Check if this is a query about data in the ANI database
      if (isMetricsQuery(input)) {
        console.log("Detected metrics query");
        // 1. Generate SQL from natural language
        const sqlQuery = await generateSqlFromNaturalLanguage(input);
        console.log("Generated SQL query:", sqlQuery);
        
        // 2. Execute the SQL query
        const queryResult = await executeQuery(sqlQuery);
        console.log("Query result:", queryResult);
        
        response = queryResult.response;
        vizData = queryResult.visualizationData;
        
        // If we have visualization data, update state
        if (vizData && vizData.length > 0) {
          setVisualizationData(vizData);
          setShowVisualization(true);
        }
      } else {
        // Get regular response from the AI
        response = await generateResponse(input);
      }
      
      const assistantMessage: Message = {
        id: genId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        visualizationData: vizData
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

  const handleCloseVisualization = () => {
    setShowVisualization(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
      <div className="border-b px-4 py-3 flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="font-medium">{language === 'en' ? 'ANI Assistant' : 'Assistente ANI'}</h3>
      </div>
      
      {showVisualization && visualizationData.length > 0 && (
        <div className="px-4 py-3">
          <DataVisualization 
            data={visualizationData} 
            onClose={handleCloseVisualization} 
          />
        </div>
      )}
      
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
