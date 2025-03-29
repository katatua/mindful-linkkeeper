
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { insertTableData } from '@/utils/databaseService';
import { FonteDados } from '@/types/databaseTypes';

interface AddDataSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddDataSourceModal: React.FC<AddDataSourceModalProps> = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [sourceName, setSourceName] = useState('');
  const [description, setDescription] = useState('');
  const [technology, setTechnology] = useState('');
  const [entity, setEntity] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['application/pdf', 'text/csv', 'application/vnd.ms-excel'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo não suportado",
        description: 'Por favor, carregue apenas arquivos PDF ou CSV.',
        variant: 'destructive',
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: 'O tamanho máximo do arquivo é 10MB.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!sourceName || !description || !technology) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Create data source record
      const newSource: Partial<FonteDados> = {
        nome_sistema: sourceName,
        descricao: description,
        tecnologia: technology,
        entidade: entity || undefined
      };
      
      const success = await insertTableData('fontes_dados', newSource);
      
      if (!success) {
        throw new Error('Falha ao cadastrar fonte de dados');
      }
      
      // If file is present, upload it to storage
      if (file) {
        // Create storage bucket if it doesn't exist
        const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('files');
        if (bucketError && bucketError.message.includes('does not exist')) {
          await supabase.storage.createBucket('files', { public: true });
        }
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${file.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('files')
          .upload(fileName, file);
          
        if (uploadError) {
          throw new Error(`Erro ao fazer upload do arquivo: ${uploadError.message}`);
        }
        
        const fileUrl = supabase.storage.from('files').getPublicUrl(fileName).data.publicUrl;
        
        // TODO: Extract content and analyze with AI
        
        // Create document record
        const documentData = {
          fonte_id: 1, // We would need to get the actual ID from the inserted source
          nome: file.name,
          tipo: file.type,
          tamanho: `${(file.size / 1024).toFixed(2)} KB`,
          status: 'pendente',
        };
        
        await insertTableData('documentos_extraidos', documentData);
      }
      
      toast({
        title: 'Fonte de dados adicionada',
        description: 'Fonte de dados cadastrada com sucesso!',
      });
      
      // Reset form
      setSourceName('');
      setDescription('');
      setTechnology('');
      setEntity('');
      setFile(null);
      
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding data source:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao adicionar a fonte de dados.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Fonte de Dados</DialogTitle>
          <DialogDescription>
            Cadastre uma nova fonte de dados para o sistema.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome*
            </Label>
            <Input
              id="name"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              className="col-span-3"
              placeholder="Nome do sistema fonte de dados"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição*
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Descrição do sistema fonte de dados"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="technology" className="text-right">
              Tecnologia*
            </Label>
            <Input
              id="technology"
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              className="col-span-3"
              placeholder="Tecnologia utilizada"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entity" className="text-right">
              Entidade
            </Label>
            <Input
              id="entity"
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              className="col-span-3"
              placeholder="Nome da entidade (opcional)"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              Arquivo
            </Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.csv"
              onChange={handleFileChange}
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Adicionar Fonte
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDataSourceModal;
