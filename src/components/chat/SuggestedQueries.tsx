
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface SuggestedQueriesProps {
  queries: string[];
  onSelectQuery: (query: string) => void;
  disabled?: boolean;
}

export const SuggestedQueries: React.FC<SuggestedQueriesProps> = ({ 
  queries, 
  onSelectQuery,
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  
  // We'll split queries into groups of maximum 8 for better usability
  const groupSize = 8;
  const queryGroups = Array.from(
    { length: Math.ceil(queries.length / groupSize) },
    (_, i) => queries.slice(i * groupSize, (i + 1) * groupSize)
  );
  
  return (
    <div className="w-full mb-4">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            disabled={disabled}
          >
            <span>Consultas Sugeridas</span>
            <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full max-w-[100%] max-h-[24rem] overflow-y-auto" align="start">
          {queryGroups.map((group, groupIndex) => (
            <DropdownMenuGroup key={groupIndex}>
              {group.map((query, index) => (
                <DropdownMenuItem 
                  key={index}
                  className="cursor-pointer whitespace-normal"
                  onClick={() => {
                    onSelectQuery(query);
                    setOpen(false);
                  }}
                >
                  {query}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
