import { useState, useEffect } from "react";
import { Message, SuggestionLink } from "@/types/chatTypes";
import { generateResponse, genId } from "@/utils/aiUtils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useChat = (language: string) => {
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

  const getInitialSuggestions = (): SuggestionLink[] => {
    if (language === 'en') {
      return [
        { 
          id: genId(), 
          text: "Investment in R&D over the last 3 years",
          query: "What was the investment in R&D over the last 3 years?"
        },
        { 
          id: genId(), 
          text: "Regional investment distribution",
          query: "Show me the investment distribution by region over the last 3 years"
        },
        { 
          id: genId(), 
          text: "Number of patents filed last year",
          query: "How many patents were filed last year?"
        },
        { 
          id: genId(), 
          text: "Active funding programs",
          query: "What are the current active funding programs?"
        }
      ];
    } else {
      return [
        { 
          id: genId(), 
          text: "Investimento em P&D nos últimos 3 anos",
          query: "Qual foi o investimento em P&D nos últimos 3 anos?"
        },
        { 
          id: genId(), 
          text: "Distribuição de investimento por região",
          query: "Mostre-me a distribuição de investimento por região nos últimos 3 anos"
        },
        { 
          id: genId(), 
          text: "Número de patentes registradas no último ano",
          query: "Quantas patentes foram registradas no último ano?"
        },
        { 
          id: genId(), 
          text: "Programas de financiamento ativos",
          query: "Quais são os programas de financiamento ativos atualmente?"
        }
      ];
    }
  };

  const generateContextualSuggestions = (lastQuery: string): SuggestionLink[] => {
    const lowerQuery = lastQuery.toLowerCase();
    
    if (lowerQuery.includes('investment') || lowerQuery.includes('investimento') || 
        lowerQuery.includes('r&d') || lowerQuery.includes('p&d')) {
      if (language === 'en') {
        return [
          { 
            id: genId(), 
            text: "Compare with previous year",
            query: "How does this R&D investment compare with the previous year?"
          },
          { 
            id: genId(), 
            text: "Investment by sector",
            query: "What is the distribution of R&D investment by sector?"
          },
          { 
            id: genId(), 
            text: "Future projections",
            query: "What are the projections for R&D investment next year?"
          },
          { 
            id: genId(), 
            text: "Budget allocation",
            query: "How is the innovation budget allocated?"
          }
        ];
      } else {
        return [
          { 
            id: genId(), 
            text: "Comparar com ano anterior",
            query: "Como esse investimento em P&D se compara ao do ano anterior?"
          },
          { 
            id: genId(), 
            text: "Investimento por setor",
            query: "Qual é a distribuição do investimento em P&D por setor?"
          },
          { 
            id: genId(), 
            text: "Projeções futuras",
            query: "Quais são as projeções para o investimento em P&D no próximo ano?"
          },
          { 
            id: genId(), 
            text: "Alocação de orçamento",
            query: "Como o orçamento de inovação é alocado?"
          }
        ];
      }
    }
    
    if (lowerQuery.includes('patent') || lowerQuery.includes('patente')) {
      if (language === 'en') {
        return [
          { 
            id: genId(), 
            text: "Patents by technology area",
            query: "What is the distribution of patents by technology area?"
          },
          { 
            id: genId(), 
            text: "Patent growth rate",
            query: "What is the growth rate of patent applications over the last 5 years?"
          },
          { 
            id: genId(), 
            text: "International patents",
            query: "How many international patents were filed?"
          },
          { 
            id: genId(), 
            text: "Top patent holders",
            query: "Who are the top patent holders in the country?"
          }
        ];
      } else {
        return [
          { 
            id: genId(), 
            text: "Patentes por área tecnológica",
            query: "Qual é a distribuição de patentes por área tecnológica?"
          },
          { 
            id: genId(), 
            text: "Taxa de crescimento de patentes",
            query: "Qual é a taxa de crescimento dos pedidos de patentes nos últimos 5 anos?"
          },
          { 
            id: genId(), 
            text: "Patentes internacionais",
            query: "Quantas patentes internacionais foram registradas?"
          },
          { 
            id: genId(), 
            text: "Principais detentores de patentes",
            query: "Quem são os principais detentores de patentes no país?"
          }
        ];
      }
    }
    
    if (lowerQuery.includes('funding') || lowerQuery.includes('program') || 
        lowerQuery.includes('financiamento') || lowerQuery.includes('programa')) {
      if (language === 'en') {
        return [
          { 
            id: genId(), 
            text: "Funding success rates",
            query: "What are the success rates for funding applications?"
          },
          { 
            id: genId(), 
            text: "Application deadlines",
            query: "What are the upcoming funding application deadlines?"
          },
          { 
            id: genId(), 
            text: "Funding by sector",
            query: "How is funding distributed across different sectors?"
          },
          { 
            id: genId(), 
            text: "International funding",
            query: "What international funding programs are available?"
          }
        ];
      } else {
        return [
          { 
            id: genId(), 
            text: "Taxas de sucesso de financiamento",
            query: "Quais são as taxas de sucesso para pedidos de financiamento?"
          },
          { 
            id: genId(), 
            text: "Prazos de inscrição",
            query: "Quais são os próximos prazos de inscrição para financiamento?"
          },
          { 
            id: genId(), 
            text: "Financiamento por setor",
            query: "Como o financiamento é distribuído entre diferentes setores?"
          },
          { 
            id: genId(), 
            text: "Financiamento internacional",
            query: "Quais programas de financiamento internacional estão disponíveis?"
          }
        ];
      }
    }
    
    if (lowerQuery.includes('region') || lowerQuery.includes('região') || lowerQuery.includes('regional')) {
      if (language === 'en') {
        return [
          { 
            id: genId(), 
            text: "Top performing regions",
            query: "Which regions have the highest innovation performance?"
          },
          { 
            id: genId(), 
            text: "Regional growth rates",
            query: "What are the innovation growth rates by region?"
          },
          { 
            id: genId(), 
            text: "Regional specializations",
            query: "What are the technology specializations by region?"
          },
          { 
            id: genId(), 
            text: "Regional funding allocation",
            query: "How is funding allocated across different regions?"
          }
        ];
      } else {
        return [
          { 
            id: genId(), 
            text: "Regiões com melhor desempenho",
            query: "Quais regiões têm o maior desempenho em inovação?"
          },
          { 
            id: genId(), 
            text: "Taxas de crescimento regional",
            query: "Quais são as taxas de crescimento de inovação por região?"
          },
          { 
            id: genId(), 
            text: "Especializações regionais",
            query: "Quais são as especializações tecnológicas por região?"
          },
          { 
            id: genId(), 
            text: "Alocação de financiamento regional",
            query: "Como o financiamento é alocado entre diferentes regiões?"
          }
        ];
      }
    }
    
    return getInitialSuggestions();
  };

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [visualizationData, setVisualizationData] = useState<any[]>([]);
  const [suggestionLinks, setSuggestionLinks] = useState<SuggestionLink[]>(getInitialSuggestions());
  const { toast } = useToast();

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

  const isMetricsQuery = (message: string): boolean => {
    const lowerMsg = message.toLowerCase();
    
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

  const generateSqlFromNaturalLanguage = async (query: string): Promise<string> => {
    try {
      const lowerQuery = query.toLowerCase();
      
      if ((lowerQuery.includes('investimento') || lowerQuery.includes('investment')) && 
          (lowerQuery.includes('região') || lowerQuery.includes('regiao') || lowerQuery.includes('region')) &&
          (lowerQuery.includes('últimos') || lowerQuery.includes('ultimos') || lowerQuery.includes('last'))) {
        
        const yearMatch = lowerQuery.match(/(\d+)\s*(ano|anos|year|years)/);
        const numYears = yearMatch ? parseInt(yearMatch[1]) : 3;
        
        return `SELECT region, 
                  EXTRACT(YEAR FROM measurement_date) as year, 
                  SUM(value) as value, 
                  FIRST_VALUE(unit) OVER (PARTITION BY region ORDER BY measurement_date DESC) as unit
                FROM ani_metrics 
                WHERE category = 'Regional Growth'
                AND measurement_date >= CURRENT_DATE - INTERVAL '${numYears} years'
                GROUP BY region, EXTRACT(YEAR FROM measurement_date)
                ORDER BY region, year DESC`;
      }
      
      if (lowerQuery.includes('project') || lowerQuery.includes('projeto')) {
        if (lowerQuery.includes('active') || lowerQuery.includes('ativo')) {
          return `SELECT COUNT(*) AS total_active_projects FROM ani_projects WHERE status = 'active'`;
        }
      }
      
      if (lowerQuery.includes('r&d') || lowerQuery.includes('p&d') || 
          lowerQuery.includes('research') || lowerQuery.includes('pesquisa') ||
          lowerQuery.includes('investment') || lowerQuery.includes('investimento')) {
        
        if (lowerQuery.includes('year') || lowerQuery.includes('ano') || 
            lowerQuery.includes('years') || lowerQuery.includes('anos') ||
            lowerQuery.includes('last') || lowerQuery.includes('últimos')) {
          
          const yearMatch = lowerQuery.match(/(\d+)\s*(year|ano|years|anos)/);
          const numYears = yearMatch ? parseInt(yearMatch[1]) : 3;
          
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
      
      if (lowerQuery.includes('metric') || lowerQuery.includes('métrica') ||
          lowerQuery.includes('statistic') || lowerQuery.includes('estatística')) {
        return `SELECT name, category, value, unit, measurement_date, source 
               FROM ani_metrics 
               ORDER BY measurement_date DESC 
               LIMIT 5`;
      }
      
      if (lowerQuery.includes('funding') || lowerQuery.includes('financiamento') ||
          lowerQuery.includes('program') || lowerQuery.includes('programa')) {
        return `SELECT name, description, total_budget, start_date, end_date 
               FROM ani_funding_programs 
               ORDER BY total_budget DESC 
               LIMIT 5`;
      }
      
      if (lowerQuery.includes('sector') || lowerQuery.includes('setor')) {
        return `SELECT sector, COUNT(*) as count 
               FROM ani_projects 
               WHERE sector IS NOT NULL 
               GROUP BY sector 
               ORDER BY count DESC`;
      }
      
      if (lowerQuery.includes('region') || lowerQuery.includes('região')) {
        return `SELECT region, COUNT(*) as count 
               FROM ani_projects 
               WHERE region IS NOT NULL 
               GROUP BY region 
               ORDER BY count DESC`;
      }
      
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
      
      const sqlMatch = data.response.match(/<SQL>([\s\S]*?)<\/SQL>/);
      if (sqlMatch && sqlMatch[1]) {
        return sqlMatch[1].trim();
      }
      
      return `SELECT * FROM ani_metrics ORDER BY measurement_date DESC LIMIT 5`;
    } catch (error) {
      console.error("Error in SQL generation:", error);
      return `SELECT * FROM ani_metrics ORDER BY measurement_date DESC LIMIT 5`;
    }
  };

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
      
      const visualizationRegex = /<data-visualization>([\s\S]*?)<\/data-visualization>/;
      let visualizationData;
      let cleanResponse = data.response;
      
      const vizMatch = data.response.match(visualizationRegex);
      
      if (vizMatch && vizMatch[1]) {
        try {
          visualizationData = JSON.parse(vizMatch[1]);
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
    setIsTyping(true);
    
    try {
      let response: string;
      let vizData: any[] | undefined;
      
      if (isMetricsQuery(query)) {
        console.log("Detected metrics query from suggestion");
        const sqlQuery = await generateSqlFromNaturalLanguage(query);
        console.log("Generated SQL query:", sqlQuery);
        
        const queryResult = await executeQuery(sqlQuery);
        console.log("Query result:", queryResult);
        
        response = queryResult.response;
        vizData = queryResult.visualizationData;
        
        if (vizData && vizData.length > 0) {
          setVisualizationData(vizData);
          setShowVisualization(true);
        }
      } else {
        response = await generateResponse(query);
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
        timestamp: new Date(),
        visualizationData: vizData
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      const newSuggestions = generateContextualSuggestions(query);
      setSuggestionLinks(newSuggestions);
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
    setIsTyping(true);
    
    try {
      let response: string;
      let vizData: any[] | undefined;
      
      if (isMetricsQuery(input)) {
        console.log("Detected metrics query");
        const sqlQuery = await generateSqlFromNaturalLanguage(input);
        console.log("Generated SQL query:", sqlQuery);
        
        const queryResult = await executeQuery(sqlQuery);
        console.log("Query result:", queryResult);
        
        response = queryResult.response;
        vizData = queryResult.visualizationData;
        
        if (vizData && vizData.length > 0) {
          setVisualizationData(vizData);
          setShowVisualization(true);
        }
      } else {
        response = await generateResponse(input);
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
        timestamp: new Date(),
        visualizationData: vizData
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      const newSuggestions = generateContextualSuggestions(input);
      setSuggestionLinks(newSuggestions);
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
    handleSendMessage
  };
};
