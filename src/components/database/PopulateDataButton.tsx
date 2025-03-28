
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { DatabaseIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PopulateDataButtonProps {
  query: string;
}

export const PopulateDataButton: React.FC<PopulateDataButtonProps> = ({ query }) => {
  const [isPopulating, setIsPopulating] = useState(false);
  const { toast } = useToast();
  
  const handlePopulate = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Cannot request data for an empty query.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPopulating(true);
    try {
      // Save the query to query_history table with a special flag for data population requests
      const { data, error } = await supabase.from('query_history').insert({
        query_text: query,
        was_successful: false, // Mark as unsuccessful since we're just requesting data
        language: 'en',
        error_message: "No results - data population requested",
        created_tables: null // Will be filled in by the admin when creating the tables
      });
      
      if (error) {
        console.error("Error saving query for population:", error);
        throw new Error(`Failed to save query for data population: ${error.message}`);
      }
      
      toast({
        title: "Data population requested",
        description: "Your request has been submitted. An administrator will review it and populate the database with relevant data.",
      });
      
      // Simulate a delay to give feedback to the user
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success",
        description: "Request submitted. Database update has been scheduled. Try your query again after the update is complete.",
      });
      
      console.log("Saved query for population:", query);
    } catch (error) {
      console.error("Error scheduling data population:", error);
      toast({
        title: "Error",
        description: `Failed to schedule data population: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      disabled={isPopulating}
      onClick={handlePopulate}
      className="mt-2"
    >
      <DatabaseIcon className="h-4 w-4 mr-2" />
      {isPopulating ? "Submitting..." : "Request Data for This Query"}
    </Button>
  );
};
