
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Database as DatabaseIcon, ArrowDown, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
        title: "Error",
        description: "No insert statements to execute.",
        variant: "destructive",
      });
      return;
    }
    
    setIsInserting(true);
    try {
      // Execute each insert statement
      const tables: string[] = [];
      for (const insertSql of insertStatements) {
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
        
        // Check if data is an object with status property
        const hasError = error || (
          data && 
          typeof data === 'object' && 
          'status' in data && 
          data.status === 'error'
        );
        
        if (hasError) {
          const errorMessage = error ? error.message : (
            data && 
            typeof data === 'object' && 
            'message' in data ? 
            data.message : 
            'Unknown error'
          );
          
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
      
      // Call the onInsertSuccess callback if provided
      if (onInsertSuccess) {
        onInsertSuccess();
      }
      
    } catch (error) {
      console.error("Error executing inserts:", error);
      toast({
        title: "Error",
        description: `Failed to populate database: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
        <h3 className="text-sm font-medium">Recommended Data</h3>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleInsertData}
          disabled={isInserting}
          className="flex items-center gap-1"
        >
          {isInserting ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Inserting...
            </>
          ) : (
            <>
              <ArrowDown className="h-4 w-4 mr-1" />
              Insert in Database
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
