
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DocumentMetadataProps {
  document: any;
}

export const DocumentMetadata: React.FC<DocumentMetadataProps> = ({ document }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatFileSize = (size?: number) => {
    if (!size) return 'N/A';
    const kb = size / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(2)} KB`;
    } else {
      return `${(kb / 1024).toFixed(2)} MB`;
    }
  };

  return (
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
  );
};
