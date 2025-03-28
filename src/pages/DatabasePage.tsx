import React, { useState, useEffect, useRef } from 'react';
import { supabase, getTable } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIAssistant } from '@/components/AIAssistant';
import { Input } from '@/components/ui/input';
import { suggestedDatabaseQuestions } from '@/utils/aiUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronRight, Database, FileQuestion, Search, Database as DatabaseIcon, FileText, History, X } from 'lucide-react';
import { generateResponse } from '@/utils/aiUtils';
import { useToast } from '@/components/ui/use-toast';
import { DataSourcesTab } from '@/components/database/DataSourcesTab';
import { useLocation } from 'react-router-dom';
import { getCurrentAIModel } from '@/utils/aiUtils';
import { Checkbox } from '@/components/ui/checkbox';

interface GenericTableData {
  id?: string;
  [key: string]: any;
}

interface FundingProgram {
  id: string;
  name: string;
  description?: string;
  application_deadline: string;
  end_date: string;
  total_budget?: number;
  sector_focus?: string[];
  funding_type?: string;
}

interface TableSchema {
  tableName: string;
  description: string;
  columns: {
    name: string;
    type: string;
    description: string;
  }[];
}

interface QueryResult {
  message: string;
  sqlQuery: string;
  results: any[] | null;
}

interface QueryHistoryItem {
  id: string;
  question: string;
  timestamp: Date;
  result: {
    message: string;
    sqlQuery: string;
    results: any[] | null;
  };
  isCorrect: boolean | null;
}

