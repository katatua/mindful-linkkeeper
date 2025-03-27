
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  const [fundingPrograms, setFundingPrograms] = useState<FundingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const fetchFundingPrograms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ani_funding_programs')
        .select('*')
        .order('application_deadline', { ascending: true });

      if (error) throw error;
      setFundingPrograms(data || []);
    } catch (error) {
      console.error('Error fetching funding programs:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundingPrograms();
  }, []);

  const handleQuestionClick = async (question: string) => {
    setActiveQuestion(question);
    setIsQueryLoading(true);
    setQueryResult(null);
    
    try {
      // Use the AI assistant to generate a response to the question
      const response = await generateResponse(question);
      setQueryResult(response);

      // Show success toast
      toast({
        title: "Query processed",
        description: "The query has been executed successfully.",
      });
    } catch (error) {
      console.error('Error executing query:', error);
      setQueryResult("Sorry, there was an error processing your query. Please try again.");
      
      // Show error toast
      toast({
        title: "Query failed",
        description: "Failed to process the query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsQueryLoading(false);
    }
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
                <CardTitle>Funding Programs</CardTitle>
                <Button onClick={fetchFundingPrograms} disabled={loading} size="sm">
                  Refresh Data
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="table" className="mt-2">
                  <TabsList className="mb-4">
                    <TabsTrigger value="table">Table View</TabsTrigger>
                    <TabsTrigger value="cards">Card View</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="table">
                    {loading ? (
                      <p>Loading data...</p>
                    ) : error ? (
                      <p className="text-red-500">{error}</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Application Deadline</TableHead>
                              <TableHead>End Date</TableHead>
                              <TableHead>Total Budget</TableHead>
                              <TableHead>Sector Focus</TableHead>
                              <TableHead>Funding Type</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {fundingPrograms.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center">No funding programs found</TableCell>
                              </TableRow>
                            ) : (
                              fundingPrograms.map((program) => (
                                <TableRow key={program.id}>
                                  <TableCell className="font-medium">{program.name}</TableCell>
                                  <TableCell>{program.description || 'N/A'}</TableCell>
                                  <TableCell>
                                    {program.application_deadline 
                                      ? new Date(program.application_deadline).toLocaleDateString() 
                                      : 'N/A'}
                                  </TableCell>
                                  <TableCell>
                                    {program.end_date 
                                      ? new Date(program.end_date).toLocaleDateString() 
                                      : 'N/A'}
                                  </TableCell>
                                  <TableCell>
                                    {program.total_budget
                                      ? new Intl.NumberFormat('pt-PT', { 
                                          style: 'currency', 
                                          currency: 'EUR' 
                                        }).format(program.total_budget)
                                      : 'N/A'}
                                  </TableCell>
                                  <TableCell>
                                    {program.sector_focus 
                                      ? program.sector_focus.join(', ') 
                                      : 'N/A'}
                                  </TableCell>
                                  <TableCell>{program.funding_type || 'N/A'}</TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="cards">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {loading ? (
                        <p>Loading data...</p>
                      ) : error ? (
                        <p className="text-red-500">{error}</p>
                      ) : fundingPrograms.length === 0 ? (
                        <p>No funding programs found</p>
                      ) : (
                        fundingPrograms.map((program) => (
                          <Card key={program.id}>
                            <CardHeader>
                              <CardTitle>{program.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 mb-2">{program.description}</p>
                              <div className="space-y-2">
                                <p>
                                  <strong>Application Deadline:</strong>{' '}
                                  {program.application_deadline
                                    ? new Date(program.application_deadline).toLocaleDateString()
                                    : 'N/A'}
                                </p>
                                <p>
                                  <strong>Program End Date:</strong>{' '}
                                  {program.end_date
                                    ? new Date(program.end_date).toLocaleDateString()
                                    : 'N/A'}
                                </p>
                                {program.total_budget && (
                                  <p>
                                    <strong>Total Budget:</strong>{' '}
                                    {new Intl.NumberFormat('pt-PT', { 
                                      style: 'currency', 
                                      currency: 'EUR' 
                                    }).format(program.total_budget)}
                                  </p>
                                )}
                                {program.sector_focus && (
                                  <p>
                                    <strong>Sector Focus:</strong>{' '}
                                    {program.sector_focus.join(', ')}
                                  </p>
                                )}
                                {program.funding_type && (
                                  <p>
                                    <strong>Funding Type:</strong>{' '}
                                    {program.funding_type}
                                  </p>
                                )}
                              </div>
                              <Button variant="outline" className="mt-4 w-full">
                                View Details
                              </Button>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
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
