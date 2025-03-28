
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
    setIsPopulating(true);
    try {
      toast({
        title: "Data population scheduled",
        description: "Request to populate data for this query has been submitted.",
      });
      
      // Save the query to a special table for data population requests
      const { error } = await supabase.from('query_history').insert({
        query_text: query,
        was_successful: false,
        language: 'en',
        error_message: "No results - data population requested",
        created_tables: null // Will be filled in by the admin when creating the tables
      });
      
      if (error) {
        console.error("Error saving query for population:", error);
        throw new Error("Failed to save query for data population");
      }
      
      // Simulate a delay to give feedback to the user
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success",
        description: "Request submitted. Database update has been scheduled. Try your query again after the update is complete.",
      });
    } catch (error) {
      console.error("Error scheduling data population:", error);
      toast({
        title: "Error",
        description: "Failed to schedule data population.",
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
