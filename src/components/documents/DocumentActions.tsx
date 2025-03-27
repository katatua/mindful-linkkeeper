
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DocumentActionsProps {
  document: any;
  pdfUrl: string | null;
  onView: () => void;
  toast?: any;
}

export const DocumentActions: React.FC<DocumentActionsProps> = ({ 
  document, 
  pdfUrl, 
  onView,
  toast: externalToast
}) => {
  const { toast: internalToast } = useToast();
  const toast = externalToast || internalToast;

  const handleDownload = () => {
    if (!pdfUrl) {
      toast({
        variant: 'destructive',
        title: "Erro",
        description: "Não foi possível baixar o documento. URL não disponível.",
      });
      return;
    }
    
    try {
      // Create an anchor element and trigger the download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      
      // Try to set download attribute with filename
      if (document?.title) {
        // Remove special characters that are not allowed in filenames
        const safeFileName = document.title.replace(/[/\\?%*:|"<>]/g, '-');
        
        // Try to preserve file extension if available
        const extension = document?.file_metadata?.type ? 
          `.${document.file_metadata.type.split('/')[1] || 'pdf'}` : 
          '';
        
        link.download = `${safeFileName}${extension}`;
      }
      
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Documento baixado",
        description: `${document?.title || 'Documento'} foi baixado com sucesso.`,
      });
    } catch (err) {
      console.error('Error downloading document:', err);
      
      // Fallback to opening in new tab
      window.open(pdfUrl, '_blank');
      
      toast({
        title: "Documento aberto",
        description: "O documento foi aberto em uma nova aba.",
      });
    }
  };

  const handleShare = () => {
    // Try to use the Web Share API if available
    if (navigator.share && window.isSecureContext) {
      navigator.share({
        title: document?.title || 'Documento compartilhado',
        url: window.location.href,
      }).catch(err => {
        // Fall back to clipboard if sharing fails
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    // Copy the current URL to clipboard
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast({
          title: "Link copiado",
          description: "O link para este documento foi copiado para a área de transferência.",
        });
      })
      .catch(err => {
        toast({
          variant: 'destructive',
          title: "Erro",
          description: "Não foi possível copiar o link.",
        });
      });
  };

  return (
    <div className="flex gap-2 mt-3 md:mt-0">
      <Button variant="outline" size="sm" onClick={handleDownload} disabled={!pdfUrl}>
        <Download className="h-4 w-4 mr-1" />
        Download
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-1" />
        Compartilhar
      </Button>
      {pdfUrl && (
        <Button size="sm" onClick={onView}>
          <Eye className="h-4 w-4 mr-1" />
          Visualizar
        </Button>
      )}
    </div>
  );
};
