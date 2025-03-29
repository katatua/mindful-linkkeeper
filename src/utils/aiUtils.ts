
import { nanoid } from 'nanoid';

// Generate a unique ID for tracking messages
export const genId = () => nanoid();

// Format database values for display (handle special cases)
export const formatDatabaseValue = (value: any, columnName: string) => {
  if (value === null || value === undefined) return '';
  
  // Format dates
  if ((columnName.includes('date') || columnName.includes('_at')) && typeof value === 'string' && value.includes('-')) {
    try {
      const date = new Date(value);
      return date.toLocaleDateString('pt-PT');
    } catch (e) {
      return value;
    }
  }
  
  // Format arrays
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  // Format currency values
  if ((columnName.includes('budget') || columnName.includes('amount') || columnName.includes('funding')) && typeof value === 'number') {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
  }
  
  return value.toString();
};

// Classification function for documents
export const classifyDocument = async (data: { 
  title: string; 
  summary?: string; 
  fileName?: string;
}): Promise<string> => {
  try {
    const { data: response, error } = await fetch('/api/classify-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(res => res.json());
    
    if (error) throw error;
    
    return response?.classification || 'general';
  } catch (error) {
    console.error('Error classifying document:', error);
    // Default classification if something goes wrong
    return 'general';
  }
};

// Comprehensive suggested database questions in Portuguese
export const suggestedDatabaseQueries = [
  // General queries
  "Quais são os programas de financiamento disponíveis para energia renovável?",
  "Quanto investimento foi feito em I&D no ano de 2022?",
  "Quais são as métricas de inovação para a região de Lisboa?",
  "Quantas patentes foram registadas em Portugal nos últimos 3 anos?",
  "Quais são os projetos ativos na área de biotecnologia?",
  "Quantas colaborações internacionais existem com Alemanha?",
  "Quais são as instituições com maior número de patentes?",
  "Quanto financiamento foi aprovado para projetos na região Norte em 2023?",
  "Quais são as áreas de foco das políticas de inovação atuais?",
  "Quem são os pesquisadores com maior índice h na área de energia renovável?",
  
  // Funding programs queries
  "Quais programas de financiamento têm orçamento superior a 1 milhão de euros?",
  "Que programas aceitam candidaturas até o final de 2024?",
  "Quais são os tipos de financiamento disponíveis para PMEs?",
  "Qual o programa com maior taxa de sucesso para candidaturas?",
  
  // Projects queries
  "Quais projetos foram concluídos em 2023?",
  "Que projetos receberam mais de 500 mil euros em financiamento?",
  "Quantos projetos estão em execução na área de saúde?",
  "Quais são os projetos coordenados pela Universidade de Lisboa?",
  
  // Metrics queries
  "Qual foi o crescimento do investimento em I&D entre 2020 e 2023?",
  "Quais são as métricas de inovação disponíveis para o setor de tecnologia?",
  "Qual região tem o maior valor de exportação de tecnologia?",
  "Como evoluiu o número de startups criadas desde 2019?",
  
  // Patent queries
  "Quais organizações registraram mais patentes em 2022?",
  "Quantas patentes foram registradas no setor de energia renovável?",
  "Qual foi a tendência de registro de patentes nos últimos 5 anos?",
  "Quais regiões lideram em número de patentes per capita?",
  
  // International collaboration queries
  "Quais países são parceiros principais em colaborações de pesquisa?",
  "Qual o valor médio do orçamento das colaborações internacionais?",
  "Quantas colaborações existem na área de inteligência artificial?",
  "Quais são as colaborações mais recentes iniciadas em 2023?"
];

// Predefined patent-related queries and answers
export const predefinedQueries = [
  {
    query: "Quantas patentes foram registadas em 2022",
    response: {
      message: "Em 2022, foram registadas 342 patentes em Portugal. Este número representa um aumento de 8% em relação ao ano anterior. A maioria destas patentes foi registada nos setores de tecnologia, biotecnologia e energia renovável.",
      sqlQuery: "SELECT COUNT(*) as total FROM ani_patent_holders WHERE year = 2022",
      results: [{ total: 342 }]
    }
  },
  {
    query: "Qual foi o investimento em I&D em 2023",
    response: {
      message: "O investimento total em Investigação e Desenvolvimento (I&D) em Portugal em 2023 foi de €1.245.600.000, representando aproximadamente 1,6% do PIB nacional. Este valor marca um aumento de 12% em relação ao investimento de 2022.",
      sqlQuery: "SELECT SUM(value) as total_investment FROM ani_metrics WHERE category = 'investment' AND name LIKE '%I&D%' AND EXTRACT(YEAR FROM measurement_date) = 2023",
      results: [{ total_investment: 1245600000 }]
    }
  },
  {
    query: "Número de colaborações internacionais em 2023",
    response: {
      message: "Em 2023, Portugal estabeleceu 78 novas colaborações internacionais de pesquisa e inovação. Os principais países parceiros foram Espanha (18), Alemanha (15), França (12) e Reino Unido (10). Estas colaborações representam um investimento total de €92 milhões.",
      sqlQuery: "SELECT COUNT(*) as total FROM ani_international_collaborations WHERE EXTRACT(YEAR FROM start_date) = 2023",
      results: [{ total: 78 }]
    }
  }
];

// Generate comprehensive mock data for all database tables
// This data spans multiple years (2019-2024) with diverse entries

// Create years array for consistent data generation
const years = [2019, 2020, 2021, 2022, 2023, 2024];
const regions = ['Lisboa', 'Porto', 'Norte', 'Centro', 'Alentejo', 'Algarve', 'Madeira', 'Açores'];
const sectors = ['Tecnologia', 'Saúde', 'Energia', 'Biotecnologia', 'Agricultura', 'Manufatura', 'Educação', 'Transportes'];
const statuses = ['ativo', 'concluído', 'em análise', 'aprovado', 'rejeitado', 'em execução'];

// 1. Funding Programs - diverse data across years
const mockFundingPrograms = [];
const fundingTypes = ['subsídio', 'empréstimo', 'capital', 'garantia', 'misto', 'incentivo fiscal'];

for (let year of years) {
  // Create 8-12 programs per year
  const numPrograms = Math.floor(Math.random() * 5) + 8;
  
  for (let i = 0; i < numPrograms; i++) {
    const sectorFocus = [];
    // Add 1-3 random sectors as focus
    const numSectors = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numSectors; j++) {
      const randomSector = sectors[Math.floor(Math.random() * sectors.length)];
      if (!sectorFocus.includes(randomSector)) {
        sectorFocus.push(randomSector);
      }
    }
    
    // Generate random budget between 100k and 10M
    const budget = Math.floor(Math.random() * 9900000) + 100000;
    
    // Create application deadline in the future for current year, or in the past for previous years
    const appDeadlineMonth = Math.floor(Math.random() * 12) + 1;
    const appDeadlineDay = Math.floor(Math.random() * 28) + 1;
    
    // Create end date 1-3 years after the start
    const endYear = year + Math.floor(Math.random() * 3) + 1;
    const endMonth = Math.floor(Math.random() * 12) + 1;
    const endDay = Math.floor(Math.random() * 28) + 1;
    
    mockFundingPrograms.push({
      id: `fp-${year}-${i + 1}`,
      name: `Programa de Financiamento ${year} - ${sectorFocus[0]}`,
      description: `Programa de apoio a iniciativas de ${sectorFocus.join(', ')} para o ano ${year}`,
      total_budget: budget,
      start_date: `${year}-01-01`,
      end_date: `${endYear}-${endMonth.toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}`,
      application_deadline: `${year}-${appDeadlineMonth.toString().padStart(2, '0')}-${appDeadlineDay.toString().padStart(2, '0')}`,
      funding_type: fundingTypes[Math.floor(Math.random() * fundingTypes.length)],
      sector_focus: sectorFocus,
      success_rate: Math.floor(Math.random() * 60) + 20, // Success rate between 20% and 80%
      eligibility_criteria: "Empresas e instituições de pesquisa registradas em Portugal"
    });
  }
}

