
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Download, Share2, ExternalLink, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

const DocumentDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { documentId } = useParams();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewerMode, setViewerMode] = useState<'embedded' | 'iframe'>('embedded');

  useEffect(() => {
    if (!documentId) return;
    
    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch the document from the links table
        const { data, error } = await supabase
          .from('links')
          .select('*')
          .eq('id', documentId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setDocument(data);
          
          // Get the file URL if it's stored in Supabase Storage
          if (data.url) {
            // If the URL is already a full URL
            if (data.url.startsWith('http')) {
              setPdfUrl(data.url);
            } else {
              // If it's a storage path
              const { data: fileData } = supabase.storage
                .from('files')
                .getPublicUrl(data.url);
                
              if (fileData) {
                setPdfUrl(fileData.publicUrl);
              }
            }
          }
        } else {
          throw new Error('Document not found');
        }
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document. Please try again later.');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load document details.',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocument();
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [documentId, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatFileSize = (size: number) => {
    if (!size) return 'N/A';
    const kb = size / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(2)} KB`;
    } else {
      return `${(kb / 1024).toFixed(2)} MB`;
    }
  };

  const getFileType = (fileMetadata: any) => {
    if (!fileMetadata || !fileMetadata.type) return 'Documento';
    
    if (fileMetadata.type.includes('pdf')) return 'PDF';
    if (fileMetadata.type.includes('csv')) return 'CSV';
    if (fileMetadata.type.includes('excel') || fileMetadata.type.includes('spreadsheet')) return 'Excel';
    if (fileMetadata.type.includes('word') || fileMetadata.type.includes('document')) return 'Word';
    
    return fileMetadata.type.split('/')[1]?.toUpperCase() || 'Documento';
  };

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
    
    toast({
      title: "Documento baixado",
      description: `${document?.title} foi baixado com sucesso.`,
    });
  };

  const handleShare = () => {
    // Copy the current URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    
    toast({
      title: "Link copiado",
      description: "O link para este documento foi copiado para a área de transferência.",
    });
  };

  const handleViewDocument = () => {
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleBackToDataSources = () => {
    // Navigate to Database page with the datasources tab active
    navigate('/database?tab=datasources');
  };

  const createGoogleDocsViewerUrl = (url: string) => {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  };

  const toggleViewerMode = () => {
    setViewerMode(prev => prev === 'embedded' ? 'iframe' : 'embedded');
  };

  const renderDocumentViewer = () => {
    if (!pdfUrl) return null;

    const fileType = document?.file_metadata?.type || '';
    const isPdf = fileType.includes('pdf');
    const isImage = fileType.includes('image');
    const isText = fileType.includes('text') || fileType.includes('csv');

    if (isPdf) {
      if (viewerMode === 'embedded') {
        return (
          <object
            data={pdfUrl}
            type="application/pdf"
            width="100%"
            height="600px"
            className="border rounded"
          >
            <p>Seu navegador não suporta visualização de PDF. 
              <Button variant="link" onClick={() => setViewerMode('iframe')}>
                Tentar visualização alternativa
              </Button> ou 
              <Button variant="link" onClick={handleDownload}>
                baixar o arquivo
              </Button>
            </p>
          </object>
        );
      } else {
        return (
          <iframe 
            src={createGoogleDocsViewerUrl(pdfUrl)} 
            title="Document Viewer" 
            width="100%" 
            height="600px"
            className="border rounded"
          />
        );
      }
    } else if (isImage) {
      return (
        <div className="flex justify-center p-4 bg-white rounded border">
          <img 
            src={pdfUrl} 
            alt={document?.title || "Document image"} 
            className="max-w-full max-h-[600px] object-contain"
          />
        </div>
      );
    } else if (isText) {
      return (
        <iframe 
          src={pdfUrl} 
          title="Text Document Viewer" 
          width="100%" 
          height="600px" 
          className="border rounded"
        />
      );
    } else {
      return (
        <div className="flex items-center justify-center h-full border rounded p-6 text-center">
          <div>
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="mb-4">Este tipo de arquivo não pode ser visualizado diretamente no navegador.</p>
            <Button onClick={handleDownload}>Baixar Arquivo</Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          className="w-fit" 
          onClick={handleBackToDataSources}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Fontes de Dados
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-red-500 text-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-bold">Erro ao carregar documento</h2>
            </div>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={handleBackToDataSources}>Voltar para Fontes de Dados</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold">{document?.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">
                  {getFileType(document?.file_metadata)}
                </Badge>
                <span className="text-sm text-gray-500">{document?.id && `ID: ${document.id.substring(0, 8)}...`}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-3 md:mt-0">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Compartilhar
              </Button>
              {pdfUrl && (
                <Button size="sm" onClick={handleViewDocument}>
                  <Eye className="h-4 w-4 mr-1" />
                  Visualizar
                </Button>
              )}
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Categoria</span>
                  <p className="text-sm">{document?.category || 'Não categorizado'}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Data de Carregamento</span>
                  <p className="text-sm">{formatDate(document?.created_at)}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Tamanho</span>
                  <p className="text-sm">{document?.file_metadata?.size ? formatFileSize(document.file_metadata.size) : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualizador de documento incorporado na página */}
          {pdfUrl && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Visualização do Documento</CardTitle>
                  <div className="flex gap-2">
                    {document?.file_metadata?.type?.includes('pdf') && (
                      <Button size="sm" variant="outline" onClick={toggleViewerMode}>
                        {viewerMode === 'embedded' ? 'Visualização Google' : 'Visualização Nativa'}
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => window.open(pdfUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Abrir em Nova Aba
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderDocumentViewer()}
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="analysis">Análise AI</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Descrição do Documento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{document?.summary || 'Nenhuma descrição disponível.'}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de IA</CardTitle>
                </CardHeader>
                <CardContent>
                  {document?.ai_analysis ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Resumo</h3>
                        <p className="mt-1">{document.ai_summary}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Análise</h3>
                        <p className="mt-1 whitespace-pre-line">{document.ai_analysis}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Nenhuma análise de IA disponível para este documento.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Dialog para visualização em tela cheia */}
          {pdfUrl && (
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
              <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>{document?.title}</DialogTitle>
                  <DialogDescription>
                    Visualização completa do documento
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 min-h-[700px] mt-4">
                  {renderDocumentViewer()}
                </div>
                <DialogFooter className="mt-4 flex justify-between">
                  <div>
                    {document?.file_metadata?.type?.includes('pdf') && (
                      <Button variant="outline" onClick={toggleViewerMode}>
                        {viewerMode === 'embedded' ? 'Visualização Google' : 'Visualização Nativa'}
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button onClick={handleCloseViewDialog}>Fechar</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentDetailPage;
