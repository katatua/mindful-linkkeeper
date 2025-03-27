import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, FileText, Upload, Database as DatabaseIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema for form validation
const formSchema = z.object({
  sourceType: z.enum(['new', 'existing']),
  existingSourceId: z.number().optional(),
  sourceName: z.string().optional(),
  description: z.string().optional(),
  technology: z.string().optional(),
  fileName: z.string().optional(),
});

interface AddDataSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Define a type for initial data sources
interface DataSource {
  id: number;
  nome_sistema: string;
  descricao: string;
  tecnologia: string;
  data_importacao: string;
}

const initialDataSources: DataSource[] = [
  {
    id: 1,
    nome_sistema: "Diversas origens distribuídas por vários repositórios/sistemas de armazenamento",
    descricao: "Candidaturas de projetos; projetos; pareceres de peritos; respostas a questionários; representações; relatórios diversos; estudos; etc.",
    tecnologia: "Documentos PDF; Documentos Word; Documentos Excel; Outros formatos office; Outros documentos em formato open source",
    data_importacao: new Date().toISOString()
  },
  {
    id: 2,
    nome_sistema: "Dados de projetos financiados por Fundos Europeus de gestão centralizada (Horizonte Europa, Programa Europa Digital)",
    descricao: "Dados relativos à atribuição de financiamento através de fundos europeus de gestão centralizada a entidades empresariais e não empresariais.",
    tecnologia: "Outsystems (SQL Server)",
    data_importacao: new Date().toISOString()
  },
  {
    id: 3,
    nome_sistema: "Dados de projetos financiados por Fundos Europeus e por Fundos Nacionais (rede EUREKA)",
    descricao: "Dados relativos à atribuição de financiamento através de fundos europeus e por fundos nacionais a entidades empresariais e não empresariais.",
    tecnologia: "Outsystems (SQL Server)",
    data_importacao: new Date().toISOString()
  },
  {
    id: 4,
    nome_sistema: "Instituições de I&D",
    descricao: "Dados relativos ao mapeamento das entidades que fazem Investigação & Desenvolvimento em Portugal e na Europa.",
    tecnologia: "Outsystems (SQL Server)",
    data_importacao: new Date().toISOString()
  },
  {
    id: 5,
    nome_sistema: "Dados sobre Cooperação Internacional",
    descricao: "Dados relativos à Bolsa de Tecnologia e Negócios, onde a procura e a oferta de tecnologias são valorizadas.",
    tecnologia: "Outsystems (SQL Server)",
    data_importacao: new Date().toISOString()
  }
];

