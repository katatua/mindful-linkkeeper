
import { nanoid } from 'nanoid';
import { loadFromLocalStorage, STORAGE_KEYS } from './storageUtils';

// Generate a unique ID for tracking messages
export const genId = () => nanoid(8);

// Format database values for display in the UI
export const formatDatabaseValue = (value: any, columnName: string): string => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  
  // Handle date objects
  if (value instanceof Date) {
    return value.toLocaleDateString('pt-BR');
  }
  
  // Handle boolean values
  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }
  
  // Handle objects, including nested objects and arrays
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return '[Objeto Complexo]';
    }
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

// Comprehensive suggested database queries in Portuguese
export const suggestedDatabaseQueries = [
  "Quais são os projetos de inovação com maior financiamento?",
  "Qual é o número total de startups criadas nos últimos 5 anos?",
  "Onde estão localizados os principais centros de inovação em Portugal?",
  "Quem são os principais investidores em startups portuguesas?",
  "Como a ANI está a contribuir para o desenvolvimento tecnológico em Portugal?",
  "Quais são os programas de financiamento disponíveis para empresas inovadoras?",
  "Qual o impacto dos projetos financiados pela ANI na economia portuguesa?",
  "Quais são as áreas de investigação mais promissoras em Portugal?",
  "Como posso submeter uma candidatura a um programa de financiamento da ANI?",
  "Quais são os critérios de avaliação para projetos de inovação?",
  "Quando serão abertas as próximas candidaturas para programas de financiamento?",
  "Quais são os projetos de inovação mais recentes financiados pela ANI?",
  "Quais são os parceiros da ANI em projetos de inovação?",
  "Como posso obter apoio da ANI para internacionalizar a minha startup?",
  "Quais são os eventos e workshops organizados pela ANI?",
  "Quais são as políticas de propriedade intelectual da ANI?",
  "Quais são os indicadores de sucesso dos projetos financiados pela ANI?",
  "Quais são os desafios enfrentados pelas startups em Portugal?",
  "Como a ANI está a promover a colaboração entre universidades e empresas?",
  "Quais são os resultados dos projetos de investigação financiados pela ANI?",
  "Quais são os setores de atividade mais inovadores em Portugal?",
  "Como a ANI está a apoiar o empreendedorismo feminino?",
  "Quais são os recursos disponíveis para startups em Portugal?",
  "Como posso contactar a ANI para obter mais informações?",
  "Quais são os prémios e reconhecimentos atribuídos pela ANI?",
  "Quais são os projetos de inovação com maior impacto social?",
  "Quais são os projetos de inovação com maior potencial de mercado?",
  "Quais são os projetos de inovação com maior número de patentes?",
  "Quais são os projetos de inovação com maior número de publicações científicas?",
  "Quais são os projetos de inovação com maior número de parcerias internacionais?",
  "Quais são os projetos de inovação com maior número de empregos criados?",
  "Quais são os projetos de inovação com maior número de empresas criadas?",
  "Quais são os projetos de inovação com maior número de produtos e serviços lançados?",
  "Quais são os projetos de inovação com maior número de clientes e utilizadores?",
   // Specific queries related to funding and investment
  "Qual o montante total de investimento em projetos de inovação?",
  "Quantos projetos de inovação foram financiados nos últimos 3 anos?",
  "Quais são os projetos com maior retorno sobre o investimento (ROI)?",
  "Quais são os critérios para obter financiamento para projetos de I&D?",
  "Como posso calcular o retorno sobre o investimento de um projeto de inovação?",
  "Quais são os investidores mais ativos em projetos de tecnologia em Portugal?",
  "Quais são os fundos de capital de risco que investem em startups portuguesas?",
  "Como posso preparar uma proposta de financiamento para um projeto de inovação?",
  "Quais são os erros mais comuns em candidaturas a programas de financiamento?",
  "Como posso aumentar as minhas chances de obter financiamento para o meu projeto?",
  "Quais são os programas de apoio à inovação para PMEs?",
  "Quais são os incentivos fiscais para empresas que investem em I&D?",
  "Como posso aceder a financiamento europeu para projetos de inovação?",
  "Quais são as regras para a utilização de fundos públicos em projetos de I&D?",
  "Como posso garantir a sustentabilidade financeira do meu projeto de inovação?",
  "Quais são os indicadores de desempenho financeiro mais importantes para startups?",
  "Como posso atrair investidores para o meu projeto de inovação?",
  "Quais são as estratégias de negociação com investidores?",
  "Como posso proteger a minha propriedade intelectual ao procurar financiamento?",
  "Quais são os aspetos legais a ter em conta ao investir em startups?",
  "Como posso avaliar o risco de um investimento em um projeto de inovação?",
  "Quais são as alternativas ao financiamento bancário para startups?",
  "Como posso criar um plano de negócios para um projeto de inovação?",
  "Quais são os modelos de negócio mais adequados para startups de tecnologia?",
  "Como posso medir o impacto social e ambiental do meu projeto de inovação?",
  "Quais são os exemplos de projetos de inovação com sucesso em Portugal?",
  "Como posso aprender com os erros de outros empreendedores?",
  "Quais são os mentores e consultores mais experientes em inovação em Portugal?",
  "Como posso construir uma rede de contactos no ecossistema de inovação?",
  "Como posso promover o meu projeto de inovação junto de potenciais clientes e parceiros?",
  "Como posso internacionalizar o meu projeto de inovação?",
  "Como posso adaptar o meu modelo de negócio a diferentes mercados?",
  "Como posso proteger a minha marca e reputação ao expandir para novos mercados?",
  "Como posso gerir uma equipa multicultural e multidisciplinar?",
  "Como posso criar uma cultura de inovação na minha empresa?",
  "Como posso motivar os meus colaboradores a serem mais criativos e inovadores?",
  "Como posso recompensar os meus colaboradores pelas suas ideias e contribuições?",
  "Como posso medir o retorno sobre o investimento em formação e desenvolvimento?",
  "Como posso criar um ambiente de trabalho que promova a experimentação e a aprendizagem?",
  "Como posso gerir o risco de falha em projetos de inovação?",
  "Como posso aprender com os meus erros e fracassos?",
  "Como posso transformar uma ideia inovadora em um produto ou serviço de sucesso?",
  "Como posso proteger a minha propriedade intelectual ao lançar um novo produto ou serviço?",
  "Como posso comercializar o meu produto ou serviço de forma eficaz?",
  "Como posso construir uma marca forte e reconhecida?",
  "Como posso criar uma experiência de cliente memorável?",
  "Como posso medir a satisfação dos meus clientes?",
  "Como posso fidelizar os meus clientes?",
  "Como posso transformar os meus clientes em embaixadores da minha marca?",
  "Como posso usar as redes sociais para promover o meu projeto de inovação?",
  "Como posso criar conteúdo relevante e interessante para o meu público-alvo?",
  "Como posso medir o impacto das minhas campanhas de marketing digital?",
  "Como posso usar os dados para tomar decisões mais informadas?",
  "Como posso criar um painel de controlo para monitorizar o desempenho do meu projeto?",
  "Como posso usar a inteligência artificial para automatizar tarefas e melhorar a eficiência?",
  "Como posso usar a realidade virtual e aumentada para criar novas experiências?",
  "Como posso usar a blockchain para garantir a segurança e a transparência?",
  "Como posso usar a internet das coisas para recolher dados e otimizar processos?",
  "Como posso usar a impressão 3D para criar protótipos e produtos personalizados?",
  "Como posso usar a nanotecnologia para criar materiais e dispositivos inovadores?",
  "Como posso usar a biotecnologia para criar soluções para os desafios da saúde e do ambiente?",
  "Como posso usar a energia renovável para reduzir a minha pegada ecológica?",
  "Como posso usar a economia circular para minimizar o desperdício e maximizar o valor?",
  "Como posso usar a inovação social para resolver problemas sociais e ambientais?",
  "Como posso criar um negócio que seja simultaneamente lucrativo e sustentável?",
  "Como posso medir o impacto social e ambiental do meu negócio?",
  "Como posso comunicar o meu impacto social e ambiental aos meus stakeholders?",
  "Como posso atrair e reter talento para a minha empresa?",
  "Como posso criar uma equipa diversificada e inclusiva?",
  "Como posso promover a igualdade de oportunidades na minha empresa?",
  "Como posso garantir o bem-estar dos meus colaboradores?",
  "Como posso criar um ambiente de trabalho saudável e seguro?",
  "Como posso promover a aprendizagem e o desenvolvimento contínuo?",
  "Como posso criar uma cultura de feedback e reconhecimento?",
  "Como posso gerir o conflito de forma construtiva?",
  "Como posso tomar decisões difíceis de forma ética e responsável?",
  "Como posso liderar com integridade e transparência?",
  "Como posso inspirar e motivar os outros a alcançar o seu potencial máximo?",
  "Como posso criar um legado duradouro?",
];

