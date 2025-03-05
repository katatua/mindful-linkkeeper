
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./utils.ts";

// Function to handle database queries
export async function handleDatabaseQuery(sqlQuery: string, originalResponse: string): Promise<string> {
  try {
    // Clean up the SQL query by removing trailing semicolons which can cause syntax errors
    const cleanedQuery = sqlQuery.trim().replace(/;+$/, '');
    
    console.log("Executing SQL query:", cleanedQuery);
    
    // Initialize Supabase client with service role key for database access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Make sure query is SELECT only for security
    if (!cleanedQuery.toLowerCase().startsWith('select')) {
      return `Erro: Por razões de segurança, apenas consultas SELECT são permitidas.\n\nA consulta que foi tentada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
    }
    
    // Try using the execute_sql_query function
    try {
      const { data, error } = await supabase.rpc('execute_sql_query', { 
        sql_query: cleanedQuery 
      });
      
      if (error) {
        throw new Error(`SQL function error: ${error.message}`);
      }
      
      return formatQueryResults(data || [], sqlQuery, originalResponse);
    } catch (functionError) {
      console.error("Error calling execute_sql_query:", functionError);
      
      // If the function call fails, try direct query using fetch
      try {
        console.log("Attempting direct REST API call...");
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/rpc/execute_sql_query`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'apikey': SUPABASE_SERVICE_ROLE_KEY
            },
            body: JSON.stringify({ sql_query: cleanedQuery })
          }
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Database query failed: ${errorText}`);
        }
        
        const data = await response.json();
        return formatQueryResults(data, sqlQuery, originalResponse);
      } catch (fetchError) {
        console.error("Direct fetch error:", fetchError);
        return `Erro ao executar a consulta SQL: ${fetchError.message}\n\nTente fazer uma consulta mais simples ou contate o administrador do sistema.\n\nA consulta que foi tentada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
      }
    }
  } catch (error) {
    console.error("Error in SQL execution:", error);
    return `Ocorreu um erro ao processar sua consulta: ${error.message}`;
  }
}

