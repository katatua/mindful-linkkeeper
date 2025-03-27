
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
import { DocumentViewer } from '@/components/documents/DocumentViewer';
import { DocumentMetadata } from '@/components/documents/DocumentMetadata';
import { DocumentActions } from '@/components/documents/DocumentActions';

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
        console.log(`Fetching document with ID: ${documentId}`);
        
        // Fetch the document from the links table
        const { data, error } = await supabase
          .from('links')
          .select('*')
          .eq('id', documentId)
          .single();
        
        if (error) {
          console.error('Error fetching document:', error);
          throw error;
        }
        
        if (data) {
          console.log('Document data fetched:', data);
          setDocument(data);
          
          // Get the file URL if it's stored in Supabase Storage
          if (data.url) {
            // If the URL is already a full URL
            if (data.url.startsWith('http')) {
              setPdfUrl(data.url);
              console.log('Setting direct URL:', data.url);
            } else {
              // If it's a storage path
              try {
                const { data: fileData } = supabase.storage
                  .from('files')
                  .getPublicUrl(data.url);
                  
                if (fileData) {
                  setPdfUrl(fileData.publicUrl);
                  console.log('Setting storage URL:', fileData.publicUrl);
                } else {
                  throw new Error('File URL could not be generated');
                }
              } catch (urlError) {
                console.error('Error generating URL:', urlError);
                setPdfUrl(null);
                toast({
                  variant: 'destructive',
                  title: 'Error',
                  description: 'Could not generate document URL.',
                });
              }
            }
          } else {
            setPdfUrl(null);
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Document has no associated file.',
            });
          }
        } else {
          throw new Error('Document not found');
        }
      } catch (err: any) {
        console.error('Error fetching document:', err);
        setError(`Failed to load document: ${err.message || 'Unknown error'}. Please try again later.`);
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleBackToDataSources = () => {
    // Navigate to Database page with the datasources tab active
    navigate('/database?tab=datasources');
  };

  const toggleViewerMode = () => {
    setViewerMode(prev => prev === 'embedded' ? 'iframe' : 'embedded');
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
                  {document?.file_metadata?.type ? 
                    (document.file_metadata.type.includes('pdf') ? 'PDF' : 
                     document.file_metadata.type.includes('csv') ? 'CSV' : 
                     document.file_metadata.type.includes('excel') ? 'Excel' : 
                     document.file_metadata.type.includes('word') ? 'Word' : 
                     document.file_metadata.type.split('/')[1]?.toUpperCase() || 'Documento') : 
                    'Documento'}
                </Badge>
                <span className="text-sm text-gray-500">{document?.id && `ID: ${document.id.substring(0, 8)}...`}</span>
              </div>
            </div>

            <DocumentActions 
              document={document} 
              pdfUrl={pdfUrl} 
              onView={() => setViewDialogOpen(true)}
              toast={toast}
            />
          </div>

          <DocumentMetadata document={document} />

          {/* Visualizador de documento incorporado na página */}
          {pdfUrl && (
            <DocumentViewer 
              document={document}
              pdfUrl={pdfUrl}
              viewerMode={viewerMode}
              onToggleViewerMode={toggleViewerMode}
            />
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
                        <p className="mt-1">{document.ai_summary || 'Sem resumo disponível'}</p>
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
                  <DocumentViewer 
                    document={document}
                    pdfUrl={pdfUrl}
                    viewerMode={viewerMode}
                    onToggleViewerMode={toggleViewerMode}
                    fullscreen
                  />
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
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (pdfUrl) {
                          window.open(pdfUrl, '_blank');
                          toast({
                            title: "Documento baixado",
                            description: `${document?.title} foi baixado com sucesso.`,
                          });
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button onClick={() => setViewDialogOpen(false)}>Fechar</Button>
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
