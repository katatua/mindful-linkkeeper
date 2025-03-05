
import React from "react";
import { Bot, User, Info } from "lucide-react";
import { Message } from "@/types/chatTypes";

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  // Clean up any SQL queries from the message content
  const cleanContent = message.content.replace(/\n\*\*Consulta executada:\*\*\n```sql[\s\S]*?```/g, '');
  
  return (
    <div 
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {message.role === 'system' ? (
        <div className="bg-blue-50 rounded-lg px-4 py-2 max-w-[90%] border border-blue-100 flex gap-2">
          <Info className="h-5 w-5 mt-1 text-blue-500 flex-shrink-0" />
          <div>
            <p className="whitespace-pre-wrap text-sm text-blue-700">{cleanContent}</p>
          </div>
        </div>
      ) : (
        <div 
          className={`rounded-lg px-4 py-2 max-w-[80%] flex gap-2 ${
            message.role === 'user' 
              ? 'bg-primary text-white ml-auto' 
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {message.role === 'assistant' && (
            <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
          )}
          <div>
            <p className="whitespace-pre-wrap">{cleanContent}</p>
            <p className="text-xs opacity-70 mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          {message.role === 'user' && (
            <User className="h-5 w-5 mt-1 flex-shrink-0" />
          )}
        </div>
      )}
    </div>
  );
};
