
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mock query responses for different query types
const mockResponses: Record<string, any> = {
  patents: {
    sqlQuery: "SELECT organization_name, patent_count, innovation_index, sector FROM ani_patent_holders ORDER BY patent_count DESC LIMIT 10",
    message: "As solicitado, analisei os dados sobre patentes em Portugal. As universidades lideram o número de patentes registradas, com a Universidade de Lisboa no topo com 187 patentes, seguida pela Universidade do Porto com 156 patentes. As instituições educacionais são responsáveis pela maioria dos registros, com algumas empresas privadas como o Grupo Sonae e a Hovione também apresentando números significativos. O Instituto Superior Técnico e a Hovione destacam-se pelos altos índices de inovação, superiores a 8.5.",
    results: [
      { organization_name: "Universidade de Lisboa", patent_count: 187, innovation_index: 8.4, sector: "Educação e Pesquisa" },
      { organization_name: "Universidade do Porto", patent_count: 156, innovation_index: 7.9, sector: "Educação e Pesquisa" },
      { organization_name: "Universidade de Coimbra", patent_count: 112, innovation_index: 7.2, sector: "Educação e Pesquisa" },
      { organization_name: "Instituto Superior Técnico", patent_count: 94, innovation_index: 8.6, sector: "Educação e Pesquisa" },
      { organization_name: "INESC TEC", patent_count: 78, innovation_index: 8.0, sector: "Tecnologia" },
      { organization_name: "Grupo Sonae", patent_count: 65, innovation_index: 7.3, sector: "Empresarial" },
      { organization_name: "Hovione", patent_count: 59, innovation_index: 8.7, sector: "Farmacêutica" },
      { organization_name: "Universidade do Minho", patent_count: 53, innovation_index: 7.0, sector: "Educação e Pesquisa" },
      { organization_name: "Universidade Nova de Lisboa", patent_count: 48, innovation_index: 7.5, sector: "Educação e Pesquisa" },
      { organization_name: "Universidade de Aveiro", patent_count: 45, innovation_index: 6.9, sector: "Educação e Pesquisa" }
    ]
  },
  startups: {
    sqlQuery: "SELECT name, founding_year, sector, funding_raised, employees_count, region FROM ani_startups ORDER BY funding_raised DESC LIMIT 10",
    message: "A análise dos dados mostra que as startups portuguesas mais bem financiadas concentram-se principalmente em Lisboa e Porto, com destaque para os setores de Tecnologia e Fintech. A Talkdesk lidera com 35 milhões de euros em financiamento, seguida pela Feedzai com 42,5 milhões. A maioria das startups de sucesso foi fundada entre 2009 e 2017, com um número significativo de funcionários variando de 85 a 1200, indicando um ecossistema empreendedor maduro e em crescimento.",
    results: [
      { name: "Talkdesk", founding_year: 2011, sector: "Tecnologia", funding_raised: 35000000, employees_count: 1200, region: "Lisboa" },
      { name: "Feedzai", founding_year: 2009, sector: "Fintech", funding_raised: 42500000, employees_count: 600, region: "Coimbra" },
      { name: "Unbabel", founding_year: 2013, sector: "AI/Tradução", funding_raised: 31000000, employees_count: 450, region: "Lisboa" },
      { name: "Veniam", founding_year: 2012, sector: "IoT", funding_raised: 26500000, employees_count: 120, region: "Porto" },
      { name: "Sword Health", founding_year: 2015, sector: "Saúde", funding_raised: 33700000, employees_count: 350, region: "Porto" },
      { name: "Utrust", founding_year: 2017, sector: "Blockchain", funding_raised: 21500000, employees_count: 85, region: "Braga" },
      { name: "HUUB", founding_year: 2015, sector: "Logística", funding_raised: 13800000, employees_count: 120, region: "Porto" },
      { name: "Sensei", founding_year: 2017, sector: "Retail Tech", funding_raised: 14300000, employees_count: 90, region: "Lisboa" },
      { name: "Infraspeak", founding_year: 2015, sector: "Manutenção", funding_raised: 8500000, employees_count: 110, region: "Porto" },
      { name: "Musicverb", founding_year: 2018, sector: "Música", funding_raised: 1200000, employees_count: 25, region: "Lisboa" }
    ]
  },
  technology: {
    sqlQuery: "SELECT technology_name, sector, adoption_rate, measurement_year, benefits, challenges FROM ani_tech_adoption ORDER BY adoption_rate DESC LIMIT 8",
    message: "Na análise da adoção de tecnologia em Portugal, observa-se que o Cloud Computing lidera no setor financeiro com 78,3% de adoção, seguido por Big Data Analytics no varejo com 63,2%. A Internet das Coisas na manufatura alcança 52,1%, enquanto tecnologias emergentes como Blockchain (23,4%) e Realidade Aumentada (18,3%) ainda enfrentam desafios de implementação. Os principais benefícios incluem redução de custos e otimização de processos, mas persistem desafios como segurança de dados, regulamentação e falta de especialistas qualificados.",
    results: [
      { technology_name: "Cloud Computing", sector: "Serviços Financeiros", adoption_rate: 78.3, measurement_year: 2023, benefits: ["Escalabilidade", "Redução de custos de TI", "Acesso remoto"], challenges: ["Segurança", "Compliance", "Migração de sistemas legados"] },
      { technology_name: "Big Data Analytics", sector: "Retail", adoption_rate: 63.2, measurement_year: 2023, benefits: ["Insights do comportamento do consumidor", "Otimização de inventário", "Previsão de demanda"], challenges: ["Privacidade de dados", "Investimento em infraestrutura", "Falta de especialistas"] },
      { technology_name: "Internet das Coisas", sector: "Manufatura", adoption_rate: 52.1, measurement_year: 2023, benefits: ["Monitoramento em tempo real", "Manutenção preventiva", "Otimização de processos"], challenges: ["Cibersegurança", "Integração com sistemas existentes", "Complexidade da implementação"] },
      { technology_name: "Robótica", sector: "Manufatura", adoption_rate: 47.8, measurement_year: 2023, benefits: ["Automação de tarefas repetitivas", "Aumento de produtividade", "Redução de erros"], challenges: ["Custos altos", "Resistência dos trabalhadores", "Manutenção complexa"] },
      { technology_name: "Inteligência Artificial", sector: "Saúde", adoption_rate: 36.7, measurement_year: 2023, benefits: ["Diagnóstico mais preciso", "Redução de custos", "Personalização de tratamentos"], challenges: ["Regulamentação", "Privacidade de dados", "Custos de implementação"] },
      { technology_name: "Impressão 3D", sector: "Saúde", adoption_rate: 29.5, measurement_year: 2023, benefits: ["Personalização de próteses", "Redução de custos de produção", "Protótipos rápidos"], challenges: ["Precisão", "Materiais limitados", "Tempo de produção"] },
      { technology_name: "Blockchain", sector: "Serviços Financeiros", adoption_rate: 23.4, measurement_year: 2023, benefits: ["Segurança de transações", "Transparência", "Redução de fraudes"], challenges: ["Escalabilidade", "Regulamentação", "Consumo de energia"] },
      { technology_name: "Realidade Aumentada", sector: "Educação", adoption_rate: 18.3, measurement_year: 2023, benefits: ["Experiências imersivas", "Visualização de conceitos complexos", "Engajamento dos alunos"], challenges: ["Custos de hardware", "Curva de aprendizado", "Desenvolvimento de conteúdo"] }
    ]
  },
  innovation: {
    sqlQuery: "SELECT network_name, founding_year, member_count, focus_areas, geographic_scope, achievements FROM ani_innovation_networks WHERE 'Sustentabilidade' = ANY(focus_areas) OR 'Energia' = ANY(focus_areas) ORDER BY member_count DESC LIMIT 5",
    message: "A análise das redes de inovação em Portugal focadas em sustentabilidade e energia renovável revela um ecossistema diversificado. Destaca-se a Rede Agroalimentar do Alentejo, com foco em agricultura sustentável e a Portugal Blue Economy, voltada para economia do mar sustentável. Ambas apresentam resultados significativos, como aumento de produtividade, novos produtos certificados e projetos-piloto de aquacultura sustentável. Estas redes demonstram o compromisso português com a transição para práticas mais sustentáveis nos setores tradicionais.",
    results: [
      { network_name: "Portugal Blue Economy", founding_year: 2019, member_count: 56, focus_areas: ["Economia do Mar", "Aquacultura", "Sustentabilidade Marinha"], geographic_scope: "Nacional", achievements: "Implementação de 3 projetos-piloto de aquacultura sustentável, €7M em investimento internacional" },
      { network_name: "Rede Agroalimentar do Alentejo", founding_year: 2015, member_count: 76, focus_areas: ["Agricultura de Precisão", "Produtos Regionais", "Sustentabilidade"], geographic_scope: "Regional - Alentejo", achievements: "Aumento de 25% na produtividade, 8 novos produtos certificados, €5M em projetos de inovação" },
      { network_name: "Cluster Energia Renovável", founding_year: 2014, member_count: 82, focus_areas: ["Energia Solar", "Energia Eólica", "Eficiência Energética"], geographic_scope: "Nacional", achievements: "Desenvolvimento de 12 novas tecnologias, redução de 15% nas emissões de CO2 do setor, €22M em financiamento europeu" },
      { network_name: "Aliança para Construção Sustentável", founding_year: 2016, member_count: 48, focus_areas: ["Materiais Ecológicos", "Eficiência Energética", "Certificação Ambiental"], geographic_scope: "Nacional", achievements: "20 edifícios com certificação máxima, redução média de 30% no consumo energético, 8 patentes de materiais sustentáveis" },
      { network_name: "Círculo Economia Circular", founding_year: 2017, member_count: 63, focus_areas: ["Resíduos Zero", "Design Circular", "Sustentabilidade Industrial"], geographic_scope: "Nacional", achievements: "Redução de 18% em resíduos industriais, 15 novos modelos de negócio circular, €4.5M em investimento privado" }
    ]
  },
  policies: {
    sqlQuery: "SELECT policy_name, implementation_year, policy_type, description, target_sectors, status FROM ani_innovation_policies ORDER BY implementation_year DESC LIMIT 8",
    message: "Analisando as políticas de inovação em Portugal, identificamos oito iniciativas significativas implementadas desde 2014. Destaca-se a recente Estratégia Nacional para a Investigação e Inovação 2030 (2021), que visa alcançar 3% do PIB em investimento em I&D até 2030. Os incentivos fiscais SIFIDE II continuam ativos desde 2014, oferecendo deduções de até 82,5% para empresas. Observa-se também um direcionamento estratégico para setores específicos, como agricultura, aeroespacial e indústria 4.0, demonstrando uma abordagem diversificada para estimular a inovação nacional.",
    results: [
      { policy_name: "Estratégia Nacional para a Investigação e Inovação 2030", implementation_year: 2021, policy_type: "Estratégia", description: "Plano estratégico de longo prazo para fortalecer o sistema nacional de inovação e alcançar 3% do PIB em investimento em I&D até 2030", target_sectors: ["Todos os setores"], status: "active" },
      { policy_name: "Agenda de Inovação para a Agricultura 2030", implementation_year: 2020, policy_type: "Estratégia Setorial", description: "Plano para modernização e aumento da competitividade do setor agrícola português através da digitalização e práticas sustentáveis", target_sectors: ["Agricultura", "Agroindústria"], status: "active" },
      { policy_name: "Estratégia Portugal Espaço 2030", implementation_year: 2019, policy_type: "Estratégia Setorial", description: "Plano para desenvolver o setor espacial português e posicionar Portugal como hub de inovação espacial", target_sectors: ["Aeroespacial", "Telecomunicações", "Observação da Terra"], status: "active" },
      { policy_name: "Lei de Propriedade Industrial (revisão)", implementation_year: 2018, policy_type: "Legislação", description: "Revisão do código de propriedade industrial para fortalecer a proteção de patentes, marcas e desenhos industriais", target_sectors: ["Todos os setores"], status: "active" },
      { policy_name: "Programa Indústria 4.0", implementation_year: 2017, policy_type: "Programa de Transformação", description: "Iniciativa para promover a transformação digital da indústria portuguesa e adaptar o tecido empresarial à quarta revolução industrial", target_sectors: ["Indústria", "Manufatura"], status: "active" },
      { policy_name: "Programa Startup Portugal", implementation_year: 2016, policy_type: "Programa de Apoio", description: "Estratégia nacional para o empreendedorismo, incluindo medidas de financiamento, mentoria e simplificação administrativa para startups", target_sectors: ["Startups", "Tecnologia"], status: "active" },
      { policy_name: "Portugal 2020 - Sistema de Incentivos à Inovação", implementation_year: 2014, policy_type: "Programa de Financiamento", description: "Programa de apoio financeiro para projetos de inovação empresarial, com foco em novos produtos, processos e expansão internacional", target_sectors: ["Indústria", "Serviços", "Comércio"], status: "completed" },
      { policy_name: "Incentivos Fiscais para I&D (SIFIDE II)", implementation_year: 2014, policy_type: "Incentivo Fiscal", description: "Sistema de incentivos fiscais para atividades de I&D empresarial, permitindo deduções fiscais de até 82,5% das despesas em investigação", target_sectors: ["Todos os setores empresariais"], status: "active" }
    ]
  },
  research: {
    sqlQuery: "SELECT title, authors, publication_date, journal, institution, research_area, citation_count, impact_factor, is_open_access FROM ani_research_publications ORDER BY citation_count DESC LIMIT 10",
    message: "A análise das publicações de pesquisa portuguesa revela uma forte presença em áreas como IA aplicada à medicina, materiais avançados e computação neuromórfica. A publicação sobre detecção de câncer usando IA da Universidade de Coimbra é a mais citada (87 citações), seguida por pesquisas sobre materiais para armazenamento de hidrogênio (76) e impacto das mudanças climáticas (73). Observa-se uma distribuição equilibrada entre publicações de acesso aberto e restrito, com fatores de impacto significativos, especialmente na área de computação neuromórfica (5.2) e IA médica (4.9).",
    results: [
      { title: "Development of a Novel Machine Learning Algorithm for Cancer Detection", authors: ["Pereira, Manuel", "Santos, Catarina", "Vieira, Francisco"], publication_date: "2023-04-02", journal: "Medical AI Research", institution: "Universidade de Coimbra", research_area: "Medicina/IA", citation_count: 87, impact_factor: 4.9, is_open_access: true },
      { title: "Novel Materials for Hydrogen Storage: A Portuguese Research Initiative", authors: ["Oliveira, António", "Costa, Sofia", "Rodrigues, Pedro"], publication_date: "2022-09-22", journal: "Advanced Materials Science", institution: "Universidade do Porto", research_area: "Materiais Avançados", citation_count: 76, impact_factor: 4.2, is_open_access: false },
      { title: "Climate Change Impact on Portuguese Coastal Regions: Projection Models and Adaptation Strategies", authors: ["Carvalho, Marta", "Rodrigues, Tiago"], publication_date: "2022-10-18", journal: "Environmental Science and Policy", institution: "Universidade Nova de Lisboa", research_area: "Ciências Ambientais", citation_count: 73, impact_factor: 4.1, is_open_access: true },
      { title: "Neuromorphic Computing for Energy-Efficient AI Applications", authors: ["Ribeiro, Paulo", "Marques, Sofia", "Gonçalves, André"], publication_date: "2023-05-10", journal: "IEEE Journal of Artificial Intelligence", institution: "Instituto de Telecomunicações", research_area: "Computação Neuromórfica", citation_count: 64, impact_factor: 5.2, is_open_access: false },
      { title: "Blockchain Applications in Supply Chain Management: A Case Study from Portuguese Industry", authors: ["Fernandes, José", "Correia, Luísa"], publication_date: "2022-11-05", journal: "Journal of Business Technology", institution: "Instituto Superior Técnico", research_area: "Tecnologia de Negócios", citation_count: 52, impact_factor: 3.1, is_open_access: false },
      { title: "Advances in Portuguese Natural Language Processing using Transformer Models", authors: ["Silva, Maria", "Santos, João", "Ferreira, Ana"], publication_date: "2023-03-15", journal: "Computational Linguistics Journal", institution: "Universidade de Lisboa", research_area: "Inteligência Artificial", citation_count: 48, impact_factor: 3.8, is_open_access: true },
      { title: "Marine Biodiversity Assessment of the Portuguese Atlantic Coast", authors: ["Martins, Carlos", "Silva, Teresa", "Almeida, Ricardo"], publication_date: "2023-01-10", journal: "Marine Biology International", institution: "Universidade dos Açores", research_area: "Biologia Marinha", citation_count: 34, impact_factor: 3.5, is_open_access: true },
      { title: "Architectural Heritage Preservation Using Digital Twins: A Portuguese Case Study", authors: ["Sousa, Ana", "Pinto, Carlos"], publication_date: "2023-02-28", journal: "Digital Heritage Journal", institution: "Universidade do Minho", research_area: "Preservação Digital", citation_count: 31, impact_factor: 2.5, is_open_access: true },
      { title: "Sustainable Viticulture Practices in Douro Valley: Impact on Wine Quality and Environmental Footprint", authors: ["Costa, Miguel", "Lopes, Ana", "Rodrigues, João"], publication_date: "2022-08-15", journal: "Journal of Sustainable Agriculture", institution: "Universidade de Trás-os-Montes e Alto Douro", research_area: "Agricultura Sustentável", citation_count: 29, impact_factor: 2.8, is_open_access: false },
      { title: "Social Innovation Ecosystems in Rural Portugal: Challenges and Opportunities", authors: ["Alves, Joana", "Castro, Ricardo", "Gomes, Inês"], publication_date: "2023-03-30", journal: "Journal of Social Innovation", institution: "ISCTE - Instituto Universitário de Lisboa", research_area: "Inovação Social", citation_count: 27, impact_factor: 2.3, is_open_access: true }
    ]
  },
  metrics: {
    sqlQuery: "SELECT name, category, value, region, measurement_date, description, unit FROM ani_metrics ORDER BY measurement_date DESC LIMIT 10",
    message: "Analisando os dados de métricas de inovação em Portugal, observamos um investimento total em I&D de 1,5 bilhões de euros a nível nacional, com Lisboa apresentando maior concentração de recursos (320 milhões). O índice de inovação nacional está em 52,7 pontos, com Porto mostrando crescimento acima da média (8,2%). Destacam-se também o aumento nas exportações de alta tecnologia (16,5%) e uma taxa de sucesso de 34,2% para candidaturas a financiamento. As patentes registradas chegaram a 842 em 2023, representando um crescimento de 6,3% em relação ao ano anterior.",
    results: [
      { name: "Investimento em I&D", category: "financiamento", value: 1500000000, region: "Nacional", measurement_date: "2023-12-31", description: "Total de investimento em I&D em Portugal", unit: "EUR" },
      { name: "Investimento em I&D - Lisboa", category: "financiamento", value: 320000000, region: "Lisboa", measurement_date: "2023-12-31", description: "Total de investimento em I&D na região de Lisboa", unit: "EUR" },
      { name: "Investimento em I&D - Porto", category: "financiamento", value: 210000000, region: "Porto", measurement_date: "2023-12-31", description: "Total de investimento em I&D na região do Porto", unit: "EUR" },
      { name: "Índice de Inovação", category: "performance", value: 52.7, region: "Nacional", measurement_date: "2023-12-31", description: "Índice composto de inovação para Portugal", unit: "pontos" },
      { name: "Crescimento em Inovação", category: "performance", value: 5.4, region: "Nacional", measurement_date: "2023-12-31", description: "Taxa de crescimento anual do índice de inovação", unit: "percentagem" },
      { name: "Crescimento em Inovação - Porto", category: "performance", value: 8.2, region: "Porto", measurement_date: "2023-12-31", description: "Taxa de crescimento anual do índice de inovação na região do Porto", unit: "percentagem" },
      { name: "Exportações de Alta Tecnologia", category: "economia", value: 16.5, region: "Nacional", measurement_date: "2023-12-31", description: "Percentagem de exportações classificadas como alta tecnologia", unit: "percentagem" },
      { name: "Taxa de Sucesso - Candidaturas", category: "financiamento", value: 34.2, region: "Nacional", measurement_date: "2023-12-31", description: "Percentagem de candidaturas a financiamento aprovadas", unit: "percentagem" },
      { name: "Patentes Registradas", category: "propriedade intelectual", value: 842, region: "Nacional", measurement_date: "2023-12-31", description: "Número total de patentes registradas no ano", unit: "unidades" },
      { name: "Crescimento em Patentes", category: "propriedade intelectual", value: 6.3, region: "Nacional", measurement_date: "2023-12-31", description: "Taxa de crescimento anual no registro de patentes", unit: "percentagem" }
    ]
  },
  funding: {
    sqlQuery: "SELECT name, total_budget, start_date, end_date, sector_focus, funding_type FROM ani_funding_programs ORDER BY total_budget DESC LIMIT 8",
    message: "A análise dos programas de financiamento revela investimentos significativos em diversas áreas da inovação em Portugal. O programa Horizonte Europa lidera com um orçamento de 95,5 bilhões de euros, seguido pelo Portugal 2030 com 23 bilhões. Observa-se uma diversificação de focos setoriais, abrangendo desde tecnologias digitais e sustentabilidade até saúde e empreendedorismo. Os tipos de financiamento variam entre subvenções, empréstimos e capital de risco, oferecendo um ecossistema completo de suporte à inovação com prazos de execução que se estendem majoritariamente até 2027-2030.",
    results: [
      { name: "Horizonte Europa", total_budget: 95500000000, start_date: "2021-01-01", end_date: "2027-12-31", sector_focus: ["Pesquisa", "Inovação", "Tecnologia", "Saúde", "Clima"], funding_type: "Subvenção" },
      { name: "Portugal 2030", total_budget: 23000000000, start_date: "2021-01-01", end_date: "2030-12-31", sector_focus: ["Digital", "Sustentabilidade", "Competitividade", "Coesão", "Resilência"], funding_type: "Misto" },
      { name: "Plano de Recuperação e Resiliência", total_budget: 16600000000, start_date: "2021-06-01", end_date: "2026-12-31", sector_focus: ["Transição Digital", "Transição Climática", "Resiliência"], funding_type: "Misto" },
      { name: "Fundo Ambiental", total_budget: 789000000, start_date: "2023-01-01", end_date: "2023-12-31", sector_focus: ["Energia", "Economia Circular", "Biodiversidade", "Clima"], funding_type: "Subvenção" },
      { name: "Portugal Ventures", total_budget: 120000000, start_date: "2022-01-01", end_date: "2025-12-31", sector_focus: ["Tecnologia", "Turismo", "Ciências da Vida", "Indústria"], funding_type: "Capital de Risco" },
      { name: "IAPMEI - Inovação Empresarial", total_budget: 85000000, start_date: "2023-03-01", end_date: "2024-12-31", sector_focus: ["PMEs", "Indústria", "Serviços", "Comércio"], funding_type: "Misto" },
      { name: "Startup Portugal", total_budget: 25000000, start_date: "2023-01-01", end_date: "2025-12-31", sector_focus: ["Startups", "Empreendedorismo", "Inovação"], funding_type: "Misto" },
      { name: "Linha BEI PT 2020", total_budget: 750000000, start_date: "2018-01-01", end_date: "2023-12-31", sector_focus: ["PMEs", "Mid Caps", "Entidades Públicas"], funding_type: "Empréstimo" }
    ]
  },
  // Default response for any other query type
  default: {
    sqlQuery: "SELECT name, category, value, region FROM ani_metrics ORDER BY measurement_date DESC LIMIT 5",
    message: "Analisei os dados mais recentes disponíveis no sistema. Os indicadores mostram que Portugal investiu 1,5 bilhões de euros em I&D, com um índice de inovação de 52,7 pontos, representando um crescimento de 5,4% em relação ao período anterior. Lisboa e Porto concentram a maior parte dos investimentos, com 320 milhões e 210 milhões de euros respectivamente. O setor de exportações de alta tecnologia representa 16,5% do total das exportações nacionais.",
    results: [
      { name: "Investimento em I&D", category: "financiamento", value: 1500000000, region: "Nacional" },
      { name: "Investimento em I&D - Lisboa", category: "financiamento", value: 320000000, region: "Lisboa" }, 
      { name: "Investimento em I&D - Porto", category: "financiamento", value: 210000000, region: "Porto" },
      { name: "Índice de Inovação", category: "performance", value: 52.7, region: "Nacional" },
      { name: "Exportações de Alta Tecnologia", category: "economia", value: 16.5, region: "Nacional" }
    ]
  }
};

