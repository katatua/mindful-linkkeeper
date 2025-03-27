
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';

export const DatabasePage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Database Explorer</h1>
        <Card>
          <CardHeader>
            <CardTitle>Database Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This is the database explorer interface. You can interact with the database by asking questions
              in natural language about the data.
            </p>
            <p className="font-medium">Example questions you can ask:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>What funding programs are currently open for applications?</li>
              <li>Show me funding programs with application deadlines in 2024</li>
              <li>Which regions received the most funding in 2023?</li>
              <li>List all projects with funding amounts greater than 1 million euros</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DatabasePage;
