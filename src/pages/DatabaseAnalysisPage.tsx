import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Database, Table as TableIcon, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SectorFundingDistribution from "@/components/SectorFundingDistribution";
import { testDatabaseConnection } from "@/utils/databaseDiagnostics";

// List of tables to analyze
const DATABASE_TABLES = [
  "ani_database_status",
  "ani_funding_programs",
  "ani_funding_applications", 
  "ani_metrics",
  "ani_projects",
  "ani_policy_frameworks",
  "ani_patent_holders",
  "ani_international_collaborations",
  "ani_institutions",
  "ani_researchers",
  "ani_projects_researchers"
] as const;  // Mark this array as readonly

// Type definition for valid table names
type ValidTableName = typeof DATABASE_TABLES[number];

const SAMPLE_SECTOR_DATA = [
  {
    "num_programs": 1,
    "sector_focus": ["Digital Tech", "Manufacturing", "Agriculture"],
    "total_budget_allocated": 65000000
  },
  {
    "num_programs": 1,
    "sector_focus": ["Digital Transformation", "Industry 4.0", "Cloud Computing"],
    "total_budget_allocated": 7500000
  },
  {
    "num_programs": 1,
    "sector_focus": ["Digital Tech", "Healthcare", "Energy", "Manufacturing"],
    "total_budget_allocated": 95500000
  },
  {
    "num_programs": 1,
    "sector_focus": ["Digital Tech", "Healthcare", "Manufacturing"],
    "total_budget_allocated": 42000000
  },
  {
    "num_programs": 1,
    "sector_focus": ["Energy", "Agriculture", "Tourism"],
    "total_budget_allocated": 35000000
  }
];

