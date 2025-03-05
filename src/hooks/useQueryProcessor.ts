
import { supabase } from "@/integrations/supabase/client";

export const useQueryProcessor = () => {
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
        response: "I'm sorry, I couldn't retrieve the data due to a technical issue."
      };
    }
  };

  return {
    isMetricsQuery,
    generateSqlFromNaturalLanguage,
    executeQuery
  };
};
