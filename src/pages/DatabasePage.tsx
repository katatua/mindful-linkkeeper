
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateResponse } from "@/utils/aiUtils";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

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
  const { toast } = useToast();

  useEffect(() => {
    const fetchSampleData = async () => {
      setIsLoadingSampleData(true);
      
      try {
        const updatedTables = [...tables];
        
        for (let i = 0; i < updatedTables.length; i++) {
          const table = updatedTables[i];
          
          if (isValidTableName(table.name)) {
            const { data, error } = await supabase
              .from(table.name)
              .select('*')
              .limit(5);
              
            if (error) {
              console.error(`Error fetching data from ${table.name}:`, error);
            } else {
              updatedTables[i] = { ...table, sampleData: data };
            }
          } else {
            console.warn(`Table name not found in schema: ${table.name}`);
          }
        }
        
        setTables(updatedTables);
      } catch (error) {
        console.error("Error fetching sample data:", error);
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

  const isValidTableName = (name: string): name is TableName => {
    return name in (supabase.from as any)._tables;
  };

  const repairSqlQuery = (query: string, errorMessage: string): string => {
    // Basic SQL repair for common issues
    let repairedQuery = query.trim();
    
    // If query ends with FROM, add the most likely table based on the columns
    if (repairedQuery.toLowerCase().endsWith('from')) {
      // Common column mappings to likely tables
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
      
      // Extract columns from the query
      const columnsMatch = repairedQuery.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
      if (columnsMatch && columnsMatch[1]) {
        const columns = columnsMatch[1].split(',').map(col => col.trim().split(' ')[0]);
        
        // Find the most likely table based on columns
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
          // Default to funding programs if we can't determine
          repairedQuery += ' ani_funding_programs';
        }
      } else {
        // Default to funding programs if we can't parse columns
        repairedQuery += ' ani_funding_programs';
      }
    }
    
    // If query doesn't have a WHERE clause but should filter for open programs
    if (question.toLowerCase().includes('abertos') || 
        question.toLowerCase().includes('disponíveis') ||
        question.toLowerCase().includes('ainda estão')) {
      
      if (repairedQuery.toLowerCase().includes('ani_funding_programs') && 
          !repairedQuery.toLowerCase().includes('where')) {
        repairedQuery += ' WHERE application_deadline >= CURRENT_DATE';
      }
    }
    
    // Add ORDER BY for sorting results if query likely needs it
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
          setSqlQuery(queryToRun);
          
          // If there's a results section, we already have the results from the edge function
          const resultsMatch = response.match(/<RESULTS>([\s\S]*?)<\/RESULTS>/);
          
          if (resultsMatch && resultsMatch[1]) {
            try {
              setResults(JSON.parse(resultsMatch[1].trim()));
            } catch (error) {
              console.error("Error parsing results JSON:", error);
              setQueryError("Error parsing results JSON");
            }
          } else {
            // No results section, attempt to execute the query locally
            try {
              const { data: queryResults, error: queryError } = await supabase.rpc('execute_sql_query', {
                sql_query: queryToRun
              });
              
              if (queryError) {
                console.error("SQL execution error:", queryError);
                
                // Try to repair the query
                const repairedQuery = repairSqlQuery(queryToRun, queryError.message);
                if (repairedQuery !== queryToRun) {
                  setSqlQuery(repairedQuery);
                  toast({
                    title: "Query automatically corrected",
                    description: "The SQL query was automatically corrected and executed.",
                  });
                  
                  // Execute the repaired query
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
          // No SQL found, try to extract intent from question and generate SQL
          if (question.toLowerCase().includes('abertos') || 
              question.toLowerCase().includes('disponíveis') ||
              question.toLowerCase().includes('ainda estão') ||
              question.toLowerCase().includes('open') ||
              question.toLowerCase().includes('available')) {
            
            // This is likely about open funding programs
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
        
        // Set explanation
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

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Database Explorer</h1>
        
        <Tabs defaultValue="query" className="w-full">
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
                          <p className="text-muted-foreground italic">No sample data available</p>
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
