
import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { SuggestionLink } from "@/types/chatTypes";

interface SuggestionLinksProps {
  suggestionLinks: SuggestionLink[];
  language: string;
  onSuggestionClick: (query: string) => void;
}

export const SuggestionLinks: React.FC<SuggestionLinksProps> = ({ 
  suggestionLinks, 
  language, 
  onSuggestionClick 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <div className="flex items-center text-sm text-muted-foreground mr-2">
        <HelpCircle className="h-4 w-4 mr-1" />
        <span>{language === 'en' ? 'Try asking:' : 'Experimente perguntar:'}</span>
      </div>
      {suggestionLinks.map((link) => (
        <Button 
          key={link.id} 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => onSuggestionClick(link.query)}
        >
          {link.text}
        </Button>
      ))}
    </div>
  );
};