const AddDataSourceModal: React.FC<AddDataSourceModalProps> = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast: toastNotification } = useToast();
  const navigate = useNavigate();
  const [dataSources] = useState<DataSource[]>(initialDataSources);
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceType: 'new',
      sourceName: '',
      description: '',
      technology: '',
    }
  });

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['application/pdf', 'text/csv', 'application/vnd.ms-excel'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast("Tipo de arquivo não suportado", {
        description: 'Por favor, carregue apenas arquivos PDF ou CSV.',
      });
      return false;
    }

    if (file.size > maxSize) {
      toast("Arquivo muito grande", {
        description: 'O tamanho máximo do arquivo é 10MB.',
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
    console.log('File selected:', selectedFile);
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      form.setValue('fileName', selectedFile.name.replace(/\.[^/.]+$/, ""));
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
        const chunk = file.slice(0, 5000);
        reader.readAsText(chunk);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const generateAIDescription = async (fileContent: string, fileName: string): Promise<{
    suggestedName: string;
    suggestedDescription: string;
    suggestedTechnology: string;
  }> => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: {
          content: fileContent,
          title: fileName,
          type: file?.type || 'unknown'
        }
      });
      
      if (error) {
        console.error('Error generating AI description:', error);
        return {
          suggestedName: fileName,
          suggestedDescription: 'Fonte de dados para análise e consulta.',
          suggestedTechnology: file?.type || 'Documento digital'
        };
      }
      
      return {
        suggestedName: data.suggestedTitle || fileName,
        suggestedDescription: data.summary || 'Fonte de dados para análise e consulta.',
        suggestedTechnology: data.suggestedCategory || (file?.type || 'Documento digital')
      };
    } catch (error) {
      console.error('Error in AI description generation:', error);
      return {
        suggestedName: fileName,
        suggestedDescription: 'Fonte de dados para análise e consulta.',
        suggestedTechnology: file?.type || 'Documento digital'
      };
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted with values:', values);
    
    if (!file) {
      toastNotification({
        title: 'Arquivo necessário',
        description: 'Por favor, selecione um arquivo para carregar.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast("Erro de autenticação", {
          description: 'Você precisa estar autenticado para adicionar fontes de dados.',
        });
        setIsUploading(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const sanitizedName = sanitizeFilename(file.name);
      const fileName = `${Date.now()}-${sanitizedName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Erro ao fazer upload do arquivo: ${uploadError.message}`);
      }

      const fileUrl = supabase.storage.from('files').getPublicUrl(fileName).data.publicUrl;

      let fileContent = '';
      let sourceName = values.sourceName || '';
      let sourceDescription = values.description || '';
      let sourceTechnology = values.technology || '';
      
      if (values.sourceType === 'existing' && values.existingSourceId) {
        const selectedSource = dataSources.find(src => src.id === values.existingSourceId);
        if (selectedSource) {
          sourceName = selectedSource.nome_sistema;
          sourceDescription = selectedSource.descricao;
          sourceTechnology = selectedSource.tecnologia;
        }
      } else if (values.sourceType === 'new') {
        if (!sourceName || !sourceDescription || !sourceTechnology) {
          try {
            fileContent = await readFileContent(file);
            
            const aiResults = await generateAIDescription(fileContent, file.name);
            
            if (!sourceName) sourceName = aiResults.suggestedName;
            if (!sourceDescription) sourceDescription = aiResults.suggestedDescription;
            if (!sourceTechnology) sourceTechnology = aiResults.suggestedTechnology;
          } catch (error) {
            console.error('Error generating source metadata:', error);
            if (!sourceName) sourceName = file.name.replace(/\.[^/.]+$/, "");
            if (!sourceDescription) sourceDescription = 'Fonte de dados para análise e consulta.';
            if (!sourceTechnology) sourceTechnology = file.type || 'Documento digital';
          }
        }
      }

      let analysisData = { summary: '', analysis: '', suggestedCategory: '' };
      if (fileContent) {
        try {
          const { data, error: analysisError } = await supabase.functions.invoke('analyze-document', {
            body: {
              content: fileContent,
              title: file.name,
              type: file.type,
              fileUrl: fileUrl
            }
          });

          if (!analysisError && data) {
            analysisData = data;
          }
        } catch (error) {
          console.error('Error analyzing document:', error);
        }
      }

      const { error: linkError } = await supabase
        .from('links')
        .insert({
          title: values.fileName || file.name.replace(/\.[^/.]+$/, ""),
          url: fileUrl,
          source: 'datasource',
          summary: sourceDescription,
          category: sourceTechnology,
          file_metadata: {
            name: file.name,
            size: file.size,
            type: file.type,
            source_name: sourceName,
            source_type: values.sourceType,
            source_id: values.sourceType === 'existing' ? values.existingSourceId : null
          },
          ai_summary: analysisData?.summary || null,
          ai_analysis: analysisData?.analysis || null,
          user_id: user.id
        });

      if (linkError) {
        throw new Error(`Erro ao criar entrada no banco de dados: ${linkError.message}`);
      }

      toast("Fonte de dados adicionada", {
        description: 'O arquivo foi carregado e associado à fonte com sucesso.',
      });
      
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
      navigate(`/database?tab=datasources`);
    } catch (error) {
      console.error('Error in upload process:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast("Erro ao carregar arquivo", {
        description: `Ocorreu um erro ao processar o arquivo: ${errorMessage}`,
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset({
        sourceType: 'new',
        existingSourceId: undefined,
        sourceName: '',
        description: '',
        technology: '',
        fileName: ''
      });
      setFile(null);
    }
  }, [open, form]);

  const sourceType = form.watch('sourceType');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Fonte de Dados</DialogTitle>
          <DialogDescription>
            Carregue um arquivo PDF ou CSV para adicionar às fontes de dados.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-2">
              <FormField
                control={form.control}
                name="sourceType"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Tipo de Fonte</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="existing" id="existing" />
                          <Label htmlFor="existing">Selecionar fonte existente</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="new" id="new" />
                          <Label htmlFor="new">Criar nova fonte</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              {sourceType === 'existing' && (
                <FormField
                  control={form.control}
                  name="existingSourceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione a Fonte</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma fonte de dados" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dataSources.map((source) => (
                            <SelectItem key={source.id} value={source.id.toString()}>
                              {source.nome_sistema}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}

              {sourceType === 'new' && (
                <>
                  <FormField
                    control={form.control}
                    name="sourceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Fonte</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome da fonte de dados"
                            {...field}
                            disabled={isUploading || isAnalyzing}
                          />
                        </FormControl>
                        <FormDescription>
                          Se vazio, será gerado automaticamente após o upload do arquivo.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descrição da fonte de dados"
                            {...field}
                            disabled={isUploading || isAnalyzing}
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Se vazio, será gerado automaticamente após o upload do arquivo.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="technology"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tecnologia</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tecnologia utilizada (ex: PDF, CSV, SQL)"
                            {...field}
                            disabled={isUploading || isAnalyzing}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="grid gap-2">
                <Label htmlFor="file" className="font-medium">Arquivo</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.csv"
                  onChange={handleFileChange}
                  disabled={isUploading || isAnalyzing}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: PDF, CSV. Tamanho máximo: 10MB.
                </p>
              </div>

              {file && (
                <FormField
                  control={form.control}
                  name="fileName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Documento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome do documento"
                          {...field}
                          disabled={isUploading || isAnalyzing}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter className="mt-4 pt-4 border-t flex justify-between">
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDataSourceModal;
