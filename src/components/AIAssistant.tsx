
import { useState, useEffect, useCallback } from "react";
import { Bot, ServerCrash } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageList } from "./ChatComponents/MessageList";
import { ChatInput } from "./ChatComponents/ChatInput";
import { SuggestionLinks } from "./ChatComponents/SuggestionLinks";
import { useChat } from "@/hooks/useChat";
import { ModelSelector } from "./ChatComponents/ModelSelector";
import { ThinkingPanel } from "./ChatComponents/ThinkingPanel";
import { testDatabaseConnection } from "@/utils/databaseDiagnostics";
import { Button } from "@/components/ui/button";
import { DatabaseStatusRetriever } from "./DatabaseStatusRetriever";
import { DatabaseStatusIndicator } from "./DatabaseStatusIndicator";

const AIAssistant = () => {
  const { language } = useLanguage();
  const [showThinking, setShowThinking] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [showDatabaseStatus, setShowDatabaseStatus] = useState(false);
  
  const {
    messages,
    input,
    setInput,
    isTyping,
    thinking,
    suggestionLinks,
    currentAIModel,
    switchAIModel,
    handleSuggestionClick,
    handleSendMessage,
    handleRefreshSuggestions,
    handleFileUpload,
    isUploading
  } = useChat(language);

  const handleTestConnection = useCallback(async () => {
    setIsTestingConnection(true);
    try {
      await testDatabaseConnection();
    } finally {
      setIsTestingConnection(false);
    }
  }, []);

  const toggleThinking = useCallback(() => {
    setShowThinking(prev => !prev);
  }, []);

  const toggleDatabaseStatus = useCallback(() => {
    setShowDatabaseStatus(prev => !prev);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
      <div className="border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-medium">{language === 'en' ? 'ANI Assistant' : 'Assistente ANI'}</h3>
        </div>
        <div className="flex items-center gap-2">
          <DatabaseStatusIndicator />
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleTestConnection}
            disabled={isTestingConnection}
            className="flex items-center gap-1 text-xs"
          >
            <ServerCrash className="h-3.5 w-3.5" />
            {language === 'en' ? 'Test Connection' : 'Testar Conexão'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleDatabaseStatus}
            className="flex items-center gap-1 text-xs"
          >
            {showDatabaseStatus ? 
              (language === 'en' ? 'Hide Database Status' : 'Ocultar Estado da Base de Dados') : 
              (language === 'en' ? 'Show Database Status' : 'Mostrar Estado da Base de Dados')}
          </Button>
          <ModelSelector 
            currentModel={currentAIModel}
            onSelectModel={switchAIModel}
          />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {thinking && (
          <div className="px-4 py-2 bg-blue-50 border-b flex justify-between items-center">
            <span className="text-sm text-blue-700">
              {language === 'en' ? 'AI is thinking...' : 'IA está pensando...'}
            </span>
            <button 
              className="text-xs text-blue-700 hover:underline"
              onClick={toggleThinking}
            >
              {showThinking ? 
                (language === 'en' ? 'Hide thinking' : 'Ocultar raciocínio') : 
                (language === 'en' ? 'Show thinking' : 'Mostrar raciocínio')}
            </button>
          </div>
        )}
        
        {thinking && showThinking && (
          <ThinkingPanel thinking={thinking} />
        )}
        
        {showDatabaseStatus && (
          <div className="px-4 py-2 border-b">
            <DatabaseStatusRetriever />
          </div>
        )}
        
        <div className={`flex-1 overflow-hidden ${thinking && showThinking ? 'h-[60%]' : 'h-full'}`}>
          <MessageList 
            messages={messages}
            isTyping={isTyping}
          />
        </div>
      </div>
      
      <div className="border-t pt-3 px-4">
        <SuggestionLinks 
          suggestionLinks={suggestionLinks}
          language={language}
          onSuggestionClick={handleSuggestionClick}
          onRefreshSuggestions={handleRefreshSuggestions}
        />
        
        <ChatInput 
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          handleFileUpload={handleFileUpload}
          isTyping={isTyping}
          isUploading={isUploading}
          language={language}
        />
      </div>
    </div>
  );
};

export { AIAssistant };
