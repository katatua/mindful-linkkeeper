
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle, FileText, Download } from 'lucide-react';

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
    // Make sure the URL is properly encoded
    const encodedUrl = encodeURIComponent(url);
    return `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
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

  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
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
    
    // PDF Documents - either with native viewer or iframe
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
              <iframe 
                src={createGoogleDocsViewerUrl(pdfUrl)} 
                title="PDF Fallback Viewer" 
                width="100%" 
                height={fullscreen ? "700px" : "600px"}
                className="border rounded"
              />
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
    } 
    
    // Images
    else if (fileType === 'image') {
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
    } 
    
    // Text files and CSVs
    else if (fileType === 'text') {
      // Fallback to a simple iframe, which works with text files
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
    } 
    
    // Office Documents - always use Google Docs Viewer
    else if (fileType === 'document' || fileType === 'spreadsheet') {
      return (
        <div className="relative">
          {renderLoading()}
          {renderFallback()}
          <iframe 
            src={createGoogleDocsViewerUrl(pdfUrl)} 
            title="Office Document Viewer" 
            width="100%" 
            height={fullscreen ? "700px" : "600px"}
            className="border rounded"
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      );
    } 
    
    // Unknown file types - fallback to download
    else {
      return (
        <div className="flex items-center justify-center h-full border rounded p-6 text-center">
          <div>
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="mb-4">Este tipo de arquivo não pode ser visualizado diretamente no navegador.</p>
            <div className="flex flex-col gap-2">
              <Button 
                className="mb-2"
                onClick={() => window.open(pdfUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir em Nova Aba
              </Button>
              <Button variant="outline" onClick={() => {
                const a = document.createElement('a');
                a.href = pdfUrl;
                a.download = document?.title || 'documento';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}>
                <Download className="h-4 w-4 mr-2" />
                Baixar Arquivo
              </Button>
            </div>
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
