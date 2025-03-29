
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
      // Check if query contains energy-related terms
      const energyTerms = [
        'renewable', 'energy', 'solar', 'wind', 'hydro', 'biomass', 
        'geothermal', 'sustain', 'green', 'clean', 'energia', 'renovável'
      ];
      
      const isEnergyQuery = energyTerms.some(term => 
        query.toLowerCase().includes(term.toLowerCase())
      );
      
      if (isEnergyQuery) {
        // Prepare renewable energy sample data
        const renewableSampleData = {
          analysis: "Esta consulta está relacionada a programas de financiamento de energia renovável. Preparei dados de amostra para programas de energia renovável que podem ser adicionados à sua base de dados.",
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
        
        setAnalysis(renewableSampleData);
        setShowDialog(true);
      } else {
        // Call the analyze-query edge function for non-energy queries
        const { data, error } = await supabase.functions.invoke('analyze-query', {
          body: { query }
        });
        
        if (error) {
          console.error("Erro ao chamar a função analyze-query:", error);
          toast({
            title: "Erro",
            description: "Falha ao analisar a consulta: " + error.message,
            variant: "destructive",
          });
          return;
        }
        
        setAnalysis(data);
        setShowDialog(true);
      }
      
    } catch (error) {
      console.error("Erro ao analisar consulta:", error);
      toast({
        title: "Erro",
        description: "Falha ao analisar a consulta: " + (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      });
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
    
    // If we already have an analysis, show it directly
    if (analysis) {
      setShowDialog(true);
      return;
    }
    
    // Otherwise, start the analysis process
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
