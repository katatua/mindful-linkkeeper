
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { DatabaseIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PopulateDataButtonProps {
  query: string;
  queryId?: string;
}

export const PopulateDataButton: React.FC<PopulateDataButtonProps> = ({ query, queryId }) => {
  const [isPopulating, setIsPopulating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [executing, setExecuting] = useState(false);
  const { toast } = useToast();
  
  // Helper function to generate fallback inserts for common tables
  const generateFallbackInserts = (query: string) => {
    // Extract table name and conditions from the query
    const tableMatch = query.match(/from\s+([^\s,]+)/i);
    const tableName = tableMatch ? tableMatch[1].replace(/["`']/g, '').trim() : '';
    
    // Extract where conditions
    const whereMatch = query.match(/where\s+(.+?)(?:group by|order by|limit|$)/i);
    const whereClause = whereMatch ? whereMatch[1].trim() : '';
    
    // Extract region and year if present
    const regionMatch = whereClause.match(/region\s*=\s*['"]?([^'"]+)['"]?/i);
    const region = regionMatch ? regionMatch[1] : 'Lisbon';
    
    const yearMatch = whereClause.match(/(?:date|year)\s*=\s*['"]?(\d{4})['"]?/i) || 
                     query.match(/(\d{4})/);
    const year = yearMatch ? yearMatch[1] : '2024';
    
    // Default sample data based on the table
    if (tableName.includes('metrics')) {
      return [
        `INSERT INTO ani_metrics (name, category, value, measurement_date, region, sector, unit, source) 
         VALUES ('R&D Investment', 'Investment', 450000000, '${year}-06-01', '${region}', 'All Sectors', 'EUR', 'ANI Annual Report')`,
        
        `INSERT INTO ani_metrics (name, category, value, measurement_date, region, sector, unit, source)
         VALUES ('Patent Applications', 'Innovation Output', 850, '${year}-06-01', '${region}', 'Technology', 'Count', 'National Patent Office')`,
         
        `INSERT INTO ani_metrics (name, category, value, measurement_date, region, sector, unit, source)
         VALUES ('Startup Creation', 'Entrepreneurship', 120, '${year}-06-01', '${region}', 'All Sectors', 'Count', 'Startup Portugal')`,
         
        `INSERT INTO ani_metrics (name, category, value, measurement_date, region, sector, unit, source)
         VALUES ('Innovation Index', 'Composite Indicators', 78.5, '${year}-06-01', '${region}', 'All Sectors', 'Score', 'Innovation Monitor')`
      ];
    } 
    else if (tableName.includes('projects')) {
      return [
        `INSERT INTO ani_projects (title, description, funding_amount, start_date, end_date, status, sector, region, organization)
         VALUES ('Smart City ${region}', 'Implementation of IoT sensors across ${region} for urban monitoring', 2500000, '${year}-03-15', '${year}-12-31', 'in_progress', 'Technology', '${region}', 'Tech Solutions Ltd')`,
         
        `INSERT INTO ani_projects (title, description, funding_amount, start_date, end_date, status, sector, region, organization)
         VALUES ('Renewable Energy Hub', 'Development of a renewable energy research center', 3800000, '${year}-01-20', '${year}-11-30', 'in_progress', 'Renewable Energy', '${region}', 'GreenPower Institute')`
      ];
    } 
    else if (tableName.includes('funding_programs')) {
      return [
        `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type)
         VALUES ('${region} Innovation Fund ${year}', 'Funding for innovative projects in the ${region} region', 15000000, '${year}-08-30', '${year}-12-31', ARRAY['Technology','Renewable Energy','Biotech'], 'Grant')`,
         
        `INSERT INTO ani_funding_programs (name, description, total_budget, application_deadline, end_date, sector_focus, funding_type)
         VALUES ('SME Digital Transformation', 'Supporting digital transformation of SMEs in ${region}', 8500000, '${year}-09-15', '${year}-12-31', ARRAY['Digital','Technology'], 'Mixed')`
      ];
    }
    else if (tableName.includes('policy_frameworks')) {
      return [
        `INSERT INTO ani_policy_frameworks (title, description, implementation_date, status, key_objectives)
         VALUES ('${region} Innovation Strategy ${year}', 'Strategic framework for innovation development in ${region}', '${year}-01-01', 'active', ARRAY['Increase R&D spending','Support entrepreneurship','Enhance tech transfer'])`
      ];
    }
    else if (tableName.includes('international_collaborations')) {
      return [
        `INSERT INTO ani_international_collaborations (program_name, country, partnership_type, focus_areas, start_date, end_date, total_budget)
         VALUES ('${region}-EU Innovation Partnership', 'European Union', 'Research', ARRAY['Renewable Energy','Artificial Intelligence'], '${year}-01-01', '${year}-12-31', 7500000)`,
         
        `INSERT INTO ani_international_collaborations (program_name, country, partnership_type, focus_areas, start_date, end_date, total_budget)
         VALUES ('${region}-US Tech Exchange', 'United States', 'Technology Transfer', ARRAY['Biotechnology','Digital Health'], '${year}-03-15', '${year}-12-31', 4200000)`
      ];
    }
    else {
      // Generic fallback
      return [
        `INSERT INTO ani_metrics (name, category, value, measurement_date, region, sector, unit, source) 
         VALUES ('R&D Investment', 'Investment', 450000000, '${year}-06-01', '${region}', 'All Sectors', 'EUR', 'ANI Annual Report')`
      ];
    }
  };
  
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
      // Call the analyze-query edge function
      const { data, error } = await supabase.functions.invoke('analyze-query', {
        body: { query }
      });
      
      if (error) {
        console.error("Error calling analyze-query function:", error);
        
        // Create fallback analysis if the function fails
        const fallbackInserts = generateFallbackInserts(query);
        const fallbackAnalysis = {
          analysis: "The database doesn't contain the data requested in your query. We've generated sample data that should satisfy your query conditions.",
          tables: [query.match(/from\s+([^\s,]+)/i)?.[1].replace(/["`']/g, '').trim() || 'ani_metrics'],
          insertStatements: fallbackInserts,
          expectedResults: "After inserting this data, your query should return relevant results."
        };
        
        setAnalysis(fallbackAnalysis);
        setShowDialog(true);
        return;
      }
      
      setAnalysis(data);
      setShowDialog(true);
      
    } catch (error) {
      console.error("Error analyzing query:", error);
      
      // Create fallback analysis if an exception occurs
      const fallbackInserts = generateFallbackInserts(query);
      const fallbackAnalysis = {
        analysis: "There was an error analyzing your query, but we've generated sample data that might help.",
        tables: [query.match(/from\s+([^\s,]+)/i)?.[1].replace(/["`']/g, '').trim() || 'ani_metrics'],
        insertStatements: fallbackInserts,
        expectedResults: "After inserting this data, you can try running your query again."
      };
      
      setAnalysis(fallbackAnalysis);
      setShowDialog(true);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleExecuteInserts = async () => {
    if (!analysis || !analysis.insertStatements || analysis.insertStatements.length === 0) {
      toast({
        title: "Error",
        description: "No insert statements to execute.",
        variant: "destructive",
      });
      return;
    }
    
    setExecuting(true);
    try {
      // Execute each insert statement
      const tables: string[] = [];
      for (const insertSql of analysis.insertStatements) {
        // Extract table name from INSERT INTO statement
        const tableMatch = insertSql.match(/INSERT INTO\s+([^\s\(]+)/i);
        if (tableMatch && tableMatch[1] && !tables.includes(tableMatch[1])) {
          tables.push(tableMatch[1]);
        }
        
        console.log("Executing SQL:", insertSql);
        
        const { data, error } = await supabase.rpc('execute_sql_query', {
          sql_query: insertSql
        });
        
        console.log("SQL execution result:", data, error);
        
        if (error || (data && data.status === 'error')) {
          const errorMessage = error ? error.message : (data ? data.message : 'Unknown error');
          throw new Error(`Error executing SQL: ${errorMessage}`);
        }
      }
      
      // Update query_history to indicate data was populated
      if (queryId) {
        await supabase.from('query_history').update({
          was_successful: true,
          created_tables: tables,
          error_message: null
        }).eq('id', queryId);
      }
      
      toast({
        title: "Success",
        description: "Database successfully populated with sample data. Try your query again.",
      });
      
      // Close the dialog
      setShowDialog(false);
      
    } catch (error) {
      console.error("Error executing inserts:", error);
      toast({
        title: "Error",
        description: `Failed to populate database: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setExecuting(false);
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
        disabled={isPopulating || isAnalyzing}
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
                  <div>
                    <h3 className="text-sm font-semibold mb-1">SQL Statements to Execute</h3>
                    <div className="bg-slate-100 p-3 rounded text-sm font-mono whitespace-pre-wrap">
                      {analysis.insertStatements.join(';\n\n')}
                    </div>
                  </div>
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
              Cancel
            </Button>
            <Button 
              onClick={handleExecuteInserts}
              disabled={executing || !analysis}
            >
              {executing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                'Populate Database'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
