
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// These values will be defined but not used since we're using mock data
const googleApiKey = Deno.env.get('GEMINI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock responses for development and testing
const mockResponses: Record<string, any> = {
  // Original 5 mock responses with expanded results
  "Quais são as fontes de dados mais recentes?": {
    sqlQuery: "SELECT * FROM fontes_dados ORDER BY data_importacao DESC LIMIT 15",
    results: [
      { id: 1, nome_sistema: "Sistema Nacional de Inovação", descricao: "Dados de inovação nacional", tecnologia: "PostgreSQL", entidade: "Ministério da Ciência", data_importacao: "2024-03-15" },
      { id: 2, nome_sistema: "Plataforma de Patentes PT", descricao: "Registro de patentes", tecnologia: "MongoDB", entidade: "INPI", data_importacao: "2024-03-10" },
      { id: 3, nome_sistema: "Research.PT", descricao: "Publicações científicas", tecnologia: "ElasticSearch", entidade: "FCT", data_importacao: "2024-03-05" },
      { id: 4, nome_sistema: "Portal de Dados Abertos", descricao: "Dados governamentais abertos", tecnologia: "PostgreSQL", entidade: "AMA", data_importacao: "2024-02-28" },
      { id: 5, nome_sistema: "Observatório da Inovação", descricao: "Métricas de inovação", tecnologia: "MySQL", entidade: "ANI", data_importacao: "2024-02-25" },
      { id: 6, nome_sistema: "Base de Startups", descricao: "Diretório de startups", tecnologia: "MongoDB", entidade: "Startup Portugal", data_importacao: "2024-02-20" },
      { id: 7, nome_sistema: "Biblioteca Digital Científica", descricao: "Repositório de artigos científicos", tecnologia: "ElasticSearch", entidade: "RCAAP", data_importacao: "2024-02-15" },
      { id: 8, nome_sistema: "Banco de Projetos Financiados", descricao: "Dados de financiamento", tecnologia: "PostgreSQL", entidade: "FCT", data_importacao: "2024-02-10" },
      { id: 9, nome_sistema: "Sistema de Informação Tecnológica", descricao: "Base de conhecimento tecnológico", tecnologia: "Oracle", entidade: "ITSector", data_importacao: "2024-02-05" },
      { id: 10, nome_sistema: "Cadastro de Propriedade Intelectual", descricao: "Registros de PI", tecnologia: "SQL Server", entidade: "INPI", data_importacao: "2024-01-30" }
    ],
    explanation: "Esta consulta retorna as fontes de dados mais recentes, ordenadas pela data de importação em ordem decrescente."
  },
  "Liste as instituições que trabalham com tecnologia": {
    sqlQuery: "SELECT * FROM instituicoes WHERE area_atividade LIKE '%tecnologia%' OR outros_detalhes LIKE '%tecnologia%'",
    results: [
      { id: 1, nome_instituicao: "Instituto Superior Técnico", localizacao: "Lisboa", area_atividade: "Ensino e Pesquisa em Tecnologia", outros_detalhes: "Fundado em 1911" },
      { id: 2, nome_instituicao: "Universidade do Porto", localizacao: "Porto", area_atividade: "Ensino Superior, Tecnologia", outros_detalhes: "Polo de tecnologia e inovação" },
      { id: 3, nome_instituicao: "INESC TEC", localizacao: "Porto", area_atividade: "Pesquisa em Tecnologia", outros_detalhes: "Centro de excelência em engenharia" },
      { id: 4, nome_instituicao: "Instituto Pedro Nunes", localizacao: "Coimbra", area_atividade: "Incubadora de Tecnologia", outros_detalhes: "Incubadora de base tecnológica" },
      { id: 5, nome_instituicao: "Universidade do Minho", localizacao: "Braga", area_atividade: "Tecnologia e Engenharia", outros_detalhes: "Campus de Azurém" },
      { id: 6, nome_instituicao: "FEUP", localizacao: "Porto", area_atividade: "Engenharia e Tecnologia", outros_detalhes: "Faculdade de Engenharia" },
      { id: 7, nome_instituicao: "Universidade Nova de Lisboa", localizacao: "Lisboa", area_atividade: "Tecnologia e Ciências", outros_detalhes: "FCT NOVA" },
      { id: 8, nome_instituicao: "ISCTE-IUL", localizacao: "Lisboa", area_atividade: "Tecnologia e Gestão", outros_detalhes: "Instituto Universitário de Lisboa" },
      { id: 9, nome_instituicao: "IT - Instituto de Telecomunicações", localizacao: "Nacional", area_atividade: "Pesquisa em Tecnologia", outros_detalhes: "Laboratório Associado" },
      { id: 10, nome_instituicao: "Fraunhofer Portugal", localizacao: "Porto", area_atividade: "Tecnologia Aplicada", outros_detalhes: "Centro de investigação aplicada" },
      { id: 11, nome_instituicao: "Taguspark", localizacao: "Oeiras", area_atividade: "Parque de Tecnologia", outros_detalhes: "Parque de ciência e tecnologia" },
      { id: 12, nome_instituicao: "UPTEC", localizacao: "Porto", area_atividade: "Parque de Tecnologia", outros_detalhes: "Parque de Ciência e Tecnologia da Universidade do Porto" }
    ],
    explanation: "Esta consulta filtra instituições cuja área de atividade ou outros detalhes incluem a palavra 'tecnologia'."
  },
  "Quantos documentos foram extraídos no último mês?": {
    sqlQuery: "SELECT COUNT(*) as total, tipo_documento, entidade_origem FROM documentos_extraidos WHERE data_extracao >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND data_extracao < DATE_TRUNC('month', CURRENT_DATE) GROUP BY tipo_documento, entidade_origem ORDER BY total DESC",
    results: [
      { total: 89, tipo_documento: "Artigo Científico", entidade_origem: "Universidades" },
      { total: 67, tipo_documento: "Patente", entidade_origem: "INPI" },
      { total: 43, tipo_documento: "Relatório Técnico", entidade_origem: "Empresas" },
      { total: 38, tipo_documento: "Tese", entidade_origem: "Repositórios Acadêmicos" },
      { total: 29, tipo_documento: "White Paper", entidade_origem: "Empresas Tecnológicas" },
      { total: 24, tipo_documento: "Manual Técnico", entidade_origem: "Indústria" },
      { total: 18, tipo_documento: "Estudo de Caso", entidade_origem: "Consultorias" },
      { total: 15, tipo_documento: "Monografia", entidade_origem: "Bibliotecas Digitais" },
      { total: 12, tipo_documento: "Publicação Oficial", entidade_origem: "Entidades Governamentais" },
      { total: 9, tipo_documento: "Guia de Boas Práticas", entidade_origem: "Associações Setoriais" }
    ],
    explanation: "Esta consulta conta o número de documentos extraídos no mês anterior ao atual, agrupados por tipo de documento e entidade de origem."
  },
  "Qual é o volume total de financiamento de projetos em Lisboa?": {
    sqlQuery: "SELECT project_type, sector, SUM(funding_amount) as total_funding FROM ani_projects WHERE region = 'Lisboa' GROUP BY project_type, sector ORDER BY total_funding DESC",
    results: [
      { project_type: "Investigação Aplicada", sector: "Saúde", total_funding: 7800000 },
      { project_type: "Desenvolvimento Experimental", sector: "Tecnologia", total_funding: 6500000 },
      { project_type: "Inovação Empresarial", sector: "Energia", total_funding: 4200000 },
      { project_type: "Investigação Fundamental", sector: "Biotecnologia", total_funding: 3800000 },
      { project_type: "Transferência de Tecnologia", sector: "Indústria", total_funding: 2700000 },
      { project_type: "Prova de Conceito", sector: "Tecnologia", total_funding: 2100000 },
      { project_type: "Desenvolvimento de Produto", sector: "Agroalimentar", total_funding: 1900000 },
      { project_type: "Mobilidade Internacional", sector: "Educação", total_funding: 1600000 },
      { project_type: "Investigação Colaborativa", sector: "Ambiente", total_funding: 1500000 },
      { project_type: "Infraestruturas Científicas", sector: "Multissetorial", total_funding: 1400000 }
    ],
    explanation: "Esta consulta soma o valor total de financiamento para projetos na região de Lisboa, agrupados por tipo de projeto e setor."
  },
  "Mostre as cooperações internacionais ativas": {
    sqlQuery: "SELECT * FROM ani_international_collaborations WHERE end_date > CURRENT_DATE ORDER BY start_date DESC",
    results: [
      { id: 1, program_name: "Horizonte Europa", country: "França", partnership_type: "Pesquisa", start_date: "2023-01-15", end_date: "2025-12-31", total_budget: 3500000, focus_areas: "Energia renovável" },
      { id: 2, program_name: "Erasmus+", country: "Alemanha", partnership_type: "Educação", start_date: "2023-06-01", end_date: "2026-05-31", total_budget: 1200000, focus_areas: "Intercâmbio acadêmico" },
      { id: 3, program_name: "MIT Portugal", country: "Estados Unidos", partnership_type: "Pesquisa e Desenvolvimento", start_date: "2022-09-01", end_date: "2024-08-31", total_budget: 4800000, focus_areas: "Computação avançada" },
      { id: 4, program_name: "Cooperação Portugal-Brasil", country: "Brasil", partnership_type: "Inovação", start_date: "2023-03-15", end_date: "2025-03-14", total_budget: 2100000, focus_areas: "Bioeconomia" },
      { id: 5, program_name: "Programa Ibérico de Ciência", country: "Espanha", partnership_type: "Pesquisa", start_date: "2022-11-10", end_date: "2025-11-09", total_budget: 1800000, focus_areas: "Alterações climáticas" },
      { id: 6, program_name: "EIT Digital", country: "Holanda", partnership_type: "Inovação Digital", start_date: "2023-01-01", end_date: "2024-12-31", total_budget: 2300000, focus_areas: "Transformação digital" },
      { id: 7, program_name: "InnovFin", country: "Luxemburgo", partnership_type: "Financiamento", start_date: "2022-07-01", end_date: "2026-06-30", total_budget: 5000000, focus_areas: "Financiamento à inovação" },
      { id: 8, program_name: "EUREKA", country: "Múltiplos", partnership_type: "Inovação Empresarial", start_date: "2023-04-01", end_date: "2027-03-31", total_budget: 3200000, focus_areas: "Tecnologias emergentes" },
      { id: 9, program_name: "Portugal-China STI", country: "China", partnership_type: "Pesquisa", start_date: "2022-10-15", end_date: "2025-10-14", total_budget: 2700000, focus_areas: "Nanotecnologia" },
      { id: 10, program_name: "Nordic Innovation Hub", country: "Suécia", partnership_type: "Empreendedorismo", start_date: "2023-02-01", end_date: "2026-01-31", total_budget: 1500000, focus_areas: "Indústria limpa" },
      { id: 11, program_name: "Portugal-Índia Tech Alliance", country: "Índia", partnership_type: "Tecnologia", start_date: "2023-05-15", end_date: "2025-05-14", total_budget: 1900000, focus_areas: "Software e serviços" },
      { id: 12, program_name: "Atlantic Innovation Bridge", country: "Canadá", partnership_type: "Pesquisa Oceânica", start_date: "2022-12-01", end_date: "2024-11-30", total_budget: 2500000, focus_areas: "Economia azul" }
    ],
    explanation: "Esta consulta filtra as cooperações internacionais cuja data de término é posterior à data atual, ou seja, ainda estão ativas."
  },
  
  // New mock responses with expanded results
  "Quais universidades publicaram mais artigos científicos em 2023?": {
    sqlQuery: "SELECT institution, COUNT(*) as publication_count, AVG(citation_count) as avg_citations, AVG(impact_factor) as avg_impact_factor FROM ani_research_publications WHERE EXTRACT(YEAR FROM publication_date) = 2023 GROUP BY institution ORDER BY publication_count DESC LIMIT 15",
    results: [
      { institution: "Universidade de Lisboa", publication_count: 427, avg_citations: 18.3, avg_impact_factor: 3.7 },
      { institution: "Universidade do Porto", publication_count: 392, avg_citations: 16.8, avg_impact_factor: 3.5 },
      { institution: "Universidade de Coimbra", publication_count: 286, avg_citations: 15.2, avg_impact_factor: 3.2 },
      { institution: "Universidade Nova de Lisboa", publication_count: 245, avg_citations: 17.5, avg_impact_factor: 3.8 },
      { institution: "Universidade do Minho", publication_count: 213, avg_citations: 14.6, avg_impact_factor: 3.0 },
      { institution: "Instituto Superior Técnico", publication_count: 198, avg_citations: 19.2, avg_impact_factor: 4.1 },
      { institution: "Universidade de Aveiro", publication_count: 176, avg_citations: 13.9, avg_impact_factor: 3.1 },
      { institution: "Universidade Católica Portuguesa", publication_count: 142, avg_citations: 12.7, avg_impact_factor: 2.9 },
      { institution: "ISCTE-IUL", publication_count: 127, avg_citations: 10.5, avg_impact_factor: 2.6 },
      { institution: "Universidade do Algarve", publication_count: 112, avg_citations: 11.8, avg_impact_factor: 2.8 },
      { institution: "Universidade de Trás-os-Montes e Alto Douro", publication_count: 98, avg_citations: 9.4, avg_impact_factor: 2.5 },
      { institution: "Universidade da Beira Interior", publication_count: 87, avg_citations: 8.9, avg_impact_factor: 2.4 },
      { institution: "Universidade dos Açores", publication_count: 76, avg_citations: 9.1, avg_impact_factor: 2.7 },
      { institution: "Universidade de Évora", publication_count: 72, avg_citations: 8.7, avg_impact_factor: 2.6 },
      { institution: "ISPA - Instituto Universitário", publication_count: 65, avg_citations: 11.2, avg_impact_factor: 3.0 }
    ],
    explanation: "Esta consulta retorna as universidades com maior número de publicações científicas em 2023, ordenadas pelo número de publicações, incluindo também a média de citações e fator de impacto."
  },
  "Qual foi o crescimento do investimento em I&D nos últimos 5 anos?": {
    sqlQuery: "SELECT EXTRACT(YEAR FROM measurement_date) as year, SUM(value) as total_investment, COALESCE(ROUND((SUM(value) - LAG(SUM(value)) OVER (ORDER BY EXTRACT(YEAR FROM measurement_date))) / LAG(SUM(value)) OVER (ORDER BY EXTRACT(YEAR FROM measurement_date)) * 100, 1), 0) as growth_percentage, sector FROM ani_metrics WHERE category = 'financiamento' AND name = 'Investimento em I&D' AND measurement_date >= CURRENT_DATE - INTERVAL '5 years' GROUP BY year, sector ORDER BY year, sector",
    results: [
      { year: 2019, total_investment: 2800000000, growth_percentage: 0, sector: "Global" },
      { year: 2019, total_investment: 1200000000, growth_percentage: 0, sector: "Público" },
      { year: 2019, total_investment: 1600000000, growth_percentage: 0, sector: "Privado" },
      { year: 2020, total_investment: 3100000000, growth_percentage: 10.7, sector: "Global" },
      { year: 2020, total_investment: 1320000000, growth_percentage: 10.0, sector: "Público" },
      { year: 2020, total_investment: 1780000000, growth_percentage: 11.3, sector: "Privado" },
      { year: 2021, total_investment: 3350000000, growth_percentage: 8.1, sector: "Global" },
      { year: 2021, total_investment: 1390000000, growth_percentage: 5.3, sector: "Público" },
      { year: 2021, total_investment: 1960000000, growth_percentage: 10.1, sector: "Privado" },
      { year: 2022, total_investment: 3680000000, growth_percentage: 9.9, sector: "Global" },
      { year: 2022, total_investment: 1450000000, growth_percentage: 4.3, sector: "Público" },
      { year: 2022, total_investment: 2230000000, growth_percentage: 13.8, sector: "Privado" },
      { year: 2023, total_investment: 4120000000, growth_percentage: 12.0, sector: "Global" },
      { year: 2023, total_investment: 1560000000, growth_percentage: 7.6, sector: "Público" },
      { year: 2023, total_investment: 2560000000, growth_percentage: 14.8, sector: "Privado" }
    ],
    explanation: "Esta consulta calcula o investimento total anual em Investigação e Desenvolvimento nos últimos 5 anos, discriminado por setor (público e privado), mostrando também a percentagem de crescimento anual."
  },
  "Qual setor tem o maior número de patentes registradas?": {
    sqlQuery: "SELECT sector, SUM(patent_count) as total_patents, COUNT(DISTINCT organization_name) as organization_count, ROUND(AVG(innovation_index), 1) as avg_innovation_index FROM ani_patent_holders GROUP BY sector ORDER BY total_patents DESC",
    results: [
      { sector: "Tecnologia", total_patents: 485, organization_count: 37, avg_innovation_index: 7.8 },
      { sector: "Educação e Pesquisa", total_patents: 382, organization_count: 42, avg_innovation_index: 7.5 },
      { sector: "Farmacêutica", total_patents: 276, organization_count: 21, avg_innovation_index: 8.2 },
      { sector: "Biotecnologia", total_patents: 231, organization_count: 18, avg_innovation_index: 8.0 },
      { sector: "Empresarial", total_patents: 195, organization_count: 29, avg_innovation_index: 7.3 },
      { sector: "Química", total_patents: 187, organization_count: 15, avg_innovation_index: 7.7 },
      { sector: "Saúde", total_patents: 176, organization_count: 23, avg_innovation_index: 7.9 },
      { sector: "Engenharia", total_patents: 168, organization_count: 20, avg_innovation_index: 7.6 },
      { sector: "Energia", total_patents: 153, organization_count: 14, avg_innovation_index: 7.8 },
      { sector: "Materiais", total_patents: 142, organization_count: 12, avg_innovation_index: 7.5 },
      { sector: "Telecomunicações", total_patents: 134, organization_count: 8, avg_innovation_index: 8.1 },
      { sector: "Automação", total_patents: 127, organization_count: 10, avg_innovation_index: 7.4 },
      { sector: "Agroindustrial", total_patents: 112, organization_count: 16, avg_innovation_index: 6.9 },
      { sector: "Manufatura", total_patents: 105, organization_count: 19, avg_innovation_index: 6.8 },
      { sector: "Eletrônica", total_patents: 98, organization_count: 11, avg_innovation_index: 7.7 }
    ],
    explanation: "Esta consulta agrupa as patentes por setor e retorna os setores com maior número de patentes registradas, mostrando também o número de organizações em cada setor e o índice médio de inovação."
  },
  "Quais são as startups que receberam mais financiamento em 2023?": {
    sqlQuery: "SELECT name, funding_raised, sector, region, employees_count, founding_year FROM ani_startups WHERE EXTRACT(YEAR FROM funding_date) = 2023 ORDER BY funding_raised DESC LIMIT 15",
    results: [
      { name: "GreenPower Solutions", funding_raised: 8500000, sector: "Energia", region: "Lisboa", employees_count: 42, founding_year: 2020 },
      { name: "HealthTech AI", funding_raised: 7200000, sector: "Saúde", region: "Porto", employees_count: 38, founding_year: 2019 },
      { name: "SmartFarming Portugal", funding_raised: 6800000, sector: "Agrotech", region: "Alentejo", employees_count: 45, founding_year: 2018 },
      { name: "CyberDefense Systems", funding_raised: 5300000, sector: "Cibersegurança", region: "Lisboa", employees_count: 31, founding_year: 2021 },
      { name: "Ocean Plastics Recovery", funding_raised: 4700000, sector: "Ambiente", region: "Algarve", employees_count: 29, founding_year: 2019 },
      { name: "Quantum Computing PT", funding_raised: 4500000, sector: "Tecnologia", region: "Coimbra", employees_count: 27, founding_year: 2020 },
      { name: "BioSolutions", funding_raised: 4200000, sector: "Biotecnologia", region: "Porto", employees_count: 33, founding_year: 2018 },
      { name: "Smart Cities Lab", funding_raised: 3900000, sector: "Urbanismo", region: "Lisboa", employees_count: 26, founding_year: 2019 },
      { name: "FinTech Nova", funding_raised: 3700000, sector: "Finanças", region: "Lisboa", employees_count: 24, founding_year: 2020 },
      { name: "Renewable Materials", funding_raised: 3500000, sector: "Materiais", region: "Aveiro", employees_count: 28, founding_year: 2019 },
      { name: "AR Education", funding_raised: 3200000, sector: "Educação", region: "Porto", employees_count: 22, founding_year: 2021 },
      { name: "Portuguese Space Tech", funding_raised: 3100000, sector: "Aeroespacial", region: "Lisboa", employees_count: 19, founding_year: 2020 },
      { name: "Digital Commerce Solutions", funding_raised: 2900000, sector: "E-commerce", region: "Braga", employees_count: 25, founding_year: 2018 },
      { name: "MedDevice Innovations", funding_raised: 2800000, sector: "Dispositivos Médicos", region: "Coimbra", employees_count: 21, founding_year: 2019 },
      { name: "Mobility Future", funding_raised: 2600000, sector: "Mobilidade", region: "Lisboa", employees_count: 23, founding_year: 2020 }
    ],
    explanation: "Esta consulta retorna as startups que receberam maior financiamento em 2023, ordenadas pelo valor recebido, incluindo informações adicionais como setor, região, número de funcionários e ano de fundação."
  },
  "Qual é a distribuição regional dos projetos de inovação?": {
    sqlQuery: "SELECT region, COUNT(*) as project_count, SUM(funding_amount) as total_funding, ROUND(AVG(funding_amount)) as avg_funding, COUNT(DISTINCT organization) as organization_count, STRING_AGG(DISTINCT sector, ', ' ORDER BY sector) as sectors FROM ani_projects GROUP BY region ORDER BY project_count DESC",
    results: [
      { region: "Lisboa", project_count: 342, total_funding: 289500000, avg_funding: 846491, organization_count: 78, sectors: "Aeroespacial, Energia, Saúde, Tecnologia, Transportes" },
      { region: "Porto", project_count: 287, total_funding: 214300000, avg_funding: 746690, organization_count: 65, sectors: "Biotecnologia, Energia, Materiais, Saúde, Tecnologia" },
      { region: "Coimbra", project_count: 156, total_funding: 127800000, avg_funding: 819231, organization_count: 43, sectors: "Biotecnologia, Educação, Saúde, Tecnologia" },
      { region: "Braga", project_count: 124, total_funding: 98500000, avg_funding: 794355, organization_count: 37, sectors: "Eletrônica, Materiais, Tecnologia, Têxtil" },
      { region: "Aveiro", project_count: 98, total_funding: 76200000, avg_funding: 777551, organization_count: 31, sectors: "Cerâmica, Materiais, Química, Tecnologia" },
      { region: "Algarve", project_count: 67, total_funding: 52400000, avg_funding: 782090, organization_count: 24, sectors: "Ambiente, Mar, Turismo" },
      { region: "Leiria", project_count: 58, total_funding: 43700000, avg_funding: 753448, organization_count: 22, sectors: "Indústria, Materiais, Moldes" },
      { region: "Setúbal", project_count: 52, total_funding: 39800000, avg_funding: 765385, organization_count: 19, sectors: "Energia, Indústria, Mar" },
      { region: "Alentejo", project_count: 48, total_funding: 36300000, avg_funding: 756250, organization_count: 18, sectors: "Agricultura, Agroalimentar, Ambiente" },
      { region: "Viseu", project_count: 42, total_funding: 31500000, avg_funding: 750000, organization_count: 16, sectors: "Indústria, Tecnologia, Vinícola" },
      { region: "Madeira", project_count: 36, total_funding: 27800000, avg_funding: 772222, organization_count: 14, sectors: "Mar, Tecnologia, Turismo" },
      { region: "Açores", project_count: 32, total_funding: 24900000, avg_funding: 778125, organization_count: 12, sectors: "Ambiente, Mar, Tecnologia, Turismo" },
      { region: "Vila Real", project_count: 28, total_funding: 21200000, avg_funding: 757143, organization_count: 11, sectors: "Agricultura, Vinícola" },
      { region: "Bragança", project_count: 25, total_funding: 18700000, avg_funding: 748000, organization_count: 9, sectors: "Agricultura, Ambiente, Tecnologia" },
      { region: "Outros", project_count: 94, total_funding: 72600000, avg_funding: 772340, organization_count: 32, sectors: "Diversos" }
    ],
    explanation: "Esta consulta agrupa os projetos de inovação por região e retorna a contagem de projetos, financiamento total e médio, número de organizações e setores envolvidos em cada região."
  },
  "Quais áreas de pesquisa têm maior taxa de citação?": {
    sqlQuery: "SELECT research_area, COUNT(*) as publication_count, AVG(citation_count) as avg_citations, MAX(citation_count) as max_citations, AVG(impact_factor) as avg_impact_factor, STRING_AGG(DISTINCT institution, ', ' ORDER BY institution LIMIT 3) as top_institutions FROM ani_research_publications GROUP BY research_area ORDER BY avg_citations DESC LIMIT 15",
    results: [
      { research_area: "Medicina/IA", publication_count: 87, avg_citations: 76.3, max_citations: 312, avg_impact_factor: 4.9, top_institutions: "Universidade de Coimbra, Universidade de Lisboa, Universidade do Porto" },
      { research_area: "Materiais Avançados", publication_count: 104, avg_citations: 68.7, max_citations: 287, avg_impact_factor: 4.3, top_institutions: "Instituto Superior Técnico, Universidade de Aveiro, Universidade do Minho" },
      { research_area: "Computação Quântica", publication_count: 56, avg_citations: 62.1, max_citations: 245, avg_impact_factor: 5.1, top_institutions: "Instituto Superior Técnico, Universidade de Lisboa, Universidade do Porto" },
      { research_area: "Energia Renovável", publication_count: 118, avg_citations: 54.9, max_citations: 218, avg_impact_factor: 4.1, top_institutions: "INESC TEC, Instituto Superior Técnico, Universidade de Lisboa" },
      { research_area: "Neurociência", publication_count: 93, avg_citations: 52.8, max_citations: 203, avg_impact_factor: 4.5, top_institutions: "Champalimaud Foundation, Universidade de Coimbra, Universidade de Lisboa" },
      { research_area: "Genética", publication_count: 86, avg_citations: 51.3, max_citations: 197, avg_impact_factor: 4.7, top_institutions: "IGC, Universidade de Lisboa, Universidade do Porto" },
      { research_area: "Inteligência Artificial", publication_count: 142, avg_citations: 49.7, max_citations: 185, avg_impact_factor: 4.2, top_institutions: "Instituto Superior Técnico, Universidade de Coimbra, Universidade do Porto" },
      { research_area: "Nanotecnologia", publication_count: 79, avg_citations: 47.5, max_citations: 178, avg_impact_factor: 4.3, top_institutions: "INL, Universidade de Aveiro, Universidade Nova de Lisboa" },
      { research_area: "Biotecnologia", publication_count: 95, avg_citations: 45.8, max_citations: 169, avg_impact_factor: 4.0, top_institutions: "iBET, IGC, Universidade Nova de Lisboa" },
      { research_area: "Ciências Oceânicas", publication_count: 108, avg_citations: 43.2, max_citations: 162, avg_impact_factor: 3.8, top_institutions: "CIIMAR, Universidade dos Açores, Universidade do Algarve" },
      { research_area: "Física de Partículas", publication_count: 67, avg_citations: 42.1, max_citations: 156, avg_impact_factor: 5.0, top_institutions: "Instituto Superior Técnico, LIP, Universidade de Coimbra" },
      { research_area: "Mudanças Climáticas", publication_count: 113, avg_citations: 41.5, max_citations: 153, avg_impact_factor: 4.2, top_institutions: "Instituto Dom Luiz, Universidade de Lisboa, Universidade de Aveiro" },
      { research_area: "Imunologia", publication_count: 81, avg_citations: 39.3, max_citations: 147, avg_impact_factor: 4.1, top_institutions: "IGC, Universidade de Lisboa, Universidade do Porto" },
      { research_area: "Robótica", publication_count: 73, avg_citations: 38.6, max_citations: 141, avg_impact_factor: 3.9, top_institutions: "Instituto Superior Técnico, Universidade de Coimbra, Universidade do Porto" },
      { research_area: "Química Computacional", publication_count: 64, avg_citations: 37.4, max_citations: 138, avg_impact_factor: 3.8, top_institutions: "Universidade de Coimbra, Universidade de Lisboa, Universidade do Porto" }
    ],
    explanation: "Esta consulta calcula a média de citações por área de pesquisa e retorna as áreas com maior taxa média de citação, incluindo contagem de publicações, máximo de citações, fator de impacto médio e principais instituições."
  },
  "Quais políticas de inovação foram mais eficazes nos últimos 3 anos?": {
    sqlQuery: "SELECT policy_name, implementation_year, policy_type, (impact_metrics->>'success_rate')::numeric as success_rate, (impact_metrics->>'roi')::numeric as roi, (impact_metrics->>'adoption_rate')::numeric as adoption_rate, STRING_AGG(target_sectors::text, ', ') as target_sectors FROM ani_innovation_policies WHERE implementation_year >= EXTRACT(YEAR FROM CURRENT_DATE) - 3 ORDER BY (impact_metrics->>'success_rate')::numeric DESC LIMIT 12",
    results: [
      { policy_name: "Programa Startups Portugal+", implementation_year: 2022, policy_type: "Programa de Apoio", success_rate: 87.5, roi: 3.4, adoption_rate: 78.2, target_sectors: "Startups, Tecnologia" },
      { policy_name: "Incentivos Fiscais para I&D (SIFIDE II)", implementation_year: 2021, policy_type: "Incentivo Fiscal", success_rate: 82.3, roi: 4.1, adoption_rate: 73.5, target_sectors: "Todos os setores empresariais" },
      { policy_name: "Estratégia Portugal Espaço 2030", implementation_year: 2021, policy_type: "Estratégia Setorial", success_rate: 79.1, roi: 2.8, adoption_rate: 68.7, target_sectors: "Aeroespacial, Telecomunicações, Observação da Terra" },
      { policy_name: "Plano de Transformação Digital das PMEs", implementation_year: 2022, policy_type: "Programa de Transformação", success_rate: 76.4, roi: 3.2, adoption_rate: 71.9, target_sectors: "PMEs, Todos os setores" },
      { policy_name: "Agenda de Inovação para a Agricultura 2030", implementation_year: 2022, policy_type: "Estratégia Setorial", success_rate: 74.8, roi: 2.9, adoption_rate: 67.3, target_sectors: "Agricultura, Agroindústria" },
      { policy_name: "Laboratórios Colaborativos", implementation_year: 2021, policy_type: "Programa de Colaboração", success_rate: 73.2, roi: 2.7, adoption_rate: 65.8, target_sectors: "Investigação, Indústria" },
      { policy_name: "Vale Indústria 4.0", implementation_year: 2022, policy_type: "Incentivo Financeiro", success_rate: 72.1, roi: 3.0, adoption_rate: 69.4, target_sectors: "Indústria, Manufatura" },
      { policy_name: "Estratégia Nacional de Computação Avançada", implementation_year: 2021, policy_type: "Estratégia", success_rate: 71.5, roi: 2.5, adoption_rate: 64.2, target_sectors: "Computação, Investigação, Tecnologia" },
      { policy_name: "Programa Interface Empresas-Ciência", implementation_year: 2022, policy_type: "Programa de Colaboração", success_rate: 70.8, roi: 2.8, adoption_rate: 66.7, target_sectors: "Empresas, Universidades, Centros de Investigação" },
      { policy_name: "Incentivos à Economia Circular", implementation_year: 2021, policy_type: "Incentivo", success_rate: 69.3, roi: 2.6, adoption_rate: 63.5, target_sectors: "Ambiente, Indústria, Energia" },
      { policy_name: "Programa Nacional de Aceleração de Startups", implementation_year: 2023, policy_type: "Programa de Aceleração", success_rate: 68.7, roi: 2.3, adoption_rate: 62.9, target_sectors: "Startups, Tecnologia" },
      { policy_name: "Medidas de Apoio à Descarbonização", implementation_year: 2022, policy_type: "Incentivo", success_rate: 67.9, roi: 2.4, adoption_rate: 61.2, target_sectors: "Energia, Indústria, Transportes" }
    ],
    explanation: "Esta consulta retorna as políticas de inovação implementadas nos últimos 3 anos com maior taxa de sucesso, incluindo também o retorno sobre investimento (ROI) e taxa de adoção."
  },
  "Qual foi o impacto das parcerias internacionais no número de publicações científicas?": {
    sqlQuery: "WITH international_collab AS (SELECT country, COUNT(*) as collab_count, SUM(total_budget) as total_investment FROM ani_international_collaborations GROUP BY country) SELECT ic.country, ic.collab_count, ic.total_investment, COUNT(rp.id) as publication_count, ROUND(COUNT(rp.id)::numeric / ic.collab_count, 2) as publications_per_collab, ROUND(AVG(rp.citation_count), 1) as avg_citations, ROUND(AVG(rp.impact_factor), 2) as avg_impact_factor FROM international_collab ic LEFT JOIN ani_research_publications rp ON rp.authors @> ARRAY[ic.country] GROUP BY ic.country, ic.collab_count, ic.total_investment ORDER BY publication_count DESC LIMIT 15",
    results: [
      { country: "Estados Unidos", collab_count: 38, total_investment: 92400000, publication_count: 312, publications_per_collab: 8.21, avg_citations: 48.7, avg_impact_factor: 4.32 },
      { country: "Alemanha", collab_count: 29, total_investment: 71300000, publication_count: 276, publications_per_collab: 9.52, avg_citations: 46.3, avg_impact_factor: 4.18 },
      { country: "Reino Unido", collab_count: 31, total_investment: 68700000, publication_count: 241, publications_per_collab: 7.77, avg_citations: 44.9, avg_impact_factor: 4.26 },
      { country: "França", collab_count: 27, total_investment: 59200000, publication_count: 218, publications_per_collab: 8.07, avg_citations: 42.1, avg_impact_factor: 4.03 },
      { country: "Espanha", collab_count: 33, total_investment: 64500000, publication_count: 205, publications_per_collab: 6.21, avg_citations: 38.4, avg_impact_factor: 3.87 },
      { country: "Itália", collab_count: 25, total_investment: 53700000, publication_count: 187, publications_per_collab: 7.48, avg_citations: 37.2, avg_impact_factor: 3.91 },
      { country: "Holanda", collab_count: 22, total_investment: 49800000, publication_count: 163, publications_per_collab: 7.41, avg_citations: 40.8, avg_impact_factor: 4.15 },
      { country: "Suécia", collab_count: 19, total_investment: 43500000, publication_count: 142, publications_per_collab: 7.47, avg_citations: 41.3, avg_impact_factor: 4.21 },
      { country: "Suíça", collab_count: 17, total_investment: 39800000, publication_count: 138, publications_per_collab: 8.12, avg_citations: 43.7, avg_impact_factor: 4.33 },
      { country: "Bélgica", collab_count: 18, total_investment: 37200000, publication_count: 127, publications_per_collab: 7.06, avg_citations: 38.5, avg_impact_factor: 3.95 },
      { country: "Canadá", collab_count: 16, total_investment: 36900000, publication_count: 119, publications_per_collab: 7.44, avg_citations: 39.2, avg_impact_factor: 4.08 },
      { country: "Brasil", collab_count: 23, total_investment: 43100000, publication_count: 116, publications_per_collab: 5.04, avg_citations: 32.7, avg_impact_factor: 3.65 },
      { country: "China", collab_count: 15, total_investment: 34600000, publication_count: 103, publications_per_collab: 6.87, avg_citations: 36.9, avg_impact_factor: 3.98 },
      { country: "Japão", collab_count: 12, total_investment: 28700000, publication_count: 87, publications_per_collab: 7.25, avg_citations: 35.4, avg_impact_factor: 3.86 },
      { country: "Austrália", collab_count: 11, total_investment: 26400000, publication_count: 81, publications_per_collab: 7.36, avg_citations: 37.8, avg_impact_factor: 4.01 }
    ],
    explanation: "Esta consulta analisa a relação entre colaborações internacionais e publicações científicas, mostrando os países com maior número de publicações conjuntas com Portugal, incluindo investimento total, média de citações, e publicações por colaboração."
  },
  "Quais são as redes de inovação com maior taxa de crescimento de membros?": {
    sqlQuery: "SELECT network_name, founding_year, member_count, ROUND((member_count::numeric / NULLIF(CURRENT_DATE - founding_date, 0)) * 365, 2) as members_per_year, geographic_scope, STRING_AGG(DISTINCT focus_areas::text, ', ') as focus_areas, STRING_AGG(DISTINCT key_partners::text, ', ' LIMIT 3) as key_partners, achievements FROM ani_innovation_networks ORDER BY members_per_year DESC LIMIT 12",
    results: [
      { network_name: "Hub de Inovação de Lisboa", founding_year: 2016, member_count: 124, members_per_year: 15.5, geographic_scope: "Regional - Lisboa", focus_areas: "Smart Cities, Mobilidade, Energia", key_partners: "Câmara Municipal de Lisboa, Universidade de Lisboa, EDP Inovação", achievements: "Lançamento de 35 startups, 12 patentes registadas, €25M em financiamento angariado" },
      { network_name: "Digital Porto Alliance", founding_year: 2017, member_count: 94, members_per_year: 13.4, geographic_scope: "Regional - Porto", focus_areas: "Software, Cibersegurança, E-commerce", key_partners: "Porto Digital, UPTEC, INESC TEC", achievements: "Criação de 45 novas empresas, €18M em investimento externo, 350 novos postos de trabalho" },
      { network_name: "Rede Nacional de Inovação em Saúde", founding_year: 2018, member_count: 87, members_per_year: 12.9, geographic_scope: "Nacional", focus_areas: "Dispositivos Médicos, Telemedicina, Biotecnologia", key_partners: "Ministério da Saúde, Universidade do Porto, Hospitais Centrais", achievements: "Desenvolvimento de 8 dispositivos médicos inovadores, 5 ensaios clínicos, €15M em financiamento de I&D" },
      { network_name: "Portugal Tech Alliance", founding_year: 2020, member_count: 76, members_per_year: 12.1, geographic_scope: "Nacional", focus_areas: "Tecnologia, Startups, Digital", key_partners: "Startup Portugal, IAPMEI, Portugal Ventures", achievements: "Apoio a 52 startups, captação de €22M em investimento internacional, 8 programas de aceleração" },
      { network_name: "Portugal Blue Economy", founding_year: 2019, member_count: 56, members_per_year: 11.2, geographic_scope: "Nacional", focus_areas: "Economia do Mar, Aquacultura, Portos Inteligentes", key_partners: "IPMA, Universidade dos Açores, Administração dos Portos", achievements: "Implementação de 3 projetos-piloto de aquacultura sustentável, €7M em investimento internacional" },
      { network_name: "Smart Energy Network", founding_year: 2021, member_count: 43, members_per_year: 10.8, geographic_scope: "Nacional", focus_areas: "Energia Renovável, Eficiência Energética, Redes Inteligentes", key_partners: "ADENE, EDP, Universidade de Lisboa", achievements: "Desenvolvimento de 7 projetos-piloto de redes inteligentes, redução de 12% no consumo energético" },
      { network_name: "Blockchain Portugal Network", founding_year: 2021, member_count: 41, members_per_year: 10.3, geographic_scope: "Nacional", focus_areas: "Blockchain, Criptomoedas, Contratos Inteligentes", key_partners: "IST, Banco de Portugal, empresas tecnológicas", achievements: "Criação de 5 soluções blockchain para administração pública, formação de 150 programadores" },
      { network_name: "Circular Economy Hub", founding_year: 2020, member_count: 52, members_per_year: 9.8, geographic_scope: "Nacional", focus_areas: "Economia Circular, Sustentabilidade, Gestão de Resíduos", key_partners: "APA, LNEG, empresas de reciclagem", achievements: "Implementação de 10 projetos de economia circular, redução de 8% nos resíduos industriais" },
      { network_name: "AgriTech Portugal", founding_year: 2019, member_count: 48, members_per_year: 9.6, geographic_scope: "Nacional", focus_areas: "Agricultura de Precisão, Tecnologia Agrícola, IoT", key_partners: "Ministério da Agricultura, INIAV, Associações Agrícolas", achievements: "Aumento de 15% na produtividade agrícola, redução de 20% no consumo de água, 8 patentes" },
      { network_name: "Cluster Têxtil de Portugal", founding_year: 2008, member_count: 132, members_per_year: 8.8, geographic_scope: "Regional - Norte", focus_areas: "Têxteis Técnicos, Moda Sustentável, Indústria 4.0", key_partners: "CITEVE, Universidade do Minho, Associação Têxtil", achievements: "Exportações aumentadas em 30%, 15 patentes de novos materiais, 12 projetos de internacionalização" },
      { network_name: "Tourism Innovation Network", founding_year: 2018, member_count: 58, members_per_year: 8.6, geographic_scope: "Nacional", focus_areas: "Turismo Digital, Sustentabilidade, Experiências Turísticas", key_partners: "Turismo de Portugal, AHRESP, Escolas de Hotelaria", achievements: "Desenvolvimento de 12 soluções digitais para turismo, aumento de 18% na satisfação dos turistas" },
      { network_name: "Rede Agroalimentar do Alentejo", founding_year: 2015, member_count: 76, members_per_year: 7.9, geographic_scope: "Regional - Alentejo", focus_areas: "Agricultura de Precisão, Produtos Regionais, Sustentabilidade", key_partners: "INIAV, Universidade de Évora, Cooperativas Agrícolas", achievements: "Aumento de 25% na produtividade, 8 novos produtos certificados, €5M em projetos de inovação" }
    ],
    explanation: "Esta consulta calcula a taxa de crescimento anual das redes de inovação dividindo o número atual de membros pelo tempo desde a fundação, mostrando também o escopo geográfico, áreas de foco, principais parceiros e realizações."
  },
  "Quantos projetos de inovação foram aprovados por instituição no último ano?": {
    sqlQuery: "SELECT i.institution_name, COUNT(p.id) as approved_projects, SUM(p.funding_amount) as total_funding, ROUND(AVG(p.funding_amount)) as avg_funding, STRING_AGG(DISTINCT p.sector, ', ' ORDER BY p.sector) as sectors, COUNT(DISTINCT p.project_type) as project_types FROM ani_institutions i LEFT JOIN ani_projects p ON i.id = p.institution_id WHERE p.status = 'approved' AND p.start_date >= CURRENT_DATE - INTERVAL '1 year' GROUP BY i.institution_name ORDER BY approved_projects DESC LIMIT 12",
    results: [
      { institution_name: "Universidade de Lisboa", approved_projects: 42, total_funding: 37500000, avg_funding: 892857, sectors: "Biotecnologia, Energia, Saúde, Tecnologia", project_types: 5 },
      { institution_name: "Universidade do Porto", approved_projects: 38, total_funding: 32700000, avg_funding: 860526, sectors: "Energia, Materiais, Saúde, Tecnologia", project_types: 4 },
      { institution_name: "Instituto Superior Técnico", approved_projects: 35, total_funding: 31200000, avg_funding: 891429, sectors: "Energia, Física, Materiais, Tecnologia", project_types: 5 },
      { institution_name: "Universidade de Coimbra", approved_projects: 31, total_funding: 26800000, avg_funding: 864516, sectors: "Biotecnologia, Química, Saúde, Tecnologia", project_types: 4 },
      { institution_name: "INESC TEC", approved_projects: 27, total_funding: 23400000, avg_funding: 866667, sectors: "Energia, Robótica, Tecnologia", project_types: 3 },
      { institution_name: "Universidade do Minho", approved_projects: 24, total_funding: 20500000, avg_funding: 854167, sectors: "Materiais, Nanotecnologia, Têxtil", project_types: 3 },
      { institution_name: "Universidade Nova de Lisboa", approved_projects: 23, total_funding: 19800000, avg_funding: 860870, sectors: "Ambiente, Economia, Tecnologia", project_types: 4 },
      { institution_name: "Instituto Pedro Nunes", approved_projects: 18, total_funding: 15300000, avg_funding: 850000, sectors: "Empreendedorismo, Tecnologia", project_types: 3 },
      { institution_name: "INEGI", approved_projects: 16, total_funding: 13700000, avg_funding: 856250, sectors: "Energia, Materiais, Mecânica", project_types: 3 },
      { institution_name: "Universidade de Aveiro", approved_projects: 15, total_funding: 12900000, avg_funding: 860000, sectors: "Cerâmica, Materiais, Telecomunicações", project_types: 3 },
      { institution_name: "Instituto Gulbenkian de Ciência", approved_projects: 14, total_funding: 12200000, avg_funding: 871429, sectors: "Biologia, Genética, Saúde", project_types: 2 },
      { institution_name: "ITQB NOVA", approved_projects: 13, total_funding: 11200000, avg_funding: 861538, sectors: "Biotecnologia, Química", project_types: 2 }
    ],
    explanation: "Esta consulta retorna as instituições com maior número de projetos de inovação aprovados no último ano, incluindo financiamento total e médio, setores envolvidos e tipos de projetos."
  },
  "Quais tecnologias emergentes têm maior potencial de adoção segundo os estudos?": {
    sqlQuery: "SELECT technology_name, adoption_rate, STRING_AGG(benefits::text, ', ') as benefits, STRING_AGG(challenges::text, ', ') as challenges, sector, region FROM ani_tech_adoption WHERE measurement_year = 2023 ORDER BY adoption_rate DESC LIMIT 12",
    results: [
      { technology_name: "Inteligência Artificial", adoption_rate: 78.3, benefits: "Automatização de processos, Análise preditiva, Personalização", challenges: "Escassez de talentos, Questões éticas, Custo de implementação", sector: "Tecnologia", region: "Nacional" },
      { technology_name: "Cloud Computing", adoption_rate: 76.5, benefits: "Escalabilidade, Redução de custos, Flexibilidade", challenges: "Segurança de dados, Dependência de provedores, Latência", sector: "Serviços", region: "Nacional" },
      { technology_name: "Internet das Coisas", adoption_rate: 67.2, benefits: "Conectividade, Monitoramento em tempo real, Eficiência operacional", challenges: "Segurança, Integração com sistemas legados, Privacidade", sector: "Indústria", region: "Nacional" },
      { technology_name: "Big Data Analytics", adoption_rate: 63.8, benefits: "Insights de negócio, Tomada de decisão baseada em dados, Detecção de padrões", challenges: "Complexidade técnica, Volume de dados, Qualidade dos dados", sector: "Finanças", region: "Nacional" },
      { technology_name: "Automação de Processos Robóticos", adoption_rate: 57.4, benefits: "Redução de erros, Aumento de produtividade, Processos padronizados", challenges: "Resistência à mudança, Limitações técnicas, Custo inicial", sector: "Serviços", region: "Nacional" },
      { technology_name: "Blockchain", adoption_rate: 45.7, benefits: "Segurança, Transparência, Rastreabilidade", challenges: "Escalabilidade, Consumo de energia, Regulamentação", sector: "Finanças", region: "Nacional" },
      { technology_name: "Realidade Aumentada/Virtual", adoption_rate: 43.2, benefits: "Experiências imersivas, Treinamento, Visualização", challenges: "Hardware especializado, Conteúdo limitado, Curva de aprendizado", sector: "Educação", region: "Nacional" },
      { technology_name: "Impressão 3D", adoption_rate: 41.8, benefits: "Prototipagem rápida, Personalização, Produção sob demanda", challenges: "Materiais limitados, Velocidade, Precisão", sector: "Manufatura", region: "Nacional" },
      { technology_name: "5G", adoption_rate: 38.5, benefits: "Alta velocidade, Baixa latência, Maior densidade de conexão", challenges: "Infraestrutura, Cobertura, Investimento", sector: "Telecomunicações", region: "Nacional" },
      { technology_name: "Computação Quântica", adoption_rate: 16.3, benefits: "Processamento exponencial, Otimização complexa, Criptografia avançada", challenges: "Tecnologia emergente, Custo proibitivo, Conhecimento especializado", sector: "Pesquisa", region: "Nacional" },
      { technology_name: "Veículos Autônomos", adoption_rate: 15.7, benefits: "Segurança rodoviária, Eficiência logística, Redução de congestionamentos", challenges: "Regulamentação, Infraestrutura, Aceitação pública", sector: "Transporte", region: "Nacional" },
      { technology_name: "Biometria Avançada", adoption_rate: 32.6, benefits: "Segurança aprimorada, Autenticação sem contato, Conveniência", challenges: "Privacidade, Falsos positivos/negativos, Custos", sector: "Segurança", region: "Nacional" }
    ],
    explanation: "Esta consulta retorna as tecnologias emergentes com maior taxa de adoção prevista em 2023, juntamente com seus principais benefícios e desafios por setor."
  },
  "Qual é a relação entre investimento em I&D e número de patentes por região?": {
    sqlQuery: "WITH rd_investment AS (SELECT region, SUM(value) as total_investment FROM ani_metrics WHERE category = 'financiamento' AND name = 'Investimento em I&D' GROUP BY region), patents AS (SELECT region, COUNT(*) as patent_count FROM ani_patent_holders ph JOIN ani_institutions i ON ph.institution_id = i.id GROUP BY region) SELECT r.region, r.total_investment, COALESCE(p.patent_count, 0) as patent_count, ROUND((COALESCE(p.patent_count, 0)::numeric / NULLIF(r.total_investment, 0)) * 1000000, 2) as patents_per_million_eur, COALESCE((SELECT COUNT(*) FROM ani_institutions WHERE region = r.region), 0) as institution_count FROM rd_investment r LEFT JOIN patents p ON r.region = p.region ORDER BY patents_per_million_eur DESC LIMIT 12",
    results: [
      { region: "Aveiro", total_investment: 280000000, patent_count: 76, patents_per_million_eur: 0.271, institution_count: 8 },
      { region: "Braga", total_investment: 350000000, patent_count: 94, patents_per_million_eur: 0.269, institution_count: 7 },
      { region: "Coimbra", total_investment: 450000000, patent_count: 112, patents_per_million_eur: 0.249, institution_count: 9 },
      { region: "Porto", total_investment: 800000000, patent_count: 187, patents_per_million_eur: 0.234, institution_count: 14 },
      { region: "Lisboa", total_investment: 1200000000, patent_count: 258, patents_per_million_eur: 0.215, institution_count: 21 },
      { region: "Setúbal", total_investment: 150000000, patent_count: 31, patents_per_million_eur: 0.207, institution_count: 4 },
      { region: "Leiria", total_investment: 120000000, patent_count: 24, patents_per_million_eur: 0.200, institution_count: 3 },
      { region: "Minho", total_investment: 220000000, patent_count: 42, patents_per_million_eur: 0.191, institution_count: 5 },
      { region: "Algarve", total_investment: 130000000, patent_count: 23, patents_per_million_eur: 0.177, institution_count: 3 },
      { region: "Évora", total_investment: 90000000, patent_count: 15, patents_per_million_eur: 0.167, institution_count: 2 },
      { region: "Beira Interior", total_investment: 70000000, patent_count: 11, patents_per_million_eur: 0.157, institution_count: 2 },
      { region: "Trás-os-Montes", total_investment: 60000000, patent_count: 9, patents_per_million_eur: 0.150, institution_count: 2 }
    ],
    explanation: "Esta consulta analisa a relação entre o investimento total em I&D e o número de patentes registradas por região, calculando o número de patentes por milhão de euros investidos e o número de instituições em cada região."
  },
  "Quais são os pesquisadores com maior índice h em Portugal?": {
    sqlQuery: "SELECT name, specialization, institution, h_index, citation_count, publication_count, (SELECT COUNT(*) FROM ani_research_publications WHERE authors @> ARRAY[name]) as recent_publications, awards, international_recognition FROM ani_researchers ORDER BY h_index DESC LIMIT 15",
    results: [
      { name: "António Coutinho", specialization: "Imunologia", institution: "Instituto Gulbenkian de Ciência", h_index: 89, citation_count: 34500, publication_count: 312, recent_publications: 15, awards: "Ordem de Sant'Iago da Espada, Prémio Pessoa", international_recognition: "Membro da EMBO, Academia Europaea" },
      { name: "Maria João Saraiva", specialization: "Neurociência", institution: "Universidade do Porto", h_index: 85, citation_count: 32100, publication_count: 287, recent_publications: 12, awards: "Prémio Bial, Medalha de Mérito Científico", international_recognition: "Academia Europaea, Academia de Ciências de Lisboa" },
      { name: "Carlos Fiolhais", specialization: "Física", institution: "Universidade de Coimbra", h_index: 82, citation_count: 30700, publication_count: 275, recent_publications: 9, awards: "Ordem do Infante D. Henrique, Prémio Ciência Viva", international_recognition: "Academia das Ciências de Lisboa, Sociedade Portuguesa de Física" },
      { name: "Manuel Sobrinho Simões", specialization: "Patologia", institution: "Universidade do Porto", h_index: 79, citation_count: 29200, publication_count: 267, recent_publications: 7, awards: "Ordem da Liberdade, Prémio Gulbenkian de Ciência", international_recognition: "Academia Europaea, International Academy of Pathology" },
      { name: "Arlindo Oliveira", specialization: "Informática", institution: "Instituto Superior Técnico", h_index: 76, citation_count: 27800, publication_count: 251, recent_publications: 14, awards: "Prémio UTL/Santander, Medalha de Mérito da Ordem dos Engenheiros", international_recognition: "IEEE Fellow, ACM Senior Member" },
      { name: "Ricardo Reis", specialization: "Economia", institution: "Universidade de Lisboa", h_index: 72, citation_count: 26500, publication_count: 238, recent_publications: 11, awards: "Prémio Jacinto Nunes, Bancgor Prize", international_recognition: "American Economic Association, Research Fellow CEPR" },
      { name: "Alexandre Quintanilha", specialization: "Biofísica", institution: "Universidade do Porto", h_index: 71, citation_count: 25900, publication_count: 232, recent_publications: 6, awards: "Ordem de Santiago da Espada, Grande-Oficial da Ordem do Infante D. Henrique", international_recognition: "Academia Europaea, EMBO" },
      { name: "Elvira Fortunato", specialization: "Nanotecnologia", institution: "Universidade Nova de Lisboa", h_index: 70, citation_count: 25200, publication_count: 228, recent_publications: 18, awards: "European Research Council Advanced Grant, Prémio Pessoa", international_recognition: "Academia Europaea, European Innovation Council" },
      { name: "Miguel Poiares Maduro", specialization: "Direito", institution: "Universidade Católica Portuguesa", h_index: 68, citation_count: 24100, publication_count: 215, recent_publications: 10, awards: "Prémio Gulbenkian de Ciência, Comendador da Ordem do Infante D. Henrique", international_recognition: "American Society of International Law, European Law Institute" },
      { name: "Leonor Parreira", specialization: "Hematologia", institution: "Universidade de Lisboa", h_index: 67, citation_count: 23800, publication_count: 207, recent_publications: 8, awards: "Medalha de Mérito da Ordem dos Médicos, Prémio Bial", international_recognition: "European Hematology Association, Academia Europaea" },
      { name: "João Lobo Antunes", specialization: "Neurocirurgia", institution: "Universidade de Lisboa", h_index: 65, citation_count: 22900, publication_count: 198, recent_publications: 5, awards: "Grã-Cruz da Ordem de Santiago da Espada, Prémio Pessoa", international_recognition: "Academia Europaea, World Academy of Neurological Surgery" },
      { name: "José Pereira Leal", specialization: "Bioinformática", institution: "Instituto Gulbenkian de Ciência", h_index: 64, citation_count: 22100, publication_count: 193, recent_publications: 13, awards: "Prémio António Xavier, European Research Council Starting Grant", international_recognition: "International Society for Computational Biology, EMBO" },
      { name: "Maria Mota", specialization: "Parasitologia", institution: "Instituto de Medicina Molecular", h_index: 63, citation_count: 21800, publication_count: 187, recent_publications: 16, awards: "Prémio Pfizer, European Research Council Consolidator Grant", international_recognition: "EMBO, Academia Europaea" },
      { name: "Nuno Sebastião", specialization: "Engenharia Informática", institution: "Instituto Superior Técnico", h_index: 62, citation_count: 21200, publication_count: 183, recent_publications: 9, awards: "Prémio Jovem Engenheiro, IEEE Early Career Award", international_recognition: "IEEE Senior Member, ACM Member" },
      { name: "Adriano Moreira", specialization: "Computação Móvel", institution: "Universidade do Minho", h_index: 61, citation_count: 20700, publication_count: 178, recent_publications: 12, awards: "Prémio Estímulo à Excelência, Best Paper Award MobiSys", international_recognition: "IEEE Communications Society, ACM SIGMOBILE" }
    ],
    explanation: "Esta consulta retorna os pesquisadores com maior índice h em Portugal, uma métrica que mede tanto a produtividade quanto o impacto das citações de suas publicações acadêmicas, incluindo também contagem de citações, publicações recentes e reconhecimento internacional."
  },
  "Quais áreas de especialização têm maior número de instituições em Portugal?": {
    sqlQuery: "SELECT unnest(specialization_areas) as area, COUNT(*) as institution_count, STRING_AGG(DISTINCT name, ', ' ORDER BY name LIMIT 3) as top_institutions, ROUND(AVG(foundation_year)) as avg_foundation_year, COUNT(DISTINCT region) as regions_count FROM ani_institutions GROUP BY area ORDER BY institution_count DESC LIMIT 15",
    results: [
      { area: "Engenharia", institution_count: 42, top_institutions: "Faculdade de Engenharia da Universidade do Porto, Instituto Superior Técnico, Universidade do Minho", avg_foundation_year: 1927, regions_count: 11 },
      { area: "Ciências da Computação", institution_count: 38, top_institutions: "INESC TEC, Instituto Superior Técnico, Universidade de Coimbra", avg_foundation_year: 1956, regions_count: 9 },
      { area: "Ciências da Saúde", institution_count: 35, top_institutions: "Faculdade de Medicina da Universidade de Lisboa, Instituto de Medicina Molecular, Universidade do Porto", avg_foundation_year: 1911, regions_count: 8 },
      { area: "Ciências Sociais", institution_count: 33, top_institutions: "ISCTE-IUL, Universidade de Coimbra, Universidade de Lisboa", avg_foundation_year: 1931, regions_count: 10 },
      { area: "Ciências Naturais", institution_count: 31, top_institutions: "Faculdade de Ciências da Universidade de Lisboa, Instituto de Investigação do Mar, Universidade de Aveiro", avg_foundation_year: 1903, regions_count: 9 },
      { area: "Economia e Gestão", institution_count: 29, top_institutions: "Católica Lisbon, ISEG, Nova SBE", avg_foundation_year: 1949, regions_count: 7 },
      { area: "Artes e Humanidades", institution_count: 27, top_institutions: "Faculdade de Letras da Universidade de Lisboa, Universidade Católica Portuguesa, Universidade Nova de Lisboa", avg_foundation_year: 1918, regions_count: 6 },
      { area: "Agricultura e Ciências Ambientais", institution_count: 23, top_institutions: "Instituto Superior de Agronomia, Universidade de Évora, Universidade de Trás-os-Montes e Alto Douro", avg_foundation_year: 1934, regions_count: 8 },
      { area: "Biotecnologia", institution_count: 21, top_institutions: "iBET, Instituto Gulbenkian de Ciência, ITQB NOVA", avg_foundation_year: 1972, regions_count: 5 },
      { area: "Física", institution_count: 19, top_institutions: "Faculdade de Ciências da Universidade de Lisboa, Instituto Superior Técnico, LIP", avg_foundation_year: 1937, regions_count: 6 },
      { area: "Química", institution_count: 18, top_institutions: "CICECO, Instituto de Tecnologia Química e Biológica, Universidade de Aveiro", avg_foundation_year: 1945, regions_count: 7 },
      { area: "Direito", institution_count: 17, top_institutions: "Faculdade de Direito da Universidade de Coimbra, Faculdade de Direito da Universidade de Lisboa, Universidade Católica Portuguesa", avg_foundation_year: 1913, regions_count: 5 },
      { area: "Arquitetura e Urbanismo", institution_count: 15, top_institutions: "Faculdade de Arquitetura da Universidade de Lisboa, Faculdade de Arquitetura da Universidade do Porto, Universidade de Coimbra", avg_foundation_year: 1942, regions_count: 4 },
      { area: "Psicologia", institution_count: 14, top_institutions: "Faculdade de Psicologia da Universidade de Lisboa, ISPA - Instituto Universitário, Universidade do Minho", avg_foundation_year: 1962, regions_count: 6 },
      { area: "Telecomunicações", institution_count: 13, top_institutions: "Instituto de Telecomunicações, Instituto Superior Técnico, Universidade de Aveiro", avg_foundation_year: 1974, regions_count: 4 }
    ],
    explanation: "Esta consulta expande as áreas de especialização de todas as instituições e retorna as áreas com maior número de instituições em Portugal, incluindo as principais instituições em cada área, ano médio de fundação e número de regiões onde estão presentes."
  },
  "Quais são os países com maior número de colaborações com Portugal em projetos de inovação?": {
    sqlQuery: "SELECT country, COUNT(*) as collaboration_count, SUM(total_budget) as total_budget, ROUND(AVG(total_budget)) as avg_budget, STRING_AGG(DISTINCT partnership_type, ', ') as partnership_types, STRING_AGG(DISTINCT focus_areas, ', ' ORDER BY focus_areas) as focus_areas, COUNT(DISTINCT program_name) as distinct_programs FROM ani_international_collaborations GROUP BY country ORDER BY collaboration_count DESC LIMIT 15",
    results: [
      { country: "Espanha", collaboration_count: 47, total_budget: 68500000, avg_budget: 1457447, partnership_types: "Pesquisa, Inovação, Educação, Tecnologia", focus_areas: "Agricultura, Energia renovável, Mar, Tecnologia digital", distinct_programs: 12 },
      { country: "França", collaboration_count: 38, total_budget: 52300000, avg_budget: 1376316, partnership_types: "Pesquisa, Desenvolvimento, Tecnologia, Inovação", focus_areas: "Aeroespacial, Energia, Materiais avançados, Transformação digital", distinct_programs: 10 },
      { country: "Alemanha", collaboration_count: 32, total_budget: 64700000, avg_budget: 2021875, partnership_types: "Pesquisa, Indústria, Tecnologia, Educação", focus_areas: "Indústria 4.0, Inteligência Artificial, Materiais, Robótica", distinct_programs: 9 },
      { country: "Reino Unido", collaboration_count: 29, total_budget: 42800000, avg_budget: 1475862, partnership_types: "Pesquisa, Inovação, Educação", focus_areas: "Biotecnologia, Ciências da vida, Tecnologia financeira", distinct_programs: 8 },
      { country: "Estados Unidos", collaboration_count: 26, total_budget: 76200000, avg_budget: 2930769, partnership_types: "Pesquisa e Desenvolvimento, Tecnologia, Educação", focus_areas: "Computação avançada, Inovação tecnológica, Inteligência Artificial", distinct_programs: 7 },
      { country: "Itália", collaboration_count: 23, total_budget: 33400000, avg_budget: 1452174, partnership_types: "Pesquisa, Inovação, Cultural", focus_areas: "Agricultura, Patrimônio cultural, Turismo", distinct_programs: 8 },
      { country: "Brasil", collaboration_count: 19, total_budget: 28900000, avg_budget: 1521053, partnership_types: "Pesquisa, Inovação, Educação, Tecnologia", focus_areas: "Bioeconomia, Energias renováveis, Mar, Tecnologia digital", distinct_programs: 7 },
      { country: "Holanda", collaboration_count: 17, total_budget: 31500000, avg_budget: 1852941, partnership_types: "Pesquisa, Inovação, Tecnologia", focus_areas: "Agricultura inteligente, Mar, Sustentabilidade", distinct_programs: 6 },
      { country: "Bélgica", collaboration_count: 15, total_budget: 27800000, avg_budget: 1853333, partnership_types: "Pesquisa, Inovação, Política", focus_areas: "Energia, Inovação pública, Política de inovação", distinct_programs: 5 },
      { country: "Suécia", collaboration_count: 14, total_budget: 25600000, avg_budget: 1828571, partnership_types: "Pesquisa, Tecnologia, Inovação", focus_areas: "Cidades inteligentes, Mobilidade sustentável, Tecnologia limpa", distinct_programs: 5 },
      { country: "Suíça", collaboration_count: 13, total_budget: 29700000, avg_budget: 2284615, partnership_types: "Pesquisa, Tecnologia, Inovação", focus_areas: "Biotecnologia, Dispositivos médicos, Saúde", distinct_programs: 4 },
      { country: "China", collaboration_count: 12, total_budget: 22800000, avg_budget: 1900000, partnership_types: "Tecnologia, Comércio, Pesquisa", focus_areas: "Economia digital, Energias renováveis, Manufatura avançada", distinct_programs: 4 },
      { country: "Índia", collaboration_count: 11, total_budget: 19500000, avg_budget: 1772727, partnership_types: "Tecnologia, Pesquisa, Inovação", focus_areas: "Software, Tecnologia da informação, Transformação digital", distinct_programs: 3 },
      { country: "Canadá", collaboration_count: 10, total_budget: 18700000, avg_budget: 1870000, partnership_types: "Pesquisa, Inovação, Tecnologia", focus_areas: "Economia azul, Inteligência Artificial, Tecnologias limpas", distinct_programs: 3 },
      { country: "Irlanda", collaboration_count: 9, total_budget: 15800000, avg_budget: 1755556, partnership_types: "Tecnologia, Inovação, Pesquisa", focus_areas: "Agroalimentar, Tecnologia digital, Tecnologia financeira", distinct_programs: 4 }
    ],
    explanation: "Esta consulta retorna os países com maior número de colaborações internacionais com Portugal em projetos de inovação, juntamente com o orçamento total e médio, tipos de parceria, áreas de foco e número de programas distintos."
  },
  "Qual foi a taxa de sucesso das candidaturas a programas de financiamento por setor?": {
    sqlQuery: "SELECT sector, COUNT(*) as total_applications, SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_applications, ROUND((SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END)::numeric / COUNT(*)) * 100, 2) as success_rate, AVG(evaluation_score) as avg_score, AVG(CASE WHEN status = 'approved' THEN funding_amount ELSE 0 END) as avg_approved_funding, AVG(team_size) as avg_team_size FROM ani_funding_applications GROUP BY sector ORDER BY success_rate DESC LIMIT 15",
    results: [
      { sector: "Saúde", total_applications: 187, approved_applications: 94, success_rate: 50.27, avg_score: 78.4, avg_approved_funding: 785000, avg_team_size: 8.3 },
      { sector: "Tecnologia da Informação", total_applications: 234, approved_applications: 115, success_rate: 49.15, avg_score: 77.9, avg_approved_funding: 720000, avg_team_size: 7.8 },
      { sector: "Energia Renovável", total_applications: 168, approved_applications: 82, success_rate: 48.81, avg_score: 77.2, avg_approved_funding: 810000, avg_team_size: 7.5 },
      { sector: "Biotecnologia", total_applications: 143, approved_applications: 68, success_rate: 47.55, avg_score: 76.8, avg_approved_funding: 850000, avg_team_size: 8.1 },
      { sector: "Materiais Avançados", total_applications: 127, approved_applications: 59, success_rate: 46.46, avg_score: 76.3, avg_approved_funding: 795000, avg_team_size: 7.7 },
      { sector: "Agricultura", total_applications: 152, approved_applications: 69, success_rate: 45.39, avg_score: 75.6, avg_approved_funding: 690000, avg_team_size: 6.9 },
      { sector: "Turismo", total_applications: 98, approved_applications: 43, success_rate: 43.88, avg_score: 74.3, avg_approved_funding: 580000, avg_team_size: 6.2 },
      { sector: "Indústria Transformadora", total_applications: 176, approved_applications: 75, success_rate: 42.61, avg_score: 73.8, avg_approved_funding: 740000, avg_team_size: 7.4 },
      { sector: "Mar", total_applications: 112, approved_applications: 47, success_rate: 41.96, avg_score: 73.2, avg_approved_funding: 680000, avg_team_size: 7.1 },
      { sector: "Aeroespacial", total_applications: 87, approved_applications: 36, success_rate: 41.38, avg_score: 74.7, avg_approved_funding: 920000, avg_team_size: 8.5 },
      { sector: "Transportes", total_applications: 103, approved_applications: 42, success_rate: 40.78, avg_score: 72.5, avg_approved_funding: 710000, avg_team_size: 6.8 },
      { sector: "Educação", total_applications: 117, approved_applications: 46, success_rate: 39.32, avg_score: 71.9, avg_approved_funding: 560000, avg_team_size: 6.5 },
      { sector: "Ambiente", total_applications: 128, approved_applications: 49, success_rate: 38.28, avg_score: 72.1, avg_approved_funding: 640000, avg_team_size: 7.0 },
      { sector: "Construção", total_applications: 95, approved_applications: 36, success_rate: 37.89, avg_score: 70.8, avg_approved_funding: 620000, avg_team_size: 6.7 },
      { sector: "Cultura", total_applications: 83, approved_applications: 29, success_rate: 34.94, avg_score: 69.5, avg_approved_funding: 480000, avg_team_size: 5.9 }
    ],
    explanation: "Esta consulta calcula a taxa de sucesso das candidaturas a programas de financiamento por setor, dividindo o número de candidaturas aprovadas pelo total de candidaturas, incluindo também a pontuação média de avaliação, financiamento médio aprovado e tamanho médio da equipe."
  },
  "Quais foram os programas de financiamento com maior orçamento nos últimos 3 anos?": {
    sqlQuery: "SELECT name, total_budget, start_date, end_date, funding_agency, focus_areas, eligibility_criteria, min_project_size, max_project_size, avg_project_size, success_rate FROM ani_funding_programs WHERE start_date >= CURRENT_DATE - INTERVAL '3 years' ORDER BY total_budget DESC LIMIT 12",
    results: [
      { name: "Plano de Recuperação e Resiliência - Componente Inovação", total_budget: 1250000000, start_date: "2021-06-01", end_date: "2026-12-31", funding_agency: "Governo de Portugal/UE", focus_areas: "Transformação Digital, Transição Climática, Resiliência", eligibility_criteria: "Empresas, Instituições de I&D, Entidades Públicas", min_project_size: 100000, max_project_size: 10000000, avg_project_size: 1250000, success_rate: 42.5 },
      { name: "Horizonte Europa - Participação Portuguesa", total_budget: 850000000, start_date: "2021-01-15", end_date: "2027-12-31", funding_agency: "Comissão Europeia/FCT", focus_areas: "Ciência Excelente, Desafios Globais, Inovação Europeia", eligibility_criteria: "Universidades, Empresas, Centros de Investigação", min_project_size: 200000, max_project_size: 15000000, avg_project_size: 1800000, success_rate: 18.7 },
      { name: "Portugal 2030 - Eixo Inovação e Conhecimento", total_budget: 720000000, start_date: "2022-03-10", end_date: "2030-12-31", funding_agency: "Governo de Portugal/UE", focus_areas: "Competitividade Empresarial, I&D, Digitalização", eligibility_criteria: "PMEs, Grandes Empresas, Instituições de Ensino Superior", min_project_size: 50000, max_project_size: 5000000, avg_project_size: 875000, success_rate: 38.2 },
      { name: "Programa Interface", total_budget: 520000000, start_date: "2022-01-20", end_date: "2025-12-31", funding_agency: "ANI/IAPMEI", focus_areas: "Transferência de Tecnologia, Colaboração Indústria-Academia", eligibility_criteria: "Centros Interface, Laboratórios Colaborativos, Clusters", min_project_size: 75000, max_project_size: 3000000, avg_project_size: 780000, success_rate: 45.3 },
      { name: "Programa Operacional Competitividade e Internacionalização", total_budget: 480000000, start_date: "2021-09-15", end_date: "2027-12-31", funding_agency: "COMPETE/IAPMEI", focus_areas: "Internacionalização Empresarial, Modernização Produtiva", eligibility_criteria: "PMEs, Associações Empresariais", min_project_size: 25000, max_project_size: 2500000, avg_project_size: 420000, success_rate: 52.1 },
      { name: "Fundo Ambiental - Transição Energética", total_budget: 350000000, start_date: "2022-04-01", end_date: "2025-12-31", funding_agency: "Ministério do Ambiente", focus_areas: "Descarbonização, Eficiência Energética, Energias Renováveis", eligibility_criteria: "Empresas, Municípios, Entidades Públicas", min_project_size: 30000, max_project_size: 1500000, avg_project_size: 385000, success_rate: 48.6 },
      { name: "Programa Nacional para o Empreendedorismo", total_budget: 280000000, start_date: "2021-11-15", end_date: "2026-12-31", funding_agency: "Startup Portugal/IAPMEI", focus_areas: "Startups, Incubação, Aceleração, Scale-ups", eligibility_criteria: "Startups, Incubadoras, Aceleradoras", min_project_size: 20000, max_project_size: 1000000, avg_project_size: 320000, success_rate: 37.8 },
      { name: "Programa para a Digitalização da Indústria", total_budget: 250000000, start_date: "2022-02-01", end_date: "2025-12-31", funding_agency: "Ministério da Economia", focus_areas: "Indústria 4.0, IoT, Automação, Inteligência Artificial", eligibility_criteria: "Indústria Transformadora, PMEs", min_project_size: 35000, max_project_size: 1800000, avg_project_size: 425000, success_rate: 44.2 },
      { name: "Agenda Mobilizadora para a Inovação Empresarial", total_budget: 230000000, start_date: "2022-06-15", end_date: "2027-12-31", funding_agency: "ANI/IAPMEI", focus_areas: "Consórcios Empresariais, Projetos Estruturantes", eligibility_criteria: "Consórcios de Empresas, Instituições de I&D", min_project_size: 500000, max_project_size: 8000000, avg_project_size: 2300000, success_rate: 31.5 },
      { name: "Programa de Cooperação Territorial", total_budget: 190000000, start_date: "2021-07-01", end_date: "2027-06-30", funding_agency: "Comissão Europeia/Agência Coesão", focus_areas: "Cooperação Transfronteiriça, Coesão Territorial", eligibility_criteria: "Entidades Públicas, Associações, Empresas em Regiões Fronteiriças", min_project_size: 40000, max_project_size: 1200000, avg_project_size: 380000, success_rate: 41.7 },
      { name: "Programa para a Qualificação e Investigação", total_budget: 170000000, start_date: "2021-10-01", end_date: "2026-09-30", funding_agency: "FCT/DGES", focus_areas: "Formação Avançada, Contratação de Investigadores, Doutoramentos", eligibility_criteria: "Universidades, Centros de Investigação, Laboratórios Associados", min_project_size: 15000, max_project_size: 900000, avg_project_size: 210000, success_rate: 36.9 },
      { name: "Fundo para a Inovação Social", total_budget: 150000000, start_date: "2022-01-01", end_date: "2027-12-31", funding_agency: "Portugal Inovação Social", focus_areas: "Empreendedorismo Social, Impacto Social, Inovação Social", eligibility_criteria: "Entidades da Economia Social, ONGs, Empresas Sociais", min_project_size: 10000, max_project_size: 750000, avg_project_size: 180000, success_rate: 39.4 }
    ],
    explanation: "Esta consulta retorna os programas de financiamento iniciados nos últimos 3 anos com maior orçamento total, ordenados por valor decrescente, incluindo detalhes como período de vigência, agência financiadora, áreas de foco, critérios de elegibilidade e taxas de sucesso."
  },
  "Quais são as startups com maior número de funcionários por região?": {
    sqlQuery: "WITH ranked_startups AS (SELECT name, region, employees_count, funding_raised, founding_year, sector, growth_rate, international_presence, ROW_NUMBER() OVER (PARTITION BY region ORDER BY employees_count DESC) as region_rank FROM ani_startups) SELECT name, region, employees_count, funding_raised, founding_year, sector, growth_rate, international_presence FROM ranked_startups WHERE region_rank <= 3 ORDER BY region, region_rank LIMIT 18",
    results: [
      { region: "Lisboa", name: "Talkdesk", employees_count: 1200, funding_raised: 35000000, founding_year: 2011, sector: "Tecnologia", growth_rate: 78.5, international_presence: "Europa, América do Norte, Ásia" },
      { region: "Lisboa", name: "Feedzai", employees_count: 850, funding_raised: 42500000, founding_year: 2009, sector: "Fintech", growth_rate: 65.3, international_presence: "Europa, América do Norte, Ásia-Pacífico" },
      { region: "Lisboa", name: "Unbabel", employees_count: 450, funding_raised: 31000000, founding_year: 2013, sector: "AI/Tradução", growth_rate: 52.7, international_presence: "Europa, América do Norte" },
      { region: "Porto", name: "Sword Health", employees_count: 350, funding_raised: 33700000, founding_year: 2015, sector: "Saúde", growth_rate: 87.2, international_presence: "Europa, América do Norte" },
      { region: "Porto", name: "Veniam", employees_count: 120, funding_raised: 26500000, founding_year: 2012, sector: "IoT", growth_rate: 43.8, international_presence: "Europa, América do Norte, Ásia" },
      { region: "Porto", name: "HUUB", employees_count: 120, funding_raised: 13800000, founding_year: 2015, sector: "Logística", growth_rate: 58.4, international_presence: "Europa" },
      { region: "Coimbra", name: "Critical Software", employees_count: 240, funding_raised: 18500000, founding_year: 1998, sector: "Software", growth_rate: 32.7, international_presence: "Europa, América do Norte, América do Sul" },
      { region: "Coimbra", name: "WIT Software", employees_count: 180, funding_raised: 14200000, founding_year: 2001, sector: "Software", growth_rate: 28.6, international_presence: "Europa, América do Norte, Ásia" },
      { region: "Coimbra", name: "Feedzai", employees_count: 150, funding_raised: 12600000, founding_year: 2009, sector: "Fintech", growth_rate: 42.5, international_presence: "Europa, América do Norte" },
      { region: "Braga", name: "Utrust", employees_count: 85, funding_raised: 21500000, founding_year: 2017, sector: "Blockchain", growth_rate: 92.4, international_presence: "Europa, América do Norte, Ásia" },
      { region: "Braga", name: "Acutus", employees_count: 72, funding_raised: 12800000, founding_year: 2016, sector: "Software", growth_rate: 64.2, international_presence: "Europa" },
      { region: "Braga", name: "Infraspeak", employees_count: 68, funding_raised: 9400000, founding_year: 2015, sector: "Software", growth_rate: 53.6, international_presence: "Europa, Médio Oriente" },
      { region: "Aveiro", name: "Wavecom", employees_count: 75, funding_raised: 8200000, founding_year: 2000, sector: "Telecomunicações", growth_rate: 21.4, international_presence: "Europa, África" },
      { region: "Aveiro", name: "Ubiwhere", employees_count: 68, funding_raised: 7500000, founding_year: 2007, sector: "Smart Cities", growth_rate: 35.8, international_presence: "Europa, América do Sul" },
      { region: "Aveiro", name: "Petapilot", employees_count: 52, funding_raised: 5800000, founding_year: 2009, sector: "Software", growth_rate: 29.7, international_presence: "Europa" },
      { region: "Algarve", name: "Algardata", employees_count: 65, funding_raised: 6300000, founding_year: 1991, sector: "Software", growth_rate: 18.3, international_presence: "Europa, África" },
      { region: "Algarve", name: "Dengun", employees_count: 42, funding_raised: 3200000, founding_year: 2007, sector: "Desenvolvimento Web", growth_rate: 27.4, international_presence: "Europa" },
      { region: "Algarve", name: "Algarveshare", employees_count: 34, funding_raised: 2100000, founding_year: 2016, sector: "Turismo Tech", growth_rate: 48.2, international_presence: "Europa, América do Norte" }
    ],
    explanation: "Esta consulta identifica as três startups com maior número de funcionários em cada região de Portugal, incluindo dados sobre financiamento, setor, taxa de crescimento e presença internacional."
  },
  "Como se compara o investimento em startups em Lisboa vs. Porto nos últimos 5 anos?": {
    sqlQuery: "SELECT EXTRACT(YEAR FROM measurement_date) as year, SUM(CASE WHEN region = 'Lisboa' THEN value ELSE 0 END) as lisbon_investment, SUM(CASE WHEN region = 'Porto' THEN value ELSE 0 END) as porto_investment, SUM(CASE WHEN region = 'Lisboa' THEN value ELSE 0 END) - SUM(CASE WHEN region = 'Porto' THEN value ELSE 0 END) as difference, ROUND((SUM(CASE WHEN region = 'Lisboa' THEN value ELSE 0 END) / NULLIF(SUM(CASE WHEN region = 'Porto' THEN value ELSE 0 END), 0)), 2) as ratio, SUM(CASE WHEN region = 'Lisboa' THEN startup_count ELSE 0 END) as lisbon_startups, SUM(CASE WHEN region = 'Porto' THEN startup_count ELSE 0 END) as porto_startups FROM ani_metrics WHERE category = 'financiamento' AND name = 'Investimento em Startups' AND measurement_date >= CURRENT_DATE - INTERVAL '5 years' GROUP BY year ORDER BY year",
    results: [
      { year: 2019, lisbon_investment: 120000000, porto_investment: 85000000, difference: 35000000, ratio: 1.41, lisbon_startups: 487, porto_startups: 312 },
      { year: 2020, lisbon_investment: 142000000, porto_investment: 98000000, difference: 44000000, ratio: 1.45, lisbon_startups: 523, porto_startups: 354 },
      { year: 2021, lisbon_investment: 187000000, porto_investment: 124000000, difference: 63000000, ratio: 1.51, lisbon_startups: 576, porto_startups: 395 },
      { year: 2022, lisbon_investment: 235000000, porto_investment: 156000000, difference: 79000000, ratio: 1.51, lisbon_startups: 642, porto_startups: 451 },
      { year: 2023, lisbon_investment: 298000000, porto_investment: 205000000, difference: 93000000, ratio: 1.45, lisbon_startups: 718, porto_startups: 523 },
      { year: 2024, lisbon_investment: 168000000, porto_investment: 127000000, difference: 41000000, ratio: 1.32, lisbon_startups: 754, porto_startups: 567 }
    ],
    explanation: "Esta consulta compara o investimento anual em startups nas regiões de Lisboa e Porto nos últimos 5 anos, mostrando também a diferença absoluta, a proporção entre os investimentos e o número de startups em cada região por ano."
  },
  "Qual é o perfil de publicações científicas em Portugal por área de pesquisa e status de acesso aberto?": {
    sqlQuery: "SELECT research_area, COUNT(*) as total_publications, SUM(CASE WHEN is_open_access THEN 1 ELSE 0 END) as open_access_count, ROUND((SUM(CASE WHEN is_open_access THEN 1 ELSE 0 END)::numeric / COUNT(*)) * 100, 2) as open_access_percentage, AVG(citation_count) as avg_citations, AVG(impact_factor) as avg_impact_factor, STRING_AGG(DISTINCT journal, ', ' ORDER BY journal LIMIT 3) as top_journals, STRING_AGG(DISTINCT institution, ', ' ORDER BY institution LIMIT 3) as top_institutions FROM ani_research_publications GROUP BY research_area ORDER BY total_publications DESC LIMIT 12",
    results: [
      { research_area: "Ciência da Computação", total_publications: 312, open_access_count: 187, open_access_percentage: 59.94, avg_citations: 34.8, avg_impact_factor: 3.7, top_journals: "ACM Transactions on Computing Systems, IEEE Transactions on Software Engineering, Journal of Computer Science", top_institutions: "Instituto Superior Técnico, Universidade de Coimbra, Universidade do Porto" },
      { research_area: "Ciências da Saúde", total_publications: 287, open_access_count: 203, open_access_percentage: 70.73, avg_citations: 42.6, avg_impact_factor: 4.2, top_journals: "BMJ Open, PLOS Medicine, The Lancet", top_institutions: "Faculdade de Medicina da Universidade de Lisboa, Instituto de Medicina Molecular, Universidade do Porto" },
      { research_area: "Engenharia", total_publications: 243, open_access_count: 126, open_access_percentage: 51.85, avg_citations: 28.3, avg_impact_factor: 3.4, top_journals: "Advanced Engineering Informatics, Journal of Civil Engineering, Mechanical Engineering Journal", top_institutions: "Faculdade de Engenharia da Universidade do Porto, Instituto Superior Técnico, Universidade do Minho" },
      { research_area: "Ciências Ambientais", total_publications: 198, open_access_count: 148, open_access_percentage: 74.75, avg_citations: 36.2, avg_impact_factor: 3.8, top_journals: "Environmental Science & Technology, Nature Climate Change, Science of the Total Environment", top_institutions: "Universidade de Aveiro, Universidade de Lisboa, Universidade do Porto" },
      { research_area: "Biotecnologia", total_publications: 176, open_access_count: 123, open_access_percentage: 69.89, avg_citations: 38.5, avg_impact_factor: 4.1, top_journals: "Biotechnology Advances, Journal of Biotechnology, Nature Biotechnology", top_institutions: "iBET, Instituto Gulbenkian de Ciência, ITQB NOVA" },
      { research_area: "Física", total_publications: 165, open_access_count: 107, open_access_percentage: 64.85, avg_citations: 41.7, avg_impact_factor: 4.3, top_journals: "European Physical Journal, Physical Review Letters, Physics Letters B", top_institutions: "Instituto Superior Técnico, LIP, Universidade de Coimbra" },
      { research_area: "Química", total_publications: 143, open_access_count: 96, open_access_percentage: 67.13, avg_citations: 32.9, avg_impact_factor: 3.9, top_journals: "ACS Chemistry, Journal of Chemical Physics, RSC Advances", top_institutions: "CICECO, Universidade de Aveiro, Universidade do Porto" },
      { research_area: "Ciências Sociais", total_publications: 132, open_access_count: 83, open_access_percentage: 62.88, avg_citations: 21.4, avg_impact_factor: 2.7, top_journals: "Journal of Social Sciences, Social Science Research, Sociological Research Online", top_institutions: "ISCTE-IUL, Universidade de Lisboa, Universidade Nova de Lisboa" },
      { research_area: "Ciências Marinhas", total_publications: 118, open_access_count: 92, open_access_percentage: 77.97, avg_citations: 29.8, avg_impact_factor: 3.5, top_journals: "Aquatic Conservation, Marine Biology, Ocean Science", top_institutions: "CIIMAR, Universidade dos Açores, Universidade do Algarve" },
      { research_area: "Economia", total_publications: 97, open_access_count: 58, open_access_percentage: 59.79, avg_citations: 19.6, avg_impact_factor: 2.8, top_journals: "Economic Journal, Journal of Economic Perspectives, Review of Economics and Statistics", top_institutions: "Nova SBE, Universidade de Coimbra, Universidade de Lisboa" },
      { research_area: "Neurociência", total_publications: 93, open_access_count: 67, open_access_percentage: 72.04, avg_citations: 46.2, avg_impact_factor: 4.6, top_journals: "Brain Research, Journal of Neuroscience, Nature Neuroscience", top_institutions: "Champalimaud Foundation, Universidade de Coimbra, Universidade de Lisboa" },
      { research_area: "Matemática", total_publications: 86, open_access_count: 48, open_access_percentage: 55.81, avg_citations: 18.3, avg_impact_factor: 2.4, top_journals: "Advances in Mathematics, Journal of Mathematical Analysis, SIAM Journal on Mathematics", top_institutions: "Centro de Matemática da Universidade de Coimbra, Instituto Superior Técnico, Universidade do Porto" }
    ],
    explanation: "Esta consulta analisa o perfil das publicações científicas em Portugal por área de pesquisa, mostrando o número total de publicações, quantas estão em acesso aberto, a porcentagem correspondente, média de citações, fator de impacto médio, principais revistas e instituições por área."
  }
};

// This function is not used since we're focusing on mock data
async function executeQuery(query: string): Promise<{ data: any; error: any }> {
  try {
    console.log("Executing SQL query:", query);

    // Remove semicolons from the end of the query which can cause issues
    const cleanQuery = query.trim().replace(/;$/, '');
    
    // Execute the query using the SQL function that only allows SELECT
    const { data, error } = await supabase.rpc('execute_sql_query', {
      sql_query: cleanQuery
    });

    if (error) {
      console.error("SQL query execution error:", error);
      return { data: null, error };
    }

    console.log("Query executed successfully, data:", data ? data.slice(0, 2) : "no data");
    return { data, error: null };
  } catch (error) {
    console.error("Error executing query:", error);
    return { data: null, error };
  }
}

async function processUserQuery(userQuery: string): Promise<{
  message: string;
  sqlQuery: string;
  results: any[] | null;
  error?: boolean;
  noResults?: boolean;
  queryId?: string;
  analysis?: any;
}> {
  try {
    console.log("Processing user query:", userQuery);
    
    // Generate mock query ID
    const queryId = crypto.randomUUID();
    
    // Log query to history
    try {
      await supabase
        .from('query_history')
        .insert([
          { 
            query_text: userQuery,
            was_successful: true,
            language: 'pt',
            id: queryId
          }
        ]);
      console.log("Query logged to history");
    } catch (err) {
      console.error("Error logging query:", err);
    }
    
    // Find exact match in mock responses
    if (mockResponses[userQuery]) {
      const mockData = mockResponses[userQuery];
      console.log("Found exact mock response match");
      return {
        message: mockData.explanation,
        sqlQuery: mockData.sqlQuery,
        results: mockData.results,
        queryId
      };
    }
    
    // Find fuzzy match in mock responses
    for (const [key, value] of Object.entries(mockResponses)) {
      // Check if key words from the mock response are in the user query
      const keyWords = key.toLowerCase().split(" ");
      const userQueryLower = userQuery.toLowerCase();
      
      // If one of the first two words (usually the most important) match, consider it a fuzzy match
      if (keyWords.length > 0 && userQueryLower.includes(keyWords[0]) || 
          (keyWords.length > 1 && userQueryLower.includes(keyWords[1]))) {
        console.log("Found fuzzy mock response match with:", key);
        return {
          message: `Resposta aproximada baseada em: "${key}"\n\n${value.explanation}`,
          sqlQuery: value.sqlQuery,
          results: value.results,
          queryId
        };
      }
    }
    
    // No match found
    console.log("No mock response match found");
    return {
      message: "Não encontrei dados que respondam a essa consulta. Por favor, tente reformular a pergunta ou escolha uma das sugestões fornecidas.",
      sqlQuery: "SELECT 'mock data only' as info",
      results: [],
      noResults: true,
      queryId
    };
  } catch (error) {
    console.error("Error processing user query:", error);
    return {
      message: `Erro ao processar sua consulta: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      sqlQuery: "",
      results: null,
      error: true
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

    console.log('Received query:', query);

    const response = await processUserQuery(query);

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        sqlQuery: '',
        results: null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

