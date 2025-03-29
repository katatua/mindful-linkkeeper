
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, FileText, FilePlus, Upload, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FonteDados } from '@/types/databaseTypes';
import { fetchTableData, fetchDatabaseTables, DatabaseTable, insertTableData } from '@/utils/databaseService';
import AddDataSourceModal from './AddDataSourceModal';

export const DataSourcesTab: React.FC = () => {
  const [dataSources, setDataSources] = useState<FonteDados[]>([]);
  const [databaseTables, setDatabaseTables] = useState<DatabaseTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const fetchDataSources = async () => {
    setIsLoading(true);
    try {
      // Fetch database tables first
      const tables = await fetchDatabaseTables();
      setDatabaseTables(tables);
      
      // Fetch data from fontes_dados table
      const data = await fetchTableData('fontes_dados');
      
      // If we have data, use it
      if (data && data.length > 0) {
        setDataSources(data as FonteDados[]);
      } else {
        setDataSources([]);
      }
    } catch (error) {
      console.error('Error fetching data sources:', error);
      setDataSources([]);
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
      table.table_name.toLowerCase() === fonte.nome_sistema.toLowerCase() ||
      table.table_name.toLowerCase().includes(fonte.nome_sistema.toLowerCase().replace(/\s+/g, '_')) ||
      fonte.nome_sistema.toLowerCase().includes(table.table_name.toLowerCase().replace(/_/g, ' '))
    );
  };
  
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
                      <p>{source.descricao}</p>
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
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <Database className="mr-2 h-4 w-4" />
                        Comando de Importação
                      </h3>
                      <ScrollArea className="h-[100px] w-full rounded-md border p-4 bg-gray-50">
                        <pre className="text-xs text-gray-700">
{`INSERT INTO fontes_dados (nome_sistema, descricao, tecnologia, entidade, data_importacao)
VALUES (
    '${source.nome_sistema}',
    '${source.descricao}',
    '${source.tecnologia}',
    ${source.entidade ? `'${source.entidade}'` : 'NULL'},
    CURRENT_TIMESTAMP
);`}
                        </pre>
                      </ScrollArea>
                    </div>
                    
                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Dados Extraídos (Exemplo)
                      </h3>
                      <ScrollArea className="h-[150px] w-full rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead>Data Extração</TableHead>
                              <TableHead>Detalhes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>001</TableCell>
                              <TableCell>Estatísticas</TableCell>
                              <TableCell>{new Date().toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">Ver Detalhes</Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
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
              Adicione sua primeira fonte de dados clicando no botão abaixo.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Adicionar Fonte
            </Button>
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
