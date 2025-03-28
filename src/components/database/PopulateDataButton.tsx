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
        throw new Error(`Failed to analyze query: ${error.message}`);
      }
      
      setAnalysis(data);
      setShowDialog(true);
      
    } catch (error) {
      console.error("Error analyzing query:", error);
      toast({
        title: "Error",
        description: `Failed to analyze query: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
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
        
        const { error } = await supabase.rpc('execute_sql_query', {
          sql_query: insertSql
        });
        
        if (error) {
          throw new Error(`Error executing SQL: ${error.message}`);
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
