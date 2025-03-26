
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { testAnthropicConnection } from '@/utils/anthropicTest';
import { Check, Loader2, RefreshCw, ServerCrash, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AnthropicConnectionTest: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any>(null);
  
  const handleTestConnection = async () => {
    if (!apiKey) {
      setTestResult({
        success: false,
        error: "API key is required"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await testAnthropicConnection(apiKey);
      setTestResult(result);
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message || String(error)
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-code"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 10-2 2 2 2"/><path d="m14 14 2-2-2-2"/></svg>
          Anthropic API Connection Test
        </CardTitle>
        <CardDescription>
          Test your connection to the Anthropic Claude API
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">Anthropic API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your Anthropic API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Your API key is not stored and is only used for this test.
          </p>
        </div>
        
        {testResult && (
          <div className="mt-4">
            {testResult.success ? (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">Connection Successful</AlertTitle>
                <AlertDescription className="text-sm text-green-600">
                  Successfully connected to the Anthropic API.
                  {testResult.response && (
                    <div className="mt-2 p-2 bg-white border rounded text-xs font-mono overflow-auto">
                      <pre>{JSON.stringify(testResult.response, null, 2)}</pre>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <ServerCrash className="h-4 w-4" />
                <AlertTitle>Connection Failed</AlertTitle>
                <AlertDescription className="text-sm">
                  {testResult.error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleTestConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : testResult ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Test Connection Again
            </>
          ) : (
            "Test Connection"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnthropicConnectionTest;
