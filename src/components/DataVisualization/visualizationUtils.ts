
// Colors for charts
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

export const determineDataStructure = (data: any[]) => {
  if (!data || data.length === 0) return { processedData: [], dataKeys: [], type: 'bar', title: 'Visualização de Dados' };

  // Discover keys and determine best visualization type
  const sampleItem = data[0];
  const keys = Object.keys(sampleItem).filter(key => 
    !['id', 'created_at', 'updated_at'].includes(key) && 
    typeof sampleItem[key] !== 'object'
  );

  // Check if data has dates/years (for time series)
  const hasDates = keys.some(key => 
    key.includes('date') || 
    key.includes('year') || 
    key.includes('measurement_date') || 
    (key === 'name' && String(sampleItem[key]).match(/\b20\d{2}\b/))
  );

  // Check if we have numeric data to visualize
  const numericKeys = keys.filter(key => 
    typeof sampleItem[key] === 'number' || 
    !isNaN(parseFloat(sampleItem[key]))
  );

  // Determine title based on data
  let vizTitle = 'Visualização de Dados';
  if (keys.includes('category')) {
    vizTitle = `Dados de ${sampleItem.category}`;
  } else if (keys.includes('name') && sampleItem.name.includes('R&D')) {
    vizTitle = 'Investimento em P&D';
  } else if (keys.includes('name') && sampleItem.name.includes('Patent')) {
    vizTitle = 'Dados de Patentes';
  } else if (keys.includes('sector')) {
    vizTitle = 'Dados por Setor';
  } else if (keys.includes('region')) {
    vizTitle = 'Dados por Região';
  }

  // Determine best visualization type
  let vizType: 'bar' | 'line' | 'pie' = 'bar';
  let processedDataItems: any[] = [];
  let dataVisKeys: string[] = [];

  if (data.length === 1) {
    // For a single item, a pie chart is probably better
    vizType = 'pie';
    processedDataItems = keys
      .filter(key => typeof sampleItem[key] === 'number' || !isNaN(parseFloat(sampleItem[key])))
      .map(key => ({
        name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        value: parseFloat(sampleItem[key]) || 0
      }));
    dataVisKeys = ['value'];
  } else if (data.length <= 5 && keys.includes('name') && keys.includes('value')) {
    // Data seems to be simple metrics (name-value), good for pie
    vizType = 'pie';
    processedDataItems = data.map(item => ({
      name: item.name,
      value: parseFloat(item.value) || 0
    }));
    dataVisKeys = ['value'];
  } else if (hasDates) {
    // Time series data, good for lines
    vizType = 'line';
    
    // Try to extract date/year from data
    processedDataItems = data.map(item => {
      const result: any = {};
      
      // Determine period name (usually a year)
      if (item.year) {
        result.period = item.year;
      } else if (item.measurement_date) {
        result.period = new Date(item.measurement_date).getFullYear();
      } else if (item.date) {
        result.period = new Date(item.date).getFullYear();
      } else if (item.name && item.name.match(/\b20\d{2}\b/)) {
        const matches = item.name.match(/\b20\d{2}\b/);
        if (matches) result.period = matches[0];
        else result.period = item.name;
      } else {
        result.period = `Item ${processedDataItems.length + 1}`;
      }
      
      // Add numeric values
      numericKeys.forEach(key => {
        result[key] = parseFloat(item[key]) || 0;
      });
      
      return result;
    });
    
    dataVisKeys = numericKeys;
  } else if (data.length > 1 && data.length <= 10) {
    // Few items, good for bars
    vizType = 'bar';
    
    // Determine key for names
    const nameKey = keys.find(k => k === 'name' || k === 'title' || k === 'category' || k === 'region' || k === 'sector') || keys[0];
    
    processedDataItems = data.map(item => {
      const result: any = { name: item[nameKey] || `Item ${processedDataItems.length + 1}` };
      
      // Add numeric values
      numericKeys.forEach(key => {
        if (key !== nameKey) {
          result[key.replace(/_/g, ' ')] = parseFloat(item[key]) || 0;
        }
      });
      
      return result;
    });
    
    dataVisKeys = numericKeys.filter(k => k !== nameKey).map(k => k.replace(/_/g, ' '));
  } else {
    // Many items, use bars for first 10
    vizType = 'bar';
    
    // Determine key for names
    const nameKey = keys.find(k => k === 'name' || k === 'title' || k === 'category' || k === 'region' || k === 'sector') || keys[0];
    const valueKey = numericKeys.find(k => k !== nameKey) || 'value';
    
    processedDataItems = data.slice(0, 10).map(item => ({
      name: item[nameKey] || `Item ${processedDataItems.length + 1}`,
      [valueKey]: parseFloat(item[valueKey]) || 0
    }));
    
    dataVisKeys = [valueKey];
  }

  return {
    processedData: processedDataItems,
    dataKeys: dataVisKeys,
    type: vizType,
    title: vizTitle
  };
};
