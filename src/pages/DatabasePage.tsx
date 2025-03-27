
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FundingProgram {
  id: string;
  name: string;
  description?: string;
  application_deadline: string;
  end_date: string;
  total_budget?: number;
}

export const DatabasePage: React.FC = () => {
  const [openFundingPrograms, setOpenFundingPrograms] = useState<FundingProgram[]>([]);

  const fetchOpenFundingPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('ani_funding_programs')
        .select('*')
        .gt('end_date', new Date().toISOString())
        .order('application_deadline', { ascending: true });

      if (error) throw error;
      setOpenFundingPrograms(data || []);
    } catch (error) {
      console.error('Error fetching open funding programs:', error);
    }
  };

  useEffect(() => {
    fetchOpenFundingPrograms();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Open Funding Programs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {openFundingPrograms.map((program) => (
          <Card key={program.id}>
            <CardHeader>
              <CardTitle>{program.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{program.description}</p>
              <div className="space-y-2">
                <p>
                  <strong>Application Deadline:</strong>{' '}
                  {new Date(program.application_deadline).toLocaleDateString()}
                </p>
                <p>
                  <strong>Program End Date:</strong>{' '}
                  {new Date(program.end_date).toLocaleDateString()}
                </p>
                {program.total_budget && (
                  <p>
                    <strong>Total Budget:</strong>{' '}
                    {new Intl.NumberFormat('pt-PT', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    }).format(program.total_budget)}
                  </p>
                )}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DatabasePage;
