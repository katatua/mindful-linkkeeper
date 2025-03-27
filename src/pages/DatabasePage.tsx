import React, { useState, useEffect } from 'react';
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
import { ChevronRight, Database, FileQuestion, Search } from 'lucide-react';
import { generateResponse } from '@/utils/aiUtils';
import { useToast } from '@/components/ui/use-toast';

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

export const DatabasePage: React.FC = () => {
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
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const { toast } = useToast();

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
      const response = await generateResponse(question);
      setQueryResult(response);

      toast({
        title: "Query processed",
        description: "The query has been executed successfully.",
      });
    } catch (error) {
      console.error('Error executing query:', error);
      setQueryResult("Sorry, there was an error processing your query. Please try again.");
      
      toast({
        title: "Query failed",
        description: "Failed to process the query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsQueryLoading(false);
    }
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
                    {renderCellValue(item[col])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  const renderCellValue = (value: any) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return value.toString();
  };

  const handleTableChange = (table: string) => {
    setActiveTable(table);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Database Explorer</h1>
        
        <Tabs defaultValue="query">
          <TabsList className="mb-4">
            <TabsTrigger value="query">
              <Search className="w-4 h-4 mr-2" />
              Query Assistant
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
                    <CardTitle>Suggested Questions</CardTitle>
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
                      </div>
                    </CardContent>
                  </Card>
                ) : queryResult ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Query Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-md border">
                        <div className="font-semibold mb-2 text-primary">{activeQuestion}</div>
                        <div className="whitespace-pre-wrap">{queryResult}</div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <AIAssistant />
                )}
              </div>
            </div>
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
