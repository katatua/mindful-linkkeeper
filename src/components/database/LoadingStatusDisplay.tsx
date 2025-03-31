
import React, { useState, useEffect } from 'react';
import { loadFromLocalStorage, STORAGE_KEYS } from '@/utils/storageUtils';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataStatus {
  key: string;
  name: string;
  loaded: boolean;
  count: number;
}

export const LoadingStatusDisplay: React.FC<{ onRefresh: () => Promise<void> }> = ({ onRefresh }) => {
  const [statuses, setStatuses] = useState<DataStatus[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  const checkLoadedData = () => {
    const keys = Object.values(STORAGE_KEYS);
    const statusesResult: DataStatus[] = keys.map(key => {
      const friendlyName = key.replace('ani_', '').replace('_', ' ');
      const data = loadFromLocalStorage(key, []);
      return {
        key,
        name: friendlyName,
        loaded: Array.isArray(data) && data.length > 0,
        count: Array.isArray(data) ? data.length : 0
      };
    });
    
    setStatuses(statusesResult);
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkLoadedData();
    // Check again every 5 seconds
    const interval = setInterval(checkLoadedData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      checkLoadedData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadedCount = statuses.filter(s => s.loaded).length;
  const totalCount = statuses.length;

  return (
    <div className="border rounded-md p-4 mb-4 bg-background">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Status de Carregamento dos Dados</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Última verificação: {lastChecked.toLocaleTimeString()}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Tabelas Carregadas</span>
          <span className="text-xl font-bold">{loadedCount}/{totalCount}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Status</span>
          <div className="flex items-center gap-2">
            {loadedCount === totalCount ? (
              <Badge className="bg-green-500">Todos Carregados</Badge>
            ) : loadedCount === 0 ? (
              <Badge variant="destructive">Nenhum Carregado</Badge>
            ) : (
              <Badge variant="outline">Parcialmente Carregado</Badge>
            )}
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="data-details">
          <AccordionTrigger className="text-sm">Ver detalhes</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {statuses.map((status) => (
                <div key={status.key} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{status.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{status.count} itens</span>
                    {status.loaded ? (
                      <Badge className="bg-green-500 text-xs">Carregado</Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">Não Carregado</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
