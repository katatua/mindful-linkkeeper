
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
    
    // R&D investment patterns
    if ((lowerQuery.includes('r&d') || lowerQuery.includes('i&d') || 
        lowerQuery.includes('research') || lowerQuery.includes('pesquisa') ||
        lowerQuery.includes('investment') || lowerQuery.includes('investimento'))) {
      
      if (lowerQuery.includes('year') || lowerQuery.includes('ano') || 
          lowerQuery.includes('years') || lowerQuery.includes('anos') ||
          lowerQuery.includes('last') || lowerQuery.includes('últimos')) {
        
        const yearMatch = lowerQuery.match(/(\d+)\s*(ano|anos|year|years)/);
        const numYears = yearMatch ? parseInt(yearMatch[1]) : 3;
        
        return `SELECT name, value, unit, measurement_date, source 
               FROM ani_metrics 
               WHERE (category = 'Investment' OR category = 'Annual Funding') 
               AND (name LIKE '%R&D%' OR name LIKE '%I&D%' OR name LIKE '%Investment%' OR name LIKE '%Investimento%') 
               ORDER BY measurement_date DESC 
               LIMIT ${numYears}`;
      }
    }
    
    // Regional investment pattern
    if ((lowerQuery.includes('investimento') || lowerQuery.includes('investment')) && 
        (lowerQuery.includes('região') || lowerQuery.includes('regiao') || lowerQuery.includes('region'))) {
      
      return `SELECT region, 
                EXTRACT(YEAR FROM measurement_date) as year, 
                SUM(value) as value, 
                FIRST_VALUE(unit) OVER (PARTITION BY region ORDER BY measurement_date DESC) as unit
              FROM ani_metrics 
              WHERE category = 'Regional Growth' OR category = 'Investment'
              AND region IS NOT NULL
              AND measurement_date >= CURRENT_DATE - INTERVAL '3 years'
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
                category = 'Sectoral Funding' OR category = 'Investment'
              AND sector IS NOT NULL
              ORDER BY 
                value DESC`;
    }
    
    // Institution and research patterns
    if ((lowerQuery.includes('institution') || lowerQuery.includes('instituição') || 
         lowerQuery.includes('research') || lowerQuery.includes('pesquisa'))) {
      
      // Top institutions by project count
      if (lowerQuery.includes('top') || lowerQuery.includes('principais')) {
        return `SELECT 
                  i.institution_name, 
                  COUNT(p.id) as project_count,
                  i.type,
                  i.specialization_areas,
                  i.region
                FROM 
                  ani_institutions i
                LEFT JOIN 
                  ani_projects p ON p.institution_id = i.id
                GROUP BY 
                  i.id, i.institution_name, i.type, i.specialization_areas, i.region
                ORDER BY 
                  project_count DESC
                LIMIT 10`;
      }
      
      // Institutions by region
      if (lowerQuery.includes('region') || lowerQuery.includes('região')) {
        return `SELECT 
                  region, 
                  COUNT(*) as institution_count,
                  array_agg(institution_name) as institutions
                FROM 
                  ani_institutions
                WHERE 
                  region IS NOT NULL
                GROUP BY 
                  region
                ORDER BY 
                  institution_count DESC`;
      }
      
      // Institution specializations
      if (lowerQuery.includes('specialization') || lowerQuery.includes('especialização')) {
        return `SELECT 
                  unnest(specialization_areas) as specialization_area,
                  COUNT(*) as institution_count
                FROM 
                  ani_institutions
                WHERE 
                  specialization_areas IS NOT NULL
                GROUP BY 
                  specialization_area
                ORDER BY 
                  institution_count DESC`;
      }
      
      // Institution collaboration network
      if (lowerQuery.includes('collaboration') || lowerQuery.includes('colaboração')) {
        return `SELECT 
                  institution_name,
                  collaboration_count,
                  region,
                  type
                FROM 
                  ani_institutions
                ORDER BY 
                  collaboration_count DESC
                LIMIT 10`;
      }
    }
    
    // Project patterns
    if (lowerQuery.includes('project') || lowerQuery.includes('projeto')) {
      
      // Projects by sector
      if (lowerQuery.includes('sector') || lowerQuery.includes('setor')) {
        return `SELECT 
                  sector,
                  COUNT(*) as project_count,
                  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects,
                  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects
                FROM 
                  ani_projects
                WHERE 
                  sector IS NOT NULL
                GROUP BY 
                  sector
                ORDER BY 
                  project_count DESC`;
      }
      
      // Projects by status
      if (lowerQuery.includes('status')) {
        return `SELECT 
                  status,
                  COUNT(*) as project_count
                FROM 
                  ani_projects
                GROUP BY 
                  status
                ORDER BY 
                  project_count DESC`;
      }
      
      // Projects completion rate
      if (lowerQuery.includes('completion') || lowerQuery.includes('conclusão')) {
        return `SELECT 
                  COUNT(CASE WHEN status = 'completed' THEN 1 END)::float / COUNT(*)::float * 100 as completion_rate,
                  COUNT(*) as total_projects,
                  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects
                FROM 
                  ani_projects
                WHERE 
                  end_date >= CURRENT_DATE - INTERVAL '1 year'`;
      }
      
      // Researchers per project
      if (lowerQuery.includes('researcher') || lowerQuery.includes('pesquisador')) {
        return `SELECT 
                  p.title as project_title,
                  COUNT(pr.researcher_id) as researcher_count
                FROM 
                  ani_projects p
                LEFT JOIN 
                  ani_projects_researchers pr ON p.id = pr.project_id
                GROUP BY 
                  p.id, p.title
                ORDER BY 
                  researcher_count DESC
                LIMIT 15`;
      }
      
      // Active projects count
      if (lowerQuery.includes('active') || lowerQuery.includes('ativo')) {
        return `SELECT COUNT(*) AS total_active_projects FROM ani_projects WHERE status = 'active'`;
      }
    }
    
    // Patent patterns
    if (lowerQuery.includes('patent') || lowerQuery.includes('patente')) {
      
      // Patents by institution
      if (lowerQuery.includes('institution') || lowerQuery.includes('instituição')) {
        return `SELECT 
                  ph.organization_name,
                  ph.patent_count,
                  ph.innovation_index,
                  ph.sector,
                  i.type as institution_type
                FROM 
                  ani_patent_holders ph
                LEFT JOIN
                  ani_institutions i ON ph.institution_id = i.id
                ORDER BY 
                  ph.patent_count DESC
                LIMIT 10`;
      }
      
      // Patents by researcher
      if (lowerQuery.includes('researcher') || lowerQuery.includes('pesquisador')) {
        return `SELECT 
                  r.name as researcher_name,
                  r.patent_count,
                  r.specialization,
                  r.h_index,
                  i.institution_name
                FROM 
                  ani_researchers r
                LEFT JOIN
                  ani_institutions i ON r.institution_id = i.id
                WHERE
                  r.patent_count > 0
                ORDER BY 
                  r.patent_count DESC
                LIMIT 10`;
      }
      
      // Patents by sector
      if (lowerQuery.includes('sector') || lowerQuery.includes('setor')) {
        return `SELECT 
                  sector,
                  SUM(patent_count) as total_patents,
                  AVG(innovation_index) as avg_innovation_index
                FROM 
                  ani_patent_holders
                WHERE
                  sector IS NOT NULL
                GROUP BY 
                  sector
                ORDER BY 
                  total_patents DESC`;
      }
      
      // Patent growth rate
      if (lowerQuery.includes('growth') || lowerQuery.includes('crescimento')) {
        return `SELECT 
                  name, 
                  value, 
                  unit, 
                  measurement_date, 
                  description, 
                  source 
                FROM 
                  ani_metrics 
                WHERE 
                  category = 'Intellectual Property' 
                  AND name LIKE '%Growth Rate%'
                ORDER BY 
                  measurement_date DESC`;
      }
    }
    
    // Funding program patterns
    if (lowerQuery.includes('funding') || lowerQuery.includes('financiamento') ||
        lowerQuery.includes('program') || lowerQuery.includes('programa')) {
      
      // Active funding programs with deadlines
      if (lowerQuery.includes('active') || lowerQuery.includes('ativo') || 
          lowerQuery.includes('deadline') || lowerQuery.includes('prazo')) {
        return `SELECT 
                  name, 
                  description,
                  total_budget,
                  application_deadline,
                  next_call_date,
                  funding_type,
                  sector_focus
                FROM 
                  ani_funding_programs
                WHERE 
                  application_deadline >= CURRENT_DATE
                ORDER BY 
                  application_deadline ASC
                LIMIT 10`;
      }
      
      // Funding application success rates
      if (lowerQuery.includes('success') || lowerQuery.includes('sucesso')) {
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
      
      // Funding by sector focus
      if ((lowerQuery.includes('sector') || lowerQuery.includes('setor')) && 
          (lowerQuery.includes('focus') || lowerQuery.includes('foco'))) {
        return `SELECT 
                  unnest(sector_focus) as focus_area,
                  COUNT(*) as program_count,
                  SUM(total_budget) as total_budget
                FROM 
                  ani_funding_programs
                WHERE 
                  sector_focus IS NOT NULL
                GROUP BY 
                  focus_area
                ORDER BY 
                  total_budget DESC`;
      }
      
      // Average review time
      if (lowerQuery.includes('review') || lowerQuery.includes('análise') || 
          lowerQuery.includes('time') || lowerQuery.includes('tempo')) {
        return `SELECT 
                  AVG(review_time_days) as avg_review_time,
                  MIN(review_time_days) as min_review_time,
                  MAX(review_time_days) as max_review_time
                FROM 
                  ani_funding_programs
                WHERE 
                  review_time_days IS NOT NULL`;
      }
    }
    
    // International collaboration pattern
    if ((lowerQuery.includes('international') || lowerQuery.includes('internacional')) &&
        (lowerQuery.includes('collaboration') || lowerQuery.includes('colaboração'))) {
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
    
    // Use AI to generate SQL when no pattern matches
    const { data, error } = await supabase.functions.invoke('generate-sql', {
      body: { 
        question: query,
        language: lowerQuery.includes('em portugal') ? 'pt' : 'en'
      }
    });
    
    if (error) {
      console.error("Error generating SQL:", error);
      throw new Error("Failed to generate SQL query");
    }
    
    if (data && data.sql) {
      return data.sql.trim();
    }
    
    // Default fallback query if all else fails
    return `SELECT * FROM ani_metrics ORDER BY measurement_date DESC LIMIT 5`;
  } catch (error) {
    console.error("Error in SQL generation:", error);
    return `SELECT * FROM ani_metrics ORDER BY measurement_date DESC LIMIT 5`;
  }
};
