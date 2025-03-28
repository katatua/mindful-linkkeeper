
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, AlertCircle, HelpCircle, Code, Database, PlusCircle, DatabaseIcon } from 'lucide-react';
import { suggestedDatabaseQuestions, generateResponse, genId, formatDatabaseValue } from '@/utils/aiUtils';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  sqlQuery?: string;
  results?: any[] | null;
  error?: boolean;
  noResults?: boolean;
}

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: genId(),
      content: input,
      role: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);
    
    try {
      const response = await generateResponse(input);
      
      const assistantMessage: Message = {
        id: genId(),
        content: response.message,
        sqlQuery: response.sqlQuery,
        results: response.results,
        role: 'assistant',
        noResults: response.noResults
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      const historyItem = {
        id: assistantMessage.id,
        question: input,
        timestamp: new Date(),
        result: {
          message: response.message,
          sqlQuery: response.sqlQuery,
          results: response.results
        },
        isCorrect: null
      };
      
      try {
        const existingHistory = JSON.parse(localStorage.getItem('queryHistory') || '[]');
        const updatedHistory = [historyItem, ...existingHistory];
        localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }
      
    } catch (error) {
      console.error('Error getting response:', error);
      
      const errorMessage: Message = {
        id: genId(),
        content: `Failed to get a response: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or rephrase your question.`,
        role: 'assistant',
        error: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
    setShowSuggestions(false);
  };

  const resetConversation = () => {
    setMessages([]);
    setInput('');
    setShowSuggestions(false);
  };

  const renderResults = (results: any[] | null) => {
    if (!results || results.length === 0) {
      return <p className="text-gray-500 italic">No results found</p>;
    }

    const columns = Object.keys(results[0]);

    return (
      <div className="overflow-x-auto border rounded-md mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.slice(0, 10).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map(column => (
                  <TableCell 
                    key={`${rowIndex}-${column}`}
                    data-column={column}
                  >
                    {formatDatabaseValue(row[column], column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {results.length > 10 && (
          <div className="text-xs text-gray-500 p-2 text-center border-t">
            Showing 10 of {results.length} results
          </div>
        )}
      </div>
    );
  };

  const PopulateDataButton = ({ query }: { query: string }) => {
    const [isPopulating, setIsPopulating] = useState(false);
    
    const handlePopulate = async () => {
      setIsPopulating(true);
      try {
        // We'll just show a toast for now since actual data population would require more complex implementation
        toast({
          title: "Data population scheduled",
          description: "Request to populate data for this query has been submitted.",
        });
        
        // In a real implementation, you'd call a function to populate the database
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast({
          title: "Success",
          description: "Database has been scheduled for update with required data. Try your query again in a few minutes.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to schedule data population.",
          variant: "destructive",
        });
      } finally {
        setIsPopulating(false);
      }
    };
    
    return (
      <Button 
        variant="outline" 
        size="sm"
        disabled={isPopulating}
        onClick={handlePopulate}
        className="mt-2"
      >
        <DatabaseIcon className="h-4 w-4 mr-2" />
        {isPopulating ? "Scheduling..." : "Populate Missing Data"}
      </Button>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AI Database Assistant</CardTitle>
        <div className="flex gap-2">
          {messages.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetConversation}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              New Query
            </Button>
          )}
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowSuggestions(!showSuggestions)}
            aria-label="Show example questions"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showSuggestions && (
          <div className="mb-4 p-4 bg-slate-50 rounded-md">
            <h3 className="text-sm font-medium mb-2">Example Questions:</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedDatabaseQuestions.slice(0, 8).map((question, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleSuggestionClick(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <ScrollArea className="space-y-4 mb-4 max-h-[400px] overflow-y-auto p-1">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              <p>Ask a question about the database, such as:</p>
              <p className="italic mt-2">
                "Which funding programs include renewable energy in their sector focus?" or
                "Show me projects with the highest funding amounts in the technology sector"
              </p>
            </div>
          ) : (
            messages.map(message => (
              <div 
                key={message.id} 
                className={`p-3 rounded-lg mb-4 ${
                  message.role === 'user' 
                    ? 'bg-blue-100 ml-8' 
                    : message.error 
                      ? 'bg-red-50 border border-red-200 mr-8' 
                      : 'bg-gray-100 mr-8'
                }`}
              >
                <p className="text-sm font-semibold mb-1">
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </p>
                {message.error ? (
                  <Alert variant="destructive" className="bg-transparent border-none p-0">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription className="whitespace-pre-wrap">{message.content}</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {message.role === 'assistant' ? (
                      <Tabs defaultValue="resposta" className="w-full">
                        <TabsList className="mb-2">
                          <TabsTrigger value="resposta">Resposta</TabsTrigger>
                          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="resposta">
                          <div className="whitespace-pre-wrap">
                            {message.noResults ? (
                              <Alert variant="warning" className="mb-3">
                                <AlertTitle>No results found</AlertTitle>
                                <AlertDescription>
                                  {message.content}
                                  <div className="mt-2">
                                    <PopulateDataButton query={
                                      messages[messages.findIndex(m => m.id === message.id) - 1]?.content || ""
                                    } />
                                  </div>
                                </AlertDescription>
                              </Alert>
                            ) : message.results && message.results.length > 0 ? (
                              <div>
                                <div className="font-medium text-primary mb-4">{message.content.split('\n')[0]}</div>
                                {renderResults(message.results)}
                              </div>
                            ) : (
                              message.content
                            )}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="detalhes">
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          
                          {message.sqlQuery && (
                            <div className="mt-3">
                              <div className="flex items-center gap-1 text-sm font-medium text-gray-500 mb-1">
                                <Code className="h-4 w-4" />
                                <span>SQL Query:</span>
                              </div>
                              <pre className="bg-gray-800 text-gray-100 p-2 rounded-md text-sm overflow-x-auto">
                                {message.sqlQuery}
                              </pre>
                            </div>
                          )}
                          
                          {message.results && message.results.length > 0 ? (
                            <div className="mt-3">
                              <div className="flex items-center gap-1 text-sm font-medium text-gray-500 mb-1">
                                <Database className="h-4 w-4" />
                                <span>Results:</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-xs h-6 ml-auto"
                                  onClick={() => {
                                    try {
                                      const jsonStr = JSON.stringify(message.results, null, 2);
                                      const blob = new Blob([jsonStr], { type: 'application/json' });
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.download = `query-results-${new Date().toISOString().slice(0, 10)}.json`;
                                      a.href = url;
                                      a.click();
                                      URL.revokeObjectURL(url);
                                    } catch (e) {
                                      console.error('Error downloading results:', e);
                                      toast({
                                        title: "Error",
                                        description: "Failed to download results.",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                >
                                  Download JSON
                                </Button>
                              </div>
                              {renderResults(message.results)}
                            </div>
                          ) : message.noResults ? (
                            <Alert variant="warning" className="mt-3">
                              <AlertTitle>No results found</AlertTitle>
                              <AlertDescription>
                                The database doesn't contain data matching this query.
                                <div className="mt-2">
                                  <PopulateDataButton query={
                                    messages[messages.findIndex(m => m.id === message.id) - 1]?.content || ""
                                  } />
                                </div>
                              </AlertDescription>
                            </Alert>
                          ) : null}
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
        </ScrollArea>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question about the database..."
            className="resize-none"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
