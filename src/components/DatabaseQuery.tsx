
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Database, AlertTriangle, BookOpen, ServerCrash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Markdown from 'react-markdown';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQueryProcessor } from '@/hooks/useQueryProcessor';
import DatabaseConnectionTest from './DatabaseConnectionTest';
import { useVisualization } from '@/hooks/useVisualization';
import DataVisualization from './DataVisualization';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { testDatabaseConnection } from '@/utils/databaseDiagnostics';

const EXAMPLE_QUERIES = {
  tablesCount: `SELECT
  'ani_projects' AS table_name,
  COUNT(*) AS record_count
FROM
  ani_projects
UNION ALL
SELECT
  'ani_funding_programs',
  COUNT(*)
FROM
  ani_funding_programs
UNION ALL
SELECT
  'ani_policy_frameworks',
  COUNT(*)
FROM
  ani_policy_frameworks
UNION ALL
SELECT
  'ani_metrics',
  COUNT(*)
FROM
  ani_metrics`,
  activeProjects: `SELECT 
  title, 
  description, 
  funding_amount, 
  sector, 
  region, 
  organization,
  start_date,
  end_date
FROM 
  ani_projects 
WHERE 
  status = 'active'`,
  rdInvestment: `SELECT 
  name, 
  value, 
  unit, 
  measurement_date, 
  source
FROM 
  ani_metrics 
WHERE 
  category = 'Investment' 
  AND name LIKE '%R&D%'
ORDER BY 
  measurement_date DESC`,
  patentMetrics: `SELECT 
  name, 
  value, 
  unit, 
  measurement_date, 
  source
FROM 
  ani_metrics 
WHERE 
  category = 'Intellectual Property' 
  AND name LIKE '%Patent%'
ORDER BY 
  measurement_date DESC`,
  fundingPrograms: `SELECT 
  name, 
  description, 
  total_budget, 
  start_date, 
  end_date, 
  sector_focus 
FROM 
  ani_funding_programs
ORDER BY
  total_budget DESC`,
  upcomingDeadlines: `SELECT 
  name, 
  description,
  total_budget,
  application_deadline,
  next_call_date,
  sector_focus
FROM 
  ani_funding_programs
WHERE 
  application_deadline >= CURRENT_DATE
ORDER BY 
  application_deadline ASC
LIMIT 10`,
  regionalMetrics: `SELECT
  region,
  name,
  value,
  unit,
  measurement_date
FROM
  ani_metrics
WHERE
  region IS NOT NULL
ORDER BY
  region, measurement_date DESC`,
  innovationPerformance: `SELECT
  name,
  category,
  value,
  unit,
  region
FROM
  ani_metrics
WHERE
  name LIKE '%Performance%'
  OR name LIKE '%Innovation%'
ORDER BY
  region, name`
};