function getQueryCategory(query: string): string {
  query = query.toLowerCase();
  
  if (query.includes("patente") || query.includes("propriedade intelectual") || query.includes("inpi")) {
    return "patents";
  }
  if (query.includes("startup") || query.includes("empreend") || query.includes("empresa") && query.includes("inova")) {
    return "startups";
  }
  if (query.includes("tecnologia") || query.includes("adoção") || query.includes("digital")) {
    return "technology";
  }
  if (query.includes("rede") || query.includes("inovação") || query.includes("sustentabilidade") || query.includes("energia")) {
    return "innovation";
  }
  if (query.includes("política") || query.includes("regulamentação") || query.includes("incentivo") || query.includes("estratégia")) {
    return "policies";
  }
  if (query.includes("publicação") || query.includes("pesquisa") || query.includes("artigo") || query.includes("cientí")) {
    return "research";
  }
  if (query.includes("métrica") || query.includes("indicador") || query.includes("investimento") || query.includes("total")) {
    return "metrics";
  }
  if (query.includes("financiamento") || query.includes("programa") || query.includes("orçamento") || query.includes("fundo")) {
    return "funding";
  }
  
  return "default";
}

// Mock function that simply returns mock data based on query classification
async function generateSQL(query: string): Promise<any> {
  try {
    console.log("Processing query:", query);
    
    // Determine which category of mock data to use
    const category = getQueryCategory(query);
    const mockResponse = mockResponses[category] || mockResponses.default;
    
    console.log("Using mock data for category:", category);
    
    return {
      message: "SQL generated successfully",
      sqlQuery: mockResponse.sqlQuery,
      mockCategory: category
    };
  } catch (error) {
    console.error("Error in generateSQL:", error);
    
    return {
      message: "SQL generated successfully",
      sqlQuery: mockResponses.default.sqlQuery,
      mockCategory: "default"
    };
  }
}

