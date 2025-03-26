
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Clock, RefreshCw, Loader2, Lock, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkAdminStatus } from "@/utils/databaseDiagnostics";

interface DatabaseStatus {
  id: string;
  table_name: string;
  record_count: number;
  status: string;
  last_populated: string | null;
  created_at: string;
  updated_at: string;
}

const DatabaseStatusViewer = () => {
  const [statusRecords, setStatusRecords] = useState<DatabaseStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const checkPermissions = async () => {
    const adminStatus = await checkAdminStatus();
    setIsAdmin(adminStatus);
    return adminStatus;
  };

  const fetchDatabaseStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if user has admin permissions
      const hasPermission = await checkPermissions();
      
      if (!hasPermission) {
        setError("You don't have permission to view database status. Admin role required.");
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase.functions.invoke('show-database-status');

      if (fetchError) {
        console.error("Error fetching database status:", fetchError);
        setError(fetchError.message);
        toast.error("Failed to fetch database status");
        return;
      }

      if (data?.success && Array.isArray(data.data)) {
        setStatusRecords(data.data);
      } else {
        console.log("Unexpected response format:", data);
        setStatusRecords([]);
        if (data?.message) {
          setError(data.message);
        }
      }
    } catch (err) {
      console.error("Error in fetchDatabaseStatus:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast.error("Failed to fetch database status");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkPermissions().then(hasPermission => {
      if (hasPermission) {
        fetchDatabaseStatus();
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'populated':
        return <Badge className="bg-green-500">Populated</Badge>;
      case 'empty':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Empty</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Database Status Records</CardTitle>
          <CardDescription>
            Administrator access required
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Access Restricted</AlertTitle>
            <AlertDescription>
              You need administrator privileges to view database status information.
              Please contact an administrator if you need access.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Database Status Records</CardTitle>
          <CardDescription>
            Showing status information from the ani_database_status table
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDatabaseStatus}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="py-6 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : statusRecords.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            No database status records found.
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Record Count</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      Last Populated
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.table_name}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.record_count}</TableCell>
                    <TableCell>{formatDate(record.last_populated)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseStatusViewer;