export const DatabasePage: React.FC = () => {
  const location = useLocation();
  const [tableData, setTableData] = useState<GenericTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTable, setActiveTable] = useState('ani_funding_programs');
  const [tableSchemas, setTableSchemas] = useState<TableSchema[]>([
    {
      tableName: 'ani_funding_programs',
      description: 'Contains information about available funding programs',
      columns: [
        { name: 'id', type: 'uuid', description: 'Unique identifier' },
        { name: 'name', type: 'text', description: 'Program name' },
        { name: 'description', type: 'text', description: 'Program description' },
        { name: 'total_budget', type: 'numeric', description: 'Total budget available' },
        { name: 'application_deadline', type: 'date', description: 'Deadline for applications' },
        { name: 'end_date', type: 'date', description: 'Program end date' },
        { name: 'sector_focus', type: 'text[]', description: 'Target sectors' },
        { name: 'funding_type', type: 'text', description: 'Type of funding' }
      ]
    },
    {
      tableName: 'ani_projects',
      description: 'Research and innovation projects information',
      columns: [
        { name: 'id', type: 'uuid', description: 'Unique identifier' },
        { name: 'title', type: 'text', description: 'Project title' },
        { name: 'description', type: 'text', description: 'Project description' },
        { name: 'funding_amount', type: 'numeric', description: 'Amount of funding' },
        { name: 'start_date', type: 'date', description: 'Project start date' },
        { name: 'end_date', type: 'date', description: 'Project end date' },
        { name: 'status', type: 'text', description: 'Current status' },
        { name: 'sector', type: 'text', description: 'Project sector' },
        { name: 'region', type: 'text', description: 'Project region' }
      ]
    },
    {
      tableName: 'ani_metrics',
      description: 'Innovation and R&D metrics',
      columns: [
        { name: 'id', type: 'uuid', description: 'Unique identifier' },
        { name: 'name', type: 'text', description: 'Metric name' },
        { name: 'category', type: 'text', description: 'Metric category' },
        { name: 'value', type: 'numeric', description: 'Metric value' },
        { name: 'unit', type: 'text', description: 'Unit of measurement' },
        { name: 'measurement_date', type: 'date', description: 'Date measured' },
        { name: 'region', type: 'text', description: 'Geographic region' },
        { name: 'sector', type: 'text', description: 'Industry sector' },
        { name: 'source', type: 'text', description: 'Data source' }
      ]
    },
    {
      tableName: 'ani_policy_frameworks',
      description: 'Policy frameworks for innovation',
      columns: [
        { name: 'id', type: 'uuid', description: 'Unique identifier' },
        { name: 'title', type: 'text', description: 'Framework title' },
        { name: 'description', type: 'text', description: 'Framework description' },
        { name: 'implementation_date', type: 'date', description: 'Date implemented' },
        { name: 'status', type: 'text', description: 'Current status' },
        { name: 'key_objectives', type: 'text[]', description: 'Main objectives' }
      ]
    },
    {
      tableName: 'ani_international_collaborations',
      description: 'International research collaborations',
      columns: [
        { name: 'id', type: 'uuid', description: 'Unique identifier' },
        { name: 'program_name', type: 'text', description: 'Collaboration program name' },
        { name: 'country', type: 'text', description: 'Partner country' },
        { name: 'partnership_type', type: 'text', description: 'Type of partnership' },
        { name: 'focus_areas', type: 'text[]', description: 'Areas of focus' },
        { name: 'start_date', type: 'date', description: 'Start date' },
        { name: 'end_date', type: 'date', description: 'End date' },
        { name: 'total_budget', type: 'numeric', description: 'Total budget' }
      ]
    }
  ]);
  const [activeQuestion, setActiveQuestion] = useState('');
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const [currentAIModel, setCurrentAIModel] = useState<string>('Loading...');
  const { toast } = useToast();

  const getActiveTabFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'query';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromURL());

  useEffect(() => {
    setActiveTab(getActiveTabFromURL());
  }, [location.search]);

  useEffect(() => {
    const fetchAIModel = async () => {
      try {
        const model = await getCurrentAIModel();
        setCurrentAIModel(model);
      } catch (error) {
        console.error("Error fetching AI model:", error);
        setCurrentAIModel("Error loading model");
      }
    };
    
    fetchAIModel();
    
    const savedHistory = localStorage.getItem('queryHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        
        const validHistory = parsedHistory.filter((item: any) => 
          item && item.question && item.result && typeof item.result === 'object'
        );
        
        setQueryHistory(validHistory);
      } catch (e) {
        console.error('Error loading query history:', e);
        localStorage.setItem('queryHistory', JSON.stringify([]));
      }
    }
  }, []);
  
  useEffect(() => {
    if (queryHistory.length > 0) {
      localStorage.setItem('queryHistory', JSON.stringify(queryHistory));
    }
  }, [queryHistory]);

  const fetchDataFromLocalStorage = () => {
    try {
      setLoading(true);
      
      let data = [];
      switch (activeTable) {
        case 'ani_funding_programs':
          data = JSON.parse(localStorage.getItem('sampleFundingPrograms') || '[]');
          break;
        case 'ani_international_collaborations':
          data = JSON.parse(localStorage.getItem('sampleCollaborations') || '[]');
          break;
        case 'ani_metrics':
          data = JSON.parse(localStorage.getItem('sampleMetrics') || '[]');
          break;
        case 'ani_policy_frameworks':
          data = JSON.parse(localStorage.getItem('samplePolicyFrameworks') || '[]');
          break;
        case 'ani_projects':
          data = JSON.parse(localStorage.getItem('sampleProjects') || '[]');
          break;
        default:
          data = JSON.parse(localStorage.getItem('sampleFundingPrograms') || '[]');
      }
      
      const processedData = ensureValidData(data);
      setTableData(processedData);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data from localStorage');
    } finally {
      setLoading(false);
    }
  };

  const ensureValidData = (data: any[]): GenericTableData[] => {
    if (!data) return [];
    
    return data.filter(item => item && typeof item === 'object').map(item => {
      if (!item.id && (item.project_id || item.researcher_id)) {
        return {
          ...item,
          id: item.project_id + '-' + item.researcher_id
        };
      }
      return item;
    });
  };

  const fetchFundingPrograms = async () => {
    try {
      setLoading(true);
      
      const { data: supabaseData, error: supabaseError } = await getTable(activeTable)
        .select('*')
        .limit(20);

      if (supabaseError) throw supabaseError;
      
      if (supabaseData && supabaseData.length > 0) {
        const processedData = ensureValidData(supabaseData);
        setTableData(processedData);
      } else {
        fetchDataFromLocalStorage();
      }
    } catch (error) {
      console.error(`Error fetching data from ${activeTable}:`, error);
      fetchDataFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundingPrograms();
  }, [activeTable]);

  const handleQuestionClick = async (question: string) => {
    setActiveQuestion(question);
    setIsQueryLoading(true);
    setQueryResult(null);
    
    try {
      toast({
        title: "Processing query",
        description: "Executing your question...",
      });
      
      const response = await generateResponse(question);
      setQueryResult(response);
      
      const historyItem: QueryHistoryItem = {
        id: crypto.randomUUID(),
        question,
        timestamp: new Date(),
        result: response,
        isCorrect: null
      };
      
      setQueryHistory(prev => [historyItem, ...prev]);

      toast({
        title: "Query processed",
        description: "The query has been executed successfully.",
      });
    } catch (error) {
      console.error('Error executing query:', error);
      
      const errorResult: QueryResult = {
        message: "Sorry, there was an error processing your query. Please try again. The error was: " + 
          (error instanceof Error ? error.message : String(error)),
        sqlQuery: "",
        results: null
      };
      
      setQueryResult(errorResult);
      
      const historyItem: QueryHistoryItem = {
        id: crypto.randomUUID(),
        question,
        timestamp: new Date(),
        result: errorResult,
        isCorrect: null
      };
      
      setQueryHistory(prev => [historyItem, ...prev]);
      
      toast({
        title: "Query failed",
        description: "Failed to process the query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsQueryLoading(false);
    }
  };

  const markQueryAccuracy = (id: string, isCorrect: boolean) => {
    setQueryHistory(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isCorrect } : item
      )
    );
    
    toast({
      title: isCorrect ? "Marked as correct" : "Marked as incorrect",
      description: `Query has been marked as ${isCorrect ? 'correctly' : 'incorrectly'} answered.`,
    });
  };

  const renderTableContent = () => {
    if (loading) {
      return <p className="py-4 text-center">Loading data...</p>;
    }
    
    if (error) {
      return <p className="py-4 text-center text-red-500">{error}</p>;
    }
    
    if (tableData.length === 0) {
      return <p className="py-4 text-center">No data found</p>;
    }
    
    const item = tableData[0];
    const columns = Object.keys(item);
    
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item, index) => (
              <TableRow key={index}>
                {columns.map(col => (
                  <TableCell key={col}>
                    {renderCellValue(item[col], col)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderCellValue = (value: any, columnName?: string) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    if (typeof value === 'number' && columnName && (
      columnName.toLowerCase().includes('budget') || 
      columnName.toLowerCase().includes('amount') || 
      columnName.toLowerCase().includes('funding') ||
      columnName.toLowerCase().includes('cost') ||
      columnName.toLowerCase().includes('price') ||
      columnName.toLowerCase().includes('value') || 
      columnName.toLowerCase().includes('contribution') ||
      !(columnName.toLowerCase().includes('count') || 
        columnName.toLowerCase().includes('total_collaborations') ||
        columnName.toLowerCase().includes('number') ||
        columnName.toLowerCase().includes('qty') ||
        columnName.toLowerCase().includes('quantity'))
    )) {
      return new Intl.NumberFormat('pt-PT', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    
    return String(value);
  };

  const handleTableChange = (table: string) => {
    setActiveTable(table);
  };

  const renderAIModelInfo = () => (
    <div className="text-sm text-gray-500 mt-2 flex items-center">
      <span className="mr-2">Current AI Model:</span>
      <Badge variant="outline" className="font-mono">{currentAIModel}</Badge>
    </div>
  );

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const safeRenderHistoryItem = (item: QueryHistoryItem) => {
    if (!item || !item.question || !item.result) {
      return null;
    }

    return (
      <div key={item.id} className="border rounded-lg p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium">{item.question}</h3>
            <p className="text-sm text-gray-500">{formatTimestamp(item.timestamp)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant={item.isCorrect === true ? "default" : "outline"}
              className="flex items-center gap-1"
              onClick={() => markQueryAccuracy(item.id, true)}
            >
              <Check className="h-4 w-4" />
              <span>Correct</span>
            </Button>
            <Button 
              size="sm" 
              variant={item.isCorrect === false ? "destructive" : "outline"}
              className="flex items-center gap-1"
              onClick={() => markQueryAccuracy(item.id, false)}
            >
              <X className="h-4 w-4" />
              <span>Incorrect</span>
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="whitespace-pre-wrap">{item.result.message}</div>
          
          {item.result.sqlQuery && (
            <div className="mt-3">
              <div className="text-xs font-medium text-gray-500 mb-1">SQL Query:</div>
              <pre className="bg-gray-800 text-gray-100 p-2 rounded-md text-xs overflow-x-auto">
                {item.result.sqlQuery}
              </pre>
            </div>
          )}
          
          {item.result.results && item.result.results.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-medium text-gray-500 mb-1">Results:</div>
              <div className="overflow-x-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(item.result.results[0]).map((column) => (
                        <TableHead key={column} className="text-xs">{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.result.results.slice(0, 5).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Object.entries(row).map(([column, value]) => (
                          <TableCell key={`${rowIndex}-${column}`} className="text-xs">
                            {renderCellValue(value, column)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {item.result.results.length > 5 && (
                  <div className="text-xs text-gray-500 p-2 text-center border-t">
                    Showing 5 of {item.result.results.length} results
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Database Explorer</h1>
          {renderAIModelInfo()}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="mb-4">
            <TabsTrigger value="query">
              <Search className="w-4 h-4 mr-2" />
              Query Assistant
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              Query History
            </TabsTrigger>
            <TabsTrigger value="datasources">
              <FileText className="w-4 h-4 mr-2" />
              Fontes de Dados
            </TabsTrigger>
            <TabsTrigger value="schema">
              <Database className="w-4 h-4 mr-2" />
              Database Schema
            </TabsTrigger>
            <TabsTrigger value="data">
              <FileQuestion className="w-4 h-4 mr-2" />
              Sample Data
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="query" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Suggested Questions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-2">
                        {suggestedDatabaseQuestions.map((question, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded-md cursor-pointer flex items-center hover:bg-gray-100 ${
                              activeQuestion === question ? 'bg-gray-100 border border-gray-200' : ''
                            }`}
                            onClick={() => handleQuestionClick(question)}
                          >
                            <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">{question}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
              <div className="col-span-2">
                {isQueryLoading ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                        <p className="text-gray-500">Executing query...</p>
                        <p className="text-sm text-gray-400 mt-2 italic">{activeQuestion}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : queryResult ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Query Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="resposta" className="w-full">
                        <TabsList className="mb-4">
                          <TabsTrigger value="resposta">Resposta</TabsTrigger>
                          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="resposta">
                          <div className="bg-gray-50 p-4 rounded-md border">
                            <div className="font-semibold mb-2 text-primary">{activeQuestion}</div>
                            
                            {queryResult.results && queryResult.results.length > 0 ? (
                              <div className="overflow-x-auto border rounded-md">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      {Object.keys(queryResult.results[0]).map((column) => (
                                        <TableHead key={column}>{column}</TableHead>
                                      ))}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {queryResult.results.map((row, rowIndex) => (
                                      <TableRow key={rowIndex}>
                                        {Object.entries(row).map(([column, value]) => (
                                          <TableCell key={`${rowIndex}-${column}`}>
                                            {renderCellValue(value, column)}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <div className="whitespace-pre-wrap">{queryResult.message}</div>
                            )}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="detalhes">
                          <div className="bg-gray-50 p-4 rounded-md border">
                            <div className="font-semibold mb-2 text-primary">{activeQuestion}</div>
                            <div className="whitespace-pre-wrap">{queryResult.message}</div>
                            
                            {queryResult.sqlQuery && (
                              <div className="mt-4">
                                <div className="text-sm font-medium text-gray-500 mb-1">SQL Query:</div>
                                <pre className="bg-gray-800 text-gray-100 p-2 rounded-md text-sm overflow-x-auto">
                                  {queryResult.sqlQuery}
                                </pre>
                              </div>
                            )}
                            
                            {queryResult.results && queryResult.results.length > 0 && (
                              <div className="mt-4">
                                <div className="text-sm font-medium text-gray-500 mb-1">Results:</div>
                                <div className="overflow-x-auto border rounded-md">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        {Object.keys(queryResult.results[0]).map((column) => (
                                          <TableHead key={column}>{column}</TableHead>
                                        ))}
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {queryResult.results.map((row, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                          {Object.entries(row).map(([column, value]) => (
                                            <TableCell key={`${rowIndex}-${column}`}>
                                              {renderCellValue(value, column)}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ) : (
                  <AIAssistant />
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Query History</CardTitle>
              </CardHeader>
              <CardContent>
                {!queryHistory.length ? (
                  <div className="text-center py-8 text-gray-500">
                    <History className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No queries have been executed yet.</p>
                    <p className="text-sm mt-1">Try asking a question in the Query Assistant tab.</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {queryHistory
                        .filter(item => item && item.question && item.result)
                        .map((item) => safeRenderHistoryItem(item))
                        .filter(Boolean)
                      }
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="datasources">
            <DataSourcesTab />
          </TabsContent>
          
          <TabsContent value="schema">
            <Card>
              <CardHeader>
                <CardTitle>Database Schema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {tableSchemas.map((table) => (
                    <div key={table.tableName} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium">{table.tableName}</h3>
                        <Badge variant="outline">{table.columns.length} columns</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{table.description}</p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Column</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {table.columns.map((column) => (
                            <TableRow key={`${table.tableName}-${column.name}`}>
                              <TableCell className="font-medium">{column.name}</TableCell>
                              <TableCell>
                                <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                                  {column.type}
                                </code>
                              </TableCell>
                              <TableCell>{column.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Database Tables</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={fetchFundingPrograms} disabled={loading} size="sm">
                    Refresh Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="ani_funding_programs" className="mt-2" onValueChange={handleTableChange}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="ani_funding_programs">Funding Programs</TabsTrigger>
                    <TabsTrigger value="ani_metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="ani_projects">Projects</TabsTrigger>
                    <TabsTrigger value="ani_international_collaborations">Int'l Collaborations</TabsTrigger>
                    <TabsTrigger value="ani_policy_frameworks">Policy Frameworks</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ani_funding_programs">
                    {renderTableContent()}
                  </TabsContent>
                  
                  <TabsContent value="ani_metrics">
                    {renderTableContent()}
                  </TabsContent>
                  
                  <TabsContent value="ani_projects">
                    {renderTableContent()}
                  </TabsContent>
                  
                  <TabsContent value="ani_international_collaborations">
                    {renderTableContent()}
                  </TabsContent>
                  
                  <TabsContent value="ani_policy_frameworks">
                    {renderTableContent()}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DatabasePage;
