
import React from "react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-800">
        <div className="flex gap-1">
          <span className="animate-bounce">●</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
        </div>
      </div>
    </div>
  );
};
