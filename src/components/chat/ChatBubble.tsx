
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X } from 'lucide-react';
import { AIChat } from './AIChat';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  initiallyExpanded?: boolean;
  title?: string;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  initiallyExpanded = false,
  title = "Assistente ANI",
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  return (
    <>
      {isExpanded ? (
        <Card className={cn(
          "fixed bottom-4 right-4 w-[450px] max-w-[calc(100vw-2rem)] max-h-[80vh] z-50 shadow-lg flex flex-col",
          className
        )}>
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 border-b">
            <CardTitle className="text-base">{title}</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-auto">
            <AIChat />
          </CardContent>
        </Card>
      ) : (
        <Button 
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
          size="icon"
          variant="default"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </>
  );
};
