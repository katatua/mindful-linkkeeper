import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateResponse } from "@/utils/aiUtils";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the Table interface
interface DatabaseTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    default?: string;
  }[];
  sampleData?: any[];
}

// Type for valid table names in our database
type TableName = keyof Database['public']['Tables'];

// Database schema information
const databaseSchema: DatabaseTable[] = [
  {
    name: "ani_metrics",
    description: "Stores various metrics data",
    columns: [
      { name: "id", type: "uuid", nullable: false, default: "gen_random_uuid()" },
      { name: "name", type: "text", nullable: false },
      { name: "category", type: "text", nullable: false },
      { name: "value", type: "numeric", nullable: true },
      { name: "unit", type: "text", nullable: true },
      { name: "measurement_date", type: "date", nullable: true },
      { name: "region", type: "text", nullable: true },
      { name: "sector", type: "text", nullable: true },
      { name: "source", type: "text", nullable: true },
      { name: "description", type: "text", nullable: true },
      { name: "created_at", type: "timestamp with time zone", nullable: false, default: "now()" },
      { name: "updated_at", type: "timestamp with time zone", nullable: false, default: "now()" }
    ]
  },
  {
    name: "ani_funding_programs",
    description: "Stores funding program information",
    columns: [
      { name: "id", type: "uuid", nullable: false, default: "gen_random_uuid()" },
      { name: "name", type: "text", nullable: false },
      { name: "description", type: "text", nullable: true },
      { name: "total_budget", type: "numeric", nullable: true },
      { name: "start_date", type: "date", nullable: true },
      { name: "end_date", type: "date", nullable: true },
      { name: "application_deadline", type: "date", nullable: true },
      { name: "next_call_date", type: "date", nullable: true },
      { name: "funding_type", type: "text", nullable: true },
      { name: "sector_focus", type: "text[]", nullable: true },
      { name: "eligibility_criteria", type: "text", nullable: true },
      { name: "application_process", type: "text", nullable: true },
      { name: "review_time_days", type: "integer", nullable: true },
      { name: "success_rate", type: "numeric", nullable: true },
      { name: "created_at", type: "timestamp with time zone", nullable: false, default: "now()" },
      { name: "updated_at", type: "timestamp with time zone", nullable: false, default: "now()" }
    ]
  },
  {
    name: "ani_projects",
    description: "Contains project information",
    columns: [
      { name: "id", type: "uuid", nullable: false, default: "gen_random_uuid()" },
      { name: "title", type: "text", nullable: false },
      { name: "description", type: "text", nullable: true },
      { name: "start_date", type: "date", nullable: true },
      { name: "end_date", type: "date", nullable: true },
      { name: "funding_amount", type: "numeric", nullable: true },
      { name: "status", type: "text", nullable: false, default: "'submitted'" },
      { name: "sector", type: "text", nullable: true },
      { name: "region", type: "text", nullable: true },
      { name: "organization", type: "text", nullable: true },
      { name: "contact_email", type: "text", nullable: true },
      { name: "contact_phone", type: "text", nullable: true },
      { name: "institution_id", type: "uuid", nullable: true },
      { name: "created_at", type: "timestamp with time zone", nullable: false, default: "now()" },
      { name: "updated_at", type: "timestamp with time zone", nullable: false, default: "now()" }
    ]
  },
  {
    name: "ani_policy_frameworks",
    description: "Stores policy framework data",
    columns: [
      { name: "id", type: "uuid", nullable: false, default: "gen_random_uuid()" },
      { name: "title", type: "text", nullable: false },
      { name: "description", type: "text", nullable: true },
      { name: "scope", type: "text", nullable: true },
      { name: "implementation_date", type: "date", nullable: true },
      { name: "status", type: "text", nullable: false, default: "'active'" },
      { name: "key_objectives", type: "text[]", nullable: true },
      { name: "related_legislation", type: "text", nullable: true },
      { name: "created_at", type: "timestamp with time zone", nullable: false, default: "now()" },
      { name: "updated_at", type: "timestamp with time zone", nullable: false, default: "now()" }
    ]
  },
  {
    name: "ani_international_collaborations",
    description: "Tracks international partnerships",
    columns: [
      { name: "id", type: "uuid", nullable: false, default: "gen_random_uuid()" },
      { name: "program_name", type: "text", nullable: false },
      { name: "country", type: "text", nullable: false },
      { name: "partnership_type", type: "text", nullable: true },
      { name: "start_date", type: "date", nullable: true },
      { name: "end_date", type: "date", nullable: true },
      { name: "total_budget", type: "numeric", nullable: true },
      { name: "portuguese_contribution", type: "numeric", nullable: true },
      { name: "focus_areas", type: "text[]", nullable: true },
      { name: "created_at", type: "timestamp with time zone", nullable: true, default: "now()" },
      { name: "updated_at", type: "timestamp with time zone", nullable: true, default: "now()" }
    ]
  }
];

