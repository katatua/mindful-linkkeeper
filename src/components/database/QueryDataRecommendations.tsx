
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowDown, Loader2 } from 'lucide-react';
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
