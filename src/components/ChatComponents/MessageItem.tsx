
import React from "react";
import { Bot, User, Info } from "lucide-react";
import { Message } from "@/types/chatTypes";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div 
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {message.role === 'system' ? (
        <div className="bg-blue-50 rounded-lg px-4 py-2 max-w-[90%] border border-blue-100 flex gap-2">
          <Info className="h-5 w-5 mt-1 text-blue-500 flex-shrink-0" />
          <div>
            <p className="whitespace-pre-wrap text-sm text-blue-700">{message.content}</p>
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
          <div className="w-full overflow-hidden">
            {message.role === 'assistant' ? (
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={materialDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
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
