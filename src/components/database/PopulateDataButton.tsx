
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
        title: "Error",
        description: "Cannot analyze an empty query.",
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
          analysis: "This query is related to renewable energy funding programs. I've prepared sample data for renewable energy programs that can be added to your database.",
          tables: ["ani_funding_programs"],
          insertStatements: [
            `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type) 
            VALUES ('Renewable Energy Innovation Fund', 'Supporting innovative projects in renewable energy technologies', 5000000, '2025-06-30', '2026-12-31', ARRAY['renewable energy', 'innovation', 'clean tech'], 'grant')`,
            
            `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type) 
            VALUES ('Solar Energy Development Program', 'Accelerating the deployment of solar energy solutions across Portugal', 3500000, '2025-07-15', '2026-08-31', ARRAY['solar energy', 'renewable energy', 'infrastructure'], 'mixed')`,
            
            `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type) 
            VALUES ('Green Hydrogen Initiative', 'Supporting research and implementation of green hydrogen technologies', 7000000, '2025-09-01', '2027-03-31', ARRAY['hydrogen', 'renewable energy', 'research'], 'grant')`,
            
            `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type) 
            VALUES ('Wind Energy Excellence Program', 'Enhancing wind energy capacity and efficiency in coastal regions', 4200000, '2025-05-30', '2026-10-15', ARRAY['wind energy', 'renewable energy', 'coastal'], 'grant')`,
            
            `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type) 
            VALUES ('Sustainable Energy Transition Fund', 'Supporting SMEs in transitioning to renewable energy sources', 2800000, '2025-08-15', '2026-09-30', ARRAY['renewable energy', 'SME', 'sustainability'], 'loan')`
          ],
          expectedResults: "5 funding programs related to renewable energy with details on budget, deadlines, and focus areas."
        };
        
        setAnalysis(renewableSampleData);
        setShowDialog(true);
      } else {
        // Call the analyze-query edge function for non-energy queries
        const { data, error } = await supabase.functions.invoke('analyze-query', {
          body: { query }
        });
        
        if (error) {
          console.error("Error calling analyze-query function:", error);
          toast({
            title: "Error",
            description: "Failed to analyze the query: " + error.message,
            variant: "destructive",
          });
          return;
        }
        
        setAnalysis(data);
        setShowDialog(true);
      }
      
    } catch (error) {
      console.error("Error analyzing query:", error);
      toast({
        title: "Error",
        description: "Failed to analyze the query: " + (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handlePopulate = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Cannot request data for an empty query.",
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
            Analyzing Query...
          </>
        ) : (
          <>
            <DatabaseIcon className="h-4 w-4 mr-2" />
            Request Data for This Query
          </>
        )}
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Database Population Analysis</DialogTitle>
            <DialogDescription>
              The AI has analyzed your query and suggested data to populate the database.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 mt-4 pr-4">
            {analysis ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-1">Analysis</h3>
                  <p className="text-sm">{analysis.analysis}</p>
                </div>
                
                {analysis.tables && analysis.tables.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Tables Requiring Data</h3>
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
                    <h3 className="text-sm font-semibold mb-1">Expected Results</h3>
                    <div className="bg-slate-100 p-3 rounded text-sm">
                      <pre>{typeof analysis.expectedResults === 'string' 
                        ? analysis.expectedResults 
                        : JSON.stringify(analysis.expectedResults, null, 2)}</pre>
                    </div>
                  </div>
                )}
                
                <Alert>
                  <AlertDescription>
                    This will execute the SQL INSERT statements above to populate your database with sample data.
                    After execution, try running your query again.
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
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