// Define the return type for generateResponse to ensure consistent shape
export interface QueryResponseType {
  message: string;
  sqlQuery: string;
  results: any[] | null;
  noResults?: boolean;
  queryId?: string;
  analysis?: any;
}

// Helper function to check if query is asking about existing data types
const getDataFromLocalStorage = (query: string): {data: any[] | null, message: string, sqlQuery: string} => {
  // Normalize the query for better matching
  const normalizedQuery = query.toLowerCase().trim();
  
  // Match for funding programs
  if (
    normalizedQuery.includes('funding programs') || 
    normalizedQuery.includes('programas de financiamento') ||
    normalizedQuery.includes('que funding') ||
    normalizedQuery.includes('quais funding') ||
    normalizedQuery.includes('quais os funding') ||
    normalizedQuery.includes('quais são os funding') ||
    normalizedQuery.includes('listar funding') ||
    normalizedQuery.includes('mostrar funding')
  ) {
    const fundingPrograms = loadFromLocalStorage(STORAGE_KEYS.FUNDING_PROGRAMS, []);
    const sqlQuery = "SELECT id, name, description, total_budget, funding_type FROM ani_funding_programs";
    
    if (fundingPrograms && fundingPrograms.length > 0) {
      return {
        data: fundingPrograms,
        message: `Existem ${fundingPrograms.length} programas de financiamento disponíveis. Aqui estão os detalhes:`,
        sqlQuery
      };
    }
  }
  
  // Match for projects
  if (
    normalizedQuery.includes('projetos') || 
    normalizedQuery.includes('projects') ||
    (normalizedQuery.includes('quais') && normalizedQuery.includes('projeto'))
  ) {
    const projects = loadFromLocalStorage(STORAGE_KEYS.PROJECTS, []);
    const sqlQuery = "SELECT id, title, description, funding_amount, status, organization FROM ani_projects";
    
    if (projects && projects.length > 0) {
      return {
        data: projects,
        message: `Foram encontrados ${projects.length} projetos. Aqui estão os detalhes:`,
        sqlQuery
      };
    }
  }
  
  // Match for institutions
  if (
    normalizedQuery.includes('instituições') || 
    normalizedQuery.includes('institutions') || 
    normalizedQuery.includes('institutos')
  ) {
    const institutions = loadFromLocalStorage(STORAGE_KEYS.INSTITUTIONS, []);
    const sqlQuery = "SELECT id, institution_name, type, region FROM ani_institutions";
    
    if (institutions && institutions.length > 0) {
      return {
        data: institutions,
        message: `Foram encontradas ${institutions.length} instituições. Aqui estão os detalhes:`,
        sqlQuery
      };
    }
  }
  
  // Match for researchers
  if (
    normalizedQuery.includes('pesquisadores') || 
    normalizedQuery.includes('researchers') || 
    normalizedQuery.includes('investigadores')
  ) {
    const researchers = loadFromLocalStorage(STORAGE_KEYS.RESEARCHERS, []);
    const sqlQuery = "SELECT id, name, specialization, h_index, publication_count FROM ani_researchers";
    
    if (researchers && researchers.length > 0) {
      return {
        data: researchers,
        message: `Foram encontrados ${researchers.length} pesquisadores. Aqui estão os detalhes:`,
        sqlQuery
      };
    }
  }
  
  // Match for policy frameworks
  if (
    normalizedQuery.includes('política') || 
    normalizedQuery.includes('policies') || 
    normalizedQuery.includes('framework') || 
    normalizedQuery.includes('políticas')
  ) {
    const policies = loadFromLocalStorage(STORAGE_KEYS.POLICY_FRAMEWORKS, []);
    const sqlQuery = "SELECT id, title, description, status FROM ani_policy_frameworks";
    
    if (policies && policies.length > 0) {
      return {
        data: policies,
        message: `Foram encontradas ${policies.length} políticas ou frameworks. Aqui estão os detalhes:`,
        sqlQuery
      };
    }
  }
  
  // Match for collaborations
  if (
    normalizedQuery.includes('colaborações') || 
    normalizedQuery.includes('collaborations') || 
    normalizedQuery.includes('parcerias') ||
    normalizedQuery.includes('internacionais')
  ) {
    const collaborations = loadFromLocalStorage(STORAGE_KEYS.INTERNATIONAL_COLLABORATIONS, []);
    const sqlQuery = "SELECT id, program_name, country, partnership_type, total_budget FROM ani_international_collaborations";
    
    if (collaborations && collaborations.length > 0) {
      return {
        data: collaborations,
        message: `Foram encontradas ${collaborations.length} colaborações internacionais. Aqui estão os detalhes:`,
        sqlQuery
      };
    }
  }
  
  return { data: null, message: "", sqlQuery: "" };
};

