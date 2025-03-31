import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database as DatabaseIcon, FileQuestion, Search, FileText, History, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { DataSourcesTab } from '@/components/database/DataSourcesTab';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchDatabaseTables, fetchTableData, updateDatabaseTables, DatabaseTable } from '@/utils/databaseService';
import { Link } from 'react-router-dom';
import { QueryHistory } from '@/components/database/QueryHistory';

interface GenericTableData {
  id?: string;
  [key: string]: any;
}

export const DatabasePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tableData, setTableData] = useState<GenericTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tablesLoading, setTablesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [databaseTables, setDatabaseTables] = useState<DatabaseTable[]>([]);
  const [activeTable, setActiveTable] = useState<string>('');
  const { toast } = useToast();

  const getActiveTabFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'schema';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromURL());

  useEffect(() => {
    setActiveTab(getActiveTabFromURL());
  }, [location.search]);

  // Handle tab changes and update URL
  const handleTabChange = (value: string) => {
    // If the tab is query or history, navigate to the query-assistant page
    if (value === 'query') {
      navigate('/query-assistant?tab=assistente');
      return;
    } else if (value === 'history') {
      navigate('/query-assistant?tab=historia');
      return;
    }
    
    // Otherwise update the current page URL
    setActiveTab(value);
    navigate(`/database?tab=${value}`, { replace: true });
  };

  useEffect(() => {
    const loadDatabaseTables = async () => {
      setTablesLoading(true);
      try {
        console.log("DatabasePage: Loading database tables");
        const tables = await fetchDatabaseTables();
        console.log("DatabasePage: Tables received:", tables);
        setDatabaseTables(tables);
        
        if (tables.length > 0 && !activeTable) {
          setActiveTable(tables[0].table_name);
        } else if (tables.length === 0) {
          toast({
            title: 'No Tables Found',
            description: 'No tables were found in the database. You may need to create tables first.',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error('Error loading database tables:', err);
        toast({
          title: 'Error',
          description: 'Failed to load database tables. Check console for details.',
          variant: 'destructive',
        });
      } finally {
        setTablesLoading(false);
      }
    };
    
    loadDatabaseTables();
  }, []);

  useEffect(() => {
    if (activeTable) {
      fetchTableContent(activeTable);
    }
  }, [activeTable]);

  const fetchTableContent = async (tableName: string) => {
    setLoading(true);
    try {
      const data = await fetchTableData(tableName);
      setTableData(data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching data from ${tableName}:`, err);
      setError(`Failed to load data from ${tableName}`);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (activeTab === 'schema') {
      setTablesLoading(true);
      const success = await updateDatabaseTables();
      if (success) {
        toast({
          title: 'Tables refreshed',
          description: 'Database tables have been refreshed.',
        });
        // Reload tables after refreshing
        const tables = await fetchDatabaseTables();
        setDatabaseTables(tables);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to refresh database tables.',
          variant: 'destructive',
        });
      }
      setTablesLoading(false);
    } else if (activeTable) {
      await fetchTableContent(activeTable);
    }
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (error) {
      return <p className="py-4 text-center text-red-500">{error}</p>;
    }
    
    if (tableData.length === 0) {
      return <p className="py-4 text-center">No data found in this table</p>;
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
                    {item[col] === null ? 'null' : 
                     typeof item[col] === 'object' ? JSON.stringify(item[col]) : 
                     String(item[col])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderSchemaContent = () => {
    if (tablesLoading) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (databaseTables.length === 0) {
      return (
        <div className="py-8 text-center">
          <FileQuestion className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Database Tables Found</h3>
          <p className="text-muted-foreground">
            There don't appear to be any tables in your database yet. <br />
            You may need to run migrations or create tables.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {databaseTables.map((table) => (
          <div key={table.table_name} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">{table.table_name}</h3>
              <Badge variant="outline">{table.columns.length} columns</Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Nullable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.columns.map((column) => (
                  <TableRow key={`${table.table_name}-${column.column_name}`}>
                    <TableCell className="font-medium">{column.column_name}</TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                        {column.data_type}
                      </code>
                    </TableCell>
                    <TableCell>{column.is_nullable}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Database Explorer</h1>
          <Button variant="outline" onClick={handleRefresh} disabled={tablesLoading} className="mt-2 md:mt-0">
            <RefreshCw className={`mr-2 h-4 w-4 ${tablesLoading ? 'animate-spin' : ''}`} />
            Refresh Schema
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="mb-4">
            <TabsTrigger value="schema">
              <DatabaseIcon className="w-4 h-4 mr-2" />
              Database Schema
            </TabsTrigger>
            <TabsTrigger value="data">
              <FileQuestion className="w-4 h-4 mr-2" />
              Browse Data
            </TabsTrigger>
            <TabsTrigger value="datasources">
              <FileText className="w-4 h-4 mr-2" />
              Fontes de Dados
            </TabsTrigger>
            <TabsTrigger value="query">
              <Search className="w-4 h-4 mr-2" />
              Query Assistant
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              Query History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="schema">
            <Card>
              <CardHeader>
                <CardTitle>Database Schema</CardTitle>
              </CardHeader>
              <CardContent>
                {renderSchemaContent()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Database Tables</CardTitle>
                <div className="flex gap-2">
                  <button 
                    onClick={handleRefresh} 
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Data
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {tablesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : databaseTables.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-64">
                        <Select
                          value={activeTable}
                          onValueChange={setActiveTable}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a table" />
                          </SelectTrigger>
                          <SelectContent>
                            {databaseTables.map((table) => (
                              <SelectItem key={table.table_name} value={table.table_name}>
                                {table.table_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Badge variant="outline">
                        {activeTable && databaseTables.find(t => t.table_name === activeTable)?.columns.length} columns
                      </Badge>
                    </div>
                    
                    {renderTableContent()}
                  </div>
                ) : (
                  <p className="text-center py-4">No database tables found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="datasources">
            <DataSourcesTab />
          </TabsContent>
          
          <TabsContent value="query">
            <Card>
              <CardHeader>
                <CardTitle>SQL Query Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The Query Assistant feature helps you explore data with natural language.
                </p>
                <Button asChild>
                  <Link to="/query-assistant?tab=assistente">
                    <Search className="h-4 w-4 mr-2" />
                    Open Query Assistant
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Query History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  View your recent query history and results.
                </p>
                <Button asChild>
                  <Link to="/query-assistant?tab=historia">
                    <History className="h-4 w-4 mr-2" />
                    View Full Query History
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DatabasePage;
