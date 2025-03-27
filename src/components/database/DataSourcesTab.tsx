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
import { FonteDados, DocumentoExtraido } from '@/types/databaseTypes';
import { Link } from 'react-router-dom';
import AddDataSourceModal from './AddDataSourceModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const initialDataSources: FonteDados[] = [
  {
    id: 1,
    nome_sistema: "Diversas origens distribuídas por vários repositórios/sistemas de armazenamento",
    descricao: "Candidaturas de projetos; projetos; pareceres de peritos; respostas a questionários; representações; relatórios diversos; estudos; etc.",
    tecnologia: "Documentos PDF; Documentos Word; Documentos Excel; Outros formatos office; Outros documentos em formato open source",
    data_importacao: new Date().toISOString()
  },
  {
    id: 2,
    nome_sistema: "Dados de projetos financiados por Fundos Europeus de gestão centralizada (Horizonte Europa, Programa Europa Digital)",
    descricao: "Dados relativos à atribuição de financiamento através de fundos europeus de gestão centralizada a entidades empresariais e não empresariais.",
    tecnologia: "Outsystems (SQL Server)",
    data_importacao: new Date().toISOString()
  },
  {
    id: 3,
    nome_sistema: "Dados de projetos financiados por Fundos Europeus e por Fundos Nacionais (rede EUREKA)",
    descricao: "Dados relativos à atribuição de financiamento através de fundos europeus e por fundos nacionais a entidades empresariais e não empresariais.",
    tecnologia: "Outsystems (SQL Server)",
    data_importacao: new Date().toISOString()
  },
  {
    id: 4,
    nome_sistema: "Instituições de I&D",
    descricao: "Dados relativos ao mapeamento das entidades que fazem Investigação & Desenvolvimento em Portugal e na Europa.",
    tecnologia: "Outsystems (SQL Server)",
    data_importacao: new Date().toISOString()
  },
  {
    id: 5,
    nome_sistema: "Dados sobre Cooperação Internacional",
    descricao: "Dados relativos à Bolsa de Tecnologia e Negócios, onde a procura e a oferta de tecnologias são valorizadas.",
    tecnologia: "Outsystems (SQL Server)",
    data_importacao: new Date().toISOString()
  }
];

