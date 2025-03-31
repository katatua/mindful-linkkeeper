
import React, { useState, useEffect } from 'react';
import { loadFromLocalStorage, STORAGE_KEYS } from '@/utils/storageUtils';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RefreshCw, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [expandedByDefault, setExpandedByDefault] = useState(false);

  const checkLoadedData = () => {
    const keys = Object.values(STORAGE_KEYS);
    const statusesResult: DataStatus[] = keys.map(key => {
      const friendlyName = key.replace('ani_', '').replace(/_/g, ' ');
      const data = loadFromLocalStorage(key, []);
      const loaded = Array.isArray(data) && data.length > 0;
      const count = Array.isArray(data) ? data.length : 0;
      
      // Log data for debugging
      if (loaded) {
        console.log(`${friendlyName} loaded with ${count} items`);
      } else {
        console.log(`${friendlyName} not loaded or empty`);
      }
      
      return {
        key,
        name: friendlyName,
        loaded,
        count
      };
    });
    
    // If any data is not loaded, expand the accordion by default
    const anyNotLoaded = statusesResult.some(status => !status.loaded);
    setExpandedByDefault(anyNotLoaded);
    
    setStatuses(statusesResult);
    setLastChecked(new Date());
    return statusesResult;
  };

  useEffect(() => {
    checkLoadedData();
    // Check data status every 1 second for more responsive updates
    const interval = setInterval(checkLoadedData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      // Small delay to ensure data has time to be saved
      setTimeout(() => {
        const newStatuses = checkLoadedData();
        setIsRefreshing(false);
        
        // Log the results of the refresh
        const loadedCount = newStatuses.filter(s => s.loaded).length;
        const totalCount = newStatuses.length;
        console.log(`After refresh: ${loadedCount}/${totalCount} data tables loaded`);
      }, 500);
    } catch (error) {
      setIsRefreshing(false);
      console.error("Error refreshing data:", error);
    }
  };

  const loadedCount = statuses.filter(s => s.loaded).length;
  const totalCount = statuses.length;

  // Detalhes sobre os tipos de dados disponíveis
  const getDataTypeDescription = (key: string): string => {
    const typeMap: {[key: string]: string} = {
      'ani_funding_programs': 'Programas de financiamento para pesquisa e inovação',
      'ani_projects': 'Projetos de pesquisa e inovação financiados',
      'ani_metrics': 'Métricas e estatísticas de inovação',
      'ani_researchers': 'Pesquisadores e cientistas',
      'ani_institutions': 'Instituições de pesquisa e empresas',
      'ani_patent_holders': 'Titulares de patentes',
      'ani_policy_frameworks': 'Estruturas de políticas de inovação',
      'ani_international_collaborations': 'Colaborações internacionais de pesquisa',
      'ani_funding_applications': 'Candidaturas a programas de financiamento'
    };
    
    return typeMap[key] || 'Dados de inovação';
  };

  return (
    <div className="border rounded-md p-4 mb-4 bg-background">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          Status de Carregamento dos Dados
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Esta área mostra se os dados de amostra foram carregados corretamente.
                  Se alguma tabela não estiver carregada, clique no botão de atualização.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Última verificação: {lastChecked.toLocaleTimeString()}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            title="Recarregar dados"
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

      <Accordion type="single" collapsible defaultValue={expandedByDefault ? "data-details" : undefined}>
        <AccordionItem value="data-details">
          <AccordionTrigger className="text-sm">Ver detalhes</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {statuses.map((status) => (
                <div key={status.key} className="flex items-center justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="capitalize">{status.name}</span>
                    <span className="text-xs text-muted-foreground">{getDataTypeDescription(status.key)}</span>
                  </div>
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
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Estes dados são usados para responder consultas sobre programas de financiamento, 
              projetos de inovação, instituições de pesquisa, pesquisadores, métricas e políticas no sistema ANI.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
