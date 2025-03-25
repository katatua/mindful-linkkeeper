
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain } from "lucide-react";

interface ThinkingPanelProps {
  thinking: string;
}

export const ThinkingPanel: React.FC<ThinkingPanelProps> = ({ thinking }) => {
  return (
    <div className="border-b bg-blue-50/50 h-[40%]">
      <div className="p-2 flex items-center gap-2 bg-blue-100/50 border-b">
        <Brain className="h-4 w-4 text-blue-600" />
        <h4 className="text-sm font-medium text-blue-800">AI Thinking Process</h4>
      </div>
      <ScrollArea className="h-[calc(100%-32px)] p-3">
        <div className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
          {thinking}
        </div>
      </ScrollArea>
    </div>
  );
};