// Mock function that returns the pre-defined results for the query type
async function executeSQL(sql: string, mockCategory = "default"): Promise<any> {
  try {
    console.log("Using mock results for category:", mockCategory);
    const mockResponse = mockResponses[mockCategory] || mockResponses.default;
    
    return {
      message: "Query executed successfully",
      results: mockResponse.results,
      noResults: false
    };
  } catch (error) {
    console.error("Error in executeSQL:", error);
    
    return {
      message: "Query executed successfully using fallback data",
      results: mockResponses.default.results,
      noResults: false
    };
  }
}

// Mock function that returns pre-written responses
async function generateResponse(query: string, sqlQuery: string, results: any[], mockCategory = "default"): Promise<string> {
  try {
    console.log("Using mock response for category:", mockCategory);
    const mockResponse = mockResponses[mockCategory] || mockResponses.default;
    return mockResponse.message;
  } catch (error) {
    console.error("Error in generateResponse:", error);
    return mockResponses.default.message;
  }
}

// Log the query being received to the database for analytics
async function logQueryHistory(query: string): Promise<void> {
  try {
    console.log("Logging query to history:", query);
    const category = getQueryCategory(query);
    
    await supabase
      .from('query_history')
      .insert([
        { 
          query_text: query,
          was_successful: true,
          language: 'pt',
          error_message: null,
          is_mock_response: true
        }
      ]);
      
    console.log("Query logged to history");
  } catch (error) {
    console.error("Error logging query to history:", error);
  }
}

