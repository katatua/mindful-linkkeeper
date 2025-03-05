
import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, RefreshCw } from "lucide-react";
import { SuggestionLink } from "@/types/chatTypes";

interface SuggestionLinksProps {
  suggestionLinks: SuggestionLink[];
  language: string;
  onSuggestionClick: (query: string) => void;
  onRefreshSuggestions: () => void;
}

export const SuggestionLinks: React.FC<SuggestionLinksProps> = ({ 
  suggestionLinks, 
  language, 
  onSuggestionClick,
  onRefreshSuggestions
}) => {
  // If there are no suggestion links, don't render anything
  if (!suggestionLinks || suggestionLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <HelpCircle className="h-4 w-4 mr-1" />
          <span>{language === 'en' ? 'Try asking:' : 'Experimente perguntar:'}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0" 
          onClick={onRefreshSuggestions}
          title={language === 'en' ? 'More suggestions' : 'Mais sugestões'}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
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
    </div>
  );
};
