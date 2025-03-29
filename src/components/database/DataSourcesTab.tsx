
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
import { fetchTableData, insertTableData } from '@/utils/databaseService';
import AddDataSourceModal from './AddDataSourceModal';

export const DataSourcesTab: React.FC = () => {
  const [dataSources, setDataSources] = useState<FonteDados[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const additionalDefaultSources = [
    {
      nome_sistema: "Dados sobre Cooperação Internacional",
      descricao: "Dados relativos à Bolsa de Tecnologia e Negócios, onde a procura e a oferta de tecnologias são valorizadas.",
      tecnologia: "Outsystems (SQL Server)",
      entidade: "ANI"
    },
    {
      nome_sistema: "Dados sobre Empreendedorismo, Inovação e Clusters",
      descricao: "Dados relativos clusters de inovação colaborativa e empreendedorismo, que coabitam no mesmo local e possuem características e objetivos semelhantes.",
      tecnologia: "Outsystems (SQL Server)",
      entidade: "ANI"
    },
    {
      nome_sistema: "Dados constantes no Portal da Inovação SNI",
      descricao: "Dados relativos à atribuição de financiamento através de fundos europeus a entidades empresariais e não empresariais",
      tecnologia: "Outsystems (SQL Server)",
      entidade: "ANI"
    },
    {
      nome_sistema: "Dados sobre a ENEI 2020",
      descricao: "Dados relativos à estratégia nacional para especialização inteligente dando prioridade às intervenções públicas em matéria de I&D e Inovação.",
      tecnologia: "Azure (SQL Server)",
      entidade: "ANI"
    },
    {
      nome_sistema: "Dados sobre projetos da Missão Interface",
      descricao: "Dados relativos a projetos/candidaturas ao programa de financiamento base das instituições interface, visando alavancar a sua capacidade de mediação e articulação entre a academia e as empresas.",
      tecnologia: ".NET + SQL Server",
      entidade: "ANI"
    }
  ];
  
  const fetchDataSources = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTableData('fontes_dados');
      
      // If no data sources exist or there are fewer than expected, add the default ones
      if (data.length < 2 + additionalDefaultSources.length) {
        console.log("Adding default data sources");
        
        // Only add additional sources if they don't already exist
        for (const source of additionalDefaultSources) {
          const exists = data.some(
            existingSource => existingSource.nome_sistema === source.nome_sistema
          );
          
          if (!exists) {
            console.log(`Adding source: ${source.nome_sistema}`);
            await insertTableData('fontes_dados', source);
          }
        }
        
        // Fetch again to get the updated list including our newly added sources
        const updatedData = await fetchTableData('fontes_dados');
        setDataSources(updatedData as FonteDados[]);
      } else {
        setDataSources(data as FonteDados[]);
      }
    } catch (error) {
      console.error('Error fetching data sources:', error);
      // Set some initial data if fetch fails
      setDataSources([
        {
          id: 1,
          nome_sistema: "Diversas origens distribuídas por vários repositórios/sistemas de armazenamento",
          descricao: "Candidaturas de projetos; projetos; pareceres de peritos; respostas a questionários; representações; relatórios diversos; estudos; etc.",
          tecnologia: "Documentos PDF; Documentos Word; Documentos Excel; Outros formatos office; Outros documentos em formato open source",
          data_importacao: new Date().toISOString()
        },
        {
          id: 2,
          nome_sistema: "Dados de projetos financiados por Fundos Europeus de gestão centralizada",
          descricao: "Dados relativos à atribuição de financiamento através de fundos europeus de gestão centralizada a entidades empresariais e não empresariais.",
          tecnologia: "Outsystems (SQL Server)",
          data_importacao: new Date().toISOString()
        },
        // Include additional sources in the fallback data as well
        ...additionalDefaultSources.map((source, index) => ({
          id: 3 + index,
          nome_sistema: source.nome_sistema,
          descricao: source.descricao,
          tecnologia: source.tecnologia,
          entidade: source.entidade,
          data_importacao: new Date().toISOString()
        }))
      ]);
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
        Esta seção centraliza todas as fontes de dados fornecidas pela ANI, incluindo suas descrições, 
        dados extraídos e comandos necessários para inserção na base de dados.
      </p>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : dataSources.length > 0 ? (
        <>
          {dataSources.map((source) => (
            <Card key={source.id} className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">{source.nome_sistema}</CardTitle>
                  <Badge variant="outline">
                    {new Date(source.data_importacao || '').toLocaleDateString()}
                  </Badge>
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
          ))}
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