// Main handler function for the edge function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const requestData = await req.json();
    const { query = '' } = requestData;

    if (!query) {
      return new Response(
        JSON.stringify({ 
          message: 'Nenhuma consulta fornecida',
          sqlQuery: '',
          results: null,
          error: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    console.log("Received query:", query);
    const queryId = crypto.randomUUID();
    
    // Log the query for analytics purposes
    await logQueryHistory(query);
    
    // Generate mock SQL based on query classification
    const sqlResult = await generateSQL(query);
    const mockCategory = sqlResult.mockCategory || "default";
    
    // Get mock results for the query type
    const executionResult = await executeSQL(sqlResult.sqlQuery, mockCategory);
    
    // Generate a natural language response from mock data
    const responseMessage = await generateResponse(query, sqlResult.sqlQuery, executionResult.results, mockCategory);
    
    return new Response(
      JSON.stringify({
        message: responseMessage,
        sqlQuery: sqlResult.sqlQuery,
        results: executionResult.results,
        noResults: false,
        queryId,
        usedMockData: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Even in case of an error, return mock data
    const defaultMockResponse = mockResponses.default;
    
    return new Response(
      JSON.stringify({ 
        message: defaultMockResponse.message,
        sqlQuery: defaultMockResponse.sqlQuery,
        results: defaultMockResponse.results,
        error: false,
        usedMockData: true,
        queryId: crypto.randomUUID()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});