const DatabasePage: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingSampleData, setIsLoadingSampleData] = useState<boolean>(true);
  const [results, setResults] = useState<any>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [sqlQuery, setSqlQuery] = useState<string>("");
  const [tables, setTables] = useState<DatabaseTable[]>(databaseSchema);
  const [queryError, setQueryError] = useState<string>("");
  const [loadError, setLoadError] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchSampleData = async () => {
      setIsLoadingSampleData(true);
      setLoadError("");
      
      try {
        const updatedTables = [...tables];
        
        for (let i = 0; i < updatedTables.length; i++) {
          const table = updatedTables[i];
          
          try {
            const { data, error } = await supabase
              .from(table.name)
              .select('*')
              .limit(5);
              
            if (error) {
              console.error(`Error fetching data from ${table.name}:`, error);
              continue;
            } else {
              updatedTables[i] = { ...table, sampleData: data };
              console.log(`Fetched sample data for ${table.name}:`, data?.length || 0, "rows");
            }
          } catch (err) {
            console.error(`Exception querying ${table.name}:`, err);
          }
        }
        
        setTables(updatedTables);
      } catch (error) {
        console.error("Error fetching sample data:", error);
        setLoadError("Failed to load sample data from the database. Please check your database connection.");
        toast({
          title: "Error fetching sample data",
          description: "There was a problem retrieving sample data from the database.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingSampleData(false);
      }
    };
    
    fetchSampleData();
  }, []);

  const isValidTableName = (name: string): boolean => {
    return tables.some(table => table.name === name);
  };

  const repairSqlQuery = (query: string): string => {
    let repairedQuery = query.trim();
    
    repairedQuery = repairedQuery.replace(/;(?!\s*$)/g, ' ');
    
    repairedQuery = repairedQuery.replace(/strftime\s*\(\s*['"]%Y['"]\s*,\s*([^)]+)\s*\)/gi, 
      'EXTRACT(YEAR FROM $1)');
    
    repairedQuery = repairedQuery.replace(/DATE\s*\(\s*['"]now['"]\s*\)/gi, 'CURRENT_DATE');
    
    repairedQuery = repairedQuery.replace(/NOW\s*\(\s*\)/gi, 'CURRENT_TIMESTAMP');
    repairedQuery = repairedQuery.replace(/CURDATE\s*\(\s*\)/gi, 'CURRENT_DATE');
    
    if (repairedQuery.toLowerCase().endsWith('from')) {
      const columnTableMap: Record<string, string> = {
        'name': 'ani_funding_programs',
        'title': 'ani_projects',
        'application_deadline': 'ani_funding_programs',
        'sector': 'ani_projects',
        'region': 'ani_projects',
        'start_date': 'ani_projects',
        'end_date': 'ani_projects',
        'description': 'ani_funding_programs',
        'total_budget': 'ani_funding_programs',
        'value': 'ani_metrics',
        'category': 'ani_metrics',
        'program_name': 'ani_international_collaborations',
        'country': 'ani_international_collaborations'
      };
      
      const columnsMatch = repairedQuery.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
      if (columnsMatch && columnsMatch[1]) {
        const columns = columnsMatch[1].split(',').map(col => col.trim().split(' ')[0]);
        
        const tableCounts: Record<string, number> = {};
        for (const col of columns) {
          if (columnTableMap[col]) {
            tableCounts[columnTableMap[col]] = (tableCounts[columnTableMap[col]] || 0) + 1;
          }
        }
        
        let mostLikelyTable = '';
        let highestCount = 0;
        for (const [table, count] of Object.entries(tableCounts)) {
          if (count > highestCount) {
            mostLikelyTable = table;
            highestCount = count;
          }
        }
        
        if (mostLikelyTable) {
          repairedQuery += ` ${mostLikelyTable}`;
        } else {
          repairedQuery += ' ani_funding_programs';
        }
      } else {
        repairedQuery += ' ani_funding_programs';
      }
    }
    
    const whereOrderByMatch = repairedQuery.match(/WHERE\s+(.*?)\s*ORDER\s+BY\s+(.*?)(?:$|LIMIT|GROUP)/i);
    if (whereOrderByMatch) {
      const wherePart = whereOrderByMatch[1];
      const orderByPart = whereOrderByMatch[2];
      
      const beforeWhere = repairedQuery.substring(0, repairedQuery.toLowerCase().indexOf('where'));
      const afterOrderBy = repairedQuery.substring(
        repairedQuery.toLowerCase().indexOf('order by') + 'order by'.length + orderByPart.length
      );
      
      repairedQuery = `${beforeWhere} WHERE ${wherePart} ORDER BY ${orderByPart}${afterOrderBy}`;
    }
    
    if (question.toLowerCase().includes('abertos') || 
        question.toLowerCase().includes('disponíveis') ||
        question.toLowerCase().includes('ainda estão')) {
      
      if (repairedQuery.toLowerCase().includes('ani_funding_programs') && 
          !repairedQuery.toLowerCase().includes('where')) {
        repairedQuery += ' WHERE application_deadline >= CURRENT_DATE';
      }
    }
    
    if (repairedQuery.toLowerCase().includes('ani_funding_programs') && 
        !repairedQuery.toLowerCase().includes('order by')) {
      repairedQuery += ' ORDER BY application_deadline';
    }
    
    return repairedQuery;
  };

  const handleQuestionSubmit = async () => {
    if (!question.trim()) {
      toast({
        title: "Question is empty",
        description: "Please enter a question to generate a SQL query.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResults(null);
    setExplanation("");
    setSqlQuery("");
    setQueryError("");

    try {
      const response = await generateResponse(question);
      
      if (response) {
        const sqlMatch = response.match(/<SQL>([\s\S]*?)<\/SQL>/);
        
        if (sqlMatch && sqlMatch[1]) {
          let queryToRun = sqlMatch[1].trim();
          
          if (queryToRun.includes(';') && queryToRun.indexOf(';') < queryToRun.length - 1) {
            queryToRun = repairSqlQuery(queryToRun);
            toast({
              title: "Query automatically fixed",
              description: "We removed semicolons inside your query and fixed some syntax.",
            });
          }
          
          if (queryToRun.toLowerCase().includes("date('now')")) {
            queryToRun = queryToRun.replace(/DATE\s*\(\s*['"]now['"]\s*\)/gi, 'CURRENT_DATE');
            toast({
              title: "Query automatically fixed",
              description: "We replaced DATE('now') with CURRENT_DATE for PostgreSQL compatibility.",
            });
          }
          
          setSqlQuery(queryToRun);
          
          const resultsMatch = response.match(/<RESULTS>([\s\S]*?)<\/RESULTS>/);
          
          if (resultsMatch && resultsMatch[1]) {
            try {
              setResults(JSON.parse(resultsMatch[1].trim()));
            } catch (error) {
              console.error("Error parsing results JSON:", error);
              setQueryError("Error parsing results JSON");
            }
          } else {
            try {
              const { data: queryResults, error: queryError } = await supabase.rpc('execute_sql_query', {
                sql_query: queryToRun
              });
              
              if (queryError) {
                console.error("SQL execution error:", queryError);
                
                const repairedQuery = repairSqlQuery(queryToRun);
                if (repairedQuery !== queryToRun) {
                  setSqlQuery(repairedQuery);
                  toast({
                    title: "Query automatically corrected",
                    description: "The SQL query was automatically corrected and executed.",
                  });
                  
                  const { data: repairedResults, error: repairedError } = await supabase.rpc('execute_sql_query', {
                    sql_query: repairedQuery
                  });
                  
                  if (repairedError) {
                    setQueryError(repairedError.message);
                  } else {
                    setResults(repairedResults || []);
                  }
                } else {
                  setQueryError(queryError.message);
                }
              } else {
                setResults(queryResults || []);
              }
            } catch (error) {
              console.error("Error executing query:", error);
              setQueryError(error.message);
            }
          }
        } else {
          if (question.toLowerCase().includes('abertos') || 
              question.toLowerCase().includes('disponíveis') ||
              question.toLowerCase().includes('ainda estão') ||
              question.toLowerCase().includes('open') ||
              question.toLowerCase().includes('available')) {
            
            const generatedQuery = `SELECT id, name, description, application_deadline, total_budget FROM ani_funding_programs WHERE application_deadline >= CURRENT_DATE ORDER BY application_deadline`;
            setSqlQuery(generatedQuery);
            
            try {
              const { data: queryResults, error: queryError } = await supabase.rpc('execute_sql_query', {
                sql_query: generatedQuery
              });
              
              if (queryError) {
                setQueryError(queryError.message);
              } else {
                setResults(queryResults || []);
                toast({
                  title: "Query generated automatically",
                  description: "We automatically generated and executed a SQL query based on your question.",
                });
              }
            } catch (error) {
              console.error("Error executing generated query:", error);
              setQueryError(error.message);
            }
          }
        }
        
        const cleanExplanation = response.replace(/<SQL>[\s\S]*?<\/SQL>/g, '')
          .replace(/<RESULTS>[\s\S]*?<\/RESULTS>/g, '')
          .trim();
          
        setExplanation(cleanExplanation);
      } else {
        throw new Error("Received empty response from AI");
      }
    } catch (error) {
      console.error("Error in question handling:", error);
      toast({
        title: "Error processing query",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runTestQuery = async () => {
    setIsLoading(true);
    setResults(null);
    setQueryError("");
    
    try {
      const testQuery = "SELECT * FROM ani_projects LIMIT 5";
      setSqlQuery(testQuery);
      
      console.log("Running test query:", testQuery);
      
      const { data: queryResults, error: queryError } = await supabase.rpc('execute_sql_query', {
        sql_query: testQuery
      });
      
      if (queryError) {
        console.error("Test query error:", queryError);
        setQueryError(queryError.message);
        toast({
          title: "Database connection test failed",
          description: queryError.message,
          variant: "destructive"
        });
      } else {
        setResults(queryResults || []);
        toast({
          title: "Database connection successful",
          description: `Retrieved ${queryResults?.length || 0} records from the database.`,
        });
      }
    } catch (error) {
      console.error("Error running test query:", error);
      setQueryError(error.message);
      toast({
        title: "Test query failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Database Explorer</h1>
        
        {loadError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{loadError}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="schema" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="schema">Database Schema</TabsTrigger>
            <TabsTrigger value="query">Query Database</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schema" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Schema</CardTitle>
                <CardDescription>
                  This page shows the schema of the ANI database tables including their columns and data types.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Button onClick={runTestQuery} disabled={isLoading} variant="outline" size="sm">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      "Test Database Connection"
                    )}
                  </Button>
                </div>
                
                <div className="space-y-8">
                  {tables.map((table) => (
                    <div key={table.name} className="border rounded-lg p-4">
                      <h3 className="text-xl font-semibold mb-2">{table.name}</h3>
                      <p className="text-muted-foreground mb-4">{table.description}</p>
                      
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">Schema</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Column Name</TableHead>
                              <TableHead>Data Type</TableHead>
                              <TableHead>Nullable</TableHead>
                              <TableHead>Default Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {table.columns.map((column) => (
                              <TableRow key={`${table.name}-${column.name}`}>
                                <TableCell className="font-medium">{column.name}</TableCell>
                                <TableCell>{column.type}</TableCell>
                                <TableCell>{column.nullable ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{column.default || '-'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Sample Data</h4>
                        {isLoadingSampleData ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-2">Loading sample data...</span>
                          </div>
                        ) : table.sampleData && table.sampleData.length > 0 ? (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {Object.keys(table.sampleData[0]).map((columnName) => (
                                    <TableHead key={columnName}>{columnName}</TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {table.sampleData.map((row, i) => (
                                  <TableRow key={i}>
                                    {Object.values(row).map((value: any, j) => (
                                      <TableCell key={j}>
                                        {value === null ? '-' : 
                                          typeof value === 'object' ? JSON.stringify(value) : 
                                          String(value).length > 50 ? `${String(value).substring(0, 50)}...` : 
                                          String(value)}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-muted-foreground italic p-4 bg-muted/20 rounded-md">
                            <p className="flex items-center gap-2 mb-2">
                              <AlertCircle className="h-4 w-4" />
                              No sample data available
                            </p>
                            <p className="text-sm">
                              You can generate sample data using the Synthetic Data Generator page. This will help with testing 
                              and development, allowing you to explore data and run queries.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="query">
            <Card>
              <CardHeader>
                <CardTitle>Natural Language Query</CardTitle>
                <CardDescription>
                  Ask questions about the database in plain language and get SQL queries and results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <Textarea
                      placeholder="e.g., What are the top funding programs by total budget? or Show me the R&D investment trends over time"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      rows={3}
                      className="w-full"
                    />
                    <Button 
                      onClick={handleQuestionSubmit}
                      disabled={isLoading || !question.trim()}
                      className="w-full md:w-auto"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Generate SQL & Run Query"
                      )}
                    </Button>
                  </div>
                  
                  {sqlQuery && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Generated SQL Query</h3>
                      <div className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                        <pre className="text-sm">{sqlQuery}</pre>
                      </div>
                    </div>
                  )}
                  
                  {queryError && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2 text-red-500">SQL Error</h3>
                      <div className="bg-red-50 p-3 rounded-md border border-red-200">
                        <p className="text-red-600">{queryError}</p>
                      </div>
                    </div>
                  )}
                  
                  {results && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Results</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {results.length > 0 && Object.keys(results[0]).map((column) => (
                                  <TableHead key={column}>{column}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {results.length > 0 ? (
                                results.map((row, i) => (
                                  <TableRow key={i}>
                                    {Object.values(row).map((value: any, j) => (
                                      <TableCell key={j}>
                                        {typeof value === 'object' 
                                          ? JSON.stringify(value) 
                                          : String(value !== null ? value : '-')}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={Object.keys(results[0] || {}).length} className="text-center py-4">
                                    No results found
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {explanation && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Explanation</h3>
                      <div className="bg-blue-50 p-4 rounded-md">
                        <p className="whitespace-pre-line">{explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DatabasePage;