// Helper function to format query results in natural language
function formatQueryResults(data: any[], sqlQuery: string, originalResponse: string): string {
  if (!Array.isArray(data) || data.length === 0) {
    return `Nenhum dado encontrado no banco de dados. As tabelas parecem estar vazias.\n\nConsulta executada:\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
  }
  
  // Keep track of whether the original response contained the SQL query
  const includesSql = originalResponse.includes("<SQL>") && originalResponse.includes("</SQL>");
  
  // Extract the AI's explanation/context if present (everything before the SQL tags)
  let aiContext = "";
  if (includesSql) {
    const beforeSql = originalResponse.split("<SQL>")[0].trim();
    if (beforeSql) {
      aiContext = beforeSql + "\n\n";
    }
  }
  
  // Initialize result with visualization marker for frontend processing
  let formattedResponse = `${aiContext}<data-visualization>${JSON.stringify(data)}</data-visualization>\n\n`;
  
  // Generate natural language response based on the data type
  let naturalLanguageResponse = "";
  
  // Check the query to determine what kind of data we're dealing with
  if (sqlQuery.toLowerCase().includes("r&d") || sqlQuery.toLowerCase().includes("p&d")) {
    // R&D Investment query
    if (isDateBasedData(data)) {
      naturalLanguageResponse = generateTimeSeriesResponse(data, "investimento em P&D", "valor");
    } else if (data[0].name && data[0].value && data[0].unit) {
      const { name, value, unit, measurement_date, source } = data[0];
      const formattedDate = measurement_date ? new Date(measurement_date).toLocaleDateString('pt-PT', { 
        year: 'numeric', month: 'long', day: 'numeric'
      }) : 'data não especificada';
      
      naturalLanguageResponse = `De acordo com os dados mais recentes ${source ? `de ${source}` : ''} (${formattedDate}), o ${name} em Portugal é de ${value} ${unit}.`;
    }
  } 
  else if (sqlQuery.toLowerCase().includes("patent") || sqlQuery.toLowerCase().includes("patente")) {
    // Patents query
    if (isDateBasedData(data)) {
      naturalLanguageResponse = generateTimeSeriesResponse(data, "registro de patentes", "quantidade");
    } else if (data[0].name && data[0].value) {
      const { name, value, unit, measurement_date, source } = data[0];
      const formattedDate = measurement_date ? new Date(measurement_date).toLocaleDateString('pt-PT', { 
        year: 'numeric', month: 'long', day: 'numeric'
      }) : 'data não especificada';
      
      naturalLanguageResponse = `De acordo com os dados mais recentes ${source ? `de ${source}` : ''} (${formattedDate}), ${name} em Portugal é de ${value} ${unit || 'unidades'}.`;
    }
  }
  else if (sqlQuery.toLowerCase().includes("project") || sqlQuery.toLowerCase().includes("projeto")) {
    // Projects query
    if (data[0].total_active_projects !== undefined) {
      naturalLanguageResponse = `Atualmente, existem ${data[0].total_active_projects} projetos ativos na Agência Nacional de Inovação.`;
    } else if (isDateBasedData(data)) {
      naturalLanguageResponse = generateTimeSeriesResponse(data, "projetos", "quantidade");
    } else if (data.length > 1) {
      // Multiple projects
      naturalLanguageResponse = `Foram encontrados ${data.length} projetos. Alguns dos projetos incluem: ${data.slice(0, 3).map((p: any) => p.title || 'Projeto sem título').join(', ')}${data.length > 3 ? ' e outros.' : '.'}`;
    }
  }
  else if (sqlQuery.toLowerCase().includes("sector") || sqlQuery.toLowerCase().includes("setor")) {
    // Sector query
    if (data.length > 1 && data[0].sector) {
      const sectorCounts: {[key: string]: number} = {};
      data.forEach((item: any) => {
        const sector = item.sector || 'Não especificado';
        sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
      });
      
      const sectorList = Object.entries(sectorCounts)
        .map(([sector, count]) => `${sector}: ${count} projetos`)
        .join(', ');
      
      naturalLanguageResponse = `Distribuição por setor: ${sectorList}.`;
    }
  }
  else if (sqlQuery.toLowerCase().includes("region") || sqlQuery.toLowerCase().includes("região")) {
    // Region query
    if (data.length > 1 && data[0].region) {
      const regionCounts: {[key: string]: number} = {};
      data.forEach((item: any) => {
        const region = item.region || 'Não especificada';
        regionCounts[region] = (regionCounts[region] || 0) + 1;
      });
      
      const regionList = Object.entries(regionCounts)
        .map(([region, count]) => `${region}: ${count} projetos`)
        .join(', ');
      
      naturalLanguageResponse = `Distribuição por região: ${regionList}.`;
    }
  }
  
  // If we couldn't generate a specific natural language response, create a generic one
  if (!naturalLanguageResponse) {
    if (data.length === 1) {
      // Single result - display key values
      const result = data[0];
      const keyValues = Object.entries(result)
        .filter(([key]) => !key.startsWith('_') && !['id', 'created_at', 'updated_at'].includes(key))
        .map(([key, value]) => {
          // Format date values
          if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
            try {
              const formattedDate = new Date(value).toLocaleDateString('pt-PT');
              return `${formatColumnName(key)}: ${formattedDate}`;
            } catch {
              return `${formatColumnName(key)}: ${value}`;
            }
          }
          return `${formatColumnName(key)}: ${value}`;
        })
        .join(', ');
      
      naturalLanguageResponse = `Resultado encontrado: ${keyValues}.`;
    } else {
      // Multiple results - summarize
      const commonKeys = getCommonKeys(data);
      
      if (commonKeys.length > 0) {
        const keyToUse = getDisplayKey(commonKeys);
        const items = data.map((item: any) => item[keyToUse]).join(', ');
        
        naturalLanguageResponse = `Foram encontrados ${data.length} resultados: ${items}${data.length > 10 ? ' (entre outros)' : ''}.`;
      } else {
        naturalLanguageResponse = `Foram encontrados ${data.length} resultados.`;
      }
    }
  }
  
  // Add the natural language response to the formatted response
  formattedResponse = naturalLanguageResponse + "\n\n" + formattedResponse;
  
  // Add SQL query at the end for transparency
  if (!includesSql) {
    formattedResponse += `\n**Consulta executada:**\n\`\`\`sql\n${sqlQuery}\n\`\`\``;
  }
  
  return formattedResponse;
}

