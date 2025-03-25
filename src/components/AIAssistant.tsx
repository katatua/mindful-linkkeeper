
import { useState } from "react";
import { Bot } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageList } from "./ChatComponents/MessageList";
import { ChatInput } from "./ChatComponents/ChatInput";
import { SuggestionLinks } from "./ChatComponents/SuggestionLinks";
import { useChat } from "@/hooks/useChat";
import { ModelSelector } from "./ChatComponents/ModelSelector";
import { ThinkingPanel } from "./ChatComponents/ThinkingPanel";

const AIAssistant = () => {
  const { language } = useLanguage();
  const [showThinking, setShowThinking] = useState(false);
  
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

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
      <div className="border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-medium">{language === 'en' ? 'ANI Assistant' : 'Assistente ANI'}</h3>
        </div>
        <ModelSelector 
          currentModel={currentAIModel}
          onSelectModel={switchAIModel}
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {thinking && (
          <div className="px-4 py-2 bg-blue-50 border-b flex justify-between items-center">
            <span className="text-sm text-blue-700">
              {language === 'en' ? 'AI is thinking...' : 'IA está pensando...'}
            </span>
            <button 
              className="text-xs text-blue-700 hover:underline"
              onClick={() => setShowThinking(!showThinking)}
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
