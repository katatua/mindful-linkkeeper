
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  isTyping: boolean;
  language: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSendMessage,
  isTyping,
  language,
}) => {
  return (
    <div className="flex gap-2 pb-4">
      <Input
        placeholder={language === 'en' 
          ? "Ask about innovation metrics, funding, or policies..." 
          : "Pergunte sobre métricas de inovação, financiamento ou políticas..."}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSendMessage();
        }}
        className="flex-1"
      />
      <Button onClick={handleSendMessage} disabled={isTyping || !input.trim()}>
        <SendHorizonal className="h-5 w-5" />
      </Button>
    </div>
  );
};
