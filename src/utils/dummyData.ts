
/**
 * Dummy data for simulating database responses when the database is not available
 */

// Metrics data similar to ani_metrics table
export const dummyMetrics = [
  {
    id: "1",
    name: "R&D Intensity",
    value: 1.41,
    unit: "%",
    category: "Investment",
    measurement_date: "2023-12-31",
    description: "R&D expenditure as percentage of GDP",
    source: "Statistics Portugal",
    sector: null,
    region: null
  },
  {
    id: "2",
    name: "Private Sector R&D Investment",
    value: 58.2,
    unit: "%",
    category: "Investment",
    measurement_date: "2023-12-31",
    description: "Percentage of total R&D performed by business sector",
    source: "Statistics Portugal",
    sector: "Business",
    region: null
  },
  {
    id: "3",
    name: "Public Sector R&D Investment",
    value: 41.8,
    unit: "%",
    category: "Investment",
    measurement_date: "2023-12-31",
    description: "Percentage of total R&D performed by public sector",
    source: "Statistics Portugal",
    sector: "Public",
    region: null
  },
  {
    id: "4",
    name: "Patent Applications",
    value: 235,
    unit: "applications",
    category: "Intellectual Property",
    measurement_date: "2023-12-31",
    description: "Number of patent applications filed",
    source: "European Patent Office",
    sector: null,
    region: null
  },
  {
    id: "5",
    name: "Patent Growth Rate",
    value: 5.2,
    unit: "%",
    category: "Intellectual Property",
    measurement_date: "2023-12-31",
    description: "Annual growth rate in patent applications",
    source: "European Patent Office",
    sector: null,
    region: null
  }
];

// Regional investment data
export const dummyRegionalInvestment = [
  {
    region: "Norte",
    year: 2023,
    value: 250.4,
    unit: "Million EUR"
  },
  {
    region: "Centro",
    year: 2023,
    value: 180.6,
    unit: "Million EUR"
  },
  {
    region: "Lisboa",
    year: 2023,
    value: 310.2,
    unit: "Million EUR"
  },
  {
    region: "Alentejo",
    year: 2023,
    value: 85.3,
    unit: "Million EUR"
  },
  {
    region: "Algarve",
    year: 2023,
    value: 42.8,
    unit: "Million EUR"
  },
  {
    region: "Açores",
    year: 2023,
    value: 32.5,
    unit: "Million EUR"
  },
  {
    region: "Madeira",
    year: 2023,
    value: 28.7,
    unit: "Million EUR"
  }
];

// Funding programs data
export const dummyFundingPrograms = [
  {
    id: "1",
    name: "Innovation Boost",
    description: "Support for innovative projects in SMEs",
    total_budget: 25000000,
    funding_type: "Grant",
    sector_focus: ["ICT", "Manufacturing", "Health"],
    start_date: "2023-01-15",
    end_date: "2024-12-31",
    application_deadline: "2024-06-30",
    success_rate: 48.5
  },
  {
    id: "2",
    name: "Green Tech Initiative",
    description: "Funding for sustainable technology development",
    total_budget: 18500000,
    funding_type: "Co-financing",
    sector_focus: ["Renewable Energy", "Sustainability", "Agriculture"],
    start_date: "2023-03-01",
    end_date: "2025-02-28",
    application_deadline: "2024-09-15",
    success_rate: 42.3
  },
  {
    id: "3",
    name: "Digital Transformation Fund",
    description: "Support for business digitalization projects",
    total_budget: 15000000,
    funding_type: "Loan",
    sector_focus: ["ICT", "Services", "Retail"],
    start_date: "2023-06-01",
    end_date: "2024-12-31",
    application_deadline: "2024-05-31",
    success_rate: 53.8
  }
];

