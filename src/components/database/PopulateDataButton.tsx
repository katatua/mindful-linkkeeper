
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DatabaseIcon, Loader2, ArrowDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QueryDataRecommendationsProps {
  query: string;
  queryId?: string;
  insertStatements: string[];
  onInsertSuccess?: () => void;
}

export const QueryDataRecommendations: React.FC<QueryDataRecommendationsProps> = ({
  query,
  queryId,
  insertStatements,
  onInsertSuccess
}) => {
  const [isInserting, setIsInserting] = useState(false);
  const { toast } = useToast();

  const handleInsertData = async () => {
    if (!insertStatements || insertStatements.length === 0) {
      toast({
        title: "Erro",
        description: "Não há instruções de inserção para executar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsInserting(true);
    try {
      // Execute each insert statement
      const tables: string[] = [];
      let hasErrors = false;
      
      for (const insertSql of insertStatements) {
        // Extract table name from INSERT INTO statement
        const tableMatch = insertSql.match(/INSERT INTO\s+([^\s\(]+)/i);
        if (tableMatch && tableMatch[1] && !tables.includes(tableMatch[1])) {
          tables.push(tableMatch[1]);
        }
        
        console.log("Executando SQL:", insertSql);
        
        const { data, error } = await supabase.rpc('execute_sql_query', {
          sql_query: insertSql
        });
        
        console.log("Resultado da execução SQL:", data, error);
        
        if (error) {
          console.error("Erro ao executar SQL:", error);
          toast({
            title: "Erro",
            description: `Falha ao executar SQL: ${error.message}`,
            variant: "destructive",
          });
          hasErrors = true;
          break;
        }
        
        // Check if data has an error status
        if (data && typeof data === 'object' && 'status' in data && data.status === 'error') {
          const errorMessage = 'message' in data ? data.message : 'Erro desconhecido';
          console.error("Erro no resultado SQL:", errorMessage);
          toast({
            title: "Erro",
            description: `Erro ao executar SQL: ${errorMessage}`,
            variant: "destructive",
          });
          hasErrors = true;
          break;
        }
      }
      
      if (!hasErrors) {
        // Update query_history to indicate data was populated
        if (queryId) {
          await supabase.from('query_history').update({
            was_successful: true,
            created_tables: tables,
            error_message: null
          }).eq('id', queryId);
        }
        
        toast({
          title: "Sucesso",
          description: "Banco de dados populado com sucesso. Tente sua consulta novamente.",
        });
        
        // Call the onInsertSuccess callback if provided
        // Add a significant delay to ensure database triggers complete
        if (onInsertSuccess) {
          console.log("Aguardando 2 segundos antes de chamar onInsertSuccess");
          setTimeout(() => {
            console.log("Chamando onInsertSuccess");
            onInsertSuccess();
          }, 2000); // Increase delay to ensure database triggers complete
        }
      }
      
    } catch (error) {
      console.error("Erro ao executar inserções:", error);
      toast({
        title: "Erro",
        description: `Falha ao popular banco de dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    } finally {
      setIsInserting(false);
    }
  };

  if (!insertStatements || insertStatements.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-muted/50 rounded-md border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold mb-1">Dados Recomendados</h3>
        <Button
          size="sm"
          variant="default"
          onClick={handleInsertData}
          disabled={isInserting}
          className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700"
        >
          {isInserting ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Inserindo...
            </>
          ) : (
            <>
              <ArrowDown className="h-4 w-4 mr-1" />
              Inserir no Banco de Dados
            </>
          )}
        </Button>
      </div>
      
      <div className="bg-slate-100 p-3 rounded-md text-xs font-mono whitespace-pre-wrap max-h-[200px] overflow-y-auto">
        {insertStatements.join(';\n\n')}
      </div>
    </div>
  );
};

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
          VALUES ('Programa de Excelência em Energia Eólica', 'Aprimorando a capacidade e eficiência da energia eólica em regiões costeiro', '4200000', '2025-05-30', '2026-10-15', ARRAY['energia eólica', 'energia renovável', 'costeiro'], 'subsídio')`,
          
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
        analysis: "Esta consulta está relacionada a startups e empreendedorismo. Preparei dados de amostra para startups que podem ser adicionados à sua base de dados.",
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
          VALUES ('Utrust', 2017, 'Blockchain', 21500000, 85, 'Braga', 'Plataforma de pagamento com criptomoedas', 'active')`
        ],
        expectedResults: "6 startups portuguesas com detalhes sobre financiamento, setor e localização."
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
          VALUES ('Programa Startup Portugal', 2016, 'Programa de Apoio', 'Estratégia nacional para o empreendedorismo, incluindo medidas de financiamento, mentoria e simplificação administrativa para startups', ARRAY['Startups', 'Tecnologia'], 'active', 'Ministério da Economia')`
        ],
        expectedResults: "4 políticas de inovação em Portugal, incluindo tipo, setores-alvo e status."
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
    // 12. Adoção de tecnologia
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
          VALUES ('Blockchain', 'Serviços Financeiros', 23.4, 2023, 'Nacional', ARRAY['Segurança de transações', 'Transparência', 'Redução de fraudes'], ARRAY['Escalabilidade', 'Regulamentação', 'Consumo de energia'])`
        ],
        expectedResults: "4 registros sobre taxas de adoção de diferentes tecnologias em vários setores, incluindo benefícios e desafios."
      };
    }
    // 13. Redes de inovação
    else if (queryLower.includes("rede") || queryLower.includes("parceria") || queryLower.includes("ecossistema") || queryLower.includes("network")) {
      return {
        analysis: "Esta consulta está relacionada a redes de inovação e ecossistemas. Preparei dados de amostra para redes de inovação que podem ser adicionados à sua base de dados.",
        tables: ["ani_innovation_networks"],
        insertStatements: [
          `INSERT INTO ani_innovation_networks (network_name, founding_year, member_count, focus_areas, geographic_scope, key_partners, achievements) 
          VALUES ('Hub de Inovação de Lisboa', 2016, 124, ARRAY['Smart Cities', 'Mobilidade', 'Energia'], 'Regional - Lisboa', ARRAY['Câmara Municipal de Lisboa', 'Universidade de Lisboa', 'EDP Inovação'], 'Lançamento de 35 startups, 12 patentes registadas, €25M em financiamento angariado')`,
          
          `INSERT INTO ani_innovation_networks (network_name, founding_year, member_count, focus_areas, geographic_scope, key_partners, achievements) 
          VALUES ('Rede Nacional de Inovação em Saúde', 2018, 87, ARRAY['Dispositivos Médicos', 'Telemedicina', 'Biotecnologia'], 'Nacional', ARRAY['Ministério da Saúde', 'Universidade do Porto', 'Hospitais Centrais'], 'Desenvolvimento de 8 dispositivos médicos inovadores, 5 ensaios clínicos, €15M em financiamento de I&D')`,
          
          `INSERT INTO ani_innovation_networks (network_name, founding_year, member_count, focus_areas, geographic_scope, key_partners, achievements) 
          VALUES ('Portugal Blue Economy', 2019, 56, ARRAY['Economia do Mar', 'Aquacultura', 'Portos Inteligentes'], 'Nacional', ARRAY['IPMA', 'Universidade dos Açores', 'Administração dos Portos'], 'Implementação de 3 projetos-piloto de aquacultura sustentável, €7M em investimento internacional')`
        ],
        expectedResults: "3 registros sobre redes de inovação em Portugal, incluindo foco, parceiros e realizações."
      };
    }
    // 14. Publicações de pesquisa
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
          VALUES ('Development of a Novel Machine Learning Algorithm for Cancer Detection', ARRAY['Pereira, Manuel', 'Santos, Catarina', 'Vieira, Francisco'], '2023-04-02', 'Medical AI Research', 'Universidade de Coimbra', 'Medicina/IA', 87, 4.9, true)`
        ],
        expectedResults: "5 registros sobre publicações acadêmicas de pesquisadores portugueses em diversas áreas de pesquisa."
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