const DatabaseQuery: React.FC = () => {
  const [results, setResults] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string>(EXAMPLE_QUERIES.tablesCount);
  const [initialConnectionChecked, setInitialConnectionChecked] = useState(false);
  const [isConnectionOk, setIsConnectionOk] = useState(false);
  const { toast } = useToast();
  const { showVisualization, setShowVisualization, visualizationData, setVisualizationData, handleVisualizationData } = useVisualization();
  
  const { executeQuery } = useQueryProcessor();

  // Check connection on component mount
  useEffect(() => {
    checkInitialConnection();
  }, []);

  const checkInitialConnection = async () => {
    try {
      const connectionResult = await testDatabaseConnection();
      setIsConnectionOk(connectionResult.success);
      setInitialConnectionChecked(true);
      
      if (!connectionResult.success) {
        setError("Database connection is not available. Use the connection test button below to troubleshoot.");
      }
    } catch (e) {
      console.error("Initial connection check failed:", e);
      setIsConnectionOk(false);
      setInitialConnectionChecked(true);
      setError("Failed to perform initial connection check.");
    }
  };

  const handleSelectQuery = (queryKey: string) => {
    if (queryKey in EXAMPLE_QUERIES) {
      setSqlQuery(EXAMPLE_QUERIES[queryKey as keyof typeof EXAMPLE_QUERIES]);
    }
  };

  const handleExecuteQuery = async () => {
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
    setShowVisualization(false);
    
    try {
      const { response, visualizationData, error: queryError, isConnectionError } = await executeQuery(sqlQuery.trim());
      
      if (queryError) {
        throw new Error(queryError);
      }
      
      if (response) {
        setResults(response);
        
        if (visualizationData && visualizationData.length > 0) {
          setVisualizationData(visualizationData);
          setShowVisualization(true);
          
          toast({
            title: "Visualização Disponível",
            description: "Os dados podem ser visualizados em um gráfico. Verifique as opções de visualização."
          });
        } else {
          toast({
            title: "Consulta Executada",
            description: "A consulta SQL foi executada com sucesso."
          });
        }
      } else {
        throw new Error("Resposta vazia do servidor");
      }
    } catch (error) {
      console.error("Error querying database:", error);
      const isConnectionError = error.message?.includes('connection') || 
                                error.message?.includes('network') ||
                                error.message?.includes('Failed to send');
      
      setError(`${isConnectionError ? 'Database connection error: ' : 'Error executing query: '}${error instanceof Error ? error.message : String(error)}`);
      
      toast({
        variant: "destructive",
        title: isConnectionError ? "Falha na Conexão com o Banco de Dados" : "Falha na Consulta do Banco de Dados",
        description: isConnectionError 
          ? "Não foi possível conectar ao banco de dados. Verifique a conexão e as configurações do Supabase."
          : "Houve um erro ao executar a consulta SQL."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showVisualization && visualizationData.length > 0 && (
        <DataVisualization 
          data={visualizationData} 
          onClose={() => setShowVisualization(false)}
        />
      )}
      
      <Card className="w-full max-w-3xl mx-auto my-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Consulta SQL do Banco de Dados ANI
          </CardTitle>
          <CardDescription>Execute consultas SQL personalizadas no banco de dados da Agência Nacional de Inovação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {initialConnectionChecked && !isConnectionOk && (
            <Alert variant="destructive" className="mb-4">
              <ServerCrash className="h-4 w-4" />
              <AlertTitle>Problema de conexão com o banco de dados</AlertTitle>
              <AlertDescription>
                Não foi possível estabelecer conexão com o banco de dados. 
                Verifique a configuração do Supabase e use o botão de diagnóstico abaixo para identificar o problema.
              </AlertDescription>
            </Alert>
          )}

          <div>
            <label htmlFor="query-template" className="block text-sm font-medium mb-2">
              Consultas de Exemplo
            </label>
            <Select onValueChange={handleSelectQuery}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma consulta de exemplo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Consultas Gerais</SelectLabel>
                  <SelectItem value="tablesCount">Contagem de Registros nas Tabelas</SelectItem>
                  <SelectItem value="activeProjects">Projetos Ativos</SelectItem>
                  <SelectItem value="fundingPrograms">Programas de Financiamento</SelectItem>
                  <SelectItem value="upcomingDeadlines">Prazos de Candidatura</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Métricas</SelectLabel>
                  <SelectItem value="rdInvestment">Investimento em P&D</SelectItem>
                  <SelectItem value="patentMetrics">Métricas de Patentes</SelectItem>
                  <SelectItem value="regionalMetrics">Métricas por Região</SelectItem>
                  <SelectItem value="innovationPerformance">Desempenho de Inovação</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="sql-query" className="block text-sm font-medium">
                Consulta SQL
              </label>
              <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 h-7">
                <BookOpen className="h-3 w-3" />
                Ajuda SQL
              </Button>
            </div>
            <Textarea
              id="sql-query"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="Insira sua consulta SQL aqui..."
              className="font-mono text-sm"
              rows={8}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleExecuteQuery} 
              disabled={loading || (!isConnectionOk && initialConnectionChecked)}
              className="flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Executar Consulta
            </Button>
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
            <div className="border rounded-md p-4 bg-white overflow-auto max-h-96">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <Markdown>{results}</Markdown>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto opacity-20 mb-2" />
              <p>Execute uma consulta para ver os resultados aqui</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <DatabaseConnectionTest />
          <div className="text-xs text-muted-foreground">
            Todas as consultas são executadas em um ambiente seguro e isolado
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default DatabaseQuery;
