
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Eye } from 'lucide-react';

interface DocumentActionsProps {
  document: any;
  pdfUrl: string | null;
  onView: () => void;
  toast: any;
}

export const DocumentActions: React.FC<DocumentActionsProps> = ({ 
  document, 
  pdfUrl, 
  onView,
  toast 
}) => {
  const handleDownload = () => {
    if (!pdfUrl) {
      toast({
        variant: 'destructive',
        title: "Erro",
        description: "Não foi possível baixar o documento. URL não disponível.",
      });
      return;
    }
    
    // Open the URL in a new tab to download it
    window.open(pdfUrl, '_blank');
    
    toast({
      title: "Documento baixado",
      description: `${document?.title} foi baixado com sucesso.`,
    });
  };

  const handleShare = () => {
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
      <Button variant="outline" size="sm" onClick={handleDownload}>
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
