
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, AlertCircle, HelpCircle } from 'lucide-react';
import { suggestedDatabaseQuestions, generateResponse, genId } from '@/utils/aiUtils';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  error?: boolean;
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
        content: response,
        role: 'assistant'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Add error message to the chat
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
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AI Database Assistant</CardTitle>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setShowSuggestions(!showSuggestions)}
          aria-label="Show example questions"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
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

        <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto p-1">
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
                className={`p-3 rounded-lg ${
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
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
        
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
