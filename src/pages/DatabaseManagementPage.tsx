
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Database, AlertTriangle, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { DATABASE_TABLES, populateDatabase, checkDatabaseStatus } from "@/utils/databaseUtils";

const DatabaseManagementPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressInfo, setProgressInfo] = useState("");
  const [tableStatus, setTableStatus] = useState<Record<string, number>>({});
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  
  // Check database status on component mount
  useEffect(() => {
    checkStatus();
  }, []);
  
  const checkStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const status = await checkDatabaseStatus();
      setTableStatus(status);
    } catch (error) {
      console.error("Error checking database status:", error);
      toast.error("Failed to check database status", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };
  
  const handlePopulateDatabase = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setProgress(0);
    setProgressInfo("Preparing to generate synthetic data...");
    
    try {
      let currentProgress = 0;
      const increment = 100 / DATABASE_TABLES.length;
      
      await populateDatabase((info) => {
        setProgressInfo(info);
        currentProgress += increment / 2;
        setProgress(Math.min(Math.round(currentProgress), 99));
      });
      
      setProgress(100);
      setProgressInfo("Database population completed!");
      toast.success("Database populated successfully");
      
      // Refresh the status after population
      await checkStatus();
    } catch (error) {
      console.error("Error populating database:", error);
      toast.error("Failed to populate database", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to get status indicator
  const getStatusIndicator = (table: string) => {
    const count = tableStatus[table];
    
    if (count === undefined || count === -1) {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    }
    
    if (count === 0) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
    
    return <Check className="h-5 w-5 text-green-500" />;
  };
  
  // Get overall database status
  const getDatabaseStatus = () => {
    const tables = Object.keys(tableStatus);
    if (tables.length === 0) return "unknown";
    
    const emptyTables = tables.filter(t => tableStatus[t] === 0);
    const errorTables = tables.filter(t => tableStatus[t] === -1);
    
    if (errorTables.length > 0) return "error";
    if (emptyTables.length === tables.length) return "empty";
    if (emptyTables.length > 0) return "partial";
    return "populated";
  };
  
  const dbStatus = getDatabaseStatus();
  
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Database Management</h1>
        <Button 
          onClick={checkStatus} 
          variant="outline" 
          disabled={isCheckingStatus}
        >
          {isCheckingStatus ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Status
        </Button>
      </div>
      
      <Alert className="mb-6">
        <Database className="h-4 w-4" />
        <AlertTitle>Database Status</AlertTitle>
        <AlertDescription>
          {dbStatus === "unknown" && "Database status is being checked..."}
          {dbStatus === "error" && "Error checking some tables. Please check the logs."}
          {dbStatus === "empty" && "Database appears to be empty. Use the button below to populate it with synthetic data."}
          {dbStatus === "partial" && "Some tables are empty. Consider repopulating the database."}
          {dbStatus === "populated" && "Database is populated with data."}
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {DATABASE_TABLES.map(table => (
          <Card key={table}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{table}</CardTitle>
                {getStatusIndicator(table)}
              </div>
              <CardDescription>
                {isCheckingStatus 
                  ? "Checking..." 
                  : tableStatus[table] === -1 
                    ? "Error checking table" 
                    : `${tableStatus[table] || 0} records`}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Synthetic Data Generator</CardTitle>
          <CardDescription>
            Generate realistic synthetic data for the ANI database. This will clear existing data and replace it with randomly generated sample data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500">{progressInfo}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handlePopulateDatabase} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Data...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Populate Database with Synthetic Data
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DatabaseManagementPage;
