
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle } from 'lucide-react';

interface DocumentViewerProps {
  document: any;
  pdfUrl: string;
  viewerMode: 'embedded' | 'iframe';
  onToggleViewerMode: () => void;
  fullscreen?: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  pdfUrl,
  viewerMode,
  onToggleViewerMode,
  fullscreen = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset loading/error state when URL changes
    if (pdfUrl) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [pdfUrl]);
  
  const createGoogleDocsViewerUrl = (url: string) => {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  };

  const getFileType = () => {
    if (!document?.file_metadata?.type) return 'unknown';
    
    const fileType = document.file_metadata.type.toLowerCase();
    if (fileType.includes('pdf')) return 'pdf';
    if (fileType.includes('image')) return 'image';
    if (fileType.includes('text') || fileType.includes('csv')) return 'text';
    if (fileType.includes('word') || fileType.includes('document')) return 'document';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'spreadsheet';
    
    return 'unknown';
  };

  const renderDocumentViewer = () => {
    if (!pdfUrl) {
      return (
        <div className="flex items-center justify-center h-[400px] border rounded p-6 text-center">
          <div>
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="mb-4">Não foi possível carregar o documento. URL não disponível.</p>
          </div>
        </div>
      );
    }

    const fileType = getFileType();
    
    const handleLoad = () => {
      setIsLoading(false);
    };
    
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    // Render loading state
    const renderLoading = () => {
      if (!isLoading) return null;
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-70 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    };

    // Fallback content when viewer fails
    const renderFallback = () => {
      if (!hasError) return null;
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 bg-opacity-90 z-20 p-6 text-center">
          <AlertTriangle className="h-12 w-12 mb-4 text-amber-500" />
          <p className="mb-4">Não foi possível carregar a visualização do documento.</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onToggleViewerMode}>
              Tentar visualização alternativa
            </Button>
            <Button onClick={() => window.open(pdfUrl, '_blank')}>
              Abrir em nova aba
            </Button>
          </div>
        </div>
      );
    };

    if (fileType === 'pdf') {
      if (viewerMode === 'embedded') {
        return (
          <div className="relative">
            {renderLoading()}
            {renderFallback()}
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height={fullscreen ? "700px" : "600px"}
              className="border rounded"
              onLoad={handleLoad}
              onError={handleError}
            >
              <p>Seu navegador não suporta visualização de PDF. 
                <Button variant="link" onClick={onToggleViewerMode}>
                  Tentar visualização alternativa
                </Button> ou 
                <Button variant="link" onClick={() => window.open(pdfUrl, '_blank')}>
                  baixar o arquivo
                </Button>
              </p>
            </object>
          </div>
        );
      } else {
        return (
          <div className="relative">
            {renderLoading()}
            {renderFallback()}
            <iframe 
              src={createGoogleDocsViewerUrl(pdfUrl)} 
              title="Document Viewer" 
              width="100%" 
              height={fullscreen ? "700px" : "600px"}
              className="border rounded"
              onLoad={handleLoad}
              onError={handleError}
            />
          </div>
        );
      }
    } else if (fileType === 'image') {
      return (
        <div className="relative">
          {renderLoading()}
          {renderFallback()}
          <div className="flex justify-center p-4 bg-white rounded border">
            <img 
              src={pdfUrl} 
              alt={document?.title || "Document image"} 
              className="max-w-full max-h-[600px] object-contain"
              onLoad={handleLoad}
              onError={handleError}
            />
          </div>
        </div>
      );
    } else if (fileType === 'text' || fileType === 'csv') {
      return (
        <div className="relative">
          {renderLoading()}
          {renderFallback()}
          <iframe 
            src={pdfUrl} 
            title="Text Document Viewer" 
            width="100%" 
            height={fullscreen ? "700px" : "600px"} 
            className="border rounded"
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      );
    } else if (fileType === 'document' || fileType === 'spreadsheet') {
      // For Word and Excel documents, always use Google Docs Viewer
      return (
        <div className="relative">
          {renderLoading()}
          {renderFallback()}
          <iframe 
            src={createGoogleDocsViewerUrl(pdfUrl)} 
            title="Document Viewer" 
            width="100%" 
            height={fullscreen ? "700px" : "600px"}
            className="border rounded"
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-full border rounded p-6 text-center">
          <div>
            <ExternalLink className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="mb-4">Este tipo de arquivo não pode ser visualizado diretamente no navegador.</p>
            <Button onClick={() => window.open(pdfUrl, '_blank')}>Baixar Arquivo</Button>
          </div>
        </div>
      );
    }
  };

  if (fullscreen) {
    return renderDocumentViewer();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Visualização do Documento</CardTitle>
          <div className="flex gap-2">
            {document?.file_metadata?.type?.includes('pdf') && (
              <Button size="sm" variant="outline" onClick={onToggleViewerMode}>
                {viewerMode === 'embedded' ? 'Visualização Google' : 'Visualização Nativa'}
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.open(pdfUrl, '_blank')}
              disabled={!pdfUrl}
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
  );
};