export const DataSourcesTab: React.FC = () => {
  const [dataSources, setDataSources] = useState<FonteDados[]>(initialDataSources);
  const [userDocuments, setUserDocuments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  const fetchUserDocuments = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching user documents...');
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('source', 'datasource')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }
      console.log('Documents fetched:', data?.length || 0);
      setUserDocuments(data || []);
    } catch (error) {
      console.error('Error in fetchUserDocuments:', error);
      toast({
        title: 'Erro ao carregar documentos',
        description: 'Não foi possível carregar a lista de documentos.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserDocuments();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchUserDocuments();
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
      
      {userDocuments.length > 0 ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Documentos Carregados</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Data Extração</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Link to={`/documents/${doc.id}`} className="text-primary hover:underline">
                          {doc.title}
                        </Link>
                      </TableCell>
                      <TableCell>{doc.file_metadata?.type?.split('/')[1]?.toUpperCase() || 'Documento'}</TableCell>
                      <TableCell>
                        {doc.file_metadata?.size 
                          ? `${(doc.file_metadata.size / (1024 * 1024)).toFixed(2)} MB` 
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card className="mb-6 py-8">
          <div className="flex flex-col items-center justify-center text-center p-4">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum documento carregado</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Clique em "Adicionar Fonte" para carregar seu primeiro documento.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Adicionar Fonte
            </Button>
          </div>
        </Card>
      )}
      
      {dataSources.map((source) => (
        <Card key={source.id} className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-bold">{source.nome_sistema}</CardTitle>
              <Badge variant="outline">{new Date(source.data_importacao || '').toLocaleDateString()}</Badge>
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
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <Database className="mr-2 h-4 w-4" />
                  Comandos de Importação
                </h3>
                <ScrollArea className="h-[120px] w-full rounded-md border p-4 bg-gray-50">
                  <pre className="text-xs text-gray-700">
                    {source.id === 1 ? (
                      `INSERT INTO fontes_dados (nome_sistema, descricao, tecnologia, data_importacao)
VALUES (
    'Diversas origens distribuídas por vários repositórios/sistemas de armazenamento',
    'Candidaturas de projetos; projetos; pareceres de peritos; respostas a questionários; representações; relatórios diversos; estudos; etc.',
    'Documentos PDF; Documentos Word; Documentos Excel; Outros formatos office; Outros documentos em formato open source',
    CURRENT_TIMESTAMP
);`
                    ) : source.id === 2 ? (
                      `INSERT INTO fontes_dados (nome_sistema, descricao, tecnologia, data_importacao)
VALUES (
    'Dados de projetos financiados por Fundos Europeus de gestão centralizada (Horizonte Europa, Programa Europa Digital)',
    'Dados relativos à atribuição de financiamento através de fundos europeus de gestão centralizada a entidades empresariais e não empresariais.',
    'Outsystems (SQL Server)',
    CURRENT_TIMESTAMP
);`
                    ) : source.id === 3 ? (
                      `INSERT INTO fontes_dados (nome_sistema, descricao, tecnologia, data_importacao)
VALUES (
    'Dados de projetos financiados por Fundos Europeus e por Fundos Nacionais (rede EUREKA)',
    'Dados relativos à atribuição de financiamento através de fundos europeus e por fundos nacionais a entidades empresariais e não empresariais.',
    'Outsystems (SQL Server)',
    CURRENT_TIMESTAMP
);`
                    ) : source.id === 4 ? (
                      `INSERT INTO fontes_dados (nome_sistema, descricao, tecnologia, data_importacao)
VALUES (
    'Instituições de I&D',
    'Dados relativos ao mapeamento das entidades que fazem Investigação & Desenvolvimento em Portugal e na Europa.',
    'Outsystems (SQL Server)',
    CURRENT_TIMESTAMP
);`
                    ) : (
                      `INSERT INTO fontes_dados (nome_sistema, descricao, tecnologia, data_importacao)
VALUES (
    'Dados sobre Cooperação Internacional',
    'Dados relativos à Bolsa de Tecnologia e Negócios, onde a procura e a oferta de tecnologias são valorizadas.',
    'Outsystems (SQL Server)',
    CURRENT_TIMESTAMP
);`
                    )}
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
                        {source.id === 1 ? (
                          <>
                            <TableHead>Documento</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Tamanho</TableHead>
                            <TableHead>Data Extração</TableHead>
                          </>
                        ) : source.id === 2 ? (
                          <>
                            <TableHead>Projeto ID</TableHead>
                            <TableHead>Nome Projeto</TableHead>
                            <TableHead>Valor Financiado</TableHead>
                            <TableHead>Entidade</TableHead>
                          </>
                        ) : source.id === 3 ? (
                          <>
                            <TableHead>Projeto ID</TableHead>
                            <TableHead>Nome Projeto</TableHead>
                            <TableHead>Tipo Fundo</TableHead>
                            <TableHead>Valor Financiado</TableHead>
                          </>
                        ) : source.id === 4 ? (
                          <>
                            <TableHead>Instituição ID</TableHead>
                            <TableHead>Nome Instituição</TableHead>
                            <TableHead>Localização</TableHead>
                            <TableHead>Área de Atividade</TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead>Cooperação ID</TableHead>
                            <TableHead>Parceiro</TableHead>
                            <TableHead>Tipo Interação</TableHead>
                            <TableHead>Data Início</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {source.id === 1 ? (
                        <>
                          <TableRow>
                            <TableCell>
                              <Link to={`/documents/${encodeURIComponent('590f5718-7012-46a2-ae7e-13e24c5d908a')}`} className="text-primary hover:underline">
                                Relatório Técnico ANI 2023
                              </Link>
                            </TableCell>
                            <TableCell>PDF</TableCell>
                            <TableCell>2.4 MB</TableCell>
                            <TableCell>{new Date().toLocaleDateString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Link to={`/documents/${encodeURIComponent('590f5718-7012-46a2-ae7e-13e24c5d908a')}`} className="text-primary hover:underline">
                                Candidatura Projeto X
                              </Link>
                            </TableCell>
                            <TableCell>Word</TableCell>
                            <TableCell>1.8 MB</TableCell>
                            <TableCell>{new Date().toLocaleDateString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Link to={`/documents/${encodeURIComponent('590f5718-7012-46a2-ae7e-13e24c5d908a')}`} className="text-primary hover:underline">
                                Questionário Inovação
                              </Link>
                            </TableCell>
                            <TableCell>Excel</TableCell>
                            <TableCell>3.2 MB</TableCell>
                            <TableCell>{new Date().toLocaleDateString()}</TableCell>
                          </TableRow>
                        </>
                      ) : source.id === 2 ? (
                        <>
                          <TableRow>
                            <TableCell>HE-2023-001</TableCell>
                            <TableCell>Inovação Sustentável</TableCell>
                            <TableCell>€ 125.000</TableCell>
                            <TableCell>Universidade de Lisboa</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>PED-2023-045</TableCell>
                            <TableCell>Digitalização Industrial</TableCell>
                            <TableCell>€ 230.500</TableCell>
                            <TableCell>Empresa XYZ</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>HE-2022-189</TableCell>
                            <TableCell>Eficiência Energética</TableCell>
                            <TableCell>€ 180.000</TableCell>
                            <TableCell>Instituto ABC</TableCell>
                          </TableRow>
                        </>
                      ) : source.id === 3 ? (
                        <>
                          <TableRow>
                            <TableCell>EUR-2023-078</TableCell>
                            <TableCell>Energia Renovável</TableCell>
                            <TableCell>Europeu</TableCell>
                            <TableCell>€ 275.000</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>EUR-2023-102</TableCell>
                            <TableCell>Tecnologias Verdes</TableCell>
                            <TableCell>Nacional</TableCell>
                            <TableCell>€ 120.000</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>EUR-2022-045</TableCell>
                            <TableCell>Mobilidade Sustentável</TableCell>
                            <TableCell>Europeu</TableCell>
                            <TableCell>€ 185.000</TableCell>
                          </TableRow>
                        </>
                      ) : source.id === 4 ? (
                        <>
                          <TableRow>
                            <TableCell>INST-2023-001</TableCell>
                            <TableCell>Instituto de Tecnologia Avançada</TableCell>
                            <TableCell>Lisboa</TableCell>
                            <TableCell>Tecnologias Emergentes</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>INST-2023-015</TableCell>
                            <TableCell>Centro de Pesquisa Biomédica</TableCell>
                            <TableCell>Porto</TableCell>
                            <TableCell>Saúde e Biotecnologia</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>INST-2022-089</TableCell>
                            <TableCell>Laboratório de Inovação Digital</TableCell>
                            <TableCell>Braga</TableCell>
                            <TableCell>Inteligência Artificial</TableCell>
                          </TableRow>
                        </>
                      ) : (
                        <>
                          <TableRow>
                            <TableCell>COOP-2023-012</TableCell>
                            <TableCell>TechAlliance GmbH</TableCell>
                            <TableCell>Transferência Tecnológica</TableCell>
                            <TableCell>15/03/2023</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>COOP-2023-034</TableCell>
                            <TableCell>Innovation Partners SA</TableCell>
                            <TableCell>Projetos Conjuntos</TableCell>
                            <TableCell>22/05/2023</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>COOP-2022-098</TableCell>
                            <TableCell>Global Research Network</TableCell>
                            <TableCell>Investigação Aplicada</TableCell>
                            <TableCell>10/12/2022</TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <AddDataSourceModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={fetchUserDocuments}
      />
    </div>
  );
};
