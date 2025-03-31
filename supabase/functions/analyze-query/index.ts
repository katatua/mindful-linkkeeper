
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const googleApiKey = Deno.env.get('GEMINI_API_KEY');

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getAIModel(): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('get_database_setting', {
      setting_key: 'ai_model'
    });
    
    if (error) throw error;
    return data || 'gemini-2.5-pro-exp-03-25';
  } catch (error) {
    console.error('Error fetching AI model:', error);
    return 'gemini-2.5-pro-exp-03-25';
  }
}

function generateSampleAnalysis(queryText: string) {
  const queryLower = queryText.toLowerCase();
  
  // 1. Patentes e propriedade intelectual
  if (queryLower.includes("patente") || queryLower.includes("patentes") || 
      queryLower.includes("propriedade intelectual") || queryLower.includes("inpi")) {
    return {
      analysis: "Esta consulta está relacionada a patentes e propriedade intelectual. Preparei dados de amostra para informações sobre patentes que podem ser adicionados à sua base de dados.",
      tables: ["ani_patent_holders"],
      insertStatements: [
        `INSERT INTO ani_patent_holders (organization_name, patent_count, innovation_index, year, sector, country) 
        VALUES ('Universidade de Lisboa', 187, 8.4, 2023, 'Educação e Pesquisa', 'Portugal')`,
        
        `INSERT INTO ani_patent_holders (organization_name, patent_count, innovation_index, year, sector, country) 
        VALUES ('Universidade do Porto', 156, 7.9, 2023, 'Educação e Pesquisa', 'Portugal')`,
        
        `INSERT INTO ani_patent_holders (organization_name, patent_count, innovation_index, year, sector, country) 
        VALUES ('Universidade de Coimbra', 112, 7.2, 2023, 'Educação e Pesquisa', 'Portugal')`,
        
        `INSERT INTO ani_patent_holders (organization_name, patent_count, innovation_index, year, sector, country) 
        VALUES ('Instituto Superior Técnico', 94, 8.6, 2023, 'Educação e Pesquisa', 'Portugal')`,
        
        `INSERT INTO ani_patent_holders (organization_name, patent_count, innovation_index, year, sector, country) 
        VALUES ('INESC TEC', 78, 8.0, 2023, 'Tecnologia', 'Portugal')`,
        
        `INSERT INTO ani_patent_holders (organization_name, patent_count, innovation_index, year, sector, country) 
        VALUES ('Grupo Sonae', 65, 7.3, 2023, 'Empresarial', 'Portugal')`,
        
        `INSERT INTO ani_patent_holders (organization_name, patent_count, innovation_index, year, sector, country) 
        VALUES ('Hovione', 59, 8.7, 2023, 'Farmacêutica', 'Portugal')`,
        
        `INSERT INTO ani_patent_holders (organization_name, patent_count, innovation_index, year, sector, country) 
        VALUES ('Universidade do Minho', 53, 7.0, 2023, 'Educação e Pesquisa', 'Portugal')`,
        
        `INSERT INTO ani_patent_holders (organization_name, patent_count, innovation_index, year, sector, country) 
        VALUES ('Universidade Nova de Lisboa', 48, 7.5, 2023, 'Educação e Pesquisa', 'Portugal')`,
        
        `INSERT INTO ani_patent_holders (organization_name, patent_count, innovation_index, year, sector, country) 
        VALUES ('Universidade de Aveiro', 45, 6.9, 2023, 'Educação e Pesquisa', 'Portugal')`
      ],
      expectedResults: "10 registros de detentores de patentes em Portugal com detalhes sobre o número de patentes e índice de inovação."
    };
  } 
  // 2. Startups e empreendedorismo
  else if (queryLower.includes("startup") || queryLower.includes("empreendedorismo") || queryLower.includes("entrepreneur")) {
    return {
      analysis: "Esta consulta está relacionada a startups e empreendedorismo. Preparei dados de amostra para informações sobre startups que podem ser adicionados à sua base de dados.",
      tables: ["ani_startups"],
      insertStatements: [
        `INSERT INTO ani_startups (name, founding_year, sector, funding_raised, employees_count, region, description, status) 
        VALUES ('Talkdesk', 2011, 'Tecnologia', 35000000, 1200, 'Lisboa', 'Software de contact center baseado em cloud', 'active')`,
        
        `INSERT INTO ani_startups (name, founding_year, sector, funding_raised, employees_count, region, description, status) 
        VALUES ('Feedzai', 2009, 'Fintech', 42500000, 600, 'Coimbra', 'Plataforma de prevenção de fraude em tempo real', 'active')`,
        
        `INSERT INTO ani_startups (name, founding_year, sector, funding_raised, employees_count, region, description, status) 
        VALUES ('Unbabel', 2013, 'AI/Tradução', 31000000, 450, 'Lisboa', 'Serviço de tradução combinando IA e tradutores humanos', 'active')`,
        
        `INSERT INTO ani_startups (name, founding_year, sector, funding_raised, employees_count, region, description, status) 
        VALUES ('Veniam', 2012, 'IoT', 26500000, 120, 'Porto', 'Redes mesh para conectar veículos e cidades inteligentes', 'active')`,
        
        `INSERT INTO ani_startups (name, founding_year, sector, funding_raised, employees_count, region, description, status) 
        VALUES ('Sword Health', 2015, 'Saúde', 33700000, 350, 'Porto', 'Fisioterapia digital usando sensores e IA', 'active')`,
        
        `INSERT INTO ani_startups (name, founding_year, sector, funding_raised, employees_count, region, description, status) 
        VALUES ('Utrust', 2017, 'Blockchain', 21500000, 85, 'Braga', 'Plataforma de pagamento com criptomoedas', 'active')`,
        
        `INSERT INTO ani_startups (name, founding_year, sector, funding_raised, employees_count, region, description, status) 
        VALUES ('HUUB', 2015, 'Logística', 13800000, 120, 'Porto', 'Logística integrada para marcas de moda', 'acquired')`,
        
        `INSERT INTO ani_startups (name, founding_year, sector, funding_raised, employees_count, region, description, status) 
        VALUES ('Musicverb', 2018, 'Música', 1200000, 25, 'Lisboa', 'Plataforma de gestão para artistas e venues musicais', 'active')`,
        
        `INSERT INTO ani_startups (name, founding_year, sector, funding_raised, employees_count, region, description, status) 
        VALUES ('Infraspeak', 2015, 'Manutenção', 8500000, 110, 'Porto', 'Software de gestão de manutenção inteligente', 'active')`,
        
        `INSERT INTO ani_startups (name, founding_year, sector, funding_raised, employees_count, region, description, status) 
        VALUES ('Sensei', 2017, 'Retail Tech', 14300000, 90, 'Lisboa', 'Tecnologia de retail autónomo sem checkout', 'active')`
      ],
      expectedResults: "10 registros de startups portuguesas com detalhes sobre financiamento, setor e status."
    };
  }
  // 3. Adoção de tecnologia
  else if (queryLower.includes("adoção") || queryLower.includes("tecnologia") || queryLower.includes("technology adoption")) {
    return {
      analysis: "Esta consulta está relacionada à adoção de tecnologia. Preparei dados de amostra para taxas de adoção de tecnologia que podem ser adicionados à sua base de dados.",
      tables: ["ani_tech_adoption"],
      insertStatements: [
        `INSERT INTO ani_tech_adoption (technology_name, sector, adoption_rate, measurement_year, region, benefits, challenges) 
        VALUES ('Inteligência Artificial', 'Saúde', 36.7, 2023, 'Nacional', ARRAY['Diagnóstico mais preciso', 'Redução de custos', 'Personalização de tratamentos'], ARRAY['Regulamentação', 'Privacidade de dados', 'Custos de implementação'])`,
        
        `INSERT INTO ani_tech_adoption (technology_name, sector, adoption_rate, measurement_year, region, benefits, challenges) 
        VALUES ('Cloud Computing', 'Serviços Financeiros', 78.3, 2023, 'Nacional', ARRAY['Escalabilidade', 'Redução de custos de TI', 'Acesso remoto'], ARRAY['Segurança', 'Compliance', 'Migração de sistemas legados'])`,
        
        `INSERT INTO ani_tech_adoption (technology_name, sector, adoption_rate, measurement_year, region, benefits, challenges) 
        VALUES ('Internet das Coisas', 'Manufatura', 52.1, 2023, 'Nacional', ARRAY['Monitoramento em tempo real', 'Manutenção preventiva', 'Otimização de processos'], ARRAY['Cibersegurança', 'Integração com sistemas existentes', 'Complexidade da implementação'])`,
        
        `INSERT INTO ani_tech_adoption (technology_name, sector, adoption_rate, measurement_year, region, benefits, challenges) 
        VALUES ('Blockchain', 'Serviços Financeiros', 23.4, 2023, 'Nacional', ARRAY['Segurança de transações', 'Transparência', 'Redução de fraudes'], ARRAY['Escalabilidade', 'Regulamentação', 'Consumo de energia'])`,
        
        `INSERT INTO ani_tech_adoption (technology_name, sector, adoption_rate, measurement_year, region, benefits, challenges) 
        VALUES ('Robótica', 'Manufatura', 47.8, 2023, 'Nacional', ARRAY['Automação de tarefas repetitivas', 'Aumento de produtividade', 'Redução de erros'], ARRAY['Custos altos', 'Resistência dos trabalhadores', 'Manutenção complexa'])`,
        
        `INSERT INTO ani_tech_adoption (technology_name, sector, adoption_rate, measurement_year, region, benefits, challenges) 
        VALUES ('Realidade Aumentada', 'Educação', 18.3, 2023, 'Nacional', ARRAY['Experiências imersivas', 'Visualização de conceitos complexos', 'Engajamento dos alunos'], ARRAY['Custos de hardware', 'Curva de aprendizado', 'Desenvolvimento de conteúdo'])`,
        
        `INSERT INTO ani_tech_adoption (technology_name, sector, adoption_rate, measurement_year, region, benefits, challenges) 
        VALUES ('Impressão 3D', 'Saúde', 29.5, 2023, 'Nacional', ARRAY['Personalização de próteses', 'Redução de custos de produção', 'Protótipos rápidos'], ARRAY['Precisão', 'Materiais limitados', 'Tempo de produção'])`,
        
        `INSERT INTO ani_tech_adoption (technology_name, sector, adoption_rate, measurement_year, region, benefits, challenges) 
        VALUES ('Big Data Analytics', 'Retail', 63.2, 2023, 'Nacional', ARRAY['Insights do comportamento do consumidor', 'Otimização de inventário', 'Previsão de demanda'], ARRAY['Privacidade de dados', 'Investimento em infraestrutura', 'Falta de especialistas'])`
      ],
      expectedResults: "8 registros sobre taxas de adoção de diferentes tecnologias em vários setores, incluindo benefícios e desafios."
    };
  }
  // 4. Redes de inovação
  else if (queryLower.includes("rede") || queryLower.includes("parceria") || queryLower.includes("network") || queryLower.includes("parceiro") || queryLower.includes("ecosystem")) {
    return {
      analysis: "Esta consulta está relacionada a redes de inovação e parcerias. Preparei dados de amostra para redes de inovação que podem ser adicionados à sua base de dados.",
      tables: ["ani_innovation_networks"],
      insertStatements: [
        `INSERT INTO ani_innovation_networks (network_name, founding_year, member_count, focus_areas, geographic_scope, key_partners, achievements) 
        VALUES ('Hub de Inovação de Lisboa', 2016, 124, ARRAY['Smart Cities', 'Mobilidade', 'Energia'], 'Regional - Lisboa', ARRAY['Câmara Municipal de Lisboa', 'Universidade de Lisboa', 'EDP Inovação'], 'Lançamento de 35 startups, 12 patentes registadas, €25M em financiamento angariado')`,
        
        `INSERT INTO ani_innovation_networks (network_name, founding_year, member_count, focus_areas, geographic_scope, key_partners, achievements) 
        VALUES ('Rede Nacional de Inovação em Saúde', 2018, 87, ARRAY['Dispositivos Médicos', 'Telemedicina', 'Biotecnologia'], 'Nacional', ARRAY['Ministério da Saúde', 'Universidade do Porto', 'Hospitais Centrais'], 'Desenvolvimento de 8 dispositivos médicos inovadores, 5 ensaios clínicos, €15M em financiamento de I&D')`,
        
        `INSERT INTO ani_innovation_networks (network_name, founding_year, member_count, focus_areas, geographic_scope, key_partners, achievements) 
        VALUES ('Portugal Blue Economy', 2019, 56, ARRAY['Economia do Mar', 'Aquacultura', 'Portos Inteligentes'], 'Nacional', ARRAY['IPMA', 'Universidade dos Açores', 'Administração dos Portos'], 'Implementação de 3 projetos-piloto de aquacultura sustentável, €7M em investimento internacional')`,
        
        `INSERT INTO ani_innovation_networks (network_name, founding_year, member_count, focus_areas, geographic_scope, key_partners, achievements) 
        VALUES ('Cluster Têxtil de Portugal', 2008, 132, ARRAY['Têxteis Técnicos', 'Moda Sustentável', 'Indústria 4.0'], 'Regional - Norte', ARRAY['CITEVE', 'Universidade do Minho', 'Associação Têxtil'], 'Exportações aumentadas em 30%, 15 patentes de novos materiais, 12 projetos de internacionalização')`,
        
        `INSERT INTO ani_innovation_networks (network_name, founding_year, member_count, focus_areas, geographic_scope, key_partners, achievements) 
        VALUES ('Digital Porto Alliance', 2017, 94, ARRAY['Software', 'Cibersegurança', 'E-commerce'], 'Regional - Porto', ARRAY['Porto Digital', 'UPTEC', 'INESC TEC'], 'Criação de 45 novas empresas, €18M em investimento externo, 350 novos postos de trabalho')`,
        
        `INSERT INTO ani_innovation_networks (network_name, founding_year, member_count, focus_areas, geographic_scope, key_partners, achievements) 
        VALUES ('Rede Agroalimentar do Alentejo', 2015, 76, ARRAY['Agricultura de Precisão', 'Produtos Regionais', 'Sustentabilidade'], 'Regional - Alentejo', ARRAY['INIAV', 'Universidade de Évora', 'Cooperativas Agrícolas'], 'Aumento de 25% na produtividade, 8 novos produtos certificados, €5M em projetos de inovação')`
      ],
      expectedResults: "6 registros sobre redes de inovação em Portugal, incluindo foco, parceiros e realizações."
    };
  }
  // 5. Políticas de inovação
  else if (queryLower.includes("política") || queryLower.includes("regulamentação") || queryLower.includes("estratégia") || queryLower.includes("policy")) {
    return {
      analysis: "Esta consulta está relacionada a políticas de inovação. Preparei dados de amostra para políticas de inovação que podem ser adicionados à sua base de dados.",
      tables: ["ani_innovation_policies"],
      insertStatements: [
        `INSERT INTO ani_innovation_policies (policy_name, implementation_year, policy_type, description, target_sectors, status, issuing_authority) 
        VALUES ('Estratégia Nacional para a Investigação e Inovação 2030', 2021, 'Estratégia', 'Plano estratégico de longo prazo para fortalecer o sistema nacional de inovação e alcançar 3% do PIB em investimento em I&D até 2030', ARRAY['Todos os setores'], 'active', 'Ministério da Ciência, Tecnologia e Ensino Superior')`,
        
        `INSERT INTO ani_innovation_policies (policy_name, implementation_year, policy_type, description, target_sectors, status, issuing_authority) 
        VALUES ('Incentivos Fiscais para I&D (SIFIDE II)', 2014, 'Incentivo Fiscal', 'Sistema de incentivos fiscais para atividades de I&D empresarial, permitindo deduções fiscais de até 82,5% das despesas em investigação', ARRAY['Todos os setores empresariais'], 'active', 'Ministério da Economia')`,
        
        `INSERT INTO ani_innovation_policies (policy_name, implementation_year, policy_type, description, target_sectors, status, issuing_authority) 
        VALUES ('Portugal 2020 - Sistema de Incentivos à Inovação', 2014, 'Programa de Financiamento', 'Programa de apoio financeiro para projetos de inovação empresarial, com foco em novos produtos, processos e expansão internacional', ARRAY['Indústria', 'Serviços', 'Comércio'], 'completed', 'Agência para o Desenvolvimento e Inovação')`,
        
        `INSERT INTO ani_innovation_policies (policy_name, implementation_year, policy_type, description, target_sectors, status, issuing_authority) 
        VALUES ('Programa Startup Portugal', 2016, 'Programa de Apoio', 'Estratégia nacional para o empreendedorismo, incluindo medidas de financiamento, mentoria e simplificação administrativa para startups', ARRAY['Startups', 'Tecnologia'], 'active', 'Ministério da Economia')`,
        
        `INSERT INTO ani_innovation_policies (policy_name, implementation_year, policy_type, description, target_sectors, status, issuing_authority) 
        VALUES ('Agenda de Inovação para a Agricultura 2030', 2020, 'Estratégia Setorial', 'Plano para modernização e aumento da competitividade do setor agrícola português através da digitalização e práticas sustentáveis', ARRAY['Agricultura', 'Agroindústria'], 'active', 'Ministério da Agricultura')`,
        
        `INSERT INTO ani_innovation_policies (policy_name, implementation_year, policy_type, description, target_sectors, status, issuing_authority) 
        VALUES ('Lei de Propriedade Industrial (revisão)', 2018, 'Legislação', 'Revisão do código de propriedade industrial para fortalecer a proteção de patentes, marcas e desenhos industriais', ARRAY['Todos os setores'], 'active', 'Instituto Nacional de Propriedade Industrial')`,
        
        `INSERT INTO ani_innovation_policies (policy_name, implementation_year, policy_type, description, target_sectors, status, issuing_authority) 
        VALUES ('Estratégia Portugal Espaço 2030', 2019, 'Estratégia Setorial', 'Plano para desenvolver o setor espacial português e posicionar Portugal como hub de inovação espacial', ARRAY['Aeroespacial', 'Telecomunicações', 'Observação da Terra'], 'active', 'Agência Espacial Portuguesa')`,
        
        `INSERT INTO ani_innovation_policies (policy_name, implementation_year, policy_type, description, target_sectors, status, issuing_authority) 
        VALUES ('Programa Indústria 4.0', 2017, 'Programa de Transformação', 'Iniciativa para promover a transformação digital da indústria portuguesa e adaptar o tecido empresarial à quarta revolução industrial', ARRAY['Indústria', 'Manufatura'], 'active', 'Ministério da Economia')`
      ],
      expectedResults: "8 registros sobre políticas de inovação em Portugal, incluindo tipo, setores-alvo e status."
    };
  }
  // 6. Publicações de pesquisa
  else if (queryLower.includes("publicação") || queryLower.includes("pesquisa") || queryLower.includes("artigo") || queryLower.includes("publication") || queryLower.includes("research")) {
    return {
      analysis: "Esta consulta está relacionada a publicações acadêmicas e pesquisa. Preparei dados de amostra para publicações de pesquisa que podem ser adicionados à sua base de dados.",
      tables: ["ani_research_publications"],
      insertStatements: [
        `INSERT INTO ani_research_publications (title, authors, publication_date, journal, institution, research_area, citation_count, impact_factor, is_open_access) 
        VALUES ('Advances in Portuguese Natural Language Processing using Transformer Models', ARRAY['Silva, Maria', 'Santos, João', 'Ferreira, Ana'], '2023-03-15', 'Computational Linguistics Journal', 'Universidade de Lisboa', 'Inteligência Artificial', 48, 3.8, true)`,
        
        `INSERT INTO ani_research_publications (title, authors, publication_date, journal, institution, research_area, citation_count, impact_factor, is_open_access) 
        VALUES ('Novel Materials for Hydrogen Storage: A Portuguese Research Initiative', ARRAY['Oliveira, António', 'Costa, Sofia', 'Rodrigues, Pedro'], '2022-09-22', 'Advanced Materials Science', 'Universidade do Porto', 'Materiais Avançados', 76, 4.2, false)`,
        
        `INSERT INTO ani_research_publications (title, authors, publication_date, journal, institution, research_area, citation_count, impact_factor, is_open_access) 
        VALUES ('Marine Biodiversity Assessment of the Portuguese Atlantic Coast', ARRAY['Martins, Carlos', 'Silva, Teresa', 'Almeida, Ricardo'], '2023-01-10', 'Marine Biology International', 'Universidade dos Açores', 'Biologia Marinha', 34, 3.5, true)`,
        
        `INSERT INTO ani_research_publications (title, authors, publication_date, journal, institution, research_area, citation_count, impact_factor, is_open_access) 
        VALUES ('Blockchain Applications in Supply Chain Management: A Case Study from Portuguese Industry', ARRAY['Fernandes, José', 'Correia, Luísa'], '2022-11-05', 'Journal of Business Technology', 'Instituto Superior Técnico', 'Tecnologia de Negócios', 52, 3.1, false)`,
        
        `INSERT INTO ani_research_publications (title, authors, publication_date, journal, institution, research_area, citation_count, impact_factor, is_open_access) 
        VALUES ('Development of a Novel Machine Learning Algorithm for Cancer Detection', ARRAY['Pereira, Manuel', 'Santos, Catarina', 'Vieira, Francisco'], '2023-04-02', 'Medical AI Research', 'Universidade de Coimbra', 'Medicina/IA', 87, 4.9, true)`,
        
        `INSERT INTO ani_research_publications (title, authors, publication_date, journal, institution, research_area, citation_count, impact_factor, is_open_access) 
        VALUES ('Sustainable Viticulture Practices in Douro Valley: Impact on Wine Quality and Environmental Footprint', ARRAY['Costa, Miguel', 'Lopes, Ana', 'Rodrigues, João'], '2022-08-15', 'Journal of Sustainable Agriculture', 'Universidade de Trás-os-Montes e Alto Douro', 'Agricultura Sustentável', 29, 2.8, false)`,
        
        `INSERT INTO ani_research_publications (title, authors, publication_date, journal, institution, research_area, citation_count, impact_factor, is_open_access) 
        VALUES ('Architectural Heritage Preservation Using Digital Twins: A Portuguese Case Study', ARRAY['Sousa, Ana', 'Pinto, Carlos'], '2023-02-28', 'Digital Heritage Journal', 'Universidade do Minho', 'Preservação Digital', 31, 2.5, true)`,
        
        `INSERT INTO ani_research_publications (title, authors, publication_date, journal, institution, research_area, citation_count, impact_factor, is_open_access) 
        VALUES ('Neuromorphic Computing for Energy-Efficient AI Applications', ARRAY['Ribeiro, Paulo', 'Marques, Sofia', 'Gonçalves, André'], '2023-05-10', 'IEEE Journal of Artificial Intelligence', 'Instituto de Telecomunicações', 'Computação Neuromórfica', 64, 5.2, false)`,
        
        `INSERT INTO ani_research_publications (title, authors, publication_date, journal, institution, research_area, citation_count, impact_factor, is_open_access) 
        VALUES ('Climate Change Impact on Portuguese Coastal Regions: Projection Models and Adaptation Strategies', ARRAY['Carvalho, Marta', 'Rodrigues, Tiago'], '2022-10-18', 'Environmental Science and Policy', 'Universidade Nova de Lisboa', 'Ciências Ambientais', 73, 4.1, true)`,
        
        `INSERT INTO ani_research_publications (title, authors, publication_date, journal, institution, research_area, citation_count, impact_factor, is_open_access) 
        VALUES ('Social Innovation Ecosystems in Rural Portugal: Challenges and Opportunities', ARRAY['Alves, Joana', 'Castro, Ricardo', 'Gomes, Inês'], '2023-03-30', 'Journal of Social Innovation', 'ISCTE - Instituto Universitário de Lisboa', 'Inovação Social', 27, 2.3, true)`
      ],
      expectedResults: "10 registros sobre publicações acadêmicas de pesquisadores portugueses em diversas áreas de pesquisa."
    };
  }
  // Default case for other types of queries
  else {
    return {
      analysis: "Analisei sua consulta e preparei alguns dados de amostra genéricos que podem ser úteis para testar sua base de dados.",
      tables: ["ani_metrics", "ani_projects"],
      insertStatements: [
        `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
        VALUES ('Investimento em I&D', 'financiamento', 1500000000, 'Nacional', '2023-12-31', 'Total de investimento em I&D em Portugal', 'EUR')`,
        
        `INSERT INTO ani_projects (title, description, funding_amount, status, sector, region, organization) 
        VALUES ('Projeto Demonstrativo', 'Um projeto de exemplo para demonstrar funcionalidades', 500000, 'Active', 'Geral', 'Nacional', 'Organização Exemplo')`
      ],
      expectedResults: "Dados de amostra para fins de demonstração."
    };
  }
}

async function analyzeUserQuery(queryText: string) {
  try {
    console.log("Analyzing query:", queryText);
    
    // First, use the mock analysis for quick response
    const mockAnalysis = generateSampleAnalysis(queryText);
    
    // In a real system, we might call to an AI service here for deeper analysis
    // For now, we'll just use the mock analysis
    
    return mockAnalysis;
  } catch (error) {
    console.error("Error analyzing query:", error);
    return {
      analysis: "Ocorreu um erro ao analisar sua consulta.",
      tables: [],
      insertStatements: [],
      expectedResults: "Erro na análise."
    };
  }
}

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
        JSON.stringify({ error: 'No query provided' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    console.log('Received query for analysis:', query);

    const analysisResult = await analyzeUserQuery(query);

    return new Response(
      JSON.stringify(analysisResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
