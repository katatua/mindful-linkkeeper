
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Database } from "lucide-react";

interface DatabaseStatus {
  id: string;
  table_name: string;
  record_count: number;
  status: string;
  last_populated: string | null;
  created_at: string;
  updated_at: string;
}

export const DatabaseStatusRetriever = () => {
  const [records, setRecords] = useState<DatabaseStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const fetchDatabaseStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('show-database-status');
      
      if (error) {
        throw new Error(`Error invoking function: ${error.message}`);
      }
      
      if (Array.isArray(data)) {
        setRecords(data);
        setIsVisible(true);
        console.log("Database Status Records:", data);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Failed to fetch database status:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4">
      <Button 
        onClick={fetchDatabaseStatus} 
        disabled={loading}
        className="mb-4"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Fetching Database Status...
          </>
        ) : (
          <>
            <Database className="mr-2 h-4 w-4" />
            Show Database Status Records
          </>
        )}
      </Button>

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      {isVisible && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Database Status Records ({records.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table Name</TableHead>
                    <TableHead>Record Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Populated</TableHead>
                    <TableHead>Updated At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.table_name}</TableCell>
                      <TableCell>{record.record_count}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          record.status === 'populated' ? 'bg-green-100 text-green-800' :
                          record.status === 'empty' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell>{record.last_populated ? new Date(record.last_populated).toLocaleString() : 'Never'}</TableCell>
                      <TableCell>{new Date(record.updated_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