// 2. Projects - diverse data across years, regions, and sectors
const mockProjects = [];
const organizations = [
  'Universidade de Lisboa', 'Universidade do Porto', 'Instituto Superior Técnico',
  'INESC TEC', 'ITQB NOVA', 'Centro de Biotecnologia Agrícola',
  'Instituto Pedro Nunes', 'Fraunhofer Portugal', 'TechSolutions Portugal',
  'BioMedica Research', 'EnerSolar', 'SmartCities Lab', 'AgroTech Portugal'
];

for (let year of years) {
  // Create 15-25 projects per year
  const numProjects = Math.floor(Math.random() * 10) + 15;
  
  for (let i = 0; i < numProjects; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const organization = organizations[Math.floor(Math.random() * organizations.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Funding amount between 50k and 2M
    const fundingAmount = Math.floor(Math.random() * 1950000) + 50000;
    
    // Create end date 1-3 years after the start
    const endYear = year + Math.floor(Math.random() * 3) + 1;
    const endMonth = Math.floor(Math.random() * 12) + 1;
    const endDay = Math.floor(Math.random() * 28) + 1;
    
    mockProjects.push({
      id: `proj-${year}-${i + 1}`,
      title: `Projeto de ${sector} - ${i + 1}/${year}`,
      description: `Desenvolvimento de soluções inovadoras em ${sector} para a região de ${region}`,
      funding_amount: fundingAmount,
      start_date: `${year}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      end_date: `${endYear}-${endMonth.toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}`,
      status: status,
      sector: sector,
      region: region,
      organization: organization,
      contact_email: `contato@${organization.toLowerCase().replace(/\s+/g, '')}.pt`.replace(/ç/g, 'c').replace(/ã/g, 'a')
    });
  }
}

// 3. Metrics - diverse data across years, regions, and sectors
const mockMetrics = [];
const metricCategories = ['investment', 'innovation', 'productivity', 'education', 'research', 'digital transformation'];
const metricNames = [
  'Investimento em I&D', 'Patentes Registadas', 'Publicações Científicas', 
  'Startups Criadas', 'Índice de Inovação', 'Taxa de Digitalização',
  'Exportação de Tecnologia', 'Emprego em Alta Tecnologia', 'Investimento em Formação',
  'Adoção de IA', 'Transformação Digital', 'Inovação em Processos'
];
const metricUnits = ['EUR', 'quantidade', 'percentagem', 'índice', 'milhões EUR'];

for (let year of years) {
  // Create 10-20 metrics per year
  const numMetrics = Math.floor(Math.random() * 10) + 10;
  
  for (let i = 0; i < numMetrics; i++) {
    const category = metricCategories[Math.floor(Math.random() * metricCategories.length)];
    const name = metricNames[Math.floor(Math.random() * metricNames.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const unit = metricUnits[Math.floor(Math.random() * metricUnits.length)];
    
    // Create a value based on the type of metric
    let value;
    if (unit === 'EUR' || unit === 'milhões EUR') {
      // For monetary values, between 100k and 500M
      value = Math.floor(Math.random() * 500000000) + 100000;
    } else if (unit === 'percentagem') {
      // For percentages, between 1 and 100
      value = Math.floor(Math.random() * 99) + 1;
    } else if (unit === 'quantidade') {
      // For counts, between 1 and 1000
      value = Math.floor(Math.random() * 1000) + 1;
    } else if (unit === 'índice') {
      // For indices, between 0 and 10, with decimals
      value = Math.random() * 10;
    } else {
      value = Math.floor(Math.random() * 1000) + 1;
    }
    
    // Measurement date within the year
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    
    mockMetrics.push({
      id: `metric-${year}-${i + 1}`,
      name: name,
      category: category,
      value: value,
      unit: unit,
      measurement_date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      region: region,
      sector: sector,
      source: `Relatório Anual ${year}`,
      description: `Medição de ${name} para ${sector} na região de ${region} no ano ${year}`
    });
  }
}

// 4. Patent Holders - diverse data across years and organizations
const mockPatentHolders = [];
const patentHolderOrgs = [
  'Universidade de Lisboa', 'Universidade do Porto', 'Instituto Superior Técnico',
  'INESC TEC', 'ITQB NOVA', 'Farmacêutica Nacional',
  'TechSolutions Portugal', 'BioMedica Research', 'EnerSolar',
  'SmartCities Lab', 'Instituto de Telecomunicações', 'Critical Software'
];

// Ensure increase in patents over years for trend analysis
for (let year of years) {
  // Create 8-15 patent holders per year
  const numHolders = Math.floor(Math.random() * 7) + 8;
  
  for (let i = 0; i < numHolders; i++) {
    const organization = patentHolderOrgs[Math.floor(Math.random() * patentHolderOrgs.length)];
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    
    // Create patent count - increasing by year
    // Base count between 5-50, plus year factor (more recent years have more patents)
    const yearFactor = (year - 2019) * 10; // 0 for 2019, 10 for 2020, etc.
    const patentCount = Math.floor(Math.random() * 45) + 5 + yearFactor;
    
    // Innovation index between 50 and 100
    const innovationIndex = Math.floor(Math.random() * 50) + 50;
    
    mockPatentHolders.push({
      id: `ph-${year}-${i + 1}`,
      organization_name: organization,
      sector: sector,
      country: 'Portugal',
      patent_count: patentCount,
      innovation_index: innovationIndex,
      year: year
    });
  }
}

// 5. International Collaborations - diverse data across years
const mockInternationalCollaborations = [];
const countries = ['Espanha', 'França', 'Alemanha', 'Reino Unido', 'Itália', 'Estados Unidos', 'Brasil', 'China', 'Japão', 'Suécia', 'Holanda'];
const partnershipTypes = ['Pesquisa', 'Desenvolvimento', 'Acadêmico', 'Industrial', 'Governamental'];
const focusAreas = [
  'Inteligência Artificial', 'Energia Renovável', 'Biotecnologia', 
  'Saúde Digital', 'Materiais Avançados', 'Cidades Inteligentes',
  'Computação Quântica', 'Mobilidade Sustentável', 'Agricultura de Precisão'
];

for (let year of years) {
  // Create 5-15 collaborations per year
  const numCollaborations = Math.floor(Math.random() * 10) + 5;
  
  for (let i = 0; i < numCollaborations; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const partnershipType = partnershipTypes[Math.floor(Math.random() * partnershipTypes.length)];
    
    // Create 1-3 focus areas
    const numFocusAreas = Math.floor(Math.random() * 3) + 1;
    const collaboration_focusAreas = [];
    for (let j = 0; j < numFocusAreas; j++) {
      const area = focusAreas[Math.floor(Math.random() * focusAreas.length)];
      if (!collaboration_focusAreas.includes(area)) {
        collaboration_focusAreas.push(area);
      }
    }
    
    // Budget between 100k and 5M
    const budget = Math.floor(Math.random() * 4900000) + 100000;
    // Portuguese contribution 20-60% of total budget
    const portugueseContribution = Math.floor(budget * (Math.random() * 0.4 + 0.2));
    
    // Create end date 1-5 years after the start
    const endYear = year + Math.floor(Math.random() * 5) + 1;
    
    mockInternationalCollaborations.push({
      id: `ic-${year}-${i + 1}`,
      program_name: `Colaboração ${country}-Portugal: ${collaboration_focusAreas[0]}`,
      country: country,
      partnership_type: partnershipType,
      start_date: `${year}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      end_date: `${endYear}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      total_budget: budget,
      portuguese_contribution: portugueseContribution,
      focus_areas: collaboration_focusAreas
    });
  }
}

// 6. Policy Frameworks - diverse data
const mockPolicyFrameworks = [];
const policyScopes = ['Nacional', 'Regional', 'Europeu', 'Setorial'];
const keyObjectives = [
  'Aumentar investimento em I&D', 'Promover transferência de tecnologia',
  'Apoiar ecossistema de startups', 'Melhorar infraestrutura de inovação',
  'Desenvolver capital humano', 'Fomentar colaboração internacional',
  'Acelerar transformação digital', 'Promover inovação verde',
  'Desenvolver economia circular', 'Reforçar propriedade intelectual'
];

for (let year of years) {
  // Create 2-5 policy frameworks per year
  const numPolicies = Math.floor(Math.random() * 3) + 2;
  
  for (let i = 0; i < numPolicies; i++) {
    const scope = policyScopes[Math.floor(Math.random() * policyScopes.length)];
    
    // Create 3-5 objectives
    const numObjectives = Math.floor(Math.random() * 3) + 3;
    const policyObjectives = [];
    for (let j = 0; j < numObjectives; j++) {
      const objective = keyObjectives[Math.floor(Math.random() * keyObjectives.length)];
      if (!policyObjectives.includes(objective)) {
        policyObjectives.push(objective);
      }
    }
    
    mockPolicyFrameworks.push({
      id: `pf-${year}-${i + 1}`,
      title: `Política de Inovação ${year} - ${scope}`,
      description: `Quadro político para fomento da inovação e desenvolvimento tecnológico a nível ${scope.toLowerCase()}`,
      implementation_date: `${year}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      status: year < 2024 ? 'ativo' : Math.random() > 0.5 ? 'ativo' : 'em desenvolvimento',
      scope: scope,
      key_objectives: policyObjectives,
      related_legislation: `Resolução nº ${Math.floor(Math.random() * 100) + 1}/${year} do Conselho de Ministros`
    });
  }
}

// 7. Researchers - diverse data
const mockResearchers = [];
const specializations = [
  'Inteligência Artificial', 'Energia Renovável', 'Biotecnologia',
  'Nanotecnologia', 'Neurociência', 'Ciência de Materiais',
  'Robótica', 'Genética', 'Computação Quântica', 'Bioinformática'
];

for (let i = 0; i < 30; i++) {
  const firstName = ['Maria', 'João', 'Ana', 'Pedro', 'Sofia', 'Miguel', 'Carolina', 'Luís', 'Inês', 'Tiago'][Math.floor(Math.random() * 10)];
  const lastName = ['Silva', 'Santos', 'Ferreira', 'Costa', 'Oliveira', 'Rodrigues', 'Martins', 'Sousa', 'Almeida', 'Pereira'][Math.floor(Math.random() * 10)];
  const name = `Dr. ${firstName} ${lastName}`;
  const specialization = specializations[Math.floor(Math.random() * specializations.length)];
  
  // h-index between 10 and 50
  const hIndex = Math.floor(Math.random() * 40) + 10;
  // Publication count between 20 and 200
  const publicationCount = Math.floor(Math.random() * 180) + 20;
  // Patent count between 0 and 15
  const patentCount = Math.floor(Math.random() * 16);
  
  mockResearchers.push({
    id: `researcher-${i + 1}`,
    name: name,
    specialization: specialization,
    h_index: hIndex,
    publication_count: publicationCount,
    patent_count: patentCount,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@research.pt`
  });
}

// 8. Institutions - diverse data
const mockInstitutions = [];
const institutionTypes = ['Universidade', 'Instituto de Investigação', 'Centro Tecnológico', 'Laboratório Associado', 'Parque de Ciência'];

for (let i = 0; i < 15; i++) {
  const institutionType = institutionTypes[Math.floor(Math.random() * institutionTypes.length)];
  const region = regions[Math.floor(Math.random() * regions.length)];
  
  // Founding year between 1970 and 2015
  const foundingYear = Math.floor(Math.random() * 45) + 1970;
  const foundingMonth = Math.floor(Math.random() * 12) + 1;
  const foundingDay = Math.floor(Math.random() * 28) + 1;
  
  // Collaboration count between 10 and 50
  const collaborationCount = Math.floor(Math.random() * 40) + 10;
  
  // Create 2-5 specialization areas
  const numSpecializations = Math.floor(Math.random() * 4) + 2;
  const institutionSpecializations = [];
  for (let j = 0; j < numSpecializations; j++) {
    const area = specializations[Math.floor(Math.random() * specializations.length)];
    if (!institutionSpecializations.includes(area)) {
      institutionSpecializations.push(area);
    }
  }
  
  // Create 3-6 project history items
  const numProjects = Math.floor(Math.random() * 4) + 3;
  const projectHistory = [];
  for (let j = 0; j < numProjects; j++) {
    projectHistory.push(`Projeto ${j + 1}: ${specializations[Math.floor(Math.random() * specializations.length)]}`);
  }
  
  mockInstitutions.push({
    id: `inst-${i + 1}`,
    institution_name: `${institutionType} de ${region} ${i + 1}`,
    type: institutionType,
    region: region,
    founding_date: `${foundingYear}-${foundingMonth.toString().padStart(2, '0')}-${foundingDay.toString().padStart(2, '0')}`,
    collaboration_count: collaborationCount,
    specialization_areas: institutionSpecializations,
    project_history: projectHistory
  });
}

// Combine all mock data into a comprehensive database mock
const mockDatabase = {
  ani_funding_programs: mockFundingPrograms,
  ani_projects: mockProjects,
  ani_metrics: mockMetrics,
  ani_patent_holders: mockPatentHolders,
  ani_international_collaborations: mockInternationalCollaborations,
  ani_policy_frameworks: mockPolicyFrameworks,
  ani_researchers: mockResearchers,
  ani_institutions: mockInstitutions
};

// Mock function to simulate querying the database
export async function generateResponse(query: string) {
  console.log("Generating response for query:", query);
  const queryLower = query.toLowerCase();
  
  // Check if this matches any predefined queries
  for (const predefined of predefinedQueries) {
    if (queryLower.includes(predefined.query.toLowerCase())) {
      console.log("Found matching predefined query:", predefined.query);
      return predefined.response;
    }
  }
  
  // Otherwise, generate a response based on query analysis
  let response = {
    message: "",
    sqlQuery: "",
    results: null,
    noResults: false,
    queryId: genId(),
    analysis: null
  };
  
  // Analyze the query to determine what data to return
  
  // Check for patent related queries
  if (queryLower.includes("patent") || queryLower.includes("patente") || queryLower.includes("propriedade intelectual") || queryLower.includes("invenção")) {
    const patentData = handlePatentQuery(queryLower);
    response.message = patentData.message;
    response.sqlQuery = patentData.sqlQuery;
    response.results = patentData.results;
  }
  // Check for funding program related queries
  else if (queryLower.includes("financiamento") || queryLower.includes("programa") || queryLower.includes("funding") || queryLower.includes("orçamento") || queryLower.includes("subsídio")) {
    const fundingData = handleFundingQuery(queryLower);
    response.message = fundingData.message;
    response.sqlQuery = fundingData.sqlQuery;
    response.results = fundingData.results;
  }
  // Check for project related queries
  else if (queryLower.includes("projeto") || queryLower.includes("project") || queryLower.includes("iniciativa") || queryLower.includes("investigação")) {
    const projectData = handleProjectQuery(queryLower);
    response.message = projectData.message;
    response.sqlQuery = projectData.sqlQuery;
    response.results = projectData.results;
  }
  // Check for metrics related queries
  else if (queryLower.includes("metric") || queryLower.includes("métrica") || queryLower.includes("indicador") || queryLower.includes("medida") || queryLower.includes("estatística")) {
    const metricsData = handleMetricsQuery(queryLower);
    response.message = metricsData.message;
    response.sqlQuery = metricsData.sqlQuery;
    response.results = metricsData.results;
  }
  // Check for international collaboration related queries
  else if (queryLower.includes("colaboração") || queryLower.includes("parceria") || queryLower.includes("internacional") || queryLower.includes("parceiro") || queryLower.includes("país")) {
    const collaborationData = handleCollaborationQuery(queryLower);
    response.message = collaborationData.message;
    response.sqlQuery = collaborationData.sqlQuery;
    response.results = collaborationData.results;
  }
  // Check for policy framework related queries
  else if (queryLower.includes("política") || queryLower.includes("framework") || queryLower.includes("iniciativa") || queryLower.includes("estratégia") || queryLower.includes("objetivo")) {
    const policyData = handlePolicyQuery(queryLower);
    response.message = policyData.message;
    response.sqlQuery = policyData.sqlQuery;
    response.results = policyData.results;
  }
  // Check for researcher related queries
  else if (queryLower.includes("pesquisador") || queryLower.includes("investigador") || queryLower.includes("cientista") || queryLower.includes("académico") || queryLower.includes("professor")) {
    const researcherData = handleResearcherQuery(queryLower);
    response.message = researcherData.message;
    response.sqlQuery = researcherData.sqlQuery;
    response.results = researcherData.results;
  }
  // Check for institution related queries
  else if (queryLower.includes("instituição") || queryLower.includes("universidade") || queryLower.includes("instituto") || queryLower.includes("centro") || queryLower.includes("laboratório")) {
    const institutionData = handleInstitutionQuery(queryLower);
    response.message = institutionData.message;
    response.sqlQuery = institutionData.sqlQuery;
    response.results = institutionData.results;
  }
  // Check for general innovation/R&D queries that don't fit above categories
  else if (queryLower.includes("inovação") || queryLower.includes("i&d") || queryLower.includes("r&d") || queryLower.includes("pesquisa") || queryLower.includes("desenvolvimento")) {
    const rdData = handleRDQuery(queryLower);
    response.message = rdData.message;
    response.sqlQuery = rdData.sqlQuery;
    response.results = rdData.results;
  }
  else {
    // General query - provide a mix of data as sample
    response.message = "Aqui está uma amostra de dados sobre inovação e financiamento em Portugal. Para consultas mais específicas, por favor pergunte sobre programas de financiamento, projetos, métricas, patentes, colaborações ou políticas.";
    response.sqlQuery = "SELECT * FROM ani_funding_programs LIMIT 5; SELECT * FROM ani_projects LIMIT 5; SELECT * FROM ani_metrics LIMIT 5";
    response.results = mockFundingPrograms.slice(0, 5);
  }
  
  // Check if we have results
  if (!response.results || response.results.length === 0) {
    response.noResults = true;
    
    // If no results, provide a more helpful message
    if (response.message.indexOf("Não foram encontrados") === -1) {
      response.message = "Não foram encontrados resultados para a sua consulta. Por favor, tente refinar sua pesquisa ou verificar se há dados disponíveis no sistema.";
    }
  }
  
  return response;
}

// Handler functions for different types of queries
function handlePatentQuery(query: string) {
  // Extract year if present
  const yearMatch = query.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1]) : null;
  
  // Default SQL query
  let sqlQuery = "SELECT * FROM ani_patent_holders";
  
  // Filter by year if specified
  if (year) {
    sqlQuery += ` WHERE year = ${year}`;
    
    // Get data for the specified year
    const results = mockDatabase.ani_patent_holders.filter(patent => patent.year === year);
    
    // If we have results, return them
    if (results.length > 0) {
      // Calculate total patents for the year
      const totalPatents = results.reduce((sum, patent) => sum + patent.patent_count, 0);
      
      // Find top organization
      let topOrg = results[0];
      for (const org of results) {
        if (org.patent_count > topOrg.patent_count) {
          topOrg = org;
        }
      }
      
      return {
        message: `Em ${year}, foram registadas um total de ${totalPatents} patentes em Portugal. A organização com maior número de patentes foi ${topOrg.organization_name} com ${topOrg.patent_count} patentes registadas, principalmente no setor de ${topOrg.sector}.`,
        sqlQuery: sqlQuery,
        results: results
      };
    }
  }
  
  // Check for sector-specific queries
  const sectors = ['tecnologia', 'saúde', 'energia', 'biotecnologia', 'agricultura', 'manufatura', 'educação', 'transportes'];
  let sectorMatch = null;
  
  for (const sector of sectors) {
    if (query.includes(sector)) {
      sectorMatch = sector;
      break;
    }
  }
  
  if (sectorMatch) {
    sqlQuery += ` WHERE sector ILIKE '%${sectorMatch}%'`;
    
    // Get data for the specified sector
    const results = mockDatabase.ani_patent_holders.filter(patent => 
      patent.sector.toLowerCase().includes(sectorMatch as string)
    );
    
    if (results.length > 0) {
      // Calculate total patents for the sector
      const totalPatents = results.reduce((sum, patent) => sum + patent.patent_count, 0);
      
      return {
        message: `No setor de ${sectorMatch}, foram registadas um total de ${totalPatents} patentes nos últimos anos. Este setor representa uma parte significativa da inovação em Portugal.`,
        sqlQuery: sqlQuery,
        results: results
      };
    }
  }
  
  // Default response with all patent data
  return {
    message: "Aqui estão os dados sobre patentes registadas em Portugal. Os dados mostram uma tendência de crescimento nos últimos anos, especialmente nos setores de tecnologia e biotecnologia.",
    sqlQuery: "SELECT * FROM ani_patent_holders ORDER BY year DESC, patent_count DESC",
    results: mockDatabase.ani_patent_holders.sort((a, b) => b.year - a.year || b.patent_count - a.patent_count).slice(0, 15)
  };
}

function handleFundingQuery(query: string) {
  // Extract year if present
  const yearMatch = query.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1]) : null;
  
  // Default SQL query
  let sqlQuery = "SELECT * FROM ani_funding_programs";
  
  // Check for budget/amount queries
  const budgetMatch = query.includes("orçamento") || query.includes("budget") || query.includes("valor") || query.includes("montante");
  
  // Check for sector-specific queries
  const sectors = ['tecnologia', 'saúde', 'energia', 'biotecnologia', 'agricultura', 'manufatura', 'educação', 'transportes'];
  let sectorMatch = null;
  
  for (const sector of sectors) {
    if (query.includes(sector)) {
      sectorMatch = sector;
      break;
    }
  }
  
  // Build query conditions
  let conditions = [];
  let message = "Aqui estão os programas de financiamento";
  
  if (year) {
    conditions.push(`EXTRACT(YEAR FROM start_date) <= ${year} AND EXTRACT(YEAR FROM end_date) >= ${year}`);
    message += ` ativos em ${year}`;
  }
  
  if (sectorMatch) {
    conditions.push(`sector_focus @> ARRAY['${sectorMatch}']`);
    message += ` na área de ${sectorMatch}`;
  }
  
  if (conditions.length > 0) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
  }
  
  if (budgetMatch) {
    sqlQuery += " ORDER BY total_budget DESC";
    message += ", ordenados por valor de orçamento";
  }
  
  // Filter mock data according to conditions
  let results = mockDatabase.ani_funding_programs;
  
  if (year) {
    results = results.filter(program => {
      const startYear = parseInt(program.start_date.split('-')[0]);
      const endYear = parseInt(program.end_date.split('-')[0]);
      return startYear <= year && endYear >= year;
    });
  }
  
  if (sectorMatch) {
    results = results.filter(program => 
      program.sector_focus.some(sector => 
        sector.toLowerCase().includes(sectorMatch as string)
      )
    );
  }
  
  if (budgetMatch) {
    results = results.sort((a, b) => b.total_budget - a.total_budget);
  }
  
  // Limit results
  results = results.slice(0, 15);
  
  if (results.length > 0) {
    // Calculate total budget
    const totalBudget = results.reduce((sum, program) => sum + program.total_budget, 0);
    const formattedTotalBudget = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(totalBudget);
    
    message += `. O orçamento total destes programas é de ${formattedTotalBudget}.`;
    
    return {
      message: message,
      sqlQuery: sqlQuery,
      results: results
    };
  }
  
  return {
    message: "Não foram encontrados programas de financiamento que correspondam aos critérios especificados.",
    sqlQuery: sqlQuery,
    results: []
  };
}

function handleProjectQuery(query: string) {
  // Extract year if present
  const yearMatch = query.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1]) : null;
  
  // Default SQL query
  let sqlQuery = "SELECT * FROM ani_projects";
  
  // Check for status queries
  const statusTypes = ['ativo', 'concluído', 'em análise', 'aprovado', 'rejeitado', 'em execução'];
  let statusMatch = null;
  
  for (const status of statusTypes) {
    if (query.includes(status)) {
      statusMatch = status;
      break;
    }
  }
  
  // Check for sector-specific queries
  const sectors = ['tecnologia', 'saúde', 'energia', 'biotecnologia', 'agricultura', 'manufatura', 'educação', 'transportes'];
  let sectorMatch = null;
  
  for (const sector of sectors) {
    if (query.includes(sector)) {
      sectorMatch = sector;
      break;
    }
  }
  
  // Check for region-specific queries
  const regions = ['lisboa', 'porto', 'norte', 'centro', 'alentejo', 'algarve', 'madeira', 'açores'];
  let regionMatch = null;
  
  for (const region of regions) {
    if (query.includes(region)) {
      regionMatch = region;
      break;
    }
  }
  
  // Build query conditions
  let conditions = [];
  let message = "Aqui estão os projetos";
  
  if (year) {
    conditions.push(`EXTRACT(YEAR FROM start_date) <= ${year} AND EXTRACT(YEAR FROM end_date) >= ${year}`);
    message += ` ativos em ${year}`;
  }
  
  if (statusMatch) {
    conditions.push(`status = '${statusMatch}'`);
    message += ` com status '${statusMatch}'`;
  }
  
  if (sectorMatch) {
    conditions.push(`sector ILIKE '%${sectorMatch}%'`);
    message += ` no setor de ${sectorMatch}`;
  }
  
  if (regionMatch) {
    conditions.push(`region ILIKE '%${regionMatch}%'`);
    message += ` na região de ${regionMatch}`;
  }
  
  if (conditions.length > 0) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
  }
  
  sqlQuery += " ORDER BY funding_amount DESC";
  
  // Filter mock data according to conditions
  let results = mockDatabase.ani_projects;
  
  if (year) {
    results = results.filter(project => {
      const startYear = parseInt(project.start_date.split('-')[0]);
      const endYear = parseInt(project.end_date.split('-')[0]);
      return startYear <= year && endYear >= year;
    });
  }
  
  if (statusMatch) {
    results = results.filter(project => 
      project.status.toLowerCase() === statusMatch
    );
  }
  
  if (sectorMatch) {
    results = results.filter(project => 
      project.sector.toLowerCase().includes(sectorMatch as string)
    );
  }
  
  if (regionMatch) {
    results = results.filter(project => 
      project.region.toLowerCase().includes(regionMatch as string)
    );
  }
  
  // Sort by funding amount
  results = results.sort((a, b) => b.funding_amount - a.funding_amount);
  
  // Limit results
  results = results.slice(0, 15);
  
  if (results.length > 0) {
    // Calculate total funding
    const totalFunding = results.reduce((sum, project) => sum + project.funding_amount, 0);
    const formattedTotalFunding = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(totalFunding);
    
    message += `. O financiamento total destes projetos é de ${formattedTotalFunding}.`;
    
    return {
      message: message,
      sqlQuery: sqlQuery,
      results: results
    };
  }
  
  return {
    message: "Não foram encontrados projetos que correspondam aos critérios especificados.",
    sqlQuery: sqlQuery,
    results: []
  };
}

function handleMetricsQuery(query: string) {
  // Extract year if present
  const yearMatch = query.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1]) : null;
  
  // Default SQL query
  let sqlQuery = "SELECT * FROM ani_metrics";
  
  // Check for category-specific queries
  const categories = ['investment', 'innovation', 'productivity', 'education', 'research', 'digital transformation'];
  let categoryMatch = null;
  
  for (const category of categories) {
    if (query.includes(category) || query.includes(category.replace(' ', ''))) {
      categoryMatch = category;
      break;
    }
  }
  
  // Check for metric name matches
  const metricNames = [
    'investimento em i&d', 'patentes registadas', 'publicações científicas', 
    'startups criadas', 'índice de inovação', 'taxa de digitalização',
    'exportação de tecnologia', 'emprego em alta tecnologia', 'investimento em formação',
    'adoção de ia', 'transformação digital', 'inovação em processos'
  ];
  let nameMatch = null;
  
  for (const name of metricNames) {
    if (query.includes(name)) {
      nameMatch = name;
      break;
    }
  }
  
  // Check for region-specific queries
  const regions = ['lisboa', 'porto', 'norte', 'centro', 'alentejo', 'algarve', 'madeira', 'açores'];
  let regionMatch = null;
  
  for (const region of regions) {
    if (query.includes(region)) {
      regionMatch = region;
      break;
    }
  }
  
  // Build query conditions
  let conditions = [];
  let message = "Aqui estão as métricas";
  
  if (year) {
    conditions.push(`EXTRACT(YEAR FROM measurement_date) = ${year}`);
    message += ` para o ano ${year}`;
  }
  
  if (categoryMatch) {
    conditions.push(`category = '${categoryMatch}'`);
    message += ` na categoria ${categoryMatch}`;
  }
  
  if (nameMatch) {
    conditions.push(`name ILIKE '%${nameMatch}%'`);
    message += ` sobre ${nameMatch}`;
  }
  
  if (regionMatch) {
    conditions.push(`region ILIKE '%${regionMatch}%'`);
    message += ` para a região de ${regionMatch}`;
  }
  
  if (conditions.length > 0) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
  }
  
  // Filter mock data according to conditions
  let results = mockDatabase.ani_metrics;
  
  if (year) {
    results = results.filter(metric => {
      const metricYear = parseInt(metric.measurement_date.split('-')[0]);
      return metricYear === year;
    });
  }
  
  if (categoryMatch) {
    results = results.filter(metric => 
      metric.category.toLowerCase() === categoryMatch
    );
  }
  
  if (nameMatch) {
    results = results.filter(metric => 
      metric.name.toLowerCase().includes(nameMatch as string)
    );
  }
  
  if (regionMatch) {
    results = results.filter(metric => 
      metric.region.toLowerCase().includes(regionMatch as string)
    );
  }
  
  // Limit results
  results = results.slice(0, 15);
  
  if (results.length > 0) {
    return {
      message: message,
      sqlQuery: sqlQuery,
      results: results
    };
  }
  
  return {
    message: "Não foram encontradas métricas que correspondam aos critérios especificados.",
    sqlQuery: sqlQuery,
    results: []
  };
}

function handleCollaborationQuery(query: string) {
  // Extract year if present
  const yearMatch = query.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1]) : null;
  
  // Default SQL query
  let sqlQuery = "SELECT * FROM ani_international_collaborations";
  
  // Check for country-specific queries
  const countries = ['espanha', 'frança', 'alemanha', 'reino unido', 'itália', 'estados unidos', 'brasil', 'china', 'japão', 'suécia', 'holanda'];
  let countryMatch = null;
  
  for (const country of countries) {
    if (query.includes(country)) {
      countryMatch = country;
      break;
    }
  }
  
  // Check for focus area matches
  const focusAreas = [
    'inteligência artificial', 'energia renovável', 'biotecnologia', 
    'saúde digital', 'materiais avançados', 'cidades inteligentes',
    'computação quântica', 'mobilidade sustentável', 'agricultura de precisão'
  ];
  let areaMatch = null;
  
  for (const area of focusAreas) {
    if (query.includes(area)) {
      areaMatch = area;
      break;
    }
  }
  
  // Build query conditions
  let conditions = [];
  let message = "Aqui estão as colaborações internacionais";
  
  if (year) {
    conditions.push(`EXTRACT(YEAR FROM start_date) <= ${year} AND EXTRACT(YEAR FROM end_date) >= ${year}`);
    message += ` ativas em ${year}`;
  }
  
  if (countryMatch) {
    conditions.push(`country ILIKE '%${countryMatch}%'`);
    message += ` com ${countryMatch}`;
  }
  
  if (areaMatch) {
    conditions.push(`focus_areas @> ARRAY['${areaMatch}']`);
    message += ` na área de ${areaMatch}`;
  }
  
  if (conditions.length > 0) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
  }
  
  // Filter mock data according to conditions
  let results = mockDatabase.ani_international_collaborations;
  
  if (year) {
    results = results.filter(collab => {
      const startYear = parseInt(collab.start_date.split('-')[0]);
      const endYear = parseInt(collab.end_date.split('-')[0]);
      return startYear <= year && endYear >= year;
    });
  }
  
  if (countryMatch) {
    results = results.filter(collab => 
      collab.country.toLowerCase().includes(countryMatch as string)
    );
  }
  
  if (areaMatch) {
    results = results.filter(collab => 
      collab.focus_areas.some(area => 
        area.toLowerCase().includes(areaMatch as string)
      )
    );
  }
  
  // Limit results
  results = results.slice(0, 15);
  
  if (results.length > 0) {
    // Calculate total budget
    const totalBudget = results.reduce((sum, collab) => sum + collab.total_budget, 0);
    const formattedTotalBudget = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(totalBudget);
    
    // Calculate Portuguese contribution
    const totalContribution = results.reduce((sum, collab) => sum + collab.portuguese_contribution, 0);
    const formattedTotalContribution = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(totalContribution);
    
    message += `. O orçamento total destas colaborações é de ${formattedTotalBudget}, com uma contribuição portuguesa de ${formattedTotalContribution}.`;
    
    return {
      message: message,
      sqlQuery: sqlQuery,
      results: results
    };
  }
  
  return {
    message: "Não foram encontradas colaborações internacionais que correspondam aos critérios especificados.",
    sqlQuery: sqlQuery,
    results: []
  };
}

function handlePolicyQuery(query: string) {
  // Extract year if present
  const yearMatch = query.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1]) : null;
  
  // Default SQL query
  let sqlQuery = "SELECT * FROM ani_policy_frameworks";
  
  // Check for status queries
  const statuses = ['ativo', 'em desenvolvimento'];
  let statusMatch = null;
  
  for (const status of statuses) {
    if (query.includes(status)) {
      statusMatch = status;
      break;
    }
  }
  
  // Check for scope queries
  const scopes = ['nacional', 'regional', 'europeu', 'setorial'];
  let scopeMatch = null;
  
  for (const scope of scopes) {
    if (query.includes(scope)) {
      scopeMatch = scope;
      break;
    }
  }
  
  // Check for objective queries
  const objectives = [
    'aumentar investimento em i&d', 'promover transferência de tecnologia',
    'apoiar ecossistema de startups', 'melhorar infraestrutura de inovação',
    'desenvolver capital humano', 'fomentar colaboração internacional',
    'acelerar transformação digital', 'promover inovação verde',
    'desenvolver economia circular', 'reforçar propriedade intelectual'
  ];
  let objectiveMatch = null;
  
  for (const objective of objectives) {
    if (query.includes(objective)) {
      objectiveMatch = objective;
      break;
    }
  }
  
  // Build query conditions
  let conditions = [];
  let message = "Aqui estão as políticas de inovação";
  
  if (year) {
    conditions.push(`EXTRACT(YEAR FROM implementation_date) = ${year}`);
    message += ` implementadas em ${year}`;
  }
  
  if (statusMatch) {
    conditions.push(`status = '${statusMatch}'`);
    message += ` com status '${statusMatch}'`;
  }
  
  if (scopeMatch) {
    conditions.push(`scope ILIKE '%${scopeMatch}%'`);
    message += ` de âmbito ${scopeMatch}`;
  }
  
  if (objectiveMatch) {
    conditions.push(`key_objectives @> ARRAY['${objectiveMatch}']`);
    message += ` com objetivo de ${objectiveMatch}`;
  }
  
  if (conditions.length > 0) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
  }
  
  // Filter mock data according to conditions
  let results = mockDatabase.ani_policy_frameworks;
  
  if (year) {
    results = results.filter(policy => {
      const policyYear = parseInt(policy.implementation_date.split('-')[0]);
      return policyYear === year;
    });
  }
  
  if (statusMatch) {
    results = results.filter(policy => 
      policy.status.toLowerCase() === statusMatch
    );
  }
  
  if (scopeMatch) {
    results = results.filter(policy => 
      policy.scope.toLowerCase().includes(scopeMatch as string)
    );
  }
  
  if (objectiveMatch) {
    results = results.filter(policy => 
      policy.key_objectives.some(objective => 
        objective.toLowerCase().includes(objectiveMatch as string)
      )
    );
  }
  
  // Limit results
  results = results.slice(0, 15);
  
  if (results.length > 0) {
    return {
      message: message,
      sqlQuery: sqlQuery,
      results: results
    };
  }
  
  return {
    message: "Não foram encontradas políticas de inovação que correspondam aos critérios especificados.",
    sqlQuery: sqlQuery,
    results: []
  };
}

function handleResearcherQuery(query: string) {
  // Default SQL query
  let sqlQuery = "SELECT * FROM ani_researchers";
  
  // Check for specialization queries
  const specializations = [
    'inteligência artificial', 'energia renovável', 'biotecnologia',
    'nanotecnologia', 'neurociência', 'ciência de materiais',
    'robótica', 'genética', 'computação quântica', 'bioinformática'
  ];
  let specializationMatch = null;
  
  for (const specialization of specializations) {
    if (query.includes(specialization)) {
      specializationMatch = specialization;
      break;
    }
  }
  
  // Check for h-index or publication mentions
  const hIndexMatch = query.includes('h-index') || query.includes('índice h');
  const publicationMatch = query.includes('publicação') || query.includes('publicações') || query.includes('artigo');
  const patentMatch = query.includes('patente') || query.includes('patentes');
  
  // Build query conditions
  let conditions = [];
  let message = "Aqui estão os pesquisadores";
  let orderBy = "";
  
  if (specializationMatch) {
    conditions.push(`specialization ILIKE '%${specializationMatch}%'`);
    message += ` na área de ${specializationMatch}`;
  }
  
  if (hIndexMatch) {
    orderBy = " ORDER BY h_index DESC";
    message += " ordenados por índice h";
  } else if (publicationMatch) {
    orderBy = " ORDER BY publication_count DESC";
    message += " ordenados por número de publicações";
  } else if (patentMatch) {
    orderBy = " ORDER BY patent_count DESC";
    message += " ordenados por número de patentes";
  }
  
  if (conditions.length > 0) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
  }
  
  sqlQuery += orderBy ? orderBy : " ORDER BY h_index DESC";
  
  // Filter mock data according to conditions
  let results = mockDatabase.ani_researchers;
  
  if (specializationMatch) {
    results = results.filter(researcher => 
      researcher.specialization.toLowerCase().includes(specializationMatch as string)
    );
  }
  
  // Sort results based on criteria
  if (hIndexMatch) {
    results = results.sort((a, b) => b.h_index - a.h_index);
  } else if (publicationMatch) {
    results = results.sort((a, b) => b.publication_count - a.publication_count);
  } else if (patentMatch) {
    results = results.sort((a, b) => b.patent_count - a.patent_count);
  } else {
    results = results.sort((a, b) => b.h_index - a.h_index);
  }
  
  // Limit results
  results = results.slice(0, 15);
  
  if (results.length > 0) {
    return {
      message: message,
      sqlQuery: sqlQuery,
      results: results
    };
  }
  
  return {
    message: "Não foram encontrados pesquisadores que correspondam aos critérios especificados.",
    sqlQuery: sqlQuery,
    results: []
  };
}

function handleInstitutionQuery(query: string) {
  // Default SQL query
  let sqlQuery = "SELECT * FROM ani_institutions";
  
  // Check for type queries
  const types = ['universidade', 'instituto de investigação', 'centro tecnológico', 'laboratório associado', 'parque de ciência'];
  let typeMatch = null;
  
  for (const type of types) {
    if (query.includes(type)) {
      typeMatch = type;
      break;
    }
  }
  
  // Check for region queries
  const regions = ['lisboa', 'porto', 'norte', 'centro', 'alentejo', 'algarve', 'madeira', 'açores'];
  let regionMatch = null;
  
  for (const region of regions) {
    if (query.includes(region)) {
      regionMatch = region;
      break;
    }
  }
  
  // Check for specialization area queries
  const specializations = [
    'inteligência artificial', 'energia renovável', 'biotecnologia',
    'nanotecnologia', 'neurociência', 'ciência de materiais',
    'robótica', 'genética', 'computação quântica', 'bioinformática'
  ];
  let specializationMatch = null;
  
  for (const specialization of specializations) {
    if (query.includes(specialization)) {
      specializationMatch = specialization;
      break;
    }
  }
  
  // Build query conditions
  let conditions = [];
  let message = "Aqui estão as instituições";
  
  if (typeMatch) {
    conditions.push(`type ILIKE '%${typeMatch}%'`);
    message += ` do tipo ${typeMatch}`;
  }
  
  if (regionMatch) {
    conditions.push(`region ILIKE '%${regionMatch}%'`);
    message += ` na região de ${regionMatch}`;
  }
  
  if (specializationMatch) {
    conditions.push(`specialization_areas @> ARRAY['${specializationMatch}']`);
    message += ` especializadas em ${specializationMatch}`;
  }
  
  if (conditions.length > 0) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
  }
  
  sqlQuery += " ORDER BY collaboration_count DESC";
  
  // Filter mock data according to conditions
  let results = mockDatabase.ani_institutions;
  
  if (typeMatch) {
    results = results.filter(institution => 
      institution.type.toLowerCase().includes(typeMatch as string)
    );
  }
  
  if (regionMatch) {
    results = results.filter(institution => 
      institution.region.toLowerCase().includes(regionMatch as string)
    );
  }
  
  if (specializationMatch) {
    results = results.filter(institution => 
      institution.specialization_areas.some(area => 
        area.toLowerCase().includes(specializationMatch as string)
      )
    );
  }
  
  // Sort by collaboration count
  results = results.sort((a, b) => b.collaboration_count - a.collaboration_count);
  
  // Limit results
  results = results.slice(0, 15);
  
  if (results.length > 0) {
    return {
      message: message,
      sqlQuery: sqlQuery,
      results: results
    };
  }
  
  return {
    message: "Não foram encontradas instituições que correspondam aos critérios especificados.",
    sqlQuery: sqlQuery,
    results: []
  };
}

function handleRDQuery(query: string) {
  // Extract year if present
  const yearMatch = query.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1]) : null;
  
  // Build query based on R&D / Innovation terms
  if (query.includes("investimento") || query.includes("financiamento")) {
    // Handle investment/funding queries
    let message = "Aqui estão os dados de investimento em I&D";
    let sqlQuery = "SELECT * FROM ani_metrics WHERE category = 'investment' AND name LIKE '%I&D%'";
    
    if (year) {
      sqlQuery += ` AND EXTRACT(YEAR FROM measurement_date) = ${year}`;
      message += ` para o ano ${year}`;
    }
    
    // Filter mock data
    let results = mockDatabase.ani_metrics.filter(metric => 
      metric.category === 'investment' && 
      metric.name.toLowerCase().includes('i&d')
    );
    
    if (year) {
      results = results.filter(metric => {
        const metricYear = parseInt(metric.measurement_date.split('-')[0]);
        return metricYear === year;
      });
    }
    
    if (results.length > 0) {
      // Calculate total investment
      const totalInvestment = results.reduce((sum, metric) => sum + parseFloat(metric.value as any), 0);
      const formattedTotalInvestment = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(totalInvestment);
      
      message += `. O investimento total em I&D ${year ? `em ${year}` : 'nos últimos anos'} foi de ${formattedTotalInvestment}.`;
      
      return {
        message: message,
        sqlQuery: sqlQuery,
        results: results
      };
    }
  } else if (query.includes("publicação") || query.includes("publicações") || query.includes("artigo") || query.includes("artigos")) {
    // Handle scientific publication queries
    let message = "Aqui estão os dados sobre publicações científicas";
    let sqlQuery = "SELECT * FROM ani_metrics WHERE name LIKE '%Publicações Científicas%'";
    
    if (year) {
      sqlQuery += ` AND EXTRACT(YEAR FROM measurement_date) = ${year}`;
      message += ` para o ano ${year}`;
    }
    
    // Filter mock data
    let results = mockDatabase.ani_metrics.filter(metric => 
      metric.name.toLowerCase().includes('publicações')
    );
    
    if (year) {
      results = results.filter(metric => {
        const metricYear = parseInt(metric.measurement_date.split('-')[0]);
        return metricYear === year;
      });
    }
    
    if (results.length > 0) {
      return {
        message: message,
        sqlQuery: sqlQuery,
        results: results
      };
    }
  } else {
    // General R&D/innovation query
    let message = "Aqui está um resumo dos indicadores de I&D e inovação em Portugal";
    let results = [];
    
    // Get investment metrics
    const investmentMetrics = mockDatabase.ani_metrics.filter(metric => 
      metric.category === 'investment' || metric.category === 'innovation'
    );
    
    // Get patent counts
    const patentMetrics = mockDatabase.ani_patent_holders;
    
    if (year) {
      message += ` para o ano ${year}`;
      
      // Filter by year
      results = investmentMetrics.filter(metric => {
        const metricYear = parseInt(metric.measurement_date.split('-')[0]);
        return metricYear === year;
      });
      
      const yearPatents = patentMetrics.filter(patent => patent.year === year);
      
      if (results.length > 0 || yearPatents.length > 0) {
        // Calculate total patents if we have patent data
        if (yearPatents.length > 0) {
          const totalPatents = yearPatents.reduce((sum, patent) => sum + patent.patent_count, 0);
          message += `. Foram registadas ${totalPatents} patentes neste ano.`;
        }
        
        return {
          message: message,
          sqlQuery: "SELECT * FROM ani_metrics WHERE category IN ('investment', 'innovation') " + 
                   (year ? `AND EXTRACT(YEAR FROM measurement_date) = ${year}` : ""),
          results: results.length > 0 ? results : yearPatents
        };
      }
    } else {
      // Return general overview of R&D metrics
      results = investmentMetrics.slice(0, 15);
      
      return {
        message: message,
        sqlQuery: "SELECT * FROM ani_metrics WHERE category IN ('investment', 'innovation')",
        results: results
      };
    }
  }
  
  return {
    message: "Não foram encontrados dados de I&D ou inovação que correspondam aos critérios especificados.",
    sqlQuery: "",
    results: []
  };
}
