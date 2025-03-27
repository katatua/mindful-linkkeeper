
import React, { useRef, useEffect, useCallback, memo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";
import { TypingIndicator } from "./TypingIndicator";
import { Message } from "@/types/chatTypes";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

// Memoize the MessageItem to prevent unnecessary rerenders
const MemoizedMessageItem = memo(MessageItem);

// Memoize the entire MessageList component
export const MessageList: React.FC<MessageListProps> = memo(({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

  useEffect(() => {
    // Debounce scroll to prevent rapid updates
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [messages, isTyping, scrollToBottom]);

  return (
    <ScrollArea 
      className="flex-1 p-4 h-full overflow-y-auto" 
      ref={scrollAreaRef}
    >
      <div className="space-y-4">
        {messages.map((msg) => (
          <MemoizedMessageItem key={msg.id} message={msg} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
});

MessageList.displayName = 'MessageList';
