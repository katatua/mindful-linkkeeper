import { supabase } from '@/integrations/supabase/client';

// Atualizar as chaves para incluir todas as tabelas necessárias
export const STORAGE_KEYS = {
  FUNDING_PROGRAMS: 'ani_funding_programs',
  PROJECTS: 'ani_projects',
  METRICS: 'ani_metrics',
  RESEARCHERS: 'ani_researchers',
  INSTITUTIONS: 'ani_institutions',
  PATENT_HOLDERS: 'ani_patent_holders',
  POLICY_FRAMEWORKS: 'ani_policy_frameworks',
  INTERNATIONAL_COLLABORATIONS: 'ani_international_collaborations',
  FUNDING_APPLICATIONS: 'ani_funding_applications',
  STARTUPS: 'ani_startups',
  TECH_ADOPTION: 'ani_tech_adoption',
  INNOVATION_NETWORKS: 'ani_innovation_networks',
  INNOVATION_POLICIES: 'ani_innovation_policies',
  RESEARCH_PUBLICATIONS: 'ani_research_publications'
};

export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Dados salvos em localStorage para a chave: ${key}`);
  } catch (error) {
    console.error(`Erro ao salvar dados em localStorage para a chave ${key}:`, error);
  }
};

export const loadFromLocalStorage = (key: string, defaultValue: any): any => {
  try {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      console.log(`Dados carregados de localStorage para a chave: ${key}`);
      return JSON.parse(storedData);
    } else {
      console.log(`Nenhum dado encontrado em localStorage para a chave: ${key}. Usando valor padrão.`);
      return defaultValue;
    }
  } catch (error) {
    console.error(`Erro ao carregar dados de localStorage para a chave ${key}:`, error);
    return defaultValue;
  }
};

// Simulate data for each table
const generateDummyData = () => {
  // Funding Programs
  const fundingPrograms = Array.from({ length: 5 }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `Programa de Financiamento ${i + 1}`,
    description: `Descrição do programa ${i + 1}`,
    total_budget: Math.floor(Math.random() * 100000000) + 5000000,
    start_date: new Date(2021, i, 1).toISOString().split('T')[0],
    end_date: new Date(2025, i, 31).toISOString().split('T')[0],
    eligibility_criteria: "Critérios de elegibilidade para este programa",
    application_process: "Processo de candidatura em várias etapas",
    sector_focus: ["Saúde", "Tecnologia", "Educação"].slice(0, Math.floor(Math.random() * 3) + 1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    application_deadline: new Date(2021, i, 15).toISOString().split('T')[0],
    next_call_date: new Date(2023, i + 6, 1).toISOString().split('T')[0],
    funding_type: ["nacional", "europeu", "privado"][Math.floor(Math.random() * 3)],
    success_rate: Math.random() * 100,
    review_time_days: Math.floor(Math.random() * 120) + 30
  }));

  // Projects
  const projects = Array.from({ length: 15 }, (_, i) => ({
    id: crypto.randomUUID(),
    title: `Projeto de Inovação ${i + 1}`,
    description: `Descrição detalhada do projeto ${i + 1}`,
    funding_amount: Math.floor(Math.random() * 2000000) + 100000,
    start_date: new Date(2022, i % 12, 1).toISOString().split('T')[0],
    end_date: new Date(2024, i % 12, 28).toISOString().split('T')[0],
    status: ["submitted", "approved", "in_progress", "completed"][Math.floor(Math.random() * 4)],
    sector: ["Saúde", "Tecnologia", "Educação", "Energia", "Agricultura"][Math.floor(Math.random() * 5)],
    region: ["Lisboa", "Porto", "Coimbra", "Braga", "Faro"][Math.floor(Math.random() * 5)],
    organization: `Organização ${i + 1}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  // Metrics
  const metrics = Array.from({ length: 30 }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `Métrica ${i + 1}`,
    category: ["financiamento", "desempenho", "inovação", "produtividade"][Math.floor(Math.random() * 4)],
    description: `Descrição da métrica ${i + 1}`,
    value: Math.random() * 1000000,
    unit: ["EUR", "%", "pontos", "unidades"][Math.floor(Math.random() * 4)],
    measurement_date: new Date(2021 + Math.floor(i / 12), i % 12, 15).toISOString().split('T')[0],
    source: `Fonte de Dados ${i % 5 + 1}`,
    region: ["Lisboa", "Porto", "Nacional", "Norte", "Sul"][Math.floor(Math.random() * 5)],
    sector: ["Geral", "Tecnologia", "Saúde", "Educação"][Math.floor(Math.random() * 4)],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  // Researchers - Nova tabela
  const researchers = Array.from({ length: 20 }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `Pesquisador ${i + 1}`,
    specialization: ["Ciência da Computação", "Biologia", "Física", "Química", "Medicina"][Math.floor(Math.random() * 5)],
    institution_id: crypto.randomUUID(),
    h_index: Math.floor(Math.random() * 50) + 10,
    publication_count: Math.floor(Math.random() * 100) + 5,
    patent_count: Math.floor(Math.random() * 10),
    email: `pesquisador${i + 1}@exemplo.pt`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  // Institutions - Nova tabela
  const institutions = Array.from({ length: 15 }, (_, i) => ({
    id: crypto.randomUUID(),
    institution_name: `Instituição ${i + 1}`,
    type: ["Universidade", "Instituto de Pesquisa", "Empresa", "Fundação"][Math.floor(Math.random() * 4)],
    region: ["Lisboa", "Porto", "Coimbra", "Braga", "Faro"][Math.floor(Math.random() * 5)],
    founding_date: new Date(1900 + Math.floor(Math.random() * 120), Math.floor(Math.random() * 12), 1).toISOString().split('T')[0],
    specialization_areas: ["Tecnologia", "Saúde", "Engenharia", "Ciências Sociais"].slice(0, Math.floor(Math.random() * 3) + 1),
    project_history: [`Projeto ${Math.floor(Math.random() * 100)}`, `Projeto ${Math.floor(Math.random() * 100)}`],
    collaboration_count: Math.floor(Math.random() * 50) + 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  // Patent Holders - Nova tabela
  const patentHolders = Array.from({ length: 12 }, (_, i) => ({
    id: crypto.randomUUID(),
    organization_name: `Organização Detentora de Patentes ${i + 1}`,
    sector: ["Tecnologia", "Farmacêutica", "Biotecnologia", "Engenharia"][Math.floor(Math.random() * 4)],
    country: ["Portugal", "Espanha", "França", "Alemanha", "Reino Unido"][Math.floor(Math.random() * 5)],
    patent_count: Math.floor(Math.random() * 200) + 10,
    innovation_index: Math.random() * 10,
    year: 2020 + Math.floor(i / 4),
    institution_id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  }));

  // Policy Frameworks - Nova tabela
  const policyFrameworks = Array.from({ length: 8 }, (_, i) => ({
    id: crypto.randomUUID(),
    title: `Estrutura de Política ${i + 1}`,
    description: `Descrição da estrutura de política ${i + 1}`,
    implementation_date: new Date(2020 + i, 0, 1).toISOString().split('T')[0],
    status: ["active", "draft", "archived"][Math.floor(Math.random() * 3)],
    scope: ["Nacional", "Regional", "Setorial"][Math.floor(Math.random() * 3)],
    key_objectives: ["Objetivo 1", "Objetivo 2", "Objetivo 3"].slice(0, Math.floor(Math.random() * 3) + 1),
    related_legislation: `Legislação ${i + 1}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
  
  // International Collaborations - Nova tabela
  const internationalCollaborations = Array.from({ length: 10 }, (_, i) => ({
    id: crypto.randomUUID(),
    program_name: `Programa de Colaboração ${i + 1}`,
    country: ["França", "Alemanha", "Espanha", "Reino Unido", "EUA"][Math.floor(Math.random() * 5)],
    partnership_type: ["Pesquisa", "Educação", "Desenvolvimento", "Inovação"][Math.floor(Math.random() * 4)],
    start_date: new Date(2021, i % 12, 1).toISOString().split('T')[0],
    end_date: new Date(2025, i % 12, 28).toISOString().split('T')[0],
    total_budget: Math.floor(Math.random() * 5000000) + 500000,
    portuguese_contribution: Math.floor(Math.random() * 2000000) + 100000,
    focus_areas: ["Energia", "Saúde", "Tecnologia", "Ambiente"].slice(0, Math.floor(Math.random() * 3) + 1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
  
  // Funding Applications - Nova tabela
  const fundingApplications = Array.from({ length: 25 }, (_, i) => ({
    id: crypto.randomUUID(),
    program_id: crypto.randomUUID(),
    application_date: new Date(2022, i % 12, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    decision_date: new Date(2022, (i % 12) + 3, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    requested_amount: Math.floor(Math.random() * 1000000) + 50000,
    approved_amount: Math.floor(Math.random() * 800000) + 40000,
    status: ["pending", "approved", "rejected", "under_review"][Math.floor(Math.random() * 4)],
    sector: ["Tecnologia", "Saúde", "Energia", "Educação", "Indústria"][Math.floor(Math.random() * 5)],
    region: ["Lisboa", "Porto", "Coimbra", "Braga", "Algarve"][Math.floor(Math.random() * 5)],
    organization: `Organização Solicitante ${i + 1}`,
    year: 2022 + Math.floor(i / 12),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
  
  // Startups - Nova tabela
  const startups = Array.from({ length: 20 }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `Startup ${i + 1}`,
    sector: ["Fintech", "Healthtech", "Edtech", "Cleantech", "AI"][Math.floor(Math.random() * 5)],
    region: ["Lisboa", "Porto", "Braga", "Aveiro", "Coimbra"][Math.floor(Math.random() * 5)],
    founding_year: 2015 + Math.floor(Math.random() * 8),
    funding_raised: Math.floor(Math.random() * 5000000) + 100000,
    employees_count: Math.floor(Math.random() * 100) + 5,
    description: `Descrição da startup ${i + 1} e suas atividades principais`,
    status: ["active", "acquired", "closed"][Math.floor(Math.random() * 3)],
    success_metrics: {
      revenue_growth: Math.floor(Math.random() * 200) + 10,
      customer_count: Math.floor(Math.random() * 10000) + 500,
      market_share: Math.random() * 15
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
  
  // Technology Adoption - Nova tabela
  const techAdoption = Array.from({ length: 15 }, (_, i) => ({
    id: crypto.randomUUID(),
    technology_name: ["Inteligência Artificial", "Blockchain", "IoT", "Cloud Computing", "AR/VR"][Math.floor(Math.random() * 5)],
    sector: ["Financeiro", "Saúde", "Educação", "Manufatura", "Retalho"][Math.floor(Math.random() * 5)],
    adoption_rate: Math.random() * 100,
    measurement_year: 2020 + Math.floor(i / 5),
    region: ["Lisboa", "Porto", "Nacional", "Norte", "Centro"][Math.floor(Math.random() * 5)],
    benefits: ["Eficiência", "Redução de custos", "Melhor experiência", "Novos produtos"].slice(0, Math.floor(Math.random() * 3) + 1),
    challenges: ["Custos", "Expertise", "Segurança", "Integração"].slice(0, Math.floor(Math.random() * 3) + 1),
    source: `Estudo ${i + 1}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
  
  // Innovation Networks - Nova tabela
  const innovationNetworks = Array.from({ length: 12 }, (_, i) => ({
    id: crypto.randomUUID(),
    network_name: `Rede de Inovação ${i + 1}`,
    focus_areas: ["Energia renovável", "Saúde digital", "Smart cities", "Indústria 4.0"].slice(0, Math.floor(Math.random() * 3) + 1),
    founding_year: 2015 + Math.floor(i / 4),
    member_count: Math.floor(Math.random() * 200) + 20,
    geographic_scope: ["Regional", "Nacional", "Internacional"][Math.floor(Math.random() * 3)],
    key_partners: [`Parceiro ${Math.floor(Math.random() * 50) + 1}`, `Parceiro ${Math.floor(Math.random() * 50) + 1}`],
    achievements: `Principais realizações da rede de inovação ${i + 1}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
  
  // Innovation Policies - Nova tabela
  const innovationPolicies = Array.from({ length: 10 }, (_, i) => ({
    id: crypto.randomUUID(),
    policy_name: `Política de Inovação ${i + 1}`,
    policy_type: ["Fiscal", "Regulatória", "Financiamento", "Educacional"][Math.floor(Math.random() * 4)],
    implementation_year: 2018 + Math.floor(i / 3),
    description: `Descrição detalhada da política ${i + 1}`,
    target_sectors: ["Tecnologia", "Saúde", "Energia", "Educação"].slice(0, Math.floor(Math.random() * 3) + 1),
    status: ["active", "under_review", "expired"][Math.floor(Math.random() * 3)],
    issuing_authority: ["Ministério da Economia", "ANI", "FCT", "Governo Regional"][Math.floor(Math.random() * 4)],
    impact_metrics: {
      jobs_created: Math.floor(Math.random() * 5000) + 100,
      companies_benefited: Math.floor(Math.random() * 500) + 20,
      success_rate: `${Math.floor(Math.random() * 100)}%`
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
  
  // Research Publications - Nova tabela
  const researchPublications = Array.from({ length: 30 }, (_, i) => ({
    id: crypto.randomUUID(),
    title: `Publicação Científica ${i + 1}`,
    authors: [`Autor ${Math.floor(Math.random() * 50) + 1}`, `Autor ${Math.floor(Math.random() * 50) + 1}`],
    publication_date: new Date(2020 + Math.floor(i / 10), i % 12, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    journal: `Revista Científica ${Math.floor(Math.random() * 20) + 1}`,
    research_area: ["Medicina", "Informática", "Física", "Engenharia", "Biologia"][Math.floor(Math.random() * 5)],
    institution: ["Universidade de Lisboa", "Universidade do Porto", "Universidade de Coimbra"][Math.floor(Math.random() * 3)],
    citation_count: Math.floor(Math.random() * 500),
    impact_factor: Math.random() * 10,
    is_open_access: Math.random() > 0.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  return {
    [STORAGE_KEYS.FUNDING_PROGRAMS]: fundingPrograms,
    [STORAGE_KEYS.PROJECTS]: projects,
    [STORAGE_KEYS.METRICS]: metrics,
    [STORAGE_KEYS.RESEARCHERS]: researchers,
    [STORAGE_KEYS.INSTITUTIONS]: institutions,
    [STORAGE_KEYS.PATENT_HOLDERS]: patentHolders,
    [STORAGE_KEYS.POLICY_FRAMEWORKS]: policyFrameworks,
    [STORAGE_KEYS.INTERNATIONAL_COLLABORATIONS]: internationalCollaborations,
    [STORAGE_KEYS.FUNDING_APPLICATIONS]: fundingApplications,
    [STORAGE_KEYS.STARTUPS]: startups,
    [STORAGE_KEYS.TECH_ADOPTION]: techAdoption,
    [STORAGE_KEYS.INNOVATION_NETWORKS]: innovationNetworks,
    [STORAGE_KEYS.INNOVATION_POLICIES]: innovationPolicies,
    [STORAGE_KEYS.RESEARCH_PUBLICATIONS]: researchPublications
  };
};

export const initializeDummyDataIfNeeded = async (): Promise<void> => {
  console.log("Iniciando carregamento de dados de amostra...");
  const dummyData = generateDummyData();

  // Armazenar promessas de salvamento para aguardar todas concluírem
  const savePromises = [];

  for (const key in STORAGE_KEYS) {
    if (STORAGE_KEYS.hasOwnProperty(key)) {
      const storageKey = STORAGE_KEYS[key as keyof typeof STORAGE_KEYS];
      const existingData = loadFromLocalStorage(storageKey, []);
      
      if (!Array.isArray(existingData) || existingData.length === 0) {
        console.log(`Inicializando dados de amostra para a chave: ${storageKey}`);
        // Verificar se temos dados para esta chave no dummyData
        if (dummyData[storageKey] && Array.isArray(dummyData[storageKey])) {
          // Adicionar à lista de promessas
          savePromises.push(
            new Promise<void>((resolve) => {
              // Pequeno atraso para evitar problemas de concorrência no localStorage
              setTimeout(() => {
                saveToLocalStorage(storageKey, dummyData[storageKey]);
                console.log(`Dados salvos com sucesso para: ${storageKey} (${dummyData[storageKey].length} itens)`);
                resolve();
              }, 50 * savePromises.length); // Escalonar os salvamentos para evitar conflitos
            })
          );
        } else {
          console.warn(`Nenhum dado dummy encontrado para a chave: ${storageKey}`);
        }
      } else {
        console.log(`Dados já existem em localStorage para a chave: ${storageKey}. Ignorando inicialização.`);
      }
    }
  }

  // Aguardar todas as operações de salvamento
  if (savePromises.length > 0) {
    console.log(`Aguardando ${savePromises.length} operações de salvamento...`);
    await Promise.all(savePromises);
    console.log("Todos os dados foram salvos com sucesso!");
  } else {
    console.log("Nenhum novo dado precisou ser salvo.");
  }
};
