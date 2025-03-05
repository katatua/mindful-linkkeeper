
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateResponse } from '@/utils/aiUtils';
import { Loader2, Database, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Markdown from 'react-markdown';

const DatabaseQuery: React.FC = () => {
  const [results, setResults] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkDatabaseContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await generateResponse(
        "Mostre-me quais dados estão no banco de dados. Execute uma consulta que conte registros em cada tabela (links, document_notes, notes e tasks) e formate os resultados em uma tabela clara."
      );
      
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
          Informações do Banco de Dados
        </CardTitle>
        <CardDescription>Verifique quais dados estão armazenados no banco de dados</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Consultando banco de dados...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Erro na consulta do banco de dados</h4>
                <div className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
                  <Markdown>{error}</Markdown>
                </div>
              </div>
            </div>
          </div>
        ) : results ? (
          <div className="prose prose-sm max-w-none">
            <Markdown>{results}</Markdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
            <Database className="h-12 w-12 mb-4 text-gray-400" />
            <p>Clique no botão abaixo para verificar quais dados estão no banco de dados.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={checkDatabaseContent} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando Banco de Dados...
            </>
          ) : (
            "Verificar Conteúdo do Banco de Dados"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseQuery;
