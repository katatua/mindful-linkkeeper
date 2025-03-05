
/**
 * SQL query generation utilities
 * Responsible for converting natural language to SQL queries
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Generates SQL from a natural language query
 */
export const generateSqlFromNaturalLanguage = async (query: string): Promise<string> => {
  try {
    const lowerQuery = query.toLowerCase();
    
    // Regional investment pattern
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
    
    // Investment by sector pattern
    if ((lowerQuery.includes('investimento por setor') || lowerQuery.includes('investment by sector')) ||
        ((lowerQuery.includes('investimento') || lowerQuery.includes('investment')) && 
         (lowerQuery.includes('setor') || lowerQuery.includes('sector')))) {
      return `SELECT 
                sector, 
                name, 
                value, 
                unit, 
                measurement_date
              FROM 
                ani_metrics
              WHERE 
                category = 'Sectoral Funding'
              ORDER BY 
                value DESC`;
    }
    
    // Success rate by sector pattern
    if ((lowerQuery.includes('success rate') || lowerQuery.includes('taxa de sucesso')) &&
        (lowerQuery.includes('sector') || lowerQuery.includes('setor'))) {
      return `SELECT 
                sector, 
                COUNT(*) as total_applications,
                COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
                ROUND((COUNT(CASE WHEN status = 'approved' THEN 1 END)::numeric / COUNT(*)::numeric) * 100, 2) as success_rate
              FROM 
                ani_funding_applications
              WHERE 
                status != 'pending'
              GROUP BY 
                sector
              ORDER BY 
                success_rate DESC`;
    }
    
    // Application deadlines pattern
    if ((lowerQuery.includes('deadline') || lowerQuery.includes('prazo')) &&
        (lowerQuery.includes('application') || lowerQuery.includes('aplicação') || 
         lowerQuery.includes('candidatura') || lowerQuery.includes('próximo') || 
         lowerQuery.includes('next'))) {
      return `SELECT 
                name, 
                description,
                total_budget,
                application_deadline,
                next_call_date,
                funding_type
              FROM 
                ani_funding_programs
              WHERE 
                application_deadline >= CURRENT_DATE
              ORDER BY 
                application_deadline ASC
              LIMIT 10`;
    }
    
    // Funding by sector pattern
    if ((lowerQuery.includes('funding') || lowerQuery.includes('financiamento')) &&
        (lowerQuery.includes('sector') || lowerQuery.includes('setor'))) {
      return `SELECT 
                sector, 
                name, 
                value, 
                unit, 
                measurement_date
              FROM 
                ani_metrics
              WHERE 
                category = 'Sectoral Funding'
              ORDER BY 
                value DESC`;
    }
    
    // International collaboration pattern
    if ((lowerQuery.includes('international') || lowerQuery.includes('internacional')) &&
        (lowerQuery.includes('funding') || lowerQuery.includes('financiamento') || 
         lowerQuery.includes('collaboration') || lowerQuery.includes('colaboração'))) {
      return `SELECT 
                country, 
                program_name, 
                partnership_type,
                start_date,
                end_date,
                total_budget,
                portuguese_contribution,
                focus_areas
              FROM 
                ani_international_collaborations
              ORDER BY 
                total_budget DESC`;
    }
    
    // Project-related pattern
    if (lowerQuery.includes('project') || lowerQuery.includes('projeto')) {
      if (lowerQuery.includes('active') || lowerQuery.includes('ativo')) {
        return `SELECT COUNT(*) AS total_active_projects FROM ani_projects WHERE status = 'active'`;
      }
    }
    
    // R&D investment pattern
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
    
    // Patent-related pattern
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
    
    // Metric/statistic pattern
    if (lowerQuery.includes('metric') || lowerQuery.includes('métrica') ||
        lowerQuery.includes('statistic') || lowerQuery.includes('estatística')) {
      return `SELECT name, category, value, unit, measurement_date, source 
             FROM ani_metrics 
             ORDER BY measurement_date DESC 
             LIMIT 5`;
    }
    
    // Funding/program pattern
    if (lowerQuery.includes('funding') || lowerQuery.includes('financiamento') ||
        lowerQuery.includes('program') || lowerQuery.includes('programa')) {
      return `SELECT name, description, total_budget, start_date, end_date 
             FROM ani_funding_programs 
             ORDER BY total_budget DESC 
             LIMIT 5`;
    }
    
    // Sector statistics pattern
    if (lowerQuery.includes('sector') || lowerQuery.includes('setor')) {
      return `SELECT sector, COUNT(*) as count 
             FROM ani_projects 
             WHERE sector IS NOT NULL 
             GROUP BY sector 
             ORDER BY count DESC`;
    }
    
    // Region statistics pattern
    if (lowerQuery.includes('region') || lowerQuery.includes('região')) {
      return `SELECT region, COUNT(*) as count 
             FROM ani_projects 
             WHERE region IS NOT NULL 
             GROUP BY region 
             ORDER BY count DESC`;
    }
    
    // Use AI to generate SQL when no pattern matches
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
    
    // Default fallback query
    return `SELECT * FROM ani_metrics ORDER BY measurement_date DESC LIMIT 5`;
  } catch (error) {
    console.error("Error in SQL generation:", error);
    return `SELECT * FROM ani_metrics ORDER BY measurement_date DESC LIMIT 5`;
  }
};