// Generate a response to a user query
export const generateResponse = async (query: string): Promise<QueryResponseType> => {
  console.log("Generating response for:", query);
  
  // First, try to get data from localStorage based on the query
  const { data, message, sqlQuery } = getDataFromLocalStorage(query);
  
  if (data && data.length > 0) {
    return {
      message,
      sqlQuery,
      results: data,
      noResults: false,
      queryId: genId(),
      analysis: null
    };
  }
  
  // Example mock responses
  if (query.toLowerCase().includes('total de investimento')) {
    return {
      message: "O total de investimento em projetos de inovação é €45.000.000",
      sqlQuery: "SELECT SUM(funding_amount) as total_investment FROM ani_projects",
      results: [{ total_investment: 45000000 }],
      noResults: false,
      queryId: genId(),
      analysis: null
    };
  }
  
  if (query.toLowerCase().includes('número de projetos')) {
    return {
      message: "Existem 324 projetos registrados no sistema",
      sqlQuery: "SELECT COUNT(*) as total FROM ani_projects",
      results: [{ total: 324 }],
      noResults: false,
      queryId: genId(),
      analysis: null
    };
  }
  
  // If no data exists, return a mock response with noResults = true
  if (query.toLowerCase().includes('patentes') || query.toLowerCase().includes('proprietários de patentes')) {
    return {
      message: "Não encontrei dados sobre patentes. Você gostaria de popular a base de dados com informações sobre patentes?",
      sqlQuery: "SELECT * FROM ani_patent_holders",
      results: null,
      noResults: true,
      queryId: genId(),
      analysis: {
        recommendation: "Adicionar dados de patentes",
        tables: ["ani_patent_holders"]
      }
    };
  }
  
  // Default response
  return {
    message: "Desculpe, não entendi sua pergunta. Você poderia reformulá-la?",
    sqlQuery: "",
    results: null,
    noResults: false,
    queryId: genId(),
    analysis: null
  };
};
