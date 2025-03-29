
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, FileText, FilePlus, Upload, RefreshCw, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FonteDados } from '@/types/databaseTypes';
import { fetchTableData, fetchDatabaseTables, DatabaseTable, insertTableData } from '@/utils/databaseService';
import AddDataSourceModal from './AddDataSourceModal';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Predefined data sources based on provided information
const predefinedDataSources: Partial<FonteDados>[] = [
  {
    nome_sistema: "Diversas origens distribuídas por vários repositórios/sistemas de armazenamento",
    descricao: "Candidaturas de projetos; projetos; pareceres de peritos; respostas a questionários; representações; relatórios diversos; estudos; etc.",
    tecnologia: "Documentos PDF; Documentos Word; Documentos Excel; Outros formatos office; Outros documentos em formato open source",
  },
  {
    nome_sistema: "Dados de projetos financiados por Fundos Europeus de gestão centralizada",
    descricao: "Dados relativos à atribuição de financiamento através de fundos europeus de gestão centralizada a entidades empresariais e não empresariais.",
    tecnologia: "Outsystems (SQL Server)",
    entidade: "Horizonte Europa, Programa Europa Digital"
  },
  {
    nome_sistema: "Dados de projetos financiados por Fundos Europeus e por Fundos Nacionais",
    descricao: "Dados relativos à atribuição de financiamento através de fundos europeus e por fundos nacionais a entidades empresariais e não empresariais.",
    tecnologia: "Outsystems (SQL Server)",
    entidade: "rede EUREKA"
  },
  {
    nome_sistema: "Pedidos de incentivos fiscais",
    descricao: "Dados relativos à atribuição de incentivos fiscais a entidades empresariais e não empresariais apoiando o seu esforço em Investigação & Desenvolvimento através da dedução à coleta do IRC.",
    tecnologia: "Outsystems (SQL Server)",
    entidade: "SIFIDE"
  },
  {
    nome_sistema: "Instituições de I&D",
    descricao: "Dados relativos ao mapeamento das entidades que fazem Investigação & Desenvolvimento em Portugal e na Europa.",
    tecnologia: "Outsystems (SQL Server)"
  },
  {
    nome_sistema: "Dados sobre Cooperação Internacional",
    descricao: "Dados relativos à Bolsa de Tecnologia e Negócios, onde a procura e a oferta de tecnologias são valorizadas.",
    tecnologia: "Outsystems (SQL Server)"
  },
  {
    nome_sistema: "Dados sobre Empreendedorismo, Inovação e Clusters",
    descricao: "Dados relativos clusters de inovação colaborativa e empreendedorismo, que coabitam no mesmo local e possuem características e objetivos semelhantes.",
    tecnologia: "Outsystems (SQL Server)"
  },
  {
    nome_sistema: "Dados constantes no Portal da Inovação SNI",
    descricao: "Dados relativos à atribuição de financiamento através de fundos europeus a entidades empresariais e não empresariais",
    tecnologia: "Outsystems (SQL Server)"
  },
  {
    nome_sistema: "Dados sobre a ENEI 2020",
    descricao: "Dados relativos à estratégia nacional para especialização inteligente dando prioridade às intervenções públicas em matéria de I&D e Inovação.",
    tecnologia: "Azure (SQL Server)",
    entidade: "Estratégia Nacional de Investigação e Inovação para uma Especialização Inteligente 2014-2020"
  },
  {
    nome_sistema: "Dados sobre projetos da Missão Interface",
    descricao: "Dados relativos a projetos/candidaturas ao programa de financiamento base das instituições interface, visando alavancar a sua capacidade de mediação e articulação entre a academia e as empresas, nomeadamente através do apoio à dinamização de infraestruturas de transferência de conhecimentos e tecnologia, como os Centros de Tecnologia e Inovação (CTI) e os Laboratórios Colaborativos (CoLAB).",
    tecnologia: ".NET + SQL Server"
  },
  {
    nome_sistema: "Dados sobre a Qualificação e Certificação de Reconhecimento de Idoneidade",
    descricao: "Dados relativos a projetos/candidaturas que consistem em ambientes físicos, geograficamente localizados, em ambiente real ou quase real, utilizados para a realização de testes e experimentação de processos inovadores de base tecnologia.",
    tecnologia: "Outsystems (SQL Server)"
  },
  {
    nome_sistema: "Dados de projetos com enquadramento em Zonas Livres Tecnológicas",
    descricao: "Fonte de informação complementar sobre investigação e inovação em zonas tecnológicas de experimentação.",
    tecnologia: "Outsystems (SQL Server)"
  }
];