const DatabaseAnalysisPage = () => {
  const [selectedTable, setSelectedTable] = useState<ValidTableName>("ani_funding_programs");
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "connected" | "error">("unknown");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch table data
  const fetchTableData = async (tableName: ValidTableName) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(10);
      
      if (error) {
        console.error("Error fetching table data:", error);
        setErrorMessage(error.message);
        setTableData([]);
        setTableColumns([]);
        return;
      }
      
      if (data && data.length > 0) {
        setTableData(data);
        setTableColumns(Object.keys(data[0]));
      } else {
        setTableData([]);
        setTableColumns([]);
        setErrorMessage(`No data found in table "${tableName}".`);
      }
    } catch (error) {
      console.error("Exception fetching table data:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      setTableData([]);
      setTableColumns([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Test database connection
  const checkConnection = async () => {
    try {
      const result = await testDatabaseConnection();
      setConnectionStatus(result.success ? "connected" : "error");
      
      if (!result.success) {
        setErrorMessage("Database connection test failed. See console for details.");
      } else {
        setErrorMessage(null);
      }
    } catch (error) {
      console.error("Error checking database connection:", error);
      setConnectionStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
    }
  };

  // Get table schema
  const getTableSchema = async (tableName: ValidTableName) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('execute-sql', {
        body: { 
          sqlQuery: `
            SELECT 
              column_name, 
              data_type, 
              is_nullable, 
              column_default
            FROM 
              information_schema.columns
            WHERE 
              table_name = '${tableName}'
            ORDER BY 
              ordinal_position
          `,
          operation: 'query'
        }
      });
      
      if (error) {
        console.error("Error fetching table schema:", error);
        setErrorMessage(error.message);
        setTableData([]);
        setTableColumns([]);
        return;
      }
      
      if (data && data.result && data.result.length > 0) {
        setTableData(data.result);
        setTableColumns(Object.keys(data.result[0]));
      } else {
        setTableData([]);
        setTableColumns([]);
        setErrorMessage(`No schema information found for table "${tableName}".`);
      }
    } catch (error) {
      console.error("Exception fetching table schema:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      setTableData([]);
      setTableColumns([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Count records in all tables
  const countAllTableRecords = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      let queryClauses = DATABASE_TABLES.map(tableName => 
        `SELECT '${tableName}' AS table_name, COUNT(*) AS record_count FROM ${tableName}`
      ).join(' UNION ALL ');
      
      const { data, error } = await supabase.functions.invoke('execute-sql', {
        body: { 
          sqlQuery: queryClauses,
          operation: 'query'
        }
      });
      
      if (error) {
        console.error("Error counting table records:", error);
        setErrorMessage(error.message);
        setTableData([]);
        setTableColumns([]);
        return;
      }
      
      if (data && data.result && data.result.length > 0) {
        setTableData(data.result);
        setTableColumns(Object.keys(data.result[0]));
      } else {
        setTableData([]);
        setTableColumns([]);
        setErrorMessage("No table record counts retrieved.");
      }
    } catch (error) {
      console.error("Exception counting table records:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      setTableData([]);
      setTableColumns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Fetch initial table data
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, []);

  const handleTableChange = (table: ValidTableName) => {
    setSelectedTable(table);
    fetchTableData(table);
  };

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Database Analysis</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={checkConnection} disabled={isLoading}>
            {connectionStatus === "unknown" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : connectionStatus === "connected" ? (
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
            ) : (
              <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
            )}
            {connectionStatus === "connected" ? "Connected" : connectionStatus === "error" ? "Connection Error" : "Checking..."}
          </Button>
          <Button variant="outline" onClick={countAllTableRecords} disabled={isLoading}>
            <TableIcon className="h-4 w-4 mr-2" />
            Count All Tables
          </Button>
        </div>
      </div>

      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Table Analysis</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={selectedTable} onValueChange={(value) => handleTableChange(value as ValidTableName)}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Select a table" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATABASE_TABLES.map(table => (
                      <SelectItem key={table} value={table}>{table}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={() => fetchTableData(selectedTable)} disabled={isLoading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            <CardDescription>
              Examine data from the {selectedTable} table
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="data">
              <TabsList className="mb-4">
                <TabsTrigger value="data">Table Data</TabsTrigger>
                <TabsTrigger value="schema">Table Schema</TabsTrigger>
              </TabsList>
              
              <TabsContent value="data">
                {isLoading ? (
                  <div className="flex justify-center items-center h-80">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : tableData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {tableColumns.map(column => (
                            <TableHead key={column}>{column}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {tableColumns.map(column => (
                              <TableCell key={column}>
                                {typeof row[column] === 'object' 
                                  ? JSON.stringify(row[column]) 
                                  : String(row[column] ?? 'null')}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto opacity-20 mb-2" />
                    <p>No data found in this table</p>
                  </div>
                )}
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Showing up to 10 rows. Use the refresh button to update.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="schema">
                <Button size="sm" variant="outline" onClick={() => getTableSchema(selectedTable)} disabled={isLoading} className="mb-4">
                  <Database className="h-4 w-4 mr-2" />
                  Get Schema
                </Button>
                
                {isLoading ? (
                  <div className="flex justify-center items-center h-80">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : tableData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {tableColumns.map(column => (
                            <TableHead key={column}>{column}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {tableColumns.map(column => (
                              <TableCell key={column}>{String(row[column] ?? 'null')}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto opacity-20 mb-2" />
                    <p>Click "Get Schema" to view table structure</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sample Query Analysis</CardTitle>
            <CardDescription>
              Sample data from successful queries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-md font-semibold mb-2">Working Query Sample: Sector Funding</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This shows the data returned from the successful sector funding query
              </p>
              <div className="h-96">
                <SectorFundingDistribution data={SAMPLE_SECTOR_DATA} />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-md font-semibold mb-2">Common Query Issues</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>Empty Tables:</strong> Some tables may not have data populated yet
                </li>
                <li>
                  <strong>Array Data Types:</strong> Fields like <code>sector_focus</code> are arrays and need special query handling
                </li>
                <li>
                  <strong>Connection Issues:</strong> Sometimes the database connection might be unstable or timeout
                </li>
                <li>
                  <strong>Query Complexity:</strong> Complex joins or aggregations might time out
                </li>
              </ul>
            </div>
            
            <Button variant="outline" onClick={() => {
              toast.info("Analysis suggestions", {
                description: "Try running simple COUNT queries first to verify table contents before complex operations"
              });
            }} className="w-full">
              Get Query Suggestions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseAnalysisPage;
