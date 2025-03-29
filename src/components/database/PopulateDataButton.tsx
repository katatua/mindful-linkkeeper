
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

export const PopulateDataButton: React.FC<PopulateDataButtonProps> = ({ query, queryId }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();
  
  const generateSampleAnalysis = (queryText: string) => {
    const queryLower = queryText.toLowerCase();
    
    if (queryLower.includes("financiamento") || queryLower.includes("funding")) {
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
    } else if (queryLower.includes("projeto") || queryLower.includes("project")) {
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
    } else if (queryLower.includes("métrica") || queryLower.includes("metric")) {
      return {
        analysis: "Esta consulta está relacionada a métricas de inovação. Preparei dados de amostra para métricas que podem ser adicionados à sua base de dados.",
        tables: ["ani_metrics"],
        insertStatements: [
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Patentes Registadas', 'inovação', 342, 'Nacional', '2024-01-15', 'Número total de patentes registadas', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Investimento em I&D', 'financiamento', 125000000, 'Nacional', '2024-02-20', 'Total do investimento em Investigação e Desenvolvimento', 'EUR')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Startups Criadas', 'empreendedorismo', 78, 'Lisboa', '2024-03-10', 'Número de novas startups criadas', 'quantidade')`,
          
          `INSERT INTO ani_metrics (name, category, value, region, measurement_date, description, unit) 
          VALUES ('Exportação de Tecnologia', 'economia', 67000000, 'Norte', '2024-03-25', 'Valor total de exportações tecnológicas', 'EUR')`
        ],
        expectedResults: "4 métricas de inovação com valores, regiões e categorias diferentes."
      };
    } else if (queryLower.includes("energia") || queryLower.includes("renovável") || queryLower.includes("energy") || queryLower.includes("renewable")) {
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
    } else {
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
      const sampleAnalysis = generateSampleAnalysis(query);
      setAnalysis(sampleAnalysis);
      setShowDialog(true);
      
      // Try to call the edge function in the background
      supabase.functions.invoke('analyze-query', {
        body: { query }
      }).then(({ data, error }) => {
        if (!error && data) {
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
                    onInsertSuccess={() => setShowDialog(false)}
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