export const DataSourcesTab: React.FC = () => {
  const [dataSources, setDataSources] = useState<FonteDados[]>([]);
  const [databaseTables, setDatabaseTables] = useState<DatabaseTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const initializeDataSources = async () => {
    setIsInitializing(true);
    setAccessError(null);
    try {
      // Check if we already have data sources
      const existingData = await fetchTableData('fontes_dados');
      
      // If no data, insert the predefined data sources
      if (existingData.length === 0) {
        console.log("No data sources found. Initializing with predefined data...");
        
        let successCount = 0;
        let errorCount = 0;
        
        // Insert each predefined data source sequentially
        for (const source of predefinedDataSources) {
          try {
            await insertTableData('fontes_dados', source);
            console.log(`Added data source: ${source.nome_sistema}`);
            successCount++;
          } catch (error) {
            console.error(`Error adding data source: ${source.nome_sistema}`, error);
            errorCount++;
            
            // If we're seeing RLS policy violations, break early
            if (error.message && error.message.includes('row-level security policy')) {
              setAccessError('Erro de permissão: Você não tem permissão para inserir dados. Contacte o administrador do sistema.');
              break;
            }
          }
        }
        
        if (successCount > 0) {
          toast({
            title: `${successCount} fontes de dados inicializadas`,
            description: "As fontes de dados predefinidas foram carregadas com sucesso.",
          });
        }
        
        if (errorCount > 0 && !accessError) {
          toast({
            title: `Erro ao inicializar ${errorCount} fontes de dados`,
            description: "Algumas fontes de dados não puderam ser carregadas.",
            variant: "destructive"
          });
        }
        
        // Fetch the newly inserted data
        await fetchDataSources();
      } else {
        console.log(`Data sources already exist in the database: ${existingData.length} records found.`);
      }
    } catch (error) {
      console.error("Error initializing data sources:", error);
      
      // Check if this is an RLS policy error
      if (error.message && error.message.includes('row-level security policy')) {
        setAccessError('Erro de permissão: Você não tem permissão para inserir dados. Contacte o administrador do sistema.');
      } else {
        setAccessError('Erro ao acessar o banco de dados. Verifique sua conexão ou contacte o suporte.');
      }
      
      toast({
        title: "Erro ao inicializar fontes de dados",
        description: "Não foi possível carregar as fontes de dados predefinidas.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const fetchDataSources = async () => {
    setIsLoading(true);
    setAccessError(null);
    try {
      // Fetch database tables first
      const tables = await fetchDatabaseTables();
      setDatabaseTables(tables);
      
      // Fetch data from fontes_dados table
      const data = await fetchTableData('fontes_dados');
      console.log(`Fetched ${data.length} data sources from fontes_dados table`);
      
      // If we have data, use it
      if (data && data.length > 0) {
        setDataSources(data as FonteDados[]);
      } else {
        setDataSources([]);
      }
    } catch (error) {
      console.error('Error fetching data sources:', error);
      setDataSources([]);
      
      // Check if this is an RLS policy error
      if (error.message && error.message.includes('row-level security policy')) {
        setAccessError('Erro de permissão: Você não tem permissão para acessar dados. Contacte o administrador do sistema.');
      } else {
        setAccessError('Erro ao acessar o banco de dados. Verifique sua conexão ou contacte o suporte.');
      }
      
      toast({
        title: "Erro ao carregar fontes de dados",
        description: "Não foi possível carregar as fontes de dados. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDataSources();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchDataSources();
  }, []);
  
  // Function to find matching database table for a data source
  const findMatchingTable = (fonte: FonteDados): DatabaseTable | undefined => {
    // Try to match by exact name or containing the fonte name
    return databaseTables.find(table => 
      table.table_name.toLowerCase() === fonte.nome_sistema.toLowerCase().replace(/\s+/g, '_') ||
      table.table_name.toLowerCase().includes(fonte.nome_sistema.toLowerCase().replace(/\s+/g, '_')) ||
      fonte.nome_sistema.toLowerCase().includes(table.table_name.toLowerCase().replace(/_/g, ' '))
    );
  };
  
  // Button to manually initialize data sources if empty
  const InitializeButton = () => (
    <Button 
      onClick={initializeDataSources} 
      disabled={isInitializing || dataSources.length > 0}
    >
      {isInitializing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Inicializando...
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" />
          Inicializar Fontes Predefinidas
        </>
      )}
    </Button>
  );
  
  if (accessError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Fontes de Dados</h2>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Tentar Novamente
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de Acesso ao Banco de Dados</AlertTitle>
          <AlertDescription>
            {accessError}
          </AlertDescription>
        </Alert>
        
        <Card className="py-8">
          <div className="flex flex-col items-center justify-center text-center p-4">
            <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
            <h3 className="text-lg font-medium">Permissões Insuficientes</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Você não tem permissões suficientes para acessar ou modificar as fontes de dados.
              Isso pode ser devido a políticas de segurança de linha (Row-Level Security) configuradas no banco de dados.
            </p>
            <p className="text-sm text-muted-foreground">
              Por favor, verifique se você está autenticado corretamente ou contacte o administrador do sistema.
            </p>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fontes de Dados</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <FilePlus className="mr-2 h-4 w-4" />
            Adicionar Fonte
          </Button>
        </div>
      </div>
      
      <p className="text-muted-foreground">
        Esta seção centraliza todas as fontes de dados disponíveis, incluindo descrições,
        tecnologias utilizadas e metadados das tabelas do banco de dados.
      </p>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : dataSources.length > 0 ? (
        <>
          {dataSources.map((source) => {
            const matchingTable = findMatchingTable(source);
            
            return (
              <Card key={source.id} className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">{source.nome_sistema}</CardTitle>
                    <div className="flex gap-2">
                      {matchingTable && (
                        <Badge variant="secondary">
                          Tabela: {matchingTable.table_name}
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {new Date(source.data_importacao || '').toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h3>
                      <p className="whitespace-pre-line">{source.descricao}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Tecnologia</h3>
                      <p>{source.tecnologia}</p>
                    </div>
                    
                    {source.entidade && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Entidade</h3>
                        <p>{source.entidade}</p>
                      </div>
                    )}
                    
                    {matchingTable && (
                      <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <Database className="mr-2 h-4 w-4" />
                          Estrutura da Tabela
                        </h3>
                        <ScrollArea className="h-[150px] w-full rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Coluna</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Obrigatório</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {matchingTable.columns.map((column) => (
                                <TableRow key={`${matchingTable.table_name}-${column.column_name}`}>
                                  <TableCell className="font-medium">{column.column_name}</TableCell>
                                  <TableCell>
                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                                      {column.data_type}
                                    </code>
                                  </TableCell>
                                  <TableCell>{column.is_nullable === 'NO' ? 'Sim' : 'Não'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </>
      ) : (
        <Card className="py-8">
          <div className="flex flex-col items-center justify-center text-center p-4">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhuma fonte de dados encontrada</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Inicialize as fontes de dados predefinidas ou adicione uma nova fonte manualmente.
            </p>
            <div className="flex gap-2">
              <InitializeButton />
              <Button onClick={() => setIsModalOpen(true)}>
                <FilePlus className="mr-2 h-4 w-4" />
                Adicionar Fonte
              </Button>
            </div>
          </div>
        </Card>
      )}

      <AddDataSourceModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={fetchDataSources}
      />
    </div>
  );
};