// Helper function to check if data is time-series based
function isDateBasedData(data: any[]): boolean {
  // Check if data has year, date, or measurement_date columns
  return data.length > 1 && (
    data[0].year !== undefined || 
    data[0].date !== undefined || 
    data[0].measurement_date !== undefined ||
    (data[0].name && data[0].name.includes('20')) // Check if name contains years
  );
}

// Helper function to generate time series responses
function generateTimeSeriesResponse(data: any[], metricName: string, valueName: string): string {
  // Sort data by date if possible
  const sortedData = [...data].sort((a, b) => {
    // Try to get dates from various possible fields
    const getDate = (item: any) => {
      if (item.year) return new Date(item.year, 0, 1);
      if (item.date) return new Date(item.date);
      if (item.measurement_date) return new Date(item.measurement_date);
      if (item.name && item.name.includes('20')) {
        const yearMatch = item.name.match(/20\d{2}/);
        if (yearMatch) return new Date(parseInt(yearMatch[0]), 0, 1);
      }
      return new Date(0);
    };
    
    return getDate(a).getTime() - getDate(b).getTime();
  });
  
  // Extract years and values
  const periods: string[] = [];
  const values: (number | string)[] = [];
  
  sortedData.forEach(item => {
    let period = "";
    if (item.year) period = item.year.toString();
    else if (item.date) period = new Date(item.date).getFullYear().toString();
    else if (item.measurement_date) period = new Date(item.measurement_date).getFullYear().toString();
    else if (item.name && item.name.includes('20')) {
      const yearMatch = item.name.match(/20\d{2}/);
      if (yearMatch) period = yearMatch[0];
      else period = item.name;
    }
    
    let value = item.value !== undefined ? item.value : 
                item.count !== undefined ? item.count :
                null;
                
    if (period && value !== null) {
      periods.push(period);
      values.push(value);
    }
  });
  
  // Generate natural language response
  if (periods.length > 0) {
    const total = values.reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0);
    const unit = sortedData[0].unit || '';
    
    let details = periods.map((period, i) => `${period}: ${values[i]} ${unit}`.trim()).join(', ');
    
    return `O ${metricName} nos anos ${periods.join(', ')} totalizou ${total.toFixed(2)} ${unit}. Detalhamento por período: ${details}.`.trim();
  }
  
  return '';
}

// Helper function to format column names for display
function formatColumnName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Helper function to get common keys across all data items
function getCommonKeys(data: any[]): string[] {
  if (data.length === 0) return [];
  
  const allKeys = Object.keys(data[0]);
  return allKeys.filter(key => 
    !key.startsWith('_') && 
    !['id', 'created_at', 'updated_at'].includes(key) &&
    data.every(item => item[key] !== null && item[key] !== undefined)
  );
}

// Helper function to determine which key to use for display
function getDisplayKey(keys: string[]): string {
  // Preferred display keys in order of priority
  const preferredKeys = ['name', 'title', 'description', 'category', 'sector', 'region'];
  
  for (const preferred of preferredKeys) {
    if (keys.includes(preferred)) return preferred;
  }
  
  // If no preferred key found, use first key that's not an ID or date
  return keys.find(key => 
    !key.includes('id') && 
    !key.includes('date') && 
    !key.includes('created') && 
    !key.includes('updated')
  ) || keys[0];
}
