
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Database } from 'lucide-react';
import { formatDatabaseValue } from '@/utils/aiUtils';

interface QueryResultsProps {
  results: any[] | null;
  sqlQuery?: string;
}

export const QueryResults: React.FC<QueryResultsProps> = ({
  results,
  sqlQuery
}) => {
  if (!results || results.length === 0) {
    return <p className="text-gray-500 italic">Nenhum resultado encontrado</p>;
  }

  const columns = Object.keys(results[0]);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.slice(0, 10).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map(column => (
                  <TableCell 
                    key={`${rowIndex}-${column}`}
                    data-column={column}
                    data-category={row.category || ''}
                  >
                    {formatDatabaseValue(row[column], column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {results.length > 10 && (
          <div className="text-xs text-gray-500 p-2 text-center border-t">
            Mostrando 10 de {results.length} resultados
          </div>
        )}
      </div>
      
      {sqlQuery && (
        <div className="pt-2">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-500 mb-1">
            <Database className="h-4 w-4" />
            <span>Consulta SQL:</span>
          </div>
          <pre className="bg-gray-800 text-gray-100 p-2 rounded-md text-sm overflow-x-auto">
            {sqlQuery}
          </pre>
        </div>
      )}
    </div>
  );
};
