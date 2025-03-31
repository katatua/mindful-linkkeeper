
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
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
  // Insert the chat widget script
  useEffect(() => {
    // Only add the script if it doesn't exist already
    if (!document.getElementById('ani-chat-widget-script')) {
      const script = document.createElement('script');
      script.id = 'ani-chat-widget-script';
      script.type = 'text/javascript';
      script.innerHTML = `(function(){d=document;s=d.createElement("script");s.src="https://bai.chat4b.ai/js/loadwidget.js?key=ki3ZfrxYn6G2JocE4A95sNRvwSd17hulamLPXDFbTWqeHjVBUgIy8CMzpK0OQtAuRHk5weX4fclx0KUt8rCgJO3EF1vsNGzPQWYb&assistant_key=1R5ZBwLgGOMlVSj4p6Ar0H8DX9NKhcfseU2v3CtYJ7PqaIbWkzEoyuximTQdnFSfNaIsoJczCYkjLM3He9pU42EvxVg57Aw60uBd";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`;
      
      script.onload = () => {
        console.log("BAI chat widget script loaded successfully");
        setIsScriptLoaded(true);
      };
      
      script.onerror = (e) => {
        console.error("Failed to load BAI chat widget script:", e);
      };
      
      document.getElementsByTagName('head')[0].appendChild(script);
      
      // Set a timeout to check if the script loaded after 3 seconds
      setTimeout(() => {
        if (!window.BAI) {
          console.log("BAI chat widget not detected after timeout. Attempting to reinitialize.");
          // Try to reinitialize if needed
          document.getElementsByTagName('head')[0].removeChild(script);
          document.getElementsByTagName('head')[0].appendChild(script);
        }
      }, 3000);
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  // Function to maximize the widget
  const maximizeWidget = () => {
    setIsMaximized(true);
    console.log("Attempting to maximize widget. BAI object available:", !!window.BAI);
    
    // Call the widget's maximize function if available
    if (window.BAI && typeof window.BAI.maximizeWidget === 'function') {
      console.log("Calling BAI.maximizeWidget()");
      window.BAI.maximizeWidget();
    } else {
      console.log("BAI.maximizeWidget not available, trying to find maximize button");
      // If the widget API isn't available, try to find and click the maximize button
      const widgetMaximizeButton = document.querySelector('.bai-widget-maximize-button');
      if (widgetMaximizeButton && widgetMaximizeButton instanceof HTMLElement) {
        console.log("Found maximize button, clicking it");
        widgetMaximizeButton.click();
      } else {
        console.log("Maximize button not found");
        
        // Try to find the widget iframe and interact with it
        const widgetIframe = document.querySelector('iframe[src*="bai.chat4b.ai"]');
        if (widgetIframe) {
          console.log("Found widget iframe");
          // Try to make it visible/maximized
          if (widgetIframe.parentElement) {
            widgetIframe.parentElement.style.width = '100%';
            widgetIframe.parentElement.style.height = '100%';
            widgetIframe.parentElement.style.zIndex = '9999';
            widgetIframe.parentElement.style.position = 'fixed';
            widgetIframe.parentElement.style.bottom = '0';
            widgetIframe.parentElement.style.right = '0';
            widgetIframe.parentElement.style.display = 'block';
          }
        } else {
          console.log("Widget iframe not found");
        }
      }
    }
  };

  // Remove the ANIPortal ChatBubble to avoid duplicate floating buttons
  useEffect(() => {
    return () => {
      console.log("ChatBubble component unmounted");
    };
  }, []);

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
