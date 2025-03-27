
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

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
  const createGoogleDocsViewerUrl = (url: string) => {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
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
            height={fullscreen ? "700px" : "600px"}
            className="border rounded"
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
        );
      } else {
        return (
          <iframe 
            src={createGoogleDocsViewerUrl(pdfUrl)} 
            title="Document Viewer" 
            width="100%" 
            height={fullscreen ? "700px" : "600px"}
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
          height={fullscreen ? "700px" : "600px"} 
          className="border rounded"
        />
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
