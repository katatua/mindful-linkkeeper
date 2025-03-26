
/**
 * Utility to generate SQL from natural language queries using AI
 */

/**
 * Generate SQL from a natural language question using a template-based approach
 */
export const generateSqlFromNaturalLanguage = async (question: string): Promise<string> => {
  // Clean and normalize the question
  const normalizedQuestion = question.trim().toLowerCase();
  
  // Extract year information from the query to better handle temporal queries
  const yearMatches = normalizedQuestion.match(/\b(20[0-9][0-9])\b/g);
  const yearsInQuery = yearMatches || [];
  
  // Detect potential tables from the query
  let potentialTables = [];
  
  // Check for patent-related queries
  if (normalizedQuestion.includes('patent') || normalizedQuestion.includes('patente')) {
    potentialTables.push({
      table: 'ani_patent_holders',
      alias: 'ph',
      fields: ['organization_name', 'patent_count', 'innovation_index', 'sector', 'year']
    });
    
    if (yearsInQuery.length > 0) {
      // If the query mentions a specific year or years
      if (yearsInQuery.length === 1) {
        const year = parseInt(yearsInQuery[0]);
        return `
          SELECT organization_name, patent_count, innovation_index, sector, year
          FROM ani_patent_holders
          WHERE year = ${year}
          ORDER BY patent_count DESC
        `;
      } else if (yearsInQuery.length >= 2) {
        // Year range query
        const startYear = Math.min(...yearsInQuery.map(y => parseInt(y)));
        const endYear = Math.max(...yearsInQuery.map(y => parseInt(y)));
        return `
          SELECT organization_name, patent_count, innovation_index, sector, year
          FROM ani_patent_holders
          WHERE year BETWEEN ${startYear} AND ${endYear}
          ORDER BY year ASC, patent_count DESC
        `;
      }
    }
    
    // Fallback patent query
    return `
      SELECT organization_name, patent_count, innovation_index, sector, year
      FROM ani_patent_holders
      ORDER BY patent_count DESC
    `;
  }
  
  // R&D investment queries
  if (normalizedQuestion.includes('r&d') || 
      normalizedQuestion.includes('i&d') || 
      normalizedQuestion.includes('investimento') || 
      normalizedQuestion.includes('investment')) {
    
    if (yearsInQuery.length > 0) {
      // Year-specific or year range query
      if (yearsInQuery.length === 1) {
        const year = parseInt(yearsInQuery[0]);
        return `
          SELECT name, value, unit, category, measurement_date, region
          FROM ani_metrics
          WHERE (category = 'Investment' OR category = 'R&D')
          AND EXTRACT(YEAR FROM measurement_date) = ${year}
          ORDER BY value DESC
        `;
      } else if (yearsInQuery.length >= 2) {
        const startYear = Math.min(...yearsInQuery.map(y => parseInt(y)));
        const endYear = Math.max(...yearsInQuery.map(y => parseInt(y)));
        return `
          SELECT name, value, unit, category, measurement_date, region
          FROM ani_metrics
          WHERE (category = 'Investment' OR category = 'R&D')
          AND EXTRACT(YEAR FROM measurement_date) BETWEEN ${startYear} AND ${endYear}
          ORDER BY measurement_date, value DESC
        `;
      }
    }
    
    // Fallback R&D investment query
    return `
      SELECT name, value, unit, category, measurement_date, region
      FROM ani_metrics
      WHERE (category = 'Investment' OR category = 'R&D')
      ORDER BY measurement_date DESC, value DESC
    `;
  }
  
  // Regional investment queries
  if ((normalizedQuestion.includes('region') || normalizedQuestion.includes('região')) &&
      (normalizedQuestion.includes('investment') || normalizedQuestion.includes('investimento'))) {
    
    // Check for dynamic tables as well
    if (yearsInQuery.length > 0) {
      // If there's a specific year mentioned
      const year = parseInt(yearsInQuery[0]);
      return `
        SELECT region, value, unit, year 
        FROM (
          SELECT region, value, unit, EXTRACT(YEAR FROM measurement_date)::integer as year
          FROM ani_metrics
          WHERE category = 'Investment' AND region IS NOT NULL
          UNION
          SELECT region, funding_amount as value, 'EUR' as unit, year
          FROM projects
          WHERE year IS NOT NULL
        ) combined_data
        WHERE year = ${year}
        ORDER BY value DESC
      `;
    }
    
    // Fallback regional query
    return `
      SELECT region, value, unit 
      FROM (
        SELECT region, value, unit
        FROM ani_metrics
        WHERE category = 'Investment' AND region IS NOT NULL
        UNION
        SELECT region, funding_amount as value, 'EUR' as unit
        FROM projects
        WHERE region IS NOT NULL
      ) combined_data
      ORDER BY value DESC
    `;
  }
  
  // Project queries
  if (normalizedQuestion.includes('project') || normalizedQuestion.includes('projeto')) {
    if (yearsInQuery.length > 0) {
      // Year-specific project query
      const year = parseInt(yearsInQuery[0]);
      return `
        SELECT title, description, status, funding_amount, sector, region, organization, year
        FROM projects
        WHERE year = ${year}
        ORDER BY funding_amount DESC
      `;
    }
    
    // Fallback project query
    return `
      SELECT title, description, status, funding_amount, sector, region, organization
      FROM projects
      ORDER BY funding_amount DESC
    `;
  }
  
  // Funding program queries
  if (normalizedQuestion.includes('funding') || 
      normalizedQuestion.includes('program') || 
      normalizedQuestion.includes('financiamento') || 
      normalizedQuestion.includes('programa')) {
    
    return `
      SELECT name, description, total_budget, funding_type, 
             application_deadline, success_rate
      FROM ani_funding_programs
      ORDER BY total_budget DESC
    `;
  }
  
  // Default fallback query when we can't determine the intent
  return `
    SELECT table_name, record_count, status, last_populated
    FROM ani_database_status
    ORDER BY record_count DESC
  `;
};
