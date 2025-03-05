
import { useState } from "react";
import { Bot } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageList } from "./ChatComponents/MessageList";
import { ChatInput } from "./ChatComponents/ChatInput";
import { SuggestionLinks } from "./ChatComponents/SuggestionLinks";
import { useChat } from "@/hooks/useChat";

const AIAssistant = () => {
  const { language } = useLanguage();
  
  const {
    messages,
    input,
    setInput,
    isTyping,
    visualizationData,
    suggestionLinks,
    handleSuggestionClick,
    handleSendMessage
  } = useChat(language);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
      <div className="border-b px-4 py-3 flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="font-medium">{language === 'en' ? 'ANI Assistant' : 'Assistente ANI'}</h3>
      </div>
      
      <MessageList 
        messages={messages}
        isTyping={isTyping}
      />
      
      <div className="border-t pt-3 px-4">
        <SuggestionLinks 
          suggestionLinks={suggestionLinks}
          language={language}
          onSuggestionClick={handleSuggestionClick}
        />
        
        <ChatInput 
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          isTyping={isTyping}
          language={language}
        />
      </div>
    </div>
  );
};

export { AIAssistant };
