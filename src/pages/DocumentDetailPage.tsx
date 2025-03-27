
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Eye, FileText, Info, File, FileSpreadsheet } from 'lucide-react';
import { DocumentoExtraido } from '@/types/databaseTypes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Enhanced sample data with more detailed content
const sampleDocuments: DocumentoExtraido[] = [
  {
    id: "doc-1",
    fonte_id: 1,
    nome: "Relatório Técnico ANI 2023",
    tipo: "PDF",
    tamanho: "2.4 MB",
    data_extracao: new Date().toLocaleDateString(),
    conteudo: `# Relatório Técnico ANI 2023

## Sumário Executivo
Este relatório apresenta os principais resultados e atividades da Agência Nacional de Inovação (ANI) durante o ano de 2023, destacando o progresso em relação aos objetivos estratégicos, programas de financiamento e iniciativas de inovação.

## Programas de Financiamento
- **Portugal 2030**: Implementação inicial com abertura de 12 concursos
- **Horizonte Europa**: Participação portuguesa em 87 projetos colaborativos
- **PRR**: Execução de 45% do orçamento designado para inovação

## Resultados Chave
- 324 projetos aprovados para financiamento
- €156 milhões em investimento total mobilizado
- 78 novas colaborações entre academia e indústria estabelecidas

## Setores Prioritários
1. Transição Digital (32% dos projetos)
2. Energia e Sustentabilidade (28% dos projetos)
3. Saúde e Ciências da Vida (23% dos projetos)
4. Mobilidade e Indústria Avançada (17% dos projetos)

## Recomendações para 2024
- Simplificação dos processos de candidatura
- Maior ênfase em projetos de economia circular
- Expansão de programas para startups em fase inicial`,
    metadata: {
      autor: "Departamento Técnico ANI",
      palavras_chave: ["inovação", "resultados", "2023", "técnico", "financiamento", "projetos"],
      numero_paginas: 45,
      data_publicacao: "15/01/2024",
      departamento: "Departamento de Estudos e Estatísticas",
      versao: "1.2",
      confidencialidade: "Público",
      grafico_dados: [
        { categoria: "Transição Digital", valor: 32 },
        { categoria: "Energia e Sustentabilidade", valor: 28 },
        { categoria: "Saúde e Ciências da Vida", valor: 23 },
        { categoria: "Mobilidade e Indústria Avançada", valor: 17 }
      ]
    }
  },
  {
    id: "doc-2",
    fonte_id: 1,
    nome: "Candidatura Projeto X",
    tipo: "Word",
    tamanho: "1.8 MB",
    data_extracao: new Date().toLocaleDateString(),
    conteudo: `# Candidatura: Projeto X - Sistema Inteligente de Gestão Energética

## Informação do Proponente
**Empresa:** TechEnergia Solutions, S.A.
**NIF:** 509876543
**Morada:** Parque Industrial de Aveiro, Lote 23, 3800-123 Aveiro
**Responsável:** Eng. Maria Santos (maria.santos@techenergia.pt)

## Resumo do Projeto
O Projeto X visa desenvolver um sistema inovador de gestão energética para edifícios comerciais utilizando inteligência artificial para otimizar o consumo. O sistema integra sensores IoT, algoritmos preditivos e interface de utilizador intuitiva, prometendo redução de 30% no consumo energético.

## Objetivos
1. Desenvolver sensores IoT de baixo consumo para monitorização de parâmetros energéticos
2. Criar algoritmos de IA para previsão e otimização do consumo
3. Implementar interface de utilizador adaptável a múltiplas plataformas
4. Testar o sistema em 5 edifícios piloto em diferentes setores

## Plano de Implementação
- **Fase 1 (6 meses):** Desenvolvimento de sensores e infraestrutura
- **Fase 2 (8 meses):** Desenvolvimento de algoritmos e software
- **Fase 3 (4 meses):** Integração e testes em laboratório
- **Fase 4 (6 meses):** Implementação nos sites piloto e ajustes

## Orçamento Solicitado
**Total:** €475.000
- Pessoal: €210.000
- Equipamentos: €95.000
- Consumíveis: €45.000
- Serviços externos: €80.000
- Deslocações: €25.000
- Despesas indiretas: €20.000

## Impacto Esperado
- Comercialização do produto até 2025
- Volume de negócios de €2M em 3 anos
- Criação de 15 postos de trabalho
- Redução estimada de 5.000 toneladas de CO2 por ano`,
    metadata: {
      autor: "Empresa ABC",
      palavras_chave: ["candidatura", "projeto", "inovação", "energia", "sustentabilidade"],
      status: "Em análise",
      data_submissao: "10/03/2024",
      financiamento_solicitado: "€475.000",
      duracao_meses: 24,
      trl_inicial: 4,
      trl_final: 8
    }
  },
  {
    id: "doc-3",
    fonte_id: 1,
    nome: "Questionário Inovação",
    tipo: "Excel",
    tamanho: "3.2 MB",
    data_extracao: new Date().toLocaleDateString(),
    conteudo: `# Resultados do Questionário de Inovação 2023

## Dados da Amostra
- Número de empresas participantes: 156
- Distribuição por dimensão:
  * Microempresas: 32 (20.5%)
  * Pequenas empresas: 67 (42.9%)
  * Médias empresas: 41 (26.3%)
  * Grandes empresas: 16 (10.3%)
- Distribuição por setor:
  * Tecnologia: 45 (28.8%)
  * Indústria: 38 (24.4%)
  * Serviços: 34 (21.8%)
  * Saúde: 18 (11.5%)
  * Outros: 21 (13.5%)

## Resultados Principais
1. **Atividades de Inovação**
   - 68% realizaram inovação de produto/serviço
   - 52% realizaram inovação de processo
   - 35% realizaram inovação organizacional
   - 29% realizaram inovação de marketing

2. **Investimento em I&D**
   - Mediana do investimento: 2.7% do volume de negócios
   - 22% das empresas não têm orçamento formal para I&D
   - 15% investem mais de 10% do volume de negócios em I&D

3. **Colaborações**
   - 45% colaboraram com universidades/centros de investigação
   - 37% colaboraram com outras empresas
   - 21% participaram em projetos internacionais
   - 12% colaboraram com startups

4. **Barreiras à Inovação**
   - Falta de financiamento: 78%
   - Burocracia/regulamentação: 63%
   - Falta de pessoal qualificado: 57%
   - Dificuldade em aceder a conhecimento externo: 42%
   - Falta de parceiros adequados: 38%

5. **Acesso a Apoios Públicos**
   - 42% beneficiaram de incentivos fiscais à I&D (SIFIDE)
   - 31% acederam a fundos nacionais
   - 14% participaram em projetos com financiamento europeu
   - 23% nunca acederam a qualquer apoio público`,
    metadata: {
      autor: "Equipe de Pesquisa ANI",
      palavras_chave: ["questionário", "dados", "empresas", "inovação", "resultados"],
      respostas: 156,
      periodo_coleta: "Jan-Mar 2023",
      coordenador: "Dr. António Silva",
      margen_erro: "±3.2%",
      metodologia: "Amostragem estratificada com ponderação por setor e dimensão",
      dados_estatisticos: [
        { categoria: "Atividades de Inovação", subcat: "Produto/Serviço", valor: 68 },
        { categoria: "Atividades de Inovação", subcat: "Processo", valor: 52 },
        { categoria: "Atividades de Inovação", subcat: "Organizacional", valor: 35 },
        { categoria: "Atividades de Inovação", subcat: "Marketing", valor: 29 }
      ]
    }
  }
];

const DocumentDetailPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [document, setDocument] = useState<DocumentoExtraido | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    // Simulate fetching document data
    setLoading(true);
    const foundDocument = sampleDocuments.find(doc => doc.id === documentId) || null;
    
    // Simulating API delay
    const timer = setTimeout(() => {
      setDocument(foundDocument);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [documentId]);

  const handleDownload = () => {
    if (!document) return;
    
    // Create a blob with the document content
    const blob = new Blob([document.conteudo || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.nome}.${document.tipo.toLowerCase()}`;
    window.document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Documento "${document.nome}" baixado com sucesso.`);
  };

  const getIconByType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'word':
        return <File className="h-6 w-6 text-blue-500" />;
      case 'excel':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatMetadata = (metadata: Record<string, any>) => {
    if (!metadata) return null;

    return Object.entries(metadata).map(([key, value]) => {
      // Skip graphical data, we'll render it separately
      if (key === 'grafico_dados' || key === 'dados_estatisticos') return null;
      
      return (
        <div key={key} className="space-y-1">
          <dt className="text-sm font-medium text-gray-500 capitalize">
            {key.replace(/_/g, ' ')}:
          </dt>
          <dd className="text-sm text-gray-900">
            {Array.isArray(value) ? value.join(', ') : value.toString()}
          </dd>
        </div>
      );
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!document) {
    return (
      <Layout>
        <div className="container mx-auto py-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Documento não encontrado</h1>
          <p className="mb-4">O documento solicitado não existe ou foi removido.</p>
          <Link to="/database">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Database
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Link to="/database" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Database
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex gap-4">
                <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center">
                  {getIconByType(document.tipo)}
                </div>
                <div>
                  <CardTitle className="text-2xl">{document.nome}</CardTitle>
                  <div className="flex mt-2 gap-2 flex-wrap">
                    <Badge>{document.tipo}</Badge>
                    <Badge variant="outline">{document.tamanho}</Badge>
                    <Badge variant="secondary">Extraído em: {document.data_extracao}</Badge>
                    {document.metadata?.status && (
                      <Badge variant={document.metadata.status === "Em análise" ? "secondary" : "success"}>
                        {document.metadata.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Resumo do Documento</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm whitespace-pre-line">{document.conteudo.substring(0, 400)}...</p>
                </div>
              </div>

              {document.metadata?.grafico_dados && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Dados Principais</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-col">
                      <h4 className="text-md font-medium mb-2">Distribuição por Categoria</h4>
                      <div className="flex flex-wrap gap-2">
                        {document.metadata.grafico_dados.map((item: any, index: number) => (
                          <div key={index} className="flex flex-col items-center p-2 border rounded">
                            <div className="text-lg font-bold">{item.valor}%</div>
                            <div className="text-sm text-gray-500">{item.categoria}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {document.metadata?.dados_estatisticos && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Dados Estatísticos</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-col">
                      <div className="flex flex-wrap gap-2">
                        {document.metadata.dados_estatisticos.map((item: any, index: number) => (
                          <div key={index} className="flex flex-col items-center p-2 border rounded">
                            <div className="text-lg font-bold">{item.valor}%</div>
                            <div className="text-sm text-gray-500">{item.subcat}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Metadados</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formatMetadata(document.metadata)}
                  </dl>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => setViewDialogOpen(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar
                </Button>
              </div>
              <Button variant="secondary" onClick={() => toast.info("Solicitação enviada. Nossa equipe entrará em contato em breve.")}>
                <Info className="mr-2 h-4 w-4" />
                Solicitar Informação Adicional
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{document.nome}</DialogTitle>
              <DialogDescription>
                Tipo: {document.tipo} | Tamanho: {document.tamanho} | Data: {document.data_extracao}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="whitespace-pre-line font-mono text-sm">{document.conteudo}</div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default DocumentDetailPage;
