
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateResponse } from '@/utils/aiUtils';
import { Loader2, Database, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Markdown from 'react-markdown';
import { Textarea } from '@/components/ui/textarea';

const DatabaseQuery: React.FC = () => {
  const [results, setResults] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string>(`SELECT
    'links' AS table_name,
    COUNT(*) AS record_count
FROM
    links
UNION ALL
SELECT
    'document_notes',
    COUNT(*)
FROM
    document_notes
UNION ALL
SELECT
    'notes',
    COUNT(*)
FROM
    notes
UNION ALL
SELECT
    'tasks',
    COUNT(*)
FROM
    tasks;`);
  const { toast } = useToast();

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Consulta SQL Vazia",
        description: "Por favor, insira uma consulta SQL válida."
      });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Use the SQL query directly to execute
      const response = await generateResponse(`Execute esta consulta SQL específica: ${sqlQuery}`);
      
      // Check if the response contains an error message
      if (response.toLowerCase().includes("erro") || response.toLowerCase().includes("error")) {
        setError(response);
        toast({
          variant: "destructive",
          title: "Erro na Consulta do Banco de Dados",
          description: "Houve um erro ao executar a consulta SQL. Verifique os detalhes do erro."
        });
      } else {
        setResults(response);
        toast({
          title: "Consulta Executada",
          description: "A consulta SQL foi executada com sucesso."
        });
      }
    } catch (error) {
      console.error("Error querying database:", error);
      setError("Erro ao consultar o banco de dados. Por favor, tente novamente mais tarde.");
      toast({
        variant: "destructive",
        title: "Falha na Consulta do Banco de Dados",
        description: "Houve um erro ao buscar dados do banco de dados."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Consulta SQL do Banco de Dados
        </CardTitle>
        <CardDescription>Execute consultas SQL personalizadas no banco de dados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="sql-query" className="block text-sm font-medium mb-2">
            Consulta SQL
          </label>
          <Textarea
            id="sql-query"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="Insira sua consulta SQL aqui..."
            className="font-mono text-sm"
            rows={8}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Executando consulta SQL...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Erro na consulta do banco de dados</h4>
                <div className="mt-2 text-sm text-red-700 prose prose-sm max-w-none">
                  <Markdown>{error}</Markdown>
                </div>
              </div>
            </div>
          </div>
        ) : results ? (
          <div className="border rounded-md p-4 bg-white">
            <div className="prose prose-sm max-w-none">
              <Markdown>{results}</Markdown>
            </div>
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={executeQuery} 
          disabled={loading || !sqlQuery.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executando Consulta...
            </>
          ) : (
            "Executar Consulta SQL"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseQuery;