// Patents data
export const dummyPatentHolders = [
  {
    id: "1",
    organization_name: "University of Lisbon",
    patent_count: 48,
    innovation_index: 8.7,
    sector: "Higher Education",
    year: 2023
  },
  {
    id: "2",
    organization_name: "University of Porto",
    patent_count: 42,
    innovation_index: 8.4,
    sector: "Higher Education",
    year: 2023
  },
  {
    id: "3",
    organization_name: "Pharmaceutical Company X",
    patent_count: 35,
    innovation_index: 9.2,
    sector: "Pharmaceuticals",
    year: 2023
  },
  {
    id: "4",
    organization_name: "Tech Solutions Inc.",
    patent_count: 29,
    innovation_index: 8.9,
    sector: "Information Technology",
    year: 2023
  }
];

// Projects data
export const dummyProjects = [
  {
    id: "1",
    title: "AI for Predictive Healthcare",
    description: "Developing AI solutions for early disease prediction",
    sector: "Health",
    status: "active",
    start_date: "2023-02-15",
    end_date: "2025-02-14",
    funding_amount: 850000,
    region: "Lisboa"
  },
  {
    id: "2",
    title: "Smart Agricultural Systems",
    description: "IoT solutions for precision agriculture",
    sector: "Agriculture",
    status: "active",
    start_date: "2023-05-01",
    end_date: "2025-04-30",
    funding_amount: 620000,
    region: "Alentejo"
  },
  {
    id: "3",
    title: "Renewable Energy Storage Solutions",
    description: "Advanced battery technologies for renewable energy",
    sector: "Energy",
    status: "active",
    start_date: "2023-03-10",
    end_date: "2024-09-09",
    funding_amount: 780000,
    region: "Norte"
  }
];

// Helper function to find relevant dummy data based on keywords in a query
export const findRelevantDummyData = (query: string): any[] => {
  const queryLower = query.toLowerCase();
  
  // Check for regional investment queries
  if ((queryLower.includes('region') || queryLower.includes('região') || queryLower.includes('regiao')) &&
      (queryLower.includes('investment') || queryLower.includes('investimento'))) {
    return dummyRegionalInvestment;
  }
  
  // Check for patent-related queries
  if (queryLower.includes('patent') || queryLower.includes('patente')) {
    return dummyPatentHolders;
  }
  
  // Check for funding program queries
  if (queryLower.includes('funding') || queryLower.includes('programa') || 
      queryLower.includes('financiamento') || queryLower.includes('program')) {
    return dummyFundingPrograms;
  }
  
  // Check for project queries
  if (queryLower.includes('project') || queryLower.includes('projeto')) {
    return dummyProjects;
  }
  
  // Default to metrics data
  return dummyMetrics;
};

