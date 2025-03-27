
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    },
    ai_summary: "Este relatório apresenta uma visão abrangente das atividades da ANI em 2023, destacando 324 projetos aprovados com €156 milhões em investimento. Mostra progresso nos programas Portugal 2030, Horizonte Europa e PRR, com foco em quatro setores prioritários liderados pela Transição Digital. Inclui recomendações para 2024, como simplificação de processos e maior ênfase em economia circular.",
    ai_analysis: "O relatório demonstra um forte desempenho da ANI em 2023, com indicadores positivos de execução financeira e implementação de programas. A distribuição setorial reflete as prioridades da estratégia nacional e europeia de inovação, com equilíbrio entre transição digital, sustentabilidade e ciências da vida.\n\nPontos fortes:\n- Demonstra capacidade de mobilização significativa de investimento\n- Evidencia um bom balanceamento entre diferentes setores estratégicos\n- Estabelece boas práticas de colaboração academia-indústria\n\nLimitações:\n- Falta de detalhes sobre os desafios enfrentados na implementação\n- Ausência de análise comparativa com anos anteriores\n- Pouca informação sobre o impacto económico real dos investimentos\n\nRelevância e aplicações:\n- Documento essencial para stakeholders do ecossistema de inovação português\n- Útil para fundamentar decisões estratégicas sobre alocação de recursos em 2024\n- Proporciona benchmarks importantes para avaliar o desempenho futuro da agência"
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
    },
    ai_summary: "Proposta da TechEnergia Solutions para desenvolver um sistema de gestão energética baseado em IA e IoT para edifícios comerciais, visando redução de 30% no consumo energético. O projeto de €475.000 e 24 meses inclui desenvolvimento de sensores, algoritmos e interface, com testes em 5 edifícios piloto. Prevê comercialização até 2025, criação de 15 empregos e redução de 5.000 toneladas de CO2/ano.",
    ai_analysis: "Esta candidatura apresenta uma proposta com potencial significativo no domínio da eficiência energética, alinhada com os objetivos europeus de sustentabilidade e transição digital.\n\nPontos fortes:\n- Abordagem tecnológica inovadora combinando IoT e IA\n- Objetivos quantificáveis claros (30% de redução de consumo)\n- Plano de implementação bem estruturado com fases lógicas\n- Forte potencial de impacto ambiental (5.000 ton CO2)\n\nPontos fracos:\n- Pouco detalhe sobre a diferenciação face a soluções existentes no mercado\n- Risco de subestimação do orçamento necessário para alguns componentes tecnológicos\n- Falta de informação sobre estratégias de escalabilidade pós-piloto\n\nOportunidades de financiamento:\n- Forte alinhamento com programas do PRR na área da transição climática\n- Potencial para integração com iniciativas de cidades inteligentes\n- Elegível para programas específicos de eficiência energética em edifícios\n\nRecomendações para avaliação:\n- Solicitar mais detalhes sobre a propriedade intelectual dos algoritmos\n- Verificar a experiência prévia da equipa em projetos similares\n- Avaliar realismo das projeções financeiras de comercialização"
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
    },
    ai_summary: "Este questionário de inovação de 2023 apresenta dados de 156 empresas portuguesas, majoritariamente PMEs (89.7%), com predominância dos setores de tecnologia e indústria. 68% realizaram inovação de produto/serviço e 52% inovação de processo. A mediana de investimento em I&D foi de 2.7% do volume de negócios, com 45% das empresas colaborando com universidades. As principais barreiras incluem falta de financiamento (78%) e burocracia (63%), enquanto 42% utilizaram incentivos fiscais.",
    ai_analysis: "Este questionário oferece um panorama valioso sobre o estado da inovação empresarial em Portugal, revelando tendências importantes e barreiras persistentes.\n\nInsights principais:\n- Existe uma clara predominância de inovação de produto/serviço sobre outros tipos de inovação, sugerindo um foco em resultados tangíveis e comercializáveis\n- A taxa relativamente baixa de inovação organizacional (35%) pode indicar uma oportunidade perdida, já que este tipo de inovação frequentemente potencializa outros tipos\n- A colaboração academia-empresa mostra números promissores (45%), mas ainda há espaço para crescimento\n\nImplicações para políticas públicas:\n1. A alta percentagem de empresas que apontam a falta de financiamento como barreira (78%) contrasta com os dados de acesso a apoios públicos, sugerindo possíveis problemas de:  \n   - Adequação dos instrumentos às necessidades reais das empresas\n   - Complexidade ou burocracia nos processos de candidatura\n   - Falta de consciencialização sobre os apoios disponíveis\n\n2. A baixa taxa de participação em projetos europeus (14%) indica uma oportunidade para melhorar a internacionalização da inovação portuguesa\n\n3. A falta de pessoal qualificado (57%) aponta para a necessidade de investimentos contínuos em formação especializada\n\nLimitações do estudo:\n- A amostra poderia ser maior para representar melhor o tecido empresarial\n- Falta análise longitudinal para identificar tendências ao longo do tempo\n- Ausência de dados sobre o impacto económico das inovações realizadas\n\nEste documento é particularmente útil para informar o desenho de novos programas de apoio à inovação e ajustar os existentes para melhor atender às necessidades identificadas."
  }
];

const DocumentDetailPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [document, setDocument] = useState<DocumentoExtraido | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

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
            Voltar para Fontes de Dados
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
                    {document.ai_summary && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        AI Analyzed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start px-6">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                {document.ai_summary && (
                  <TabsTrigger value="ai-analysis">Análise AI</TabsTrigger>
                )}
                <TabsTrigger value="metadata">Metadados</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="px-6 py-4">
                <div className="space-y-6">
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
                </div>
              </TabsContent>
              
              {document.ai_summary && (
                <TabsContent value="ai-analysis" className="px-6 py-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Resumo AI</h3>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-gray-800">{document.ai_summary}</p>
                      </div>
                    </div>
                    
                    {document.ai_analysis && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Análise Crítica</h3>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <p className="text-gray-800 whitespace-pre-line">{document.ai_analysis}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
              
              <TabsContent value="metadata" className="px-6 py-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Metadados</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formatMetadata(document.metadata)}
                    </dl>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="flex justify-between p-6 pt-2">
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
