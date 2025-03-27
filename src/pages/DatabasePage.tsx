
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FundingProgram {
  id: string;
  name: string;
  description?: string;
  application_deadline: string;
  end_date: string;
  total_budget?: number;
  sector_focus?: string[];
  funding_type?: string;
}

export const DatabasePage: React.FC = () => {
  const [fundingPrograms, setFundingPrograms] = useState<FundingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFundingPrograms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ani_funding_programs')
        .select('*')
        .order('application_deadline', { ascending: true });

      if (error) throw error;
      setFundingPrograms(data || []);
    } catch (error) {
      console.error('Error fetching funding programs:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundingPrograms();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Database Explorer</h1>
        
        <Tabs defaultValue="table">
          <TabsList className="mb-4">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="cards">Card View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table">
            <Card>
              <CardHeader>
                <CardTitle>Funding Programs</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading data...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Application Deadline</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Total Budget</TableHead>
                          <TableHead>Sector Focus</TableHead>
                          <TableHead>Funding Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fundingPrograms.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center">No funding programs found</TableCell>
                          </TableRow>
                        ) : (
                          fundingPrograms.map((program) => (
                            <TableRow key={program.id}>
                              <TableCell className="font-medium">{program.name}</TableCell>
                              <TableCell>{program.description || 'N/A'}</TableCell>
                              <TableCell>
                                {program.application_deadline 
                                  ? new Date(program.application_deadline).toLocaleDateString() 
                                  : 'N/A'}
                              </TableCell>
                              <TableCell>
                                {program.end_date 
                                  ? new Date(program.end_date).toLocaleDateString() 
                                  : 'N/A'}
                              </TableCell>
                              <TableCell>
                                {program.total_budget
                                  ? new Intl.NumberFormat('pt-PT', { 
                                      style: 'currency', 
                                      currency: 'EUR' 
                                    }).format(program.total_budget)
                                  : 'N/A'}
                              </TableCell>
                              <TableCell>
                                {program.sector_focus 
                                  ? program.sector_focus.join(', ') 
                                  : 'N/A'}
                              </TableCell>
                              <TableCell>{program.funding_type || 'N/A'}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                <div className="mt-4">
                  <Button onClick={fetchFundingPrograms} disabled={loading}>
                    Refresh Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <p>Loading data...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : fundingPrograms.length === 0 ? (
                <p>No funding programs found</p>
              ) : (
                fundingPrograms.map((program) => (
                  <Card key={program.id}>
                    <CardHeader>
                      <CardTitle>{program.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">{program.description}</p>
                      <div className="space-y-2">
                        <p>
                          <strong>Application Deadline:</strong>{' '}
                          {program.application_deadline
                            ? new Date(program.application_deadline).toLocaleDateString()
                            : 'N/A'}
                        </p>
                        <p>
                          <strong>Program End Date:</strong>{' '}
                          {program.end_date
                            ? new Date(program.end_date).toLocaleDateString()
                            : 'N/A'}
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
                        {program.sector_focus && (
                          <p>
                            <strong>Sector Focus:</strong>{' '}
                            {program.sector_focus.join(', ')}
                          </p>
                        )}
                        {program.funding_type && (
                          <p>
                            <strong>Funding Type:</strong>{' '}
                            {program.funding_type}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" className="mt-4 w-full">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DatabasePage;
