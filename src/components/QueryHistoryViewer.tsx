
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { StoredQuery } from "@/utils/queryHistory";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, XCircle, Database, History } from "lucide-react";

export function QueryHistoryViewer() {
  const { language } = useLanguage();
  const [queries, setQueries] = useState<StoredQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  const fetchQueryHistory = async () => {
    setLoading(true);
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('query_history')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.warn("Error fetching from Supabase, using local storage:", error);
        throw error;
      }
      
      setQueries(data || []);
    } catch (err) {
      // Fallback to local storage
      try {
        const localHistory = localStorage.getItem('queryHistory');
        if (localHistory) {
          const parsedHistory = JSON.parse(localHistory);
          setQueries(parsedHistory);
        } else {
          setQueries([]);
        }
      } catch (localErr) {
        console.error("Error loading from local storage:", localErr);
        setQueries([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueryHistory();
  }, []);

  const getFormattedDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return timestamp;
    }
  };

  const filteredQueries = activeTab === "all" 
    ? queries 
    : activeTab === "successful" 
      ? queries.filter(q => q.was_successful) 
      : activeTab === "failed" 
        ? queries.filter(q => !q.was_successful)
        : activeTab === "created-tables"
          ? queries.filter(q => q.created_tables && q.created_tables.length > 0)
          : queries;

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              {language === 'en' ? 'Query History' : 'Histórico de Consultas'}
            </CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'View past queries and actions taken by the system'
                : 'Visualize consultas anteriores e ações tomadas pelo sistema'}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchQueryHistory}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {language === 'en' ? 'Refresh' : 'Atualizar'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              <History className="h-4 w-4 mr-2" />
              {language === 'en' ? 'All Queries' : 'Todas as Consultas'}
            </TabsTrigger>
            <TabsTrigger value="successful">
              <CheckCircle className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Successful' : 'Bem-sucedidas'}
            </TabsTrigger>
            <TabsTrigger value="failed">
              <XCircle className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Failed' : 'Falhas'}
            </TabsTrigger>
            <TabsTrigger value="created-tables">
              <Database className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Created Tables' : 'Tabelas Criadas'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="rounded-md border">
              <Table>
                <TableCaption>
                  {loading 
                    ? (language === 'en' ? 'Loading query history...' : 'Carregando histórico de consultas...') 
                    : filteredQueries.length === 0 
                      ? (language === 'en' ? 'No queries found' : 'Nenhuma consulta encontrada')
                      : (language === 'en' 
                        ? `Showing ${filteredQueries.length} ${filteredQueries.length === 1 ? 'query' : 'queries'}`
                        : `Mostrando ${filteredQueries.length} ${filteredQueries.length === 1 ? 'consulta' : 'consultas'}`
                      )
                  }
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      {language === 'en' ? 'Timestamp' : 'Data/Hora'}
                    </TableHead>
                    <TableHead className="w-[100px]">
                      {language === 'en' ? 'Status' : 'Status'}
                    </TableHead>
                    <TableHead>
                      {language === 'en' ? 'Query' : 'Consulta'}
                    </TableHead>
                    <TableHead className="w-[200px]">
                      {language === 'en' ? 'Actions Taken' : 'Ações Tomadas'}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueries.map((query) => (
                    <TableRow key={query.id}>
                      <TableCell className="font-mono text-sm">
                        {getFormattedDate(query.timestamp)}
                      </TableCell>
                      <TableCell>
                        {query.was_successful ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {language === 'en' ? 'Success' : 'Sucesso'}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {language === 'en' ? 'Failed' : 'Falha'}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{query.query_text}</div>
                        {query.error_message && (
                          <div className="text-sm text-red-600 mt-2">
                            {query.error_message}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {query.created_tables && query.created_tables.length > 0 ? (
                          <div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-1">
                              {language === 'en' ? 'Created Tables' : 'Tabelas Criadas'}
                            </Badge>
                            <ul className="list-disc list-inside text-xs">
                              {query.created_tables.map((table, idx) => (
                                <li key={idx} className="text-gray-700">{table}</li>
                              ))}
                            </ul>
                          </div>
                        ) : query.was_successful ? (
                          <span className="text-sm text-gray-500">
                            {language === 'en' ? 'Used existing data' : 'Usou dados existentes'}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {language === 'en' ? 'No actions taken' : 'Nenhuma ação tomada'}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