// Generate natural language responses for dummy data
export const generateDummyResponse = (query: string, language: 'en' | 'pt' = 'en'): { 
  response: string;
  visualizationData?: any[];
} => {
  const queryLower = query.toLowerCase();
  let response = "";
  let visualizationData = undefined;
  
  // R&D investment query
  if (queryLower.includes('r&d') || queryLower.includes('investment') || 
      queryLower.includes('investimento') || queryLower.includes('i&d')) {
    if (language === 'en') {
      response = "According to the latest data, R&D intensity in Portugal has reached 1.41% of GDP. " +
        "The business sector accounts for 58.2% of total R&D expenditure, while public research " +
        "organizations and higher education institutions contribute 41.8% of investment.";
    } else {
      response = "De acordo com os dados mais recentes, a intensidade de I&D em Portugal atingiu 1,41% do PIB. " +
        "O setor empresarial representa 58,2% do total de despesas em I&D, enquanto as organizações " +
        "públicas de investigação e instituições de ensino superior contribuem com 41,8% do investimento.";
    }
    visualizationData = dummyMetrics.filter(m => 
      m.category === "Investment" && (m.name.includes("R&D") || m.name.includes("Investment"))
    );
  }
  
  // Regional investment query
  else if ((queryLower.includes('region') || queryLower.includes('região') || queryLower.includes('regiao')) &&
           (queryLower.includes('investment') || queryLower.includes('investimento'))) {
    const totalInvestment = dummyRegionalInvestment.reduce((sum, item) => sum + item.value, 0);
    
    if (language === 'en') {
      response = `The total regional investment is ${totalInvestment.toFixed(1)} Million EUR, with Lisboa (310.2M), Norte (250.4M), and Centro (180.6M) regions receiving the highest investment.`;
    } else {
      response = `O investimento regional total é de ${totalInvestment.toFixed(1)} Milhões de EUR, com as regiões de Lisboa (310,2M), Norte (250,4M) e Centro (180,6M) a receberem o maior investimento.`;
    }
    visualizationData = dummyRegionalInvestment;
  }
  
  // Patent query
  else if (queryLower.includes('patent') || queryLower.includes('patente')) {
    const totalPatents = dummyPatentHolders.reduce((sum, item) => sum + item.patent_count, 0);
    
    if (language === 'en') {
      response = `In 2023, there were ${totalPatents} patents filed by top organizations. The University of Lisbon leads with 48 patents, followed by the University of Porto with 42 patents. The Patent Growth Rate has been 5.2% over the past year.`;
    } else {
      response = `Em 2023, foram registadas ${totalPatents} patentes pelas principais organizações. A Universidade de Lisboa lidera com 48 patentes, seguida pela Universidade do Porto com 42 patentes. A taxa de crescimento de patentes foi de 5,2% no último ano.`;
    }
    visualizationData = dummyPatentHolders;
  }
  
  // Funding programs query
  else if (queryLower.includes('funding') || queryLower.includes('programa') || 
      queryLower.includes('financiamento') || queryLower.includes('program')) {
    const totalBudget = dummyFundingPrograms.reduce((sum, item) => sum + (item.total_budget || 0), 0);
    
    if (language === 'en') {
      response = `There are currently ${dummyFundingPrograms.length} active funding programs with a total budget of ${(totalBudget/1000000).toFixed(1)} Million EUR. The largest program is Innovation Boost with a budget of 25M EUR.`;
    } else {
      response = `Existem atualmente ${dummyFundingPrograms.length} programas de financiamento ativos com um orçamento total de ${(totalBudget/1000000).toFixed(1)} Milhões de EUR. O maior programa é o Innovation Boost com um orçamento de 25M EUR.`;
    }
    visualizationData = dummyFundingPrograms;
  }
  
  // Projects query
  else if (queryLower.includes('project') || queryLower.includes('projeto')) {
    if (language === 'en') {
      response = `There are currently ${dummyProjects.length} active projects across different sectors including Health, Agriculture, and Energy. The total funding allocated to these projects is ${dummyProjects.reduce((sum, p) => sum + (p.funding_amount || 0), 0).toLocaleString()} EUR.`;
    } else {
      response = `Existem atualmente ${dummyProjects.length} projetos ativos em diferentes setores, incluindo Saúde, Agricultura e Energia. O financiamento total alocado a estes projetos é de ${dummyProjects.reduce((sum, p) => sum + (p.funding_amount || 0), 0).toLocaleString()} EUR.`;
    }
    visualizationData = dummyProjects;
  }
  
  // Generic response for other queries
  else {
    if (language === 'en') {
      response = "Based on our latest data, Portugal's innovation indicators show positive trends across R&D investment, patent applications, and funding programs. The R&D intensity has reached 1.41% of GDP with the business sector leading the investment.";
    } else {
      response = "Com base nos nossos dados mais recentes, os indicadores de inovação de Portugal mostram tendências positivas em investimento em I&D, pedidos de patentes e programas de financiamento. A intensidade de I&D atingiu 1,41% do PIB, com o setor empresarial liderando o investimento.";
    }
    visualizationData = dummyMetrics;
  }
  
  return { response, visualizationData };
};
