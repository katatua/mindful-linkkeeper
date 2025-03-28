
// Helper function to extract energy-related keywords from a query
export const extractEnergyKeywords = (query: string): string[] => {
  const lowercaseQuery = query.toLowerCase();
  
  // Define sets of related terms to improve matching
  const energyTerms = [
    'renewable energy', 'clean energy', 'green energy', 
    'sustainable energy', 'alternative energy',
    'solar', 'wind', 'hydro', 'biomass', 'geothermal',
    'photovoltaic', 'renewable', 'clean power', 'green power'
  ];
  
  // Return all matching terms found in the query
  return energyTerms.filter(term => lowercaseQuery.includes(term));
};

// Helper function to extract technology-related keywords from a query
export const extractTechnologyKeywords = (query: string): string[] => {
  const lowercaseQuery = query.toLowerCase();
  
  // Define sets of related terms to improve matching
  const techTerms = [
    'technology', 'tech', 'digital', 'software', 'hardware', 
    'ai', 'artificial intelligence', 'machine learning', 'ml',
    'data science', 'cloud', 'iot', 'internet of things',
    'blockchain', 'cyber', 'cybersecurity', 'robotics',
    'automation', 'computing', 'fintech', 'information technology',
    'it', 'telecommunications', 'telecom'
  ];
  
  // Return all matching terms found in the query
  return techTerms.filter(term => lowercaseQuery.includes(term));
};

// Helper function to extract region-related keywords and their variations from a query
export const extractRegionKeywords = (query: string): string[] => {
  const lowercaseQuery = query.toLowerCase();
  
  // Define region names and their variations (English/Portuguese spellings)
  const regionMappings = [
    { original: 'lisbon', variations: ['lisbon', 'lisboa'] },
    { original: 'porto', variations: ['porto', 'oporto'] },
    { original: 'north', variations: ['north', 'norte'] },
    { original: 'south', variations: ['south', 'sul'] },
    { original: 'algarve', variations: ['algarve'] },
    { original: 'azores', variations: ['azores', 'açores'] },
    { original: 'madeira', variations: ['madeira'] },
    { original: 'center', variations: ['center', 'centro', 'central'] },
    { original: 'alentejo', variations: ['alentejo'] },
    { original: 'braga', variations: ['braga'] },
    { original: 'coimbra', variations: ['coimbra'] },
    { original: 'evora', variations: ['evora', 'évora'] }
  ];
  
  // Find all region terms that match the query
  const matches = regionMappings.filter(region => 
    region.variations.some(variation => lowercaseQuery.includes(variation))
  );
  
  return matches.map(match => match.original);
};
