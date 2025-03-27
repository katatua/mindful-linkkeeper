
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, FileText, FilePlus, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AddDataSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddDataSourceModal: React.FC<AddDataSourceModalProps> = ({ open, onOpenChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['application/pdf', 'text/csv'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Tipo de arquivo não suportado',
        description: 'Por favor, carregue apenas arquivos PDF ou CSV.',
        variant: 'destructive',
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O tamanho máximo do arquivo é 10MB.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const sanitizeFilename = (filename: string): string => {
    return filename
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      // Auto-populate name if not already set
      if (!name) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    } else {
      setFile(null);
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result.toString());
        } else {
          reject(new Error("Falha ao ler o arquivo"));
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      if (file.type === 'application/pdf') {
        // For PDFs we only read a portion as binary data
        reader.readAsArrayBuffer(file.slice(0, 5000));
      } else {
        // For CSV and other text files
        reader.readAsText(file);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'Arquivo necessário',
        description: 'Por favor, selecione um arquivo para carregar.',
        variant: 'destructive',
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: 'Nome necessário',
        description: 'Por favor, forneça um nome para a fonte de dados.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // First, upload the file to storage
      const fileExt = file.name.split('.').pop();
      const sanitizedName = sanitizeFilename(file.name);
      const fileName = `${Date.now()}-${sanitizedName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the file
      const fileUrl = supabase.storage.from('files').getPublicUrl(fileName).data.publicUrl;

      // Extract content for AI analysis
      setIsAnalyzing(true);
      let fileContent = '';
      try {
        fileContent = await readFileContent(file);
      } catch (error) {
        console.error('Error reading file content:', error);
        // Continue with limited or no content for analysis
        fileContent = `Unable to read content from ${file.name} (${file.type})`;
      }

      // Call the AI analysis edge function
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-document', {
        body: {
          content: fileContent,
          title: file.name,
          type: file.type,
          fileUrl: fileUrl
        }
      });

      if (analysisError) {
        console.error('Error analyzing document:', analysisError);
        // Continue without analysis data
      }

      // Create a link entry for the file
      const { error: linkError } = await supabase
        .from('links')
        .insert({
          title: name.trim(),
          url: fileName,
          source: 'datasource',
          summary: description.trim() || (analysisData?.summary || ''),
          category: analysisData?.suggestedCategory || 'Research Document',
          file_metadata: {
            name: file.name,
            size: file.size,
            type: file.type
          },
          ai_summary: analysisData?.summary || null,
          ai_analysis: analysisData?.analysis || null,
          user_id: user.id
        });

      if (linkError) throw linkError;

      toast({
        title: 'Fonte de dados adicionada',
        description: 'O arquivo foi carregado e analisado com sucesso.',
      });
      
      onOpenChange(false);
      navigate('/database?tab=datasources');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Erro ao carregar arquivo',
        description: 'Ocorreu um erro ao processar o arquivo. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Fonte de Dados</DialogTitle>
          <DialogDescription>
            Carregue um arquivo PDF ou CSV para adicionar às fontes de dados.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">Arquivo</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.csv"
                onChange={handleFileChange}
                disabled={isUploading || isAnalyzing}
              />
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: PDF, CSV. Tamanho máximo: 10MB.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Fonte</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da fonte de dados"
                disabled={isUploading || isAnalyzing}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição da fonte de dados"
                disabled={isUploading || isAnalyzing}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading || isAnalyzing}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || isAnalyzing || !file}
            >
              {(isUploading || isAnalyzing) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isAnalyzing ? 'Analisando...' : 'Carregando...'}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Adicionar Fonte
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDataSourceModal;
