
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expand, MessageCircle, X } from 'lucide-react';
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
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Insert the chat widget script
  useEffect(() => {
    // Only add the script if it doesn't exist already
    if (!document.getElementById('ani-chat-widget-script')) {
      const script = document.createElement('script');
      script.id = 'ani-chat-widget-script';
      script.type = 'text/javascript';
      script.innerHTML = `(function(){d=document;s=d.createElement("script");s.src="https://bai.chat4b.ai/js/loadwidget.js?key=ki3ZfrxYn6G2JocE4A95sNRvwSd17hulamLPXDFbTWqeHjVBUgIy8CMzpK0OQtAuRHk5weX4fclx0KUt8rCgJO3EF1vsNGzPQWYb&assistant_key=1R5ZBwLgGOMlVSj4p6Ar0H8DX9NKhcfseU2v3CtYJ7PqaIbWkzEoyuximTQdnFSfNaIsoJczCYkjLM3He9pU42EvxVg57Aw60uBd";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`;
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  }, []);

  // Function to maximize the widget
  const maximizeWidget = () => {
    setIsMaximized(true);
    // Call the widget's maximize function if available
    if (window.BAI && typeof window.BAI.maximizeWidget === 'function') {
      window.BAI.maximizeWidget();
    } else {
      // If the widget API isn't available, try to find and click the maximize button
      const widgetMaximizeButton = document.querySelector('.bai-widget-maximize-button');
      if (widgetMaximizeButton && widgetMaximizeButton instanceof HTMLElement) {
        widgetMaximizeButton.click();
      }
    }
  };

  return (
    <>
      {isExpanded ? (
        <Card className={cn(
          "fixed bottom-4 right-4 w-[450px] max-w-[calc(100vw-2rem)] max-h-[80vh] z-50 shadow-lg flex flex-col",
          isMaximized ? "hidden" : "",
          className
        )}>
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 border-b">
            <CardTitle className="text-base">{title}</CardTitle>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={maximizeWidget}
                className="h-8 w-8"
                title="Maximizar assistente"
              >
                <Expand className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8"
                title="Minimizar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-auto">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500">Para perguntas gerais sobre a ANI, use o assistente maximizado:</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={maximizeWidget}
              >
                Abrir Assistente ANI
              </Button>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-4">Para consultas à base de dados:</p>
              <AIChat />
            </div>
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

// Add global declaration for BAI widget API
declare global {
  interface Window {
    BAI?: {
      maximizeWidget?: () => void;
    };
  }
}
