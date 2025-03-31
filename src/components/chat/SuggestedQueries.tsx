
import React from 'react';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold">Consultas Sugeridas:</h3>
        <p className="text-sm text-gray-500 mb-2">Estas consultas são especificamente para explorar dados e estatísticas da base de dados.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {queries.map((query, index) => (
          <Button 
            key={index} 
            variant="outline"
            className="text-left justify-start h-auto py-2 px-3 text-sm w-full overflow-hidden"
            onClick={() => onSelectQuery(query)}
            disabled={disabled}
          >
            {query}
          </Button>
        ))}
      </div>
    </div>
  );
};
