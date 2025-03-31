
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { DatabaseIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QueryDataRecommendations } from './QueryDataRecommendations';

interface PopulateDataButtonProps {
  query: string;
  queryId?: string;
}

export const PopulateDataButton: React.FC<PopulateDataButtonProps> = ({ 
  query, 
  queryId 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();
  
  const generateSampleAnalysis = (queryText: string) => {
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
    // 2. Métricas de inovação
    else if (queryLower.includes("métrica") || queryLower.includes("inovação") || queryLower.includes("lisboa")) {
      return {
        analysis: "Esta consulta está relacionada a métricas de inovação. Preparei dados de amostra para métricas que podem ser adicionados à sua base de dados.",
        tables: ["ani_metrics"],
        insertStatements: [
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Patentes Registadas', 'inovação', 342, 'Lisboa', '2024-01-15', 'Número total de patentes registadas', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Investimento em I&D', 'financiamento', 45000000, 'Lisboa', '2024-02-20', 'Total do investimento em Investigação e Desenvolvimento', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Startups Criadas', 'empreendedorismo', 78, 'Lisboa', '2024-03-10', 'Número de novas startups criadas', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Exportação de Tecnologia', 'economia', 37000000, 'Lisboa', '2024-03-25', 'Valor total de exportações tecnológicas', 'EUR')`
        ],
        expectedResults: "4 métricas de inovação para a região de Lisboa em 2024."
      };
    } 
    // 3. Programas de financiamento
    else if (queryLower.includes("financiamento") || queryLower.includes("funding")) {
      return {
        analysis: "Esta consulta está relacionada a programas de financiamento. Preparei dados de amostra para programas de financiamento que podem ser adicionados à sua base de dados.",
        tables: ["ani_funding_programs"],
        insertStatements: [
          `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type) 
          VALUES ('Programa Nacional de Inovação', 'Financiamento para projetos inovadores em diversas áreas', 10000000, '2025-08-15', '2026-12-31', ARRAY['tecnologia', 'saúde', 'educação'], 'subsídio')`,
          
          `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type) 
          VALUES ('Horizonte Europa - Portugal', 'Programa de cooperação com a União Europeia', 7500000, '2025-07-30', '2027-01-31', ARRAY['pesquisa', 'desenvolvimento', 'inovação'], 'misto')`,
          
          `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type) 
          VALUES ('Incentivo PME Digital', 'Apoio à digitalização de pequenas e médias empresas', 3000000, '2025-09-20', '2026-10-15', ARRAY['digitalização', 'PME'], 'empréstimo')`
        ],
        expectedResults: "3 programas de financiamento com detalhes sobre orçamento, prazos e áreas de foco."
      };
    } 
    // 4. Projetos
    else if (queryLower.includes("projeto") || queryLower.includes("project")) {
      return {
        analysis: "Esta consulta está relacionada a projetos. Preparei dados de amostra para projetos que podem ser adicionados à sua base de dados.",
        tables: ["ani_projects"],
        insertStatements: [
          `INSERT INTO ani_projects (title, description, funding_amount, status, sector, region, organization) 
          VALUES ('Plataforma de Telemedicina Nacional', 'Desenvolvimento de uma plataforma integrada de telemedicina para o SNS', 1200000, 'Active', 'Saúde', 'Lisboa', 'Instituto de Tecnologias da Saúde')`,
          
          `INSERT INTO ani_projects (title, description, funding_amount, status, sector, region, organization) 
          VALUES ('Rede Inteligente de Monitorização Ambiental', 'Implementação de sensores IoT para monitorização ambiental', 950000, 'Active', 'Ambiente', 'Porto', 'EcoTech Portugal')`,
          
          `INSERT INTO ani_projects (title, description, funding_amount, status, sector, region, organization) 
          VALUES ('Agricultura de Precisão AI', 'Utilização de inteligência artificial para otimização de cultivos', 780000, 'Submitted', 'Agricultura', 'Alentejo', 'AgriTech Inovação')`
        ],
        expectedResults: "3 projetos com detalhes sobre financiamento, estado, setor e organização responsável."
      };
    } 
    // 5. Energia renovável
    else if (queryLower.includes("energia") || queryLower.includes("renovável") || queryLower.includes("energy") || queryLower.includes("renewable")) {
      return {
        analysis: "Esta consulta está relacionada a programas de energia renovável. Preparei dados de amostra para programas de energia renovável que podem ser adicionados à sua base de dados.",
        tables: ["ani_funding_programs"],
        insertStatements: [
          `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type) 
          VALUES ('Fundo de Inovação em Energia Renovável', 'Apoio a projetos inovadores em tecnologias de energia renovável', 5000000, '2025-06-30', '2026-12-31', ARRAY['energia renovável', 'inovação', 'tecnologia limpa'], 'subsídio')`,
          
          `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type) 
          VALUES ('Programa de Desenvolvimento de Energia Solar', 'Acelerando a implantação de soluções de energia solar em Portugal', 3500000, '2025-07-15', '2026-08-31', ARRAY['energia solar', 'energia renovável', 'infraestrutura'], 'misto')`,
          
          `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type) 
          VALUES ('Iniciativa de Hidrogênio Verde', 'Apoio à pesquisa e implementação de tecnologias de hidrogênio verde', 7000000, '2025-09-01', '2027-03-31', ARRAY['hidrogênio', 'energia renovável', 'pesquisa'], 'subsídio')`,
          
          `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type) 
          VALUES ('Programa de Excelência em Energia Eólica', 'Aprimorando a capacidade e eficiência da energia eólica em regiões costeiras', 4200000, '2025-05-30', '2026-10-15', ARRAY['energia eólica', 'energia renovável', 'costeiro'], 'subsídio')`,
          
          `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type) 
          VALUES ('Fundo de Transição Energética Sustentável', 'Apoio às PMEs na transição para fontes de energia renovável', 2800000, '2025-08-15', '2026-09-30', ARRAY['energia renovável', 'PME', 'sustentabilidade'], 'empréstimo')`
        ],
        expectedResults: "5 programas de financiamento relacionados à energia renovável com detalhes sobre orçamento, prazos e áreas de foco."
      };
    }
    // 6. Pesquisadores e cientistas
    else if (queryLower.includes("pesquisador") || queryLower.includes("investigador") || queryLower.includes("cientista") || queryLower.includes("researcher")) {
      return {
        analysis: "Esta consulta está relacionada a pesquisadores e cientistas. Preparei dados de amostra para pesquisadores que podem ser adicionados à sua base de dados.",
        tables: ["ani_researchers"],
        insertStatements: [
          `INSERT INTO ani_researchers (name, email, specialization, institution_id, h_index, publication_count) 
          VALUES ('Dra. Maria Silva', 'maria.silva@ulisboa.pt', 'Inteligência Artificial', NULL, 18, 45)`,
          
          `INSERT INTO ani_researchers (name, email, specialization, institution_id, h_index, publication_count) 
          VALUES ('Dr. João Santos', 'joao.santos@tecnico.pt', 'Energia Renovável', NULL, 22, 67)`,
          
          `INSERT INTO ani_researchers (name, email, specialization, institution_id, h_index, publication_count) 
          VALUES ('Dra. Ana Ferreira', 'ana.ferreira@uminho.pt', 'Biotecnologia', NULL, 15, 38)`,
          
          `INSERT INTO ani_researchers (name, email, specialization, institution_id, h_index, publication_count) 
          VALUES ('Dr. Carlos Pereira', 'carlos.pereira@uporto.pt', 'Nanotecnologia', NULL, 24, 72)`,
          
          `INSERT INTO ani_researchers (name, email, specialization, institution_id, h_index, publication_count) 
          VALUES ('Dra. Isabel Costa', 'isabel.costa@uc.pt', 'Ciência de Materiais', NULL, 19, 52)`,
          
          `INSERT INTO ani_researchers (name, email, specialization, institution_id, h_index, publication_count) 
          VALUES ('Dr. António Martins', 'antonio.martins@nova.pt', 'Robótica', NULL, 16, 41)`,
          
          `INSERT INTO ani_researchers (name, email, specialization, institution_id, h_index, publication_count) 
          VALUES ('Dra. Sofia Rodrigues', 'sofia.rodrigues@uaveiro.pt', 'Genética', NULL, 21, 58)`,
          
          `INSERT INTO ani_researchers (name, email, specialization, institution_id, h_index, publication_count) 
          VALUES ('Dr. Miguel Costa', 'miguel.costa@ualg.pt', 'Oceanografia', NULL, 17, 44)`
        ],
        expectedResults: "8 pesquisadores de diferentes universidades portuguesas com detalhes sobre especialização, índice h e número de publicações."
      };
    }
    // 7. Startups
    else if (queryLower.includes("startup") || queryLower.includes("empreendedorismo") || queryLower.includes("entrepreneur")) {
      return {
        analysis: "Esta consulta está relacionada a startups e empreendedorismo. Preparei dados de amostra para métricas de startups que podem ser adicionados à sua base de dados.",
        tables: ["ani_metrics"],
        insertStatements: [
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Startups Criadas', 'empreendedorismo', 156, 'Lisboa', '2023-12-31', 'Número de startups criadas durante o ano', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Financiamento de Startups', 'empreendedorismo', 78500000, 'Lisboa', '2023-12-31', 'Total de investimento em startups', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Startups Criadas', 'empreendedorismo', 94, 'Porto', '2023-12-31', 'Número de startups criadas durante o ano', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Financiamento de Startups', 'empreendedorismo', 42300000, 'Porto', '2023-12-31', 'Total de investimento em startups', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Startups Criadas', 'empreendedorismo', 45, 'Braga', '2023-12-31', 'Número de startups criadas durante o ano', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Financiamento de Startups', 'empreendedorismo', 18700000, 'Braga', '2023-12-31', 'Total de investimento em startups', 'EUR')`
        ],
        expectedResults: "6 métricas relacionadas a startups nas regiões de Lisboa, Porto e Braga, incluindo número de startups e valor de investimento."
      };
    }
    // 8. Instituições de Ensino
    else if (queryLower.includes("universidade") || queryLower.includes("faculdade") || queryLower.includes("instituto") || queryLower.includes("university")) {
      return {
        analysis: "Esta consulta está relacionada a instituições de ensino. Preparei dados de amostra para instituições que podem ser adicionados à sua base de dados.",
        tables: ["ani_institutions"],
        insertStatements: [
          `INSERT INTO ani_institutions (institution_name, type, region, founding_date, specialization_areas) 
          VALUES ('Universidade de Lisboa', 'Universidade Pública', 'Lisboa', '1911-03-22', ARRAY['Humanidades', 'Ciências', 'Medicina', 'Direito'])`,
          
          `INSERT INTO ani_institutions (institution_name, type, region, founding_date, specialization_areas) 
          VALUES ('Universidade do Porto', 'Universidade Pública', 'Porto', '1911-03-22', ARRAY['Engenharia', 'Medicina', 'Economia', 'Ciências'])`,
          
          `INSERT INTO ani_institutions (institution_name, type, region, founding_date, specialization_areas) 
          VALUES ('Universidade de Coimbra', 'Universidade Pública', 'Coimbra', '1290-03-01', ARRAY['Direito', 'Letras', 'Medicina', 'Ciências'])`,
          
          `INSERT INTO ani_institutions (institution_name, type, region, founding_date, specialization_areas) 
          VALUES ('Universidade do Minho', 'Universidade Pública', 'Braga', '1973-08-11', ARRAY['Engenharia', 'Ciências', 'Economia', 'Humanidades'])`,
          
          `INSERT INTO ani_institutions (institution_name, type, region, founding_date, specialization_areas) 
          VALUES ('Universidade Nova de Lisboa', 'Universidade Pública', 'Lisboa', '1973-01-11', ARRAY['Economia', 'Ciências Sociais', 'Medicina', 'Tecnologia'])`,
          
          `INSERT INTO ani_institutions (institution_name, type, region, founding_date, specialization_areas) 
          VALUES ('Instituto Superior Técnico', 'Instituto Universitário', 'Lisboa', '1911-01-23', ARRAY['Engenharia', 'Arquitetura', 'Tecnologia', 'Matemática'])`
        ],
        expectedResults: "6 instituições de ensino com detalhes sobre localização, data de fundação e áreas de especialização."
      };
    }
    // 9. Política de inovação
    else if (queryLower.includes("política") || queryLower.includes("regulamentação") || queryLower.includes("regulamento") || queryLower.includes("policy")) {
      return {
        analysis: "Esta consulta está relacionada a políticas de inovação. Preparei dados de amostra para frameworks de políticas que podem ser adicionados à sua base de dados.",
        tables: ["ani_policy_frameworks"],
        insertStatements: [
          `INSERT INTO ani_policy_frameworks (title, description, status, implementation_date, key_objectives) 
          VALUES ('Estratégia Nacional de Inovação 2030', 'Plano estratégico para o desenvolvimento da inovação em Portugal até 2030', 'active', '2023-01-15', ARRAY['Aumentar investimento em I&D', 'Promover a transferência de tecnologia', 'Fortalecer o ecossistema de inovação'])`,
          
          `INSERT INTO ani_policy_frameworks (title, description, status, implementation_date, key_objectives) 
          VALUES ('Regulamento de Incentivos Fiscais para I&D', 'Quadro regulatório para benefícios fiscais em atividades de I&D', 'active', '2022-07-01', ARRAY['Estimular o investimento privado em I&D', 'Reduzir a carga fiscal para empresas inovadoras', 'Atrair centros de R&D internacionais'])`,
          
          `INSERT INTO ani_policy_frameworks (title, description, status, implementation_date, key_objectives) 
          VALUES ('Plano de Ação para Digitalização', 'Estratégia nacional para a transformação digital da economia', 'active', '2023-04-10', ARRAY['Digitalizar PMEs', 'Desenvolver competências digitais', 'Modernizar a administração pública'])`,
          
          `INSERT INTO ani_policy_frameworks (title, description, status, implementation_date, key_objectives) 
          VALUES ('Política de Dados Abertos', 'Regulamentação sobre o acesso e utilização de dados públicos', 'active', '2022-09-20', ARRAY['Promover a transparência', 'Estimular a inovação baseada em dados', 'Melhorar a eficiência dos serviços públicos'])`,
          
          `INSERT INTO ani_policy_frameworks (title, description, status, implementation_date, key_objectives) 
          VALUES ('Estratégia para a Economia Circular', 'Plano para transição para um modelo econômico circular', 'active', '2023-03-05', ARRAY['Reduzir o desperdício', 'Promover a reutilização de recursos', 'Criar novos modelos de negócio sustentáveis'])`
        ],
        expectedResults: "5 frameworks de políticas relacionadas à inovação, incluindo objetivos, datas de implementação e status."
      };
    }
    // 10. Colaborações internacionais
    else if (queryLower.includes("colaboração") || queryLower.includes("internacional") || queryLower.includes("parceria") || queryLower.includes("collaboration")) {
      return {
        analysis: "Esta consulta está relacionada a colaborações internacionais. Preparei dados de amostra para colaborações que podem ser adicionados à sua base de dados.",
        tables: ["ani_international_collaborations"],
        insertStatements: [
          `INSERT INTO ani_international_collaborations (program_name, country, partnership_type, start_date, end_date, total_budget, focus_areas) 
          VALUES ('Horizonte Europa - Portugal-Alemanha', 'Alemanha', 'Pesquisa Colaborativa', '2023-01-01', '2027-12-31', 12500000, ARRAY['Energia Renovável', 'Inteligência Artificial', 'Biotecnologia'])`,
          
          `INSERT INTO ani_international_collaborations (program_name, country, partnership_type, start_date, end_date, total_budget, focus_areas) 
          VALUES ('Programa Bilateral Portugal-França', 'França', 'Intercâmbio Acadêmico', '2023-03-15', '2026-03-14', 5800000, ARRAY['Ciências Sociais', 'Robótica', 'Saúde'])`,
          
          `INSERT INTO ani_international_collaborations (program_name, country, partnership_type, start_date, end_date, total_budget, focus_areas) 
          VALUES ('MIT Portugal', 'Estados Unidos', 'Educação e Pesquisa', '2022-09-01', '2028-08-31', 18700000, ARRAY['Tecnologia', 'Engenharia', 'Ciência de Dados'])`,
          
          `INSERT INTO ani_international_collaborations (program_name, country, partnership_type, start_date, end_date, total_budget, focus_areas) 
          VALUES ('Portugal-China 2030', 'China', 'Transferência de Tecnologia', '2023-06-01', '2030-05-31', 9400000, ARRAY['Mobilidade Elétrica', 'Smart Cities', 'Tecnologia Verde'])`,
          
          `INSERT INTO ani_international_collaborations (program_name, country, partnership_type, start_date, end_date, total_budget, focus_areas) 
          VALUES ('Aliança Portugal-Brasil em Inovação', 'Brasil', 'Empreendedorismo e Inovação', '2023-02-15', '2026-02-14', 7200000, ARRAY['Bioeconomia', 'Economia Circular', 'Tecnologias Digitais'])`
        ],
        expectedResults: "5 colaborações internacionais entre Portugal e outros países, incluindo orçamentos, datas e áreas de foco."
      };
    }
    // 11. Investimento em I&D
    else if (queryLower.includes("investimento") || queryLower.includes("i&d") || queryLower.includes("r&d") || queryLower.includes("investment")) {
      return {
        analysis: "Esta consulta está relacionada a investimentos em I&D. Preparei dados de amostra para métricas de investimento que podem ser adicionados à sua base de dados.",
        tables: ["ani_metrics"],
        insertStatements: [
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Investimento em I&D', 'financiamento', 1250000000, 'Nacional', '2023-12-31', 'Total de investimento em I&D em Portugal', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Percentual do PIB em I&D', 'financiamento', 1.58, 'Nacional', '2023-12-31', 'Percentual do PIB investido em I&D', 'percent')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Investimento Privado em I&D', 'financiamento', 725000000, 'Nacional', '2023-12-31', 'Investimento do setor privado em I&D', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Investimento Público em I&D', 'financiamento', 525000000, 'Nacional', '2023-12-31', 'Investimento do setor público em I&D', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Investimento em I&D', 'financiamento', 580000000, 'Lisboa', '2023-12-31', 'Total de investimento em I&D na região de Lisboa', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Investimento em I&D', 'financiamento', 340000000, 'Porto', '2023-12-31', 'Total de investimento em I&D na região do Porto', 'EUR')`
        ],
        expectedResults: "6 métricas relacionadas a investimentos em I&D, incluindo valores nacionais e regionais."
      };
    }
    // 12. Emprego e inovação
    else if (queryLower.includes("emprego") || queryLower.includes("trabalho") || queryLower.includes("job") || queryLower.includes("employment")) {
      return {
        analysis: "Esta consulta está relacionada a emprego e inovação. Preparei dados de amostra para métricas de emprego que podem ser adicionados à sua base de dados.",
        tables: ["ani_metrics"],
        insertStatements: [
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Empregos em Setores de Alta Tecnologia', 'emprego', 127500, 'Nacional', '2023-12-31', 'Número de empregos em setores de alta tecnologia', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Empregos em I&D', 'emprego', 58400, 'Nacional', '2023-12-31', 'Número de empregos dedicados a I&D', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Pesquisadores por 1000 Habitantes', 'emprego', 9.7, 'Nacional', '2023-12-31', 'Número de pesquisadores por 1000 habitantes', 'taxa')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Empregos Criados por Startups', 'emprego', 12800, 'Nacional', '2023-12-31', 'Número de empregos criados por startups', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Crescimento do Emprego em Tecnologia', 'emprego', 5.8, 'Nacional', '2023-12-31', 'Taxa de crescimento anual do emprego em tecnologia', 'percent')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Empregos em Setores de Alta Tecnologia', 'emprego', 68200, 'Lisboa', '2023-12-31', 'Número de empregos em setores de alta tecnologia na região de Lisboa', 'quantidade')`
        ],
        expectedResults: "6 métricas relacionadas a emprego e inovação, incluindo dados sobre empregos em alta tecnologia e I&D."
      };
    }
    // 13. Exportações tecnológicas
    else if (queryLower.includes("exportação") || queryLower.includes("exportações") || queryLower.includes("export")) {
      return {
        analysis: "Esta consulta está relacionada a exportações tecnológicas. Preparei dados de amostra para métricas de exportação que podem ser adicionados à sua base de dados.",
        tables: ["ani_metrics"],
        insertStatements: [
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Exportações de Alta Tecnologia', 'economia', 3850000000, 'Nacional', '2023-12-31', 'Valor total de exportações de produtos de alta tecnologia', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Percentual de Exportações Tecnológicas', 'economia', 7.3, 'Nacional', '2023-12-31', 'Percentual das exportações totais representado por produtos de alta tecnologia', 'percent')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Crescimento das Exportações Tecnológicas', 'economia', 8.5, 'Nacional', '2023-12-31', 'Taxa de crescimento anual das exportações tecnológicas', 'percent')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Exportações de Software', 'economia', 1420000000, 'Nacional', '2023-12-31', 'Valor das exportações de software e serviços de TI', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Exportações Farmacêuticas', 'economia', 875000000, 'Nacional', '2023-12-31', 'Valor das exportações de produtos farmacêuticos', 'EUR')`
        ],
        expectedResults: "5 métricas relacionadas a exportações tecnológicas, incluindo valores totais e por setor."
      };
    }
    // 14. Formação e competências
    else if (queryLower.includes("formação") || queryLower.includes("competência") || queryLower.includes("educação") || queryLower.includes("education") || queryLower.includes("skill")) {
      return {
        analysis: "Esta consulta está relacionada a formação e competências. Preparei dados de amostra para métricas de educação que podem ser adicionados à sua base de dados.",
        tables: ["ani_metrics"],
        insertStatements: [
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Graduados em STEM', 'educação', 18700, 'Nacional', '2023-12-31', 'Número de graduados em áreas STEM (Ciências, Tecnologia, Engenharia e Matemática)', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Doutoramentos Concluídos', 'educação', 2450, 'Nacional', '2023-12-31', 'Número de doutoramentos concluídos', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Formação Contínua em Tecnologia', 'educação', 84500, 'Nacional', '2023-12-31', 'Número de profissionais que participaram em formação contínua em tecnologia', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Percentual da População com Competências Digitais', 'educação', 62.5, 'Nacional', '2023-12-31', 'Percentual da população com competências digitais básicas ou acima', 'percent')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Investimento em Formação Tecnológica', 'educação', 225000000, 'Nacional', '2023-12-31', 'Investimento total em programas de formação tecnológica', 'EUR')`
        ],
        expectedResults: "5 métricas relacionadas a formação e competências, incluindo dados sobre graduados STEM e competências digitais."
      };
    }
    // 15. Indústria 4.0
    else if (queryLower.includes("indústria 4.0") || queryLower.includes("industria 4.0") || queryLower.includes("industry 4.0") || queryLower.includes("digitalização") || queryLower.includes("digitalization")) {
      return {
        analysis: "Esta consulta está relacionada à Indústria 4.0. Preparei dados de amostra para métricas de Indústria 4.0 que podem ser adicionados à sua base de dados.",
        tables: ["ani_metrics"],
        insertStatements: [
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Adoção de Tecnologias 4.0', 'digitalização', 37.5, 'Nacional', '2023-12-31', 'Percentual de empresas que adotaram tecnologias da Indústria 4.0', 'percent')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Investimento em Automação', 'digitalização', 345000000, 'Nacional', '2023-12-31', 'Investimento total em automação e robótica', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('PMEs Digitalizadas', 'digitalização', 42.8, 'Nacional', '2023-12-31', 'Percentual de PMEs com alto nível de integração digital', 'percent')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Empresas Utilizando IA', 'digitalização', 18.4, 'Nacional', '2023-12-31', 'Percentual de empresas utilizando inteligência artificial', 'percent')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Produtividade em Manufatura Avançada', 'digitalização', 12.5, 'Nacional', '2023-12-31', 'Aumento de produtividade em empresas com manufatura avançada', 'percent')`
        ],
        expectedResults: "5 métricas relacionadas à Indústria 4.0, incluindo taxas de adoção e investimentos em tecnologias avançadas."
      };
    }
    // 16. Centros de inovação
    else if (queryLower.includes("centro de inovação") || queryLower.includes("centros de inovação") || queryLower.includes("innovation center")) {
      return {
        analysis: "Esta consulta está relacionada a centros de inovação. Preparei dados de amostra para instituições de inovação que podem ser adicionados à sua base de dados.",
        tables: ["ani_institutions"],
        insertStatements: [
          `INSERT INTO ani_institutions (institution_name, type, region, founding_date, specialization_areas) 
          VALUES ('Hub de Inovação de Lisboa', 'Centro de Inovação', 'Lisboa', '2018-05-10', ARRAY['Inteligência Artificial', 'Fintech', 'E-commerce', 'Smart Cities'])`,
          
          `INSERT INTO ani_institutions (institution_name, type, region, founding_date, specialization_areas) 
          VALUES ('Porto Innovation Hub', 'Centro de Inovação', 'Porto', '2016-11-15', ARRAY['Manufatura Avançada', 'Saúde Digital', 'Tecnologias Marítimas', 'Energia'])`,
          
          `INSERT INTO ani_institutions (institution_name, type, region, founding_date, specialization_areas) 
          VALUES ('Centro de Inovação de Braga', 'Centro de Inovação', 'Braga', '2019-03-22', ARRAY['Software', 'Eletrónica', 'Tecnologias de Informação', 'IoT'])`,
          
          `INSERT INTO ani_institutions (institution_name, type, region, founding_date, specialization_areas) 
          VALUES ('Algarve Tech Hub', 'Centro de Inovação', 'Algarve', '2020-07-01', ARRAY['Turismo Digital', 'Tecnologias Sustentáveis', 'Economia Azul', 'Agritech'])`,
          
          `INSERT INTO ani_institutions (institution_name, type, region, founding_date, specialization_areas) 
          VALUES ('Coimbra iHub', 'Centro de Inovação', 'Coimbra', '2017-09-05', ARRAY['Biotecnologia', 'Tecnologias Médicas', 'Digital Health', 'Farmacêutica'])`
        ],
        expectedResults: "5 centros de inovação em diferentes regiões de Portugal, incluindo suas áreas de especialização."
      };
    }
    // 17. IA e machine learning
    else if (queryLower.includes("inteligência artificial") || queryLower.includes("ia") || queryLower.includes("ai") || queryLower.includes("artificial intelligence") || queryLower.includes("machine learning")) {
      return {
        analysis: "Esta consulta está relacionada a inteligência artificial e machine learning. Preparei dados de amostra para projetos e métricas de IA que podem ser adicionados à sua base de dados.",
        tables: ["ani_projects", "ani_metrics"],
        insertStatements: [
          `INSERT INTO ani_projects (title, description, funding_amount, status, sector, region, organization) 
          VALUES ('AI Portugal 2030', 'Desenvolvimento de um ecossistema nacional de pesquisa em IA', 7800000, 'Active', 'Inteligência Artificial', 'Nacional', 'Fundação para a Ciência e Tecnologia')`,
          
          `INSERT INTO ani_projects (title, description, funding_amount, status, sector, region, organization) 
          VALUES ('Centro de Excelência em ML', 'Estabelecimento de um centro de excelência em machine learning', 4500000, 'Active', 'Inteligência Artificial', 'Lisboa', 'Instituto Superior Técnico')`,
          
          `INSERT INTO ani_projects (title, description, funding_amount, status, sector, region, organization) 
          VALUES ('IA para Saúde Pública', 'Aplicação de IA para melhorar os sistemas de saúde pública', 3200000, 'Active', 'Saúde', 'Porto', 'Universidade do Porto')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Investimento em IA', 'tecnologia', 145000000, 'Nacional', '2023-12-31', 'Investimento total em inteligência artificial', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Patentes em IA', 'tecnologia', 78, 'Nacional', '2023-12-31', 'Número de patentes registradas em IA', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Empresas Utilizando IA', 'tecnologia', 18.4, 'Nacional', '2023-12-31', 'Percentual de empresas utilizando inteligência artificial', 'percent')`
        ],
        expectedResults: "3 projetos de pesquisa em IA e 3 métricas relacionadas à adoção e desenvolvimento de inteligência artificial."
      };
    }
    // 18. Sustentabilidade e inovação verde
    else if (queryLower.includes("sustentabilidade") || queryLower.includes("verde") || queryLower.includes("sustainability") || queryLower.includes("green") || queryLower.includes("ambiental")) {
      return {
        analysis: "Esta consulta está relacionada a sustentabilidade e inovação verde. Preparei dados de amostra para projetos e métricas de sustentabilidade que podem ser adicionados à sua base de dados.",
        tables: ["ani_projects", "ani_metrics"],
        insertStatements: [
          `INSERT INTO ani_projects (title, description, funding_amount, status, sector, region, organization) 
          VALUES ('Portugal Circular 2030', 'Implementação de estratégias de economia circular em indústrias portuguesas', 5400000, 'Active', 'Sustentabilidade', 'Nacional', 'Agência Portuguesa do Ambiente')`,
          
          `INSERT INTO ani_projects (title, description, funding_amount, status, sector, region, organization) 
          VALUES ('Smart Green Cities', 'Desenvolvimento de tecnologias para cidades mais sustentáveis', 6200000, 'Active', 'Sustentabilidade', 'Lisboa', 'Centro de Estudos Ambientais')`,
          
          `INSERT INTO ani_projects (title, description, funding_amount, status, sector, region, organization) 
          VALUES ('Inovação em Materiais Sustentáveis', 'Pesquisa e desenvolvimento de novos materiais biodegradáveis', 3800000, 'Active', 'Materiais', 'Aveiro', 'Universidade de Aveiro')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Investimento em Tecnologias Verdes', 'sustentabilidade', 278000000, 'Nacional', '2023-12-31', 'Investimento total em tecnologias verdes', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Redução de Emissões por Inovação', 'sustentabilidade', 8.7, 'Nacional', '2023-12-31', 'Percentual de redução de emissões devido a inovações tecnológicas', 'percent')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Patentes em Tecnologias Verdes', 'sustentabilidade', 112, 'Nacional', '2023-12-31', 'Número de patentes em tecnologias verdes', 'quantidade')`
        ],
        expectedResults: "3 projetos relacionados à sustentabilidade e 3 métricas sobre investimento e inovação em tecnologias verdes."
      };
    }
    // 19. Transferência de tecnologia
    else if (queryLower.includes("transferência") || queryLower.includes("transferencia") || queryLower.includes("transfer") || queryLower.includes("valorização") || queryLower.includes("valorizacao")) {
      return {
        analysis: "Esta consulta está relacionada a transferência de tecnologia. Preparei dados de amostra para métricas de transferência de tecnologia que podem ser adicionados à sua base de dados.",
        tables: ["ani_metrics"],
        insertStatements: [
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Acordos de Transferência de Tecnologia', 'transferência', 245, 'Nacional', '2023-12-31', 'Número de acordos formais de transferência de tecnologia', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Spin-offs Acadêmicas', 'transferência', 78, 'Nacional', '2023-12-31', 'Número de spin-offs criadas a partir de instituições acadêmicas', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Receita de Licenciamento', 'transferência', 34500000, 'Nacional', '2023-12-31', 'Receita gerada por licenciamento de tecnologias', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Parcerias Universidade-Empresa', 'transferência', 312, 'Nacional', '2023-12-31', 'Número de parcerias formais entre universidades e empresas', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Projetos de Prova de Conceito', 'transferência', 187, 'Nacional', '2023-12-31', 'Número de projetos de prova de conceito financiados', 'quantidade')`
        ],
        expectedResults: "5 métricas relacionadas à transferência de tecnologia, incluindo dados sobre spin-offs e parcerias academia-indústria."
      };
    }
    // 20. Inovação social
    else if (queryLower.includes("inovação social") || queryLower.includes("social") || queryLower.includes("social innovation") || queryLower.includes("impacto social")) {
      return {
        analysis: "Esta consulta está relacionada a inovação social. Preparei dados de amostra para projetos e métricas de inovação social que podem ser adicionados à sua base de dados.",
        tables: ["ani_projects", "ani_metrics"],
        insertStatements: [
          `INSERT INTO ani_projects (title, description, funding_amount, status, sector, region, organization) 
          VALUES ('Portugal Inovação Social', 'Programa para apoiar iniciativas de inovação com impacto social', 8500000, 'Active', 'Inovação Social', 'Nacional', 'Ministério do Trabalho, Solidariedade e Segurança Social')`,
          
          `INSERT INTO ani_projects (title, description, funding_amount, status, sector, region, organization) 
          VALUES ('Tecnologia para Inclusão', 'Desenvolvimento de soluções tecnológicas para inclusão de pessoas com deficiência', 3700000, 'Active', 'Inovação Social', 'Lisboa', 'Fundação para a Inclusão Digital')`,
          
          `INSERT INTO ani_projects (title, description, funding_amount, status, sector, region, organization) 
          VALUES ('Redes de Inovação Comunitária', 'Criação de redes de inovação centradas na comunidade para resolver desafios locais', 2900000, 'Active', 'Inovação Social', 'Porto', 'Associação de Desenvolvimento Regional')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Investimento em Inovação Social', 'social', 112000000, 'Nacional', '2023-12-31', 'Investimento total em iniciativas de inovação social', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Empresas Sociais Criadas', 'social', 145, 'Nacional', '2023-12-31', 'Número de empresas sociais criadas', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Beneficiários de Projetos de Inovação Social', 'social', 378000, 'Nacional', '2023-12-31', 'Número de pessoas beneficiadas por projetos de inovação social', 'quantidade')`
        ],
        expectedResults: "3 projetos de inovação social e 3 métricas sobre investimento e impacto de iniciativas de inovação social."
      };
    }
    // Default response for other queries
    else {
      return {
        analysis: "Analisei sua consulta e preparei alguns dados de amostra genéricos que podem ser úteis para testar sua base de dados.",
        tables: ["ani_funding_programs", "ani_projects"],
        insertStatements: [
          `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type) 
          VALUES ('Programa de Inovação Geral', 'Financiamento para projetos inovadores em diversas áreas', 5000000, '2025-06-30', '2026-12-31', ARRAY['tecnologia', 'inovação'], 'subsídio')`,
          
          `INSERT INTO ani_projects (title, description, funding_amount, status, sector, region, organization) 
          VALUES ('Projeto de Demonstração', 'Um projeto de exemplo para demonstrar funcionalidades', 500000, 'Active', 'Geral', 'Nacional', 'Organização Exemplo')`
        ],
        expectedResults: "Dados de amostra com um programa de financiamento e um projeto."
      };
    }
  };
  
  const handleAnalyze = async () => {
    if (!query.trim()) {
      toast({
        title: "Erro",
        description: "Não é possível analisar uma consulta vazia.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    try {
      console.log("Analyzing query:", query);
      const sampleAnalysis = generateSampleAnalysis(query);
      setAnalysis(sampleAnalysis);
      setShowDialog(true);
      
      // Try to call the edge function in the background
      supabase.functions.invoke('analyze-query', {
        body: { query }
      }).then(({ data, error }) => {
        if (!error && data) {
          console.log("Received data from analyze-query:", data);
          setAnalysis(data);
        } else {
          console.log("Background analyze-query call failed, using sample data instead:", error);
        }
      }).catch(err => {
        console.log("Background analyze-query call failed, using sample data instead:", err);
      });
      
    } catch (error) {
      console.error("Erro ao analisar consulta:", error);
      const sampleAnalysis = generateSampleAnalysis(query);
      setAnalysis(sampleAnalysis);
      setShowDialog(true);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handlePopulate = async () => {
    if (!query.trim()) {
      toast({
        title: "Erro",
        description: "Não é possível solicitar dados para uma consulta vazia.",
        variant: "destructive",
      });
      return;
    }
    
    if (analysis) {
      setShowDialog(true);
      return;
    }
    
    await handleAnalyze();
  };
  
  const handleInsertSuccess = () => {
    console.log("Insert success called, closing dialog");
    setShowDialog(false);
    
    // Give user a helpful message
    toast({
      title: "Dados inseridos com sucesso",
      description: "A página irá recarregar para mostrar os resultados da consulta.",
    });
    
    // Create a URL with the query to retry
    const currentUrl = window.location.pathname;
    const newUrl = `${currentUrl}?queryToRetry=${encodeURIComponent(query)}`;
    
    // Navigate to the same page with the query parameter to retry
    console.log("Redirecting to:", newUrl);
    setTimeout(() => {
      window.location.href = newUrl;
    }, 1000);
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        disabled={isAnalyzing}
        onClick={handlePopulate}
        className="mt-2"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analisando Consulta...
          </>
        ) : (
          <>
            <DatabaseIcon className="h-4 w-4 mr-2" />
            Solicitar Dados para Esta Consulta
          </>
        )}
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Análise de População de Banco de Dados</DialogTitle>
            <DialogDescription>
              A IA analisou sua consulta e sugeriu dados para popular o banco de dados.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 mt-4 pr-4">
            {analysis ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-1">Análise</h3>
                  <p className="text-sm">{analysis.analysis}</p>
                </div>
                
                {analysis.tables && analysis.tables.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Tabelas que Requerem Dados</h3>
                    <ul className="list-disc pl-5 text-sm">
                      {analysis.tables.map((table: string, i: number) => (
                        <li key={i}>{table}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {analysis.insertStatements && analysis.insertStatements.length > 0 && (
                  <QueryDataRecommendations
                    query={query}
                    queryId={queryId}
                    insertStatements={analysis.insertStatements}
                    onInsertSuccess={handleInsertSuccess}
                  />
                )}
                
                {analysis.expectedResults && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Resultados Esperados</h3>
                    <div className="bg-slate-100 p-3 rounded text-sm">
                      <pre>{typeof analysis.expectedResults === 'string' 
                        ? analysis.expectedResults 
                        : JSON.stringify(analysis.expectedResults, null, 2)}</pre>
                    </div>
                  </div>
                )}
                
                <Alert>
                  <AlertDescription>
                    Isso executará as instruções SQL INSERT acima para popular seu banco de dados com dados de amostra.
                    Após a execução, tente executar sua consulta novamente.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </ScrollArea>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
