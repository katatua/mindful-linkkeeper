
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Database, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TableRecordsPage = () => {
  const { tableName } = useParams<{ tableName: string }>();
  const navigate = useNavigate();
  const [records, setRecords] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tableName) {
      fetchTableRecords(tableName);
    }
  }, [tableName]);

  const fetchTableRecords = async (table: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(100);

      if (error) {
        console.error("Error fetching table records:", error);
        setError(error.message);
        toast.error(`Failed to fetch records from ${table}`);
      } else if (data) {
        setRecords(data);
        if (data.length > 0) {
          setColumns(Object.keys(data[0]));
        } else {
          setColumns([]);
        }
      }
    } catch (err) {
      console.error("Exception fetching table records:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast.error("Failed to fetch table records");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/database-management");
  };

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) {
      return "null";
    }
    
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return JSON.stringify(value);
      }
      return JSON.stringify(value);
    }
    
    return String(value);
  };

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{tableName} Records</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Table Data</CardTitle>
          <CardDescription>
            Showing up to 100 records from the {tableName} table
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto opacity-20 mb-2" />
              <p>No records found in this table</p>
            </div>
          ) : (
            <ScrollArea className="h-[600px] rounded-md border">
              <div className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column} className="sticky top-0 bg-card z-10">
                          {column}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record, index) => (
                      <TableRow key={index}>
                        {columns.map((column) => (
                          <TableCell key={`${index}-${column}`} className="max-w-[300px] truncate">
                            {formatCellValue(record[column])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TableRecordsPage;
