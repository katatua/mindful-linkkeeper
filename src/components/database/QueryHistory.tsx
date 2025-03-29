
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Clock, Trash2, RefreshCw, CheckCircle, XCircle, Loader2, MessageSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface QueryHistoryItem {
  id: string;
  timestamp: string;
  query_text: string;
  was_successful: boolean;
  language: string;
  error_message?: string;
  analysis_result?: any;
}

export const QueryHistory: React.FC = () => {
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQueryHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('query_history')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      setHistory(data || []);
    } catch (err) {
      console.error('Error fetching query history:', err);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar histórico de consultas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueryHistory();
  }, []);

  const clearHistory = async () => {
    const shouldDelete = confirm('Tem certeza que deseja limpar todo o histórico de consultas?');
    if (!shouldDelete) return;
    
    try {
      const { error } = await supabase
        .from('query_history')
        .delete()
        .is('user_id', null);
      
      if (error) throw error;
      
      setHistory([]);
      toast({
        title: 'Sucesso',
        description: 'O histórico de consultas foi limpo.',
      });
    } catch (err) {
      console.error('Error clearing history:', err);
      toast({
        title: 'Erro',
        description: 'Falha ao limpar o histórico de consultas.',
        variant: 'destructive',
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const hasAnalysis = (item: QueryHistoryItem) => {
    return item.analysis_result && 
           (item.analysis_result.insertStatements?.length > 0 || 
            item.analysis_result.analysis);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Consultas Recentes
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchQueryHistory}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm" onClick={clearHistory}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Histórico
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum histórico de consulta encontrado.</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data e Hora</TableHead>
                  <TableHead className="w-[50%]">Consulta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Idioma</TableHead>
                  <TableHead>Análise</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-xs">{formatTimestamp(item.timestamp)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {item.query_text}
                    </TableCell>
                    <TableCell>
                      {item.was_successful ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Sucesso
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Falha
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.language === 'pt' ? '🇵🇹' : '🇬🇧'} {item.language === 'pt' ? 'Português' : 'Inglês'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {hasAnalysis(item) ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                Disponível
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Análise e sugestões de IA disponíveis</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Badge variant="outline" className="text-gray-400">Nenhuma</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
