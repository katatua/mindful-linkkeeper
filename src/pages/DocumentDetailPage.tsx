
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Eye, FileText, Info } from 'lucide-react';
import { DocumentoExtraido } from '@/types/databaseTypes';

// Sample data for demonstration
const sampleDocuments: DocumentoExtraido[] = [
  {
    id: "doc-1",
    fonte_id: 1,
    nome: "Relatório Técnico ANI 2023",
    tipo: "PDF",
    tamanho: "2.4 MB",
    data_extracao: new Date().toLocaleDateString(),
    conteudo: "Este relatório apresenta os resultados técnicos da ANI para o ano de 2023...",
    metadata: {
      autor: "Departamento Técnico ANI",
      palavras_chave: ["inovação", "resultados", "2023", "técnico"],
      numero_paginas: 45
    }
  },
  {
    id: "doc-2",
    fonte_id: 1,
    nome: "Candidatura Projeto X",
    tipo: "Word",
    tamanho: "1.8 MB",
    data_extracao: new Date().toLocaleDateString(),
    conteudo: "Proposta de candidatura para o Projeto X que visa implementar...",
    metadata: {
      autor: "Empresa ABC",
      palavras_chave: ["candidatura", "projeto", "inovação"],
      status: "Em análise"
    }
  },
  {
    id: "doc-3",
    fonte_id: 1,
    nome: "Questionário Inovação",
    tipo: "Excel",
    tamanho: "3.2 MB",
    data_extracao: new Date().toLocaleDateString(),
    conteudo: "Dados coletados através do questionário de inovação distribuído a empresas...",
    metadata: {
      autor: "Equipe de Pesquisa ANI",
      palavras_chave: ["questionário", "dados", "empresas"],
      respostas: 156
    }
  }
];

const DocumentDetailPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [document, setDocument] = useState<DocumentoExtraido | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getIconByType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'word':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'excel':
        return <FileText className="h-6 w-6 text-green-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

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
                  <div className="flex mt-2 gap-2">
                    <Badge>{document.tipo}</Badge>
                    <Badge variant="outline">{document.tamanho}</Badge>
                    <Badge variant="secondary">Extraído em: {document.data_extracao}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Resumo do Documento</h3>
                <p className="text-gray-700">{document.conteudo}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Metadados</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {document.metadata && Object.entries(document.metadata).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <dt className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/_/g, ' ')}:
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {Array.isArray(value) ? value.join(', ') : value.toString()}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar
                </Button>
              </div>
              <Button variant="secondary">
                <Info className="mr-2 h-4 w-4" />
                Solicitar Informação Adicional
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentDetailPage;
