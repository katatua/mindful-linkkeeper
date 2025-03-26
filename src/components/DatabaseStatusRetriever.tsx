
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Database, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

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
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);

  const fetchDatabaseStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      setLastAttempt(new Date());
      
      console.log("Invoking show-database-status edge function...");
      
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('show-database-status');
      
      if (error) {
        console.error('Function invocation error:', error);
        throw new Error(`Error invoking function: ${error.message}`);
      }
      
      console.log("Edge function response:", data);
      
      if (data?.success && Array.isArray(data.data)) {
        setRecords(data.data);
        setIsVisible(true);
        if (data.data.length === 0) {
          toast.info("No database status records found");
        } else {
          toast.success(`Retrieved ${data.data.length} database status records`);
        }
      } else if (data?.message) {
        // Handle informational messages
        setRecords([]);
        setIsVisible(true);
        toast.info(data.message);
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Unexpected response format from edge function');
      }
    } catch (err) {
      console.error('Failed to fetch database status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Provide a more helpful toast message based on the error
      if (errorMessage.includes('Failed to send a request')) {
        toast.error("Could not connect to the edge function. Please check that it's deployed properly.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    // Clear previous error and try again
    setError(null);
    fetchDatabaseStatus();
  };

  return (
    <div className="my-4">
      <div className="flex items-center gap-2 mb-4">
        <Button 
          onClick={fetchDatabaseStatus} 
          disabled={loading}
          className="flex-1"
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
        
        {lastAttempt && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleRetry}
            disabled={loading}
            title="Try again"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {error && (
        <Card className="mb-4 border-red-200">
          <CardContent className="pt-4">
            <div className="flex items-center text-red-500 mb-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              <p className="font-medium">Error</p>
            </div>
            <p className="text-sm text-gray-700">{error}</p>
            <div className="mt-4 text-xs space-y-2 text-gray-500">
              <p>Possible solutions:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Check that the edge function is deployed correctly</li>
                <li>Verify that Supabase environment variables are set</li>
                <li>Make sure your database connection is working</li>
                <li>Check the edge function logs in the Supabase dashboard</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {isVisible && !error && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Database Status Records ({records.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No database status records found</p>
            ) : (
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
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseStatusRetriever;
