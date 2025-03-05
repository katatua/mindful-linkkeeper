
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateResponse } from '@/utils/aiUtils';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const DatabaseQuery: React.FC = () => {
  const [results, setResults] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkDatabaseContent = async () => {
    setLoading(true);
    try {
      const response = await generateResponse(
        "Show me what data is in the database. Run a query that counts records in each table (links, document_notes, notes, and tasks) and format the results in a clear table."
      );
      setResults(response);
    } catch (error) {
      console.error("Error querying database:", error);
      setResults("Error querying database. Please try again later.");
      toast({
        variant: "destructive",
        title: "Database Query Failed",
        description: "There was an error fetching data from the database."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Database Information</CardTitle>
        <CardDescription>Check what data is stored in the database</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Querying database...</span>
          </div>
        ) : results ? (
          <div className="whitespace-pre-wrap bg-slate-50 p-4 rounded-md">
            {results}
          </div>
        ) : (
          <p>Click the button below to check what data is in the database.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={checkDatabaseContent} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking Database...
            </>
          ) : (
            "Check Database Content"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseQuery;
