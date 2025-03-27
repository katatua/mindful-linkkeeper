import React, { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, Loader2, Database, History } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryProcessor } from '@/hooks/useQueryProcessor';
import { SQLResponseDisplay } from './ChatComponents/SQLResponseDisplay';
import { saveQueryToHistory, detectPotentialTableNames, findSimilarFailedQueries } from '@/utils/queryHistory';
import { createDynamicTable } from '@/utils/dynamicTableCreator';
import { useLanguage } from "@/contexts/LanguageContext";

export default function DatabaseQuery() {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [displayResults, setDisplayResults] = useState(false);
  const [sqlStatement, setSqlStatement] = useState('');
  const [naturalLanguageResponse, setNaturalLanguageResponse] = useState('');
  const [isCreatingData, setIsCreatingData] = useState(false);
  const [createdTables, setCreatedTables] = useState<string[]>([]);
  const { toast } = useToast();
  const { processQuestion } = useQueryProcessor();

  const handleExecuteQuery = useCallback(async () => {
    if (!query.trim()) return;
    
    setIsExecuting(true);
    setDisplayResults(false);
    setCreatedTables([]);
    
    // Detect language (simple check for now)
    const isPortuguese = /[áàâãéèêíïóôõöúüç]/i.test(query.toLowerCase());
    const language = isPortuguese ? 'pt' : 'en';
    
    try {
      console.log("Processing question:", query);
      const result = await processQuestion(query, language);
      console.log("Query result:", result);
      
      // Save query to history with explicit true/false for was_successful
      const wasSuccessful = !!(result.visualizationData && result.visualizationData.length > 0 && !result.error);
      console.log("Saving query history with success status:", wasSuccessful);
      
      const savedQuery = await saveQueryToHistory(
        query, 
        language, 
        wasSuccessful,
        [], // empty array for created tables initially
        result.error // pass any error message
      );
      
      console.log("Saved query to history:", savedQuery);
      
      if (result.visualizationData && result.visualizationData.length > 0) {
        setQueryResults(result.visualizationData);
        setSqlStatement(result.sql || '');
        setNaturalLanguageResponse(result.response || '');
        setDisplayResults(true);
      } else if (result.error) {
        // If it's a data availability error, try to create missing tables
        if (result.error.includes("relation") && result.error.includes("does not exist")) {
          await handleMissingData(query, language);
        } else {
          toast({
            title: "Query Error",
            description: result.error || "Failed to execute query",
            variant: "destructive",
          });
          
          // Still save the failed query
          await saveQueryToHistory(query, language, false, [], result.error);
        }
      } else if (result.isConnectionError) {
        toast({
          title: language === 'pt' ? "Erro de Conexão" : "Connection Error",
          description: language === 'pt' 
            ? "Não foi possível conectar ao banco de dados. Usando dados offline." 
            : "Could not connect to database. Using offline data.",
          variant: "default",
        });
        // Still show whatever results we got
        if (result.visualizationData) {
          setQueryResults(result.visualizationData);
          setSqlStatement(result.sql || '');
          setNaturalLanguageResponse(result.response || '');
          setDisplayResults(true);
        }
      } else {
        toast({
          title: language === 'pt' ? "Sem Resultados" : "No Results",
          description: language === 'pt'
            ? "A consulta não retornou resultados. Deseja criar dados para este tipo de consulta?"
            : "The query did not return any results. Would you like to create data for this type of query?",
          variant: "default",
          action: (
            <Button 
              variant="outline" 
              onClick={() => handleMissingData(query, language)}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Database className="mr-2 h-4 w-4" />
              {language === 'pt' ? "Criar Dados" : "Create Data"}
            </Button>
          ),
        });
      }
    } catch (error) {
      console.error("Error processing query:", error);
      
      // Save the failed query
      await saveQueryToHistory(
        query, 
        language, 
        false, 
        [], 
        error instanceof Error ? error.message : "Failed to execute query"
      );
      
      toast({
        title: "Query Error",
        description: error instanceof Error ? error.message : "Failed to execute query",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  }, [query, toast, processQuestion]);

  const handleMissingData = async (queryText: string, language: 'en' | 'pt' = 'en') => {
    try {
      setIsCreatingData(true);
      
      // Detect potential table names from the query
      const potentialTables = detectPotentialTableNames(queryText);
      
      if (potentialTables.length === 0) {
        toast({
          title: language === 'pt' ? "Não foi possível criar dados" : "Could not create data",
          description: language === 'pt'
            ? "Não foi possível detectar que tipo de dados criar para esta consulta."
            : "Could not detect what type of data to create for this query.",
          variant: "destructive",
        });
        return;
      }
      
      // Create tables one by one
      const newCreatedTables: string[] = [];
      for (const table of potentialTables) {
        const result = await createDynamicTable(table, queryText);
        
        if (result.success && result.createdTable) {
          newCreatedTables.push(result.createdTable);
        }
      }
      
      setCreatedTables(newCreatedTables);
      
      if (newCreatedTables.length > 0) {
        // Save the query with information about created tables
        const savedQuery = await saveQueryToHistory(query, language, false, newCreatedTables);
        console.log("Saved query with created tables:", savedQuery);
        
        toast({
          title: language === 'pt' ? "Dados criados com sucesso" : "Data created successfully",
          description: language === 'pt'
            ? `Criadas ${newCreatedTables.length} tabelas. Tente executar sua consulta novamente.`
            : `Created ${newCreatedTables.length} tables. Try running your query again.`,
          variant: "default",
        });
        
        // Run the query again after a short delay
        setTimeout(() => {
          handleExecuteQuery();
        }, 1500);
      } else {
        toast({
          title: language === 'pt' ? "Falha ao criar dados" : "Failed to create data",
          description: language === 'pt'
            ? "Não foi possível criar as tabelas necessárias."
            : "Could not create the necessary tables.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating data:", error);
      toast({
        title: language === 'pt' ? "Erro ao criar dados" : "Error creating data",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreatingData(false);
    }
  };

  const resetQueryState = () => {
    setDisplayResults(false);
    setQueryResults(null);
    setSqlStatement('');
    setNaturalLanguageResponse('');
    setCreatedTables([]);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Only reset if we had results before and are changing the query
    if (displayResults) {
      resetQueryState();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isExecuting && !isCreatingData) {
      handleExecuteQuery();
    }
  };

  const renderResults = () => {
    if (!queryResults) {
      return <p>No results to display.</p>;
    }

    if (queryResults.length === 0) {
      return <p>No data found for the given query.</p>;
    }

    const headers = Object.keys(queryResults[0]);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {queryResults.map((row, index) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td key={`${index}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                    {row[header]?.toString() || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">{language === 'en' ? 'Database Query' : 'Consulta ao Banco de Dados'}</h1>
        <Link to="/portal/query-history">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            {language === 'en' ? 'View Query History' : 'Ver Histórico de Consultas'}
          </Button>
        </Link>
      </div>
      <p className="text-gray-600 mb-6">
        {language === 'en' 
          ? 'Ask questions about the ANI database in natural language.' 
          : 'Faça perguntas sobre o banco de dados ANI em linguagem natural.'}
      </p>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="flex mb-2">
            <Input
              className="flex-grow"
              placeholder="Ask a question about the data (e.g., 'What was the R&D investment in Portugal over the last 3 years?')"
              value={query}
              onChange={handleQueryChange}
              onKeyPress={handleKeyPress}
            />
            <Button 
              className="ml-2" 
              onClick={handleExecuteQuery}
              disabled={isExecuting || isCreatingData}
            >
              {isExecuting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isCreatingData ? (
                <Database className="mr-2 h-4 w-4 animate-pulse" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              {isExecuting ? "Processing..." : isCreatingData ? "Creating Data..." : "Run Query"}
            </Button>
          </div>
          
          {createdTables.length > 0 && (
            <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded">
              <p className="text-green-700 text-sm">
                {`Created tables: ${createdTables.join(', ')}. Query will run again automatically.`}
              </p>
            </div>
          )}
          
          {displayResults && queryResults && (
            <>
              <SQLResponseDisplay 
                sql={sqlStatement} 
                naturalLanguageResponse={naturalLanguageResponse} 
              />
              
              <div className="mt-6">
                <h2 className="text-lg font-medium mb-2">Results</h2>
                {renderResults()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
